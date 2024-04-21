#!/usr/bin/env bash

die_on_error="true"

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
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
  # This logic should correspond to create-matrix-outputs.sh

  if [[ ${should_publish} == "${true}" && ${should_publish_images} == "${true}" ]]; then
    docker_login "${github_primary_org_name_prod}" "${die_on_error}"
  fi

  local matrix_job_name_file_path

  for matrix_job_name_file_path in "${build_matrix_outputs_final_dir_path}"/*; do
    # Ensure matrix_job_name_file_path is a file
    [[ -f ${matrix_job_name_file_path} ]] || continue
    log_info "Current job_name path: ${matrix_job_name_file_path}"

    local docker_images

    # readarray: create bash array from json array (https://stackoverflow.com/a/67638584)
    # docker_images: Each element of array should correspond to 1 distinct multi-arch container image
    readarray -t docker_images < <(jq --compact-output "${jq_common_flags[@]}" '.[]' "${matrix_job_name_file_path}")

    local docker_image
    for docker_image in "${docker_images[@]}"; do
      local flags=()
      local image_name_with_branch_full image_names_with_branch_arch_full
      # image_name_with_branch_full: "Final" multi-arch image name
      image_name_with_branch_full=$(jq --raw-output "${jq_common_flags[@]}" ".${key_image_name_with_branch_full}" <<< "${docker_image}")

      flags+=(--tag "${image_name_with_branch_full}")

      # readarray: create bash array from json array (https://stackoverflow.com/a/67638584)
      readarray -t image_names_with_branch_arch_full < <(jq --raw-output "${jq_common_flags[@]}" ".${key_image_name_with_branch_arch_full}[]" <<< "${docker_image}")

      local arch_tag
      for arch_tag in "${image_names_with_branch_arch_full[@]}"; do
        flags+=("${arch_tag}")
      done

      if [[ ${should_publish} == "${true}" && ${should_publish_images} == "${true}" ]]; then
        log_info "Executing docker buildx imagetools create ${flags[*]}"
        docker buildx imagetools create "${flags[@]}"
      else
        log_info "Skipping image publish"
        log_info "Would have executed: docker buildx imagetools create ${flags[*]}"
      fi
    done
  done
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
