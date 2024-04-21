#!/usr/bin/env bash

# BLOCKBASH_LOG_LEVEL: When this file is executed, it is backgrounded and stdout is sent to a log file.  By setting a 'trace' BLOCKBASH_LOG_LEVEL, we allow the learner to submit granular debugging logs.
export BLOCKBASH_LOG_LEVEL=trace

# shellcheck source=./../../../../packages/common/scripts/source-all.sh
. /blockbash/packages/common/scripts/source-all.sh --absolute_paths="true" --die_on_error="false"

main() {
  local temp_file_path
  temp_file_path="$(mktemp)"

  local bash_log_content
  if [[ -f ${container_bash_log_file_path} ]]; then
    bash_log_content="$(get_file_contents "${container_bash_log_file_path}")"
  else
    bash_log_content="${null}"
  fi

  local node_log_content
  if [[ -f ${container_node_log_file_path} ]]; then
    node_log_content="$(get_file_contents "${container_node_log_file_path}")"
  else
    node_log_content="${null}"
  fi

  cat << EOF >> "${temp_file_path}"
BASH LOGS START
${bash_log_content}
BASH LOGS END

NODE LOGS START
${node_log_content}
NODE LOGS END
EOF

  if does_command_exist code; then
    code --reuse-window "${temp_file_path}"
    log_info "Successfully opened ${temp_file_path}"
  else
    log_error "code cli doesn't exist"
  fi
}

# https://unix.stackexchange.com/a/333204
# Pipes stderr to terminal (and log file)
exec 3>&1
main 2>&1 >&3 | tee -a "${bash_log_file_path}"
