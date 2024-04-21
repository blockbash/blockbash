#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Creates a configuration file for BetaHuhn/repo-file-sync-action@v1

COMMENT
# ##############################################################################

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
    --challenge_environment_dir_path=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      challenge_environment_dir_path="${flag_value}"
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
  local challenge_guid_bash challenge_repo_name_full image_name_short image_name_with_branch_full release container_name

  challenge_guid_bash="$(get_build_challenge_guid_bash "${challenge_environment_dir_path}")"
  challenge_repo_name_full=$(get_challenge_repo_name_full "${challenge_guid_bash}" "${branch_name}")

  tee -a "${runner_github_sync_file}" << EOF
${challenge_repo_name_full}:
  - source: $(get_devcontainer_artifact_file_path "${challenge_guid_bash}" "${run_time_prefix}")
    dest: ${devcontainer_hidden_file_name}
EOF
  log_file_contents "${runner_github_sync_file}" "${debug_level}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
