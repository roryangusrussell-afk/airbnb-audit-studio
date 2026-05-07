import type { AuditResponse, SummaryAction } from "@/lib/types";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";
import { SummaryProseCard } from "./SummaryProseCard";
import { StartStopContinueCard } from "./StartStopContinueCard";

// ---------- fallbacks for older audits without start/stop/continue ----------

function fallbackStart(data: AuditResponse): SummaryAction[] {
  return data.fixes
    .filter((f) => f.tier === "quick_win")
    .slice(0, 3)
    .map((f) => ({ title: f.title, detail: f.fix }));
}

function fallbackStop(data: AuditResponse): SummaryAction[] {
  return data.issues
    .filter((i) => i.type !== "opportunity")
    .slice(0, 3)
    .map((i) => ({ title: i.title, detail: i.problem }));
}

function fallbackContinue(data: AuditResponse): SummaryAction[] {
  return data.wins.slice(0, 3).map((w) => ({ title: w, detail: "" }));
}

// ---------- main component ----------

export function SummaryTab({ data }: { data: AuditResponse }) {
  const start = data.start ?? fallbackStart(data);
  const stop = data.stop ?? fallbackStop(data);
  const cont = data.continue ?? fallbackContinue(data);

  return (
    <div className="space-y-6">
      {/* Hero: score + summary prose */}
      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <ScoreBreakdownCard
          cats={data.cats}
          score={data.score}
          priorityFix={data.issues[0]?.action}
        />
        <SummaryProseCard data={data} />
      </section>

      {/* Start / Stop / Continue */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StartStopContinueCard variant="start" items={start} />
        <StartStopContinueCard variant="stop" items={stop} />
        <StartStopContinueCard variant="continue" items={cont} />
      </section>

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
