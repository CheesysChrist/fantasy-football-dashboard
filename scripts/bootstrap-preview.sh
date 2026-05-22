#!/usr/bin/env bash
set -euo pipefail

# Local bootstrap for the private preview workflow.
#
# Default behavior:
# - loads .env.preview
# - optionally verifies DNS resolution
# - optionally copies the VPS setup script
# - optionally runs the VPS one-time setup over SSH
# - builds the Angular app
# - deploys the build via rsync
#
# Typical first run:
#   ./scripts/bootstrap-preview.sh --full-setup
#
# Typical later refresh:
#   ./scripts/bootstrap-preview.sh --deploy-only
#
# Requirements on local machine:
# - bash, ssh, scp, rsync, pnpm
# - .env.preview present in repo root
#
# Notes:
# - The VPS setup step prompts interactively for the basic-auth password.
# - No secret values are printed by this script.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env.preview"

DO_DNS_CHECK=false
DO_COPY_SETUP=false
DO_VPS_SETUP=false
DO_BUILD=true
DO_DEPLOY=true
SKIP_INSTALL=false

usage() {
  cat <<'EOF'
Usage:
  ./scripts/bootstrap-preview.sh [options]

Options:
  --full-setup      Run DNS check, copy VPS setup script, run VPS setup, build, and deploy
  --deploy-only     Build and deploy only (good for later refreshes)
  --dns-check       Verify PREVIEW_HOST resolves
  --copy-setup      Copy scripts/setup-preview-nginx.sh to the VPS /tmp directory
  --vps-setup       Run the one-time VPS package/nginx/basic-auth setup over SSH
  --skip-install    Skip pnpm install before building
  --no-build        Skip local build step
  --no-deploy       Skip deploy step
  -h, --help        Show this help text
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --full-setup)
      DO_DNS_CHECK=true
      DO_COPY_SETUP=true
      DO_VPS_SETUP=true
      DO_BUILD=true
      DO_DEPLOY=true
      ;;
    --deploy-only)
      DO_BUILD=true
      DO_DEPLOY=true
      ;;
    --dns-check)
      DO_DNS_CHECK=true
      ;;
    --copy-setup)
      DO_COPY_SETUP=true
      ;;
    --vps-setup)
      DO_VPS_SETUP=true
      ;;
    --skip-install)
      SKIP_INSTALL=true
      ;;
    --no-build)
      DO_BUILD=false
      ;;
    --no-deploy)
      DO_DEPLOY=false
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  echo "Create it with: cp .env.preview.example .env.preview" >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

: "${PREVIEW_HOST:?Missing PREVIEW_HOST in .env.preview}"
: "${PREVIEW_USER:?Missing PREVIEW_USER in .env.preview}"
: "${PREVIEW_PATH:?Missing PREVIEW_PATH in .env.preview}"
: "${PREVIEW_DOMAIN:?Missing PREVIEW_DOMAIN in .env.preview}"
: "${BASIC_AUTH_USER:?Missing BASIC_AUTH_USER in .env.preview}"

require_cmd ssh
require_cmd scp
require_cmd rsync
require_cmd bash

if [[ "$DO_DNS_CHECK" == true ]]; then
  if command -v dig >/dev/null 2>&1; then
    echo "Checking DNS for $PREVIEW_HOST"
    DIG_RESULT="$(dig +short "$PREVIEW_HOST" | tail -n 1 || true)"
    if [[ -z "$DIG_RESULT" ]]; then
      echo "DNS has not resolved yet for $PREVIEW_HOST" >&2
      exit 1
    fi
    echo "Resolved $PREVIEW_HOST to $DIG_RESULT"
  else
    echo "Skipping DNS check because 'dig' is not installed locally"
  fi
fi

if [[ "$DO_COPY_SETUP" == true ]]; then
  echo "Copying VPS setup script to ${PREVIEW_USER}@${PREVIEW_HOST}:/tmp/setup-preview-nginx.sh"
  scp "$REPO_ROOT/scripts/setup-preview-nginx.sh" "${PREVIEW_USER}@${PREVIEW_HOST}:/tmp/setup-preview-nginx.sh"
fi

if [[ "$DO_VPS_SETUP" == true ]]; then
  echo "Running one-time VPS setup on ${PREVIEW_USER}@${PREVIEW_HOST}"
  ssh "${PREVIEW_USER}@${PREVIEW_HOST}" \
    "sudo apt-get update && sudo apt-get install -y nginx apache2-utils rsync certbot python3-certbot-nginx && sudo mkdir -p '$PREVIEW_PATH' && sudo chown -R '$PREVIEW_USER':'$PREVIEW_USER' '$PREVIEW_PATH' && chmod +x /tmp/setup-preview-nginx.sh && PREVIEW_DOMAIN='$PREVIEW_DOMAIN' PREVIEW_PATH='$PREVIEW_PATH' BASIC_AUTH_USER='$BASIC_AUTH_USER' /tmp/setup-preview-nginx.sh"
fi

cd "$REPO_ROOT"

if [[ "$DO_BUILD" == true ]]; then
  require_cmd pnpm
  if [[ "$SKIP_INSTALL" != true ]]; then
    echo "Installing dependencies"
    pnpm install --frozen-lockfile
  fi
  echo "Building fantasy-angular production bundle"
  pnpm nx build fantasy-angular --configuration=production
fi

if [[ "$DO_DEPLOY" == true ]]; then
  echo "Deploying preview bundle"
  "$REPO_ROOT/scripts/deploy-preview.sh"
fi

echo "Preview bootstrap completed successfully."
if [[ "$DO_DEPLOY" == true ]]; then
  echo "Open: https://${PREVIEW_DOMAIN}/"
fi
