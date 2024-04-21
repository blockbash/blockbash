#!/usr/bin/env bash

get_architecture() {
  case "$(uname -m)" in
    arm64)
      echo 'linux/arm64'
      ;;
    x86_64)
      echo 'linux/amd64'
      ;;
    *)
      die "Architecture not supported!"
      ;;
  esac
}
