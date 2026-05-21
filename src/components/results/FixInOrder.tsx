import type { Fix } from "@/lib/types";

interface Props {
  fixes: Fix[];
}

function effortLabel(fix: Fix, index: number): { label: string; tone: "impact" | "neutral" } {
  if (index === 0 && fix.tier === "quick_win") return { label: "High impact", tone: "impact" };
  const difficulty = fix.difficulty ?? "";
  if (difficulty) return { label: difficulty, tone: "neutral" };
  return { label: fix.tier === "quick_win" ? "Quick win" : "Refinement", tone: "neutral" };
}

export function FixInOrder({ fixes }: Props) {
  const top = fixes.slice(0, 4);
  if (top.length === 0) return null;

  return (
    <div className="rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-6">
      <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
        Fix in this order
      </h3>
      <p className="mt-1 text-[12.5px] text-muted-foreground">
        Four actions, ranked by how much they move the score.
      </p>

      <ol className="mt-4 divide-y divide-border">
        {top.map((fix, i) => {
          const effort = effortLabel(fix, i);
          return (
            <li
              key={fix.rank + fix.title}
              className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 break-inside-avoid py-3.5 sm:gap-4"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[12px] font-bold text-background">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold leading-snug text-foreground">
                  {fix.title}
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-muted-foreground">
                  {fix.whyItMatters}
                </p>
              </div>
              <span
                className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.02em] ${
                  effort.tone === "impact"
                    ? "border-brand-border bg-brand-soft text-brand"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {effort.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
