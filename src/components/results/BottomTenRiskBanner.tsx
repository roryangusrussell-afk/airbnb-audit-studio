import { AlertTriangle } from "lucide-react";

export function BottomTenRiskBanner() {
  return (
    <div className="rounded-2xl border border-danger-border bg-danger-soft p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-danger" />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-danger">
            Bottom 10% risk
          </div>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            This listing's rating is below 4.3. Airbnb attaches a visible warning label
            to bottom-decile listings and suppresses their impressions. Recovering your
            rating is the highest-priority action before anything else in this report.
          </p>
        </div>
      </div>
    </div>
  );
}
