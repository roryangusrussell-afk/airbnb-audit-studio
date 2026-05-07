import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { AuditResponse } from "@/lib/types";

export function NextStepTab({ email, data }: { email: string; data: AuditResponse }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <StrategyCallCard data={data} />
      <GetMoreCard email={email} />
    </div>
  );
}

function buildBridge(data: AuditResponse): string {
  const score = data.score;
  const weakest = [...data.cats]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((c) => c.name.toLowerCase());
  const opportunity = data.issues?.[0]?.title?.toLowerCase();
  const focus = opportunity
    ? `${weakest.join(" and ")}${opportunity ? `, especially ${opportunity}` : ""}`
    : weakest.join(" and ");
  return `Your listing scored ${score}/100, with the biggest upside in ${focus}. A strategy call is the fastest way to find the highest-leverage fixes across your portfolio.`;
}

function StrategyCallCard({ data }: { data: AuditResponse }) {
  const bullets = [
    "Audit your whole portfolio in one call",
    "Find which listing has the biggest upside",
    "Explore automation and systems for your operation",
    "See whether full management makes sense",
  ];
  return (
    <div className="lg:col-span-2 rounded-2xl border border-brand-border bg-brand-soft p-6 sm:p-8 shadow-elevated">
      <Eyebrow>Work together</Eyebrow>
      <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Book a strategy call
      </h3>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground">
        We will go through your portfolio, identify the highest-leverage fixes, and work
        out whether self-managing, automating, or handing over entirely makes the most
        sense.
      </p>

      <div className="mt-4 rounded-xl border border-border bg-card/70 px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{buildBridge(data)}</p>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-none text-success" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs font-medium text-foreground/70">
        30 minutes · Best for hosts thinking about scaling
      </p>
      <Button
        asChild
        className="mt-4 h-12 w-full bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold"
      >
        <a href="#">Book a call</a>
      </Button>
    </div>
  );
}

function GetMoreCard({ email }: { email: string }) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/audit?ref=${refCode}`;
  const { copied, copy } = useCopyToClipboard(2000);

  return (
    <div className="lg:col-span-1 rounded-2xl border bg-card p-5 shadow-card flex flex-col gap-4">
      <div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft">
          <Link2 className="h-3.5 w-3.5 text-brand" />
        </div>
        <Eyebrow className="mt-3">Get more audits</Eyebrow>
        <h4 className="mt-1 text-base font-bold tracking-tight">Audit another listing</h4>
      </div>

      {/* Free path */}
      <div className="rounded-xl bg-muted/40 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Free
        </p>
        <p className="mt-1 text-sm font-medium">Refer another host</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Share your link. When they complete an audit, you unlock one more free.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => copy(link)}
        >
          {copied ? "Copied!" : "Copy my referral link"}
        </Button>
      </div>

      {/* Buy path */}
      <div className="rounded-xl border border-brand-border bg-brand-soft p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand">
          Buy
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">1 audit</span>
            <span className="font-bold">$19</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">5 audits</span>
            <span className="flex items-center gap-1.5 font-bold">
              $79{" "}
              <span className="text-[11px] font-normal text-muted-foreground line-through">
                $95
              </span>
            </span>
          </button>
          <button
            type="button"
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">Portfolio / Enterprise</span>
            <span className="text-xs font-semibold text-brand">Contact us</span>
          </button>
        </div>
      </div>
    </div>
  );
}
