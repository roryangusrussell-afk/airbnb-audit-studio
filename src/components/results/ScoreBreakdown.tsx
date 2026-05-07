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

export function ScoreBreakdown({ cats }: { cats: Cat[] }) {
  const ordered = [...cats].sort((a, b) => a.score - b.score);

  return (
    <div className="rounded-2xl border bg-card shadow-card">
      <div className="border-b px-5 py-3">
        <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Score breakdown
        </h4>
      </div>
      <ul className="divide-y">
        {ordered.map((c) => (
          <ScoreRow key={c.name} cat={c} />
        ))}
      </ul>
    </div>
  );
}

function ScoreRow({ cat }: { cat: Cat }) {
  const band = scoreBand(cat.score);
  const Icon = ICONS[cat.name] ?? Type;
  const textCls = bandTextClass(band);
  const fillCls = bandBgClass(band);

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${fillCls}/10`}>
        <Icon className={`h-4 w-4 ${textCls}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="truncate text-sm font-semibold text-foreground">{cat.name}</div>
          <div className="text-sm font-medium tabular-nums text-foreground">
            {cat.score}
            <span className="text-muted-foreground">/100</span>
          </div>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{cat.fb}</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${fillCls}`}
            style={{ width: `${Math.max(2, Math.min(100, cat.score))}%` }}
          />
        </div>
      </div>
    </li>
  );
}
