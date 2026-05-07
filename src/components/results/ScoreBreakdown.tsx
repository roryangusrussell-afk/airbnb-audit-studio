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
    <ul className="w-full">
      {ordered.map((c, i) => (
        <ScoreRow key={c.name} cat={c} isLast={i === ordered.length - 1} />
      ))}
    </ul>
  );
}

function ScoreRow({ cat, isLast }: { cat: Cat; isLast: boolean }) {
  const band = scoreBand(cat.score);
  const Icon = ICONS[cat.name] ?? Type;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);
  const sub = SHORT_FB[cat.name] ?? cat.fb;

  return (
    <li className={`flex items-center gap-3 py-2 ${isLast ? "" : "border-b border-border/50"}`}>
      <Icon className={`h-3.5 w-3.5 flex-none ${textCls}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="truncate text-[13px] font-semibold text-foreground">{cat.name}</div>
          <div className="text-[12px] font-medium tabular-nums text-muted-foreground">
            {cat.score}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${fillCls}/80`}
              style={{ width: `${Math.max(2, Math.min(100, cat.score))}%` }}
            />
          </div>
        </div>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">{sub}</p>
      </div>
    </li>
  );
}
