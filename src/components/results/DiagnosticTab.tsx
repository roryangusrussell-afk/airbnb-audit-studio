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
  Award,
  Camera,
  Image as ImageIconLucide,
  Type as TypeIcon,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { bandTextClass, scoreBand } from "@/lib/scoring";
import { getCategoryMeta } from "@/lib/categoryMeta";
import type { AuditResponse, Fix } from "@/lib/types";

const CARDS: { id: string; label: string; area: string }[] = [
  { id: "title", label: "Title", area: "Title" },
  { id: "opening", label: "Opening description", area: "Overview" },
  { id: "full", label: "Full description", area: "Description" },
  { id: "photos", label: "Photos", area: "Photos" },
  { id: "amenities", label: "Amenities", area: "Amenities" },
  { id: "reviews", label: "Reviews & rating", area: "Reviews & rating" },
];

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

export function DiagnosticTab({ data }: { data: AuditResponse }) {
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

  // Default = first weakest area with quick_win.
  const defaultId = useMemo(() => {
    let best: { id: string; score: number } | null = null;
    for (const c of CARDS) {
      const fixes = fixesByArea[c.area] ?? [];
      const s = catByName[c.area]?.score ?? 100;
      if (fixes.some((f) => f.tier === "quick_win") && s < 75) {
        if (!best || s < best.score) best = { id: c.id, score: s };
      }
    }
    return best?.id ?? CARDS[0].id;
  }, [fixesByArea, catByName]);

  const [activeId, setActiveId] = useState(defaultId);

  // Hide areas without data.
  const availableCards = CARDS.filter((c) => {
    if (c.area === "Amenities") return data.amenities.length > 0;
    return catByName[c.area] !== undefined;
  });

  const active = availableCards.find((c) => c.id === activeId) ?? availableCards[0];
  const activeIndex = availableCards.findIndex((c) => c.id === active.id);
  const next = availableCards[activeIndex + 1] ?? null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <AuditAreasRail
        cards={availableCards}
        activeId={active.id}
        onSelect={(id) => setActiveId(id)}
      />
      <DetailPanel
        card={active}
        data={data}
        fixes={fixesByArea[active.area] ?? []}
        catScore={catByName[active.area]?.score ?? 0}
        catFb={catByName[active.area]?.fb}
        nextCard={next}
        onGoNext={(id) => setActiveId(id)}
      />
    </div>
  );
}

function AuditAreasRail({
  cards,
  activeId,
  onSelect,
}: {
  cards: { id: string; label: string; area: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="rounded-2xl border bg-card p-3 shadow-card">
      <div className="px-2 pt-1.5 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Audit areas
      </div>
      <ul className="space-y-1">
        {cards.map((c) => {
          const meta = getCategoryMeta(c.area);
          const Icon = meta.icon;
          const isActive = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={`group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-brand-soft"
                    : "hover:bg-muted/60"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-[10px] ${meta.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${meta.iconText}`} />
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight ${
                    isActive ? "text-brand" : "text-foreground"
                  }`}
                >
                  {c.label}
                </span>
                <ChevronRight
                  className={`h-3.5 w-3.5 flex-none ${
                    isActive ? "text-brand" : "text-muted-foreground/70"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
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
  card: { id: string; label: string; area: string };
  data: AuditResponse;
  fixes: Fix[];
  catScore: number;
  catFb?: string;
  nextCard: { id: string; label: string; area: string } | null;
  onGoNext: (id: string) => void;
}) {
  const meta = getCategoryMeta(card.area);
  const band = scoreBand(catScore);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-foreground">
            {card.label}
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{meta.subtext}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[18px] font-bold tabular-nums ${bandTextClass(band)}`}>
            {catScore}
            <span className="font-normal text-muted-foreground">/100</span>
          </span>
          <ScoreBar score={catScore} />
        </div>
      </div>

      {/* Current read */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          Current read
        </div>
        <p className="text-[13.5px] leading-6 text-foreground">
          {catFb ?? "No diagnosis available for this area."}
        </p>
      </div>

      {/* Signal cards */}
      <SignalCards area={card.area} data={data} />

      {/* What we found */}
      <FoundList area={card.area} data={data} />

      {/* Fix cards */}
      {fixes.length > 0 ? (
        <div className="mt-5 space-y-3">
          {fixes.map((f) => (
            <FixCard key={f.rank + f.title} fix={f} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          No recommended fixes in this category — this area is performing well.
        </div>
      )}

      {/* Next-area navigation */}
      {nextCard && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border bg-muted/30 px-4 py-3">
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
            className="gap-1.5"
          >
            Go to {nextCard.label}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
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
        iconBg: "bg-muted",
        iconText: "text-muted-foreground",
        value: `0/${total}`,
        label: "With captions",
        note: "Major metadata gap",
        noteTone: "bad",
      },
      {
        Icon: Camera,
        iconBg: "bg-warning-soft",
        iconText: "text-warning",
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
    if (typeof data.rating === "number") {
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
    if (typeof data.reviewCount === "number") {
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
  if (area === "Amenities") {
    return [
      {
        Icon: Award,
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
    return [
      {
        Icon: CheckCircle2,
        iconText: "text-success",
        title: "Coverage is good",
        detail:
          "All key spaces are represented with a balanced mix of wide and detail shots.",
      },
      {
        Icon: XCircle,
        iconText: "text-danger",
        title: "Metadata is missing",
        detail: `None of the ${data.photoCount} photos have captions, which reduces clarity, accessibility and SEO.`,
      },
      {
        Icon: AlertTriangle,
        iconText: "text-warning",
        title: "Technical quality is capped",
        detail:
          "Several images are flagged for low light; some are slightly soft with limited dynamic range.",
      },
      {
        Icon: StarIcon,
        iconText: "text-success",
        title: "Aesthetic direction is strong",
        detail: "Warm, inviting tones and tidy styling create a cohesive, welcoming feel.",
      },
      {
        Icon: MinusCircle,
        iconText: "text-muted-foreground",
        title: "Kitchen is weakest",
        detail:
          "Dim lighting and clutter reduce cleanliness perception and guest confidence.",
      },
    ];
  }
  return [];
}

// ---------- fix card ----------

const EFFORT_PILL: Record<string, string> = {
  Easy: "bg-success-soft text-success border-success-border",
  Medium: "bg-warning-soft text-warning border-warning-border",
  Hard: "bg-danger-soft text-danger border-danger-border",
};

function FixCard({ fix }: { fix: Fix }) {
  const meta = getCategoryMeta(fix.area);
  const Icon = meta.icon;
  const pill = EFFORT_PILL[fix.difficulty] ?? "bg-muted text-muted-foreground border-border";

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
                  Recommended copy
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
