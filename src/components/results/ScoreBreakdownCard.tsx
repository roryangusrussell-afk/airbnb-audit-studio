import { Wand2 } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { scoreBand, bandTextClass, bandBgClass, diagnosticLabel, bandSoftClasses } from "@/lib/scoring";
import type { Cat } from "@/lib/types";

interface Props {
  cats: Cat[];
  score: number;
  priorityFix?: string;
  instant?: boolean;
}

export function ScoreBreakdownCard({ cats, score, priorityFix, instant }: Props) {
  const ordered = [...cats].sort((a, b) => a.score - b.score);
  const band = scoreBand(score);

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Score breakdown
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[140px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <ScoreRing score={score} size={112} instant={instant} />
          <div className="mt-3">
            <span
              className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${bandSoftClasses(band)}`}
            >
              {diagnosticLabel(score)}
            </span>
          </div>
        </div>

        <ul className="space-y-3.5">
          {ordered.map((cat) => (
            <ScoreCategoryRow key={cat.name} cat={cat} />
          ))}
        </ul>
      </div>

      {priorityFix && (
        <div className="mt-auto pt-6">
          <div className="flex w-full items-start gap-3 rounded-2xl border border-brand-border bg-brand-soft p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-card text-brand shadow-card">
              <Wand2 className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
                Priority fix
              </div>
              <div className="mt-1 text-[13px] leading-[1.5] text-foreground">{priorityFix}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCategoryRow({ cat }: { cat: Cat }) {
  const band = scoreBand(cat.score);
  const meta = getCategoryMeta(cat.name);
  const Icon = meta.icon;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);

  return (
    <li className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] ${meta.iconBg}`}
          >
            <Icon
              className={`h-4 w-4 ${meta.iconText}`}
              aria-hidden="true"
            />
          </span>
          <div>
            <div className="text-sm font-semibold text-foreground">{cat.name}</div>
            <div className="text-xs text-muted-foreground">{cat.fb}</div>
          </div>
        </div>
        <div className={`shrink-0 text-sm font-bold tabular-nums ${textCls}`}>
          {cat.score}
          <span className="font-normal text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${fillCls}`}
          style={{
            width: `${Math.max(2, Math.min(100, cat.score))}%`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </li>
  );
}
