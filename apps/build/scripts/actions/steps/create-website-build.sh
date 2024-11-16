#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Create website build
  -  Within the lab, the learner only executes "Vulnerable.sol" or "Attacker.sol" (not "VulnerableSolutionPattern0.sol", etc.).  We have names like "VulnerableSolutionPattern0" as the contract names need to be unique
    - We normalize the contract names to avoid confusion.  In other words "VulnerableSolutionPattern0.sol" -> "Vulnerable.sol" in the UI.
    - lab-core/outputs/*, lab-core/contracts/*
      - Is normalized via text-replace/index.ts before being rendered in the UI.
      - To create lab-core/outputs/*, you need to execute bb-outputs-* within the local environment.  As bb-outputs-* generates outputs from third party commands, we generate the outputs in the local environment so we can see how the outputs changed BEFORE pushing to production.
    - lab-core/artifacts/diffs/*
      - Is normalized via create-git-diffs.sh before being rendered in the UI.  As Vulnerable and VulnerableSolution contracts can be diffed, the contract name differences can be shown within the diff.  Thus, we don't solely rely on text-replace/index.ts to normalize.  We do the normalization before creating the diff.
      - As these diffs are being generated from internal content, they are generated in CI and NOT committed directly into the repo.

COMMENT
# ##############################################################################

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

#The while loop will continue as long as there are arguments to process.
while [[ $# -gt 0 ]]; do
  argument_name="${1}"
  case "${argument_name}" in
    --is_interactive_shell=*) # "true" or "false"
      # true: Used within local environment AND not a part of act build
      # false: Used within an act/github build
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      validate_bool "${flag_name}" "${flag_value}"
      is_interactive_shell="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    *)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      die "${flag_name} is not a valid argument"
      ;;
  esac
  unset argument_name flag_value flag_name
  shift
done

main() {
  if [[ ${is_interactive_shell} == "${false}" ]]; then
    pnpm_install "@blockbash/build..." "${shared_pnpm_store_dir_path}"
    pnpm_install "@blockbash/website..." "${shared_pnpm_store_dir_path}"
  fi

  bash "${build_scripts_dir_path}/create-git-diffs.sh"

  local build_flags
  build_flags=(
    --out-dir="${website_artifacts_build_dir_path}"
  )

  local start_flags
  start_flags=(
    --no-open
    --hot-only
  )

  chmod -R 755 "${website_bin_dir_path}"
  update_path "${website_bin_dir_path}"
  # cd into website_dir_path to leverage the correct build context
  cd "${website_dir_path}" || die "Couldn't cd into ${website_dir_path}"

  if [[ ${is_interactive_shell} == "${true}" ]]; then
    #    bb-format is executed on commit. However, we might not have committed yet
    #    we want to ensure files are formatted before displaying in UI
    bb-format --website-files-only=true

    if ! is_null "${bb_site_clear_dir_path}"; then
      log_info "Removing ${bb_site_clear_dir_path}"
      rm -rf "${bb_site_clear_dir_path}"
    fi

    # By deleting artifacts, it will allow us to test changes for "imported" cli outputs and git diffs
    rm -rf "${website_artifacts_docusaurus_dir_path}" && mkdir -p "${website_artifacts_docusaurus_dir_path}"
    DOCUSAURUS_GENERATED_FILES_DIR_NAME="${website_artifacts_docusaurus_dir_path}" docusaurus start "${start_flags[@]}"
  else
    DOCUSAURUS_GENERATED_FILES_DIR_NAME="${website_artifacts_docusaurus_dir_path}" docusaurus build "${build_flags[@]}"
  fi

}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
