import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AuditResponse } from "@/lib/types";
import { ScoreBreakdownCard } from "./ScoreBreakdownCard";
import { AnalystCommentary } from "./AnalystCommentary";
import { PerformancePattern } from "./PerformancePattern";
import { PositioningSection } from "./PositioningSection";
import { ArchetypeSection } from "./ArchetypeSection";
import { VisibilityContext } from "./VisibilityContext";

export function SummaryTab({ data, instant }: { data: AuditResponse; instant?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Hero: score + category breakdown + priority fix */}
      <ScoreBreakdownCard
        cats={data.cats}
        score={data.score}
        priorityFix={data.issues[0]?.action}
        instant={instant}
      />

      {/* Analysis prose */}
      <AnalystCommentary data={data} />

      {/* Performance pattern */}
      <PerformancePattern data={data} />

      {/* Secondary analysis: collapsed by default, animated reveal */}
      <div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-card transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
          aria-expanded={expanded}
        >
          <span>Further context: listing type, positioning and visibility</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="mt-4 space-y-6">
              <ArchetypeSection data={data} />
              <PositioningSection data={data} />
              <VisibilityContext />
            </div>
          </div>
        </div>
      </div>

      <p className="pt-2 text-center text-xs text-muted-foreground">
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
