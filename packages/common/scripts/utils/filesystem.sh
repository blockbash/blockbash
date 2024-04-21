#!/usr/bin/env bash

does_file_extension_exist() {
  local dir_path="${1}"
  local extension="${2}"

  local file_path does_exist

  does_exist="${false}"
  for file_path in "${dir_path}"/*; do
    if [[ ${file_path} == *${extension} ]]; then
      does_exist="${true}"
      log_info "Found file extension (${extension}) within dir path (${dir_path})"
      break
    fi
  done
  [[ ${does_exist} == "${true}" ]]
}

create_directory() {
  # Cant log any output as this command can be leveraged within get_* functions that echo results
  local dir_path="${1}"
  mkdir -p "${dir_path}"
}

create_parent_directories_for_file() {
  local file_path="${1}"

  local dir_path
  dir_path="$(dirname "${file_path}")"

  create_directory "${dir_path}"
}

delete_nested_directories() {
  local dir_path="${1}"
  log_debug "Deleting directories in ${dir_path}"
  find "${dir_path}" -mindepth 1 -type d -exec rm -rf {} +
}

is_directory_empty() {
  # Check if a directory is empty or contains only .gitkeep
  local dir_path="$1"

  if [[ ! -d $dir_path ]]; then
    log_debug "${dir_path} does NOT exist"
    true
    return
  fi

  # Count the number of files and directories, excluding .gitkeep
  local count
  count=$(find "$dir_path" -mindepth 1 -not -name ".gitkeep" | wc -l)

  if [[ $count -eq 0 ]]; then
    # Log dir_path contents for sanity checks
    log_debug "${dir_path} is empty. Contents contain..."
    log_debug "$(ls -laR "${dir_path}")"
    true
    return
  else
    # Log dir_path for sanity checks
    log_debug "${dir_path} is NOT empty. Contents contain..."
    log_debug "$(ls -laR "${dir_path}")"
    false
    return
  fi
}

#does_directory_exist() {
#  local directory_path="${1}"
#  if [[ -d ${directory_path} ]]; then
#    log_debug "directory (${directory_path}) found"
#    true
#  else
#    log_debug "directory (${directory_path}) was NOT found"
#    false
#  fi
#}

do_log_directories_exist() {
  is_directory_empty "${container_logs_dir_path}" && is_directory_empty "${logs_dir_path}"
}

does_file_exist() {
  local file_path="${1}"
  if [[ -f ${file_path} ]]; then
    log_trace "file (${file_path}) found"
    true
    return
  else
    log_trace "file (${file_path}) was NOT found"
    false
    return
  fi
}

get_input_hash() {
  local input="${1}"
  echo "${input}" | sha1sum | cut -d ' ' -f 1
}

get_directory_hash() {
  local dir_path="${1}"
  echo -n "$(find "${dir_path}" -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum | cut -d ' ' -f 1)"
}

get_current_git_branch() {
  # Wherever possible, use the $github_branch variable
  # In cases where that isn't possible, use this function.
   git branch --show-current
}
