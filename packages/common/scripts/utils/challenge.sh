#!/usr/bin/env bash

get_challenges_github_org_name() {
  local _branch_name="${1}"

  local _github_org_name
  if is_production_build "${_branch_name}"; then
    _github_org_name="${github_challenges_org_name_prod}"
  else
    _github_org_name="${github_challenges_org_name_dev}"
  fi

  echo -n "${_github_org_name}"
}

get_build_challenge_guid_bash() {
  # ##############################################################################
  : << COMMENT

  After create_challenge_configuration_files() is called, we should only read configuration values from the artifact files (i.e., dont pull configurations from files that were used to generate the artifact files).  However, there are certain contexts in which we don't know which configuration file to leverage.  For cases where we only have the challenge_environment_dir_path available, we can use this function to fetch the correct challenge_guid_bash.  Once we have challenge_guid_bash, we can fetch configurations from the artifact files that were generated by create_configurations.  See set_challenge_metadata_value/get_challenge_metadata_value

COMMENT
  # ##############################################################################

  local challenge_environment_dir_path="${1}"

  # Fetch value from the "source of truth" for challenge_guid_bash
  get_json_value "${key_build_args}.${key_challenge_guid_bash}" "${challenge_environment_dir_path}/${build_time_devcontainer_file_name}"
}

get_container_challenge_guid_bash() {
  get_container_state_value "${key_challenge_guid_bash}"
}

get_challenge_metadata_value() {
  # Fetch value from challenge metadata file that's declared in local environment
  # For fetching challenge metadata from Github, see get_remote_devcontainer_metadata_value
  local key="${1}"
  local challenge_guid_bash="${2}"
  get_json_value ".${key}" "$(get_challenge_metadata_file_path "${challenge_guid_bash}")"
}

set_container_state_value() {
  # ##############################################################################
  : << COMMENT

  PURPOSE:  Set container configuration values that i) are set from within the container (e.g., has_bootstrapped) ii) allow the correct challenge metadata file to be located (e.g., challenge_guid_bash).
    + From within the container, we dont want to mutate the challenge metadata file as the blockbash repo can be bind mounted into the container.

COMMENT
  # ##############################################################################

  # Any container configuration values (that are resolved at run time)
  # need to be set via this method.  Add
  local key="${1}"
  local value="${2}"

  set_json_value "${key}" "${value}" "${container_state_file_path}"
}

get_container_state_value() {
  local key="${1}"

  get_json_value ".${key}" "${container_state_file_path}"
}

get_remote_devcontainer_metadata_value() {
  # Fetch value from challenge metadata section that was fetched from challenge repo (in Github)
  # Within Github, all configurations are placed within one file (.devcontainer.json).
  # In this case, certain challenge metadata is found within the '.customizations.blockbash.' namespace
  local key="${1}"
  get_json_value ".customizations.blockbash.${key}" "${container_remote_config_file_path}"
}

get_challenge_image_name_short() {
  local challenge_guid_bash="${1}"
  local challenge_release="${2}"
  echo "${challenge_guid_bash}-${challenge_release}"
}

get_challenge_vscode_url() {
  local challenge_repo_name_full="${1}"

  local url_prefix="https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url"
  local url_query_value
  if is_github_build; then
    url_query_value="${github_url}/${challenge_repo_name_full}"
  else
    url_query_value="${git_user}@${github_primary_domain}:${challenge_repo_name_full}.git"
  fi
  echo -n "${url_prefix}=${url_query_value}"
}

get_challenge_codespaces_url() {
  local challenge_repo_name_full="${1}"

  echo -n "${github_url}/codespaces/new/${challenge_repo_name_full}?quickstart=1"
}

get_challenge_metadata_file_path() {
  # Fetches the challenge metadata for a SINGLE challenge
  # For all configs, see: build_artifacts_challenges_metadata_file_path
  local challenge_guid_bash="${1}"

  local challenge_specific_artifact_dir_path
  challenge_specific_artifact_dir_path="$(get_challenge_specific_artifact_dir_path "${challenge_guid_bash}")"

  echo -n "${challenge_specific_artifact_dir_path}/metadata.json"
}

get_challenge_raw_repo_url() {
  local challenge_repo_name_full="${1}"
  # We create a challenge repo for every branch.  Thus, the branch is always main (see below)
  # Ex: https://raw.githubusercontent.com/blockbash-challenges-dev/reentrancy-fundamentals-attack-prompt-develop/main/.devcontainer.json
  echo -n "${github_raw_content_url}/${challenge_repo_name_full}/${production_branch}"
}

create_build_time_devcontainer_artifact_file() {
  local challenge_environment_dir_path="${1}"
  local artifact_file_path="${2}"

  local build_time_devcontainer_base_file_path
  build_time_devcontainer_base_file_path="$(mktemp)"

  # build_build_time_devcontainer_base_template_file_path: Base devcontainer configuration that is ultimately merged into all challenge-specific devcontainers.
  jq \
    "${jq_common_flags[@]}" \
    --null-input \
    --arg "container_lab_core_compiler_file_path" "${container_lab_core_compiler_file_path}" \
    --from-file "${build_build_time_devcontainer_base_template_file_path}" > "${build_time_devcontainer_base_file_path}"

  # build_time_devcontainer_override_file_path: Challenge specific devcontainers.  When merging logic is applied, the configurations in this file will take precedence over build_time_devcontainer_base_file_path values.
  local build_time_devcontainer_override_file_path="${challenge_environment_dir_path}/${build_time_devcontainer_file_name}"

  merge_json_files "${build_time_devcontainer_base_file_path}" "${build_time_devcontainer_override_file_path}" "${artifact_file_path}"

  rm -rf "${build_time_devcontainer_base_file_path}"
}

create_challenge_configuration_files() {
  # ##############################################################################
  : << COMMENT

  PURPOSE: Create configurations that power the challenge environment.  The artifacts are listed below.
    + "build-time" devcontainer configurations: Files that power the devcontainer build process within create-challenge-enviornments.sh
    + "run-time" devcontainer configurations: Files that are fetched from github and are leveraged to bootstrap the challenge environment.
    + challenge metadata file(s): Challenge configurations that are shared across the host workstation, CI, container-based challenge environment.  These settings also can be referenced within typescript.

COMMENT
  # ##############################################################################

  local branch_name="${1}"

  mkdir -p "${build_artifacts_challenge_specific_dir_path}"
  delete_nested_directories "${build_artifacts_challenge_specific_dir_path}"

  local challenge_environment_dir_path
  for challenge_environment_dir_path in "${build_challenge_environments_dir_path}"/*/; do

    local challenge_guid_bash
    challenge_guid_bash="$(get_build_challenge_guid_bash "${challenge_environment_dir_path}")"

    local devcontainer_build_time_artifact_file_path
    devcontainer_build_time_artifact_file_path="$(get_devcontainer_artifact_file_path "${challenge_guid_bash}" "${build_time_prefix}")"

    create_build_time_devcontainer_artifact_file "${challenge_environment_dir_path}" "${devcontainer_build_time_artifact_file_path}"

    create_challenge_metadata_file "${branch_name}" "${devcontainer_build_time_artifact_file_path}"

    if is_github_build; then
      create_run_time_devcontainer_artifact_file "${challenge_guid_bash}" "${false}"
    else
      create_run_time_devcontainer_artifact_file "${challenge_guid_bash}" "${true}"
    fi

  done

  shopt -s globstar
  # Create a json array of json objects
  jq "${jq_common_flags[@]}" --slurp '.' "${build_artifacts_challenge_specific_dir_path}"/**/metadata.json > "${build_artifacts_challenges_metadata_file_path}"
  log_debug "Generated merged challenge metadata file..."
  log_file_contents "${build_artifacts_challenges_metadata_file_path}" "${debug_level}"
}

get_challenge_repo_name_full() {
  # ##############################################################################
  : << COMMENT

  PURPOSE: Fetch the Github repo that corresponds to the challenge.
  + We are ultimately generating a link that the learner clicks on: https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/blockbash-challenges-dev/reentrancy-fundamentals-attack-prompt
  + To generate this link, we need to create a repo that ONLY contains the challenge's .devcontainer.json.  If we house multiple devcontainer files within the repo, the link clicking experience doesn't work.
  + This link doesn't currently have the ability to pass in branch information as a query string parameter.  So we make a new repo for every branch in non-prod.

COMMENT
  # ##############################################################################

  local challenge_guid_bash="${1}"
  local branch_name="${2}"

  local challenge_guid_bash challenges_github_org_name

  challenges_github_org_name=$(get_challenges_github_org_name "${branch_name}")

  local base_repo_name_full
  base_repo_name_full="${challenges_github_org_name}/${challenge_guid_bash}"

  if is_production_build "${branch_name}"; then
    echo -n "${base_repo_name_full}"
  else
    echo -n "${base_repo_name_full}-${branch_name}"
  fi
}

has_challenge_bootstrapped_before() {
  local has_bootstrapped
  has_bootstrapped=$(get_container_state_value "${key_has_bootstrapped}")

  [[ ${has_bootstrapped} == "${true}" ]]
}

get_challenge_specific_artifact_dir_path() {
  local challenge_guid_bash="${1}"
  echo -n "${build_artifacts_challenge_specific_dir_path}/${challenge_guid_bash}"
}

create_challenge_metadata_file() {
  local branch_name="${1}"
  local devcontainer_build_time_artifact_file_path="${2}"

  # START - Get appropriate context for metadata file
  local container_challenge_open_file_paths
  container_challenge_open_file_paths="$(get_json_value "${key_build_args}.${key_container_challenge_open_file_paths}" "${devcontainer_build_time_artifact_file_path}")"

  local challenge_guid_bash
  challenge_guid_bash="$(get_json_value "${key_build_args}.${key_challenge_guid_bash}" "${devcontainer_build_time_artifact_file_path}")"

  local challenge_guid_typescript
  challenge_guid_typescript="$(get_json_value "${key_build_args}.${key_challenge_guid_typescript}" "${devcontainer_build_time_artifact_file_path}")"

  local challenge_contracts_dir_name
  challenge_contracts_dir_name="$(get_json_value "${key_build_args}.${key_challenge_contracts_dir_name}" "${devcontainer_build_time_artifact_file_path}")"

  local challenge_repo_name_full
  challenge_repo_name_full="$(get_challenge_repo_name_full "${challenge_guid_bash}" "${branch_name}")"

  local challenge_release
  challenge_release="$(get_json_value "${key_build_args}.${key_challenge_release}" "${devcontainer_build_time_artifact_file_path}")"

  local challenge_codespace_url
  challenge_codespace_url="$(get_challenge_codespaces_url "${challenge_repo_name_full}")"

  local image_name_short
  image_name_short="$(get_challenge_image_name_short "${challenge_guid_bash}" "${challenge_release}")"

  local image_name_with_branch_full
  image_name_with_branch_full=$(get_image_name_with_branch_full "${branch_name}" "${image_name_short}")

  local container_name
  container_name="$(get_container_name "${docker_container_namespace_devcontainer}" "${image_name_short}" "${branch_name}")"

  local metadata_file_path
  metadata_file_path="$(get_challenge_metadata_file_path "${challenge_guid_bash}")"
  # END - Get appropriate context for metadata file

  # SETTERS
  set_json_value "${key_remote_devcontainer_file_url}" "$(get_challenge_raw_repo_url "${challenge_repo_name_full}")/${devcontainer_hidden_file_name}" "${metadata_file_path}"
  set_json_value "${key_challenge_guid_bash}" "${challenge_guid_bash}" "${metadata_file_path}"
  set_json_value "${key_image_name_short}" "${image_name_short}" "${metadata_file_path}"
  set_json_value "${key_image_name_with_branch_full}" "${image_name_with_branch_full}" "${metadata_file_path}"
  set_json_value "${key_challenge_guid_typescript}" "${challenge_guid_typescript}" "${metadata_file_path}"
  set_json_value "${key_challenge_release}" "${challenge_release}" "${metadata_file_path}"
  set_json_value "${key_challenge_repo_name_full}" "${challenge_repo_name_full}" "${metadata_file_path}"
  set_json_value "${key_codespace_url}" "${challenge_codespace_url}" "${metadata_file_path}"
  set_json_value "${key_container_challenge_contracts_dir_path}" "${container_lab_core_contracts_dir_path}/${challenge_contracts_dir_name}" "${metadata_file_path}"
  set_json_value "${key_container_name}" "${container_name}" "${metadata_file_path}"
  set_json_value "${key_container_challenge_open_file_paths}" "${container_challenge_open_file_paths}" "${metadata_file_path}"
  set_json_value "${key_vscode_url}" "$(get_challenge_vscode_url "${challenge_repo_name_full}")" "${metadata_file_path}"

  log_debug "Generated individual challenge metadata file..."
  log_file_contents "${metadata_file_path}" "${debug_level}"
}

get_devcontainer_artifact_file_path() {
  # The "artifact" is the FINAL version of the build-time or run-time devcontainer configuration
  local challenge_guid_bash="${1}"
  local variant="${2}" # build-time/run-time

  local challenge_specific_artifact_dir_path
  challenge_specific_artifact_dir_path="$(get_challenge_specific_artifact_dir_path "${challenge_guid_bash}")"
  if [[ ${variant} == "${build_time_prefix}" ]]; then
    echo -n "${challenge_specific_artifact_dir_path}/${build_time_devcontainer_file_name}"
  elif [[ ${variant} == "${run_time_prefix}" ]]; then
    echo -n "${challenge_specific_artifact_dir_path}/${run_time_devcontainer_file_name}"
  else
    die "Variant (${variant}) is not correct"
  fi
}

create_vscode_tasks_file() {
  jq \
    --null-input \
    "${jq_common_flags[@]}" \
    --arg container_lab_shell_scripts_hooks_dir_path "${container_lab_shell_scripts_hooks_dir_path}" \
    --from-file "${lab_shell_config_vscode_dir_path}/tasks.template.json" > "${build_artifacts_challenge_tasks_file_path}"
}

create_run_time_devcontainer_artifact_file() {
  local challenge_guid_bash="${1}"
  local is_local="${2}"

  local run_time_devcontainer_artifact_file_path
  run_time_devcontainer_artifact_file_path="$(get_devcontainer_artifact_file_path "${challenge_guid_bash}" "${run_time_prefix}")"

  local image_name_with_branch_full
  image_name_with_branch_full="$(get_challenge_metadata_value "${key_image_name_with_branch_full}" "${challenge_guid_bash}")"

  if [[ ${is_local} == "${true}" ]]; then
    local initialize_command=""
    local bind_source="${blockbash_root_dir_path}"
    local is_rm="${true}"
  else
    # Attempt to pull in latest docker image for a given release.  This will naturally pull in container package upgrades, etc.
    # For logic related to checking if a new release is available, see check-updates.sh.
    # We don't need to do this logic in the local environment as the latest image should
    # naturally be available.
    # https://github.com/microsoft/vscode-remote-release/issues/7104
    # https://github.com/alibaba/GraphScope/pull/2873/files
    local initialize_command="docker pull ${image_name_with_branch_full} || true"
    local bind_source="${null}"
    local is_rm="${false}"
  fi

  create_parent_directories_for_file "${run_time_devcontainer_artifact_file_path}"

  local container_name
  container_name="$(get_challenge_metadata_value "${key_container_name}" "${challenge_guid_bash}")"

  local challenge_release
  challenge_release="$(get_challenge_metadata_value "${key_challenge_release}" "${challenge_guid_bash}")"

  local image_name_with_branch_full
  image_name_with_branch_full="$(get_challenge_metadata_value "${key_image_name_with_branch_full}" "${challenge_guid_bash}")"

  local docker_run_args_json
  docker_run_args_json=$(get_shared_challenge_docker_run_flags "${container_name}" "${bind_source}" "json" "${is_rm}")

  rm -rf "${run_time_devcontainer_artifact_file_path}"
  jq \
    "${jq_common_flags[@]}" \
    --null-input \
    --argjson docker_run_args "${docker_run_args_json}" \
    --argjson "${key_challenge_release}" "${challenge_release}" \
    --arg "${key_image_name_with_branch_full}" "${image_name_with_branch_full}" \
    --arg "${key_initialize_command}" "${initialize_command}" \
    --from-file "${build_run_time_devcontainer_template_file_path}" > "${run_time_devcontainer_artifact_file_path}"

  if [[ ${bb_current_challenge_guid_bash} == "${challenge_guid_bash}" ]]; then
    log_info "Creating local devcontainer file for ${bb_current_challenge_guid_bash}"
    create_parent_directories_for_file "${run_time_vscode_devcontainer_file_path}"
    # Create local variant for testing
    cp "${run_time_devcontainer_artifact_file_path}" "${run_time_vscode_devcontainer_file_path}"
  fi
  log_file_contents "${run_time_devcontainer_artifact_file_path}" "${debug_level}"
}
