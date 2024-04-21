#!/usr/bin/env bash
# ##############################################################################
: << COMMENT

PURPOSE: Bash specific groupings of global.env values.
- All values can be overridden within overrides.env

COMMENT
# ##############################################################################

log_levels=(
  "${trace_level}"
  "${debug_level}"
  "${info_level}"
  "${warning_level}"
  "${error_level}"
)

# act_server_interfaces: These need to be in priority order
act_server_interfaces=(
  "${act_server_primary_interface_override}"
  "${act_server_secondary_interface_override}"
)

blessed_github_action_users=(
  "${act_github_user_zachroofsec}"
)

# act_workflow_variant_null: no variant (normal workflow)
runner_workflow_variants=(
  "${act_workflow_variant_null}"
  "${act_workflow_variant_create_runner_image}"
)

# Runner architecture names (as reported by Github)
runner_architectures=(
  "${runner_arch_x64_name}"
  "${runner_arch_arm64_name}"
)

# Docker architecture names (as reported by Docker)
docker_architectures=(
  "${docker_arch_linux_arm64_name}"
  "${docker_arch_linux_x64_name}"
)

all_architectures=("${runner_architectures[@]}" "${docker_architectures[@]}")

image_names_short=(
  "${docker_challenge_base_image_name_short}"
  "${docker_runner_image_name_short}"
)

execution_environment_workflows=(
  "${challenge_workflow_devcontainer_vscode}"
)
