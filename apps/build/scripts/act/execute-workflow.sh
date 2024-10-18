#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Executes the act workflow that is leveraged to create the deployment (or create the runner image).

COMMENT
# ##############################################################################

die_on_error="true"

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="${die_on_error}"

log_trace "Disabling trace while credentials are being processed"
disable_trace

#The while loop will continue as long as there are arguments to process.
while [[ $# -gt 0 ]]; do
  argument_name="${1}"
  case "${argument_name}" in
    --blockbash_app_private_key_base64=*) # base64-value or "null"
      # Corresponds to the BLOCKBASH-CI-DEV Github App
      # within blockbash-labs-dev Github Org.
      # Is primarily leveraged to orchestrate lab repos.
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      blockbash_app_private_key_base64="${flag_value}"
      log_debug "Setting ${flag_name} to: REDACTED"
      ;;
    --github_token=*) # plaintext value or "null"
      # non-base64 value
      # GITHUB_TOKEN is automatically set when running in Github.
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      github_token="${flag_value}"
      log_debug "Setting ${flag_name} to: REDACTED"
      ;;
    --cloudflare_token_base64=*) # base64-value or "null"
      # Scoped to $cloudflare_dev_account_id
      # View README.md's Configuration -> Secrets for more context
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      cloudflare_token_base64="${flag_value}"
      log_debug "Setting ${flag_name} to: REDACTED"
      ;;
    --cosign_key_base64=*) # base64-value or "null"
      # View README.md's Configuration -> Secrets for more context
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      cosign_key_base64="${flag_value}"
      log_debug "Setting ${flag_name} to: REDACTED"
      ;;
    --cosign_password_base64=*) # base64-value or "null"
      # View README.md's Configuration -> Secrets for more context
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      cosign_password_base64="${flag_value}"
      log_debug "Setting ${flag_name} to: REDACTED"
      ;;
    --activate_1password=*) # "true" or "false"
      # Is leveraged to fetch all secrets via 1password cli
      # When "true", all secrets will be fetched via 1password even if they
      # are passed in as cli arguments
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      validate_bool "${flag_name}" "${flag_value}"
      activate_1password="${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      ;;
    --workflow_variant=*)
      # Can be act_workflow_variant_create_runner_image or null.  If null, the "traditional" CI process (that is invoked in Github) will be leveraged.
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"

      workflow_variant="${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" runner_workflow_variants
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

# Re-enable trace (if needed)
log_trace "Re-enabling trace"
set_global_shell_flags "${die_on_error}"

error_invalid_interface="ERROR_INVALID_INTERFACE"

get_act_server_interface_ip() {
  # ##############################################################################
  : << COMMENT

PURPOSE: Used to override the default network interface that act binds to.
- In certain situations, act wont function correctly if it doesn't bind to the
  active network interface.  In these cases, the host will have issues
   connecting to act's local artifact (or cache) servers.
 - act_server_primary_interface_override (in overrides.env): Allows you to specify a PRIMARY network interface that act should bind to (e.g., en0).
 - act_server_secondary_interface_override (in overrides.env): Allows you to specify a SECONDARY network interface that act should bind to (e.g., en1).
   This interface will only be leveraged if the PRIMARY interface is NOT active.

ERRORS:
- $error_invalid_interface: If at least one interface override is declared but no active interfaces can be found.

COMMENT
  # ##############################################################################

  local _interface declared_interfaces=()

  for _interface in "${act_server_interfaces[@]}"; do
    if [[ ${_interface} != "${null}" ]]; then
      declared_interfaces+=("${_interface}")
    fi
  done

  if is_array_empty declared_interfaces; then
    # No overrides specified.
    echo "${null}"
    return
  fi

  local _declared_interface valid_interface_ips=()
  for _declared_interface in "${declared_interfaces[@]}"; do
    if does_interface_exist "${_declared_interface}"; then
      valid_interface_ips+=("$(get_interface_ip "${_declared_interface}")")
    fi
  done

  if is_array_empty valid_interface_ips; then
    echo "${error_invalid_interface}"
    return
  fi

  # Return the highest priority interface ip
  echo "${valid_interface_ips[0]}"
}

main() {
  local act_flags

  create_directory "${host_act_artifact_dir_path}"
  create_directory "${host_act_action_cache_dir_path}"
  create_directory "${host_act_cache_server_dir_path}"

  # container_options_flags: If we want to leverage a file/directory that's within the
  # .gitignore, we must bind mount these directories/files.  See .gitignore comments for more context.
  local container_options_flags=(
    --mount "type=bind,source=${logs_dir_path},target=${logs_dir_path}"
    --mount "type=bind,source=${vscode_devcontainer_dir_path},target=${vscode_devcontainer_dir_path}"
    --mount "type=bind,source=${utils_local_config_dir_path},target=${utils_local_config_dir_path}"
  )

  act_flags=(
    --actor="${blessed_github_action_users[0]}"
    --directory="${blockbash_root_dir_path}"
    --defaultbranch="${production_branch}"
    --pull="${act_pull}"
    --artifact-server-path="${host_act_artifact_dir_path}"
    --action-cache-path="${host_act_action_cache_dir_path}"
    --cache-server-path="${host_act_cache_server_dir_path}"
    --workflows="${runner_execution_environment_workflows_dir_path}/create-deployment.yaml"
    --container-architecture="$(get_architecture)"
    # If you leverage --reuse, state can be persisted between runs which
    # can cause unexpected side effects with artifacts that are generated
    # during the build process
    --use-new-action-cache
    --container-options "${container_options_flags[*]}"
    #    --rm
    --matrix "lab_environment_dir_path:${build_lab_environments_dir_path}/${bb_current_lab_guid_bash}"
  )

  local act_server_override_ip
  act_server_override_ip="$(get_act_server_interface_ip)"
  if [[ ${act_server_override_ip} == "${error_invalid_interface}" ]]; then
    die "Act server interface overrides were specified but no ips were found.  This usually means that all specified interfaces are not active."
  fi

  if is_null "${act_server_override_ip}"; then
    log_info "No act network interface specified, leveraging default act ip"
  else
    log_info "Updating act network interface to ${act_server_override_ip}"
    act_flags+=(
      # These addresses should reflect an ACTIVE network interface
      # https://github.com/nektos/act/issues/1559
      --artifact-server-addr "${act_server_override_ip}"
      --cache-server-addr "${act_server_override_ip}"
    )
  fi

  # ##############################################################################
  : << COMMENT

  Act overrides workflow environment variables
  - All variables should be declared within global.yml
  - These environment variables will be set in all jobs. If a variable isn't needed
  in all jobs, we prefix with BLOCKBASH AND the JOB_NAME to avoid any conflicts between jobs.
  - If an environment variable is passed to all jobs, we drop the job prefix
  - act_flags (in all if branches) need to declare the same environment variable names

COMMENT
  # ##############################################################################

  if [[ ${workflow_variant} == "${act_workflow_variant_create_runner_image}" ]]; then
    # These values are hard coded as the runner image can only be created in one way
    log_info "Creating the act image"
    act_flags+=(
      --platform "ubuntu-22.04=${docker_act_non_customized_image_full}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_BASE_IMAGES_JOB=${true}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_ENVIRONMENTS_JOB=${false}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_REPOS_JOB=${false}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_FRONT_END_JOB=${false}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MATRIX_OUTPUTS_JOB=${false}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MULTI_ARCH_IMAGES_JOB=${false}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_SECURITY_VALIDATIONS=${false}"
      "--env=BLOCKBASH_GLOBAL_BRANCH_NAME=${docker_runner_image_branch}"
      "--env=BLOCKBASH_IS_LOCAL=${true}"
      "--env=BLOCKBASH_GLOBAL_IS_SCHEDULED_EXECUTION=${false}"
      "--env=BLOCKBASH_GLOBAL_SHOULD_PUBLISH=${false}"
      "--env=BLOCKBASH_GLOBAL_SHOULD_PUBLISH_IMAGES=${false}"
      "--env=BLOCKBASH_GLOBAL_TARGET_ARCHS=[\"$(get_architecture)\"]"
      "--env=BLOCKBASH_GLOBAL_TRIGGERING_ACTOR=${act_github_user_zachroofsec}"
      "--env=BLOCKBASH_GLOBAL_WORKFLOW_VARIANT=${act_workflow_variant_create_runner_image}"
      "--env=BLOCKBASH_LOG_LEVEL=$(get_current_log_level)"
    )
  elif [[ ${workflow_variant} == "${act_workflow_variant_null}" ]]; then
    log_info "Emulating aspects of the github actions deploy process locally. Leveraging values within overrides.env (if declared)."

    # ##############################################################################
    : << COMMENT

    Default Github Workflow values
    + Only applies to BLOCKBASH_* environment variables
    + keys AND values should correspond to env declarations within global.yaml
      + Exceptions:
        + Any value that is dynamically set within Github Actions.
        + Any value that (by definition) should be different in the local environment (e.g., BLOCKBASH_IS_LOCAL)
        + Any value that causes a state change in an external system (e.g., BLOCKBASH_GLOBAL_SHOULD_PUBLISH).  Default values should take into account "bb-act-no-cred".  In other words, assume the user doesn't have credentials.
    + These should NOT be stored within global.env as this file is referenced within the Github build, etc.
    + To override these values, declare the same KEY within utils/local-config/overrides.env
      + See README.md for more context on this file.

COMMENT
    # ##############################################################################

    local target_archs_default='["linux/amd64", "linux/arm64"]'
    act_flags+=(
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_BASE_IMAGES_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_BASE_IMAGES_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_ENVIRONMENTS_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_ENVIRONMENTS_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_REPOS_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_LAB_REPOS_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_FRONT_END_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_FRONT_END_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MATRIX_OUTPUTS_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MATRIX_OUTPUTS_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MULTI_ARCH_IMAGES_JOB=${BLOCKBASH_GLOBAL_ACTIVATE_CREATE_MULTI_ARCH_IMAGES_JOB:-${true}}"
      "--env=BLOCKBASH_GLOBAL_ACTIVATE_SECURITY_VALIDATIONS=${BLOCKBASH_GLOBAL_ACTIVATE_SECURITY_VALIDATIONS:-${true}}"
      "--env=BLOCKBASH_GLOBAL_BRANCH_NAME=${BLOCKBASH_GLOBAL_BRANCH_NAME:-$(get_current_git_branch)}"
      "--env=BLOCKBASH_IS_LOCAL=${BLOCKBASH_IS_LOCAL:-${true}}"
      "--env=BLOCKBASH_GLOBAL_IS_SCHEDULED_EXECUTION=${BLOCKBASH_GLOBAL_IS_SCHEDULED_EXECUTION:-${false}}"
      # BLOCKBASH_GLOBAL_SHOULD_PUBLISH: Default to false as we need to assume user doesn't have credentials
      "--env=BLOCKBASH_GLOBAL_SHOULD_PUBLISH=${BLOCKBASH_GLOBAL_SHOULD_PUBLISH:-${false}}"
      # BLOCKBASH_GLOBAL_SHOULD_PUBLISH_IMAGES: Default to false as we need to assume user doesn't have credentials
      "--env=BLOCKBASH_GLOBAL_SHOULD_PUBLISH_IMAGES=${BLOCKBASH_GLOBAL_SHOULD_PUBLISH_IMAGES:-${false}}"
      "--env=BLOCKBASH_GLOBAL_TARGET_ARCHS=${BLOCKBASH_GLOBAL_TARGET_ARCHS:-${target_archs_default}}"
      "--env=BLOCKBASH_GLOBAL_TRIGGERING_ACTOR=${BLOCKBASH_GLOBAL_TRIGGERING_ACTOR:-${act_github_user_zachroofsec}}"
      "--env=BLOCKBASH_GLOBAL_WORKFLOW_VARIANT=${BLOCKBASH_GLOBAL_WORKFLOW_VARIANT:-${null}}"
      "--env=BLOCKBASH_LOG_LEVEL=$(get_current_log_level)"
      --platform "ubuntu-22.04=$(get_image_name_with_branch_full "${docker_runner_image_branch}" "${docker_runner_image_name_short}")"
    )
  fi

  if [[ ${act_verbose_mode} == "${true}" ]]; then
    act_flags+=("--verbose")
  fi

  log_debug "Generated non-secret act flags..."
  log_debug "${act_flags[*]}"

  log_trace "Disabling trace while credentials are being processed"
  disable_trace

  # ##############################################################################
  : << COMMENT


  + All secret names need to be declared within secret_env_var_names within set-secrets.sh
  + With the exception of GITHUB_TOKEN all secrets should be base64 encoded.
    + To help in this process you can use: pbpaste | base64 | pbcopy
    + If you do NOT want to set a secret, pass the "secret" that is generated via get_base64_null_credential() to act.  If set-secrets.sh sees this value, the secret wont be "officially" set.
    + If you want to pass a "dummy" secret (for local testing), leverage get_base64_dummy_secret()
  + custom secret names can't start with github_*
  + github secrets are automatically capitalized (in the github UI)
  + When setting secrets within Github, we always set the non-base64 variant to ensure the secret isn't accidentally shown in the logs after the base64 decode.

COMMENT
  # ##############################################################################

  if [[ ${activate_1password} == "${true}" ]]; then
    log_info "activate_1password == true. Ignoring all secrets values except the ones that are defined in 1password"
  fi

  if [[ ${activate_1password} == "${true}" ]]; then
    act_flags+=("--secret=${secret_blockbash_app_private_key_base64_name}=$(get_1password_secret "${op_blockbash_app_private_key_base64_url}")")
  elif [[ ${blockbash_app_private_key_base64} == "${null}" ]]; then
    act_flags+=("--secret=${secret_blockbash_app_private_key_base64_name}=$(get_base64_null_credential)")
  else
    act_flags+=("--secret=${secret_blockbash_app_private_key_base64_name}=${blockbash_app_private_key_base64}")
  fi

  create_directory "${build_artifacts_dummy_secrets_dir_path}"
  if [[ ${activate_1password} == "${true}" ]]; then
    act_flags+=("--secret=${secret_cosign_password_base64_name}=$(get_1password_secret "${op_cosign_password_base64_url}")")
  elif [[ ${cosign_password_base64} == "${null}" ]]; then
    # cosign_password_base64: We create a "dummy" secret that can be used to test the cosign functionality.  This secret is only leveraged in the local environment.  If we use get_base64_null_credential(), this will omit the dummy secret from actually being set within set-secret.sh
    cosign_password_base64="$(get_base64_dummy_secret)"
    act_flags+=("--secret=${secret_cosign_password_base64_name}=${cosign_password_base64}")
    rm -rf "${build_artifacts_dummy_cosign_password_file_path}"
    base64_decode "${cosign_password_base64}" > "${build_artifacts_dummy_cosign_password_file_path}"
    log_info "Saved dummy COSIGN_PASSWORD at ${build_artifacts_dummy_cosign_password_file_path}"
  else
    act_flags+=("--secret=${secret_cosign_password_base64_name}=${cosign_password_base64}")
  fi

  if [[ ${activate_1password} == "${true}" ]]; then
    act_flags+=("--secret=${secret_cosign_key_base64_name}=$(get_1password_secret "${op_cosign_key_base64_url}")")
  elif [[ ${cosign_key_base64} == "${null}" ]]; then
    create_dummy_cosign_key_pair "${cosign_password_base64}"
    act_flags+=("--secret=${secret_cosign_key_base64_name}=$(get_base64_cosign_key)")
  else
    act_flags+=("--secret=${secret_cosign_key_base64_name}=${cosign_key_base64}")
  fi

  #  secret_external_github_token_name: View "secrets" within README.md
  if [[ ${activate_1password} == "${true}" ]]; then
    act_flags+=("--secret=${secret_external_github_token_name}=$(get_1password_secret "${op_github_token_url}")")
  elif [[ ${github_token} == "${null}" ]]; then
    log_info "Not setting ${secret_external_github_token_name}"
    # ##############################################################################
    : << COMMENT
      Traditionally, the omission of a credential is signified by setting the secret to "dummy_cred"

      However, if secret.GITHUB_TOKEN is set, act will try to use the value when cloning external github actions (e.g., actions/cache@v3).  If "dummy_cred" is leveraged, this will lead to invalid credential errors.
      Thus, when this credential isn't set (e.g., 'bb-act-no-cred'), we have to leave secret.GITHUB_TOKEN unset.

      For simplicity, our "internal" representation of GITHUB_TOKEN is '_GITHUB_TOKEN'.  If secret.GITHUB_TOKEN isn't set, 'secret._GITHUB_TOKEN' is set to "dummy_cred" within create-deployment.yaml
COMMENT
    # ##############################################################################
  else
    act_flags+=("--secret=${secret_external_github_token_name}=${github_token}")
  fi

  if [[ ${activate_1password} == "${true}" ]]; then
    act_flags+=("--secret=${secret_cloudflare_token_base64_name}=$(get_1password_secret "${op_cloudflare_token_base64_url}")")
  elif [[ ${cloudflare_token_base64} == "${null}" ]]; then
    act_flags+=("--secret=${secret_cloudflare_token_base64_name}=$(get_base64_null_credential)")
  else
    act_flags+=("--secret=${secret_cloudflare_token_base64_name}=${cloudflare_token_base64}")
  fi

  # Intentionally invoke act with a SPACE prefix to help avoid cli flags from
  # being stored within shell history file.
  act "${act_flags[@]}" || true
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
