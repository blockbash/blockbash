#!/usr/bin/env bash

die_on_error="true"

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --image_name_with_branch_arch_full=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      image_name_with_branch_arch_full="${flag_value}"
      ;;
    --should_publish=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      validate_bool "${flag_name}" "${flag_value}"
      should_publish="${flag_value}"
      ;;
    --should_publish_images=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      should_publish_images="${flag_value}"
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
  if [[ ${should_publish} == "${true}" && ${should_publish_images} == "${true}" ]]; then
    docker_login "${github_primary_org_name_prod}" "${die_on_error}"
    log_info "Pushing container image to ${image_name_with_branch_arch_full}"
    docker push "${image_name_with_branch_arch_full}"
  else
    log_info "Not publishing image due to publish configurations"
    log_info "Would have executed: docker push ${image_name_with_branch_arch_full}"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
