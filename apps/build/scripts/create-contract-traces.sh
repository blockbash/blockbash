#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Create contract traces.
- Why dont we output these within the test suite?
  - Calling challenges:verify_solution will execute the challenge specific text replacements
- View bb-outputs-traces for more context

COMMENT
# ##############################################################################

die_on_error="true"

# shellcheck source=./../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

main() {
  # We need to do this before executing invoke_lab. If we don't
  # then we'll get compilation output in our first trace.
  invoke_contract_compilation

  local lab_guid_bash
  lab_guid_bash="$(get_container_lab_guid_bash)"

  local default_challenge_prompt_group_guid_typescript
  default_challenge_prompt_group_guid_typescript="$(get_lab_metadata_value "${key_default_challenge_prompt_group_guid_typescript}" "${lab_guid_bash}")"
  invoke_lab "${default_challenge_prompt_group_guid_typescript}" "${false}"

  local default_challenge_solution_group_guid_typescript
  default_challenge_solution_group_guid_typescript="$(get_lab_metadata_value "${key_default_challenge_solution_group_guid_typescript}" "${lab_guid_bash}")"

  # %? removes the last character from $default_challenge_solution_group_guid_typescript.
  # So reentrancyFundamentalsDefendSolutionPattern0 -> reentrancyFundamentalsDefendSolutionPattern
  # This is safe as default_challenge_solution_group_guid_typescript should always end with 0
  local file_path challenge_solution_group_guid
  for file_path in "${lab_core_challenge_groups_dir_path}/${default_challenge_solution_group_guid_typescript%?}"*; do
    # When the lab is invoked, the typescript logic will persist into traces/
    challenge_solution_group_guid=$(basename "${file_path}" ".spec.ts")
    invoke_lab "${challenge_solution_group_guid}" "${true}"
  done
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
