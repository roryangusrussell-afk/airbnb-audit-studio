import { useEffect } from "react";
import { ArrowRight, Copy, Gift, CalendarCheck, Home, Tag } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { AuditResponse } from "@/lib/types";
import { isPortugalListing, trackEvent } from "@/lib/nextStep";

const STRATEGY_CALL_URL = "https://calendly.com/roryangusrussell/30min";
const SCC_MANAGEMENT_URL = "https://santacatarinacollection.com/en";
const STRIPE_SINGLE_AUDIT_URL = "https://buy.stripe.com/14AeVfamFg2KbVQgGVaMU00";
const STRIPE_FIVE_PACK_URL = "https://buy.stripe.com/bJe3cx1Q94k22lgbmBaMU01";

export function NextStepTab({ email, data }: { email: string; data: AuditResponse }) {
  const isPT = isPortugalListing(data);

  useEffect(() => {
    trackEvent("next_step_page_viewed", {
      is_portugal_listing: isPT,
      listing_location: data.location ?? null,
    });
  }, [isPT, data.location]);

  return (
    <div className="overflow-hidden rounded-[20px] border bg-card shadow-card">
      <header className="px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]">
          What's next
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You've used your free audit. Here's how to keep going.
        </p>
      </header>

      <div className="px-6 pb-6 sm:px-8">
        {isPT ? <ManagementPrimary /> : <StrategyCallPrimary />}
      </div>

      <div className="border-t" />

      <section className="px-6 py-6 sm:px-8">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">
          Other ways forward
        </h3>
        <div className="mt-3 space-y-2.5">
          <ReferralRow email={email} />
          <BuyAuditsRow />
        </div>
      </section>
    </div>
  );
}

function StrategyCallPrimary() {
  return (
    <PrimaryCard
      eyebrow="Talk it through"
      icon={CalendarCheck}
      title="Book a 30-min strategy call"
      body="Walk through the audit with Rory. We'll prioritise the fixes that will move bookings most, and decide whether you should DIY or get help."
      ctaLabel="Book a call"
      href={STRATEGY_CALL_URL}
      onClick={() => trackEvent("clicked_strategy_call")}
    />
  );
}

function ManagementPrimary() {
  return (
    <PrimaryCard
      eyebrow="Portugal property management"
      icon={Home}
      title="Want us to manage this property?"
      body="We run boutique short-term rentals across Lisbon. Pricing, guest comms, turnovers, maintenance, owner reporting — handled end to end. The audit gives us a head start understanding the listing."
      ctaLabel="Check management fit"
      href={SCC_MANAGEMENT_URL}
      onClick={() => trackEvent("clicked_management_fit")}
    />
  );
}

function PrimaryCard({
  eyebrow,
  icon: Icon,
  title,
  body,
  ctaLabel,
  href,
  onClick,
}: {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-[100px_minmax(0,1fr)]">
        <div className="hidden items-center justify-center bg-brand-soft p-6 sm:flex">
          <Icon className="h-10 w-10 text-brand" />
        </div>
        <div className="flex flex-col gap-3 px-6 py-6 sm:px-7 sm:py-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3 className="text-[22px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[24px]">
            {title}
          </h3>
          <p className="text-[14.5px] leading-relaxed text-foreground/80">{body}</p>
          <div className="mt-2 flex justify-end">
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              onClick={onClick}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
            >
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferralRow({ email }: { email: string }) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = refCode ? `${origin}/?ref=${refCode}` : origin;
  const { copied, copy } = useCopyToClipboard(2000);

  return (
    <div className="flex w-full items-center gap-3.5 rounded-[12px] border bg-card px-4 py-3.5">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
        <Gift className="h-4 w-4 text-brand" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold text-foreground">
          Refer a host, earn another audit
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
          Share your link. When they run their first audit, you unlock a new credit.
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          trackEvent("clicked_referral_copy");
          copy(link);
        }}
        disabled={!refCode}
        className="inline-flex h-9 flex-none items-center gap-1.5 rounded-[10px] border bg-card px-3 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-muted/40 disabled:opacity-50"
      >
        <Copy className="h-3.5 w-3.5" />
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

function BuyAuditsRow() {
  return (
    <div className="rounded-[12px] border bg-card px-4 py-3.5">
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
          <Tag className="h-4 w-4 text-brand" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-foreground">
            Need another audit now? Buy one
          </div>
          <div className="mt-0.5 text-[12.5px] text-muted-foreground">
            Skip the wait. 5-pack saves nearly half per audit.
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <a
          href={STRIPE_SINGLE_AUDIT_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("clicked_buy_one_audit")}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] border bg-card px-4 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-muted/40"
        >
          Buy 1 — €15
        </a>
        <a
          href={STRIPE_FIVE_PACK_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("clicked_buy_five_audits")}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-brand px-4 text-[12.5px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
        >
          Buy 5 — €39
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
