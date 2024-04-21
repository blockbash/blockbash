#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: A single entrypoint to source all filesystem paths.
- This file can be sourced independently so dont use any other functions defined in other files.
  - When doing the argument parsing, we don't kill the script if there's a validation failure as the error handling logic MIGHT not have been initialized.  In the majority of cases, this file will be sourced via source-init (or source-all) so if an argument hasn't been passed to the script, the script will die (if appropriate) due to 'set -u' being declared in core.sh.
- Meant for sourcing only
- Sourced scripts inhabit one namespace, so we must ensure that sourced variables dont have the same name.  Thus, we prefix _sf (Source Filesystem) for variables that aren't meant to be sourced.


COMMENT
# ##############################################################################

while [[ $# -gt 0 ]]; do
  _sf_argument_name="${1}"
  case "${_sf_argument_name}" in
    --absolute_paths=*)
      _sf_argument_value="${_sf_argument_name#*=}"
      _sf_absolute_paths="${_sf_argument_value}"
      ;;
    *)
      echo "***************************"
      echo "Error: Invalid argument"
      echo "${_sf_argument_name} is not a valid argument"
      echo "***************************"
      ;;
  esac
  if [[ -z ${_sf_argument_value} ]]; then
    echo "${_sf_argument_name} doesn't have a value!"
  else
    unset _sf_argument_name _sf_argument_value
  fi
  shift
done

# Will fetch the absolute path of this script
_sf_script_dir_path=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")

# Remove the trailing path information to get the root dir
_sf_blockbash_root_dir_path=${_sf_script_dir_path%/packages/common/scripts}

if [[ ${_sf_absolute_paths} == "true" ]]; then
  _sf_prepend_dir_path="${_sf_blockbash_root_dir_path}/"
else
  _sf_prepend_dir_path=""
fi

# shellcheck source=./filesystem.env
_prepend_dir_path="${_sf_prepend_dir_path}" \
  _blockbash_root_dir_path="${_sf_blockbash_root_dir_path}" \
  . "${_sf_script_dir_path}/filesystem.env"

if [[ -f "${local_config_dir_path}/overrides.env" ]]; then
  # shellcheck source=./../../../utils/local-config/overrides.env
  . "${local_config_dir_path}/overrides.env"
fi
