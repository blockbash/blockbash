#!/usr/bin/env bash
# ##############################################################################
# PURPOSE: Create values that will be referenced in other actions.
# - Always executes before all other execution_environment_workflows.
# - Wherever possible, use this script for input validation.
# ##############################################################################

# shellcheck source=./../../../../../packages/common/scripts/source-all.sh
. packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="true"

while [ $# -gt 0 ]; do
  argument_name="${1}"
  case "${argument_name}" in
    --activate_create_base_images_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_base_images_job="${flag_value}"
      ;;
    --activate_create_challenge_environments_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_challenge_environments_job="${flag_value}"
      ;;
    --activate_create_challenge_repos_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_challenge_repos_job="${flag_value}"
      ;;
    --activate_create_front_end_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_front_end_job="${flag_value}"
      ;;
    --activate_create_matrix_outputs_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_matrix_outputs_job="${flag_value}"
      ;;
    --activate_create_multi_arch_images_job=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_create_multi_arch_images_job="${flag_value}"
      ;;
    --activate_security_validations=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      activate_security_validations="${flag_value}"
      ;;
    --blockbash_log_level=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      validate_array_value "${flag_name}" "${flag_value}" log_levels
      blockbash_log_level="${flag_value}"
      ;;
    --blockbash_is_local=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"

      validate_bool "${flag_name}" "${flag_value}"
      blockbash_is_local="${flag_value}"
      ;;
    --branch_name=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      branch_name="${flag_value}"
      ;;
    --triggering_actor=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      triggering_actor="${flag_value}"
      ;;
    --is_scheduled_execution=*)
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"

      validate_bool "${flag_name}" "${flag_value}"
      is_scheduled_execution="${flag_value}"
      ;;
    --should_publish=*) # true/false
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      should_publish="${flag_value}"
      ;;
    --should_publish_images=*) # true/false
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      validate_bool "${flag_name}" "${flag_value}"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      should_publish_images="${flag_value}"
      ;;
    --target_archs=*) # '["linux/arm64"]'
      flag_name="$(get_cli_flag_name "${argument_name}")"
      flag_value="$(get_cli_flag_value "${argument_name}")"
      log_debug "Setting ${flag_name} to: ${flag_value}"
      # Validation is downstream (after values have been parsed)
      target_archs="${flag_value}"
      ;;
    --workflow_variant=*) # "create-runner-image" OR "null"
      # null: no variant (normal workflow)
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
  if [[ -z ${flag_value} ]]; then
    die "${flag_name} does not have a value"
  else
    unset argument_name flag_value flag_name
  fi
  shift
done

main() {

  # ##############################################################################
  # VALIDATIONS
  # - global.yaml is a dependency for all jobs.  Thus, these validations should execute on each workflow execution.
  # ##############################################################################

  validate_array_value "blessed_github_action_users" "${triggering_actor}" blessed_github_action_users

  if [[ ${activate_security_validations} == "${false}" ]] && is_github_build; then
    die "Security validations cant be disabled in hosted environments"
  fi

  if [[ ${should_publish_images} == "${true}" ]] && [[ ${should_publish} == "${false}" ]]; then
    die "You must set should_publish == true if should_publish_images == true"
  fi

  local should_user_environment_die_on_error github_challenges_org_name github_challenges_org_app_id
  if is_production_build "${branch_name}"; then
    should_user_environment_die_on_error="${false}"
    github_challenges_org_name="${github_challenges_org_name_prod}"
    github_challenges_org_app_id="${github_challenges_org_app_id_prod}"
  else
    # should_user_environment_die_on_error: Force errors to "bubble up" in non-prod for quicker feedback
    should_user_environment_die_on_error="${true}"
    github_challenges_org_name="${github_challenges_org_name_dev}"
    github_challenges_org_app_id="${github_challenges_org_app_id_dev}"
  fi

  local workflow_uuid
  workflow_uuid=$(get_random_value)

  local publish_images_matrix_outputs
  publish_images_matrix_outputs="${workflow_uuid}-publish-images-matrix-outputs"

  # primary_json_string: Create config values that will be passed to downstream jobs as environment variables.
  local primary_json_string
  primary_json_string=$(jq "${jq_common_flags[@]}" --null-input --compact-output \
    --arg BLOCKBASH_LOG_LEVEL "${blockbash_log_level}" \
    --arg BLOCKBASH_IS_LOCAL "${blockbash_is_local}" \
    --arg activate_create_base_images_job "${activate_create_base_images_job}" \
    --arg activate_create_challenge_environments_job "${activate_create_challenge_environments_job}" \
    --arg activate_create_challenge_repos_job "${activate_create_challenge_repos_job}" \
    --arg activate_create_front_end_job "${activate_create_front_end_job}" \
    --arg activate_create_matrix_outputs_job "${activate_create_matrix_outputs_job}" \
    --arg activate_create_multi_arch_images_job "${activate_create_multi_arch_images_job}" \
    --arg activate_security_validations "${activate_security_validations}" \
    --arg branch_name "${branch_name}" \
    --arg branch_name "${branch_name}" \
    --arg build_artifacts_dir_path "${build_artifacts_dir_path}" \
    --arg build_dockerfile_primary_file_path "${build_dockerfile_primary_file_path}" \
    --arg build_matrix_outputs_dir_path "${build_matrix_outputs_dir_path}" \
    --arg build_matrix_outputs_final_dir_path "${build_matrix_outputs_final_dir_path}" \
    --arg build_scripts_workflow_steps_dir_path "${build_scripts_workflow_steps_dir_path}" \
    --arg cache_key_grype "${cache_key_grype}" \
    --arg cache_key_pnpm "${cache_key_pnpm}" \
    --arg cache_key_security_tools_debs "${cache_key_security_tools_debs}" \
    --arg challenges_github_org_app_id_dev "${github_challenges_org_app_id_dev}" \
    --arg challenges_github_org_app_id_prod "${github_challenges_org_app_id_prod}" \
    --arg common_scripts_dir_path "${common_scripts_dir_path}" \
    --arg common_scripts_init_dir_path "${common_scripts_init_dir_path}" \
    --arg docker_challenge_base_image_name_short "${docker_challenge_base_image_name_short}" \
    --arg docker_runner_image_name_short "${docker_runner_image_name_short}" \
    --arg github_challenges_org_app_id "${github_challenges_org_app_id}" \
    --arg github_challenges_org_name "${github_challenges_org_name}" \
    --arg is_scheduled_execution "${is_scheduled_execution}" \
    --arg publish_images_matrix_outputs_post "${publish_images_matrix_outputs}_post" \
    --arg publish_images_matrix_outputs_pre "${publish_images_matrix_outputs}_pre" \
    --arg runner_secrets_dir_path "${runner_secrets_dir_path}" \
    --arg build_security_tools_debs_dir_path "${build_security_tools_debs_dir_path}" \
    --arg build_security_tools_grype_db_dir_path "${build_security_tools_grype_db_dir_path}" \
    --arg build_security_tools_grype_sbom_dir_path "${build_security_tools_grype_sbom_dir_path}" \
    --arg shared_pnpm_root_dir_path "${shared_pnpm_root_dir_path}" \
    --arg shared_pnpm_store_dir_path "${shared_pnpm_store_dir_path}" \
    --arg should_publish "${should_publish}" \
    --arg should_publish_images "${should_publish_images}" \
    --arg should_user_environment_die_on_error "${should_user_environment_die_on_error}" \
    --arg target_archs "${target_archs}" \
    --arg workflow_uuid "${workflow_uuid}" \
    --arg workflow_variant "${workflow_variant}" \
    '$ARGS.named')

  set_build_output "primary_json_string" "${primary_json_string}"

  local target_archs_json_string
  target_archs_json_string="$(echo -n "${target_archs}" | jq "${jq_common_flags[@]}" .)"

  set_build_output "target_archs_json_string" "${target_archs_json_string}"

  local image_name_short
  if [[ ${workflow_variant} == "${act_workflow_variant_create_runner_image}" ]]; then
    image_name_short="${docker_runner_image_name_short}"
  elif [[ ${workflow_variant} == "${act_workflow_variant_null}" ]]; then
    image_name_short="${docker_challenge_base_image_name_short}"
  else
    die "Workflow variant (${workflow_variant}) not valid!"
  fi

  local create_base_images_container_matrix_json_string
  create_base_images_container_matrix_json_string="$(jq \
    --null-input \
    "${jq_common_flags[@]}" \
    --arg dockerfile_path "${build_dockerfile_primary_file_path}" \
    --arg image_name_short "${image_name_short}" \
    --from-file "${build_templates_dir_path}/matrix.template.json")"

  set_build_output "create_base_images_container_matrix_json_string" "${create_base_images_container_matrix_json_string}"

  local challenge_environments_dir_paths_json_string
  challenge_environments_dir_paths_json_string="$(find "${build_challenge_environments_dir_path}" \
    -maxdepth 1 \
    -mindepth 1 \
    -type d |
    jq --raw-input \
      --slurp \
      "${jq_common_flags[@]}" 'split("\n")[:-1]')"

  set_build_output "challenge_environments_dir_paths_json_string" "${challenge_environments_dir_paths_json_string}"

  # null_credential: In the Github Workflow files, this is referenced in places where env.null_credential isn't permissible.  Thus, we pass it as a build output
  set_build_output "null_credential" "${null_credential}"
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
