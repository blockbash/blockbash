#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Background tasks that should be executed once the learner opens the shell environment.
  + project-open.sh (which is executed via tasks.json) executes this script.

COMMENT
# ##############################################################################

# BLOCKBASH_LOG_LEVEL: When this file is executed, it is backgrounded and stdout is sent to a log file.  By setting a 'trace' BLOCKBASH_LOG_LEVEL, we allow the learner to submit granular debugging logs.
export BLOCKBASH_LOG_LEVEL=trace

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. /blockbash/packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  # When the devcontainer initializes, the devcontainer internals can mutate
  # PATH (e.g., make `code` available, etc.).  So we must pass the mutated path
  # to all bash invocations.
  ( 
    # Most scripts expect to start in the /blockbash directory
    cd "${container_repo_dir_path}" || die "Couldn't cd into ${container_repo_dir_path}"
    PATH=${PATH} bash "${lab_shell_scripts_hooks_dir_path}/open-files.sh" &>> "${container_logs_dir_path}"/open-files-sh.debug.log &
    PATH=${PATH} bash "${lab_shell_scripts_hooks_dir_path}/check-updates.sh" &>> "${container_logs_dir_path}"/check-updates-sh.debug.log &
  )
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
