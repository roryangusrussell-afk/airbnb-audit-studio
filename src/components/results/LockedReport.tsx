import { ArrowLeft, Loader2, Lock, Stethoscope, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "./ListingCard";
import { BottomTenRiskBanner } from "./BottomTenRiskBanner";
import { ScoreRing } from "./ScoreRing";
import { WhyScoreCard } from "./WhyScoreCard";
import { FixPlanUnlock, type FixPlanTier } from "./FixPlanUnlock";
import { scoreBand, bandSoftClasses, diagnosticLabel } from "@/lib/scoring";
import type { AuditResponse } from "@/lib/types";

function firstSentence(text: string): string {
  if (!text) return "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    if (ch === "." && /\d/.test(text[i - 1] ?? "") && /\d/.test(text[i + 1] ?? "")) continue;
    return text.slice(0, i + 1).trim();
  }
  return text.trim();
}

const FIX_PLAN_ANCHOR = "fix-plan-unlock";

function scrollToUnlock() {
  if (typeof document === "undefined") return;
  document.getElementById(FIX_PLAN_ANCHOR)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * The post-audit report in its LOCKED state. Score, band, headline, and every
 * category finding show for free; the fixes are gated behind the Fix Plan.
 * A blend of the old email-gate layout and the Summary tab. See
 * PAYWALL_REDESIGN.md for the journey.
 */
export function LockedReport({
  data,
  onCheckout,
  onUseCredit,
  creditsRemaining = 0,
  unlocking = false,
  onEmailSummary,
  onAuditAnother,
  topSlot,
}: {
  data: AuditResponse;
  onCheckout: (tier: FixPlanTier) => void;
  onUseCredit?: () => void;
  creditsRemaining?: number;
  unlocking?: boolean;
  onEmailSummary?: () => void;
  onAuditAnother: () => void;
  topSlot?: React.ReactNode;
}) {
  const band = scoreBand(data.score);
  const supporting = data.summary ?? data.listingSignals ?? "";
  const sentence = firstSentence(supporting);

  return (
    <div className="container max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {topSlot}

      {unlocking && (
        <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-brand-border bg-brand-soft/50 px-4 py-3 text-[13px] font-medium text-brand" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Payment confirmed. Preparing your fixes...
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-print-hide>
        <div className="eyebrow">Your audit report</div>
        <Button variant="outline" size="sm" onClick={onAuditAnother} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Audit another listing</span>
          <span className="sm:hidden">Another listing</span>
        </Button>
      </div>

      <div className="space-y-3">
        <ListingCard data={data} />
        {data.bottomTenRisk && <BottomTenRiskBanner />}
      </div>

      {/* Hero: score + headline on the left, the unlock on the right */}
      <section
        id={FIX_PLAN_ANCHOR}
        className="mt-4 grid grid-cols-1 items-stretch gap-4 scroll-mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]"
      >
        <div className="flex h-full flex-col gap-5 rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
            <ScoreRing score={data.score} size={132} />
            <div className="text-center sm:text-left">
              <span
                className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] ${bandSoftClasses(band)}`}
              >
                {diagnosticLabel(data.score)}
              </span>
              <h2 className="mt-2.5 text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground sm:text-[22px]">
                {data.verdict}
              </h2>
            </div>
          </div>
          {sentence && (
            <p className="text-[13.5px] leading-[1.55] text-muted-foreground">{sentence}</p>
          )}
          {/* Desktop only: fills the gap left by the taller unlock column. On
              mobile the layout stacks, so this would just duplicate the photo
              in the listing card above. */}
          {data.thumbnail ? (
            <div className="hidden min-h-[180px] flex-1 overflow-hidden rounded-2xl border border-border bg-muted lg:block">
              <img
                src={data.thumbnail}
                alt={data.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="hidden flex-1 lg:block" aria-hidden="true" />
          )}
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              <Lock className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
              The diagnosis is free
            </div>
            <p className="mt-1.5 text-[12.5px] leading-[1.5] text-muted-foreground">
              You can see the score and where every category stands below. The
              exact rewrites and the ranked fix list unlock with the Fix Plan.
            </p>
          </div>
        </div>

        <FixPlanUnlock
          onCheckout={onCheckout}
          onUseCredit={onUseCredit}
          creditsRemaining={creditsRemaining}
          onEmailSummary={onEmailSummary}
        />
      </section>

      {/* Why the score is N, with per-category unlock locks */}
      <div className="mt-4">
        <WhyScoreCard cats={data.cats} score={data.score} locked />
      </div>

      {/* Locked tab teasers */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2" data-print-hide>
        <LockedTab
          icon={<Stethoscope className="h-4 w-4" aria-hidden="true" />}
          title="Diagnostics"
          detail="The full breakdown behind every category score."
          onClick={scrollToUnlock}
        />
        <LockedTab
          icon={<Wrench className="h-4 w-4" aria-hidden="true" />}
          title="Get fixes"
          detail="Paste-ready rewrites and your ranked action plan."
          onClick={scrollToUnlock}
        />
      </div>
    </div>
  );
}

function LockedTab({
  icon,
  title,
  detail,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[16px] border border-border bg-card px-4 py-3.5 text-left shadow-card transition hover:border-brand-border hover:bg-brand-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-muted text-muted-foreground group-hover:bg-brand-soft group-hover:text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[14px] font-bold text-foreground">{title}</span>
          <Lock className="h-3 w-3 text-muted-foreground" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{detail}</span>
      </span>
      <span className="shrink-0 text-[12px] font-semibold text-brand">Unlock</span>
    </button>
  );
}
