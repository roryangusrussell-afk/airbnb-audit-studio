import { Hero } from "@/components/landing/Hero";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { ResultsScreen } from "@/components/results/ResultsScreen";
import { PaywallScreen } from "@/components/PaywallScreen";
import { Footer } from "@/components/Footer";
import { CreditBadge } from "@/components/CreditBadge";
import { useAuditFlow } from "@/hooks/useAuditFlow";
import { useCreditBalance } from "@/hooks/useCreditBalance";

const Index = () => {
  const flow = useAuditFlow();
  const { credits } = useCreditBalance(flow.email);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {credits != null && <CreditBadge credits={credits} />}
      <div className="flex-1">
        {flow.status === "landing" && <Hero onSubmit={flow.submitUrl} />}
        {flow.status === "loading" && <LoadingScreen url={flow.url} peek={flow.peekData} />}
        {flow.status === "error" && (
          <ErrorScreen message={flow.error} detail={flow.errorDetail} onRetry={flow.retry} onReset={flow.reset} />
        )}
        {flow.status === "paywall" && (
          <PaywallScreen url={flow.url} email={flow.email} onReset={flow.reset} />
        )}
        {flow.status === "results" && flow.data && (
          <ResultsScreen
            data={flow.data}
            email={flow.email}
            onAuditAnother={flow.reset}
            onSubmitEmail={flow.submitEmail}
          />
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Index;
