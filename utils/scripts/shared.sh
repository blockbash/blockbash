#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Shared functionality between command scripts

- Must be sourced (not executed)

COMMENT
# ##############################################################################

get_blockbash_root_dir_path() {
  local script_dir blockbash_project_root_path
  script_dir=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
  blockbash_project_root_path=${script_dir%/utils/scripts}
  echo -n "${blockbash_project_root_path}"
}

# MANDATORY ENV VARS
# See README.md for more context
export BLOCKBASH_IS_LOCAL="true"

# The commands (e.g., bb-act-cred) can be called from anywhere
# on the filesystem.  Thus, we cd into the blockbash directory to
# give a consistent experience.
cd "$(get_blockbash_root_dir_path)" || exit

# We can't source into a sub-shell
# shellcheck source-path=./../../packages/common/scripts/source-all.sh
. "packages/common/scripts/source-all.sh" --absolute_paths="true" --die_on_error="true"

if [[ ${should_clear_bash_log} == "${true}"   ]]; then
  log_info "Deleting previous bash logs as should_clear_bash_log is ${true}"
  rm -rf "${logs_dir_path:?}/bash.log"
fi

log_info "Granular logs now available within ${logs_dir_path}"

cd - || exit
