#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  # Read create_matrix_docker_outputs() for more context on file conventions

  local matrix_job_name_dir_path

  create_directory "${build_matrix_outputs_final_dir_path}"
  rm -rf "${build_matrix_outputs_final_dir_path:?}/*"

  # Path 1: /blockbash/apps/build/artifacts/matrix-outputs/raw/create-base-images/549070b36b019c2edb288abb5b585176e69c7cd7/7d92b2567dd0575938fc9f87e2b18139944fc84f.json
  for matrix_job_name_dir_path in "${build_matrix_outputs_raw_dir_path}"/*/; do
    # Ensure the path is a directory
    [[ -d ${matrix_job_name_dir_path} ]] || continue
    # matrix_job_name_dir_path: Normalize dir_path to remove trailing slash
    matrix_job_name_dir_path="$(realpath "${matrix_job_name_dir_path}")"

    local job_name
    job_name=$(basename "${matrix_job_name_dir_path}")
    log_info "Current job_name: ${job_name}" # Path 1 Ex: create-base-images
    log_info "Current job_name path: ${matrix_job_name_dir_path}"

    local job_scratch_dir_path="${build_matrix_outputs_scratch_dir_path}/${job_name}"
    create_directory "${job_scratch_dir_path}"

    local image_name_with_branch_full_sha_dir_path image_name_with_branch_full_sha_scratch_file_path
    for image_name_with_branch_full_sha_dir_path in "${matrix_job_name_dir_path}"/*/; do
      [[ -e ${image_name_with_branch_full_sha_dir_path} ]] || continue
      local image_name_with_branch_full_sha
      image_name_with_branch_full_sha=$(basename "${image_name_with_branch_full_sha_dir_path}")
      log_info "Current image_name_with_branch_full_sha: ${image_name_with_branch_full_sha}" # Path 1 Ex: 549070b36b019c2edb288abb5b585176e69c7cd7
      log_info "Current image_name_with_branch_full_sha path: ${image_name_with_branch_full_sha_dir_path}"

      image_name_with_branch_full_sha_scratch_file_path="${job_scratch_dir_path}/${image_name_with_branch_full_sha}.json"
      # jq:
      #   -L: search modules from the directory;
      #
      # Merge all matrix job outputs for a given image_name_with_branch_full.  This should generate a single JSON object.
      jq "${jq_common_flags[@]}" --slurp -L "${common_scripts_jq_dir_path}" 'include "append"; . | append' "${image_name_with_branch_full_sha_dir_path}"/*.json > "${image_name_with_branch_full_sha_scratch_file_path}"
      log_file_contents "${image_name_with_branch_full_sha_scratch_file_path}" "${debug_level}"
    done

    # Merge all matrix outputs (for a given job_name) into a single file. This file will contain an array of json objects.
    # Ex Path: /blockbash/apps/build/artifacts/matrix-outputs/final/create-lab-images.json
    local build_matrix_outputs_final_file_path="${build_matrix_outputs_final_dir_path}/${job_name}.json"
    jq "${jq_common_flags[@]}" --slurp . "${job_scratch_dir_path}"/*.json > "${build_matrix_outputs_final_file_path}"

    log_file_contents "${build_matrix_outputs_final_file_path}" "${debug_level}"
  done
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
