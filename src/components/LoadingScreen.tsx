import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Fetching listing data",
  "Analysing photos with AI vision",
  "Scoring 6 content categories",
  "Generating your audit report",
];

export function LoadingScreen({ url }: { url: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 1800);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-card">
        <div className="eyebrow">Auditing</div>
        <p className="mt-2 break-all text-sm text-muted-foreground">{url}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Reading your listing the way Airbnb does.
        </h2>

        <ul className="mt-8 space-y-4">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={
                    "flex h-7 w-7 items-center justify-center rounded-full border " +
                    (done
                      ? "border-success bg-success text-success-foreground"
                      : active
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-border bg-muted text-muted-foreground")
                  }
                >
                  {done ? (
                    <Check className="h-4 w-4" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </span>
                <span
                  className={
                    "text-sm " +
                    (done || active ? "font-medium text-foreground" : "text-muted-foreground")
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-xs text-muted-foreground">
          This usually takes 30–60 seconds. We're scoring your listing across title,
          description, photos, amenities and reviews.
        </p>
      </div>
    </div>
  );
}
