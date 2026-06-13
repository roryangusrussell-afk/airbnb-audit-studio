import { ArrowRight, Check, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type FixPlanTier = "single" | "portfolio";

const UNLOCK_ITEMS = [
  "Paste-ready rewrites: title (3 options), overview, description, guest access, and house rules",
  "Priority fix list: what to tackle first, rated by impact and difficulty",
  "Photo assessment: cover image, ordering, and the room types you are missing",
  "Review signals: the themes Airbnb surfaces first and how to echo them",
  "AI readability gaps: where Airbnb's search cannot confirm your key claims",
];

/**
 * The paywall conversion unit. Sits in the locked report hero next to the
 * score. Leads with the single Fix Plan (19 dollars, one-time), offers the
 * portfolio pass (49 dollars, one-time) as the multi-listing option, and keeps
 * an email-the-summary fallback as a quiet secondary path.
 *
 * Both tiers are one-time payments. No subscription. See PAYWALL_REDESIGN.md.
 */
export function FixPlanUnlock({
  onCheckout,
  onEmailSummary,
}: {
  onCheckout: (tier: FixPlanTier) => void;
  onEmailSummary?: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-[20px] border border-brand-border bg-card p-5 shadow-elevated sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Lock className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand">
          Unlock your full Fix Plan
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-[1.5] text-muted-foreground">
        Your diagnosis is done and the fixes are ready. Unlock the rewrites and
        the ranked action plan for this listing.
      </p>

      <ul className="mt-4 space-y-2.5">
        {UNLOCK_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-success-border text-success">
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden="true" />
            </span>
            <span className="text-[12.5px] leading-[1.45] text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      {/* Primary tier: single listing Fix Plan */}
      <button
        type="button"
        onClick={() => onCheckout("single")}
        className="group mt-5 flex w-full items-center justify-between gap-3 rounded-2xl bg-brand px-5 py-3.5 text-left text-brand-foreground shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <span className="min-w-0">
          <span className="block text-[15px] font-bold leading-tight">
            Get my Fix Plan
          </span>
          <span className="mt-0.5 block text-[12px] leading-snug text-brand-foreground/85">
            This listing, plus a free re-audit after your changes
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="text-[17px] font-extrabold tabular-nums">$19</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </button>

      {/* Secondary tier: portfolio pass */}
      <button
        type="button"
        onClick={() => onCheckout("portfolio")}
        className="group mt-2.5 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-3 text-left transition hover:border-brand-border hover:bg-brand-soft/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
      >
        <span className="min-w-0">
          <span className="block text-[13.5px] font-bold leading-tight text-foreground">
            Fix your whole portfolio
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
            All your listings, one payment. Pays for itself from your third.
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-foreground">
          <span className="text-[15px] font-extrabold tabular-nums">$49</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </button>

      <div className="mt-3 flex items-start gap-1.5 text-[11px] leading-[1.5] text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
        <span>
          One-time payment, no subscription. Instant access, plus a copy by
          email. Didn't find it useful? Full refund.
        </span>
      </div>

      {onEmailSummary && (
        <div className="mt-4 border-t border-border pt-3 text-center">
          <button
            type="button"
            onClick={onEmailSummary}
            className={cn(
              "text-[12px] font-medium text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2 transition hover:text-foreground",
            )}
          >
            Not ready? Email me the free summary
          </button>
        </div>
      )}
    </div>
  );
}
