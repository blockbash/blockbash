#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Generate FE embeddable slither outputs bb_current_lab_guid_bash
- Outputs go to lab-core/outputs/slither/*
- View create-website-build.sh comments for more context.

COMMENT
# ##############################################################################

die_on_error="true"

# shellcheck source=./../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

main() {
  local lab_guid_bash
  lab_guid_bash="$(get_container_lab_guid_bash)"

  local container_lab_contracts_dir_path
  container_lab_contracts_dir_path=$(get_lab_metadata_value "${key_container_lab_contracts_dir_path}" "${lab_guid_bash}")

  local container_lab_contracts_dir_name
  container_lab_contracts_dir_name="$(basename "${container_lab_contracts_dir_path}")"

  mkdir -p "${container_lab_core_outputs_slither_dir_path}"

  if [[ "${container_lab_contracts_dir_name}" == "${reentrancy_fundamentals_dir_name}" ]]; then

    execute_slither "${vulnerable_file_name}" "${reentrancy_fundamentals_file_name_prefix}" "${container_lab_contracts_dir_path}"

    execute_slither "${vulnerable_solution_pattern_0_contract_name}.sol" "${reentrancy_fundamentals_file_name_prefix}" "${container_lab_contracts_dir_path}"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
