import { useMemo, useState } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star as StarIcon,
  MinusCircle,
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Clock,
  Camera,
  Image as ImageIconLucide,
  Type as TypeIcon,
  FileText,
  ListChecks,
  Zap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import { bandTextClass, scoreBand } from "@/lib/scoring";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { MultiToneRewriteCard, SingleRewriteCard } from "./RewriteCard";
import type {
  AuditResponse,
  Fix,
  MultiToneRewrite,
  SingleRewrite,
} from "@/lib/types";

type RewriteKind = "multi" | "single" | "none";

interface CardDef {
  id: string;
  label: string;
  area: string;
  rewriteKey?: keyof NonNullable<AuditResponse["rewrites"]>;
  rewriteKind: RewriteKind;
}

const CARDS: CardDef[] = [
  { id: "title", label: "Title", area: "Title", rewriteKey: "title", rewriteKind: "multi" },
  { id: "opening", label: "Opening description", area: "Overview", rewriteKey: "opening", rewriteKind: "multi" },
  { id: "theSpace", label: "The space", area: "TheSpace", rewriteKey: "theSpace", rewriteKind: "single" },
  { id: "guestAccess", label: "Guest access", area: "GuestAccess", rewriteKey: "guestAccess", rewriteKind: "single" },
  { id: "otherNotes", label: "Other things to note", area: "OtherNotes", rewriteKey: "otherNotes", rewriteKind: "single" },
  { id: "neighborhood", label: "Neighborhood", area: "Neighborhood", rewriteKey: "neighborhood", rewriteKind: "single" },
  { id: "houseRules", label: "House rules", area: "HouseRules", rewriteKey: "houseRules", rewriteKind: "single" },
  { id: "photos", label: "Photos", area: "Photos", rewriteKind: "none" },
  { id: "reviews", label: "Reviews & rating", area: "Reviews & rating", rewriteKind: "none" },
  { id: "conversion", label: "Conversion signals", area: "Conversion Signals", rewriteKind: "none" },
];

function getCurrentText(area: string, data: AuditResponse): string {
  switch (area) {
    case "Title":
      return data.title || "";
    case "Overview":
      return data.overview || "";
    case "TheSpace":
      return data.subsections?.theSpace || "";
    case "GuestAccess":
      return data.subsections?.guestAccess || "";
    case "OtherNotes":
      return data.subsections?.otherNotes || "";
    case "Neighborhood":
      return data.subsections?.neighborhood || "";
    case "HouseRules":
      return data.houseRules || "";
    default:
      return "";
  }
}

function ScoreBar({ score }: { score: number }) {
  const band = scoreBand(score);
  const fill = band === "strong" ? "bg-success" : "bg-warning";
  return (
    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:w-40">
      <div
        className={`h-full rounded-full transition-all ${fill}`}
        style={{ width: `${Math.max(4, Math.min(100, score))}%` }}
      />
    </div>
  );
}

export function DiagnosticTab({ data, printMode = false }: { data: AuditResponse; printMode?: boolean }) {
  const fixesByArea = useMemo(() => {
    const map: Record<string, Fix[]> = {};
    for (const f of data.fixes) (map[f.area] ||= []).push(f);
    return map;
  }, [data.fixes]);

  const catByName = useMemo(() => {
    const m: Record<string, { score: number; fb: string }> = {};
    for (const c of data.cats) m[c.name] = { score: c.score, fb: c.fb };
    return m;
  }, [data.cats]);

  // Hide rewrite sections when both the source data and the rewrite are absent.
  // Means we couldn't extract it AND Claude didn't return one.
  const availableCards = CARDS.filter((c) => {
    if (c.rewriteKind === "none") {
      return catByName[c.area] !== undefined;
    }
    const hasCurrent = getCurrentText(c.area, data).length > 0;
    const rewrite = c.rewriteKey ? data.rewrites?.[c.rewriteKey] : undefined;
    const hasRewrite = !!rewrite && (rewrite.keepAsIs || ("text" in rewrite ? !!rewrite.text : !!(rewrite as MultiToneRewrite).options?.length));
    return hasCurrent || hasRewrite;
  });

  // Default to the first card with an actionable rewrite (not keepAsIs).
  const defaultId = useMemo(() => {
    for (const c of availableCards) {
      if (c.rewriteKey && data.rewrites?.[c.rewriteKey]?.keepAsIs === false) {
        return c.id;
      }
    }
    return availableCards[0]?.id ?? CARDS[0].id;
  }, [availableCards, data.rewrites]);

  const [activeId, setActiveId] = useState(defaultId);

  if (printMode) {
    return (
      <div className="space-y-6">
        {availableCards.map((c) => (
          <DetailPanel
            key={c.id}
            card={c}
            data={data}
            fixes={fixesByArea[c.area] ?? []}
            catScore={catByName[c.area]?.score ?? null}
            catFb={catByName[c.area]?.fb}
            nextCard={null}
            onGoNext={() => {}}
          />
        ))}
      </div>
    );
  }

  const active = availableCards.find((c) => c.id === activeId) ?? availableCards[0];
  const activeIndex = availableCards.findIndex((c) => c.id === active.id);
  const next = availableCards[activeIndex + 1] ?? null;

  const scoredCards = availableCards.filter((c) => catByName[c.area] !== undefined);
  const diagnosticCards = availableCards.filter((c) => catByName[c.area] === undefined);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[232px_minmax(0,1fr)]">
      <AuditAreasRail
        scoredCards={scoredCards}
        diagnosticCards={diagnosticCards}
        activeId={active.id}
        onSelect={(id) => setActiveId(id)}
      />
      <DetailPanel
        card={active}
        data={data}
        fixes={fixesByArea[active.area] ?? []}
        catScore={catByName[active.area]?.score ?? null}
        catFb={catByName[active.area]?.fb}
        nextCard={next}
        onGoNext={(id) => setActiveId(id)}
      />
    </div>
  );
}

function AuditAreasRail({
  scoredCards,
  diagnosticCards,
  activeId,
  onSelect,
}: {
  scoredCards: CardDef[];
  diagnosticCards: CardDef[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const renderItem = (c: CardDef) => {
    const meta = getCategoryMeta(c.area);
    const Icon = meta.icon;
    const isActive = c.id === activeId;
    return (
      <li key={c.id} className="flex-none lg:flex-1">
        <button
          type="button"
          onClick={() => onSelect(c.id)}
          className={`group flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-2 py-2 text-left transition-colors lg:gap-2.5 ${
            isActive ? "bg-brand-soft" : "hover:bg-muted/40"
          }`}
          aria-current={isActive ? "true" : undefined}
        >
          <span
            className={`flex h-7 w-7 flex-none items-center justify-center rounded-[10px] lg:h-8 lg:w-8 ${
              isActive ? meta.iconBg : "bg-muted/50"
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${
                isActive ? meta.iconText : "text-muted-foreground/50"
              }`}
            />
          </span>
          <span
            className={`min-w-0 flex-1 text-[13px] leading-tight tracking-tight lg:whitespace-normal ${
              isActive ? "font-semibold text-brand" : "font-medium text-muted-foreground/75"
            }`}
            title={c.label}
          >
            {c.label}
          </span>

          <ChevronRight
            className={`hidden h-3.5 w-3.5 flex-none lg:block ${
              isActive ? "text-brand" : "text-muted-foreground/25"
            }`}
          />
        </button>
      </li>
    );
  };

  const groupHeading = (text: string) => (
    <div className="hidden px-2 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
      {text}
    </div>
  );

  return (
    <aside className="rounded-2xl border bg-card shadow-card lg:p-2.5">
      <div className="hidden px-2 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:block">
        Audit areas
      </div>

      {/* Mobile/tablet: a single horizontal scrolling row, no group headings (space-constrained). */}
      <ul className="flex gap-1.5 overflow-x-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
        {[...scoredCards, ...diagnosticCards].map((c) =>
          renderItem(c),
        )}
      </ul>

      {/* Desktop: grouped sections with headings + per-item badge. */}
      <div className="hidden lg:block">
        {scoredCards.length > 0 && (
          <>
            {groupHeading("Scored sections")}
            <ul className="space-y-0.5">
              {scoredCards.map((c) => renderItem(c))}
            </ul>
          </>
        )}
        {diagnosticCards.length > 0 && (
          <>
            {groupHeading("Description diagnostics")}
            <ul className="space-y-0.5">
              {diagnosticCards.map((c) => renderItem(c))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}


function DetailPanel({
  card,
  data,
  fixes,
  catScore,
  catFb,
  nextCard,
  onGoNext,
}: {
  card: CardDef;
  data: AuditResponse;
  fixes: Fix[];
  catScore: number | null;
  catFb?: string;
  nextCard: CardDef | null;
  onGoNext: (id: string) => void;
}) {
  const meta = getCategoryMeta(card.area);

  const rewrite = card.rewriteKey ? data.rewrites?.[card.rewriteKey] : undefined;
  const isRewriteSection = card.rewriteKind !== "none";

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-foreground">
            {card.label}
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{meta.subtext}</p>
        </div>
        <HeaderStatus
          catScore={catScore}
          rewriteKeepAsIs={rewrite?.keepAsIs}
          hasRewrite={!!rewrite}
          currentEmpty={isRewriteSection && getCurrentText(card.area, data).trim().length === 0}
        />
      </div>

      {isRewriteSection ? (
        <RewriteSection card={card} data={data} rewrite={rewrite} catFb={catFb} />
      ) : (
        <DiagnosticSection card={card} data={data} fixes={fixes} catFb={catFb} />
      )}

      {/* Next-area navigation */}
      {nextCard && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-card text-foreground">
              <ArrowRight className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-foreground">
                Next: {nextCard.label}
              </div>
              <div className="text-[12px] text-muted-foreground">
                Continue to see how your {nextCard.label.toLowerCase()} is performing.
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGoNext(nextCard.id)}
            className="w-full gap-1.5 sm:w-auto"
          >
            Go to {nextCard.label}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function HeaderStatus({
  catScore,
  rewriteKeepAsIs,
  hasRewrite,
  currentEmpty,
}: {
  catScore: number | null;
  rewriteKeepAsIs?: boolean;
  hasRewrite: boolean;
  currentEmpty?: boolean;
}) {
  if (typeof catScore === "number") {
    const band = scoreBand(catScore);
    return (
      <div className="flex items-center gap-3">
        <span className={`text-[18px] font-bold tabular-nums ${bandTextClass(band)}`}>
          {catScore}
          <span className="font-normal text-muted-foreground">/100</span>
        </span>
        <ScoreBar score={catScore} />
      </div>
    );
  }
  if (!hasRewrite) return null;
  const isAdd = !rewriteKeepAsIs && currentEmpty;
  const missingButKept = rewriteKeepAsIs && currentEmpty;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        missingButKept
          ? "border-warning-border bg-warning-soft text-warning"
          : rewriteKeepAsIs
          ? "border-success-border bg-success-soft text-success"
          : "border-border bg-card text-foreground"
      }`}
    >
      {missingButKept ? (
        <>
          <AlertTriangle className="h-3.5 w-3.5" />
          Section missing
        </>
      ) : rewriteKeepAsIs ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Keep as is
        </>
      ) : (
        <>
          <ArrowRight className="h-3.5 w-3.5 text-brand" />
          {isAdd ? "Add ready" : "Rewrite ready"}
        </>
      )}
    </span>
  );
}

function RewriteSection({
  card,
  data,
  rewrite,
  catFb,
}: {
  card: CardDef;
  data: AuditResponse;
  rewrite: MultiToneRewrite | SingleRewrite | undefined;
  catFb?: string;
}) {
  const current = getCurrentText(card.area, data);

  if (!rewrite) {
    return (
      <div className="mt-5 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
        Rewrite not available for this section yet. Try re-running the audit.
      </div>
    );
  }

  return (
    <>
      {catFb && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
            <Eye className="h-3.5 w-3.5" />
            What's weak
          </div>
          <p className="text-[13px] leading-6 text-muted-foreground">{catFb}</p>
        </div>
      )}

      <div className="mt-5">
        {card.rewriteKind === "multi" ? (
          <MultiToneRewriteCard
            current={current}
            rewrite={rewrite as MultiToneRewrite}
          />
        ) : (
          <SingleRewriteCard
            current={current}
            rewrite={rewrite as SingleRewrite}
          />
        )}
      </div>
    </>
  );
}

function DiagnosticSection({
  card,
  data,
  fixes,
  catFb,
}: {
  card: CardDef;
  data: AuditResponse;
  fixes: Fix[];
  catFb?: string;
}) {
  const isReviewsArea = card.area === "Reviews & rating";
  const hasReviewData =
    (typeof data.rating === "number" && data.rating > 0) ||
    (typeof data.reviewCount === "number" && data.reviewCount > 0);

  return (
    <>
      {isReviewsArea && !hasReviewData && (
        <div className="mt-5 rounded-xl border bg-muted/40 px-4 py-3 text-[13px] text-muted-foreground">
          <span className="font-semibold text-foreground">New listing.</span>{" "}
          Review trust cannot be assessed yet. This section will fill in as guests stay and leave reviews.
        </div>
      )}

      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          Current read
        </div>
        <p className="text-[13.5px] leading-6 text-foreground">
          {catFb ?? "No diagnosis available for this area."}
        </p>
      </div>

      <SignalCards area={card.area} data={data} />
      <SubratingsBreakdown area={card.area} data={data} />
      <FoundList area={card.area} data={data} />

      {fixes.length > 0 ? (
        <div className="mt-5 space-y-3">
          {fixes.map((f) => (
            <FixCard key={f.rank + f.title} fix={f} />
          ))}
        </div>
      ) : isReviewsArea && hasReviewData ? (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            No critical fixes in this category. Reviews are performing well.
          </div>
          <OptionalReplyCard />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          No recommended fixes in this category. This area is performing well.
        </div>
      )}
    </>
  );
}

function OptionalReplyCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Optional
          </div>
          <h4 className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">
            Reply to recent reviews that mention parking
          </h4>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[10.5px] font-semibold text-muted-foreground">
          Low effort
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-[1.5] text-muted-foreground">
        Guests already validate the parking and location. Short public replies can reinforce those
        signals for future guests scanning reviews.
      </p>
      <div className="mt-3 rounded-xl border bg-muted/40 px-3.5 py-3 text-[12.5px] leading-[1.5] text-foreground">
        "Thanks for staying with us, glad the private parking and Cais do Sodré location made the
        trip easier."
      </div>
    </div>
  );
}

// ---------- signal cards ----------

interface Metric {
  Icon: LucideIcon;
  iconBg: string;
  iconText: string;
  value: string;
  label: string;
  note: string;
  noteTone: "good" | "warn" | "bad" | "muted";
}

function SignalCards({ area, data }: { area: string; data: AuditResponse }) {
  const metrics = buildMetrics(area, data);
  if (metrics.length === 0) return null;
  return (
    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {metrics.map((m, i) => (
        <MetricCard key={i} m={m} />
      ))}
    </div>
  );
}

function MetricCard({ m }: { m: Metric }) {
  const dotCls =
    m.noteTone === "good"
      ? "bg-success"
      : m.noteTone === "warn"
      ? "bg-warning"
      : m.noteTone === "bad"
      ? "bg-danger"
      : "bg-muted-foreground";
  return (
    <div className="rounded-xl border bg-card px-3.5 py-3">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${m.iconBg}`}>
          <m.Icon className={`h-4 w-4 ${m.iconText}`} />
        </span>
        <div className="min-w-0">
          <div className="text-[16px] font-bold leading-tight text-foreground tabular-nums">
            {m.value}
          </div>
          <div className="truncate text-[12px] leading-tight text-muted-foreground">{m.label}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dotCls}`} />
        <span className="truncate">{m.note}</span>
      </div>
    </div>
  );
}

function buildMetrics(area: string, data: AuditResponse): Metric[] {
  if (area === "Photos") {
    const total = data.photoCount;
    const captioned = data.captionedCount ?? 0;
    const captionRatio = total > 0 ? captioned / total : 0;
    const lowLight = data.photoAnalysis.signals.filter((s) =>
      /low.?light|dim/i.test(s),
    ).length;
    return [
      {
        Icon: ImageIconLucide,
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        value: String(total),
        label: "Photos",
        note: total >= 20 ? "Enough coverage" : "Below recommended count",
        noteTone: total >= 20 ? "good" : "warn",
      },
      {
        Icon: FileText,
        iconBg: captionRatio >= 0.5 ? "bg-success-soft" : captioned > 0 ? "bg-warning-soft" : "bg-muted",
        iconText: captionRatio >= 0.5 ? "text-success" : captioned > 0 ? "text-warning" : "text-muted-foreground",
        value: `${captioned}/${total}`,
        label: "With captions",
        note:
          captionRatio >= 0.5
            ? "Strong caption coverage"
            : captioned > 0
            ? "Partial coverage"
            : "Major metadata gap",
        noteTone: captionRatio >= 0.5 ? "good" : captioned > 0 ? "warn" : "bad",
      },
      {
        Icon: Camera,
        iconBg: lowLight > 0 ? "bg-warning-soft" : "bg-success-soft",
        iconText: lowLight > 0 ? "text-warning" : "text-success",
        value: String(Math.max(lowLight, 0)),
        label: "Low-light flags",
        note: lowLight > 0 ? "Technical quality issue" : "No low-light flags",
        noteTone: lowLight > 0 ? "warn" : "good",
      },
    ];
  }
  if (area === "Title") {
    const t = data.title ?? "";
    const len = t.length;
    return [
      {
        Icon: TypeIcon,
        iconBg: "bg-violet-50",
        iconText: "text-violet-600",
        value: String(len),
        label: "Characters",
        note: len > 50 ? "Within range" : "Could use more detail",
        noteTone: len > 50 ? "good" : "warn",
      },
    ];
  }
  if (area === "Reviews & rating") {
    const out: Metric[] = [];
    if (typeof data.rating === "number" && data.rating > 0) {
      out.push({
        Icon: StarIcon,
        iconBg: "bg-success-soft",
        iconText: "text-success",
        value: data.rating.toFixed(2),
        label: "Overall rating",
        note: data.rating >= 4.8 ? "Top tier" : "Solid",
        noteTone: data.rating >= 4.8 ? "good" : "warn",
      });
    }
    if (typeof data.reviewCount === "number" && data.reviewCount > 0) {
      out.push({
        Icon: MessageCircle,
        iconBg: "bg-brand-soft",
        iconText: "text-brand",
        value: String(data.reviewCount),
        label: "Reviews",
        note: data.reviewCount >= 25 ? "Strong volume" : "Building social proof",
        noteTone: data.reviewCount >= 25 ? "good" : "warn",
      });
    }
    if (typeof data.hostMessageResponseRate === "number") {
      const r = data.hostMessageResponseRate;
      out.push({
        Icon: Clock,
        iconBg: r >= 90 ? "bg-success-soft" : "bg-warning-soft",
        iconText: r >= 90 ? "text-success" : "text-warning",
        value: `${r}%`,
        label: "Response rate",
        note: r >= 90 ? "Above benchmark" : "Below benchmark",
        noteTone: r >= 90 ? "good" : "warn",
      });
    }
    return out;
  }
  if (area === "Conversion Signals") {
    const ibCheck = data.checks?.find((c) => c.label === "Instant Book enabled");
    const ibOn = ibCheck?.ok === true;
    const ibUnknown = ibCheck?.ok === "unknown" || ibCheck == null;
    const gfCheck = data.checks?.find((c) => c.label === "Guest Favourite status");
    const gfOn = gfCheck?.ok === true;
    const out: Metric[] = [
      {
        Icon: Zap,
        iconBg: ibOn ? "bg-success-soft" : ibUnknown ? "bg-muted" : "bg-warning-soft",
        iconText: ibOn ? "text-success" : ibUnknown ? "text-muted-foreground" : "text-warning",
        value: ibOn ? "On" : ibUnknown ? "Unknown" : "Off",
        label: "Instant Book",
        note: ibOn ? "15-25% ranking boost active" : ibUnknown ? "Could not detect" : "Missing 15-25% ranking boost",
        noteTone: ibOn ? "good" : "warn",
      },
      {
        Icon: TrendingUp,
        iconBg: gfOn ? "bg-success-soft" : "bg-muted",
        iconText: gfOn ? "text-success" : "text-muted-foreground",
        value: gfOn ? (data.guestFavoriteTier ?? "Yes") : "No",
        label: "Guest Favourite",
        note: gfOn ? "Primary quality signal in 2026 algorithm" : "Not yet achieved",
        noteTone: gfOn ? "good" : "warn",
      },
    ];
    if (typeof data.hostMessageResponseRate === "number") {
      const r = data.hostMessageResponseRate;
      out.push({
        Icon: Clock,
        iconBg: r >= 90 ? "bg-success-soft" : "bg-warning-soft",
        iconText: r >= 90 ? "text-success" : "text-warning",
        value: `${r}%`,
        label: "Response rate",
        note: r >= 90 ? "Above Airbnb benchmark" : "Below Airbnb benchmark",
        noteTone: r >= 90 ? "good" : "warn",
      });
    }
    return out;
  }
  if (area === "Amenities") {
    return [
      {
        Icon: ListChecks,
        iconBg: "bg-success-soft",
        iconText: "text-success",
        value: String(data.amenities.length),
        label: "Declared",
        note: data.amenities.length >= 12 ? "Strong coverage" : "Add more",
        noteTone: data.amenities.length >= 12 ? "good" : "warn",
      },
    ];
  }
  return [];
}

// ---------- subratings breakdown ----------

const SUBRATING_ORDER = [
  "Cleanliness",
  "Accuracy",
  "Check-in",
  "Communication",
  "Location",
  "Value",
];

function HostStatusBadge({ status }: { status?: "individual" | "business" | null }) {
  if (!status) return null;
  const label = status === "business" ? "Business host" : "Individual host";
  const sub =
    status === "business"
      ? "Self-declared trader under EU disclosure rules"
      : "Non-trader (private host) under EU disclosure rules";
  const dotCls = status === "business" ? "bg-brand" : "bg-muted-foreground";
  return (
    <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border bg-card px-3.5 py-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotCls}`} />
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold text-foreground">{label}</div>
        <div className="truncate text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}

function SubratingsBreakdown({ area, data }: { area: string; data: AuditResponse }) {
  if (area !== "Reviews & rating") return null;
  const ratings = data.categoryRatings ?? [];
  if (ratings.length === 0) {
    return (
      <>
        <HostStatusBadge status={data.hostStatus} />
        <div className="mt-2.5 rounded-xl border bg-card px-4 py-3 text-[12px] text-muted-foreground">
          Sub-rating breakdown appears once the listing has a few reviews.
        </div>
      </>
    );
  }
  const sorted = [...ratings].sort((a, b) => {
    const ai = SUBRATING_ORDER.indexOf(a.label);
    const bi = SUBRATING_ORDER.indexOf(b.label);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return (
    <>
      <HostStatusBadge status={data.hostStatus} />
      <div className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {sorted.map((r) => {
        const n = parseFloat(r.localizedRating);
        const valueCls = !isFinite(n)
          ? "text-muted-foreground"
          : n >= 4.8
          ? "text-success"
          : n >= 4.5
          ? "text-warning"
          : "text-danger";
        return (
          <div
            key={r.label}
            className="rounded-xl border bg-card px-3 py-2.5 text-center"
          >
            <div className={`text-[15px] font-bold tabular-nums ${valueCls}`}>
              {r.localizedRating}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {r.label}
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}

// ---------- found list ----------

interface Found {
  Icon: LucideIcon;
  iconText: string;
  title: string;
  detail: string;
}

function FoundList({ area, data }: { area: string; data: AuditResponse }) {
  const items = buildFound(area, data);
  if (items.length === 0) return null;
  return (
    <div className="mt-5 rounded-xl border bg-card">
      <div className="border-b px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        What we found
      </div>
      <ul className="divide-y">
        {items.map((f, i) => (
          <li key={i} className="flex items-start gap-3 px-4 py-3">
            <f.Icon className={`mt-0.5 h-4 w-4 flex-none ${f.iconText}`} />
            <div className="min-w-0 grid gap-1 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4">
              <div className="text-[13px] font-semibold text-foreground">{f.title}</div>
              <div className="text-[13px] leading-5 text-muted-foreground">{f.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildFound(area: string, data: AuditResponse): Found[] {
  if (area === "Photos") {
    const out: Found[] = [];
    const total = data.photoCount;
    const captioned = data.captionedCount ?? 0;
    const verdict = data.photoAnalysis.verdict ?? "";
    const tech = data.photoAnalysis.technicalScore ?? 0;
    const aesthetic = data.photoAnalysis.aestheticScore ?? 0;
    const signals = data.photoAnalysis.signals ?? [];
    const missingRooms = data.photoAnalysis.missingRooms ?? [];

    if (total > 0) {
      out.push({
        Icon: total >= 20 ? CheckCircle2 : AlertTriangle,
        iconText: total >= 20 ? "text-success" : "text-warning",
        title: total >= 20 ? "Photo count is healthy" : "Photo count is light",
        detail:
          total >= 20
            ? `${total} photos give guests enough visual coverage to commit before booking.`
            : `${total} photos is below the 20+ benchmark guests expect when scrolling for high-conviction listings.`,
      });
    }

    if (captioned === 0 && total > 0) {
      out.push({
        Icon: XCircle,
        iconText: "text-danger",
        title: "No captions on any photo",
        detail: `None of the ${total} photos carry captions, which is a free conversion lever you're leaving unused. Captions add room context, amenity proof, and search depth.`,
      });
    } else if (captioned > 0 && captioned < total / 2) {
      out.push({
        Icon: AlertTriangle,
        iconText: "text-warning",
        title: "Caption coverage is partial",
        detail: `Only ${captioned} of ${total} photos have captions. The uncaptioned majority misses a chance to add specifics that build trust before guests reach the description.`,
      });
    } else if (captioned >= total / 2 && captioned > 0) {
      out.push({
        Icon: CheckCircle2,
        iconText: "text-success",
        title: "Caption coverage is strong",
        detail: `${captioned} of ${total} photos carry captions, adding context and specifics that lift conversion at the gallery stage.`,
      });
    }

    if (verdict) {
      const tone =
        /professional/i.test(verdict)
          ? { Icon: StarIcon, color: "text-success" }
          : /amateur/i.test(verdict)
          ? { Icon: AlertTriangle, color: "text-danger" }
          : { Icon: MinusCircle, color: "text-warning" };
      out.push({
        Icon: tone.Icon,
        iconText: tone.color,
        title: `Vision verdict: ${verdict}`,
        detail: `Technical quality scores ${tech}/100; aesthetic direction scores ${aesthetic}/100. The vision model treats this as ${verdict.toLowerCase()}-grade photography.`,
      });
    }

    if (signals.length > 0) {
      out.push({
        Icon: AlertTriangle,
        iconText: "text-warning",
        title: "Vision signals to address",
        detail: signals.slice(0, 3).join("; "),
      });
    }

    if (missingRooms.length > 0) {
      out.push({
        Icon: MinusCircle,
        iconText: "text-muted-foreground",
        title: "Room types not visible in sample",
        detail: `The sampled photos didn't show: ${missingRooms.join(", ")}. Confirm these rooms are present in the wider gallery so guests can self-qualify.`,
      });
    }

    return out;
  }
  return [];
}

// ---------- fix card ----------

const EFFORT_PILL: Record<string, string> = {
  Easy: "bg-success-soft text-success border-success-border",
  Medium: "bg-warning-soft text-warning border-warning-border",
  Hard: "bg-danger-soft text-danger border-danger-border",
};

const COPY_AREAS = new Set(["Title", "Overview", "Description"]);

function FixCard({ fix }: { fix: Fix }) {
  const meta = getCategoryMeta(fix.area);
  const Icon = meta.icon;
  const pill = EFFORT_PILL[fix.difficulty] ?? "bg-muted text-muted-foreground border-border";
  const fixLabel = COPY_AREAS.has(fix.area) ? "Recommended copy" : "Recommended action";

  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg ${meta.iconBg}`}>
          <Icon className={`h-4 w-4 ${meta.iconText}`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[14.5px] font-semibold tracking-tight text-foreground">
              {fix.title}
            </h4>
            <span
              className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${pill}`}
            >
              {fix.difficulty}
            </span>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Why this matters
              </div>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                {fix.whyItMatters}
              </p>
              <div className="mt-3 flex items-start gap-1.5 text-[12px] text-muted-foreground">
                <span className="font-semibold text-foreground">Where:</span>
                <span>{fix.where}</span>
              </div>
            </div>

            <div className="rounded-xl border border-brand-border bg-brand-soft p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
                  {fixLabel}
                </div>
                <CopyButton value={fix.fix} />
              </div>
              <p className="mt-2 text-[13px] leading-5 text-foreground">{fix.fix}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
