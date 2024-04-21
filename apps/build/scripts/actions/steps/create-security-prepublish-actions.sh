#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --current_arch=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      # shellcheck disable=SC2034
      validate_array_value "${flag_name}" "${flag_value}" runner_architectures
      current_arch="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --enable_security_tools_install=*) # true/false.  Leveraged for caching
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      enable_security_tools_install="${flag_value}"
      ;;
    --enable_security_tools_download=*) # true/false.  Leveraged for caching
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      enable_security_tools_download="${flag_value}"
      ;;
    *)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      die "${flag_name} is not a valid argument"
      ;;
  esac
  if [[ -z ${flag_value} ]]; then
    die "${flag_name} does not have a value"
  else
    unset argument_name flag_value flag_name
  fi
  shift
done

main() {

  local deb_github_repos=(
    "${security_tools_cosign_repo}"
    "${security_tools_syft_repo}"
    "${security_tools_grype_repo}"
  )

  local new_deb_files=false
  if [[ ${enable_security_tools_download} == "${true}" ]]; then
    local repo is_new
    for repo in "${deb_github_repos[@]}"; do
      is_new="$(download_deb_from_github "${repo}" "${current_arch}")"
      if [[ ${is_new} == "${true}" ]]; then
        new_deb_files="${true}"
      fi
    done
  fi

  if [[ ${enable_security_tools_install} == "true" ]]; then
    ls -laR $build_security_tools_debs_dir_path
    sudo dpkg --install --skip-same-version --recursive "${build_security_tools_debs_dir_path}"
  fi

  # This script can run within execution contexts where GITHUB_OUTPUT
  # isn't available (i.e., docker build)
  # bashsupport disable=BP2001
  export GITHUB_OUTPUT=${GITHUB_OUTPUT:-/dev/null}

  echo "new_deb_files=${new_deb_files}" >> "${GITHUB_OUTPUT}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
