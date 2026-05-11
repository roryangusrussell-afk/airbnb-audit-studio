# CLAUDE.md, airbnb-audit-studio (frontend)

Guide for AI assistants working in this repo. Keep it accurate; update
it when reality drifts.

## What this repo is

The Auditable web frontend: a single-page React app that takes an Airbnb
listing URL, calls the backend audit API, and renders the result in a
three-tab report (Summary, Diagnostic, Next step). Production:

- Frontend: `https://airbnb-audit-studio.vercel.app`
- Backend (`BASE` in `src/lib/api.ts`): `https://airbnb-audit-rho.vercel.app`
- Backend repo: `airbnb-audit` (sibling)

The audit is positioned as a free lead magnet for Rory Russell's parent
brand, not a SaaS product. Read `airbnb-audit/PRODUCT.md` (in the
sibling repo) for the strategic frame and the credibility rails.

This project was bootstrapped on Lovable; `lovable-tagger` is wired into
`vite.config.ts` for development-mode component tagging, and
`.lovable/plan.md` exists for historical reasons. You can edit code
locally, Lovable is no longer the source of truth.

## Commands

```bash
npm install          # install (npm and bun lockfiles both committed; npm is canonical)
npm run dev          # Vite dev server on port 8080, host ::, HMR overlay disabled
npm run build        # production build via Vite
npm run build:dev    # dev-mode build (keeps componentTagger output for inspection)
npm run preview      # serve dist/ locally
npm run lint         # eslint --flat config (eslint.config.js)
npm run test         # vitest run, jsdom env, single pass
npm run test:watch   # vitest in watch mode
```

There is exactly one example test in `src/test/example.test.ts`, 
testing has not been a priority. Add tests when the unit is worth
testing in isolation; do not add ceremony.

TypeScript is intentionally loose: `strict: false`, `noImplicitAny:
false`, `strictNullChecks: false`. Don't tighten globally without
agreement; do tighten per-module by adding explicit types.

## Tech stack

- React 18 + Vite 5 + TypeScript
- Tailwind CSS + shadcn/ui (`src/components/ui/*`, `components.json`)
- Routing: `react-router-dom` v6 with two routes (`/`, `/sample`)
- Data fetching: `@tanstack/react-query` (provider in `App.tsx`; the app
  doesn't actually use queries heavily, the audit flow is imperative)
- Forms: `react-hook-form` + `zod` (only used in modals so far)
- Icons: `lucide-react`
- Charts: `recharts`
- Toasts: shadcn `toaster` and `sonner` both mounted (legacy + new)
- Analytics: `@vercel/analytics`
- Testing: Vitest + Testing Library + jsdom

## Layout

```
src/
  pages/
    Index.tsx          The audit flow page (landing → loading → results | error)
    SampleReport.tsx   /sample route, renders sample data through ResultsScreen
    NotFound.tsx       404 catch-all
  components/
    landing/           Hero, UrlForm, PreviewPanel
    results/           ListingCard, SummaryTab, DiagnosticTab, NextStepTab,
                       ScoreRing, ScoreBreakdown(Card), CategoryRow,
                       PerformancePattern, ArchetypeSection, PositioningSection,
                       RewriteCard, AdvisoryCard, AnalystCommentary,
                       BottomTenRiskBanner, EmailReportBar, FeedbackModal,
                       VisibilityContext, nextStep/Illustrations
    ui/                shadcn/ui primitives (don't hand-edit; regenerate via shadcn CLI)
    EmailGateModal, CreditGateModal, ErrorScreen, LoadingScreen, CopyButton,
    NavLink, Eyebrow
  hooks/
    useAuditFlow.ts    The state machine: status, email, peek, retry, referral
    useCopyToClipboard, use-mobile, use-toast
  lib/
    api.ts             runAudit / peekListing / captureLead / redeemRef /
                       checkCredits / useCredit / submitFeedback + AuditError
    types.ts           AuditResponse + the entire downstream type tree
    scoring.ts         scoreBand, verdictLabel, band->Tailwind class mappers
    categoryMeta.ts    Per-category icon + colour tokens
    nextStep.ts        Logic for the Next step tab content
    sampleData.ts      Static fixture for /sample
    utils.ts           cn() helper (clsx + tailwind-merge)
  index.css            Tailwind layers + the design-system CSS variables
  main.tsx, App.tsx    Boot + router + providers
public/                Static assets
src/test/setup.ts      Jest-DOM extension + matchMedia stub
```

## App flow

`useAuditFlow` (in `src/hooks/useAuditFlow.ts`) is the state machine.
Statuses: `landing` → `loading` → `results` | `error`.

1. URL submission → `submitUrl` → `performAudit`.
2. Concurrently, `peekListing` fires for the loading screen preview
   (image + title + rating from the backend's cheap HTML peek).
3. `runAudit` calls `POST /api/audit` with a 240s client abort and one
   transparent retry on 5xx / network. The backend is a streaming JSON
   response that always returns HTTP 200 and encodes errors in the body
   as `{ ok: false, status, error }`, `runAudit` parses both shapes.
4. On success, the results page renders three tabs:
   - **Summary** (`SummaryTab.tsx`), verdict, score, summary prose,
     positioning diagnosis, performance pattern.
   - **Diagnostic** (`DiagnosticTab.tsx`, ~865 LOC), category breakdown,
     issues, sub-rating gaps, host signals, photo analysis.
   - **Next step** (`NextStepTab.tsx`, ~586 LOC), paste-ready rewrites,
     newsletter / strategy call CTAs, Email-this-report option.
5. Email gate modal fires AFTER the audit completes (post-Rafael
   feedback) if no email is in `localStorage`. On submit, calls
   `captureLead` which both logs to Sheets and emails the report via
   the backend's Resend integration.
6. Referral flow: `?ref=<code>` is captured from the URL on first load
   and stored in `localStorage` as `pendingRef`. After the first
   successful audit, `redeemRef(email, refCode)` fires once.

`localStorage` keys: `auditEmail`, `pendingRef`, `auditsRun`. Cap is
`FREE_AUDIT_LIMIT = 5` but the credit gate is currently disabled
("until Stripe is wired", see `submitUrl` in `useAuditFlow.ts`).

`AuditError` (in `api.ts`) carries `status` + `detail`. Errors with
`status` 422 surface as "listing not found"; 403 as "service
unavailable from this site"; 429 as the rate-limit message; everything
else is generic. `ErrorScreen` shows the message and an optional retry.

## Backend contract

- `POST /api/audit` body `{ url }`, response `AuditResponse` (see
  `types.ts`). Streaming JSON; always HTTP 200; errors in body.
- `GET /api/peek?id=<listingId>` cheap preview; returns nulls on
  failure rather than 4xx.
- `POST /api/capture-lead` `{ email, url, listingId, title, score,
  rating, reviewCount, result }`, best-effort, never throws to caller.
- `POST /api/redeem-ref` `{ refereeEmail, refCode }`, note the field
  is `refereeEmail` (the backend uses it for the self-referral guard).
- `POST /api/use-credit` / `GET /api/check-credits`, credit ledger
  endpoints, currently dormant in the UI.
- `POST /api/feedback` `{ listingId, rating, comment, email, url }`.

All requests send `X-Audit-Token: <VITE_AUDIT_TOKEN>` when the env var
is set at build time. The token is in the JS bundle so it isn't real
auth, it's a rotatable speed bump matching the backend's
`AUDIT_FRONTEND_TOKEN`. Leave unset for local dev unless you want to
hit production.

## Design system

Defined in `src/index.css` as HSL CSS variables, exposed in
`tailwind.config.ts`:

- Background: warm ivory (`hsl(40 33% 98%)`)
- Brand: pink `#e8185c` (`--brand`, also `brand-soft`/`brand-border`)
- Score bands as `success` (≥75), `warning` (55–74), `danger` (<55), 
  see `scoring.ts:scoreBand` and `bandTextClass`/`bandBgClass`
- Two shadow tokens: `shadow-card`, `shadow-elevated`
- Font: Inter (loaded via the system or web font; not bundled)

When adding components, prefer:
1. shadcn primitive in `components/ui/*` (regenerate via shadcn CLI;
   don't hand-edit existing ones unless trivial).
2. Variants via `class-variance-authority` (see `button.tsx`).
3. `cn()` from `@/lib/utils` to merge conditional classes.

Branding rules baked in (don't break):
- No score above 100. Use qualitative bands or remove.
- No "Apply suggestion" buttons. The audit cannot push to Airbnb. Use
  "Copy text" or "View rewrite".
- No fabricated photo captions or unilateral amenity-removal advice.
  These are hardcoded into the backend rubric; the UI must respect the
  result it gets.

## Conventions

- **NEVER use em dashes (Unicode U+2014) ANYWHERE in this repo.** Not in
  user-visible copy, not in error messages, not in aria-labels, not in
  code comments, not in commit messages, not in this CLAUDE.md, not in
  any .md file. Hard rule, no exceptions. Use commas, colons, periods, or
  restructure the sentence. Same rule lives in the backend (the
  `api/audit.js` prompt tells Claude not to emit em dashes) so LLM output
  is already gated. Before any commit, sweep `src/` for U+2014; the result
  must be empty. Reason: Rory's durable preference, set 2026-05-11. Em
  dashes were proliferating across comments and copy and he wants the
  codebase clean.
- Imports use the `@` alias for `src/` (configured in `vite.config.ts`,
  `tsconfig.app.json`, `vitest.config.ts`, and `components.json`).
- `*.test.ts(x)` files live next to the unit; they are picked up by
  `vitest.config.ts:test.include`.
- ESLint: react-hooks rules enforced; `@typescript-eslint/no-unused-vars`
  is OFF (TS itself is loose). Don't sprinkle `// eslint-disable-next-line`.
- React Query is mounted as a provider but barely used. The audit
  request is a `fetch` in a `useCallback`, no need to migrate it.
- Lovable's `componentTagger` only runs in dev mode. Don't fight it.
- Keep tab components pure-presentational. State lives in
  `useAuditFlow`. Data shape is `AuditResponse` from `lib/types.ts`, 
  update both types and consumers when adding a backend field.

## Branch and commit conventions

- Default branch: `main`. Feature branches use
  `claude/<short-slug>-<random>` (Claude Code on the web convention).
- Commits are short imperative sentences. Past examples: `runAudit:
  send X-Audit-Token, surface 403/429 to UI`, `Show host status
  (individual vs business) on Reviews & rating`, `Mobile responsiveness
  pass on the results screen`.

## How to verify a change

1. `npm run dev` and exercise the full flow with a real Airbnb URL.
   The default `BASE` is the production backend, so audits cost real
   money, use sparingly. Or temporarily point `BASE` at a Vercel
   preview of the backend.
2. `/sample` route renders `sampleData.ts` through `ResultsScreen`.
   Use this for fast UI iteration without burning audits.
3. `npm run lint` and `npm run test` before committing.
4. Mobile: the results screen had a recent responsiveness pass
   (`100bd440`). Test on a narrow viewport, many components have
   explicit `sm:` breakpoints.
5. Print/PDF: `ResultsScreen` has a print mode that expands all tabs
   for `window.print()`. Don't regress `data-print-hide` markers when
   editing chrome.
