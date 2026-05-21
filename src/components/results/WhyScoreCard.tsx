import { getCategoryMeta } from "@/lib/categoryMeta";
import { scoreBand, bandTextClass, bandBgClass } from "@/lib/scoring";
import type { Cat } from "@/lib/types";

interface Props {
  cats: Cat[];
  score: number;
}

export function WhyScoreCard({ cats, score }: Props) {
  const ordered = [...cats].sort((a, b) => a.score - b.score);
  const split = Math.min(3, Math.floor(ordered.length / 2));
  const primary = ordered.slice(0, split);
  const supporting = ordered.slice(split);

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-6">
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
        Why the score is {score}
      </h3>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Lowest-scoring areas first. These explain the main drag on the score.
      </p>

      {primary.length > 0 && (
        <div className="mt-5 break-inside-avoid">
          <GroupHeading label="Primary drag" />
          <ul className="mt-1 divide-y divide-border">
            {primary.map((cat) => (
              <ScoreBarRow key={cat.name} cat={cat} />
            ))}
          </ul>
        </div>
      )}

      {supporting.length > 0 && (
        <div className="mt-5 break-inside-avoid">
          <GroupHeading label="Supporting signals" />
          <ul className="mt-1 divide-y divide-border">
            {supporting.map((cat) => (
              <ScoreBarRow key={cat.name} cat={cat} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GroupHeading({ label }: { label: string }) {
  return (
    <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
      {label}
    </div>
  );
}

function ScoreBarRow({ cat }: { cat: Cat }) {
  const band = scoreBand(cat.score);
  const meta = getCategoryMeta(cat.name);
  const Icon = meta.icon;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);

  return (
    <li className="grid grid-cols-[132px_minmax(0,1fr)_52px] items-center gap-3 break-inside-avoid py-3 sm:gap-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] ${meta.iconBg}`}
        >
          <Icon className={`h-3.5 w-3.5 ${meta.iconText}`} aria-hidden="true" />
        </span>
        <div className="min-w-0 text-[13px] font-semibold leading-tight text-foreground">
          {cat.name}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[12.5px] leading-[1.4] text-muted-foreground">{cat.fb}</div>
        <div className="mt-2 h-1.5 rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${fillCls}`}
            style={{
              width: `${Math.max(2, Math.min(100, cat.score))}%`,
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      <div className={`shrink-0 text-right text-[14px] font-bold tabular-nums ${textCls}`}>
        {cat.score}
        <span className="ml-0.5 text-[11px] font-normal text-muted-foreground">/100</span>
      </div>
    </li>
  );
}
