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
  # ##############################################################################
  : << COMMENT

  cloudflare_branch:
    - develop cloudflare account:
      - pushes to develop branch will be made available at blockbash-dev.pages.dev
      - pushes to any branch will be made available to BRANCH_NAME.blockbash-dev.pages.dev
    - production cloudflare account:
      - pushes to production branch will be made available at blockbash.xyz

COMMENT
  # ##############################################################################

  if is_production_build "${branch_name}"; then
    local cloudflare_project_name="${cloudflare_prod_project_name}"
    local cloudflare_account_id="${cloudflare_prod_account_id}"
    local final_url="${cloudflare_prod_blockbash_domain}"
    local cloudflare_branch="${production_branch}"
  else
    local cloudflare_project_name="${cloudflare_dev_project_name}"
    local cloudflare_account_id="${cloudflare_dev_account_id}"
    local final_url="${branch_name}.${cloudflare_dev_blockbash_domain}"
    local cloudflare_branch="${develop_branch}"
  fi

  local cloudflare_api_token
  cloudflare_api_token="$(get_secret "${secret_cloudflare_token_base64_name}")"

  # bashsupport disable=BP2001
  export CLOUDFLARE_ACCOUNT_ID="${cloudflare_account_id}"
  # bashsupport disable=BP2001
  export CLOUDFLARE_API_TOKEN="${cloudflare_api_token}"

  # update_path(): Allow wrangler cli access
  update_path "${build_bin_dir_path}"

  if [[ "$(get_current_log_level)" == "${trace_level}" ]]; then
    # bashsupport disable=BP2001
    export WRANGLER_LOG=debug
  fi

  wrangler pages project create --production-branch="${cloudflare_branch}" "${cloudflare_project_name}" > /dev/null 2>&1 || true
  wrangler pages deploy --project-name="${cloudflare_project_name}" --commit-dirty="${true}" "${website_artifacts_build_dir_path}"
  log_info "You can now view the deployed website at ${final_url}"

  unset CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
