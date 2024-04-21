#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE:
  + IMPORTANT: This script is invoked when a learner enters the shell.  As such, we want to
  ensure that any errors do not close the learner's shell via 'set -e'.
  If an error occurs, we want the learner to be able to access the shell
  environment so they can submit the debug logs.
  + Is used for any logic that needs HEAVY interaction from a user (i.e., "welcome messages", interactive prompts, etc.)
  + If interaction isn't ALWAYS needed, it's recommended to background the logic and bubble up any messages (to the user) via log_user. The caveat with log_user is that the shell might not always handle the
  logging messages gracefully.  So we should only use it for messages
  that aren't often displayed.


COMMENT
# ##############################################################################

# shellcheck source=./../../../../packages/common/scripts/source-filesystem.sh
. /blockbash/packages/common/scripts/source-filesystem.sh --absolute_paths="true"

main() {
  cat << EOF
Welcome to BlockBash!

Syntax highlighting will be available once the solidity plugin finishes bootstrapping

To check your solution, execute  the 'cv' command (without the quotes).  You'll execute this command in the terminal (below).

EOF

  # + When the devcontainer initializes, the devcontainer internals can mutate
  # PATH (e.g., make `code` available, etc.).  So we must pass the mutated path
  # to all bash invocations.
  # + Put into subshell so "finished" job message isn't echoed into the shell
  (
    PATH=${PATH} bash "${lab_shell_scripts_hooks_dir_path}/background-tasks.sh" &>> "${container_logs_dir_path}"/background-tasks-sh.debug.log &
  )
}

main
