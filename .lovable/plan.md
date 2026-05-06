## Auditable — Build Plan

A frontend-only React app that audits Airbnb listings via the existing Vercel API. No backend changes. Premium operator-built feel: warm ivory background, white cards, bold Inter, single pink accent (#e8185c).

### Design system

- Load Inter via Google Fonts in `index.html`; set as default font in Tailwind. No other fonts, no italic serif.
- Update `src/index.css` tokens (HSL):
  - `--background`: warm ivory (~`40 33% 98%`)
  - `--card`: white; `--border`: very light warm grey
  - `--primary`: near-black (default filled CTAs)
  - New `--brand` (pink `#e8185c` → `339 81% 50%`) and `--brand-soft` (blush bg)
  - `--success` green, `--warning` amber, `--danger` red for score bands and risk banners
  - Generous radius (`0.75rem`), soft shadow tokens
- Extend `tailwind.config.ts` with brand/success/warning/danger color families and font family.
- Helpers in `src/lib/scoring.ts`:
  - `scoreBand(n)` → `"strong" | "average" | "weak"` (≥75 / 55–74 / <55)
  - `verdictLabel(n)` → Excellent/Strong/Solid/Needs work/Critical
  - `categoryRatingBand(r)` → green ≥4.8, amber 4.5–4.7, red <4.5
- Reusable primitives: `Eyebrow`, `Pill`, `ScoreRing` (animated SVG), `CategoryRow`, `CheckPill`, `SignalColumn`, `FixCard`, `CopyButton`, `SectionHeader`.

### Routing & state

- Add routes to `src/App.tsx`: `/` (Index), `/sample` (SampleReport), keep NotFound catch-all.
- `src/pages/Index.tsx` is a single-page state machine: `landing` → `loading` → `results` → `error`. Email modal and credit-gate modal overlay.
- Hook `src/hooks/useAuditFlow.ts` manages: `url`, `email`, `auditData`, `status`, `error`, `auditCount` (in-session), `pendingRef`, `auditEmail` (localStorage).
- On mount: read `?ref=`, persist as `pendingRef`.

### API layer (`src/lib/api.ts`)

- `runAudit(url)` → `POST /api/audit` with `{ url }`, 90s `AbortController` timeout.
- `sendReport({ email, listingId, score, title })` → `POST /api/send-report`.
- `redeemRef(email, refCode)` → `POST /api/redeem-ref`.
- `checkCredits(email)` → `GET /api/check-credits?email=`.
- `useCredit(email)` → `POST /api/use-credit`.
- TypeScript types in `src/lib/types.ts` mirror the documented response shape.

### Screens

**1. Landing (`src/components/landing/`)**
- Two-column desktop: left = bold headline "See exactly what your Airbnb listing should fix first.", subhead, URL input + black "Audit my listing free" CTA (arrow icon), outline "View sample report" → `/sample`, trust line `Free · Read-only · No login · Nothing edited`.
- Right = static `PreviewPanel`: numbered top fixes (01/02/03 with HIGH/MED impact pills) + suggested-edit card (current title → recommended title + why it works).
- URL validation: must include `airbnb.` host; inline error if not.

**2. Email gate modal**
- Shadcn Dialog. Email input + submit. Skipped if `localStorage.auditEmail` exists.
- On submit: persist email, close, trigger API.

**3. Loading screen**
- Shows the URL being analysed.
- 4 cosmetic steps tick every ~1.8s with check animation: Fetching listing data → Analysing photos with AI vision → Scoring 6 content categories → Generating your audit report. Independent of real API state.

**4. Results screen**
- `ListingCard` pinned at top: 3:2 cropped thumbnail, bold title, metadata row with icons (location · ★rating + reviews · amenity count · notable amenity if present like "Private parking"), pink pill strip (`propertyType · Hosts up to N guests`), today's date.
- `BottomTenRiskBanner` directly below listing card if `bottomTenRisk === true` — red alert, fixed copy from brief.
- `EmailReportBar` below banner: subtle dismissable strip "Want to refer back to this later? We'll send a copy to [email]" + "Send report →" button. On click: `sendReport(...)`, button → "Sent."
- Top right: "Audit another listing" → resets to landing (re-uses stored email; triggers credit gate on next attempt).
- Shadcn Tabs: Summary / Diagnostic / Next step.

**Tab 1 — Summary**
- Top section: left = animated `ScoreRing` (pink arc fills to score), bold `score` centred with `/100` below, then verdict label and `verdict` string in grey. Right = 6 `CategoryRow`s (icon circle + name + `fb` + score, color by band).
- "Listing signals" section:
  - Eyebrow `LISTING SIGNALS`, heading "What we picked up."
  - Editorial paragraph composed at runtime by combining `verdict` with the top `issues[0]` (`title` + `problem`) into 2 sentences.
  - Three columns: Strengths (green, ✓ bullets — `wins` + `checks` where `ok===true`), Gaps (neutral, – bullets — `issues` `title + problem` + `checks` where `ok===false`), Missed opportunities (amber, • bullets — `fixes` where `tier==="quick_win"`, formatted `title: fix`).
  - Mobile order: Gaps → Strengths → Missed opportunities.
- "Host performance signals" section:
  - Eyebrow `HOST PERFORMANCE SIGNALS`. Four compact cards from `advisoryNotes` — small icon + `area` heading + `note` body. Icons mapped by area (↗ Booking, ⏱ Response, £ Price, 📅 Calendar).

**Tab 2 — Diagnostic**
- Shadcn Accordion, single open. Auto-open the first category that contains a `quick_win` fix.
- 6 cards mapped to API `area`: Title, Opening description (`Overview`), Full description (`Description`), Amenities, Photos, Reviews and rating.
- Header: name + severity badge (HIGH if any `quick_win` in category, else MEDIUM).
- Body — every card opens with a "Current" tinted block:
  - Title → `title` verbatim
  - Opening description → `overview` verbatim
  - Full description → first 300 chars of `description` + "..." if longer
  - Photos → `photoCount`, `photoAnalysis.verdict`, short list of `photoAnalysis.signals`
  - Amenities → amenity count + first 10 amenities as comma list
  - Reviews → `categoryRatings` as 3×2 grid coloured by `categoryRatingBand`, then "Host replied to X% of recent reviews." from `hostResponseRatio`
- Then for each fix in the category: bold title, "What's weak" (`whyItMatters`, grey), "Recommended" (`fix` in tinted block with copy button top-right → "Copied!" 1.5s), "Where" (`where`, small grey), difficulty pill.
- Empty category: show `cats.fb` + neutral "No issues found in this category."

**Tab 3 — Next step**
- 1+2 grid (left wider, dominant). Mobile order: call → referral → newsletter.
- Left primary card: pink border, blush bg, eyebrow `WORK TOGETHER`, heading "Book a strategy call", body, 4 bullets, meta line, full-width pink filled "Book a call" (`href="#"`).
- Right top — Referral: eyebrow `GET MORE AUDITS`, link icon in pink circle, copy from brief, outline "Copy my link". On click: `refCode = btoa(email).slice(0,10)`, copy `https://airbnb-audit-rho.vercel.app/audit?ref=<code>`, button → "Copied!" 2s.
- Right bottom — Newsletter: eyebrow `STAY INFORMED`, envelope in pink circle, outline "Join free" → inline "You're in." No network.

### Sample report (`/sample`)

- `src/pages/SampleReport.tsx` renders the same Results layout against the hardcoded JSON from the brief (`src/lib/sampleData.ts`). All tabs functional, no API calls.
- Pink banner top: "This is a sample report. Audit your own listing free." with link to `/`.
- "Audit another listing" returns to `/`.

### Credit gate logic

- After first successful audit: if `pendingRef` exists, call `redeemRef(email, pendingRef)` then clear it.
- On subsequent audit submits (in same session, or when `auditEmail` already exists): `checkCredits(email)`.
  - `credits > 0`: `useCredit(email)` then proceed.
  - Otherwise: shadcn Dialog — "You've used your free audit. Share with a host to unlock another." with the same copy-link button.

### Error states

- 90s timeout / 5xx: full error screen with message + "Try again".
- Non-Airbnb URL: inline error under input, no submit.
- 422 listing not found: "This listing could not be found. Check the URL is public and try again."

### Responsive

- Desktop: layouts as described.
- Tablet: stack summary sections, shrink Next step columns.
- Mobile: single column throughout, full-width CTAs, compact listing card, no horizontal scroll. Listing signals columns reorder Gaps → Strengths → Missed opportunities. Next step reorders call → referral → newsletter.

### Technical notes

- Frontend-only; no Lovable Cloud, no auth, no database. Vercel API untouched.
- All colors via CSS variables/tokens; no raw hex in components (the pink lives in `--brand`).
- New files (indicative):
  - `src/pages/Index.tsx` (replace placeholder), `src/pages/SampleReport.tsx`
  - `src/lib/api.ts`, `src/lib/types.ts`, `src/lib/scoring.ts`, `src/lib/sampleData.ts`
  - `src/hooks/useAuditFlow.ts`, `src/hooks/useCopyToClipboard.ts`
  - `src/components/landing/{Hero,UrlForm,PreviewPanel}.tsx`
  - `src/components/{EmailGateModal,LoadingScreen,ErrorScreen,CreditGateModal}.tsx`
  - `src/components/results/{ListingCard,BottomTenRiskBanner,EmailReportBar,ResultsTabs,SummaryTab,DiagnosticTab,NextStepTab,ScoreRing,CategoryRow,SignalColumn,AdvisoryCard,FixCard,CurrentBlock,CopyButton}.tsx`

### Out of scope

- Backend changes (Vercel API untouched; `/api/send-report` left as a TODO on the server).
- Real Calendly link, real newsletter integration — placeholders/inline-only as specified.
