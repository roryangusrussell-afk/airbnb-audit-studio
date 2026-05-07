import { Target, BadgeCheck, Star, Heart } from "lucide-react";
import type { AuditResponse } from "@/lib/types";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";
import { AnalystCommentaryCard } from "./AnalystCommentaryCard";
import { InsightCard, type SignalItem } from "./InsightCard";

// ---------- data builders ----------

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
  // Gaps are a quick-scan title list; detail lives in Analyst Commentary above.
  const items: SignalItem[] = [];
  for (const issue of data.issues) {
    if (issue.type === "opportunity") continue;
    items.push({ title: issue.title });
  }
  for (const c of data.checks.filter((c) => c.ok === false)) {
    const alreadyCovered = data.issues.some((i) =>
      i.title.toLowerCase().includes(c.label.toLowerCase().slice(0, 12)),
    );
    if (!alreadyCovered) {
      items.push({ title: c.label });
    }
  }
  return items;
}

function capitalizeFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function buildOpportunities(data: AuditResponse): SignalItem[] {
  const items: SignalItem[] = [];
  const opportunityIssues = data.issues.filter((i) => i.type === "opportunity");
  for (const issue of opportunityIssues) {
    const impact = capitalizeFirst(issue.impact) as "High" | "Medium" | "Low";
    items.push({ title: issue.title, detail: issue.action, impact });
  }
  const opportunityTitles = new Set(opportunityIssues.map((i) => i.title.toLowerCase()));
  const effortMap: Record<string, "Low" | "Medium" | "High"> = {
    Easy: "Low",
    Medium: "Medium",
    Hard: "High",
  };
  for (const fix of data.fixes.filter((f) => f.tier === "quick_win")) {
    if (!opportunityTitles.has(fix.title.toLowerCase())) {
      const impact: "High" | "Medium" = "High";
      const effort = effortMap[fix.difficulty] ?? "Medium";
      items.push({ title: fix.title, detail: fix.fix, impact, effort });
    }
  }
  return items;
}

// ---------- positioning card config ----------

const POSITIONING_CONFIG = [
  {
    key: "targetGuest" as const,
    title: "Target guest",
    Icon: Target,
    softBg: "bg-blue-50",
    iconText: "text-blue-500",
  },
  {
    key: "promise" as const,
    title: "What it promises",
    Icon: BadgeCheck,
    softBg: "bg-success-soft",
    iconText: "text-success",
  },
  {
    key: "reviewAlignment" as const,
    title: "Review alignment",
    Icon: Star,
    softBg: "bg-warning-soft",
    iconText: "text-warning",
  },
  {
    key: "adjustment" as const,
    title: "Suggested adjustment",
    Icon: Heart,
    softBg: "bg-brand-soft",
    iconText: "text-brand",
  },
];

// ---------- main component ----------

export function SummaryTab({ data }: { data: AuditResponse }) {
  const strengths = buildStrengths(data);
  const gapsAndRisks = buildGapsAndRisks(data);
  const opportunities = buildOpportunities(data);
  const mainOpportunity = data.issues[0]?.action;
  const introText = data.listingSignals || buildFallbackSignals(data);

  return (
    <div className="space-y-5">
      {/* Level 1 — primary: score + commentary */}
      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <ScoreBreakdownCard
          cats={data.cats}
          score={data.score}
          priorityFix={mainOpportunity}
        />
        <AnalystCommentaryCard data={data} introText={introText} />
      </section>

      {/* Level 2 — secondary: signal cards */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <InsightCard variant="strengths" items={strengths} />
        <InsightCard variant="gaps" items={gapsAndRisks} />
        <InsightCard variant="opportunities" items={opportunities} />
      </section>

      {/* Level 3 — supporting: positioning. Quieter visual treatment. */}
      {data.positioningDiagnosis && (
        <section>
          <div className="mb-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Positioning
            </div>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-foreground">
              How guests read this listing.
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {POSITIONING_CONFIG.map(({ key, title, Icon }) => {
              const body = data.positioningDiagnosis![key];
              if (!body) return null;
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-[#EDE8E6] bg-white p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      {title}
                    </div>
                  </div>
                  <p className="text-[13px] leading-5 text-[#3F4048]">{body}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="pt-2 text-center text-xs text-[#8A8B95]">
        Scoring is based on our proprietary audit model and Airbnb best practices as of{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        .
      </p>
    </div>
  );
}
