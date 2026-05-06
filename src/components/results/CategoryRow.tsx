import {
  Type,
  AlignLeft,
  FileText,
  ListChecks,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import type { Cat } from "@/lib/types";
import { bandTextClass, bandBgClass, scoreBand } from "@/lib/scoring";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Title: Type,
  Overview: AlignLeft,
  Description: FileText,
  Amenities: ListChecks,
  Photos: ImageIcon,
  "Reviews & rating": Star,
};

export function CategoryRow({ cat }: { cat: Cat }) {
  const band = scoreBand(cat.score);
  const Icon = ICONS[cat.name] ?? Type;
  return (
    <div className="flex items-start gap-3 border-l-2 pl-4 py-2"
      style={{ borderColor: `hsl(var(--${band === "strong" ? "success" : band === "average" ? "warning" : "danger"}))` }}
    >
      <div className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full ${bandBgClass(band)}/10`}>
        <Icon className={`h-4 w-4 ${bandTextClass(band)}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-sm font-semibold text-foreground">{cat.name}</div>
          <div className={`text-base font-bold tabular-nums ${bandTextClass(band)}`}>
            {cat.score}
          </div>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{cat.fb}</p>
      </div>
    </div>
  );
}
