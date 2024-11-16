#!/usr/bin/env bash

get_staged_relative_paths() {
  local glob_pattern="${1}" # pattern or empty string

  if [[ "${glob_pattern}" == "" ]]; then
    echo ""
    return
  fi

  # Inspiration: https://typicode.github.io/husky/get-started.html#scripting
  local diff_flags=(
    --staged
    --name-only
    --diff-filter=ACMR
    -- "${glob_pattern}"
  )
  git diff "${diff_flags[@]}" | sed 's| |\\ |g'
}

create_git_diff() {
  local start_file_path="${1}" # File that represents the "before" state
  local end_file_path="${2}"   # File that represents the "after" state
  local diff_file_path="${3}"

  create_parent_directories_for_file "${diff_file_path}"

  local return_code=0 diff_temp_file_path
  diff_temp_file_path=$(mktemp)

  #  --U10000: Ensures the diff isn't truncated.
  #  --no-index: Allows arbitrary files to be DIFFed.
  git --no-pager \
    diff \
    -U10000 \
    --output="${diff_temp_file_path}" \
    --no-color \
    --no-index \
    "${start_file_path}" "${end_file_path}" || return_code=$?
  if [[ ${return_code} -ne 1 ]]; then
    die "Failed to find a difference between ${start_file_path} and ${end_file_path}"
  fi

  # Delete the diff generated header that is at the top of the file.
  # As we're only DIFFing 2 files, there should only be one header.
  tail -n +6 "${diff_temp_file_path}" > "${diff_file_path}"
  log_info "Created diff: Starting state ${start_file_path}. Ending state ${end_file_path}. Diff path ${diff_file_path}"
}
