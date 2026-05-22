# Fantasy Football Dashboard

Standalone fantasy football dashboard app that consumes `@ux-lib-csr/*` packages as external dependencies.

## Commands

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm e2e
```

## Package bridge

Until `@ux-lib-csr/*` packages are published to npm, this repo consumes tarballs from `vendor/ux-lib-csr/` with pnpm overrides in `pnpm-workspace.yaml`.
