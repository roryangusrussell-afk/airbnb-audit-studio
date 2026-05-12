import type { AuditResponse } from "@/lib/types";

function firstNSentences(text: string, n: number): string {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    if (ch === "." && /\d/.test(text[i - 1] ?? "") && /\d/.test(text[i + 1] ?? "")) continue;
    count++;
    if (count === n) return text.slice(0, i + 1).trim();
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
    <div className="rounded-[20px] border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Analysis
      </div>
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
        What we found
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-foreground/80">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
