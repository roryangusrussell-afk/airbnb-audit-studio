import type { AuditResponse } from "@/lib/types";

interface Props {
  data: AuditResponse;
}

function buildFallbackSummary(data: AuditResponse): string {
  if (data.summary) return data.summary;
  if (data.listingSignals) return data.listingSignals;
  const top = data.issues[0];
  if (!top) return data.verdict;
  return `${data.verdict} ${top.title}: ${top.problem}.`;
}

export function SummaryProseCard({ data }: Props) {
  const body = buildFallbackSummary(data);
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="rounded-[20px] border border-[#EDE8E6] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
        Summary
      </div>
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1F1F24]">
        {data.verdict}
      </h2>
      <div className="mt-4 space-y-4 text-[14px] leading-7 text-[#3F4048]">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
