import { Star } from "lucide-react";
import type { AuditResponse } from "@/lib/types";

function firstNSentences(text: string, n: number): string {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "." || text[i] === "!" || text[i] === "?") {
      count++;
      if (count === n) return text.slice(0, i + 1).trim();
    }
  }
  return text.trim();
}

export function AnalystCommentary({ data }: { data: AuditResponse }) {
  const intro = data.summary ?? data.listingSignals ?? data.verdict;
  const paragraphs = intro
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => firstNSentences(p, 2));

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-[#EDE8E6] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
        Analyst commentary
      </div>
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1F1F24]">
        What we found
      </h2>
      <div className="mt-3 space-y-3 text-[13.5px] leading-6 text-[#3F4048]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-start gap-3 rounded-2xl border border-[#F9D99B] bg-[#FFF7E8] p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#F59E0B]">
            <Star className="h-4 w-4 fill-current" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#B4730A]">Bottom line takeaway</div>
            <div className="mt-1 text-[13px] leading-[1.5] text-[#1F1F24]">
              {firstNSentences(data.verdict, 1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
