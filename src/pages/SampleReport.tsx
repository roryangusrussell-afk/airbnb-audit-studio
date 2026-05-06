import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { sampleAudit } from "@/lib/sampleData";

const SampleReport = () => {
  return (
    <main className="min-h-screen bg-background">
      <ResultsScreen
        data={sampleAudit}
        email="sample@host.com"
        onAuditAnother={() => (window.location.href = "/")}
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
