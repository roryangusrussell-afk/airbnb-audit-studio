import { ArrowLeft, FileText, Activity, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "./ListingCard";
import { BottomTenRiskBanner } from "./BottomTenRiskBanner";
import { FeedbackButton } from "./FeedbackModal";
import { SummaryTab } from "./SummaryTab";
import { DiagnosticTab } from "./DiagnosticTab";
import { NextStepTab } from "./NextStepTab";
import type { AuditResponse } from "@/lib/types";

export function ResultsScreen({
  data,
  email,
  onAuditAnother,
  topSlot,
}: {
  data: AuditResponse;
  email: string;
  onAuditAnother: () => void;
  topSlot?: React.ReactNode;
}) {
  return (
    <div className="container max-w-[1180px] px-6 py-6 sm:py-8 lg:px-8">
      {topSlot}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="eyebrow">Your audit report</div>
        <div className="flex items-center gap-2">
          <FeedbackButton listingId={data.listingId} />
          <Button variant="outline" size="sm" onClick={onAuditAnother} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Audit another listing
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <ListingCard data={data} />
        {data.bottomTenRisk && <BottomTenRiskBanner />}
      </div>

      <Tabs defaultValue="summary" className="mt-4">
        <TabsList className="h-auto w-full justify-center gap-1 rounded-[16px] border bg-card p-1 shadow-card sm:w-auto">
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
            <Activity className="h-3.5 w-3.5" />
            Diagnostic
          </TabsTrigger>
          <TabsTrigger
            value="next"
            className="gap-1.5 rounded-lg border border-transparent px-3.5 py-1.5 text-sm text-muted-foreground transition-colors data-[state=active]:border-brand-border data-[state=active]:bg-brand-soft data-[state=active]:text-brand data-[state=active]:shadow-none"
          >
            <Rocket className="h-3.5 w-3.5" />
            Next step
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
    </div>
  );
}
