import { Check, Minus } from "lucide-react";
import type { AuditResponse, Fix } from "@/lib/types";
import { Eyebrow } from "@/components/Eyebrow";
import { ScoreRing, VerdictLabel } from "./ScoreRing";
import { CategoryRow } from "./CategoryRow";
import { AdvisoryCard } from "./AdvisoryCard";

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

  return (
    <div className="space-y-10">
      {/* Score + categories */}
      <section className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <ScoreRing score={data.score} />
            <div className="mt-5">
              <VerdictLabel score={data.score} />
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">{data.verdict}</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.cats.map((c) => (
              <CategoryRow key={c.name} cat={c} />
            ))}
          </div>
        </div>
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
            order="md:order-2"
            mobileOrder="order-2"
          />
          <SignalColumn
            tone="neutral"
            title="Gaps"
            items={gaps}
            icon={<Minus className="h-3.5 w-3.5" />}
            order="md:order-1"
            mobileOrder="order-1"
          />
          <SignalColumn
            tone="warning"
            title="Missed opportunities"
            items={missed.map((f) => `${f.title}: ${f.fix}`)}
            icon={<span className="block h-1.5 w-1.5 rounded-full bg-current" />}
            order="md:order-3"
            mobileOrder="order-3"
          />
        </div>
      </section>

      {/* Advisory */}
      {data.advisoryNotes.length > 0 && (
        <section>
          <Eyebrow>Host performance signals</Eyebrow>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.advisoryNotes.map((n) => (
              <AdvisoryCard key={n.area} note={n} />
            ))}
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
  order,
  mobileOrder,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  tone: "strong" | "warning" | "neutral";
  order?: string;
  mobileOrder?: string;
}) {
  const toneClasses =
    tone === "strong"
      ? "border-success-border bg-success-soft"
      : tone === "warning"
        ? "border-warning-border bg-warning-soft"
        : "border-border bg-card";
  const headerColor =
    tone === "strong" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  const bulletColor =
    tone === "strong"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : "text-muted-foreground";

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses} ${order ?? ""} ${mobileOrder ?? ""}`}>
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
