#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Automatically opens files when learner enters the lab environment.

COMMENT
# ##############################################################################

# BLOCKBASH_LOG_LEVEL: When this file is executed, it is backgrounded and stdout is sent to a log file.  By setting a 'trace' BLOCKBASH_LOG_LEVEL, we allow the learner to submit granular debugging logs.
export BLOCKBASH_LOG_LEVEL=trace

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. /blockbash/packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  local lab_guid_bash
  lab_guid_bash="$(get_container_lab_guid_bash)"

  local lab_open_relative_file_paths
  lab_open_relative_file_paths="$(get_lab_metadata_value "${key_lab_open_relative_file_paths}" "${lab_guid_bash}")"

  local blockbash_workspace_dir_path
  blockbash_workspace_dir_path="$(get_container_state_value "${key_blockbash_workspace_dir_path}")"

  if does_command_exist code; then
    # blockbash_workspace_dir_path: By navigating to this directory, we can easily
    # leverage relative file paths within lab_open_relative_file_paths
    cd "${blockbash_workspace_dir_path}" || die "Couldn't cd into ${blockbash_workspace_dir_path}"

    # Set the IFS to comma (,) to iterate through comma delimited values
    IFS=','

    local relative_file_path
    for relative_file_path in ${lab_open_relative_file_paths}; do
      code --reuse-window "${relative_file_path}"
      log_info "Successfully opened ${relative_file_path}"
    done

    # Reset the IFS to its default value
    IFS=$' \t\n'

    cd - || die "Couldn't navigate back to previous directory"
  else
    log_error "code cli doesn't exist"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
