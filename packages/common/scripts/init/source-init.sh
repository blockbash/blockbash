#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: A single entrypoint to source all MINIMAL boilerplate logic (e.g., logging, exception handling, etc.)
- Meant for sourcing only
- Sources files that are leveraged early in the execution cycle (e.g., Dockerfiles, etc.)
  Changes to this file (or anything it sources) will break the docker cache so we want to make this as concise as possible.
- For a full version, see source-all.sh
- If you need to only source the filesystem paths, see source-filesystem.sh
- Sourced scripts inhabit one namespace, so we must ensure that sourced variables dont have the same name.  Thus, we prefix _si (Source Init) for variables that aren't meant to be sourced.
- Can't leverage any internal funcs/vars as we're early in the execution cycle
- When doing the argument parsing, we don't kill the script if there's a validation failure as the error handling logic hasn't been set up (yet).  The error handling logic is active after core.sh has been FULLY executed.
- The script could be run in a user environment.  Hence, we do input validation after core.sh has been executed.

COMMENT
# ##############################################################################

while [[ $# -gt 0 ]]; do
  _si_argument_name="${1}"
  case "${_si_argument_name}" in
    --die_on_error=*)
      # Controls if the shell should die on error
      _si_argument_value="${_si_argument_name#*=}"
      _si_die_on_error="${_si_argument_value}"
      ;;
    *)
      echo "***************************"
      echo "Error: Invalid argument"
      echo "${_si_argument_name} is not a valid argument"
      echo "***************************"
      ;;
  esac
  if [[ -z ${_si_argument_value} ]]; then
    echo "***************************"
    echo "Error: Invalid value"
    echo "${_si_argument_name} doesn't have a value!"
    echo "***************************"
  else
    unset _si_argument_name _si_argument_value
  fi
  shift
done

# Will fetch the absolute path of this script
_si_script_dir_path=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")

# Remove the trailing path information to get the root dir
_si_blockbash_root_dir_path=${_si_script_dir_path%/packages/common/scripts/init}

# logs_dir_path and local_config_dir_path is needed fairly early in the init process.
# If we include source-filesystem.sh (at this early stage), we cause a bunch of
# docker cache invalidations.  This makes our docker builds much longer.
# logs_dir_path: Should match container_logs_dir_path
# logs_dir_path: Added to cleanup-job.sh
logs_dir_path="${_si_blockbash_root_dir_path}/logs"
bash_log_file_path="${logs_dir_path}/bash.log"
mkdir -p "${logs_dir_path}"

local_config_dir_path="${_si_blockbash_root_dir_path}/utils/local-config"
mkdir -p "${local_config_dir_path}"

# shellcheck source=./global.env
. "${_si_script_dir_path}/global.env"

if [[ -f "${local_config_dir_path}/overrides.env" ]]; then
  # shellcheck source=./../../../../utils/local-config/overrides.env
  . "${local_config_dir_path}/overrides.env"
fi

# Must source global.sh after overrides.env
# shellcheck source=./global.sh
. "${_si_script_dir_path}/global.sh"

# shellcheck source=./utils/core.sh
. "${_si_script_dir_path}/utils/core.sh" --die_on_error="${_si_die_on_error}"

# See above commentary for reasoning
if [[ -z ${_si_die_on_error} ]]; then
  die "--die_on_error was NOT passed to source-init.sh"
fi

# shellcheck source=./utils/package.sh
. "${_si_script_dir_path}/utils/package.sh"

# shellcheck source=./utils/filesystem.sh
. "${_si_script_dir_path}/utils/filesystem.sh"

# shellcheck source=./utils/network.sh
. "${_si_script_dir_path}/utils/network.sh"
