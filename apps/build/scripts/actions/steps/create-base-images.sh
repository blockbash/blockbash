#!/usr/bin/env bash

die_on_error="true"

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="false" --die_on_error="${die_on_error}"

while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --branch_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      branch_name="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --current_arch=*)
      # current_arch: The current arch of the Github Runner (in the GITHUB_RUNNER arch format). See RUNNER_ARCH for accepted values (https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      # shellcheck disable=SC2034
      validate_array_value "${flag_name}" "${flag_value}" runner_architectures
      current_arch="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --dockerfile_path=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      dockerfile_path="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --image_name_short=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      image_name_short="${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" image_names_short
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
      # target_arch: docker arch format.  This is the architecture we want to build for.
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" docker_architectures
      target_arch="${flag_value}"
      ;;
    --target_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      target_name="${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" image_names_short
      log_debug "Setting ${flag_name} to: ${flag_value}"
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
  log_info "Executing matrix permutation: dockerfile_path (${dockerfile_path}) | image_name_short (${image_name_short}) | target_arch (${target_arch})"

  # TODO: Into future, leverage this with upload-artifact@4
  local matrix_guid="${dockerfile_path}-${image_name_short}-${target_arch}"

  if is_secret_set "${secret_internal_github_token_name}"; then
    docker_login "${github_primary_org_name_prod}" "${die_on_error}"
  fi

  local image_name_with_branch_arch_full
  image_name_with_branch_arch_full="$(get_image_name_with_branch_arch_full "${branch_name}" "${image_name_short}" "${target_arch}" "${false}")"

  # ##############################################################################
  : << COMMENT
  BUILD FLAGS:
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

  local build_flags

  rm -rf "${runner_build_metadata_path}"
  # BLOCKBASH_IS_LOCAL: Set via job-init
  # shellcheck disable=SC2154
  build_flags=(
    --build-arg "BLOCKBASH_IS_LOCAL=${BLOCKBASH_IS_LOCAL}"
    --build-arg "BLOCKBASH_LOG_LEVEL=$(get_current_log_level)"
    --build-arg "branch_name=${branch_name}"
    --build-arg "build_dir_path=${build_dir_path}"
    --build-arg "build_devcontainer_dir_path=${build_devcontainer_dir_path}"
    --build-arg "build_global_config_file_path=${build_script_global_config_file_path}"
    --build-arg "build_scripts_dir_path=${build_scripts_dir_path}"
    --build-arg "build_scripts_workflow_steps_dir_path=${build_scripts_workflow_steps_dir_path}"
    --build-arg "common_config_dir_path=${common_config_dir_path}"
    --build-arg "common_dir_path=${common_dir_path}"
    --build-arg "common_scripts_dir_path=${common_scripts_dir_path}"
    --build-arg "common_scripts_init_dir_path=${common_scripts_init_dir_path}"
    --build-arg "container_repo_dir_path=${container_repo_dir_path}"
    --build-arg "current_arch=${current_arch}"
    --build-arg "eslint_dir_path=${eslint_dir_path}"
    --build-arg "is_scheduled_execution=${is_scheduled_execution}"
    --build-arg "lab_core_contracts_dir_path=${lab_core_contracts_dir_path}"
    --build-arg "lab_core_dir_path=${lab_core_dir_path}"
    --build-arg "lab_shell_config_dir_path=${lab_shell_config_dir_path}"
    --build-arg "lab_shell_dir_path=${lab_shell_dir_path}"
    --build-arg "lab_shell_scripts_aliases_dir_path=${lab_shell_scripts_aliases_dir_path}"
    --build-arg "lab_shell_scripts_dir_path=${lab_shell_scripts_dir_path}"
    --build-arg "packages_dir_path=${packages_dir_path}"
    --build-arg "build_security_tools_debs_dir_path=${build_security_tools_debs_dir_path}"
    --build-arg "shared_pnpm_root_dir_path=${shared_pnpm_root_dir_path}"
    --build-arg "shared_pnpm_store_dir_path=${shared_pnpm_store_dir_path}"
    --build-arg "should_user_environment_die_on_error=${should_user_environment_die_on_error}"
    --build-arg "website_dir_path=${website_dir_path}"
    --build-arg "utils_local_config_dir_path=${utils_local_config_dir_path}"
    --cache-from "$(get_cache_flag "${branch_name}" "${image_name_short}" "${target_arch}" "${docker_cache_from}")"
    --cache-from "$(get_cache_flag "${production_branch}" "${image_name_short}" "${target_arch}" "${docker_cache_from}")"
    --file "${dockerfile_path}"
    --metadata-file "${runner_build_metadata_path}"
    --platform "${target_arch}"
    --progress plain
    --provenance false
    --tag "${image_name_with_branch_arch_full}"
    --target "${target_name}"
  )

  if [[ ${image_name_short} == "${docker_runner_image_name_short}" ]]; then
    # Only the docker_runner_image_name_short image needs to be loaded into the image store.
    build_flags+=("--load")
  fi

  if [[ ${is_scheduled_execution} == "${true}" ]]; then
    log_info "This is a scheduled execution. Adding cache busting flags to pull in image updates"
    build_flags+=("--no-cache" "--pull")
  fi

  if [[ ${should_publish} == "${true}" && ${should_publish_images} == "${true}" ]] && is_github_build; then
    log_info "Adding cache-to image flags"
    # Creates/uploads cache images to quicken docker build process
    build_flags+=(--cache-to "$(get_cache_flag "${branch_name}" "${image_name_short}" "${target_arch}" "${docker_cache_to}")")
  fi

  initialize_buildx_builder

  log_info "Invoking docker build with flags..."
  log_info "${build_flags[*]}"

  docker buildx build "${build_flags[@]}" "${blockbash_root_dir_path}"

  local image_name_with_branch_full
  image_name_with_branch_full=$(get_image_name_with_branch_full "${branch_name}" "${image_name_short}")

  create_github_workflow_outputs "${branch_name}" "${image_name_short}" "${target_arch}" "${null}" "${matrix_guid}"

  if [[ ${image_name_short} != "${docker_challenge_base_image_name_short}" ]]; then
    # We only publish cache images for docker_challenge_base_image_name_short
    create_matrix_docker_outputs "${key_create_base_images_job}" "${image_name_with_branch_full}" "${branch_name}" "${image_name_short}" "${target_arch}"
    override_multi_arch_image_name "${current_arch}" "${target_arch}" "${branch_name}" "${image_name_short}"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
