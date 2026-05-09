# Auditable

Free Airbnb listing audit. Paste a URL → get a score out of 100 across six categories with copy-ready fixes.

This repo is the frontend only. The audit endpoint lives in a separate service at `https://airbnb-audit-rho.vercel.app`.

## Develop

```bash
npm install
npm run dev      # http://localhost:8080
npm run test     # vitest run
npm run lint
npm run build
```

Optional: copy `.env.example` to `.env.local` and set `VITE_AUDIT_TOKEN` if the backend has its frontend-token gate enabled.

## Stack

Vite + React 18 + TypeScript, Tailwind + shadcn/ui (Radix), TanStack Query, React Router, Vitest.

See [`CLAUDE.md`](./CLAUDE.md) for architecture notes — the audit flow state machine, the dual-channel error model in `runAudit`, and the band/scoring token system.
