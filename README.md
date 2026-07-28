# Airbnb Audit Studio

AI-powered listing audit frontend for Airbnb hosts and short-term rental operators.

Live app: [airbnb-audit-studio.vercel.app](https://airbnb-audit-studio.vercel.app)  
Sample report: [airbnb-audit-studio.vercel.app/sample](https://airbnb-audit-studio.vercel.app/sample)

## Thirty-second review

- **Business problem:** hosts cannot easily tell which listing changes will improve clarity, conversion and AI-mediated discovery.
- **Product:** a live audit flow that turns a public Airbnb URL into diagnostics, prioritised fixes and safe paste-ready rewrites.
- **Commercial use:** the wider production system has analysed a 5,700-listing Lisbon dataset and supported an audit-led owner acquisition motion.
- **Trust boundary:** unsupported claims are omitted or bracketed, the tool never edits a listing, and the operational backend remains private.
- **Verification:** 81 frontend tests cover scoring, API failures, validation, state transitions, email capture and user actions.

## What it is

Airbnb Audit Studio lets a host paste a public Airbnb listing URL and receive a structured report on how clearly the listing reads to guests and Airbnb's AI features.

The report turns a scraped listing into:

- A headline score and plain-English verdict
- Category diagnostics across title, opening, description, amenities, photos, reviews, and conversion signals
- A ranked fix list
- Paste-ready rewrite suggestions for key Airbnb editor fields
- A "what this audit cannot see" panel for signals that require host-dashboard access
- Email capture, report delivery, referral, feedback, and credit-gate flows

The frontend is public. The production backend, API keys, scraping calls, AI prompts, payment hooks, and internal logging live outside this repo.

## Why I built it

I run short-term rental properties in Lisbon and kept seeing the same problem: hosts often have decent apartments but weak listing communication. Airbnb's newer AI-facing surfaces make this sharper, because missing or vague details can be invisible until they cost bookings.

This product was built as both:

- A practical diagnostic tool for hosts
- A lead-generation and operator-credibility asset for a short-term rental business

It is not a generic AI wrapper. The product judgement is in the rubric, the UX, the copy constraints, the safety rails, and the decision to keep hosts in control of every change.

## Product principles

- **Operator-led:** The audit is framed by real hosting workflows, not abstract SEO advice.
- **Human in the loop:** The app never edits a listing. It gives copy that a host can review and paste manually.
- **No fabrication:** Unknown details stay bracketed or are omitted. The audit must not invent amenities, views, bed sizes, policies, or neighbourhood claims.
- **Action before spectacle:** The result screen prioritises "what should I fix first?" over decorative analytics.
- **Honest blind spots:** Some conversion signals are not visible from a public listing. The UI names those limits instead of pretending to score them.

## Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix primitives
- React Router
- Vitest and Testing Library
- Vercel frontend deployment

## Frontend architecture

```text
src/
  pages/
    Index.tsx          Main audit flow
    SampleReport.tsx   Static sample report route
    Privacy.tsx        Legal page
    Terms.tsx          Legal page
    Cookies.tsx        Legal page

  hooks/
    useAuditFlow.ts    State machine for landing, loading, results, error, and email capture

  lib/
    api.ts             Backend API client
    types.ts           Audit response model
    scoring.ts         Score band and label helpers
    sampleData.ts      Static sample report fixture

  components/
    landing/           Hero, URL form, preview panel
    results/           Report tabs, score ring, rewrites, CTA panels, feedback flow
    ui/                shadcn/ui primitives
```

## App flow

1. Host submits a public Airbnb listing URL.
2. The frontend starts a cheap preview request for the loading screen.
3. The frontend calls the audit backend with a long timeout and one retry on transient failures.
4. A successful response renders the report across Summary, Diagnostic, and Next Step tabs.
5. Email capture happens after the report is generated, so users see value before being asked for details.
6. Lead capture, report delivery, referral redemption, and feedback submission are best-effort side effects.

## Reliability choices

- Body-encoded backend errors are parsed into friendly UI states.
- Provider-capacity failures are surfaced as a specific retry message, not raw API errors.
- The sample route lets the product be reviewed without spending scraper or AI budget.
- Tests cover URL validation, score labelling, API error handling, copy buttons, and the audit-flow state machine.

## Run locally

```bash
npm install
npm run dev
```

The frontend defaults to the production backend configured in `src/lib/api.ts`. To review the UI without calling the backend, use:

```text
http://localhost:8080/sample
```

## Verification

```bash
npm run lint
npm run test
npm run build
```

These checks also run automatically on every push and pull request.

## Public-safety note

This repo does not contain production API keys, scraper tokens, payment secrets, private host data, guest data, or backend prompts. The frontend may include public endpoint URLs and a build-time audit-token header hook. That token is documented in code as a rotatable speed bump, not real authentication.

## Portfolio case study

### Problem

Hosts struggle to know which listing edits actually matter. Generic AI rewrites often sound polished but fabricate details, use bland language, or ignore Airbnb's editor structure.

### Solution

I built a frontend that turns the audit into a guided workflow:

- Show the highest-leverage issue first
- Explain the score in concrete categories
- Separate current copy from recommended copy
- Let users copy safe, bracketed rewrite suggestions
- Keep unsupported claims out of the output

### What I personally worked on

- Product positioning and information architecture
- React result-screen structure and tab flow
- Error handling and retry UX
- Email capture after value delivery
- Referral, feedback, and credit-gate flows
- Mobile responsiveness and report layout
- Testing around URL validation, scoring labels, API responses, and state transitions

## Status

This is a working frontend connected to a production backend. The public repo is intended as a portfolio and product case study. The operational backend remains private because it contains paid API integrations, internal logging, and prompt/rubric implementation details.
