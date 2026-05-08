import { CheckCircle2, AlertCircle, XCircle, UserCheck } from "lucide-react";
import type { AuditResponse } from "@/lib/types";

const ARCHETYPE_EMOJI: Record<string, string> = {
  "Remote worker": "💻",
  "City break couple": "🥂",
  "Family": "👨‍👩‍👧",
  "Group of friends": "🎉",
  "Solo explorer": "🧭",
  "Business traveller": "💼",
  "Long-stay / digital nomad": "🌍",
};

function alignmentColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 45) return "text-warning";
  return "text-[#D94B4B]";
}

function alignmentBarColor(score: number) {
  if (score >= 70) return "bg-success";
  if (score >= 45) return "bg-warning";
  return "bg-[#D94B4B]";
}

function AlignmentBar({ score }: { score: number }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#EDE8E6] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#3F4048]">Archetype fit</span>
        <span className={`text-[22px] font-bold tabular-nums ${alignmentColor(score)}`}>
          {score}<span className="text-[14px] font-normal text-[#8A8B95]">/100</span>
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#EDE8E6]">
        <div
          className={`h-full rounded-full transition-all ${alignmentBarColor(score)}`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] text-[#8A8B95]">
        How well this listing signals what its target guest actually needs to see before booking.
      </p>
    </div>
  );
}

function AlignmentColumn({
  label,
  icon,
  items,
  cardBg,
  cardBorder,
  headerText,
  itemDot,
}: {
  label: string;
  icon: React.ReactNode;
  items: string[];
  cardBg: string;
  cardBorder: string;
  headerText: string;
  itemDot: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`rounded-2xl border p-5 ${cardBg} ${cardBorder}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-[8px] bg-white ${headerText}`}>
          {icon}
        </div>
        <h4 className={`text-[12px] font-bold uppercase tracking-[0.14em] ${headerText}`}>{label}</h4>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${itemDot}`} />
            <p className="text-[13px] leading-5 text-[#3F4048]">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArchetypeSection({ data }: { data: AuditResponse }) {
  const { archetype, archetypeAlignment } = data;
  if (!archetype) return null;

  const emoji = ARCHETYPE_EMOJI[archetype.primary] ?? "🏠";

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#1F1F24]">
            Guest archetype
          </h3>
          <p className="mt-1 text-[13.5px] text-[#6D6E78]">
            Does this listing actually deliver what its target guest needs before they book?
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8185C]/20 bg-[#FFF0F5] px-3.5 py-1.5 text-[13px] font-semibold text-[#E8185C]">
            <span aria-hidden>{emoji}</span>
            {archetype.primary}
          </span>
          {archetype.secondary && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE8E6] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#6D6E78]">
              <UserCheck className="h-3.5 w-3.5" aria-hidden />
              +{archetype.secondary}
            </span>
          )}
          {archetype.confidence === "low" && (
            <span className="rounded-full border border-[#F7DDA8] bg-[#FFF9EE] px-2.5 py-1 text-[11px] font-medium text-[#B07800]">
              Low confidence
            </span>
          )}
        </div>
      </div>

      {archetypeAlignment && (
        <>
          <div className="mt-4">
            <AlignmentBar score={archetypeAlignment.score} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AlignmentColumn
              label="What's working"
              icon={<CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
              items={archetypeAlignment.strengths}
              cardBg="bg-[#F4FCF8]"
              cardBorder="border-[#CFEFDC]"
              headerText="text-success"
              itemDot="bg-success"
            />
            <AlignmentColumn
              label="What's missing"
              icon={<AlertCircle className="h-3.5 w-3.5" aria-hidden />}
              items={archetypeAlignment.gaps}
              cardBg="bg-[#FFF9EE]"
              cardBorder="border-[#F7DDA8]"
              headerText="text-warning"
              itemDot="bg-warning"
            />
            <AlignmentColumn
              label="Mismatches"
              icon={<XCircle className="h-3.5 w-3.5" aria-hidden />}
              items={archetypeAlignment.mismatches}
              cardBg="bg-[#FFF4F4]"
              cardBorder="border-[#FCCFCF]"
              headerText="text-[#D94B4B]"
              itemDot="bg-[#D94B4B]"
            />
          </div>
        </>
      )}
    </section>
  );
}
