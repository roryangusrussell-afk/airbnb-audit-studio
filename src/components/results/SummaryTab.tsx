import type { AuditResponse } from "@/lib/types";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";
import { AnalystCommentary } from "./AnalystCommentary";
import { PerformancePattern } from "./PerformancePattern";
import { PositioningSection } from "./PositioningSection";
import { ArchetypeSection } from "./ArchetypeSection";
import { VisibilityContext } from "./VisibilityContext";

export function SummaryTab({ data }: { data: AuditResponse }) {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <ScoreBreakdownCard
          cats={data.cats}
          score={data.score}
          priorityFix={data.issues[0]?.action}
        />
        <AnalystCommentary data={data} />
      </section>

      <PerformancePattern data={data} />

      <ArchetypeSection data={data} />

      <PositioningSection data={data} />

      <VisibilityContext />

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
