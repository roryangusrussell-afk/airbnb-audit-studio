import { Check, Minus, Wand2, Target } from "lucide-react";
import type { AuditResponse, Issue, Fix, PositioningDiagnosis } from "@/lib/types";
import { Eyebrow } from "@/components/Eyebrow";
import { ScoreRing, VerdictLabel } from "./ScoreRing";
import { ScoreBreakdown } from "./ScoreBreakdown";

interface SignalItem {
  title: string;
  detail?: string;
  badge?: string;
}

function buildFallbackSignals(data: AuditResponse): string {
  const top = data.issues[0];
  if (!top) return data.verdict;
  return `${data.verdict} ${top.title}: ${top.problem}.`;
}

function buildStrengths(data: AuditResponse): SignalItem[] {
  const items: SignalItem[] = [];
  for (const w of data.wins) {
    items.push({ title: w });
  }
  for (const c of data.checks.filter((c) => c.ok === true)) {
    if (!items.some((i) => i.title === c.label)) {
      items.push({ title: c.label });
    }
  }
  return items;
}

function buildGapsAndRisks(data: AuditResponse): SignalItem[] {
  const items: SignalItem[] = [];
  for (const issue of data.issues) {
    if (issue.type === "opportunity") continue;
    items.push({
      title: issue.title,
      detail: issue.problem,
      badge: issue.type === "perception_risk" ? "perception risk" : undefined,
    });
  }
  for (const c of data.checks.filter((c) => c.ok === false)) {
    const alreadyCovered = data.issues.some(
      (i) => i.title.toLowerCase().includes(c.label.toLowerCase().slice(0, 12)),
    );
    if (!alreadyCovered) {
      items.push({ title: c.label });
    }
  }
  return items;
}

function buildOpportunities(data: AuditResponse): SignalItem[] {
  const items: SignalItem[] = [];
  const opportunityIssues = data.issues.filter((i) => i.type === "opportunity");
  for (const issue of opportunityIssues) {
    items.push({ title: issue.title, detail: issue.action });
  }
  const opportunityTitles = new Set(opportunityIssues.map((i) => i.title.toLowerCase()));
  for (const fix of data.fixes.filter((f) => f.tier === "quick_win")) {
    if (!opportunityTitles.has(fix.title.toLowerCase())) {
      items.push({ title: fix.title, detail: fix.fix });
    }
  }
  return items;
}

export function SummaryTab({ data }: { data: AuditResponse }) {
  const strengths = buildStrengths(data);
  const gapsAndRisks = buildGapsAndRisks(data);
  const opportunities = buildOpportunities(data);
  const mainOpportunity = data.issues[0]?.action;
  const editorialText = data.listingSignals || buildFallbackSignals(data);

  return (
    <div className="space-y-10">
      {/* Score + categories */}
      <section className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <div className="grid items-center gap-5 lg:grid-cols-[auto_1px_minmax(0,1fr)] lg:gap-7">
          <div className="flex flex-col items-center text-center">
            <ScoreRing score={data.score} />
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <VerdictLabel score={data.score} />
            </div>
          </div>
          <div className="hidden lg:block w-px self-center h-[78%] bg-border/40" />
          <div>
            <ScoreBreakdown cats={data.cats} />
          </div>
        </div>
        {mainOpportunity && (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-brand-border bg-brand-soft/50 px-3.5 py-1.5">
            <Wand2 className="h-3.5 w-3.5 flex-none text-brand" />
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
              Priority fix
            </div>
            <p className="text-[12.5px] leading-snug text-foreground">{mainOpportunity}</p>
          </div>
        )}
      </section>

      {/* Listing signals */}
      <section>
        <Eyebrow>Listing signals</Eyebrow>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">What we picked up.</h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground">
          {editorialText}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SignalColumn
            tone="strong"
            title="Strengths"
            items={strengths}
            icon={<Check className="h-3.5 w-3.5" />}
          />
          <SignalColumn
            tone="rose"
            title="Gaps & risks"
            items={gapsAndRisks}
            icon={<Minus className="h-3.5 w-3.5" />}
          />
          <SignalColumn
            tone="warning"
            title="Opportunities"
            items={opportunities}
            icon={<span className="block h-1.5 w-1.5 rounded-full bg-current" />}
          />
        </div>
      </section>

      {/* Positioning diagnosis */}
      {data.positioningDiagnosis && (
        <section>
          <Eyebrow>Positioning</Eyebrow>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">How guests read this listing.</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DiagnosisCard
              label="Target guest"
              content={data.positioningDiagnosis.targetGuest}
              tone="neutral"
            />
            <DiagnosisCard
              label="What it promises"
              content={data.positioningDiagnosis.promise}
              tone="neutral"
            />
            <DiagnosisCard
              label="Review alignment"
              content={data.positioningDiagnosis.reviewAlignment}
              tone="warning"
            />
            <DiagnosisCard
              label="Suggested adjustment"
              content={data.positioningDiagnosis.adjustment}
              tone="brand"
            />
          </div>
        </section>
      )}
    </div>
  );
}

function SignalColumn({
  title,
  items,
  icon,
  tone,
}: {
  title: string;
  items: SignalItem[];
  icon: React.ReactNode;
  tone: "strong" | "warning" | "rose";
}) {
  const toneClasses =
    tone === "strong"
      ? "border-success-border bg-success-soft"
      : tone === "warning"
        ? "border-warning-border bg-warning-soft"
        : "border-brand-border bg-brand-soft/60";
  const headerColor =
    tone === "strong" ? "text-success" : tone === "warning" ? "text-warning" : "text-brand";
  const bulletColor =
    tone === "strong" ? "text-success" : tone === "warning" ? "text-warning" : "text-brand";

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses}`}>
      <h4 className={`text-xs font-bold uppercase tracking-[0.14em] ${headerColor}`}>{title}</h4>
      <ul className="mt-3 space-y-3.5">
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">Nothing to report.</li>
        )}
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span
              className={`mt-1 flex h-3.5 w-3.5 flex-none items-center justify-center ${bulletColor}`}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-sm font-semibold leading-snug text-foreground">
                  {item.title}
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              {item.detail && (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiagnosisCard({
  label,
  content,
  tone,
}: {
  label: string;
  content: string;
  tone: "neutral" | "warning" | "brand";
}) {
  const wrapperCls =
    tone === "warning"
      ? "border-warning-border bg-warning-soft/50"
      : tone === "brand"
        ? "border-brand-border bg-brand-soft/50"
        : "border-border bg-card";
  const labelCls =
    tone === "warning"
      ? "text-warning"
      : tone === "brand"
        ? "text-brand"
        : "text-muted-foreground";

  return (
    <div className={`rounded-xl border p-4 ${wrapperCls}`}>
      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${labelCls}`}>
        <Target className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{content}</p>
    </div>
  );
}
