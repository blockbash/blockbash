#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --lab_environment_dir_path=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      lab_environment_dir_path="${flag_value}"
      ;;
    --branch_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      branch_name="${flag_value}"
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
  local lab_guid_bash
  lab_guid_bash="$(get_build_lab_guid_bash "${lab_environment_dir_path}")"

  local lab_repo_names_full=(
    "$(get_lab_repo_name_full "${lab_guid_bash}" "${branch_name}")"
  )

  if ! does_command_exist "gh"; then
    die "Please install 'gh' to use this script"
  fi

  # GH_TOKEN: Hydrate the shell with the GH_TOKEN that gives access to the labs Github organization.
  local gh_token
  gh_token=$(get_secret "${secret_internal_github_token_name}")
  # bashsupport disable=BP2001
  export GH_TOKEN="${gh_token}"

  local gh_repo_create_flags=(
    --add-readme
    --disable-issues
    --disable-wiki
  )

  if is_github_build; then
    gh_repo_create_flags+=(--public)
  else
    gh_repo_create_flags+=(--private)
  fi

  if is_production_build "${branch_name}"; then
    gh_repo_create_flags+=(--homepage "${cloudflare_prod_blockbash_domain}")
  else
    gh_repo_create_flags+=(--homepage "${cloudflare_dev_blockbash_domain}")
  fi

  local lab_repo_name_full
  for lab_repo_name_full in "${lab_repo_names_full[@]}"; do
    if gh repo view "${lab_repo_name_full}" > /dev/null; then
      log_info "Repo ${lab_repo_name_full} already initialized.  No need to create repo"
    else
      log_info "Creating ${lab_repo_name_full}"
      # Creating a readme will add a file to the repo.
      # If a file in the repo doesn't exist, the file sync job will fail
      gh repo create "${gh_repo_create_flags[@]}" "${lab_repo_name_full}"
    fi
  done

}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
