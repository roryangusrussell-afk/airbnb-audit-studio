import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { sampleAudit } from "@/lib/sampleData";

const SampleReport = () => {
  // /sample shows the locked report (what a prospect sees for free).
  // /sample?unlock=1 shows the full unlocked report for review.
  const unlocked =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("unlock") === "1";

  return (
    <main className="min-h-screen bg-background">
      <ResultsScreen
        data={sampleAudit}
        email={unlocked ? "sample@host.com" : ""}
        locked={!unlocked}
        onAuditAnother={() => (window.location.href = "/")}
        onSubmitEmail={() => {
          window.alert("On the live site this emails the free summary. (Sample preview only.)");
        }}
        onCheckout={(tier) => {
          window.alert(`Stripe checkout for the "${tier}" plan wires up in Phase 2.`);
        }}
        topSlot={
          <div className="mb-5 rounded-xl border border-brand-border bg-brand-soft px-4 py-3 text-sm">
            <span className="font-semibold text-brand">This is a sample report. </span>
            <Link to="/" className="text-foreground underline underline-offset-2">
              Audit your own listing free
            </Link>
            <Link to="/" className="float-right inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
        }
      />
    </main>
  );
};

export default SampleReport;
