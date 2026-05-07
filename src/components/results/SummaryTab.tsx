import { Check, Minus } from "lucide-react";
import type { AuditResponse, Fix } from "@/lib/types";
import { Eyebrow } from "@/components/Eyebrow";
import { ScoreRing, VerdictLabel } from "./ScoreRing";
import { ScoreBreakdown } from "./ScoreBreakdown";

function buildOpening(data: AuditResponse): string {
  const top = data.issues[0];
  if (!top) return data.verdict;
  return `${data.verdict} ${top.title}: ${top.problem}.`;
}

export function SummaryTab({ data }: { data: AuditResponse }) {
  const strengths: string[] = [
    ...data.wins,
    ...data.checks.filter((c) => c.ok === true).map((c) => c.label),
  ];
  const gaps: string[] = [
    ...data.issues.map((i) => `${i.title}: ${i.problem}`),
    ...data.checks.filter((c) => c.ok === false).map((c) => c.label),
  ];
  const missed: Fix[] = data.fixes.filter((f) => f.tier === "quick_win");
  const mainOpportunity = data.issues[0]?.action;

  return (
    <div className="space-y-10">
      {/* Score + categories */}
      <section className="rounded-2xl border bg-card p-5 shadow-card sm:p-6">
        <div className="grid items-center gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <ScoreRing score={data.score} />
            <div className="mt-4 space-y-1.5">
              <VerdictLabel score={data.score} />
              <p className="max-w-[14rem] text-xs leading-snug text-muted-foreground">
                Strong review base, but the listing is underusing its main USP.
              </p>
            </div>
          </div>
          <div className="lg:max-w-md">
            <ScoreBreakdown cats={data.cats} />
          </div>
        </div>
        {mainOpportunity && (
          <div className="mt-5 flex flex-col gap-1 rounded-lg border border-brand-border bg-brand-soft/50 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
              Priority fix
            </div>
            <p className="text-[13px] leading-snug text-foreground">{mainOpportunity}</p>
          </div>
        )}
      </section>

      {/* Listing signals */}
      <section>
        <Eyebrow>Listing signals</Eyebrow>
        <h3 className="mt-2 text-2xl font-bold tracking-tight">What we picked up.</h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground">
          {buildOpening(data)}
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
            title="Gaps"
            items={gaps}
            icon={<Minus className="h-3.5 w-3.5" />}
          />
          <SignalColumn
            tone="warning"
            title="Missed opportunities"
            items={missed.map((f) => `${f.title}: ${f.fix}`)}
            icon={<span className="block h-1.5 w-1.5 rounded-full bg-current" />}
          />
        </div>
      </section>
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
  items: string[];
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
      <ul className="mt-3 space-y-2.5">
        {items.length === 0 && (
          <li className="text-sm text-muted-foreground">Nothing to report.</li>
        )}
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug text-foreground">
            <span className={`mt-1 flex h-3.5 w-3.5 flex-none items-center justify-center ${bulletColor}`}>
              {icon}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
