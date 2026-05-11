import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScoreRing } from "./ScoreRing";
import { bandTextClass, scoreBand, verdictLabel } from "@/lib/scoring";
import type { AuditResponse } from "@/lib/types";

export interface GateSubmitPayload {
  email: string;
  marketingOptIn: boolean;
}

export function GatePanel({
  data,
  onSubmit,
}: {
  data: AuditResponse;
  onSubmit: (payload: GateSubmitPayload) => void;
}) {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [err, setErr] = useState("");

  const band = scoreBand(data.score);
  const verdict = data.verdict || verdictLabel(data.score);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Please enter a valid email.");
      return;
    }
    setErr("");
    onSubmit({ email: trimmed, marketingOptIn: marketing });
  };

  const unlocks = [
    "Paste-ready rewrites for every section",
    "Sub-rating breakdown and host signals",
    "Photo intelligence and missing-room flags",
    "Prioritised fixes ranked by impact",
  ];

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-card">
      {/* Top: score teaser so the user sees a result exists */}
      <div className="flex flex-col items-center gap-5 border-b bg-muted/30 px-6 py-7 sm:flex-row sm:items-center sm:gap-7 sm:px-8">
        <ScoreRing score={data.score} size={120} />
        <div className="min-w-0 text-center sm:text-left">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your audit is ready
          </div>
          <h2 className={`mt-1 text-2xl font-bold tracking-tight ${bandTextClass(band)}`}>
            {verdict}
          </h2>
          <p className="mt-2 max-w-md text-[13.5px] leading-6 text-muted-foreground">
            We scored your listing and prepared the rewrites. Enter your email to read through the full report.
          </p>
        </div>
      </div>

      {/* Bottom: email form + what unlocks */}
      <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label htmlFor="gate-email" className="text-[13px] font-semibold text-foreground">
              Email address
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="gate-email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr("");
                }}
                placeholder="you@example.com"
                className="h-11 pl-9"
                aria-invalid={!!err}
                aria-describedby={err ? "gate-email-error" : undefined}
              />
            </div>
            {err && (
              <p id="gate-email-error" className="mt-1.5 text-sm text-danger">
                {err}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-5 text-muted-foreground">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-none rounded border-border accent-brand"
            />
            <span>
              Send me occasional listing-improvement tips. I can unsubscribe at any time.
              <span className="mt-0.5 block text-[11.5px] text-muted-foreground/80">
                Optional. Your audit will be emailed either way as part of this request.
              </span>
            </span>
          </label>

          <Button type="submit" className="h-11 w-full gap-1.5">
            View my audit
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-[11.5px] leading-5 text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            . No spam.
          </p>
        </form>

        <div className="rounded-xl border bg-muted/20 p-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            What's behind the gate
          </div>
          <ul className="mt-3 space-y-2.5">
            {unlocks.map((u) => (
              <li key={u} className="flex items-start gap-2.5 text-[13px] leading-5 text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
