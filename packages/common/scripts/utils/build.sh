#!/usr/bin/env bash

is_production_branch() {
  local _branch_name="${1}"
  [[ ${_branch_name} == "${production_branch}" ]]
}

is_production_build() {
  local _branch_name="${1}"
  is_production_branch "${_branch_name}" && is_github_build
}

execute_local_build_init_logic() {
  bb-init
}

create_configurations() {
  # Configurations that should be created in all execution contexts (e.g., host workstation, runner, lab docker environment, etc.)
  local branch_name="${1}"

  log_debug "Generating configurations..."
  create_lab_configuration_files "${branch_name}"
  create_vscode_tasks_file
}

create_lab_container_configurations() {
  # Configurations that should only be created within the lab container
  # lab_guid_bash: allows the correct lab metadata file to be located from within the container
  local lab_guid_bash="${1}"
  set_container_state_value "${key_lab_guid_bash}" "${lab_guid_bash}"
  set_container_state_value "${key_has_bootstrapped}" "${false}"
}

get_matrix_image_metadata_file_path() {
  # job_name: Name of job that is creating the output (e.g., create-base-images/create-lab-images). Results will be grouped via the job_name.
  local job_name_file_path="${1}"
  local image_name_with_branch_full="${2}"

  local image_name_with_branch_full_sha
  image_name_with_branch_full_sha="$(echo -n "${image_name_with_branch_full}" | sha1sum | head -c 40)"

  local base_dir="${build_matrix_outputs_raw_dir_path}/${job_name_file_path}/${image_name_with_branch_full_sha}"

  # As the matrix jobs are effectively sharing a filesystem (via an Github Action Artifact), we use a directory (for each multi-arch image) so there aren't any filesystem conflicts.
  create_directory "${base_dir}"

  # Create random metadata file name to avoid filesystem conflicts.
  local json_file_path
  json_file_path="${base_dir}/$(get_random_value).json"
  echo -n "${json_file_path}"
}

set_build_output() {
  # IMPORTANT: DO NOT PASS SECRETS WITHIN BUILD OUTPUT!
  # No need to add log statements as this is already within the build output
  local name="${1}"
  local value="${2}"

  # This can run during docker build which doesn't leverage GITHUB_OUTPUT
  echo "${name}=${value}" >> "${GITHUB_OUTPUT:-/dev/null}"
}

_set_build_env() {
  # You probably mean to use set_build_env_var!

  # value: Is USUALLY in this format INSERT_ENV_VAR_NAME=INSERT_ENV_VAR_VALUE
  # value: Can contain a secret!
  local value="${1}"

  # shellcheck disable=SC2154
  echo "${value}" >> "${GITHUB_ENV}"
}

set_build_env_var() {
  local name="${1}"
  # value: Can contain a secret!
  local value="${2}"

  _set_build_env "${name}=${value}"
}

set_multi_line_env_var() {
  local name="${1}"
  # value: Can contain a secret!
  local value="${2}"

  _set_build_env "${name}<<EOF"
  _set_build_env "${value}"
  _set_build_env "EOF"
}
