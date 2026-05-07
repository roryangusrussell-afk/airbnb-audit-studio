import { Plus, Ban, CheckCircle2 } from "lucide-react";
import type { SummaryAction } from "@/lib/types";

type Variant = "start" | "stop" | "continue";

const CONFIG: Record<
  Variant,
  {
    label: string;
    bg: string;
    border: string;
    headingColor: string;
    iconBg: string;
    iconText: string;
    Icon: React.ComponentType<{ className?: string; "aria-hidden"?: string }>;
  }
> = {
  start: {
    label: "Start",
    bg: "bg-[#F4F8FF]",
    border: "border-[#D6E4FF]",
    headingColor: "text-blue-600",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    Icon: Plus,
  },
  stop: {
    label: "Stop",
    bg: "bg-[#FFF9EE]",
    border: "border-[#F7DDA8]",
    headingColor: "text-warning",
    iconBg: "bg-warning-soft",
    iconText: "text-warning",
    Icon: Ban,
  },
  continue: {
    label: "Continue",
    bg: "bg-[#F4FCF8]",
    border: "border-[#CFEFDC]",
    headingColor: "text-success",
    iconBg: "bg-success-soft",
    iconText: "text-success",
    Icon: CheckCircle2,
  },
};

interface Props {
  variant: Variant;
  items: SummaryAction[];
}

export function StartStopContinueCard({ variant, items }: Props) {
  const { label, bg, border, headingColor, iconBg, iconText, Icon } = CONFIG[variant];

  return (
    <div className={`rounded-2xl border p-5 ${bg} ${border}`}>
      <div className="mb-4 flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${iconBg} ${iconText}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <h4 className={`text-[12px] font-bold uppercase tracking-[0.14em] ${headingColor}`}>
          {label}
        </h4>
      </div>

      <ul className="space-y-4">
        {items.length === 0 && (
          <li className="text-[13px] text-[#6D6E78]">Nothing to report.</li>
        )}
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-white ${iconText}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold leading-snug text-[#1F1F24]">
                {item.title}
              </div>
              <div className="mt-1.5 text-[13px] leading-5 text-[#4E5059]">
                {item.detail}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
