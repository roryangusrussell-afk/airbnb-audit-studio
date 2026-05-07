import type { Cat } from "@/lib/types";
import { scoreBand, bandTextClass, bandBgClass } from "@/lib/scoring";
import { getCategoryMeta } from "@/lib/categoryMeta";

const SHORT_FB: Record<string, string> = {
  Title: "No strong differentiator",
  Photos: "Parking not shown",
  Description: "Flat structure",
  Overview: "Parking buried",
  Amenities: "Strong coverage",
  "Reviews & rating": "Strong social proof",
};

export function ScoreBreakdown({ cats }: { cats: Cat[] }) {
  const ordered = [...cats].sort((a, b) => a.score - b.score);

  return (
    <div className="w-full">
      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Score breakdown
      </h4>
      <ul className="w-full">
        {ordered.map((c, i) => (
          <ScoreRow key={c.name} cat={c} isLast={i === ordered.length - 1} />
        ))}
      </ul>
    </div>
  );
}

function ScoreRow({ cat, isLast }: { cat: Cat; isLast: boolean }) {
  const band = scoreBand(cat.score);
  const meta = getCategoryMeta(cat.name);
  const Icon = meta.icon;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);
  const sub = SHORT_FB[cat.name] ?? cat.fb;

  return (
    <li className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 py-2 ${isLast ? "" : "border-b border-border/30"}`}>
      <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg ${meta.iconBg}`}>
        <Icon className={`${meta.iconText}`} style={{ width: 16, height: 16 }} />
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold leading-snug text-foreground">{cat.name}</div>
        <div className="truncate text-xs leading-snug text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <div className={`text-sm font-bold tabular-nums ${textCls}`}>
        {cat.score}<span className="text-muted-foreground font-normal">/100</span>
      </div>
      <div className="col-span-3 mt-2 h-[6px] overflow-hidden rounded-full bg-muted/40">
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
