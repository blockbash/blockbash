#!/usr/bin/env bash

get_shared_challenge_docker_run_flags() {
  local container_name="${1}"
  local blockbash_repo_bind_dir_path="${2}" # can pass "null" to omit mount flags
  local format="${3}"                       # cli/json
  local is_rm="${4}"

  local flags
  flags=(
    "--name=${container_name}"
  )

  if [[ ${blockbash_repo_bind_dir_path} != "${null}" ]]; then
    flags+=(
      "--mount=type=bind,source=${blockbash_repo_bind_dir_path},readonly,target=${container_repo_dir_path}"
      "--mount=type=bind,source=${logs_dir_path},target=${container_logs_dir_path}"
      # Allow certain paths to be writeable
      "--mount=type=volume,target=${container_repo_node_modules_dir_path}"
      "--mount=type=volume,target=${container_lab_core_artifacts_dir_path}"
    )
  fi

  if [[ ${is_rm} == "${true}" ]]; then
    flags+=(
      "--rm"
    )
  fi

  if [[ ${format} == "json" ]]; then
    get_json_array_from_bash_array flags
  elif [[ ${format} == "cli" ]]; then
    echo "${flags[*]}"
  else
    die "Undefined flag value for --format: ${format}"
  fi
}

is_correct_arch_for_underlying_host() {
  # current_arch: Github Runner arch format. See RUNNER_ARCH for accepted values (https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)
  local current_arch="${1}" # X86/X64/ARM/ARM64
  # target_arch: docker arch format
  local target_arch="${2}" # linux/amd64 or linux/arm64

  case "${target_arch}" in
    "${docker_arch_linux_arm64_name}")
      # ,, will lowercase the variable value
      [[ ${current_arch,,} == "${runner_arch_arm64_name,,}" ]]
      ;;
    "${docker_arch_linux_x64_name}")
      [[ ${current_arch,,} == "${runner_arch_x64_name,,}" ]]
      ;;
    *)
      die "Unsupported target_arch: ${target_arch}"
      ;;
  esac
}

get_image_name_with_branch_full() {
  # This is the final multi-arch docker image that is referenced in the learner's environment.
  local branch_name="${1}"
  local image_name_short="${2}"

  local registry
  registry="$(get_image_registry "${image_name_short}")"

  echo -n "${registry}:${branch_name}"
}

get_image_registry() {
  local image_name_short="${1}"

  local github_org_name
  # See 'Components: GitHub' within README.md
  if is_github_build; then
    github_org_name="${github_primary_org_name_prod}"
  else
    github_org_name="${github_challenges_org_name_dev}"
  fi
  echo -n "${github_image_registry_domain}/${github_org_name}/${image_name_short}"
}

get_image_name_with_sha_full() {
  local digest="${1}"
  local image_name_short="${2}"

  local registry
  registry="$(get_image_registry "${image_name_short}")"

  echo -n "${registry}@${digest}"
}

get_image_name_with_branch_arch_full() {
  local branch_name="${1}"
  local image_name_short="${2}"
  local arch="${3}"
  local is_cache="${4}" # true/false

  arch=$(echo -n "${arch}" | tr "/" -)

  local image_name_with_branch_full
  image_name_with_branch_full="$(get_image_name_with_branch_full "${branch_name}" "${image_name_short}")"

  local image_name_with_branch_arch_full="${image_name_with_branch_full}-${arch}"

  if [[ ${is_cache} == "${true}" ]]; then
    echo -n "${image_name_with_branch_arch_full}-cache"
  else
    echo -n "${image_name_with_branch_arch_full}"
  fi
}

# This logic should correspond to create-multi-arch-images.sh/create-matrix-outputs
create_matrix_docker_outputs() {

  # ##############################################################################
  : << COMMENT

  create-base-images and create-challenge-environments:
    - Jobs have a matrix configuration
    - These matrix jobs create a container image for a particular target_arch.

  Workflow:
    - create-base-images/create-challenge-environments -> create-matrix-outputs -> create-multi-arch-images
    - create-multi-arch-images will leverage the artifacts (generated here) to create a multi architecture container image.

  image_name_with_branch_full:
    - Will (ultimately) be the multi-arch image name that is generated in the create-multi-arch-images job.
    - Before this multi-arch image is generated, we need the platform-specific image tags that are generated in the create-base-images and create-challenge-environment jobs (i.e., matrix jobs). Each matrix job will persist the platform specific image information into a directory.  This directory will correspond to image_name_with_branch_full. As the matrix jobs are effectively sharing a filesystem (via an Github Action Artifact), we use a directory (for each multi-arch image) so there aren't any filesystem conflicts. In the create-multi-arch-images job, each directory (with its metadata) is leveraged to create a multi arch image

  Future Work:
    - TODO: Change this once outputs can be referenced from matrix jobs
  https://github.com/orgs/community/discussions/17245

COMMENT
  # ##############################################################################

  # job_name: Name of job that is creating the output (e.g., create-base-images/create-challenge-images). Results will be grouped via the job_name.
  local job_name="${1}" #
  local image_name_with_branch_full="${2}"
  local branch_name="${3}"
  local image_name_short="${4}"
  local target_arch="${5}"

  local image_metadata_file_path
  # image_metadata_file_path: /blockbash/apps/build/artifacts/matrix-outputs/raw/INSERT_JOB_NAME/549070b36b019c2edb288abb5b585176e69c7cd7/7d92b2567dd0575938fc9f87e2b18139944fc84f.json
  image_metadata_file_path="$(get_matrix_image_metadata_file_path "${job_name}" "${image_name_with_branch_full}")"

  # Set multi-arch image name
  set_json_value "${key_image_name_with_branch_full}" "${image_name_with_branch_full}" "${image_metadata_file_path}"

  # Set platform-specific image name
  local image_name_with_branch_arch_full
  image_name_with_branch_arch_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${target_arch}" "${false}")"
  # set_json_value: Leverage an array so we can eventually merge array values (across matrix jobs) into a single array.
  set_json_value "${key_image_name_with_branch_arch_full}" "[\"${image_name_with_branch_arch_full}\"]" "${image_metadata_file_path}" "${true}"

  log_info "Generated image metadata file..."
  log_file_contents "${image_metadata_file_path}" "${info_level}"
}

create_github_workflow_outputs() {
  local branch_name="${1}"
  local image_name_short="${2}"
  local target_arch="${3}"
  local challenge_repo_name_full="${4}"
  local matrix_guid="${5}"

  local image_name_with_branch_arch_full image_name_with_sha_full
  image_name_with_branch_arch_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${target_arch}" "${false}")"

  set_build_output "${key_image_name_with_branch_arch_full}" "${image_name_with_branch_arch_full}"

  local digest
  digest=$(docker images --digests --no-trunc --quiet "${image_name_with_branch_arch_full}")

  image_name_with_sha_full="$(get_image_name_with_sha_full "${digest}" "${image_name_short}")"

  set_build_output "image_name_with_sha_full" "${image_name_with_sha_full}"

  local image_name_with_branch_full
  image_name_with_branch_full=$(get_image_name_with_branch_full "${branch_name}" "${image_name_short}")

  set_build_output "${key_image_name_with_branch_full}" "${image_name_with_branch_full}"
  set_build_output "${key_challenge_repo_name_full}" "${challenge_repo_name_full}"

  local hashed_matrix_guid
  hashed_matrix_guid="$(get_input_hash "${matrix_guid}")"
  log_info "Generating 'hashed_matrix_guid' (${hashed_matrix_guid}) from matrix_guid (${matrix_guid})"

  set_build_output "hashed_matrix_guid" "${hashed_matrix_guid}"
}

initialize_buildx_builder() {
  if docker buildx inspect --bootstrap "${docker_builder_name}" > /dev/null 2>&1 || true; then
    log_info "Docker builder ${docker_builder_name} isn't available.  Attempting to create..."
    docker buildx create --bootstrap --driver docker-container --name "${docker_builder_name}"
  fi
  log_info "Docker builder ${docker_builder_name} is available.  Attempting to leverage..."
  docker buildx use "${docker_builder_name}"
}

override_multi_arch_image_name() {
  # At the time of writing, you can't seamlessly store multi-architecture
  # images within the local docker image store.
  # To help with local development, we override the multi-arch image name with
  # the correct platform image name.
  local current_arch="${1}"
  local target_arch="${2}"
  local branch_name="${3}"
  local image_name_short="${4}"

  if is_github_build; then
    return
  fi

  local image_name_with_branch_full
  if [[ ${image_name_short} == "${docker_runner_image_name_short}" ]]; then
    # See $docker_runner_image_branch for more commentary.
    image_name_with_branch_full=$(get_image_name_with_branch_full "${docker_runner_image_branch}" "${image_name_short}")
  else
    image_name_with_branch_full=$(get_image_name_with_branch_full "${branch_name}" "${image_name_short}")
  fi

  local image_name_with_branch_arch_full
  image_name_with_branch_arch_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${target_arch}" "${false}")"

  if is_correct_arch_for_underlying_host "${current_arch}" "${target_arch}"; then
    log_info "Within local environment, current arch (${current_arch}) matches target arch (${target_arch})"
    log_info "Setting up local docker tag (${image_name_with_branch_full}) for simplicity"
    docker tag "${image_name_with_branch_arch_full}" "${image_name_with_branch_full}"
  else
    log_info "Within local environment, current arch (${current_arch}) does NOT match target arch (${target_arch}). Skipping generation of local docker tag (${image_name_with_branch_full})"
  fi
}

get_cache_flag() {
  local branch_name="${1}"
  local image_name_short="${2}"
  local arch="${3}"
  local cache_flag_type="${4}" # to/from

  local image_name_with_cache_full
  image_name_with_cache_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${arch}" "${true}")"

  local base_cache_flag="type=registry,ref=${image_name_with_cache_full}"

  if [[ ${cache_flag_type} == "${docker_cache_to}" ]]; then
    echo -n "${base_cache_flag},mode=max"
  elif [[ ${cache_flag_type} == "${docker_cache_from}" ]]; then
    echo -n "${base_cache_flag}"
  else
    die "get_cache_flag: Unsupported cache_flag_type. Current flag: ${cache_flag_type}"
  fi
}

get_container_name() {
  # namespace: See docker_container_namespace_*
  local namespace="${1}"
  local image_name_short="${2}"
  local branch_name="${3}"
  echo -n "bb-${namespace}-${image_name_short}-${branch_name}"
}

docker_login() {
  local github_org_name="${1}"
  local die_on_error="${2}"

  log_trace "Disabling trace while credentials are being processed"
  disable_trace
  log_info "Logging in to ghcr.io as username=${github_org_name}"
  local secret
  secret=$(get_secret "${secret_internal_github_token_name}")
  echo -n "${secret}" | docker login ghcr.io --username "${github_org_name}" --password-stdin
  log_trace "Re-enabling trace"
  set_global_shell_flags "${die_on_error}"
}
