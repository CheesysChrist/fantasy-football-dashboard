#!/usr/bin/env bash
set -euo pipefail

# Deploy the built Angular app to a password-protected preview directory on a VPS.
#
# Example:
#   PREVIEW_HOST=your-vps.example.com \
#   PREVIEW_USER=deploy \
#   PREVIEW_PATH=/var/www/fantasy-dashboard-preview \
#   pnpm install --frozen-lockfile && \
#   pnpm nx build fantasy-angular --configuration=production && \
#   ./scripts/deploy-preview.sh
#
# Optional:
#   BUILD_DIR=dist/apps/fantasy-angular/browser
#   RSYNC_RSH='ssh -p 22'

: "${PREVIEW_HOST:?Set PREVIEW_HOST to the VPS hostname}"
: "${PREVIEW_USER:?Set PREVIEW_USER to the SSH user}"
: "${PREVIEW_PATH:?Set PREVIEW_PATH to the target directory on the VPS}"

BUILD_DIR="${BUILD_DIR:-dist/apps/fantasy-angular/browser}"
RSYNC_RSH="${RSYNC_RSH:-ssh}"

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Build directory not found: $BUILD_DIR" >&2
  echo "Run: pnpm nx build fantasy-angular --configuration=production" >&2
  exit 1
fi

rsync -az --delete -e "$RSYNC_RSH" \
  "$BUILD_DIR/" "${PREVIEW_USER}@${PREVIEW_HOST}:${PREVIEW_PATH}/"

echo "Preview bundle synced to ${PREVIEW_USER}@${PREVIEW_HOST}:${PREVIEW_PATH}"
echo "If nginx basic auth is configured, open the protected preview URL in your browser."
