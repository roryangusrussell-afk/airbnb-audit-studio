import { useState } from "react";
import { Link2, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function NextStepTab({ email }: { email: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <StrategyCallCard />
      <div className="grid gap-5 lg:col-span-1">
        <ReferralCard email={email} />
        <NewsletterCard />
      </div>
    </div>
  );
}

function StrategyCallCard() {
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
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 flex-none text-brand" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted-foreground">
        30 minutes · Best for hosts thinking about scaling
      </p>
      <Button
        asChild
        className="mt-5 h-12 w-full bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold"
      >
        <a href="#">Book a call</a>
      </Button>
    </div>
  );
}

function ReferralCard({ email }: { email: string }) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const link = `https://airbnb-audit-rho.vercel.app/audit?ref=${refCode}`;
  const { copied, copy } = useCopyToClipboard(2000);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft">
        <Link2 className="h-4 w-4 text-brand" />
      </div>
      <Eyebrow className="mt-4">Get more audits</Eyebrow>
      <h4 className="mt-1 text-base font-bold tracking-tight">Unlock more free audits</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Share your link with another host. Each referral unlocks one more free audit.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={() => copy(link)}
      >
        {copied ? "Copied!" : "Copy my link"}
      </Button>
    </div>
  );
}

function NewsletterCard() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft">
        <Mail className="h-4 w-4 text-brand" />
      </div>
      <Eyebrow className="mt-4">Stay informed</Eyebrow>
      <h4 className="mt-1 text-base font-bold tracking-tight">Get the operator newsletter</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Practical listing teardowns, positioning ideas, and STR systems from the field.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 w-full"
        onClick={() => setJoined(true)}
        disabled={joined}
      >
        {joined ? "You're in." : "Join free"}
      </Button>
    </div>
  );
}
