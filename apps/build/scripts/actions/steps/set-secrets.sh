#!/usr/bin/env bash

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

# Disable trace for secret setting
disable_trace

main() {
  create_directory "${runner_secrets_dir_path}"
  local secret_name secret_value file_path secret_env_var_names

  # secret_env_var_names - See README.md's: Configuration -> Secrets
  secret_env_var_names=(
    "${secret_cloudflare_token_base64_name}"
    "${secret_cosign_key_base64_name}"
    "${secret_cosign_password_base64_name}"
    "${secret_blockbash_app_private_key_base64_name}"
    "${secret_internal_github_token_name}"
  )
  for secret_name in "${secret_env_var_names[@]}"; do
    if [[ ${secret_name} == "${secret_internal_github_token_name}" ]]; then
      # GITHUB_TOKEN is NOT BASE64ed because:
      # - it's automatically passed (by Github) in a non-base64 format
      # - If it is set, it's leveraged by act for various cloning operations before it is decoded. (If it is base64ed there will be auth errors).
      secret_value="$(printenv "${secret_name}")"
    else
      secret_value="$(printenv "${secret_name}" | base64 --decode)"
    fi
    if [[ ${secret_value} != "${null_credential}" ]] && [[ -n ${secret_value} ]]; then
      # set_output_mask: Register decoded values as secrets (defense-in-depth measure)
      set_output_mask "${secret_name}" "${secret_value}"
      file_path="$(_get_secret_file_path "${secret_name}")"
      log_info "Secret found: ${secret_name}. Persisting at file path: ${file_path}"
      echo -n "${secret_value}" > "${file_path}"
      chmod 400 "${file_path}"
    fi
  done
}

exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
