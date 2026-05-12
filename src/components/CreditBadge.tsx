import { Sparkles } from "lucide-react";

export function CreditBadge({ credits }: { credits: number }) {
  if (credits <= 0) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-soft px-3 py-1.5 shadow-card">
      <Sparkles className="h-3.5 w-3.5 text-brand" />
      <span className="text-xs font-semibold text-brand">
        {credits} {credits === 1 ? "credit" : "credits"}
      </span>
    </div>
  );
}
