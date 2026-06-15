import { useEffect, useState } from "react";
import { ArrowRight, Copy, Gift, CalendarCheck, Home, Search, Check } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { submitFeedback } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";
import { isPortugalListing, trackEvent } from "@/lib/nextStep";

const STRATEGY_CALL_URL = "https://calendly.com/roryangusrussell/30min";
const SCC_MANAGEMENT_URL = "https://santacatarinacollection.com/en";

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
          Your next best step
        </h2>
        <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
          Use this audit to improve the listing, compare another property, or explore
          whether a hands-on operator is the right next move.
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
          <ReferralCard email={email} />
          <AuditAnotherCard />
        </div>
      </section>

      <div className="border-t" />

      <InlineFeedback listingId={data.listingId} email={email} />
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
      supporting="Best for hosts who want a second pair of eyes before making changes."
      ctaLabel="Book a strategy call"
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
      title="Want a Lisbon operator to review the upside?"
      body="Your audit gives us a head start. We can review the listing, pricing, guest experience and operations to see where the biggest upside is."
      supporting="Best for Lisbon hosts or owners ready to hand off to a specialist operator."
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
  supporting,
  ctaLabel,
  href,
  onClick,
}: {
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  supporting?: string;
  ctaLabel: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[14px] border bg-card px-6 py-7 sm:px-8 sm:py-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-[8px] bg-brand-soft">
          <Icon className="h-3.5 w-3.5 text-brand" />
        </span>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>

      <h3 className="mt-4 text-[22px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[24px]">
        {title}
      </h3>
      <p className="mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-foreground/80">
        {body}
      </p>
      {supporting && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
          {supporting}
        </p>
      )}

      <div className="mt-6 flex justify-start">
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          onClick={onClick}
          className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 sm:w-auto"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function ReferralCard({ email }: { email: string }) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = refCode ? `${origin}/?ref=${refCode}` : origin;
  const { copied, copy } = useCopyToClipboard(2000);

  return (
    <div className="rounded-[14px] border bg-card px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[8px] bg-brand-soft">
            <Gift className="h-4 w-4 text-brand" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-foreground">
              Refer a host, unlock another audit
            </div>
            <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
              Share your link. When they complete their first audit, you get one more credit.
            </div>
          </div>
        </div>
        <div className="flex sm:flex-none sm:justify-end">
          <button
            type="button"
            onClick={() => {
              trackEvent("clicked_referral_copy");
              copy(link);
            }}
            disabled={!refCode}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] border bg-card px-4 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-muted/40 disabled:opacity-50 sm:w-auto"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied" : "Copy referral link"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditAnotherCard() {
  return (
    <div className="rounded-[14px] border bg-card px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[8px] bg-brand-soft">
            <Search className="h-4 w-4 text-brand" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-foreground">
              Audit another listing
            </div>
            <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
              The diagnosis is always free. Run it on another property, then unlock its Fix Plan if you want the rewrites.
            </div>
          </div>
        </div>
        <div className="flex sm:flex-none sm:justify-end">
          <a
            href="/"
            onClick={() => trackEvent("clicked_audit_another")}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand px-4 text-[12.5px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 sm:w-auto"
          >
            Audit another listing
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

type InlineRating = "yes" | "somewhat" | "not_really";

function InlineFeedback({ listingId, email }: { listingId: string; email?: string }) {
  const [selected, setSelected] = useState<InlineRating | null>(null);

  const handleSelect = (rating: InlineRating) => {
    if (selected) return;
    setSelected(rating);
    const ratingMap: Record<InlineRating, string> = {
      yes: "useful",
      somewhat: "missing_context",
      not_really: "inaccurate",
    };
    submitFeedback({
      listingId,
      rating: ratingMap[rating],
      email,
      url: `https://www.airbnb.com/rooms/${listingId}`,
    });
  };

  const options: { value: InlineRating; label: string }[] = [
    { value: "yes", label: "Yes" },
    { value: "somewhat", label: "Somewhat" },
    { value: "not_really", label: "Not really" },
  ];

  return (
    <section className="px-6 py-5 sm:px-8 sm:py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[13.5px] font-semibold text-foreground">
            {selected ? "Thanks for the feedback." : "Was this audit useful?"}
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">
            {selected
              ? "It helps improve Auditable."
              : "Help improve Auditable with quick feedback."}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-none">
          {selected ? (
            <span className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-brand-border bg-brand-soft px-3 text-[12.5px] font-semibold text-brand">
              <Check className="h-3.5 w-3.5" />
              Sent
            </span>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className="inline-flex h-9 items-center justify-center rounded-[10px] border bg-card px-3.5 text-[12.5px] font-semibold text-foreground transition-colors hover:border-brand-border hover:bg-brand-soft/60 hover:text-brand"
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
