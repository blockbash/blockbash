#!/usr/bin/env bash

die_on_error="true"

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="false" --die_on_error="${die_on_error}"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --branch_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      branch_name="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --lab_environment_dir_path=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      lab_environment_dir_path="${flag_value}"
      ;;
    --current_arch=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      # shellcheck disable=SC2034
      validate_array_value "${flag_name}" "${flag_value}" runner_architectures
      current_arch="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --is_scheduled_execution=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      is_scheduled_execution="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --should_publish=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      should_publish="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --should_publish_images=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      should_publish_images="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --should_user_environment_die_on_error=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      should_user_environment_die_on_error="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --target_arch=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" docker_architectures
      target_arch="${flag_value}"
      ;;
    *)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      die "${flag_name} is not a valid argument"
      ;;
  esac
  if [[ -z ${flag_value} ]]; then
    die "${flag_name} does not have a value"
  else
    unset argument_name flag_value flag_name
  fi
  shift
done

main() {
  log_info "Executing for matrix permutation..."
  log_info "lab_environment_dir_path: ${lab_environment_dir_path}"
  log_info "target_arch that we are building for: ${target_arch}"

  local matrix_guid="${target_arch}-${lab_environment_dir_path}"

  local lab_guid_bash
  lab_guid_bash="$(get_build_lab_guid_bash "${lab_environment_dir_path}")"

  local lab_release
  lab_release="$(get_lab_metadata_value "${key_lab_release}" "${lab_guid_bash}")"

  local image_name_short
  image_name_short="$(get_lab_metadata_value "${key_image_name_short}" "${lab_guid_bash}")"

  local lab_repo_name_full
  lab_repo_name_full="$(get_lab_metadata_value "${key_lab_repo_name_full}" "${lab_guid_bash}")"

  # Install devcontainer cli and make it accessible via PATH
  pnpm_install "@blockbash/build..." "${shared_pnpm_store_dir_path}"
  update_path "${build_bin_dir_path}"

  local image_name_with_branch_arch_full
  image_name_with_branch_arch_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${target_arch}" "${false}")"

  if is_secret_set "${secret_internal_github_token_name}"; then
    docker_login "${github_primary_org_name_prod}" "${die_on_error}"
  fi

  # ##############################################################################
  : << COMMENT
  BUILD FLAGS:
  - BUILDX_NO_DEFAULT_ATTESTATIONS=1 sets --provenance=false within the docker build
  - If provenance == true then
    - the image sha ALWAYS changes (even if 100% cache hit).
    - This is problematic for caching actions that are based on the image SHA
    - Multi-arch images are NOT rendered correctly in the Github UI.
      https://github.com/docker/build-push-action/issues/820
      TODO: When there is a way to work around ^, set --provenance == true
  - cache-from: If the cache image is NOT accessible, the build will NOT fail

  BUILD ARGS:
  - BLOCKBASH_*: Always need to pass all BLOCKBASH_* environment variables.  See 'Environment Variables' (in README.md) for more context.


COMMENT
  # ##############################################################################

  local image_name_with_branch_full
  image_name_with_branch_full="$(get_lab_metadata_value "${key_image_name_with_branch_full}" "${lab_guid_bash}")"

  # BUILDKIT_PROGRESS/BUILDX_NO_DEFAULT_ATTESTATIONS: Set configurations for the underlying buildkit cli that devcontainer leverages.
  # bashsupport disable=BP2001
  export BUILDKIT_PROGRESS=plain
  # bashsupport disable=BP2001
  export BUILDX_NO_DEFAULT_ATTESTATIONS=1

  # --cache-to: The devcontainer cli automatically sets BUILDKIT_INLINE_CACHE=1.  Unfortunately, this is not ideal for caching within multi stage builds so we don't set the --cache-to flag
  # --cache-from: Given the --cache-to issue, we need to create the cache images within create-base-images.  We then reference them within the --cache-from (below).
  local build_flags
  build_flags=(
    --workspace-folder="$(get_lab_specific_artifact_dir_path "${lab_guid_bash}")"
    --config="$(get_devcontainer_artifact_file_path "${lab_guid_bash}" "${build_time_prefix}")"
    --image-name="${image_name_with_branch_arch_full}"
    --cache-from "$(get_cache_flag "${production_branch}" "${docker_lab_base_image_name_short}" "${target_arch}" "${docker_cache_from}")"
    --cache-from "$(get_cache_flag "${branch_name}" "${docker_lab_base_image_name_short}" "${target_arch}" "${docker_cache_from}")"
    --platform="${target_arch}"
  )

  if [[ ${is_scheduled_execution} == "${true}" ]]; then
    log_info "Adding cache busting flag"
    build_flags+=("--no-cache")
  fi

  initialize_buildx_builder

  log_info "Invoking 'devcontainer build' with flags..."
  log_info "${build_flags[*]}"

  # Dont template these values into build-time.devcontainer.base.template.json as we want to allow certain values to be generated from create-lab-environments.sh.

  # BLOCKBASH_IS_LOCAL: Set via job-init
  # shellcheck disable=SC2154
  BLOCKBASH_IS_LOCAL="${BLOCKBASH_IS_LOCAL}" \
    BLOCKBASH_LOG_LEVEL="$(get_current_log_level)" \
    branch_name=${branch_name} \
    build_devcontainer_dir_path=${build_devcontainer_dir_path} \
    build_dir_path=${build_dir_path} \
    build_global_config_file_path=${build_script_global_config_file_path} \
    build_scripts_dir_path=${build_scripts_dir_path} \
    build_scripts_workflow_steps_dir_path=${build_scripts_workflow_steps_dir_path} \
    build_templates_dir_path=${build_templates_dir_path} \
    lab_release=${lab_release} \
    lab_repo_name_full=${lab_repo_name_full} \
    common_config_dir_path=${common_config_dir_path} \
    common_scripts_dir_path=${common_scripts_dir_path} \
    common_scripts_init_dir_path=${common_scripts_init_dir_path} \
    container_repo_dir_path=${container_repo_dir_path} \
    current_arch=${current_arch} \
    eslint_dir_path=${eslint_dir_path} \
    is_scheduled_execution=${is_scheduled_execution} \
    lab_core_contracts_dir_path=${lab_core_contracts_dir_path} \
    lab_core_contracts_backup_dir_path=${lab_core_contracts_backup_dir_path} \
    lab_core_dir_path=${lab_core_dir_path} \
    lab_shell_config_dir_path=${lab_shell_config_dir_path} \
    lab_shell_dir_path=${lab_shell_dir_path} \
    lab_core_compilers_solcjs_symlink_file_path="${lab_core_compilers_solcjs_symlink_file_path}" \
    container_svm_dir_path="${container_svm_dir_path}" \
    lab_shell_scripts_aliases_dir_path=${lab_shell_scripts_aliases_dir_path} \
    lab_shell_scripts_dir_path="${lab_shell_scripts_dir_path}" \
    lab_shell_scripts_hooks_dir_path=${lab_shell_scripts_hooks_dir_path} \
    packages_dir_path="${packages_dir_path}" \
    build_security_tools_debs_dir_path="${build_security_tools_debs_dir_path}" \
    shared_pnpm_root_dir_path="${shared_pnpm_root_dir_path}" \
    shared_pnpm_store_dir_path="${shared_pnpm_store_dir_path}" \
    should_user_environment_die_on_error="${should_user_environment_die_on_error}" \
    website_dir_path=${website_dir_path} \
    utils_local_config_dir_path="${utils_local_config_dir_path}" \
    devcontainer build "${build_flags[@]}"

  create_matrix_docker_outputs "${key_create_lab_images_job}" "${image_name_with_branch_full}" "${branch_name}" "${image_name_short}" "${target_arch}"
  create_github_workflow_outputs "${branch_name}" "${image_name_short}" "${target_arch}" "${lab_repo_name_full}" "${matrix_guid}"
  override_multi_arch_image_name "${current_arch}" "${target_arch}" "${branch_name}" "${image_name_short}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
