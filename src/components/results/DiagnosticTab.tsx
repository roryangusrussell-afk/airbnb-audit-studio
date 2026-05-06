import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CopyButton } from "@/components/CopyButton";
import { categoryRatingBand, bandTextClass } from "@/lib/scoring";
import type { AuditResponse, Fix } from "@/lib/types";

const CARDS: { id: string; label: string; area: string }[] = [
  { id: "title", label: "Title", area: "Title" },
  { id: "opening", label: "Opening description", area: "Overview" },
  { id: "full", label: "Full description", area: "Description" },
  { id: "amenities", label: "Amenities", area: "Amenities" },
  { id: "photos", label: "Photos", area: "Photos" },
  { id: "reviews", label: "Reviews and rating", area: "Reviews & rating" },
];

export function DiagnosticTab({ data }: { data: AuditResponse }) {
  const fixesByArea = useMemo(() => {
    const map: Record<string, Fix[]> = {};
    for (const f of data.fixes) {
      (map[f.area] ||= []).push(f);
    }
    return map;
  }, [data.fixes]);

  const catByName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of data.cats) m[c.name] = c.fb;
    return m;
  }, [data.cats]);

  const defaultOpen = useMemo(() => {
    for (const c of CARDS) {
      const fixes = fixesByArea[c.area] ?? [];
      if (fixes.some((f) => f.tier === "quick_win")) return c.id;
    }
    return CARDS[0].id;
  }, [fixesByArea]);

  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen} className="space-y-3">
      {CARDS.map((card) => {
        const fixes = fixesByArea[card.area] ?? [];
        const severity = fixes.some((f) => f.tier === "quick_win") ? "HIGH" : "MEDIUM";
        return (
          <AccordionItem
            key={card.id}
            value={card.id}
            className="overflow-hidden rounded-2xl border bg-card !border-b shadow-card"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <div className="flex w-full items-center justify-between gap-3 pr-2">
                <span className="text-base font-semibold tracking-tight">{card.label}</span>
                <span
                  className={
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider " +
                    (severity === "HIGH"
                      ? "border-danger-border bg-danger-soft text-danger"
                      : "border-warning-border bg-warning-soft text-warning")
                  }
                >
                  {severity}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5">
              <CurrentBlock area={card.area} data={data} />

              {fixes.length === 0 ? (
                <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                  {catByName[card.area] ?? "No issues found in this category."}
                </div>
              ) : (
                <div className="mt-4 space-y-5">
                  {fixes.map((f) => (
                    <FixBlock key={f.rank + f.title} fix={f} />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function CurrentBlock({ area, data }: { area: string; data: AuditResponse }) {
  const wrapper = "rounded-xl border bg-muted/40 p-4 text-sm";
  const eyebrow = (
    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
      Current
    </div>
  );

  if (area === "Title") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 font-medium text-foreground">{data.title}</p>
      </div>
    );
  }
  if (area === "Overview") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 leading-relaxed text-foreground">{data.overview}</p>
      </div>
    );
  }
  if (area === "Description") {
    const txt = data.description ?? "";
    const display = txt.length > 300 ? txt.slice(0, 300) + "..." : txt;
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 leading-relaxed text-foreground">{display}</p>
      </div>
    );
  }
  if (area === "Photos") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 text-foreground">
          <span className="font-semibold">{data.photoCount} photos</span>
          {" · "}
          <span>{data.photoAnalysis.verdict}</span>
        </p>
        {data.photoAnalysis.signals?.length > 0 && (
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {data.photoAnalysis.signals.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  if (area === "Amenities") {
    const first10 = data.amenities.slice(0, 10).join(", ");
    return (
      <div className={wrapper}>
        {eyebrow}
        <p className="mt-1.5 text-foreground">
          <span className="font-semibold">{data.amenities.length} amenities declared.</span>
        </p>
        <p className="mt-1 text-muted-foreground">{first10}{data.amenities.length > 10 ? "…" : ""}</p>
      </div>
    );
  }
  if (area === "Reviews & rating") {
    return (
      <div className={wrapper}>
        {eyebrow}
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.categoryRatings.map((r) => {
            const band = categoryRatingBand(r.localizedRating);
            return (
              <div
                key={r.label}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">{r.label}</span>
                <span className={`text-sm font-bold tabular-nums ${bandTextClass(band)}`}>
                  {r.localizedRating}
                </span>
              </div>
            );
          })}
        </div>
        <ReviewResponseRatio ratio={data.hostResponseRatio} />
      </div>
    );
  }
  return null;
}

function ReviewResponseRatio({ ratio }: { ratio: number | null | undefined }) {
  if (ratio == null) return null;
  const pct = Math.round(ratio * 100);

  if (ratio < 0.3) {
    return (
      <div className="mt-4 rounded-xl border border-danger-border bg-danger-soft p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-danger">
          Review response ratio
        </div>
        <h5 className="mt-1.5 text-sm font-semibold text-foreground">Low review response ratio</h5>
        <p className="mt-1.5 text-sm text-foreground">
          Only {pct}% of recent reviews have host replies.
        </p>
        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Why it matters</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Replying to guest reviews shows attentiveness and helps future guests see that the host is engaged.
        </p>
        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Recommended action</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Reply to every substantive guest review within 48 hours, especially reviews mentioning problems, praise, location, parking, cleanliness, or check-in.
        </p>
      </div>
    );
  }

  const positive = ratio >= 0.7;
  return (
    <p
      className={`mt-3 text-xs ${positive ? "text-success" : "text-muted-foreground"}`}
    >
      Review response ratio: {pct}% of recent reviews have host replies.
    </p>
  );
}

function FixBlock({ fix }: { fix: Fix }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold text-brand">{fix.rank}</span>
        <h4 className="text-sm font-semibold tracking-tight text-foreground">{fix.title}</h4>
        <span className="ml-auto rounded-full border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {fix.difficulty}
        </span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">What's weak</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fix.whyItMatters}</p>

      <div className="relative mt-3 rounded-xl border border-brand-border bg-brand-soft p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            Recommended
          </div>
          <CopyButton value={fix.fix} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{fix.fix}</p>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{fix.where}</p>
    </div>
  );
}
