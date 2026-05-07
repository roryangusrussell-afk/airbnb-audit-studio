import { CheckCircle2, AlertCircle, Zap } from "lucide-react";

export interface SignalItem {
  title: string;
  detail?: string;
  impact?: "High" | "Medium" | "Low";
  effort?: "Low" | "Medium" | "High";
}

type Variant = "strengths" | "gaps" | "opportunities";

const CONFIG: Record<
  Variant,
  {
    label: string;
    bg: string;
    border: string;
    headingColor: string;
    bulletColor: string;
    BulletIcon: React.ComponentType<{ className?: string; "aria-hidden"?: string }>;
  }
> = {
  strengths: {
    label: "Strengths",
    bg: "bg-[#F4FCF8]",
    border: "border-[#CFEFDC]",
    headingColor: "text-success",
    bulletColor: "text-success",
    BulletIcon: CheckCircle2,
  },
  gaps: {
    label: "Gaps & Risks",
    bg: "bg-[#FFF7F9]",
    border: "border-[#FFD6E0]",
    headingColor: "text-brand",
    bulletColor: "text-brand",
    BulletIcon: AlertCircle,
  },
  opportunities: {
    label: "Opportunities",
    bg: "bg-[#FFF9EE]",
    border: "border-[#F7DDA8]",
    headingColor: "text-warning",
    bulletColor: "text-warning",
    BulletIcon: Zap,
  },
};

const IMPACT_CLASSES: Record<string, string> = {
  High: "bg-success-soft text-success",
  Medium: "bg-warning-soft text-warning",
  Low: "bg-muted text-muted-foreground",
};

const EFFORT_CLASSES: Record<string, string> = {
  Low: "bg-[#EFF6FF] text-blue-500",
  Medium: "bg-muted text-muted-foreground",
  High: "bg-danger-soft text-danger",
};

interface Props {
  variant: Variant;
  items: SignalItem[];
}

export function InsightCard({ variant, items }: Props) {
  const { label, bg, border, headingColor, bulletColor, BulletIcon } = CONFIG[variant];
  const capped = items.slice(0, 4);
  const showPills = variant === "opportunities";

  return (
    <div
      className={`rounded-[22px] border p-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] ${bg} ${border}`}
    >
      <h4 className={`text-xs font-bold uppercase tracking-[0.14em] ${headingColor}`}>{label}</h4>
      <ul className="mt-4 space-y-4">
        {capped.length === 0 && (
          <li className="text-sm text-[#6D6E78]">Nothing to report.</li>
        )}
        {capped.map((item, i) => (
          <li key={i} className="flex gap-3">
            <BulletIcon
              className={`mt-0.5 h-4 w-4 shrink-0 ${bulletColor}`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#1F1F24]">{item.title}</div>
              {item.detail && (
                <div className="mt-0.5 text-sm leading-5 text-[#4E5059]">{item.detail}</div>
              )}
              {showPills && (item.impact || item.effort) && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.impact && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${IMPACT_CLASSES[item.impact] ?? IMPACT_CLASSES.Medium}`}
                    >
                      {item.impact} impact
                    </span>
                  )}
                  {item.effort && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${EFFORT_CLASSES[item.effort] ?? EFFORT_CLASSES.Medium}`}
                    >
                      {item.effort} effort
                    </span>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
