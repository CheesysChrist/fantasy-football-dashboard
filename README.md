# Fantasy Football Dashboard

Fantasy Football Dashboard is the standalone application repository for the fantasy product experience.

It contains the product-facing apps:
- `fantasy-angular` — Angular dashboard UI for standings, current games, waivers, and lineup management
- `fantasy-api` — NestJS API layer for fantasy data aggregation and app-specific backend behavior
- `fantasy-angular-e2e` / `fantasy-api-e2e` — end-to-end and integration test coverage for the application

## App description

This repository is meant to stay focused on the *application layer*.
It assembles the fantasy football user experience by combining:
- fantasy-specific routes, pages, and product flows
- fantasy-specific backend endpoints and provider integrations
- preview and verification workflows for reviewing the app UI
- externally consumed shared packages from the `ux-lib-csr` library repo

In practical terms, this repo is where product behavior lives:
- dashboard composition
- lineup management interactions
- waiver workflows
- standings and current game presentation
- API orchestration for fantasy data sources such as Sleeper

## Clean app/library boundary

The intended structure is:
- **This repo (`fantasy-football-dashboard`)** = application repo
- **`ux-lib-csr`** = shared library repo

Reusable code should live in `ux-lib-csr`, for example:
- design tokens
- Angular UI primitives and shared domain components
- Angular utility helpers
- shared TypeScript contracts
- NestJS cross-cutting utilities

Application-specific code should stay here, for example:
- fantasy routes and page composition
- feature wiring for waivers, lineup, standings, and dashboards
- provider adapters and backend orchestration specific to the fantasy app
- app verification and deployment workflows

## Repository layout

```text
apps/
  fantasy-angular/       Frontend application
  fantasy-angular-e2e/   Playwright E2E tests for the frontend
  fantasy-api/           Backend API application
  fantasy-api-e2e/       Backend integration/E2E tests
vendor/ux-lib-csr/       Temporary packed shared library tarballs
.github/workflows/       CI and preview workflows
scripts/                 Helper scripts
```

## Dependency bridge

This application repo already consumes the shared library as an external dependency boundary rather than importing library source code directly.

Today that boundary is bridged through packed tarballs in `vendor/ux-lib-csr/` and pnpm overrides in `pnpm-workspace.yaml`.
That keeps the app separate while the shared packages are not yet published to a package registry.

Current external shared package inputs include:
- `@ux-lib-csr/angular-ui`
- `@ux-lib-csr/angular-utils`
- `@ux-lib-csr/contracts`
- `@ux-lib-csr/nestjs-utils`
- `@ux-lib-csr/tokens`

## Commands

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

## Local development

Frontend:

```bash
pnpm nx serve fantasy-angular
```

Backend:

```bash
pnpm nx serve fantasy-api
```

Provider selection for the dashboard backend currently defaults to demo mode and is designed to be expanded with real providers:

```bash
LIVE_NFL_PROVIDER=demo
FANTASY_LEAGUE_PROVIDER=demo
pnpm nx serve fantasy-api
```

Planned provider names already reserved in config:
- `LIVE_NFL_PROVIDER=demo|espn`
- `FANTASY_LEAGUE_PROVIDER=demo|sleeper|nfl`

At the moment, any unimplemented provider name safely falls back to `demo`.

Production frontend build:

```bash
pnpm nx build fantasy-angular --configuration=production
```

## Preview and verification

This repo includes GitHub-based preview support for reviewing the application and sharing progress quickly:
- GitHub Actions screenshot/report artifacts
- production bundle artifacts
- GitHub Pages deployment for the public repo

For the public repository, the `deploy-pages-preview` workflow publishes the Angular app to GitHub Pages with a project-site base path and SPA `404.html` fallback.
Expected URL after Pages is enabled in repository settings:
- `https://cheesyschrist.github.io/fantasy-football-dashboard/`

## Packaging bridge status

The repo boundary is already separate and clean at the repository level.

The remaining packaging bridge is still tarball-based because the shared library packages use the `@ux-lib-csr/*` scope, which does not currently map to a GitHub Packages user/org namespace for `CheesysChrist`.
Until that scope or registry strategy changes, this app continues to consume vendored tarball artifacts rather than registry-published package versions.
