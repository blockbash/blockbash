#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

main() {
  local blockbash_app_private_key_base64
  blockbash_app_private_key_base64="$(get_secret "${secret_blockbash_app_private_key_base64_name}")"

  # set_multi_line_env_var: We can only pass strings into actions/create-github-app-token@v1
  set_multi_line_env_var "${secret_blockbash_app_private_key_base64_name}" "${blockbash_app_private_key_base64}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
