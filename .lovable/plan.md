## Goal

Refine the Summary tab so it reads as a personalised, band-driven audit (not brand-pink/generic). Move the host response ratio signal into the Diagnostic tab's Reviews & Rating section.

## Changes

### 1. `src/components/results/ScoreRing.tsx`
- Replace hard-coded `hsl(var(--brand))` ring stroke with a band-derived colour using `scoreBand(score)`:
  - strong → `--success`
  - average → `--warning`
  - weak → `--danger`
- Apply the same band colour to the large numeric score inside the ring (`bandTextClass`).
- `VerdictLabel` becomes a small rounded pill: uppercase label, soft band background + band text colour + matching border (using existing `success-soft/border`, `warning-soft/border`, `danger-soft/border` tokens via a `bandSoftClasses` helper already in `lib/scoring.ts`).

### 2. `src/components/results/SummaryTab.tsx`
- **Score card**: under the verdict pill + verdict sentence, render a "Main opportunity" line sourced from `data.issues[0]?.action` (skip if absent). Style: compact row with left border in `--brand`, soft `bg-brand-soft/40` tint, small eyebrow "Main opportunity" + action text. This is the only place pink remains in this section.
- **Listing Signals reorder**: change DOM order to Strengths → Gaps → Missed opportunities, and drop the `order-*` overrides so they render in source order on every breakpoint.
- **Gaps card restyle**: add a new tone option (e.g. `tone="rose"`) in `SignalColumn` mapping to a soft rose palette using brand-soft tokens (`bg-brand-soft/60`, `border-brand-border`, header + bullet in a muted rose `text-brand/80`). Use dash icon (already `Minus`) but coloured with the rose tone, not muted-foreground grey.
- **Remove** the entire Host Performance Signals section (the `data.advisoryNotes` block) and the `AdvisoryCard` import.

### 3. `src/components/results/DiagnosticTab.tsx` — Reviews & Rating only
In the `CurrentBlock` for `Reviews & rating`:
- Keep the category rating grid as-is.
- Replace the existing "Host replied to X% of recent reviews" footnote with a band-aware treatment driven by `data.hostResponseRatio`:
  - `null/undefined` → render nothing.
  - `< 0.3` → render an inline issue card (rose/danger-soft tint, small eyebrow "Review response ratio") with:
    - Title: **Low review response ratio**
    - Finding: `Only {Math.round(ratio*100)}% of recent reviews have host replies.`
    - Why it matters / Recommended action copy exactly as specified in the brief.
  - `>= 0.3` → render a neutral/positive one-liner: `Review response ratio: {pct}% of recent reviews have host replies.` in muted/success tone (success-soft tint when `>= 0.7`, neutral muted otherwise).
- Label everywhere is "Review response ratio" — never "Response time".

### 4. No changes to
- `ListingCard`, `EmailReportBar`, `BottomTenRiskBanner`, tab structure, other Diagnostic accordion items, Next Step tab, or Hero/landing.
- `AdvisoryCard.tsx` file is left in place but unused by Summary (still importable elsewhere if needed).

## Final Summary tab structure (verification)
1. Listing card
2. BottomTenRisk banner (when applicable, unchanged)
3. Email report bar
4. Tabs
5. Score card (band-coloured ring + pill verdict + verdict sentence + Main opportunity line)
6. Listing Signals: Strengths → Gaps → Missed opportunities

No Host Performance Signals. No host response ratio on Summary.
