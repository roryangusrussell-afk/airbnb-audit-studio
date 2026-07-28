import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Lock, Zap, BadgeCheck } from "lucide-react";
import { UrlForm } from "./UrlForm";
import { PreviewPanel } from "./PreviewPanel";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Built by an operator",
    body: "Rory runs STR listings in Lisbon. The rubric is what he uses on his own properties.",
  },
  {
    icon: Sparkles,
    title: "Most listings score under 65",
    body: "The average audit surfaces 3 high-priority gaps. Most hosts fix the top two in under an hour.",
  },
  {
    icon: Lock,
    title: "Read-only. Nothing is changed.",
    body: "We read your public listing. We never log in, never edit, never store your URL.",
  },
  {
    icon: Zap,
    title: "Free diagnosis, then $19 for the Fix Plan",
    body: "See your score and category breakdown free. Unlock one full Fix Plan for $19, or up to 10 for $79.",
  },
];

export function Hero({ onSubmit }: { onSubmit: (url: string) => void }) {
  return (
    <>
      {/* Top brand */}
      <header className="container pt-8">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight text-foreground">
              Auditable
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              For Airbnb hosts
            </div>
          </div>
        </Link>
      </header>

      <section className="container py-10 md:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Find out what's{" "}
              <span className="relative inline-block whitespace-nowrap">
                actually holding back
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute left-[14%] -bottom-[0.08em] h-[0.22em] w-[70%] overflow-visible text-brand"
                >
                  <path
                    d="M2 5 C24 3.5, 52 5.2, 98 4"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              your Airbnb listing<span className="text-brand">.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Paste your listing URL for a free score and category breakdown.
              If you want to act on it, unlock paste-ready rewrites and a
              ranked Fix Plan you can use in Airbnb.
            </p>

            <div className="mt-8 max-w-xl space-y-3">
              <UrlForm onSubmit={onSubmit} />
              <Button asChild variant="outline" className="h-12 w-full rounded-lg text-sm font-semibold sm:w-auto sm:px-6">
                <Link to="/sample">View sample report</Link>
              </Button>
            </div>
          </div>

          <div className="lg:pl-6">
            <PreviewPanel />
          </div>
        </div>
      </section>

      {/* Bottom trust bar */}
      <section className="container pb-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {trustItems.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {t.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
