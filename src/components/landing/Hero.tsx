import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Lock, Zap, BadgeCheck } from "lucide-react";
import { UrlForm } from "./UrlForm";
import { PreviewPanel } from "./PreviewPanel";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Operator built",
    body: "Built by hosts who run listings every day.",
  },
  {
    icon: Sparkles,
    title: "Impact first",
    body: "We focus on what moves rankings and bookings.",
  },
  {
    icon: Lock,
    title: "Private & secure",
    body: "Read-only audit. We never edit your listing.",
  },
  {
    icon: Zap,
    title: "Fast & actionable",
    body: "Full report with copy-ready fixes in under a minute.",
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
              AUDITABLE
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
            <div className="inline-flex rounded-full border border-brand-border bg-brand-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Operator-built. Impact-first.
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              See exactly what your Airbnb listing should fix first.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Paste your listing URL. We score 6 categories, flag the highest-impact gaps,
              and write the rewrites for you. Free, in under a minute.
            </p>

            <div className="mt-8 max-w-xl space-y-3">
              <UrlForm onSubmit={onSubmit} />
              <Button asChild variant="outline" className="h-12 w-full rounded-lg text-sm font-semibold sm:w-auto sm:px-6">
                <Link to="/sample">View sample report</Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Free</span>
              <span className="text-border">•</span>
              <span>Read-only</span>
              <span className="text-border">•</span>
              <span>No login</span>
              <span className="text-border">•</span>
              <span>Nothing edited</span>
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
