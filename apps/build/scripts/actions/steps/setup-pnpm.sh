#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --action=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      action="${flag_value}"
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
  create_directory "${shared_pnpm_store_dir_path}"

  case "${action}" in
    "initialize")
      initialize_pnpm
      ;;
    "fetch")
      pnpm fetch \
        --config.store-dir="${shared_pnpm_store_dir_path}"
      ;;
    *)
      die "${action} is not a valid action"
      ;;
  esac

}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
