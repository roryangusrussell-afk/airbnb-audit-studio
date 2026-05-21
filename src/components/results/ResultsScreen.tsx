import { useState } from "react";
import { ArrowLeft, FileText, Search, Wrench, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "./ListingCard";
import { BottomTenRiskBanner } from "./BottomTenRiskBanner";
import { SummaryTab } from "./SummaryTab";
import { DiagnosticsTab } from "./DiagnosticsTab";
import { DiagnosticTab } from "./DiagnosticTab";
import { NextStepTab } from "./NextStepTab";
import { GatePanel, GateSubmitPayload } from "./GatePanel";
import type { AuditResponse } from "@/lib/types";

type TabKey = "summary" | "diagnostics" | "breakdown" | "next";

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
  const [activeTab, setActiveTab] = useState<TabKey>("summary");
  const isGated = !email && !!onSubmitEmail;

  if (isGated) {
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
        </div>
      </div>

      <div className="space-y-3">
        <ListingCard data={data} />
        {data.bottomTenRisk && <BottomTenRiskBanner />}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className="mt-4"
      >
        <TabsList className="h-auto w-full justify-center gap-1 rounded-[16px] border bg-card p-1 shadow-card sm:w-auto" data-print-hide>
          <TabsTrigger
            value="summary"
            className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
          >
            <FileText className="h-3.5 w-3.5" />
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="diagnostics"
            className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Diagnostics
          </TabsTrigger>
          <TabsTrigger
            value="breakdown"
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
          <SummaryTab data={data} onGoToDiagnostics={() => setActiveTab("diagnostics")} />
        </TabsContent>
        <TabsContent value="diagnostics" className="mt-3">
          <DiagnosticsTab data={data} />
        </TabsContent>
        <TabsContent value="breakdown" className="mt-3">
          <DiagnosticTab data={data} />
        </TabsContent>
        <TabsContent value="next" className="mt-3">
          <NextStepTab email={email} data={data} />
        </TabsContent>
      </Tabs>

    </div>
  );
}
