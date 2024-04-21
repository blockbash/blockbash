#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Automatically opens files when learner enters the challenge environment.

COMMENT
# ##############################################################################

# BLOCKBASH_LOG_LEVEL: When this file is executed, it is backgrounded and stdout is sent to a log file.  By setting a 'trace' BLOCKBASH_LOG_LEVEL, we allow the learner to submit granular debugging logs.
export BLOCKBASH_LOG_LEVEL=trace

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. /blockbash/packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  local challenge_guid_bash
  challenge_guid_bash="$(get_container_challenge_guid_bash)"

  local container_challenge_open_file_paths
  container_challenge_open_file_paths="$(get_challenge_metadata_value "${key_container_challenge_open_file_paths}" "${challenge_guid_bash}")"

  local blockbash_workspace_dir_path
  blockbash_workspace_dir_path="$(get_container_state_value "${key_blockbash_workspace_dir_path}")"

  if does_command_exist code; then
    # blockbash_workspace_dir_path: By navigating to this directory, we can easily
    # leverage relative file paths within container_challenge_open_file_paths
    cd "${blockbash_workspace_dir_path}" || die "Couldn't cd into ${blockbash_workspace_dir_path}"
    code --reuse-window "${container_challenge_open_file_paths}"
    log_info "Successfully opened ${container_challenge_open_file_paths}"
    cd - || die "Couldn't navigate back to previous directory"
  else
    log_error "code cli doesn't exist"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
