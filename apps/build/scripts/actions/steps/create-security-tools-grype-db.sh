#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  create_directory "${build_security_tools_grype_db_dir_path}"

  local return_code db_hash new_grype_db_file

  return_code=0
  GRYPE_DB_CACHE_DIR="${build_security_tools_grype_db_dir_path}" grype db check || return_code=$?

  new_grype_db_file=false
  if [[ ${return_code} -eq 100 ]]; then
    # Exit code should be 100 on available update
    # https://github.com/anchore/grype/blob/556c8c0dc24dbc7ec054fa4d115013912048610c/cmd/grype/cli/commands/db_check.go#L56C32-L56C32
    GRYPE_DB_CACHE_DIR="${build_security_tools_grype_db_dir_path}" grype db update
    new_grype_db_file=true
  elif [[ ${return_code} -ne 0 ]]; then
    die "Grype DB check failed with status code ${return_code}"
  fi

  db_hash="$(get_directory_hash "${build_security_tools_grype_db_dir_path}")"

  set_build_output "grype_db_dir_hash" "${db_hash}"
  set_build_output "new_grype_db_file" "${new_grype_db_file}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
