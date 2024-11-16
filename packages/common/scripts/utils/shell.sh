#!/usr/bin/env bash

update_path() {
  local dir_path="${1}"

  if [[ ! -d ${dir_path} ]]; then
    die "Directory not found: ${dir_path}"
  fi

  local new_path="${PATH}:${dir_path}"
  log_debug "Updating PATH to: ${new_path}"

  export PATH=${new_path}
}

persist_stdout() {
  local command="${1}"
  # file_path: Where raw stdout (including ANSI escape codes) will be persisted
  # This is helpful when rendering colored terminal output in the UI
  local file_path="${2}"
  local capture_ansi_escapes="${3}"

  create_parent_directories_for_file "${file_path}"

  log_info "Persisting raw output of command. Command: ${command}. File Path: ${file_path}"

  if is_true "${capture_ansi_escapes}"; then
    script \
      --echo never \
      --quiet \
      --log-out "${file_path}" \
      --logging-format classic \
      --command "${command}"
    # script prepends (and appends) 1 line to the output...  So we truncate it
    sed -i '1d;$d' "${file_path}"
  else
    eval "${command} &> ${file_path}" || true
  fi
}
