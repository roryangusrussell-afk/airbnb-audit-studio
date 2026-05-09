import { Hero } from "@/components/landing/Hero";
import { EmailGateModal } from "@/components/EmailGateModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { useAuditFlow } from "@/hooks/useAuditFlow";

const Index = () => {
  const flow = useAuditFlow();

  return (
    <main className="min-h-screen bg-background">
      {flow.status === "landing" && <Hero onSubmit={flow.submitUrl} />}
      {flow.status === "loading" && <LoadingScreen url={flow.url} peek={flow.peekData} />}
      {flow.status === "error" && (
        <ErrorScreen message={flow.error} detail={flow.errorDetail} onRetry={flow.retry} onReset={flow.reset} />
      )}
      {flow.status === "results" && flow.data && (
        <ResultsScreen
          data={flow.data}
          email={flow.email}
          onAuditAnother={flow.reset}
          onRequestEmailGate={() => flow.setNeedsEmail(true)}
        />
      )}

      <EmailGateModal
        open={flow.needsEmail}
        onOpenChange={flow.setNeedsEmail}
        onSubmit={flow.submitEmail}
      />
    </main>
  );
};

export default Index;
