import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, Tag, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STRATEGY_CALL_URL = "https://calendly.com/roryangusrussell/30min";
const STRIPE_SINGLE_AUDIT_URL = "https://buy.stripe.com/14AeVfamFg2KbVQgGVaMU00";
const STRIPE_FIVE_PACK_URL = "https://buy.stripe.com/bJe3cx1Q94k22lgbmBaMU01";

export function PaywallScreen({
  url,
  email,
  onReset,
}: {
  url: string;
  email: string;
  onReset: () => void;
}) {
  return (
    <div className="container max-w-[760px] px-4 py-10 sm:px-6 sm:py-14">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to start
      </button>

      <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="flex flex-col items-center gap-4 border-b bg-muted/30 px-6 py-8 text-center sm:gap-5 sm:px-10 sm:py-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
            <Lock className="h-5 w-5 text-brand" />
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              No audits left
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              You've used your free audit
            </h1>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-muted-foreground">
              {email
                ? `${email} doesn't have any audit credits. Buy more below or book a strategy call to talk through what we found on your first audit.`
                : "Buy more below or book a strategy call."}
            </p>
            {url && (
              <p className="mt-3 break-all text-[11.5px] text-muted-foreground/80">
                Saved listing: {url}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 px-6 py-7 sm:px-10 sm:py-8">
          <a
            href={STRIPE_FIVE_PACK_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-center gap-4 rounded-[14px] border border-brand-border bg-brand-soft px-5 py-4 transition-colors hover:bg-brand-soft/70"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand text-brand-foreground">
              <Tag className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-bold text-foreground">
                Buy 5 audits — €39
              </span>
              <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                Best value. Saves nearly half per audit vs the single.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-brand transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href={STRIPE_SINGLE_AUDIT_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-center gap-4 rounded-[14px] border bg-card px-5 py-4 transition-colors hover:border-brand-border hover:bg-brand-soft/30"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-muted">
              <Tag className="h-4 w-4 text-foreground" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-semibold text-foreground">
                Buy 1 audit — €15
              </span>
              <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                One-off if you only need to check one more listing.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href={STRATEGY_CALL_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-center gap-4 rounded-[14px] border bg-card px-5 py-4 transition-colors hover:border-brand-border hover:bg-brand-soft/30"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-muted">
              <CalendarCheck className="h-4 w-4 text-foreground" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-semibold text-foreground">
                Book a 30-min strategy call
              </span>
              <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                Free. Walk through your first audit with Rory.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="border-t bg-muted/20 px-6 py-4 text-center sm:px-10">
          <p className="text-[12px] leading-5 text-muted-foreground">
            Paid but credits aren't showing?{" "}
            <a
              href="mailto:roryangusrussell@gmail.com?subject=Auditable%20credits%20issue"
              className="font-medium text-foreground underline underline-offset-2"
            >
              Email Rory
            </a>{" "}
            and he'll sort it within the hour.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[12.5px] text-muted-foreground">
        <Button variant="outline" size="sm" onClick={onReset}>
          Try a different listing
        </Button>
        <Link to="/" className="hover:text-foreground">
          Or go back home
        </Link>
      </div>
    </div>
  );
}
