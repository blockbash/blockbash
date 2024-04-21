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
  pnpm_install "@blockbash/build..." "${shared_pnpm_store_dir_path}"
  pnpm_install "@blockbash/website..." "${shared_pnpm_store_dir_path}"

  local build_flags
  build_flags=(
    --out-dir="${website_artifacts_build_dir_path}"
  )

  if ! is_github_build; then
    build_flags+=("--dev")
  fi

  update_path "${website_bin_dir_path}"
  # cd into website_dir_path to leverage the correct build context
  cd "${website_dir_path}" || die "Couldn't cd into ${website_dir_path}"
  DOCUSAURUS_GENERATED_FILES_DIR_NAME="${website_artifacts_docusaurus_dir_path}" docusaurus build "${build_flags[@]}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
