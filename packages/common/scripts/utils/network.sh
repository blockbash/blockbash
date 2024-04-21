#!/usr/bin/env bash

is_url_available() {
  # https://unix.stackexchange.com/a/84818
  # Will return 0 status code if available
  local domain="${1}"
  curl --location --silent --show-error --fail "${domain}" > /dev/null
}

does_interface_exist() {
  local interface="${1}"
  [[ -n $(get_interface_ip "${interface}") ]]
}

get_interface_ip() {
  local interface="${1}"
  ipconfig getifaddr "${interface}"
}
