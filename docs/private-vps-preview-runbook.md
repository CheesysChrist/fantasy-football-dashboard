# Private VPS preview runbook

This runbook prepares a password-protected preview of the fantasy dashboard on a private VPS using nginx basic auth.

## What this gives you

- a dedicated preview hostname
- static hosting for the Angular production build
- username/password protection with nginx basic auth
- noindex and no-store headers
- a repeatable deploy flow for refreshing the preview

## Prerequisites

On the VPS:
- nginx installed
- apache2-utils installed (`htpasswd` command)
- sudo access
- DNS for your preview hostname pointing at the VPS

On your local machine or build machine:
- access to this repo
- pnpm installed
- SSH access to the VPS
- rsync installed

## Files added for this workflow

- `.env.preview.example` — local template for preview variables
- `scripts/setup-preview-nginx.sh` — one-time nginx/basic-auth setup on the VPS
- `scripts/deploy-preview.sh` — sync the built app bundle to the VPS
- `docs/nginx-fantasy-preview.conf` — reference nginx config produced by the setup script

## 1. Prepare local preview variables

Copy the example file and customize it:

```bash
cd /path/to/fantasy-football-dashboard
cp .env.preview.example .env.preview
```

Edit `.env.preview` and set at least:
- `PREVIEW_HOST`
- `PREVIEW_USER`
- `PREVIEW_PATH`
- `PREVIEW_DOMAIN`
- `BASIC_AUTH_USER`

Then load it into your shell:

```bash
set -a
source ./.env.preview
set +a
```

Do not commit `.env.preview`.

## 2. One-time VPS package setup

Run on the VPS if needed:

```bash
sudo apt-get update
sudo apt-get install -y nginx apache2-utils rsync
```

## 3. One-time nginx/basic-auth setup

Copy the repo to the VPS or otherwise make `scripts/setup-preview-nginx.sh` available there, then run:

```bash
chmod +x ./scripts/setup-preview-nginx.sh
PREVIEW_DOMAIN="$PREVIEW_DOMAIN" \
PREVIEW_PATH="$PREVIEW_PATH" \
BASIC_AUTH_USER="$BASIC_AUTH_USER" \
./scripts/setup-preview-nginx.sh
```

The script will:
- create the preview web root
- prompt you to set or update the basic-auth password
- write the nginx site config
- enable the site
- test nginx config
- reload nginx

Note: the password is entered interactively and is not echoed into logs by the script.

## 4. Optional HTTPS setup

After DNS points to the VPS and port 80 is reachable, add TLS:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d "$PREVIEW_DOMAIN"
```

If you add HTTPS, prefer sharing only the `https://` preview URL.

## 5. Build the preview locally

From the repo root:

```bash
pnpm install --frozen-lockfile
pnpm nx build fantasy-angular --configuration=production
```

This should produce:
- `dist/apps/fantasy-angular/browser`

## 6. Deploy the preview bundle

From the repo root with `.env.preview` loaded:

```bash
chmod +x ./scripts/deploy-preview.sh
./scripts/deploy-preview.sh
```

Important:
- Running `./scripts/bootstrap-preview.sh` with no flags is not a first-time VPS setup.
- For the first end-to-end run, use:

```bash
./scripts/bootstrap-preview.sh --full-setup
```

- Running it with no flags skips the nginx/basic-auth server setup step.

Or without sourcing the env file:

```bash
PREVIEW_HOST=your-vps.example.com \
PREVIEW_USER=deploy \
PREVIEW_PATH=/var/www/fantasy-dashboard-preview \
./scripts/deploy-preview.sh
```

The script uses rsync with `--delete`, so the remote preview directory mirrors the current build output.

## 7. Open and verify the preview

Open:

- `http://prev.fantasy.dashboard/`
- or `https://prev.fantasy.dashboard/` after TLS is configured

Check:
- basic-auth prompt appears
- `/dashboard` renders
- `/waivers` renders
- `/lineup` renders
- browser devtools show no obvious missing static assets

## 8. Updating the preview later

For later UI checks:

```bash
set -a
source ./.env.preview
set +a
pnpm nx build fantasy-angular --configuration=production
./scripts/deploy-preview.sh
```

Or use the one-command helper:

```bash
./scripts/bootstrap-preview.sh --deploy-only --skip-install
```

For a first-time guided run from your local machine:

```bash
./scripts/bootstrap-preview.sh --full-setup
```

This helper loads `.env.preview`, can verify DNS, can copy/run the VPS setup script, then builds and deploys.

## Secret-safety notes

- Do not commit `.env.preview`.
- Do not commit `.htpasswd` files.
- Do not put production API secrets into the frontend bundle.
- Prefer demo/fallback data for UI review.
- If the preview password is shared broadly, rotate it with:

```bash
sudo htpasswd /etc/nginx/.htpasswd-fantasy-preview "$BASIC_AUTH_USER"
sudo systemctl reload nginx
```

## Troubleshooting

### `htpasswd: command not found`
Install apache2-utils:

```bash
sudo apt-get install -y apache2-utils
```

### `nginx -t` fails
Read the exact config error and compare against:
- `docs/nginx-fantasy-preview.conf`

### Preview deploy says build directory is missing
Run:

```bash
pnpm nx build fantasy-angular --configuration=production
```

### Browser gets 404 on refresh for deep links
Make sure nginx uses:

```nginx
try_files $uri $uri/ /index.html;
```

### Preview is reachable without auth
Check that the active nginx site contains:
- `auth_basic`
- `auth_basic_user_file`

Then reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```
