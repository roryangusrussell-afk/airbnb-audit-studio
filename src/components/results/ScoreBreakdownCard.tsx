import { Wand2 } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { getCategoryMeta } from "@/lib/categoryMeta";
import { scoreBand, bandTextClass, bandBgClass, diagnosticLabel, bandSoftClasses } from "@/lib/scoring";
import type { Cat } from "@/lib/types";

interface Props {
  cats: Cat[];
  score: number;
  priorityFix?: string;
}

export function ScoreBreakdownCard({ cats, score, priorityFix }: Props) {
  const ordered = [...cats].sort((a, b) => a.score - b.score);
  const band = scoreBand(score);

  return (
    <div className="rounded-[20px] border border-[#EDE8E6] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6D6E78]">
        Score breakdown
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[124px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <ScoreRing score={score} size={112} />
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${bandSoftClasses(band)}`}
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
        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-[#FFD1DE] bg-[#FFF5F8] p-3.5 sm:flex-row sm:items-start sm:gap-3">
          <div className="flex min-w-fit items-center gap-2 text-brand">
            <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em]">Priority fix</span>
          </div>
          <div className="text-[13px] leading-5 text-[#1F1F24]">{priorityFix}</div>
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
            <div className="text-sm font-semibold text-[#1F1F24]">{cat.name}</div>
            <div className="text-xs text-[#6D6E78]">{cat.fb}</div>
          </div>
        </div>
        <div className={`shrink-0 text-sm font-bold tabular-nums ${textCls}`}>
          {cat.score}
          <span className="font-normal text-[#6D6E78]">/100</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-[#F1EFED]">
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
