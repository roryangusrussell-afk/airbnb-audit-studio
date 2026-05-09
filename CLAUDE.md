# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on :8080 (host ::, HMR overlay disabled)
npm run build        # Production build
npm run build:dev    # Build with development mode (keeps lovable-tagger output)
npm run lint         # ESLint over the repo
npm run preview      # Preview the built app
npm run test         # vitest run (single pass, used in CI)
npm run test:watch   # vitest in watch mode
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`. Run by name: `npx vitest run -t "name pattern"`.

The repo has both `bun.lockb`/`bun.lock` and `package-lock.json` checked in — use `npm` unless deliberately switching, since the scripts and CI assume npm.

## Architecture

### App shape
This is a frontend-only Vite + React 18 + TypeScript SPA. There is **no backend in this repo** — the app calls a remote service at `https://airbnb-audit-rho.vercel.app` (hardcoded as `BASE` in `src/lib/api.ts`). The repo originated from Lovable; `lovable-tagger` is loaded as a Vite plugin in development mode only.

`src/App.tsx` wires the providers (TanStack Query, Radix Tooltip, two toasters — `Toaster` for shadcn `useToast` and `Sonner` for sonner — and Vercel Analytics) and the three routes:
- `/` → `pages/Index.tsx` (the audit flow)
- `/sample` → `pages/SampleReport.tsx` (renders `sampleData.ts` through `ResultsScreen`)
- `*` → `pages/NotFound.tsx`

### Audit flow state machine
`src/hooks/useAuditFlow.ts` is the single source of truth for the user journey. It owns a `status: "landing" | "loading" | "results" | "error"` and `pages/Index.tsx` is a thin switch over that status:

```
landing  → Hero (UrlForm)
loading  → LoadingScreen (with optional peek thumbnail)
error    → ErrorScreen
results  → ResultsScreen
```

`submitUrl` triggers `peekListing` (cheap, sets a thumbnail) in parallel with `runAudit` (the main call). On success it persists to localStorage, fires `captureLead`, and conditionally redeems a `?ref=` referral code captured on first load. If no email is set, it opens `EmailGateModal` post-audit.

localStorage keys: `auditEmail`, `pendingRef`, `auditsRun`. `FREE_AUDIT_LIMIT = 5` exists but the credit gate is currently disabled pending Stripe wiring — the counter still increments so the gate can be re-enabled without code changes.

### API layer (`src/lib/api.ts`)
- `runAudit` is the only call that **throws**. It implements one transparent retry on 5xx/network/timeout, 240s client timeout, and importantly **decodes both transport-level errors (HTTP status) and body-level errors**. The streaming `/api/audit` endpoint always returns HTTP 200 and encodes errors as `{ ok: false, status, error }` in the JSON body so Safari doesn't kill long fetches — handle both paths when changing error logic.
- All other calls (`captureLead`, `sendReport`, `redeemRef`, `useCredit`, `submitFeedback`, `peekListing`, `checkCredits`) are best-effort — they swallow errors and log to console; never make UI behaviour depend on their resolution.
- An optional `VITE_AUDIT_TOKEN` build-time env var is sent as `X-Audit-Token`. It's bundled into JS so it's not real auth; treat it as a rotatable speed bump matching the backend's `AUDIT_FRONTEND_TOKEN`. Backend returns 403 if the token mismatches; the UI surfaces this distinctly.
- `AuditError` carries `status` and `detail` (a sanitized 500-char snippet of the response body). `ErrorScreen` displays both.

### Domain model
`src/lib/types.ts` defines `AuditResponse`, the central payload returned by the audit endpoint. The interface has been grown across iterations (comments mark "session 7/8/9" additions for `summary`/`start`/`stop`/`continue`, `performancePattern`, and `subsections`/`rewrites`). Many fields are optional because older snapshots and partial responses are common — **default-to-optional and guard at usage sites** rather than narrowing the type.

### Results UI structure
`src/components/results/ResultsScreen.tsx` renders three tabs (`SummaryTab`, `DiagnosticTab`, `NextStepTab`) plus a print mode. Print mode renders all three tabs sequentially inside `<PrintSection>` wrappers, waits one tick, then calls `window.print()`; the `afterprint` event flips back. Use `data-print-hide` on any element that should not appear in the printout.

`NextStepTab` content is gated by `getRecommendedNextStep` in `src/lib/nextStep.ts` (Portugal listings → management pitch, multi-listing hosts → portfolio review, score-based variants otherwise). `trackEvent` in that file is currently a `console.log` placeholder — wire to real analytics by editing the single function.

### Design system & scoring
- shadcn/ui (default style, slate base, CSS variables) lives in `src/components/ui/`. Configured by `components.json`. Path alias `@/*` → `src/*`.
- The Tailwind colour palette (`tailwind.config.ts`) is keyed off CSS variables defined in `src/index.css`: `brand`, `success`, `warning`, `danger` each ship `DEFAULT`/`foreground`/`soft`/`border` variants. Use these tokens (e.g. `bg-success-soft border-success-border text-success`) instead of raw Tailwind colours so band styling stays consistent.
- `src/lib/scoring.ts` is the single source of truth for score → band → tone mapping:
  - `scoreBand(n)`: ≥75 strong, ≥55 average, else weak
  - `verdictLabel`/`diagnosticLabel`: marketing labels (different thresholds — don't conflate)
  - `categoryRatingBand(rating)`: maps Airbnb 0–5 ratings to bands (≥4.8 strong, ≥4.5 average)
  - `bandTextClass`/`bandBgClass`/`bandSoftClasses`: prefer these over hand-rolled colour classes; brand pink (`text-brand`/`bg-brand-soft`) is reserved for "main opportunity" / priority-fix CTAs, not score colour.

### Sample data
`src/lib/sampleData.ts` exports `sampleAudit: AuditResponse` used by `/sample`. Update it when adding required fields to `AuditResponse` so the sample route doesn't break.

## Conventions worth knowing

- **Loose TypeScript**: `tsconfig.json` sets `noImplicitAny: false`, `strictNullChecks: false`, `noUnusedLocals: false`, `noUnusedParameters: false`, and ESLint disables `@typescript-eslint/no-unused-vars`. Don't rely on the type checker to catch null/undefined — guard explicitly. The codebase already uses `as unknown as { ... }` casts in places (e.g. `nextStep.ts`) when reading legacy field aliases.
- **No backend changes here**: if a feature needs new data, it has to come from the upstream service. Add the field as optional on `AuditResponse` and degrade gracefully when absent.
- **Print parity**: when adding new sections to a tab, verify they render correctly in print mode (`ResultsScreen` print branch renders each tab eagerly, no Tabs wrapper). Use `data-print-hide` for interactive controls.
- **Mobile considerations**: Some controls are intentionally hidden on small screens (e.g. the Download PDF button in `ResultsScreen`, see commit `1d1c489`). Check the responsive variants before adding similar controls.
- **`.lovable/plan.md`** sometimes contains in-flight design briefs from Lovable sessions. Read it when present, but treat git history (`git log --oneline`) as authoritative for what's actually been merged.
