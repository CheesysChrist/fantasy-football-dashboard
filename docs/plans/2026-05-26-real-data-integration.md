# Real Data Integration Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the current demo/live-night mock dashboard with a provider-driven backend that can ingest real NFL game state plus real fantasy league context.

**Architecture:** Keep the Angular app data-source agnostic. Add a backend composition layer in `apps/fantasy-api` that assembles a `FantasyNightDashboard` from two separate provider families: (1) live NFL game/feed providers and (2) fantasy league providers. This preserves a public GitHub Pages frontend while keeping secrets and brittle scraping logic server-side.

**Tech Stack:** Nx, Angular, NestJS, TypeScript, GitHub Actions, env-based provider selection, server-side fetch adapters.

---

## Decision summary

### What we know
- The current live dashboard is powered by preview/demo data.
- The frontend already expects `/api/dashboard/night` and falls back to preview data if the API fails.
- The user primarily plays on NFL Fantasy.
- `fantasy.nfl.com/robots.txt` disallows `/league*`, and the site is currently showing a technical-difficulties page, so NFL Fantasy should be treated as an unstable/private integration target rather than a dependable public API.

### Recommended provider split
1. **Live NFL games feed:** use a public-readable feed first.
   - Best practical first candidate: ESPN NFL scoreboard API for games/status.
2. **Fantasy league data:** support provider adapters.
   - Preferred first real adapter: Sleeper public/private league adapter if the user can supply a league ID.
   - NFL Fantasy adapter: later, server-side only, private, authenticated, and expected to be brittle.
3. **Dashboard composer:** merge league roster/matchup data with live game data into the existing `FantasyNightDashboard` contract.

### Why not direct NFL Fantasy first
- No obvious supported public API surfaced from the public site.
- League pages are disallowed in robots.
- The public site is currently unstable.
- A pure GitHub Pages frontend cannot safely hold auth/session credentials for NFL Fantasy.

---

## Phases

### Phase 1: Provider abstraction
Create backend interfaces so the UI stops caring where data comes from.

### Phase 2: Real live NFL feed
Replace demo game shells with real game/status data from a public feed.

### Phase 3: Real fantasy league provider
Implement one real league adapter (preferably Sleeper first for speed and public API reliability).

### Phase 4: NFL Fantasy private adapter
Only if still needed after Phase 3. Keep it backend-only and behind environment configuration.

---

## Task 1: Add provider interfaces for dashboard composition

**Objective:** Separate live-game data and fantasy-league data behind explicit backend interfaces.

**Files:**
- Create: `apps/fantasy-api/src/app/dashboard/dashboard-provider.types.ts`
- Create: `apps/fantasy-api/src/app/dashboard/dashboard-provider.tokens.ts`
- Modify: `apps/fantasy-api/src/app/app.module.ts`
- Modify: `apps/fantasy-api/src/app/dashboard.controller.ts`

**Implementation notes:**
- Define interfaces for:
  - `LiveNflDataProvider`
  - `FantasyLeagueProvider`
  - `FantasyNightDashboardComposer`
- Keep interfaces narrow and based on current contract needs.
- Do not change Angular code yet.

**Verification:**
- `pnpm nx test fantasy-api`
- Expected: existing API tests still pass after wiring default providers.

---

## Task 2: Move current demo night dashboard into a demo provider

**Objective:** Preserve current behavior while making it swappable.

**Files:**
- Create: `apps/fantasy-api/src/app/dashboard/providers/demo-live-nfl.provider.ts`
- Create: `apps/fantasy-api/src/app/dashboard/providers/demo-fantasy-league.provider.ts`
- Modify: `apps/fantasy-api/src/app/fantasy-data.ts`
- Modify: `apps/fantasy-api/src/app/dashboard.controller.ts`
- Modify: `apps/fantasy-api/src/app/dashboard.controller.spec.ts`

**Implementation notes:**
- Keep the existing preview experience as the default fallback.
- Controller should call a service/composer instead of returning static data directly.

**Verification:**
- `pnpm nx test fantasy-api`
- `pnpm nx build fantasy-api`

---

## Task 3: Add a real live NFL feed adapter

**Objective:** Replace demo live game shells with real game metadata/status from a public feed.

**Files:**
- Create: `apps/fantasy-api/src/app/dashboard/providers/espn-live-nfl.provider.ts`
- Create: `apps/fantasy-api/src/app/dashboard/providers/espn-live-nfl.provider.spec.ts`
- Modify: `apps/fantasy-api/src/app/app.module.ts`

**Implementation notes:**
- Start with game-level data only:
  - kickoff time
  - game status
  - home/away teams
  - score
- Map feed output into a backend-friendly intermediate model.
- Do not attempt player fantasy scoring yet.
- Keep a timeout and fallback to demo provider on fetch failure.

**Verification:**
- `pnpm nx test fantasy-api`
- `pnpm nx serve fantasy-api` then `curl http://localhost:3000/api/dashboard/night`
- Expected: real game slates during active season, demo fallback on provider failure.

---

## Task 4: Add env-based provider selection

**Objective:** Make provider choice explicit and predictable by environment.

**Files:**
- Create: `apps/fantasy-api/src/app/config/dashboard-provider.config.ts`
- Modify: `apps/fantasy-api/src/app/app.module.ts`
- Modify: `README.md`
- Create: `.env.example`

**Implementation notes:**
- Suggested env vars:
  - `LIVE_NFL_PROVIDER=demo|espn`
  - `FANTASY_LEAGUE_PROVIDER=demo|sleeper|nfl`
  - `SLEEPER_LEAGUE_ID=`
- Default to demo when configuration is missing.
- Log which providers are active at app startup.

**Verification:**
- Start API with no env vars: demo mode still works.
- Start API with `LIVE_NFL_PROVIDER=espn`: endpoint returns real game slate data.

---

## Task 5: Add a real Sleeper league adapter

**Objective:** Get one full real fantasy-provider path working end-to-end.

**Files:**
- Create: `apps/fantasy-api/src/app/dashboard/providers/sleeper-league.provider.ts`
- Create: `apps/fantasy-api/src/app/dashboard/providers/sleeper-league.provider.spec.ts`
- Modify: `apps/fantasy-api/src/app/sleeper-fantasy.service.ts`
- Modify: `apps/fantasy-api/src/app/dashboard.controller.ts`

**Implementation notes:**
- Use Sleeper league/roster/matchup endpoints.
- Normalize into:
  - my roster
  - opponent roster
  - matchup projection/score fields available from provider
  - active players grouped by game
- This becomes the first real fantasy-provider baseline.

**Verification:**
- `pnpm nx test fantasy-api`
- Manual curl against `/api/dashboard/night` with a real `SLEEPER_LEAGUE_ID`
- Expected: dashboard reflects a real league instead of demo teams.

---

## Task 6: Update Angular UI for partial-real states

**Objective:** Let the UI clearly show what is real versus estimated/fallback.

**Files:**
- Modify: `apps/fantasy-angular/src/app/dashboard/current-games-dashboard.component.html`
- Modify: `apps/fantasy-angular/src/app/dashboard/current-games-dashboard.component.ts`
- Modify: `apps/fantasy-angular/src/app/dashboard/current-games-dashboard.component.scss`
- Modify: `apps/fantasy-angular/src/app/fantasy-night-dashboard.ts`

**Implementation notes:**
- Add small labels like:
  - `Live games from ESPN`
  - `League sync from Sleeper`
  - `Fallback/demo mode`
- This reduces confusion when one provider is real and another is mocked.

**Verification:**
- `pnpm nx test fantasy-angular`
- `pnpm nx build fantasy-angular --configuration=production`

---

## Task 7: Decide whether NFL Fantasy is worth a private adapter

**Objective:** Make an explicit go/no-go decision before building a brittle integration.

**Files:**
- Update: `docs/plans/2026-05-26-real-data-integration.md`

**Decision checklist:**
- Can the user provide a stable league URL or ID?
- Can the integration be done without violating platform rules or depending on fragile browser scraping?
- Is there a reusable export or network endpoint visible after login?
- Is the value meaningfully higher than a Sleeper-backed or manual-import workflow?

**Recommended default:**
- Prefer Sleeper or manual/imported league snapshots first.
- Treat NFL Fantasy integration as optional and experimental.

---

## Task 8: Add a manual-import fallback for NFL Fantasy users

**Objective:** Support NFL Fantasy users even if direct integration is not viable.

**Files:**
- Create: `apps/fantasy-api/src/app/dashboard/providers/manual-import-league.provider.ts`
- Create: `apps/fantasy-api/src/app/dashboard/imports/`
- Modify: `README.md`

**Implementation notes:**
- Accept a checked-in or local JSON snapshot format for:
  - teams
  - starters
  - bench
  - matchup pairs
  - projections/scores if available
- This gives the dashboard a path to usefulness without live scraping.

**Verification:**
- Load a sample import file and confirm `/api/dashboard/night` reflects it.

---

## Immediate next recommendation

1. Implement provider abstraction.
2. Add ESPN live NFL game data.
3. Add Sleeper real league adapter as the first true fantasy integration.
4. Re-evaluate NFL Fantasy only after the provider architecture is working.

---

## Known risks

- NFL Fantasy may require browser-authenticated scraping and break frequently.
- Public live-score feeds may not provide fantasy-ready player scoring without extra joins.
- GitHub Pages can host the frontend, but any authenticated/private provider must live in the backend, not in the browser.
- Offseason timing means some live endpoints will return preseason/offseason structures instead of active game slates.
