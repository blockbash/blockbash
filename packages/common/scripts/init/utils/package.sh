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
  if [[ ${cli_name} != "${null}"   ]] && ! command -v ${cli_name} &> /dev/null; then
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
    vim
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
