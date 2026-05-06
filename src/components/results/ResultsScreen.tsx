import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "./ListingCard";
import { BottomTenRiskBanner } from "./BottomTenRiskBanner";
import { EmailReportBar } from "./EmailReportBar";
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
    <div className="container max-w-5xl py-8 sm:py-10">
      {topSlot}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="eyebrow">Your audit report</div>
        <Button variant="outline" size="sm" onClick={onAuditAnother} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Audit another listing
        </Button>
      </div>

      <div className="space-y-4">
        <ListingCard data={data} />
        {data.bottomTenRisk && <BottomTenRiskBanner />}
        <EmailReportBar email={email} data={data} />
      </div>

      <Tabs defaultValue="summary" className="mt-8">
        <TabsList className="h-auto rounded-xl bg-muted/60 p-1">
          <TabsTrigger value="summary" className="rounded-lg px-4 py-2 text-sm">
            Summary
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="rounded-lg px-4 py-2 text-sm">
            Diagnostic
          </TabsTrigger>
          <TabsTrigger value="next" className="rounded-lg px-4 py-2 text-sm">
            Next step
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6">
          <SummaryTab data={data} />
        </TabsContent>
        <TabsContent value="diagnostic" className="mt-6">
          <DiagnosticTab data={data} />
        </TabsContent>
        <TabsContent value="next" className="mt-6">
          <NextStepTab email={email} data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
