#!/usr/bin/env bash

# ##############################################################################
: << COMMENT

PURPOSE: Core functions that HAVE to be available in all build contexts.
- Meant for sourcing only
- Sourced scripts inhabit one namespace, so we must ensure that sourced variables dont have the same name.  Thus, we prefix _core for variables that aren't meant to be sourced.
- Can't leverage any internal funcs/vars as we're early in the execution cycle
- We don't want to kill the script if there's a validation failure as this script sets up the appropriate error handling.  Hence, we do input validation after set_global_conditions has been executed (see end of script).

COMMENT
# ##############################################################################

while [[ $# -gt 0 ]]; do
  _core_argument_name="${1}"
  case "${_core_argument_name}" in
    --die_on_error=*)
      _core_argument_value="${_core_argument_name#*=}"
      _core_die_on_error="${_core_argument_value}"
      ;;
    *)
      echo "***************************"
      echo "Error: Invalid argument"
      echo "${_core_argument_name} is not a valid argument"
      echo "***************************"
      ;;
  esac
  if [[ -z ${_core_argument_value} ]]; then
    echo "***************************"
    echo "Error: Invalid value"
    echo "${_core_argument_name} doesn't have a value!"
    echo "***************************"
  else
    unset _core_argument_name _core_argument_value
  fi
  shift
done

disable_trace() {
  # Usually leveraged to stop secrets from being logged to the terminal
  log_trace "Disabling trace while parsing secrets"
  set +x
}

is_local_dev_env() {
  # BLOCKBASH_IS_LOCAL: Is set to true in local environment.  This value is shared across all execution environments (e.g., developer environment host, CI, lab environment).
  [[ ${BLOCKBASH_IS_LOCAL} == "${true}" ]]
}

is_github_build() {
  # Signifies build process that is NOT occurring in local environment
  ! is_local_dev_env && ! is_in_lab_environment
}

should_kill_shell() {
  local _die_on_error="${1}"
  # While killing the shell makes errors immediately obvious, this isn't ideal
  # in user facing environments as users need the ability to submit debug logs.
  # In user environments, we log error messages (to stdout) but we dont kill
  # the overarching shell.
  log_debug "Setting should_kill_shell to ${_die_on_error}"
  [[ ${_die_on_error} == "${true}" ]]
}

error_handler() {
  local exit_code="${1}"
  local executing_command="${2}"

  # Trapping on EXIT will invoke error_handler on any exit code (e.g., exit 0, exit 1, etc.)  We only want to log_error for non-zero exits
  if [[ $exit_code -ne 0 ]]; then
    local base_error
    base_error="exit code: $exit_code | execution context: $(caller) | command: ${executing_command}"
    log_error "${base_error}"
  fi
}

is_tty_available() {
  # Check if /dev/tty is available
  sh -c ": >/dev/tty" > /dev/null 2> /dev/null
}

does_command_exist() {
  local cli_name="${1}"
  command -v "${cli_name}" &> /dev/null
}

set_global_shell_flags() {
  local _die_on_error="${1}"
  # https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html
  local flags=(-Eo pipefail)

  if should_kill_shell "${_die_on_error}"; then
    # -E: https://stackoverflow.com/questions/64852814/in-bash-shell-e-option-explanation-what-does-any-trap-inherited-by-a-subshell
    flags+=(-ue)
  fi

  local log_level
  log_level="$(get_current_log_level)"

  if [[ ${log_level} == "${trace_level}" ]] && is_github_build; then
    # Ensure that we don't accidentally invoke "set -x" within
    # the public Github Actions runner. (This could expose secrets)
    log_warning "Attempted to set trace log_level within Github build! Ignoring set -x"
  elif [[ ${log_level} == "${trace_level}" ]] && ! is_github_build; then
    flags+=(-x)
  fi

  log_debug "Setting shell flags: ${flags[*]}"
  set "${flags[@]}"
}

get_file_contents() {
  local file_path="${1}"

  if [[ -f ${file_path} ]]; then
    cat "${file_path}"
  else
    die "file (${file_path}) does NOT exist"
  fi
}

log_file_contents() {
  local file_path="${1}"
  local log_level="${2}"

  if [[ ${log_level} == "${info_level}" ]]; then
    log_info "File Path: ${file_path} contents below..."
    log_info "$(get_file_contents ${file_path})"
  elif [[ ${log_level} == "${debug_level}" ]]; then
    log_debug "File Path: ${file_path} contents below..."
    log_debug "$(get_file_contents ${file_path})"
  else
    die "Unsupported log_level: ${log_level}"
  fi
}

set_global_bash_conditions() {
  local _die_on_error="${1}"

  if should_kill_shell "${_die_on_error}"; then
    # If we always exit the shell on error, we only need to trap on EXIT
    # otherwise, the trap will be invoked twice for any exit condition
    trap 'error_handler "${?}" "${BASH_COMMAND}"' EXIT
  else
    trap 'error_handler "${?}" "${BASH_COMMAND}"' ERR EXIT
  fi

  set_global_shell_flags "${_die_on_error}"
}

_send_to_log_file() {
  local message="${1}"
  local level="${2}" # trace/debug/info/warn/error

  local parent_script_name initial_script_name

  # Call stack example:
  # SOME_OTHER_FUNCTION > FUNCTION_WE_WANT_TO_CAPTURE > log_warning > _log > _send_to_log_file
  # We use [3] to capture the correct calling value
  initial_script_name=$(basename "${BASH_SOURCE[-1]}")
  parent_script_name=$(basename "${BASH_SOURCE[3]}")

  local verbose_message="${level}: ${initial_script_name} -> ${parent_script_name} -> ${FUNCNAME[3]}: ${message}"

  if does_command_exist ts; then
    # Append timestamp
    verbose_message=$(echo "${verbose_message}" | ts)
  fi

  echo "${verbose_message}" &>> "${bash_log_file_path}"
}

is_resolving_environment() {
  # When VS Code is resolving the user shell environment, it will now set a new environment variable VSCODE_RESOLVING_ENVIRONMENT to 1. This is useful for user scripts (for example, in .bashrc) that need to know whether they are being run in the context of resolving the shell environment. (https://code.visualstudio.com/updates/v1_75#_new-vscoderesolvingenvironment-environment-variable)
  # We usually only want to execute logic for shell sessions that are DIRECTLY tied to a user
  [[ ${VSCODE_RESOLVING_ENVIRONMENT:-false} == "1" ]]
}

is_in_codespace() {
  [[ ${CODESPACES:-false} == "${true}" ]] && ! is_resolving_environment
}

is_in_remote_development() {
  # Is true for devcontainers that are launched locally (within vscode) but NOT in codepspaces
  # https://github.com/microsoft/vscode-remote-release/issues/3517
  [[ ${REMOTE_CONTAINERS:-false} == "${true}" ]] && ! is_resolving_environment
}

is_alertable_log_level() {
  local level="${1}"

  [[ ${level} == "${error_level}" ]] || [[ ${level} == "${warning_level}" ]]
}

is_in_lab_environment() {
  is_in_codespace || is_in_remote_development
}

_send_to_terminal() {
  local message="${1}"
  local level="${2}" # trace/debug/info/warn/error

  # By checking is_in_lab_environment first, we avoid the expensive is_in_tty lookup
  if is_in_lab_environment && is_tty_available && is_alertable_log_level "${level}"; then
    # If there is an error from a process that is executing in the background,
    # we want to surface this to the user's terminal.
    # In this situation, logging to stdout wont do anything because the process
    # is running in the background.  To get around this, we send to /dev/tty.
    # As pushing to /dev/tty can be handled ungracefully (via the shell),
    # we only do this in dire situations (i.e., when there is an error/warning)
    printf '%b\n' "${message}" > /dev/tty
  else
    printf '%b\n' "${message}"
  fi
}

get_current_log_level() {
  echo -n "${BLOCKBASH_LOG_LEVEL:-$default_level}"
}

_log() {
  # We send all log levels to the log file.
  # However, we only send BLOCKBASH_LOG_LEVEL logs (and above) to stdout.
  local message="${1}"
  local level="${2}" # trace/debug/info/warn/error

  if ! is_github_build; then
    # Dont persist logs into public docker image.
    _send_to_log_file "${message}" "${level}"
  fi

  # https://stackoverflow.com/a/48087251
  declare -A levels=([${trace_level}]=0 [${debug_level}]=1 [${info_level}]=2 [${warning_level}]=3 [${error_level}]=4)

  local system_log_level
  system_log_level="$(get_current_log_level)"

  #check if level is enough
  ((${levels[$level]} < ${levels[$system_log_level]})) && return

  _send_to_terminal "${message}" "${level}"
}

annotate_error_message() {
  local message="${1}"

  cat << EOF


*****************************************
ERROR: ${message}

Please go to ${github_issue_url} to file a bug report.
Filing this report REALLY helps the community :)

To continue at the shell prompt, press the RETURN key.
*****************************************
EOF
}

annotate_warning_message() {
  local message="${1}"

  cat << EOF


*****************************************
WARNING: ${message}

To continue at the shell prompt, press the RETURN key.
*****************************************
EOF
}

log_error() {
  # A problem was encountered
  # This message will go to the end user (if possible)
  local message="${1}"

  local annotated_message
  annotated_message="$(annotate_error_message "${message}")"
  _log "${annotated_message}" "${error_level}"
}

log_warning() {
  # A condition has occurred that might cause an unexpected
  # experience (i.e., internet isn't available, etc.)
  # This message will go to the end user (if possible)
  local message="${1}"

  local annotated_message
  annotated_message="$(annotate_warning_message "${message}")"
  _log "${annotated_message}" "${warning_level}"
}

log_info() {
  # Confirmation that things are working as expected.
  # This information does not go to the end user
  local message="${1}"
  _log "${message}" "${info_level}"
}

log_debug() {
  # Debug information that is helpful for error reporting
  # This information does not go to the end user
  local message="${1}"
  _log "${message}" "${debug_level}"
}

log_trace() {
  # Debug information that is helpful for error reporting
  # This information does not go to the end user
  local message="${1}"
  _log "${message}" "${trace_level}"
}

die() {
  # A problem was encountered
  # This message will go to the end user (if possible)
  # This will also kill the shell (when applicable)
  local message="${1}"
  log_error "${message}"
  if should_kill_shell "${_core_die_on_error}"; then
    exit 1
  fi
}

validate_bool() {
  local array_name="${1}"
  local value="${2}"

  case "${value}" in
    "${true}" | "${false}") ;;
    *)
      die "${array_name} was not a bool"
      ;;
  esac
}

set_global_bash_conditions "${_core_die_on_error}"
# See above commentary for reasoning
if [[ -z ${_core_die_on_error} ]]; then
  die "--die_on_error was NOT passed to core.sh"
fi
