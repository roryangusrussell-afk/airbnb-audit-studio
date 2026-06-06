import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                               */
/* -------------------------------------------------------------------------- */

function EyebrowPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-border bg-brand-soft px-3 py-1 text-[12px] font-semibold text-brand">
      {children}
    </span>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand">
      {children}
    </div>
  );
}

/**
 * Two-column explainer panel. Text and a teaser UI card sit side by side on
 * desktop. On mobile the text always comes first (DOM order), then the card.
 * `reverse` flips the columns on desktop only, leaving mobile order intact.
 */
function FeaturePanel({
  eyebrow,
  heading,
  body,
  media,
  reverse = false,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-card sm:p-10 lg:p-12">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn(reverse && "lg:order-2")}>
          <EyebrowPill>{eyebrow}</EyebrowPill>
          <h2 className="mt-4 text-[26px] font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-3xl lg:text-[2.25rem]">
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {body}
          </p>
        </div>
        <div className={cn("flex justify-center lg:justify-end", reverse && "lg:order-1 lg:justify-start")}>
          {media}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel 1, Listing Health Score                                             */
/* -------------------------------------------------------------------------- */

function ScoreRingMini({ score }: { score: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative h-[104px] w-[104px] flex-none">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="hsl(var(--warning))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-extrabold leading-none tracking-tight tabular-nums text-foreground">
          {score}
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

function ScorePreviewCard() {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border/70 bg-card p-6 shadow-elevated sm:p-7">
      <CardLabel>Listing health score</CardLabel>
      <div className="mt-5 flex items-center gap-5">
        <ScoreRingMini score={71} />
        <div className="min-w-0">
          <div className="text-lg font-bold tracking-tight text-foreground">Room to grow</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            Your listing is solid, but a few weak areas could be reducing guest interest.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel 2, Category Breakdown                                               */
/* -------------------------------------------------------------------------- */

type Tone = "warn" | "good";

function BreakdownRow({ label, score, tone }: { label: string; score: number; tone: Tone }) {
  const barColor = tone === "good" ? "bg-success" : "bg-warning";
  const numColor = tone === "good" ? "text-success" : "text-warning";
  return (
    <div className="flex items-center gap-3">
      <div className="w-[76px] flex-none text-[13px] font-semibold text-foreground">{label}</div>
      <div
        className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${label} score`}
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${score}%` }} />
      </div>
      <div className={cn("w-7 flex-none text-right text-[13px] font-bold tabular-nums", numColor)}>
        {score}
      </div>
    </div>
  );
}

function CategoryBreakdownCard() {
  const rows: { label: string; score: number; tone: Tone }[] = [
    { label: "Title", score: 58, tone: "warn" },
    { label: "Photos", score: 61, tone: "warn" },
    { label: "Amenities", score: 80, tone: "good" },
    { label: "Reviews", score: 84, tone: "good" },
  ];
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border/70 bg-card p-6 shadow-elevated sm:p-7">
      <CardLabel>Category breakdown</CardLabel>
      <div className="mt-1.5 text-[15px] font-bold tracking-tight text-foreground">
        See the weak areas first
      </div>
      <div className="mt-5 space-y-3.5">
        {rows.map((r) => (
          <BreakdownRow key={r.label} {...r} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Panel 3, Priority Fixes                                                   */
/* -------------------------------------------------------------------------- */

function ImpactBadge({ level }: { level: "High" | "Medium" }) {
  const styles =
    level === "High"
      ? "border-brand-border bg-brand-soft text-brand"
      : "border-warning-border bg-warning-soft text-warning";
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        styles,
      )}
    >
      {level}
    </Badge>
  );
}

function FixRow({ index, title, level }: { index: number; title: string; level: "High" | "Medium" }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="text-[13px] font-bold tabular-nums text-muted-foreground/70">#{index}</span>
      <span className="min-w-0 flex-1 text-[14px] font-semibold text-foreground">{title}</span>
      <ImpactBadge level={level} />
    </div>
  );
}

function PriorityFixesCard() {
  const fixes: { title: string; level: "High" | "Medium" }[] = [
    { title: "Improve title clarity", level: "High" },
    { title: "Show proof in the gallery", level: "High" },
    { title: "Highlight top amenities", level: "Medium" },
  ];
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-border/70 bg-card p-6 shadow-elevated sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <CardLabel>Priority fixes</CardLabel>
        <span className="text-[11px] font-medium text-muted-foreground">Ranked by impact</span>
      </div>
      <div className="mt-2 divide-y divide-border">
        {fixes.map((f, i) => (
          <FixRow key={f.title} index={i + 1} title={f.title} level={f.level} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
        <Lock className="h-3.5 w-3.5 flex-none text-muted-foreground" strokeWidth={2} aria-hidden="true" />
        <span className="text-[12px] font-medium text-muted-foreground">
          Exact fixes unlock in the paid Fix Plan
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export function DiagnosisPreview() {
  return (
    <section id="how-it-works" className="scroll-mt-24 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="container space-y-7 sm:space-y-9">
        <FeaturePanel
          eyebrow="Listing health score"
          heading="Spot the biggest weak points."
          body="Our free diagnosis scores 20+ listing signals to show what may be holding your Airbnb back from more clicks, trust and bookings."
          media={<ScorePreviewCard />}
        />
        <FeaturePanel
          reverse
          eyebrow="Category breakdown"
          heading="See where the score comes from."
          body="The diagnosis breaks your listing into practical categories, so hosts can quickly see whether the issue is the title, photos, amenities, reviews or overall guest appeal."
          media={<CategoryBreakdownCard />}
        />
        <FeaturePanel
          eyebrow="Priority fixes"
          heading="Unlock a ranked fix list."
          body="Upgrade to the Fix Plan to turn the diagnosis into action. Get rewritten titles, photo guidance, description improvements and recommendations ordered by likely booking impact."
          media={<PriorityFixesCard />}
        />
      </div>
    </section>
  );
}
