#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Downloads/Installs *.debs from Github
 - If is_scheduled_execution == false, we only check for updates if strictly
 necessary.  (This reduces Github throttling for unauthenticated requests)

COMMENT

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --enable_security_tools_install=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      enable_security_tools_install="${flag_value}"
      ;;
    --enable_security_tools_download=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      enable_security_tools_download="${flag_value}"
      ;;
    --current_arch=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      # As this can be used in a docker build, we need to use the docker arch names as well.
      validate_array_value "${flag_name}" "${flag_value}" all_architectures
      log_debug "Setting ${flag_name} to: ${flag_value}"
      current_arch="${flag_value}"
      ;;
    --is_scheduled_execution=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      is_scheduled_execution="${flag_value}"
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
  local created_new_deb_file full_repo_name first_directory_hash second_directory_hash security_tools_debs_github_repos

  first_directory_hash="$(get_directory_hash "${build_security_tools_debs_dir_path}")"

  created_new_deb_file="${false}"
  if [[ ${enable_security_tools_download} == "${true}" ]]; then
    security_tools_debs_github_repos=(
      "${security_tools_cosign_repo}"
      "${security_tools_syft_repo}"
      "${security_tools_grype_repo}"
    )
    for full_repo_name in "${security_tools_debs_github_repos[@]}"; do
      {
        log_debug "Evaluating ${full_repo_name}"
        if should_skip_github_deb_download "${is_scheduled_execution}" "${full_repo_name}"; then
          # Github API has rate limiting.  We try to skip these requests if possible
          log_info "Skipping download from ${full_repo_name} until next scheduled execution"
        else
          download_deb_from_github \
            "${full_repo_name}" \
            "${current_arch}"
        fi
      } &
    done
    wait

    second_directory_hash="$(get_directory_hash "${build_security_tools_debs_dir_path}")"
    if [[ ${first_directory_hash} != "${second_directory_hash}" ]]; then
      created_new_deb_file="${true}"
    fi
  fi

  if [[ ${enable_security_tools_install} == "${true}" ]]; then
    install_local_debs "${build_security_tools_debs_dir_path}" "${null}"
  fi

  set_build_output "debs_dir_hash" "$(get_directory_hash "${build_security_tools_debs_dir_path}")"
  set_build_output "new_deb_files" "${created_new_deb_file}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
