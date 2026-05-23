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
- preview and verification workflows for safely reviewing the app UI
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
- app preview setup, deployment glue, and end-to-end verification

## Repository layout

```text
apps/
  fantasy-angular/       Frontend application
  fantasy-angular-e2e/   Playwright E2E tests for the frontend
  fantasy-api/           Backend API application
  fantasy-api-e2e/       Backend integration/E2E tests
vendor/ux-lib-csr/       Temporary packed shared library tarballs
.github/workflows/       CI and preview workflows
scripts/                 Preview/bootstrap/deploy helpers
docs/                    Preview and deployment documentation
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

Production frontend build:

```bash
pnpm nx build fantasy-angular --configuration=production
```

## Preview and verification

This repo includes safe preview support for reviewing the application without making it public:
- GitHub Actions screenshot/report artifacts
- production bundle artifacts
- optional password-protected VPS preview helpers

See:
- `docs/preview-verification.md`
- `docs/hostinger-preview-commands.md`
- `docs/private-vps-preview-runbook.md`

## Next cleanup target

The repo boundary is already separate and clean at the repository level.
The next maturity step, when ready, is to replace the temporary tarball bridge with published package versions so the app consumes `ux-lib-csr` through a normal package registry flow.
