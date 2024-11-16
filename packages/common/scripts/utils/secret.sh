#!/usr/bin/env bash

_get_secret() {
  # This function doesn't use validations!
  # You probably want to use get_secret

  # Cant echo/log any information (beside the secret) from this function
  # (or any invoked/child functions)
  # If you do, the echoed message will be in the get_secret output
  # Exception: die function as the execution is aborted anyway

  local secret_name="${1}"

  get_file_contents "$(_get_secret_file_path "${secret_name}")"
}

_get_secret_file_path() {
  # IMPORTANT: This function doesn't use validations!

  # You probably want to use:
  # - get_secret_file_path OR
  # - is_secret_set

  # Cant echo/log any information (beside the secret) from this function
  # (or any invoked/child functions)
  # If you do, the echoed message will be in the get_secret output
  # Exception: die function as the execution is aborted anyway

  local secret_name="${1}"

  echo -n "${runner_secrets_dir_path}/${secret_name}"
}

get_secret() {
  # Cant echo/log any information (beside the secret) from this function
  # (or any invoked/child functions)
  # If you do, the echoed message will be in the get_secret output
  # Exception: die function as the execution is aborted anyway
  local secret_name="${1}"

  if ! is_secret_set "${secret_name}"; then
    die "Secret (${secret_name}) was NOT found!"
  fi

  local secret
  secret="$(_get_secret "${secret_name}")"
  echo -n "${secret}"
}

get_secret_file_path() {
  local secret_name="${1}"
  if ! is_secret_set "${secret_name}"; then
    die "${secret_name} is not set"
  fi
  _get_secret_file_path "${secret_name}"
}

is_secret_set() {
  # Cant echo/log any information (beside the secret) from this function
  # (or any invoked/child functions)
  # If you do, the echoed message will be in the get_secret output
  # Exception: die function as the execution is aborted anyway

  local secret_name="${1}"

  if [[ -f $(_get_secret_file_path "${secret_name}") ]] && [[ -n $(_get_secret "${secret_name}") ]]; then
    # Returns truthy to caller
    true
  else
    # Returns falsey to caller
    false
  fi
}

set_output_mask() {
  # We already register all base64 secrets within Github Actions
  # In theory, this should redact the secret from the Github Action logs
  # As an additional precaution, we also register the base64 decoded value
  # as a secret within Github Actions as well (see "secrets" within README.md)
  # However, sometimes multiline secrets can leave edge cases, so we account
  # for this here.  This will also apply "add-mask" to single-line secrets as well

  local name="${1}"
  local value="${2}"

  log_info "Re-registering ${name} as secret"

  # Attempt to mask multi-line secrets
  echo "${value}" | while read line; do
    echo "::add-mask::${line}"
  done
}

get_base64_null_credential() {
  # If you do NOT want to set a secret, pass the "secret" that is generated via this function.  If set-secrets.sh sees this value, the secret wont be "officially" set.
  base64_encode "${null_credential}"
}

get_base64_dummy_secret() {
  base64_encode "$(get_random_value)"
}

get_1password_secret() {
  local op_url="${1}"
  op read "${op_url}"
}

create_dummy_cosign_key_pair() {
  local base64_cosign_password="${1}"

  cd "${build_artifacts_dummy_secrets_dir_path}" || die "Problem with dummy secrets directory navigation"
  rm -rf "${build_artifacts_dummy_cosign_pub_file_path}" "${build_artifacts_dummy_cosign_key_file_path}"

  # Will create cosign.key AND cosign.pub in the CWD
  COSIGN_PASSWORD="$(base64_decode "${base64_cosign_password}")" cosign \
    generate-key-pair \
    --output-key-prefix "${cosign_prefix}"
  cd - || die "Problem with dummy secrets directory navigation"
  log_info "Created ${build_artifacts_dummy_cosign_pub_file_path} and ${build_artifacts_dummy_cosign_key_file_path}. This will help you test the cosign operations"
}

get_base64_cosign_key() {
  base64_encode "$(get_file_contents "${build_artifacts_dummy_cosign_key_file_path}")"
}
