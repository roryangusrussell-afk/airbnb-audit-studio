import { Award, AlertTriangle, TrendingUp, type LucideIcon } from "lucide-react";
import { getCategoryMeta } from "@/lib/categoryMeta";
import type { AuditResponse, PatternItem, Fix } from "@/lib/types";

type Variant = "strengths" | "gaps" | "leverage";

interface ColumnConfig {
  label: string;
  Icon: LucideIcon;
  cardBg: string;
  cardBorder: string;
  headerText: string;
  headerIconBg: string;
  itemIconFallbackBg: string;
  itemIconFallbackText: string;
}

const CONFIG: Record<Variant, ColumnConfig> = {
  strengths: {
    label: "What's working",
    Icon: Award,
    cardBg: "bg-[#F4FCF8]",
    cardBorder: "border-[#CFEFDC]",
    headerText: "text-success",
    headerIconBg: "bg-white",
    itemIconFallbackBg: "bg-success-soft",
    itemIconFallbackText: "text-success",
  },
  gaps: {
    label: "What's holding it back",
    Icon: AlertTriangle,
    cardBg: "bg-[#FFF4F4]",
    cardBorder: "border-danger-border",
    headerText: "text-danger",
    headerIconBg: "bg-white",
    itemIconFallbackBg: "bg-danger-soft",
    itemIconFallbackText: "text-danger",
  },
  leverage: {
    label: "Hidden upside",
    Icon: TrendingUp,
    cardBg: "bg-[#F4F8FF]",
    cardBorder: "border-[#D6E4FF]",
    headerText: "text-blue-600",
    headerIconBg: "bg-white",
    itemIconFallbackBg: "bg-blue-50",
    itemIconFallbackText: "text-blue-600",
  },
};

function PatternColumn({ variant, items }: { variant: Variant; items: PatternItem[] }) {
  const cfg = CONFIG[variant];
  const HeaderIcon = cfg.Icon;
  return (
    <div className={`rounded-2xl border p-5 ${cfg.cardBg} ${cfg.cardBorder}`}>
      <div className="mb-4 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${cfg.headerIconBg} ${cfg.headerText}`}>
          <HeaderIcon className="h-3.5 w-3.5" aria-hidden />
        </div>
        <h4 className={`text-[12px] font-bold uppercase tracking-[0.14em] ${cfg.headerText}`}>
          {cfg.label}
        </h4>
      </div>

      <ul className="space-y-4">
        {items.length === 0 && (
          <li className="text-[13px] text-[#6D6E78]">Nothing to report.</li>
        )}
        {items.slice(0, 3).map((item, i) => {
          const meta = item.category ? getCategoryMeta(item.category) : null;
          const ItemIcon = meta?.icon ?? cfg.Icon;
          const iconBg = meta?.iconBg ?? cfg.itemIconFallbackBg;
          const iconText = meta?.iconText ?? cfg.itemIconFallbackText;
          return (
            <li key={i} className="flex gap-3">
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${iconBg}`}>
                <ItemIcon className={`h-4 w-4 ${iconText}`} aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold leading-snug text-[#1F1F24]">
                  {item.title}
                </div>
                <div className="mt-1 text-[13px] leading-5 text-[#4E5059]">{item.detail}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Fallback derivation when performancePattern is missing on the audit.
function deriveFallback(data: AuditResponse): {
  strengths: PatternItem[];
  gaps: PatternItem[];
  leverage: PatternItem[];
} {
  const strengths: PatternItem[] = data.wins.slice(0, 3).map((w) => ({
    title: w,
    detail: "",
  }));

  const gaps: PatternItem[] = data.issues
    .filter((i) => i.type !== "opportunity")
    .slice(0, 3)
    .map((i) => ({ title: i.title, detail: i.problem }));

  const leverage: PatternItem[] = data.fixes
    .filter((f: Fix) => f.tier === "refinement")
    .slice(0, 3)
    .map((f) => ({ title: f.title, detail: f.whyItMatters, category: f.area }));

  return { strengths, gaps, leverage };
}

export function PerformancePattern({
  data,
  withHeader = false,
}: {
  data: AuditResponse;
  withHeader?: boolean;
}) {
  const pattern = data.performancePattern ?? deriveFallback(data);

  return (
    <section>
      {withHeader && (
        <>
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#1F1F24]">
            Performance pattern
          </h3>
          <p className="mt-1 text-[13.5px] text-[#6D6E78]">
            A synthesis of the main signals helping and holding back this listing.
          </p>
        </>
      )}

      <div className={`grid grid-cols-1 gap-4 lg:grid-cols-3 ${withHeader ? "mt-4" : ""}`}>
        <PatternColumn variant="strengths" items={pattern.strengths} />
        <PatternColumn variant="gaps" items={pattern.gaps} />
        <PatternColumn variant="leverage" items={pattern.leverage} />
      </div>
    </section>
  );
}
