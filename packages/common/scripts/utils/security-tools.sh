#!/usr/bin/env bash

get_latest_github_release_version() {
  local full_repo_name="${1}" # GITHUB_ORG/REPO_NAME
  local release_metadata release_version

  # url example: https://api.github.com/repos/sigstore/cosign/releases/latest
  local url=https://api.github.com/repos/${full_repo_name}/releases/latest

  if ! release_metadata="$(curl --silent --location "${url}")"; then
    die "${full_repo_name}: Couldn't successfully call ${url}. Response: ${release_metadata}"
  fi
  release_version=$(echo -n "${release_metadata}" | jq --raw-output "${jq_common_flags[@]}" .tag_name | tr -d 'v')
  echo -n "${release_version}"
}

get_runner_security_tools_cli_debs_dir_path() {
  local cli_name="${1}"
  echo -n "${build_security_tools_debs_dir_path}/${cli_name}"
}

get_runner_security_tools_cli_deb_file_path() {
  local cli_name="${1}"
  local lab_release="${2}"

  local cli_debs_dir_path
  cli_debs_dir_path="$(get_runner_security_tools_cli_debs_dir_path "${cli_name}")"
  echo -n "${cli_debs_dir_path}/${lab_release}.deb"
}

get_github_deb_download_cli_name() {
  local full_repo_name="${1}"

  local cli_name
  case "${full_repo_name}" in
    "${security_tools_cosign_repo}")
      cli_name="cosign"
      ;;
    "${security_tools_syft_repo}")
      cli_name="syft"
      ;;
    "${security_tools_grype_repo}")
      cli_name="grype"
      ;;
    *)
      die "Unsupported github repo: ${full_repo_name}"
      ;;
  esac

  echo -n "${cli_name}"
}

should_skip_github_deb_download() {
  local is_scheduled_execution="${1}"
  local full_repo_name="${2}"

  local cli_name cli_dir_path
  cli_name="$(get_github_deb_download_cli_name "${full_repo_name}")"
  log_debug "Fetched cli name: ${cli_name}"
  cli_dir_path="$(get_runner_security_tools_cli_debs_dir_path "${cli_name}")"
  log_debug "Fetched runner cli dir path: ${cli_dir_path}"

  [[ ${is_scheduled_execution} == "${false}" ]] && does_file_extension_exist "${cli_dir_path}" ".deb"
}

download_deb_from_github() {
  local full_repo_name="${1}"
  local current_arch="${2}"

  local normalized_arch

  shopt -s nocasematch
  case ${current_arch} in
    "${runner_arch_x64_name}" | "${docker_arch_linux_x64_name}")
      normalized_arch=amd64
      ;;
    "${runner_arch_arm64_name}" | "${docker_arch_linux_arm64_name}")
      normalized_arch=arm64
      ;;
    *)
      die "Unsupported architecture: ${current_arch}"
      ;;
  esac

  log_info "Attempting download of ${full_repo_name} cli for ${normalized_arch}"

  local release
  # Prefix logs with $full_repo_name because this function is called in parallel
  release="$(get_latest_github_release_version "${full_repo_name}")"
  log_info "${full_repo_name}: Found release version (${release}) on Github"

  local remote_file_name cli_name

  cli_name="$(get_github_deb_download_cli_name "${full_repo_name}")"

  case "${full_repo_name}" in
    "${security_tools_cosign_repo}")
      remote_file_name="cosign_${release}_${normalized_arch}.deb"
      ;;
    "${security_tools_syft_repo}")
      remote_file_name="syft_${release}_linux_${normalized_arch}.deb"
      ;;
    "${security_tools_grype_repo}")
      remote_file_name="grype_${release}_linux_${normalized_arch}.deb"
      ;;
    *)
      die "Unsupported github repo: ${full_repo_name}"
      ;;
  esac

  local cli_deb_file_path cli_dir_path new_download
  cli_deb_file_path="$(get_runner_security_tools_cli_deb_file_path "${cli_name}" "${release}")"
  cli_dir_path="$(get_runner_security_tools_cli_debs_dir_path "${cli_name}")"

  new_download=false
  if [[ ! -f ${cli_deb_file_path} ]]; then
    # binary wasn't downloaded OR a new version is available

    log_info "${full_repo_name}:${cli_deb_file_path} was not cached. Attempting download..."

    # Prune preexisting versions
    rm -rf "${cli_dir_path}"

    download_latest_github_release \
      "${cli_deb_file_path}" \
      "${remote_file_name}" \
      "${full_repo_name}"
  else
    log_info "${cli_deb_file_path} was cached.  No need to download"
  fi
}

download_latest_github_release() {
  local local_file_path="${1}"
  local remote_file_name="${2}"
  local full_repo_name="${3}" # GITHUB_ORG/REPO_NAME

  local return_status

  #https://github.com/sigstore/cosign/releases/download/latest/cosign-linux-amd64
  if ! download_file "https://github.com/${full_repo_name}/releases/latest/download/${remote_file_name}" "${local_file_path}" "${true}"; then
    return_status="${?}"
    die "${full_repo_name} download failed! curl status: ${return_status}"
  fi
  log_info "Successfully downloaded ${local_file_path}"
}

update_grype_db() {
  create_directory "${build_security_tools_grype_db_dir_path}"
  GRYPE_DB_CACHE_DIR="${build_security_tools_grype_db_dir_path}" grype db update
}
