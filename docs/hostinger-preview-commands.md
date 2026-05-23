# Hostinger VPS preview commands

These commands assume:
- preview hostname: `prev.fantasy.dashboard`
- SSH user: `deploy`
- deploy path: `/var/www/fantasy-dashboard-preview`
- basic-auth username: `preview-admin`
- repo root on your local machine: this repository checkout

If your Hostinger VPS uses Ubuntu/Debian, the commands below should work as-is.

## 1. DNS

In your DNS provider, create an `A` record:

- host: `prev`
- value: `<your Hostinger VPS public IP>`

Verify locally after DNS propagates:

```bash
dig +short prev.fantasy.dashboard
```

It should return your VPS IP.

## 2. Local repo prep

From the repo root on your local machine:

```bash
cp .env.preview.example .env.preview
cat > .env.preview <<'EOF'
PREVIEW_HOST=prev.fantasy.dashboard
PREVIEW_USER=deploy
PREVIEW_PATH=/var/www/fantasy-dashboard-preview
BUILD_DIR=dist/apps/fantasy-angular/browser
RSYNC_RSH='ssh'

PREVIEW_DOMAIN=prev.fantasy.dashboard
BASIC_AUTH_USER=preview-admin
NGINX_SITE_NAME=fantasy-dashboard-preview
BASIC_AUTH_FILE=/etc/nginx/.htpasswd-fantasy-preview
ENABLE_UFW=false
EOF
set -a
source ./.env.preview
set +a
chmod +x ./scripts/deploy-preview.sh ./scripts/setup-preview-nginx.sh
```

## 3. Copy the repo helper scripts to the VPS

If the repo is not already cloned on the VPS, copy just the needed setup script first:

```bash
scp ./scripts/setup-preview-nginx.sh deploy@prev.fantasy.dashboard:/tmp/setup-preview-nginx.sh
```

## 4. One-time VPS setup

SSH into the VPS:

```bash
ssh deploy@prev.fantasy.dashboard
```

Then run:

```bash
sudo apt-get update
sudo apt-get install -y nginx apache2-utils rsync certbot python3-certbot-nginx
sudo mkdir -p /var/www/fantasy-dashboard-preview
sudo chown -R deploy:deploy /var/www/fantasy-dashboard-preview
chmod +x /tmp/setup-preview-nginx.sh
PREVIEW_DOMAIN=prev.fantasy.dashboard \
PREVIEW_PATH=/var/www/fantasy-dashboard-preview \
BASIC_AUTH_USER=preview-admin \
/tmp/setup-preview-nginx.sh
```

The script will prompt you to set the basic-auth password for `preview-admin`.

## 5. Optional HTTPS enablement with certbot

Still on the VPS, once DNS is pointing correctly:

```bash
sudo certbot --nginx -d prev.fantasy.dashboard
```

Choose the redirect-to-HTTPS option when prompted.

Verify nginx afterwards:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Build locally

Back on your local machine in the repo root:

```bash
set -a
source ./.env.preview
set +a
pnpm install --frozen-lockfile
pnpm nx build fantasy-angular --configuration=production
```

## 7. Deploy the preview bundle

From the repo root on your local machine:

```bash
set -a
source ./.env.preview
set +a
./scripts/deploy-preview.sh
```

Important:
- Running `./scripts/bootstrap-preview.sh` with no flags is not a full first-time server setup.
- For the first end-to-end run, use:

```bash
./scripts/bootstrap-preview.sh --full-setup
```

- Plain `./scripts/bootstrap-preview.sh` only handles the local build/deploy path and skips nginx/basic-auth setup on the VPS.

## 8. Open the preview

Open in a browser:

```text
https://prev.fantasy.dashboard/
```

If you have not enabled TLS yet, use:

```text
http://prev.fantasy.dashboard/
```

You should see a basic-auth prompt. Log in with:
- username: `preview-admin`
- password: the one you set during `htpasswd`

## 9. Updating the preview later

Whenever you want to refresh it:

```bash
cd /path/to/fantasy-football-dashboard
set -a
source ./.env.preview
set +a
pnpm nx build fantasy-angular --configuration=production
./scripts/deploy-preview.sh
```

Or use the new one-command local bootstrap helper:

```bash
./scripts/bootstrap-preview.sh --deploy-only --skip-install
```

For a first-time end-to-end setup from your local machine, use:

```bash
./scripts/bootstrap-preview.sh --full-setup
```

That will:
- optionally verify DNS
- copy the VPS setup script
- run the VPS package/nginx/basic-auth setup over SSH
- build the app
- deploy the bundle

## 10. Rotate the preview password later

On the VPS:

```bash
sudo htpasswd /etc/nginx/.htpasswd-fantasy-preview preview-admin
sudo systemctl reload nginx
```

## 11. Troubleshooting quick checks

Check DNS:

```bash
dig +short prev.fantasy.dashboard
```

Check nginx config on VPS:

```bash
sudo nginx -t
```

Check whether nginx is serving the preview root:

```bash
sudo ls -la /var/www/fantasy-dashboard-preview
```

Check that the deploy user can write there:

```bash
touch /var/www/fantasy-dashboard-preview/.write-test && rm /var/www/fantasy-dashboard-preview/.write-test
```

Check the live response headers:

```bash
curl -I https://prev.fantasy.dashboard/
```

If auth is enabled, expect a `401 Unauthorized` before login.
