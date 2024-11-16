#!/usr/bin/env bash

###############################################################################
# PURPOSE:
# - Utils that are "shared" across dockerfile (and other build functionality)
# - As this script is referenced early in the Dockerfile, the amount of changes
# should be as minimal (as possible) to avoid docker cache invalidations
###############################################################################

install_local_debs() {
  local local_file_path="${1}"
  # local_file_path: Can be a deb file or a directory of .debs. If a directory of debs, pass "null" to cli_name
  local cli_name="${2}"

  sudo dpkg --install --skip-same-version --recursive "${local_file_path}" &> /dev/null
  if [[ ${cli_name} != "${null}" ]] && ! command -v ${cli_name} &> /dev/null; then
    die "${cli_name} not installed!"
  fi
}

install_apt_updates() {
  # https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md#example-cache-apt-packages
  rm -f /etc/apt/apt.conf.d/docker-clean
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
  chmod 1777 /tmp
  log_info "Starting apt package updates"
  apt update
  apt upgrade --no-install-recommends -y
}

install_runner_apt_clis() {
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  apt update
  apt install --no-install-recommends --yes gh
}

install_base_apt_clis() {
  # ##############################################################################
  : << COMMENT
  git: removes the "git isn't installed" dialog on devcontainer init
  jq/curl/ca-certificates: needed to query for updates
  moreutils: installs ts which allows a performant way to prepend timestamps to log messages
  vim: make it easier to debug (learners might like this too)
  gh: for fetching updates repo in codespaces
  python3-pip/pipx: Needed for slither and potentially other functionaity into the future
COMMENT
  # ##############################################################################

  apt update
  apt install \
    --no-install-recommends \
    --yes \
    git \
    gh \
    jq \
    curl \
    ca-certificates \
    moreutils \
    openssh-client \
    vim \
    python3-pip \
    pipx
}

apt_cleanup() {
  apt-get clean
}

pnpm_init() {
  log_info "Initializing pnpm"
  corepack enable && corepack prepare --activate
}

pnpm_install() {
  local workspace="${1}"
  # shared_pnpm_store_dir_path: Pass in path so we don't have a dependency on filesystem-paths.env (this would break the docker cache more frequently)
  local shared_pnpm_store_dir_path="${2}"

  log_info "Installing ${workspace}"
  pnpm --filter "${workspace}" \
    install \
    --config.dedupe-peer-dependents=false \
    --config.recursive-install=false \
    --config.include-workspace-root=false \
    --config.store-dir="${shared_pnpm_store_dir_path}" \
    --frozen-lockfile
}

pnpm_prune() {
  # shared_pnpm_store_dir_path: Pass in path so we don't have a dependency on filesystem-paths.env (this would break the docker cache more frequently)
  local shared_pnpm_store_dir_path="${1}"

  log_info "Invoking pnpm prune operations on ${shared_pnpm_store_dir_path}"
  pnpm store prune --config.store-dir="${shared_pnpm_store_dir_path}"
  pnpm prune --config.store-dir="${shared_pnpm_store_dir_path}"
}

pnpm_fetch() {
  # Pass in path so we don't have a dependency on filesystem-paths.env
  # (this would break the docker cache more frequently)
  # pnpm fetch: Benefits of using fetch for monorepos is outlined here: https://pnpm.io/cli/fetch
  local shared_pnpm_store_dir_path="${1}"
  pnpm fetch \
    --config.store-dir="${shared_pnpm_store_dir_path}"
}

cargo_installs() {
  local solc_version="${1}"
  # Using 0.5.8 of svm-rs doesn't work
  cargo install --version 0.5.7 svm-rs && svm install "${solc_version}"
}

init_solcjs() {
  local version="${1}" # Ex: 0.8.24
  local lab_core_compilers_solcjs_symlink_file_path="${2}"

  local solidity_url_prefix="https://github.com/ethereum/solidity/releases/download/v${version}"

  local solcjs_url="${solidity_url_prefix}/soljson.js"
  local solcjs_symlink_file_path="${lab_core_compilers_solcjs_symlink_file_path}"
  local solcjs_with_version_file_path="${solcjs_symlink_file_path}-${version}"

  local solcjs_with_version_file_name
  solcjs_with_version_file_name="$(basename "${solcjs_with_version_file_path}")"

  if ! download_file "${solcjs_url}" "${solcjs_with_version_file_path}" "${false}"; then
    die "Couldn't download solcjs!"
  fi

  # solc*_with_version_file_name: Needs to be a relative link as the symlink can be created in dev environment and then shared within the container.  If it's not a relative link, the difference in absolute paths will cause issues.
  create_symlink "${solcjs_with_version_file_name}" "${solcjs_symlink_file_path}"
}

init_solc() {
  # Only occurs in docker env (not local env outside container)
  # No need to run solc binary outside container
  local solc_version="${1}"
  local container_svm_dir_path="${2}"

  local solc_file_path="/usr/local/bin/solc"

  create_symlink "${container_svm_dir_path}/${solc_version}/solc-${solc_version}" "${solc_file_path}"
  chmod +x "${solc_file_path}"
}
