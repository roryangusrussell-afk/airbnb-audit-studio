import { Users, Target, MessageCircle, Compass, type LucideIcon } from "lucide-react";
import type { AuditResponse, PositioningDiagnosis } from "@/lib/types";

interface CardDef {
  Icon: LucideIcon;
  iconBg: string;
  iconText: string;
  label: string;
  body: string;
}

function buildCards(p: PositioningDiagnosis): CardDef[] {
  return [
    {
      Icon: Users,
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
      label: "Target guest",
      body: p.targetGuest,
    },
    {
      Icon: Target,
      iconBg: "bg-brand-soft",
      iconText: "text-brand",
      label: "What it promises",
      body: p.promise,
    },
    {
      Icon: MessageCircle,
      iconBg: "bg-success-soft",
      iconText: "text-success",
      label: "Review alignment",
      body: p.reviewAlignment,
    },
    {
      Icon: Compass,
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      label: "Positioning implication",
      body: p.adjustment,
    },
  ];
}

export function PositioningSection({ data }: { data: AuditResponse }) {
  if (!data.positioningDiagnosis) return null;
  const cards = buildCards(data.positioningDiagnosis);

  return (
    <section>
      <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#1F1F24]">
        Positioning
      </h3>
      <p className="mt-1 text-[13.5px] text-[#6D6E78]">
        How this listing reads to the guests it's likely to attract.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-[#EDE8E6] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center gap-2.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${c.iconBg}`}>
                <c.Icon className={`h-4 w-4 ${c.iconText}`} aria-hidden />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6D6E78]">
                {c.label}
              </div>
            </div>
            <p className="mt-3 text-[13.5px] leading-6 text-[#3F4048]">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
