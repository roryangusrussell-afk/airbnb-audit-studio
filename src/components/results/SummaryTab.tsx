import type { AuditResponse } from "@/lib/types";
import { SummaryHero } from "./SummaryHero";
import { WhyScoreCard } from "./WhyScoreCard";
import { PerformancePattern } from "./PerformancePattern";
import { FixInOrder } from "./FixInOrder";

interface Props {
  data: AuditResponse;
  instant?: boolean;
  onGoToDiagnostics?: () => void;
}

export function SummaryTab({ data, instant, onGoToDiagnostics }: Props) {
  const supporting = data.summary ?? data.listingSignals ?? "";
  const priorityFix = data.issues[0]?.action ?? data.fixes[0]?.fix;

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <SummaryHero
          score={data.score}
          verdict={data.verdict}
          supporting={supporting}
          priorityFix={priorityFix}
          instant={instant}
        />
        <WhyScoreCard cats={data.cats} score={data.score} />
      </section>

      <FixInOrder fixes={data.fixes} />

      <PerformancePattern data={data} />

      <div className="flex flex-col gap-2 pt-2 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Scoring is based on our proprietary audit model and Airbnb best practices as of{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
        {onGoToDiagnostics && (
          <button
            type="button"
            onClick={onGoToDiagnostics}
            className="text-foreground/70 underline decoration-muted-foreground/40 underline-offset-4 transition hover:text-foreground sm:text-right"
          >
            View detailed diagnostics →
          </button>
        )}
      </div>
    </div>
  );
}
