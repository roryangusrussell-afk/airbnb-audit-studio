import { Eyebrow } from "@/components/Eyebrow";
import { ArrowUpRight } from "lucide-react";

const fixes = [
  { rank: "01", impact: "HIGH", title: "Lead with parking in the title", area: "Title" },
  { rank: "02", impact: "HIGH", title: "Add captions to all 28 photos", area: "Photos" },
  { rank: "03", impact: "MED", title: "Break description into subsections", area: "Description" },
];

export function PreviewPanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-soft/40 blur-2xl" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-5">
        {/* Top fixes column */}
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:col-span-2">
          <Eyebrow>Top fixes</Eyebrow>
          <ul className="mt-4 space-y-4">
            {fixes.map((f) => (
              <li key={f.rank} className="flex items-start gap-3">
                <span className="font-bold text-brand">{f.rank}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide " +
                        (f.impact === "HIGH"
                          ? "border-danger-border bg-danger-soft text-danger"
                          : "border-warning-border bg-warning-soft text-warning")
                      }
                    >
                      {f.impact}
                    </span>
                    <span className="text-xs text-muted-foreground">{f.area}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-snug text-foreground">
                    {f.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested edit */}
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:col-span-3">
          <Eyebrow>Suggested edit</Eyebrow>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current title
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-through">
                Light-filled 1BR flat with balcony
              </p>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-soft p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                Recommended <ArrowUpRight className="h-3 w-3" />
              </div>
              <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                Light-filled 1BR in Cais do Sodré with private parking
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Why it works:</span>{" "}
              Lifts your strongest USP — private parking — into the searchable
              50-character window where guests filter and scan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
