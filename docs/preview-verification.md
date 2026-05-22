# Safe fantasy dashboard verification

This repo now supports two low-risk ways to review the fantasy dashboard UI without making the application public.

## 1. Private GitHub Actions visual preview

Use this when you want a fast visual check from CI without exposing a live URL.

What the workflow uploads:
- `dashboard-preview-screenshot`: a full-page screenshot of `/dashboard`
- `dashboard-preview-report`: a Playwright HTML report
- `dashboard-production-bundle`: the built static browser bundle

How to use it:
1. Push your branch.
2. Open Actions -> `dashboard-preview`.
3. Open the latest run for your branch.
4. Download the artifacts.
5. Review the screenshot first, then open the Playwright report locally.

Why this is safe:
- no public hosting
- artifacts are limited to repository access
- lets you inspect typography, layout, spacing, and key routes quickly

What it verifies:
- `/dashboard` renders in static fallback mode
- `/waivers` renders fallback content
- `/lineup` renders fallback content
- the production build completes

## 2. Password-protected VPS preview

Use this when you want a clickable private preview URL.

### Recommended setup
- preview hostname: `fantasy-preview.example.com`
- deploy path: `/var/www/fantasy-dashboard-preview`
- nginx basic auth enabled
- no production secrets in browser code
- optional demo/fallback data only

### One-time VPS setup
1. Copy `.env.preview.example` to `.env.preview` and fill in your private values.
2. Install required packages on the VPS:
   - `sudo apt-get update`
   - `sudo apt-get install -y nginx apache2-utils rsync`
3. Run the one-time setup script on the VPS:
   - `set -a && source ./.env.preview && set +a`
   - `./scripts/setup-preview-nginx.sh`
4. If you prefer to inspect the generated config directly, use `docs/nginx-fantasy-preview.conf` as the reference output.

### Deploying a new preview build
1. Load your local preview variables:
   - `set -a && source ./.env.preview && set +a`
2. Build the app:
   - `pnpm install --frozen-lockfile`
   - `pnpm nx build fantasy-angular --configuration=production`
3. Sync it to the VPS:
   - `./scripts/deploy-preview.sh`
4. Open the protected preview URL and log in with your basic-auth credentials.
5. For the full end-to-end checklist, see `docs/private-vps-preview-runbook.md`.

### Why this is safe
- preview stays off the public internet in practice
- only people with the password can access it
- easy to rotate credentials
- no dependency on GitHub Pages plan limitations

### Hardening tips
- use a dedicated preview hostname, not your main site
- add `noindex` headers so search engines ignore it
- do not wire preview builds to production write APIs
- prefer static/demo data for UI verification until backend auth is ready
- rotate the basic-auth password if shared outside your core team

## Recommended workflow

For day-to-day review:
1. Start with the GitHub Actions screenshot/report artifacts.
2. If the UI is close enough to click through, deploy the same branch to the password-protected VPS preview.
3. Use the VPS preview for route-level checks, responsiveness, and overall look and feel.

This gives you artifact-first safety and a clickable private preview as the next step.
