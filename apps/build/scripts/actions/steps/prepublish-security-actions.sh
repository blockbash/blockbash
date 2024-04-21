#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

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
    --image_name_with_branch_arch_full=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      image_name_with_branch_arch_full="${flag_value}"
      ;;
    --image_name_with_sha_full=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      image_name_with_sha_full="${flag_value}"
      ;;
    --is_scheduled_execution=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      is_scheduled_execution="${flag_value}"
      ;;
    --sbom_cache_hit=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      validate_bool "${flag_name}" "${flag_value}"
      sbom_cache_hit="${flag_value}"
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
  if [[ ${sbom_cache_hit} == "${false}" ]]; then
    local scope
    if is_production_build "${branch_name}"; then
      scope="all-layers"
    else
      # Reduce computational overhead in develop environments
      scope="squashed"
    fi
    log_info "Cached SBOM not found. Generating SBOM for ${image_name_with_branch_arch_full} (${image_name_with_sha_full})"
    create_directory "${build_security_tools_grype_sbom_dir_path}"

    # --from docker: Ensures that we pull local image that was just built and not
    # remote image from registry.  For some reason, using $image_name_with_sha_full wouldn't work when executing syft on Github.
    syft --scope "${scope}" \
      --output spdx-json \
      --from docker "${image_name_with_branch_arch_full}" > "${build_security_tools_grype_sbom_file_path}"
  else
    log_info "Skipping SBOM creation as cached version already exists"
  fi

  # TODO: Upload sarif results to github (in ticktick)
  local grype_sarif_file_path=/tmp/grype.sarif
  local grype_table_file_path=/tmp/grype.table
  local grype_flags=(
    --add-cpes-if-none
    --output "sarif=${grype_sarif_file_path}"
    --output "table=${grype_table_file_path}"
    --by-cve
    --only-fixed
  )

  # Dont fail build on image updates
  if is_production_build "${branch_name}" && [[ ${is_scheduled_execution} == "${false}" ]]; then
    grype_flags+=(
      --fail-on "critical"
    )
  fi

  log_info "Executing grype scan on ${build_security_tools_grype_sbom_file_path}"
  if
    ! GRYPE_DB_CACHE_DIR=${build_security_tools_grype_db_dir_path} grype "${grype_flags[@]}" sbom:"${build_security_tools_grype_sbom_file_path}"
  then
    return_status="${?}"
    die "Grype scanned failed: Status ${return_status}"
  fi
  log_info "Grype scan successful. Results..."
  log_file_contents "${grype_table_file_path}" "${info_level}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
