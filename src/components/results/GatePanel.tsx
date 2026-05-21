import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Home,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import type { AuditResponse } from "@/lib/types";
import { scoreBand, bandTextClass } from "@/lib/scoring";

export interface GateSubmitPayload {
  email: string;
  marketingOptIn: boolean;
}

const UNLOCK_ITEMS = [
  "Paste-ready rewrites for your title, overview and description",
  "AI-readability gaps where Airbnb may not be able to confirm key details",
  "Review themes Airbnb may surface before guests read the full reviews",
  "Photo feedback on weak first impressions and missing guest decision cues",
  "A prioritised fix list ranked by visibility and booking impact",
];

function deriveHeadline(data: AuditResponse): string {
  const score = data.score;
  const city = (data.location?.trim() ?? "").split(",")[0].trim();

  if (score >= 80) {
    return city
      ? `A strong ${city} stay, with a few details worth tightening.`
      : "A strong listing, with a few details worth tightening.";
  }
  if (score >= 60) {
    return city
      ? `A solid ${city} stay, but important details need to be clearer.`
      : "A solid listing, but important details need to be clearer.";
  }
  if (score >= 40) return "There's a good stay here, but the listing is making guests work too hard.";
  return "The listing has potential, but too many key details are hard to find.";
}

function formatAuditedDate(): string {
  return new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function GatePanel({
  data,
  onSubmit,
  onAuditAnother,
}: {
  data: AuditResponse;
  onSubmit: (payload: GateSubmitPayload) => void;
  onAuditAnother?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [err, setErr] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const headline = deriveHeadline(data);
  const guestLabel =
    data.guests != null ? `Up to ${data.guests} guests` : null;

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top header row */}
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
          Your audit report
        </p>
        {onAuditAnother && !confirmReset && (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-card transition hover:border-muted-foreground/30 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Audit another listing
          </button>
        )}
        {onAuditAnother && confirmReset && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-border bg-card px-4 py-2.5 shadow-card">
            <span className="text-sm text-muted-foreground">This will close your current report.</span>
            <button
              type="button"
              onClick={onAuditAnother}
              className="min-h-[36px] px-1 text-sm font-semibold text-danger hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-1"
            >
              Yes, close it
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-[36px] px-1 text-sm font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Listing summary card */}
      <ListingSummary data={data} guestLabel={guestLabel} />

      {/* Main audit preview card */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[150px_1fr] lg:items-center lg:px-10">
          <div className="flex justify-center lg:justify-start">
            <PreviewScoreRing score={data.score} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
              AI Readability Score
            </p>
            <h2 className="mt-3 max-w-4xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
              {headline}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              We've checked what Airbnb's AI can understand from your listing, where key details may be missed, and which rewrites are most likely to improve visibility and bookings.
            </p>
          </div>
        </div>

        <div className="mx-6 border-t border-border sm:mx-8 lg:mx-10" />

        <div className="grid items-stretch gap-5 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10">
          {/* Unlock form */}
          <div className="h-full rounded-2xl border border-border bg-card p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              Get the full fix list
            </p>

            <form onSubmit={handle} noValidate>
              <label
                htmlFor="gate-email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="gate-email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (err) setErr("");
                  }}
                  placeholder="you@example.com"
                  aria-invalid={!!err}
                  aria-describedby={err ? "gate-email-error" : undefined}
                  className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-brand focus:ring-4 focus:ring-brand-soft"
                />
              </div>
              {err && (
                <p id="gate-email-error" className="mt-2 text-sm text-danger">
                  {err}
                </p>
              )}

              <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-none rounded border-border accent-brand"
                />
                <span>
                  Send me occasional Airbnb optimisation tips. Optional.
                  <span className="mt-1 block text-xs text-muted-foreground/80">
                    Your audit will be emailed either way.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-base font-semibold text-background shadow-card transition hover:-translate-y-0.5 hover:bg-foreground/90 hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send me my report
                <ArrowRight className="h-5 w-5" />
              </button>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                By continuing you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-foreground/80 underline underline-offset-2 hover:text-brand"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-foreground/80 underline underline-offset-2 hover:text-brand"
                >
                  Privacy Policy
                </Link>
                . No spam.
              </p>

            </form>
          </div>

          {/* What you'll unlock */}
          <div className="h-full rounded-2xl border border-border bg-card p-6">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
              What you'll unlock
            </p>
            <ul className="divide-y divide-border/60">
              {UNLOCK_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-success-border text-success">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-6 text-foreground sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ListingSummary({
  data,
  guestLabel,
}: {
  data: AuditResponse;
  guestLabel: string | null;
}) {
  const auditedDate = formatAuditedDate();

  return (
    <section className="mb-5 rounded-3xl border border-border bg-card p-4 shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {data.thumbnail ? (
          <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-muted sm:h-28 sm:w-52 sm:flex-none">
            <img
              src={data.thumbnail}
              alt={data.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                <CheckCircle2 className="h-3 w-3" />
                Audited
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground sm:h-28 sm:w-52 sm:flex-none">
            <Home className="h-8 w-8 opacity-50" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
            {data.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-muted-foreground">
            {data.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {data.location}
              </span>
            )}
            {data.rating != null && data.rating > 0 && (
              <>
                <Star className="ml-2 h-4 w-4 fill-foreground text-foreground" />
                <span className="font-medium text-foreground">
                  {data.rating.toFixed(2)}
                </span>
                {data.reviewCount != null && data.reviewCount > 0 && (
                  <>
                    <span>·</span>
                    <span>{data.reviewCount} {data.reviewCount === 1 ? "review" : "reviews"}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {data.propertyType && (
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                {data.propertyType}
              </span>
            )}
            {guestLabel && (
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                {guestLabel}
              </span>
            )}
          </div>
        </div>

        <p className="shrink-0 text-sm text-muted-foreground sm:self-start">
          Audited {auditedDate}
        </p>
      </div>
    </section>
  );
}

function PreviewScoreRing({ score }: { score: number }) {
  const size = 140;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = c - (displayed / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ stroke: `hsl(var(--${scoreBand(score) === "strong" ? "success" : scoreBand(score) === "average" ? "warning" : "danger"}))`, transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-4xl font-bold tabular-nums ${bandTextClass(scoreBand(score))}`}>
          {displayed}
        </div>
        <div className="mt-1 text-sm font-semibold text-muted-foreground">
          / 100
        </div>
      </div>
    </div>
  );
}
