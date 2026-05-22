#!/usr/bin/env bash
set -euo pipefail

# Configure an nginx-hosted, basic-auth protected preview for the fantasy dashboard.
#
# Usage:
#   PREVIEW_DOMAIN=preview.example.com \
#   PREVIEW_PATH=/var/www/fantasy-dashboard-preview \
#   BASIC_AUTH_USER=preview-admin \
#   ./scripts/setup-preview-nginx.sh
#
# Optional:
#   NGINX_SITE_NAME=fantasy-dashboard-preview
#   NGINX_AVAILABLE_DIR=/etc/nginx/sites-available
#   NGINX_ENABLED_DIR=/etc/nginx/sites-enabled
#   BASIC_AUTH_FILE=/etc/nginx/.htpasswd-fantasy-preview
#   ENABLE_UFW=true
#
# Notes:
# - Run this on the VPS as a user with sudo access.
# - This script does not print or store the basic-auth password.
# - HTTPS can be added afterwards with certbot once DNS points to the VPS.

: "${PREVIEW_DOMAIN:?Set PREVIEW_DOMAIN to the preview hostname}"
: "${PREVIEW_PATH:?Set PREVIEW_PATH to the web root path}"
: "${BASIC_AUTH_USER:?Set BASIC_AUTH_USER to the basic-auth username}"

NGINX_SITE_NAME="${NGINX_SITE_NAME:-fantasy-dashboard-preview}"
NGINX_AVAILABLE_DIR="${NGINX_AVAILABLE_DIR:-/etc/nginx/sites-available}"
NGINX_ENABLED_DIR="${NGINX_ENABLED_DIR:-/etc/nginx/sites-enabled}"
BASIC_AUTH_FILE="${BASIC_AUTH_FILE:-/etc/nginx/.htpasswd-fantasy-preview}"
ENABLE_UFW="${ENABLE_UFW:-false}"
SITE_CONF_PATH="${NGINX_AVAILABLE_DIR}/${NGINX_SITE_NAME}.conf"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd sudo
require_cmd nginx
require_cmd htpasswd
require_cmd tee
require_cmd ln

sudo mkdir -p "$PREVIEW_PATH"
sudo chown -R "$(id -un)":"$(id -gn)" "$PREVIEW_PATH"
sudo chmod 755 "$PREVIEW_PATH"

if [[ -f "$BASIC_AUTH_FILE" ]]; then
  echo "Updating existing basic-auth entry in $BASIC_AUTH_FILE"
  sudo htpasswd "$BASIC_AUTH_FILE" "$BASIC_AUTH_USER"
else
  echo "Creating basic-auth file at $BASIC_AUTH_FILE"
  sudo htpasswd -c "$BASIC_AUTH_FILE" "$BASIC_AUTH_USER"
fi

sudo mkdir -p "$NGINX_AVAILABLE_DIR" "$NGINX_ENABLED_DIR"

sudo tee "$SITE_CONF_PATH" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${PREVIEW_DOMAIN};

    root ${PREVIEW_PATH};
    index index.html;

    auth_basic "Fantasy Dashboard Preview";
    auth_basic_user_file ${BASIC_AUTH_FILE};

    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
    add_header Cache-Control "no-store" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location = /404.html {
        internal;
    }
}
EOF

sudo ln -sfn "$SITE_CONF_PATH" "${NGINX_ENABLED_DIR}/${NGINX_SITE_NAME}.conf"

if [[ "$ENABLE_UFW" == "true" ]] && command -v ufw >/dev/null 2>&1; then
  sudo ufw allow 'Nginx Full'
fi

sudo nginx -t
sudo systemctl reload nginx

echo "Preview nginx site configured successfully."
echo "Domain: ${PREVIEW_DOMAIN}"
echo "Web root: ${PREVIEW_PATH}"
echo "Basic auth file: ${BASIC_AUTH_FILE}"
echo "Next: build locally and run ./scripts/deploy-preview.sh to sync the app bundle."
