import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CalendarCheck,
  Home,
  Lock,
  Mail,
  RefreshCw,
  Star,
  Tag,
} from "lucide-react";

const STRATEGY_CALL_URL = "https://calendly.com/roryangusrussell/30min";
const STRIPE_SINGLE_AUDIT_URL = "https://buy.stripe.com/14AeVfamFg2KbVQgGVaMU00";
const STRIPE_FIVE_PACK_URL = "https://buy.stripe.com/bJe3cx1Q94k22lgbmBaMU01";

export function PaywallScreen({
  url: _url,
  email: _email,
  onReset,
}: {
  url: string;
  email: string;
  onReset: () => void;
}) {
  return (
    <div className="container max-w-[760px] px-4 py-8 sm:px-6 sm:py-12">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to start
      </button>

      <section className="mt-5 overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="flex flex-col items-center gap-3 px-6 pt-7 pb-6 text-center sm:gap-4 sm:px-10 sm:pt-8 sm:pb-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft">
            <Lock className="h-4 w-4 text-brand" />
          </span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              No audits left
            </div>
            <h1 className="mt-2 text-[26px] font-bold tracking-tight text-foreground sm:text-[30px]">
              You've used your free audit
            </h1>
            <p className="mx-auto mt-2.5 max-w-[46ch] text-[14px] leading-6 text-muted-foreground">
              Your first audit is saved. To check another listing, buy more
              credits below, or book a free strategy call to talk through your
              results.
            </p>
          </div>
          <div className="mt-1 inline-flex items-center gap-3 rounded-[12px] bg-muted/40 px-4 py-2.5 text-left">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-card">
              <Bookmark className="h-3.5 w-3.5 text-brand" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-foreground">
                Your previous audit is saved
              </span>
              <span className="block text-[11.5px] text-muted-foreground">
                We'll keep it linked to this email.
              </span>
            </span>
          </div>
        </div>

        <div className="border-t" />

        <div className="px-6 pt-6 sm:px-10">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand">
            <Star className="h-3.5 w-3.5 fill-current" />
            Recommended next step
          </div>
        </div>
        <div className="px-6 pt-3 sm:px-10">
          <a
            href={STRATEGY_CALL_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-start gap-4 rounded-[14px] border-2 border-brand-border bg-brand-soft/60 px-5 py-4 transition-colors hover:bg-brand-soft sm:items-center"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-soft">
              <CalendarCheck className="h-4 w-4 text-brand" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[15.5px] font-bold text-foreground">
                  Book a free 30-min strategy call
                </span>
                <span className="inline-flex items-center rounded-full bg-brand px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.1em] text-brand-foreground">
                  Free
                </span>
              </span>
              <span className="mt-1.5 block text-[12.5px] leading-relaxed text-muted-foreground">
                Review your first audit, identify the highest-impact fixes, and
                decide what to improve first.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-brand transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="px-6 pt-6 sm:px-10">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            Need more audits?
          </div>
        </div>
        <div className="space-y-3 px-6 pt-3 pb-7 sm:px-10 sm:pb-8">
          <a
            href={STRIPE_FIVE_PACK_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-start gap-4 rounded-[14px] border bg-card px-5 py-4 transition-colors hover:border-brand-border hover:bg-brand-soft/40 sm:items-center"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-brand-soft">
              <Tag className="h-4 w-4 text-brand" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[15px] font-bold text-foreground">
                  Buy 5 audits — €39
                </span>
                <span className="inline-flex items-center rounded-full bg-brand-soft px-2 py-[2px] text-[10px] font-bold uppercase tracking-[0.1em] text-brand">
                  Best value
                </span>
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                Best value for hosts with multiple listings or a small
                portfolio.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-brand transition-transform group-hover:translate-x-0.5" />
          </a>

          <a
            href={STRIPE_SINGLE_AUDIT_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex w-full items-start gap-4 rounded-[14px] border bg-card px-5 py-4 transition-colors hover:border-brand-border hover:bg-brand-soft/30 sm:items-center"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-muted">
              <Tag className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[15px] font-semibold text-foreground">
                Buy 1 audit — €15
              </span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                One-off credit for checking one more listing.
              </span>
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-2.5 border-t bg-muted/20 px-6 py-4 text-center sm:px-10">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-card">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Paid but credits aren't showing?{" "}
            <a
              href="mailto:roryangusrussell@gmail.com?subject=Auditable%20credits%20issue"
              className="font-semibold text-foreground underline underline-offset-2"
            >
              Email Rory
            </a>{" "}
            and he'll sort it within the hour.
          </p>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try a different listing
        </button>
        <span aria-hidden className="h-3.5 w-px bg-border" />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Home className="h-3.5 w-3.5" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
