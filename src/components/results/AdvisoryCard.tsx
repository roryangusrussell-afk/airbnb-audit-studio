import { TrendingUp, Clock, PoundSterling, Calendar, type LucideIcon } from "lucide-react";
import type { AdvisoryNote } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "Booking conversion": TrendingUp,
  "Response time": Clock,
  "Price competitiveness": PoundSterling,
  "Calendar consistency": Calendar,
};

export function AdvisoryCard({ note }: { note: AdvisoryNote }) {
  const Icon = ICONS[note.area] ?? TrendingUp;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand" />
        <h4 className="text-sm font-semibold text-foreground">{note.area}</h4>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note.note}</p>
    </div>
  );
}
