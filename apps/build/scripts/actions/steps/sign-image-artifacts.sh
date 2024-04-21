#!/usr/bin/env bash

die_on_error="true"

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

#The while loop will continue as long as there are arguments to process.
while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --branch_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      branch_name="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --image_name_with_sha_full=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      image_name_with_sha_full="${flag_value}"
      ;;
    --should_publish=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      should_publish="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --should_publish_images=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      should_publish_images="${flag_value}"
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
  log_trace "Disabling trace while credentials are being processed"
  disable_trace

  local tlog_upload
  if is_production_build "${branch_name}"; then
    tlog_upload="${true}"
  else
    # We dont want to clutter the tlog for non-production deploys
    log_info "Disabling tlog upload as we're not engaging in a production build"
    tlog_upload="${false}"
  fi

  local cosign_shared_flags
  cosign_shared_flags=(
    --yes=true
    --key="$(get_secret_file_path "${secret_cosign_key_base64_name}")"
    --tlog-upload="${tlog_upload}"
  )

  local no_upload_flag upload_flag
  # Relates to pushing signatures to registry
  if [[ ${should_publish_images} == "${true}" && ${should_publish} == "${true}" ]]; then
    docker_login "${github_primary_org_name_prod}" "${die_on_error}"
    no_upload_flag="${false}"
    upload_flag="${true}"
  else
    no_upload_flag="${true}"
    upload_flag="${false}"
  fi

  local cosign_attest_flags
  cosign_attest_flags=(
    "${cosign_shared_flags[@]}"
    --predicate="${build_security_tools_grype_sbom_file_path}"
    --type=spdxjson
    --no-upload="${no_upload_flag}"
  )

  local cosign_sign_flags
  cosign_sign_flags=(
    "${cosign_shared_flags[@]}"
    --upload="${upload_flag}"
  )

  # It appears that COSIGN_PASSWORD has to be passed as an ENV VAR
  local cosign_password
  cosign_password="$(get_secret "${secret_cosign_password_base64_name}")"
  # bashsupport disable=BP2001
  export COSIGN_PASSWORD="${cosign_password}"

  log_info "Starting cosign attest"
  cosign attest \
    "${cosign_attest_flags[@]}" "${image_name_with_sha_full}"

  log_info "Starting cosign sign"
  cosign sign \
    "${cosign_sign_flags[@]}" \
    "${image_name_with_sha_full}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
