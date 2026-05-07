import type { AuditResponse } from "@/lib/types";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";
import { AnalystCommentary } from "./AnalystCommentary";
import { PerformancePattern } from "./PerformancePattern";
import { PositioningSection } from "./PositioningSection";

export function SummaryTab({ data }: { data: AuditResponse }) {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <ScoreBreakdownCard
          cats={data.cats}
          score={data.score}
          priorityFix={data.issues[0]?.action}
        />
        <AnalystCommentary data={data} />
      </section>

      <PerformancePattern data={data} />

      <PositioningSection data={data} />

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
