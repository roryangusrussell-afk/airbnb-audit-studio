import { Wand2 } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { scoreBand, bandSoftClasses, diagnosticLabel } from "@/lib/scoring";

interface Props {
  score: number;
  verdict: string;
  supporting?: string;
  priorityFix?: string;
  instant?: boolean;
}

function firstSentences(text: string, n: number): string {
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

export function SummaryHero({ score, verdict, supporting, priorityFix, instant }: Props) {
  const band = scoreBand(score);
  const sentence = supporting ? firstSentences(supporting, 1) : "";

  return (
    <div className="flex h-full flex-col gap-6 rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-col items-center gap-3">
        <ScoreRing score={score} size={152} instant={instant} />
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] ${bandSoftClasses(band)}`}
        >
          {diagnosticLabel(score)}
        </span>
      </div>

      <div>
        <h2 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
          {verdict}
        </h2>
        {sentence && (
          <p className="mt-2 text-[13.5px] leading-[1.55] text-muted-foreground">{sentence}</p>
        )}
      </div>

      {priorityFix && (
        <div className="mt-auto flex w-full items-start gap-3 rounded-2xl border border-brand-border bg-brand-soft p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-card text-brand shadow-card">
            <Wand2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
              Priority fix
            </div>
            <div className="mt-1 text-[13.5px] font-semibold leading-[1.45] text-foreground">
              {priorityFix}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
