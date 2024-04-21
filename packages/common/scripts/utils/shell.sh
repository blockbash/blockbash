#!/usr/bin/env bash

update_path() {
  local dir_path="${1}"

  if [[ ! -d "${dir_path}" ]]; then
    die "Directory not found: ${dir_path}"
  fi

  local new_path="${PATH}:${dir_path}"
  log_debug "Updating PATH to: ${new_path}"

  export PATH=${new_path}
}


