import type { AuditResponse } from "@/lib/types";
import { AnalystCommentary } from "./AnalystCommentary";
import { ArchetypeSection } from "./ArchetypeSection";
import { PositioningSection } from "./PositioningSection";
import { VisibilityContext } from "./VisibilityContext";

export function DiagnosticsTab({ data }: { data: AuditResponse }) {
  return (
    <div className="space-y-6">
      <AnalystCommentary data={data} />
      {data.archetype && <ArchetypeSection data={data} />}
      {data.positioningDiagnosis && <PositioningSection data={data} />}
      <VisibilityContext />
    </div>
  );
}
