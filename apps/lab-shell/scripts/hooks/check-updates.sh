#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Checks for new releases when learner opens the lab environment.

COMMENT
# ##############################################################################

# BLOCKBASH_LOG_LEVEL: When this file is executed, it is backgrounded and stdout is sent to a log file.  By setting a 'trace' BLOCKBASH_LOG_LEVEL, we allow the learner to submit granular debugging logs.
export BLOCKBASH_LOG_LEVEL=trace

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. /blockbash/packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

get_repo() {
  local repo_name_full="${1}"
  local repo_dir_path="${2}"

  local temp_dir
  temp_dir=$(mktemp --directory --tmpdir="${container_internal_dir_path}")

  if is_in_codespace; then
    log_debug "Within codespace, attempting 'gh repo clone' for updates"
    # This will leverage the GITHUB_TOKEN that is associated with the codespace
    # This allows the repo to be private
    if ! gh repo clone "${repo_name_full}" -- "${temp_dir}"; then
      return 1
    fi
  else
    log_debug "Not within codespace, attempting 'git clone' for updates"
    # DOCS: There are some cases when you may be cloning your repository using SSH keys instead of a credential helper. To enable this scenario, the extension will automatically forward your local SSH agent if one is running.
    # https://code.visualstudio.com/remote/advancedcontainers/sharing-git-credentials
    if ! git clone "${git_user}@${github_primary_domain}:${repo_name_full}.git" "${temp_dir}"; then
      return 1
    fi
  fi
  mv --force "${temp_dir}" "${repo_dir_path}"
  rm -rf "${temp_dir}"
}

get_remote_devcontainer_file() {
  local lab_repo_name_full="${1}"
  local remote_devcontainer_file_url="${2}"

  if is_local_dev_env; then
    log_debug "Within local build which means ${lab_repo_name_full} could be private.  Fetching via git (or gh) cli"
    if ! get_repo "${lab_repo_name_full}" "${container_remote_devcontainer_dir_path}"; then
      return 1
    fi
  else
    # For public repos, curl is the simplest method for fetching.
    log_debug "Not within a local build, using curl for updates"

    if ! download_file "${remote_devcontainer_file_url}" "${container_remote_config_file_path}" "${true}"; then
      # die will occur in outer function call
      return 1
    fi
  fi
  log_info "Successfully fetched remote config from ${lab_repo_name_full}"
  log_file_contents "${container_remote_config_file_path}" "${debug_level}"
}

main() {
  if [[ ${disable_check_lab_updates} == "${true}" ]]; then
    # If bb-act-no-cred is leveraged, a lab repo wont be in Github.  For cases like this, it's recommended to set disable_lab_check_updates == "true" within overrides.env
    log_debug "Skipping lab update check as disable_lab_check_updates == 'true'"
    return
  fi

  if ! is_url_available "${github_url}"; then
    log_warning "Github (or general internet) is not available. All update checks will be skipped.  Unfortunately, this means that you might be using an old version of this lab."
    return
  else
    log_debug "${github_url} is available"
  fi

  local lab_guid_bash
  lab_guid_bash="$(get_container_lab_guid_bash)"

  local remote_devcontainer_file_url
  remote_devcontainer_file_url="$(get_lab_metadata_value "${key_remote_devcontainer_file_url}" "${lab_guid_bash}")"

  local blockbash_workspace_dir_path
  blockbash_workspace_dir_path="$(get_container_state_value "${key_blockbash_workspace_dir_path}")"

  local lab_repo_name_full
  lab_repo_name_full="$(get_lab_metadata_value "${key_lab_repo_name_full}" "${lab_guid_bash}")"

  rm -rf "${container_remote_devcontainer_dir_path}"

  if ! get_remote_devcontainer_file "${lab_repo_name_full}" "${remote_devcontainer_file_url}"; then
    if is_local_dev_env; then
      die "Couldn't pull latest lab version from ${remote_devcontainer_file_url}.  All update checks will be skipped.  This can be expected if the lab repo hasn't been created within Github or if the repo is private and there was a problem authenticating.  To disable update checks, navigate to overrides.env and set 'disable_check_lab_updates' to 'true'"
    else
      die "Couldn't pull latest lab version from ${remote_devcontainer_file_url}.  All update checks will be skipped.  Unfortunately, this means that you might be using an old version of this lab."
    fi
  fi

  local local_release
  local_release="$(get_lab_metadata_value "${key_lab_release}" "${lab_guid_bash}")"

  local remote_release
  remote_release="$(get_remote_devcontainer_metadata_value "${key_lab_release}")"

  if [[ ${remote_release} -gt ${local_release} ]]; then
    # The 'task update' command (referenced below) should rebuild the devcontainer "without cache".  Ideally, this would re-clone the lab repo and leverage the latest devcontainer configuration file.  However, it doesn't do this.
    # To counteract this, we manually update the devcontainer configuration.
    # This new configuration will only be activated if the devcontainer is rebuilt.
    cp "${container_remote_config_file_path}" "${blockbash_workspace_dir_path}/${devcontainer_hidden_file_name}"
    log_warning "There is an update available.  To use the latest version, please follow the steps below:\n
    1. OPTIONAL: The update will reset all information in the lab environment.  If you want to keep your work, please move it out of the lab environment before moving to the next step.\n
    2. Ensure that the current window has a title of 'Blockbash'.\n
    3. Press the 'f1' key.\n
    4. Delete '>' from the input box.\n
    5. Add 'task update' to the input box (without the quotes).\n
    6. Press the 'RETURN' key."
  else
    log_info "No update needed"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
