#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Provides cleanup actions (and sanity checks) for all Github Jobs and docker build stages.

COMMENT
# ##############################################################################

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --is_docker_build=*)
      # Is within docker build process
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      is_docker_build="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
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
  if is_directory_empty "${runner_secrets_dir_path}"; then
    log_debug "${runner_secrets_dir_path} is empty.  Not doing cleanup actions"
  else
    if [[ ${is_docker_build} == "${true}" ]]; then
      die "Secrets directory (${runner_secrets_dir_path}) shouldn't contain files within docker build!"
    fi
    log_info "Cleaning up secrets within ${runner_secrets_dir_path}. This is expected when not in docker build"
    rm -rf "${runner_secrets_dir_path}"
  fi

  # docker daemon file can contain secrets
  if does_file_exist "${runner_docker_daemon_secret_file_path}"; then
    if [[ ${is_docker_build} == "${true}" ]]; then
      die "docker daemon file (${runner_docker_daemon_secret_file_path}) shouldn't be within docker build!"
    fi
    log_info "Cleaning up docker daemon file within ${runner_docker_daemon_secret_file_path}. This is expected when not in docker build."
    rm -rf "${runner_docker_daemon_secret_file_path}"
  else
    log_debug "docker daemon file (${runner_docker_daemon_secret_file_path}) wasn't found. Not doing cleanup actions."
  fi

  if [[ ${is_docker_build} == "${true}" ]]; then
    # We dont want to publish an image with log files
    log_debug "Deleting log directories within docker build"
    rm -rf "${container_logs_dir_path:?}/*" "${logs_dir_path:?}/*"
  fi

  # Misc other files that are not sensitive but we delete them anyway
  if is_directory_empty "${build_artifacts_dummy_secrets_dir_path}"; then
    log_debug "${build_artifacts_dummy_secrets_dir_path} is empty.  Not doing cleanup actions"
  else
    if [[ ${is_docker_build} == "${true}" ]]; then
      die "dummy secret directory (${build_artifacts_dummy_secrets_dir_path}) shouldn't contain files within docker build!"
    fi
    log_info "Cleaning up dummy secrets within ${build_artifacts_dummy_secrets_dir_path}. This is expected when not in docker build."
    rm -rf "${build_artifacts_dummy_secrets_dir_path}"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
if is_github_build; then
  # Dont tee to $bash_log_file_path as we dont allow logs within docker build
  main 2>&1 >&3
else
  main 2>&1 >&3 | tee -a "${bash_log_file_path}"
fi
