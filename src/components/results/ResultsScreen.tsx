import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Search, Wrench, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "./ListingCard";
import { BottomTenRiskBanner } from "./BottomTenRiskBanner";
import { SummaryTab } from "./SummaryTab";
import { DiagnosticTab } from "./DiagnosticTab";
import { NextStepTab } from "./NextStepTab";
import { GatePanel, GateSubmitPayload } from "./GatePanel";
import type { AuditResponse } from "@/lib/types";

export function ResultsScreen({
  data,
  email,
  onAuditAnother,
  onSubmitEmail,
  topSlot,
}: {
  data: AuditResponse;
  email: string;
  onAuditAnother: () => void;
  onSubmitEmail?: (payload: GateSubmitPayload) => void;
  topSlot?: React.ReactNode;
}) {
  const [printMode, setPrintMode] = useState(false);
  const isGated = !email && !!onSubmitEmail;

  // When entering print mode, give React a tick to render the expanded view
  // before opening the print dialog. afterprint flips back to the tabbed view.
  useEffect(() => {
    if (!printMode) return;
    const t = setTimeout(() => window.print(), 120);
    return () => clearTimeout(t);
  }, [printMode]);

  useEffect(() => {
    const after = () => setPrintMode(false);
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);

  if (isGated && !printMode) {
    return (
      <div className="min-h-full">
        {topSlot}
        <GatePanel
          data={data}
          onSubmit={onSubmitEmail!}
          onAuditAnother={onAuditAnother}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {topSlot}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-print-hide>
        <div className="eyebrow">Your audit report</div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onAuditAnother} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Audit another listing</span>
            <span className="sm:hidden">Another listing</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPrintMode(true)}
            className="hidden gap-1.5 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <ListingCard data={data} />
        {data.bottomTenRisk && <BottomTenRiskBanner />}
      </div>

      {printMode ? (
        <div className="mt-6 space-y-8">
          <PrintSection title="Summary">
            <SummaryTab data={data} instant />
          </PrintSection>
          <PrintSection title="Breakdown">
            <DiagnosticTab data={data} printMode />
          </PrintSection>
          <PrintSection title="Get fixes">
            <NextStepTab email={email} data={data} />
          </PrintSection>
        </div>
      ) : (
        <Tabs defaultValue="summary" className="mt-4">
          <TabsList className="h-auto w-full justify-center gap-1 rounded-[16px] border bg-card p-1 shadow-card sm:w-auto" data-print-hide>
            <TabsTrigger
              value="summary"
              className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
            >
              <FileText className="h-3.5 w-3.5" />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="diagnostic"
              className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
            >
              <Search className="h-3.5 w-3.5" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger
              value="next"
              className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
            >
              <Wrench className="h-3.5 w-3.5" />
              Get fixes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="mt-3">
            <SummaryTab data={data} />
          </TabsContent>
          <TabsContent value="diagnostic" className="mt-3">
            <DiagnosticTab data={data} />
          </TabsContent>
          <TabsContent value="next" className="mt-3">
            <NextStepTab email={email} data={data} />
          </TabsContent>
        </Tabs>
      )}

    </div>
  );
}

function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="print-section">
      <h2 className="mb-3 text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}
