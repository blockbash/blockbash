#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Create git diffs for website lessons.


COMMENT
# ##############################################################################

die_on_error="true"

# shellcheck source=./../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

normalize_output() {
  local start_file_path="${1}"
  local end_file_path="${2}"

  # Review create-website-build.sh for more context.

  # IMPORTANT: Logic should mimic what's in globalTextReplacements.
  # Review create-website-build.sh for more context.
  log_info "Normalizing contract ${start_file_path}.  Destination: ${end_file_path}"
  sed "s/${attacker_solution_contract_name_prefix}[0-9]/${attacker_contract_name}/g" "${start_file_path}" | sed "s/${vulnerable_solution_contract_name_prefix}[0-9]/${vulnerable_contract_name}/g" > "${end_file_path}"
}

create_diff() {
  local start_file_path="${1}" # File that represents the "before" state
  local end_file_path="${2}"   # File that represents the "after" state
  local diff_file_path="${3}"

  local start_normalized_file_path
  start_normalized_file_path=$(mktemp)
  normalize_output "${start_file_path}" "${start_normalized_file_path}"

  local end_normalized_file_path
  end_normalized_file_path=$(mktemp)
  normalize_output "${end_file_path}" "${end_normalized_file_path}"

  create_git_diff \
    "${start_normalized_file_path}" \
    "${end_normalized_file_path}" \
    "${diff_file_path}"

  rm -rf "${start_normalized_file_path}" "${end_normalized_file_path}"
}

main() {
  # Remove previous DIFFs (this helps if file names change)
  rm -rf "${lab_core_diffs_dir_path:?}"/*.txt
  local start_file_path end_file_path common_file_path diff_file_path

  # reentrancy-fundamentals contracts
  local i
  for i in {0..2}; do
    common_file_path="${lab_core_reentrancy_fundamentals_contracts_dir_path}"
    start_file_path="${common_file_path}/${vulnerable_file_name}"
    end_file_path="${common_file_path}/${vulnerable_solution_contract_name_prefix}${i}.sol"
    diff_file_path="${lab_core_diffs_contracts_dir_path}/${reentrancy_fundamentals_dir_name}/${vulnerable_solution_contract_name_prefix}${i}.txt"
    create_diff "${start_file_path}" "${end_file_path}" "${diff_file_path}"
  done

  # reentrancy-fundamentals slither
  shared_file_name="${reentrancy_fundamentals_file_name_prefix}${vulnerable_solution_pattern_0_contract_name}.txt"
  start_file_path="${lab_core_outputs_slither_dir_path}/${reentrancy_fundamentals_file_name_prefix}${vulnerable_contract_name}.txt"
  end_file_path="${lab_core_outputs_slither_dir_path}/${shared_file_name}"
  diff_file_path="${lab_core_diffs_slither_dir_path}/${shared_file_name}"
  create_diff "${start_file_path}" "${end_file_path}" "${diff_file_path}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
