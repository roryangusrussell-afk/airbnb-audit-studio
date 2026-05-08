import { EyeOff } from "lucide-react";

const FACTORS = [
  {
    label: "Calendar availability",
    detail: "Blocked dates remove you from relevant searches entirely. Open, flexible calendars rank higher.",
  },
  {
    label: "Instant Book and minimum nights",
    detail: "Instant Book receives a direct ranking boost. High minimum nights cut filter eligibility for short trips.",
  },
  {
    label: "Pricing vs. your market",
    detail: "Airbnb ranks lower-priced comparable listings higher. Tools like PriceLabs or Beyond give you the market context we can't.",
  },
  {
    label: "Response rate and declines",
    detail: "Frequent declines and slow message responses hurt search placement directly. Your Airbnb dashboard is the only source for these.",
  },
  {
    label: "Search personalisation",
    detail: "Results are personalised per guest based on past trips and search behaviour. No tool can audit or predict this.",
  },
];

export function VisibilityContext() {
  return (
    <section>
      <div className="rounded-2xl border border-[#EDE8E6] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F5F5F7]">
            <EyeOff className="h-4 w-4 text-[#6D6E78]" aria-hidden />
          </div>
          <h4 className="text-[14px] font-semibold text-[#1F1F24]">
            What this audit can't see
          </h4>
        </div>
        <p className="mt-2 text-[13px] text-[#6D6E78]">
          Your score covers everything visible in your listing. These factors also affect discoverability but sit outside what any audit tool can reach.
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((f) => (
            <li key={f.label} className="rounded-xl border border-[#EDE8E6] bg-[#FAFAF7] p-3.5">
              <div className="text-[13px] font-semibold text-[#3F4048]">{f.label}</div>
              <div className="mt-1 text-[12px] leading-5 text-[#6D6E78]">{f.detail}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
