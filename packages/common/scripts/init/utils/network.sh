#!/usr/bin/env bash

is_url_available() {
  # https://unix.stackexchange.com/a/84818
  # Will return 0 status code if available
  local domain="${1}"
  curl --location --silent --show-error --fail "${domain}" > /dev/null
}

download_file() {
  local url="${1}"
  local file_path="${2}"
  local overwrite_file="${3}" # Bool

  if does_file_exist "${file_path}" && is_false "${overwrite_file}"; then
    log_info "${file_path} already exists.  Skipping download"
    return 0
  fi

  if ! curl --silent --location --create-dirs --output "${file_path}" "${url}"; then
    return_status="${?}"
    log_warning "Could NOT download file.  url: ${url} file_path: ${file_path} return_status: ${return_status}"
    # die can occur in outer function call
    return 1
  fi
  log_info "Successfully downloaded file.  URL: ${url} File Path: ${file_path}"
}

is_port_active() {
  local port="${1}"
  lsof -Pi :"${port}" -sTCP:LISTEN -t > /dev/null
}

does_interface_exist() {
  local interface="${1}"
  [[ -n $(get_interface_ip "${interface}") ]]
}

get_interface_ip() {
  local interface="${1}"
  ipconfig getifaddr "${interface}"
}
