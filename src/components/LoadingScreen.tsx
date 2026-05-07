import { useEffect, useState } from "react";
import { Check, Loader2, Star } from "lucide-react";
import type { PeekData } from "@/lib/api";

const STEPS = [
  "Fetching listing data",
  "Analysing photos with AI vision",
  "Scoring 6 content categories",
  "Generating your audit report",
];

export function LoadingScreen({ url, peek }: { url: string; peek: PeekData | null }) {
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

        {peek?.imageUrl ? (
          <div className="mt-3 flex items-center gap-4">
            <img
              src={peek.imageUrl}
              alt={peek.title ?? "Listing"}
              className="h-16 w-24 rounded-lg object-cover flex-none"
            />
            <div className="min-w-0">
              {peek.title && (
                <p className="truncate text-sm font-semibold text-foreground">{peek.title}</p>
              )}
              {(peek.rating || peek.reviewCount) && (
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {peek.rating && (
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{peek.rating}</span>
                    </span>
                  )}
                  {peek.rating && peek.reviewCount && <span>·</span>}
                  {peek.reviewCount && <span>{peek.reviewCount} reviews</span>}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 break-all text-sm text-muted-foreground">{url}</p>
        )}

        <h2 className="mt-4 text-2xl font-bold tracking-tight">
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
