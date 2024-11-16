#!/usr/bin/env bash

base64_encode() {
  local value="${1}"
  echo "${value}" | base64
}

base64_decode() {
  local value="${1}"
  echo "${value}" | base64 --decode
}

get_cli_flag_name() {
  # INPUT: --INSERT_FLAG_HERE=foo
  # OUTPUT: INSERT_FLAG_HERE
  local argument_name="${1}" # Ex: --INSERT_FLAG_HERE=foo

  local flag_name="${argument_name#--}"
  flag_name="${flag_name%%=*}"

  validate_non_empty "${flag_name}"
  echo "${flag_name}"
}

get_cli_flag_value() {
  # INPUT: --INSERT_FLAG_HERE=foo
  # OUTPUT: foo
  local argument_name="${1}" # Ex: --INSERT_FLAG_HERE=foo

  local flag_value="${argument_name#*=}"
  validate_non_empty "${flag_value}"
  echo "${flag_value}"
}

is_array_empty() {
  local -n array="${1}" # https://stackoverflow.com/a/26443029

  # https://serverfault.com/a/477506
  [[ ${#array[@]} -eq 0 ]]
}

validate_array_value() {
  local array_name="${1}"
  local value="${2}"
  # bashsupport disable=BP3001
  local -n allowed_values_array="${3}" # https://stackoverflow.com/a/26443029
  if _contains_array_value "${value}" allowed_values_array; then
    return
  else
    die "Array (${array_name}) does not have this value (${value})"
  fi
}

_contains_array_value() {
  local search="${1}"
  local -n array="${2}" # https://stackoverflow.com/a/26443029

  local i match
  match="${false}"
  for i in "${array[@]}"; do
    if [[ ${i} == "${search}" ]]; then
      match="${true}"
    fi
  done
  [[ ${match} == "${true}" ]]
}

merge_json_files() {
  # Perform a recursive merge of two json objects (within 2 files). If there are conflicting keys, the values from overrides_file_path will override the values from base_file_path.
  local base_file_path="${1}"
  local overrides_file_path="${2}"
  local final_file_path="${3}"

  create_parent_directories_for_file "${final_file_path}"
  jq --slurp "${jq_common_flags[@]}" '.[0] * .[1]' "${base_file_path}" "${overrides_file_path}" > "${final_file_path}"
  log_debug "Generated ${final_file_path}..."
  log_file_contents "${final_file_path}" "${debug_level}"
}

get_json_value() {
  local key="${1}" # Ex: .key.nested_key.nested_key
  local directory_path="${2}"

  # --exit-status: Will return non-0 if key is not found
  jq --raw-output "${jq_common_flags[@]}" "${key}" "${directory_path}"
}

is_empty() {
  local value="${1}"
  [[ -z ${value// /} ]]
}

validate_non_empty() {
  local var="${1}"

  # Ensure that a space-only value isn't allowed
  # https://unix.stackexchange.com/a/146945
  if is_empty "${var}"; then
    die "Empty value encountered"
  fi
}

get_json_array_from_bash_array() {
  local -n array="${1}" # https://stackoverflow.com/a/26443029

  # https://github.com/jqlang/jq/issues/2918#issuecomment-1744112777
  jq "${jq_common_flags[@]}" --null-input '$ARGS.positional' --args -- "${array[@]}"
}

is_null() {
  local value="${1}"
  [[ ${value} == "${null}" ]]
}

is_true() {
  local value="${1}"
  [[ ${value} == "${true}" ]]
}

is_false() {
  local value="${1}"
  [[ ${value} == "${false}" ]]
}

get_random_value() {
  openssl rand -hex 20
}

set_json_value() {
  local key_name="${1}"
  local key_value="${2}"
  local file_path="${3}"
  local is_json_value="${4:-false}"

  if [[ ! -f ${file_path} ]]; then
    create_parent_directories_for_file "${file_path}"
    log_debug "Generating json file: ${file_path}"
    echo -n "{}" > "${file_path}"
  fi

  local temp_file_path
  temp_file_path="$(mktemp)"

  local dynamic_args=()
  if [[ ${is_json_value} == "${true}" ]]; then
    dynamic_args+=(--argjson "${key_name}" "${key_value}")
  else
    dynamic_args+=(--arg "${key_name}" "${key_value}")
  fi

  # https://unix.stackexchange.com/questions/686785/unix-shell-quoting-issues-error-in-jq-command
  jq --raw-output "${jq_common_flags[@]}" "${dynamic_args[@]}" '. += $ARGS.named' "${file_path}" > "${temp_file_path}" && mv "${temp_file_path}" "${file_path}"

  rm -rf "${temp_file_path}"
}
