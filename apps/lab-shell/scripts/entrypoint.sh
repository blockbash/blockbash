#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Init script when challenge container is executed.
  - workflow argument is set via the CMD Dockerfile instruction or when executing via 'docker run'
  - Text sent to stdout (from entrypoint.sh) may not be seen by the user.  This is because the devcontainer might be open but the user doesn't have their terminal open.  If logic needs to send output to the learner, leverage a "hook" script (apps/lab-shell/scripts/hooks).
  - When the learner opens the challenge environment, entrypoint.sh and tasks (within tasks.json) will be executed.

WORKFLOWS: Into the future, we could have different workflows for different IDE environments
  - devcontainer-vscode: Set by default in Dockerfile-primary.  Used for vscode-related devcontainers.


COMMENT
# ##############################################################################

# shellcheck source=./../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="false"

#The while loop will continue as long as there are arguments to process.
while [[ $# -gt 0 ]]; do
  argument_name="${1}"
  case "${argument_name}" in
    --workflow=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"

      validate_array_value "${flag_name}" "${flag_value}" execution_environment_workflows
      workflow="${flag_value}"
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

symlink_workspace() {
  local container_workspace_dir_path="${1}"
  local container_challenge_contracts_dir_path="${2}"

  local container_workspace_vscode_file_path="${container_workspace_dir_path}/${vscode_dir_name}/${vscode_tasks_file_name}"

  create_parent_directories_for_file "${container_workspace_vscode_file_path}" &&
    ln -fs "${container_challenge_contracts_dir_path}"/* "${container_workspace_dir_path}/" &&
    ln -fs "${build_artifacts_challenge_tasks_file_path}" "${container_workspace_vscode_file_path}" &&
    ln -fs "${lab_shell_solhint_file_path}" "${container_workspace_dir_path}/${solhint_file_name}" &&
    ln -fs "${container_repo_prettier_config_file_path}" "${container_workspace_dir_path}/${prettier_config_file_name}"

    # Remove unneeded files from learner environment
    rm -rf "${container_workspace_dir_path}/output"
}

main() {
  local challenge_guid_bash
  challenge_guid_bash=$(get_container_challenge_guid_bash)

  local container_challenge_contracts_dir_path
  container_challenge_contracts_dir_path=$(get_challenge_metadata_value "${key_container_challenge_contracts_dir_path}" "${challenge_guid_bash}")

  if [[ ${workflow} == "${challenge_workflow_devcontainer_vscode}" ]]; then
    log_info "Executing within vscode environment"

    # BLOCKBASH_WORKSPACE_DIR_PATH: Is declared within build-time.devcontainer.base.json
    # When the challenge environment is initialized, the value can be different depending on how the devcontainer is launched (thus we evaluate it within entrypoint.sh).
    # https://github.com/microsoft/vscode-remote-release/issues/3034
    if [[ -z ${BLOCKBASH_WORKSPACE_DIR_PATH} ]]; then
      die "BLOCKBASH_WORKSPACE_DIR_PATH was NOT set"
    fi

    set_container_state_value "${key_blockbash_workspace_dir_path}" "${BLOCKBASH_WORKSPACE_DIR_PATH}"

    if ! has_challenge_bootstrapped_before; then
      log_debug "${challenge_guid_bash} has not bootstrapped before"
      # entrypoint.sh executes every time the container is instantiated.
      # If the container has already been instantiated and the symlinks are overwritten,
      # this causes weird behavior with the vscode devcontainer extension.
      symlink_workspace "${BLOCKBASH_WORKSPACE_DIR_PATH}" "${container_challenge_contracts_dir_path}"
    else
      log_debug "${challenge_guid_bash} has bootstrapped before"
    fi

    # Always put this at the end!
    set_container_state_value "${key_has_bootstrapped}" "${true}"

    # Within the devcontainer, the entrypoint is essentially a background process
    # We leverage `sleep infinity` keep the devcontainer running
    sleep infinity
  else
    die "Unsupported workflow"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
