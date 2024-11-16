#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: A single entrypoint to source all boilerplate logic (e.g., logging, exception handling, filesystem variables, utility functions, etc.)
- For a minimal version of this, see source-init.sh
- If you need to only source the filesystem paths, see source-filesystem.sh
- Meant for sourcing only
- Sourced scripts inhabit one namespace, so we must ensure that sourced variables dont have the same name.  Thus, we prefix _sa (Source All) for variables that aren't meant to be sourced.
- Can't leverage any internal funcs/vars as we're early in the execution cycle
- When doing the argument parsing, we don't kill the script if there's a validation failure as the error handling logic hasn't been set up (yet).  The error handling logic is active after core.sh has been FULLY executed.


COMMENT
# ##############################################################################

_sa_script_dir_path=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")

while [[ $# -gt 0 ]]; do
  _sa_argument_name="${1}"
  case "${_sa_argument_name}" in
    --absolute_paths=*)
      # Controls if sourced filesystem path variables are relative to the
      # blockbash directory or absolute
      _sa_argument_value="${_sa_argument_name#*=}"
      _sa_absolute_paths="${_sa_argument_value}"
      ;;
    --die_on_error=*)
      # Controls if the shell should die on error
      _sa_argument_value="${_sa_argument_name#*=}"
      _sa_die_on_error="${_sa_argument_value}"
      ;;
    *)
      echo "***************************"
      echo "Error: Invalid argument name"
      echo "${_sa_argument_name} is not a valid argument name"
      echo "***************************"
      ;;
  esac
  if [[ -z ${_sa_argument_value} ]]; then
    echo "***************************"
    echo "Error: Invalid value"
    echo "${_sa_argument_name} doesn't have a valid value!"
    echo "***************************"
  else
    unset _sa_argument_name _sa_argument_value
  fi
  shift
done

# Need to have this towards the top to source core.sh configs
# (e.g., error handling, etc.)
# source-init will validate if --die_on_error was passed.  We cant do this logic
# earlier because the error handling hasn't been initialized.
# shellcheck source=./init/source-init.sh
. "${_sa_script_dir_path}/init/source-init.sh" --die_on_error="${_sa_die_on_error}"

# See above commentary for reasoning
if [[ -z ${_sa_absolute_paths} ]]; then
  die "--absolute_paths was NOT passed to source-all.sh"
fi

# shellcheck source=./source-filesystem.sh
. "${_sa_script_dir_path}/source-filesystem.sh" --absolute_paths="${_sa_absolute_paths}"

# shellcheck source=./utils/shell.sh
. "${_sa_script_dir_path}/utils/shell.sh"

# shellcheck source=./utils/build.sh
. "${_sa_script_dir_path}/utils/build.sh"

# shellcheck source=./utils/lab.sh
. "${_sa_script_dir_path}/utils/lab.sh"

# shellcheck source=./utils/data.sh
. "${_sa_script_dir_path}/utils/data.sh"

# shellcheck source=./utils/docker.sh
. "${_sa_script_dir_path}/utils/docker.sh"

# shellcheck source=./utils/secret.sh
. "${_sa_script_dir_path}/utils/secret.sh"

# shellcheck source=./utils/security-tools.sh
. "${_sa_script_dir_path}/utils/security-tools.sh"

# shellcheck source=./utils/host.sh
. "${_sa_script_dir_path}/utils/host.sh"

# shellcheck source=./utils/git.sh
. "${_sa_script_dir_path}/utils/git.sh"
