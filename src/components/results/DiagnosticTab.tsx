import { useMemo } from "react";
import { TrendingUp, ArrowUpRight, Minus, ChevronDown, MessageCircle, Clock, CheckCircle2, Sparkles, Star, Award } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CopyButton } from "@/components/CopyButton";
import { categoryRatingBand, bandTextClass, scoreBand } from "@/lib/scoring";
import { getCategoryMeta } from "@/lib/categoryMeta";
import type { AuditResponse, Fix } from "@/lib/types";

const CARDS: { id: string; label: string; area: string }[] = [
  { id: "title", label: "Title", area: "Title" },
  { id: "opening", label: "Opening description", area: "Overview" },
  { id: "full", label: "Full description", area: "Description" },
  { id: "amenities", label: "Amenities", area: "Amenities" },
  { id: "photos", label: "Photos", area: "Photos" },
  { id: "reviews", label: "Reviews & rating", area: "Reviews & rating" },
];

type Lift = "high" | "medium" | "low";

function potentialLift(fixes: Fix[], score: number): Lift {
  const hasQuickWin = fixes.some((f) => f.tier === "quick_win");
  if (hasQuickWin && score < 75) return "high";
  if (hasQuickWin) return "medium";
  if (fixes.length > 0 && score < 70) return "high";
  if (fixes.length > 0) return "medium";
  return "low";
}

function ScoreBar({ score }: { score: number }) {
  const band = scoreBand(score);
  const fill = band === "strong" ? "bg-success" : band === "average" ? "bg-warning" : "bg-warning";
  return (
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-24">
      <div
        className={`h-full rounded-full transition-all ${fill}`}
        style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
      />
    </div>
  );
}

function LiftBadge({ lift }: { lift: Lift }) {
  const cfg = {
    high: {
      label: "High potential lift",
      cls: "border-brand-border bg-brand-soft text-brand",
      Icon: TrendingUp,
    },
    medium: {
      label: "Medium potential lift",
      cls: "border-warning-border bg-warning-soft text-warning",
      Icon: ArrowUpRight,
    },
    low: {
      label: "Low potential lift",
      cls: "border-success-border bg-success-soft text-success",
      Icon: Minus,
    },
  }[lift];
  const { Icon } = cfg;
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold " +
        cfg.cls
      }
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{cfg.label}</span>
      <span className="sm:hidden">{lift === "high" ? "High lift" : lift === "medium" ? "Med lift" : "Low lift"}</span>
    </span>
  );
}

export function DiagnosticTab({ data }: { data: AuditResponse }) {
  const fixesByArea = useMemo(() => {
    const map: Record<string, Fix[]> = {};
    for (const f of data.fixes) {
      (map[f.area] ||= []).push(f);
    }
    return map;
  }, [data.fixes]);

  const catByName = useMemo(() => {
    const m: Record<string, { score: number; fb: string }> = {};
    for (const c of data.cats) m[c.name] = { score: c.score, fb: c.fb };
    return m;
  }, [data.cats]);

  const defaultOpen = useMemo(() => {
    let best: { id: string; score: number } | null = null;
    for (const c of CARDS) {
      const fixes = fixesByArea[c.area] ?? [];
      const lift = potentialLift(fixes, catByName[c.area]?.score ?? 100);
      if (lift === "high") {
        const s = catByName[c.area]?.score ?? 100;
        if (!best || s < best.score) best = { id: c.id, score: s };
      }
    }
    return best?.id ?? CARDS[0].id;
  }, [fixesByArea, catByName]);

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen} className="space-y-3">
      {CARDS.map((card) => {
        const fixes = fixesByArea[card.area] ?? [];
        const cat = catByName[card.area];
        const score = cat?.score ?? 0;
        const meta = getCategoryMeta(card.area);
        const Icon = meta.icon;
        const lift = potentialLift(fixes, score);
        const band = scoreBand(score);
        return (
          <AccordionItem
            key={card.id}
            value={card.id}
            className="group overflow-hidden rounded-2xl border bg-card !border-b shadow-card"
          >
            <AccordionTrigger
              className="px-4 py-3.5 hover:no-underline sm:px-5 [&>svg:last-child]:hidden"
            >
              <div className="flex w-full items-center gap-3 pr-1 sm:gap-4">
                <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${meta.iconBg}`}>
                  <Icon className={`h-4 w-4 ${meta.iconText}`} />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-[14px] font-semibold tracking-tight text-foreground">
                    {card.label}
                  </div>
                  <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                    {meta.subtext}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <ScoreBar score={score} />
                  <span className={`text-[12.5px] font-bold tabular-nums ${bandTextClass(band)}`}>
                    {score}
                    <span className="text-muted-foreground font-normal">/100</span>
                  </span>
                </div>
                <LiftBadge lift={lift} />
                <ChevronDown className="h-4 w-4 flex-none text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-5">
              <CurrentBlock area={card.area} data={data} />

              {fixes.length === 0 ? (
                <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                  {cat?.fb || "No issues found in this category."}
                </div>
              ) : (
                <div className="mt-4 space-y-5">
                  {fixes.map((f) => (
                    <FixBlock key={f.rank + f.title} fix={f} />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function CurrentBlock({ area, data }: { area: string; data: AuditResponse }) {
  const wrapper = "rounded-xl border bg-muted/40 p-4 text-sm";
  const eyebrow = (
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
      Current
    </div>
  );

  if (area === "Title") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 font-medium text-foreground">{data.title}</p>
      </div>
    );
  }
  if (area === "Overview") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 leading-relaxed text-foreground">{data.overview}</p>
      </div>
    );
  }
  if (area === "Description") {
    const txt = data.description ?? "";
    const display = txt.length > 300 ? txt.slice(0, 300) + "..." : txt;
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 leading-relaxed text-foreground">{display}</p>
      </div>
    );
  }
  if (area === "Photos") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 text-foreground">
          <span className="font-semibold">{data.photoCount} photos</span>
          {" · "}
          <span>{data.photoAnalysis.verdict}</span>
        </p>
        {data.photoAnalysis.signals?.length > 0 && (
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {data.photoAnalysis.signals.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  if (area === "Amenities") {
    const first10 = data.amenities.slice(0, 10).join(", ");
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 text-foreground">
          <span className="font-semibold">{data.amenities.length} amenities declared.</span>
        </p>
        <p className="mt-1 text-muted-foreground">{first10}{data.amenities.length > 10 ? "…" : ""}</p>
      </div>
    );
  }
  if (area === "Reviews & rating") {
    return <ReviewsExpanded data={data} />;
  }
  return null;
}

function ReviewsExpanded({ data }: { data: AuditResponse }) {
  const rating = data.rating;
  const reviewCount = data.reviewCount;
  const isGuestFav = data.isGuestFavorite ?? data.checks.some(
    (c) => c.label.toLowerCase().includes("guest favourite") && c.ok === true,
  );
  const tier = data.guestFavoriteTier;
  const rate = data.hostMessageResponseRate;
  const time = data.hostMessageResponseTime;

  const slowKeywords = ["few hours", "a day", "day or more", "within a day"];
  const isFast = typeof time === "string" && time.toLowerCase().includes("within an hour");
  const isSlow = typeof time === "string" && slowKeywords.some((k) => time.toLowerCase().includes(k));
  const goodResponse =
    typeof rate === "number" && rate >= 90 && isFast;
  const hasResponseData = (typeof rate === "number") || (typeof time === "string" && time.length > 0);

  const bits: React.ReactNode[] = [];
  if (typeof rating === "number") bits.push(<span key="r"><span className="font-semibold">{rating.toFixed(2)}</span> rating</span>);
  if (typeof reviewCount === "number") bits.push(<span key="c">{reviewCount} reviews</span>);
  if (isGuestFav) {
    bits.push(
      <span key="gf" className="inline-flex items-center gap-1.5">
        Guest Favourite
        {tier && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-success">
            <Award className="h-3 w-3" />
            {tier}
          </span>
        )}
      </span>,
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Current
        </div>
        {bits.length > 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2.5">
            <Star className="h-4 w-4 flex-none text-foreground" />
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-foreground">
              {bits.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground">·</span>}
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasResponseData && (
        <div>
          <h5 className="text-[13px] font-semibold tracking-tight text-foreground">Response time</h5>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {typeof rate === "number" && (
              <StatCard
                tone={goodResponse ? "good" : "warn"}
                Icon={MessageCircle}
                value={`${rate}%`}
                label="Response rate"
              />
            )}
            {typeof time === "string" && time.length > 0 && (
              <StatCard
                tone={goodResponse ? "good" : "warn"}
                Icon={Clock}
                value={time}
                label="Response time"
              />
            )}
          </div>

          <div className="mt-3 flex items-start gap-2 text-[12.5px] leading-snug text-muted-foreground">
            {goodResponse ? (
              <>
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />
                <p>You're responding quickly — keep this up to preserve guest trust and reduce booking hesitation.</p>
              </>
            ) : (
              <>
                <ArrowUpRight className="mt-0.5 h-4 w-4 flex-none text-warning" />
                <p>Slower responses can create booking hesitation. Aim to keep your response rate above 90% and reply within an hour where possible.</p>
              </>
            )}
          </div>

          <div className="mt-3 rounded-xl border border-brand-border bg-brand-soft px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
                Recommended
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
              {goodResponse
                ? "Maintain a response rate above 90% and aim to respond within an hour to keep guests confident and bookings strong."
                : "Use saved replies or automated first responses to improve reply speed and keep your response rate above 90%."}
            </p>
          </div>
        </div>
      )}

      {data.categoryRatings.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.categoryRatings.map((r) => {
            const band = categoryRatingBand(r.localizedRating);
            return (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">{r.label}</span>
                <span className={`text-sm font-bold tabular-nums ${bandTextClass(band)}`}>
                  {r.localizedRating}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({
  tone,
  Icon,
  value,
  label,
}: {
  tone: "good" | "warn";
  Icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  const cls =
    tone === "good"
      ? "border-success-border bg-success-soft/60"
      : "border-warning-border bg-warning-soft/60";
  const iconWrap =
    tone === "good"
      ? "bg-success-soft text-success"
      : "bg-warning-soft text-warning";
  return (
    <div className={`flex items-center gap-3 rounded-xl border ${cls} px-3.5 py-2.5`}>
      <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${iconWrap}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-[13.5px] font-semibold leading-tight text-foreground">{value}</div>
        <div className="truncate text-[11px] leading-tight text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function FixBlock({ fix }: { fix: Fix }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-brand">{fix.rank}</span>
        <h4 className="text-sm font-semibold tracking-tight text-foreground">{fix.title}</h4>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Effort: {fix.difficulty}
        </span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">What's weak</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fix.whyItMatters}</p>

      <div className="relative mt-3 rounded-xl border border-brand-border bg-brand-soft p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            Recommended
          </div>
          <CopyButton value={fix.fix} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{fix.fix}</p>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{fix.where}</p>
    </div>
  );
}
