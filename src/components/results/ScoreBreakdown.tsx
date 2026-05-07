import {
  Type,
  AlignLeft,
  FileText,
  ListChecks,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import type { Cat } from "@/lib/types";
import { scoreBand, bandTextClass, bandBgClass } from "@/lib/scoring";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Title: Type,
  Overview: AlignLeft,
  Description: FileText,
  Amenities: ListChecks,
  Photos: ImageIcon,
  "Reviews & rating": Star,
};

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
  const Icon = ICONS[cat.name] ?? Type;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);
  const sub = SHORT_FB[cat.name] ?? cat.fb;

  return (
    <li className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 py-2.5 ${isLast ? "" : "border-b border-border/40"}`}>
      <Icon className={`h-4 w-4 ${textCls}`} />
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold leading-tight text-foreground">{cat.name}</div>
        <div className="truncate text-[11px] leading-tight text-muted-foreground">{sub}</div>
      </div>
      <div className={`text-[12px] font-semibold tabular-nums ${textCls}`}>
        {cat.score}<span className="text-muted-foreground font-normal">/100</span>
      </div>
      <div className="col-span-3 mt-1.5 h-[3px] overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${fillCls}`}
          style={{ width: `${Math.max(2, Math.min(100, cat.score))}%` }}
        />
      </div>
    </li>
  );
}
