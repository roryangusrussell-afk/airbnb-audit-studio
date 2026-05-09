import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Gift,
  Mail,
  Sparkles,
  TrendingUp,
  FileSearch,
  Wrench,
  ClipboardList,
  Tag,
  MessageSquareQuote,
  Users,
  Star,
} from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { captureLead } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";
import {
  getHostListingCount,
  getOverallScore,
  getRecommendedNextStep,
  getTopGap,
  isPortugalListing,
  trackEvent,
  type AnalyticsEvent,
  type NextStepRoute,
} from "@/lib/nextStep";
import {
  CompareListingsIllustration,
  PortfolioIllustration,
  PortugalIllustration,
  ScoreTile,
} from "./nextStep/Illustrations";

type IconType = React.ComponentType<{ className?: string }>;

interface CtaSpec {
  label: string;
  event: AnalyticsEvent;
}

interface InlinePill {
  icon: IconType;
  text: React.ReactNode;
}

interface SecondaryRowSpec {
  icon: IconType;
  title: string;
  body: string;
  cta: CtaSpec;
}

interface PrimaryCardSpec {
  eyebrow: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  pill?: InlinePill;
  primaryCta?: CtaSpec;
  secondaryCta?: CtaSpec;
}

interface RouteContent {
  primary: PrimaryCardSpec;
  secondaryRows: SecondaryRowSpec[];
  showStrAiFooter: boolean;
}

const VALID_ROUTES: NextStepRoute[] = [
  "portugal-management",
  "portfolio-review",
  "audit-another-listing",
  "ai-systems",
  "improve-this-listing",
  "fix-this-listing",
];

// CTAs that have no destination yet. Hidden until they're wired to a real
// link (Calendly, Stripe, etc.). Keep this list narrow — it's a kill switch
// for visible-but-broken buttons, not a policy lever.
const HIDDEN_CTA_EVENTS: ReadonlySet<AnalyticsEvent> = new Set([
  "clicked_buy_one_audit",
  "clicked_buy_five_audits",
  "clicked_get_quote",
]);

function readDevRouteOverride(): NextStepRoute | null {
  if (!import.meta.env.DEV) return null;
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("next_step_route");
  if (param && (VALID_ROUTES as string[]).includes(param)) {
    return param as NextStepRoute;
  }
  return null;
}

export function NextStepTab({ email, data }: { email: string; data: AuditResponse }) {
  const route = useMemo<NextStepRoute>(
    () => readDevRouteOverride() ?? getRecommendedNextStep(data),
    [data],
  );

  useEffect(() => {
    trackEvent("next_step_page_viewed", {
      recommended_route: route,
      host_listing_count: getHostListingCount(data),
      overall_score: getOverallScore(data),
      listing_location: data.location ?? null,
      is_portugal_listing: isPortugalListing(data),
    });
  }, [route, data]);

  const content = useMemo(() => {
    const raw = buildRouteContent(route, data);
    return {
      ...raw,
      primary: {
        ...raw.primary,
        primaryCta: HIDDEN_CTA_EVENTS.has(raw.primary.primaryCta.event)
          ? undefined
          : raw.primary.primaryCta,
        secondaryCta:
          raw.primary.secondaryCta && HIDDEN_CTA_EVENTS.has(raw.primary.secondaryCta.event)
            ? undefined
            : raw.primary.secondaryCta,
      },
      secondaryRows: raw.secondaryRows.filter(
        (row) => !HIDDEN_CTA_EVENTS.has(row.cta.event),
      ),
    };
  }, [route, data]);
  const emailReportRow = <EmailReportRow data={data} initialEmail={email} />;
  const referralRow = <ReferralRow email={email} />;

  return (
    <div className="overflow-hidden rounded-[20px] border bg-card shadow-card">
      <header className="px-6 pb-5 pt-7 sm:px-8 sm:pt-8">
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]">
          Choose your next step
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Based on this listing, here's the most useful next move.
        </p>
      </header>

      <div className="px-6 pb-7 sm:px-8">
        <PrimaryCard spec={content.primary} />
      </div>

      <div className="border-t" />

      <section className="px-6 py-6 sm:px-8">
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">
          Other useful options
        </h3>
        <div className="mt-3 space-y-2.5">
          {emailReportRow}
          {content.secondaryRows.map((row, i) => (
            <SecondaryRow key={i} spec={row} />
          ))}
          {referralRow}
        </div>
      </section>

      {content.showStrAiFooter && (
        <>
          <div className="border-t" />
          <FooterStrip />
        </>
      )}
    </div>
  );
}

function PrimaryCard({ spec }: { spec: PrimaryCardSpec }) {
  return (
    <div className="overflow-hidden rounded-[14px] border bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-[40%_60%]">
        <div className="aspect-[5/4] sm:aspect-auto sm:min-h-[260px]">
          {spec.visual}
        </div>

        <div className="flex flex-col gap-3 px-6 py-6 sm:px-7 sm:py-7">
          <Eyebrow>{spec.eyebrow}</Eyebrow>
          <h3 className="text-[22px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[24px]">
            {spec.title}
          </h3>
          <p className="text-[14.5px] leading-relaxed text-foreground/80">{spec.body}</p>

          {spec.pill && <InlinePillView pill={spec.pill} />}

          {(spec.primaryCta || spec.secondaryCta) && (
            <div className="mt-3 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
              {spec.secondaryCta && (
                <button
                  type="button"
                  onClick={() => trackEvent(spec.secondaryCta!.event)}
                  className="inline-flex h-10 items-center justify-center rounded-[10px] border bg-card px-4 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted/40"
                >
                  {spec.secondaryCta.label}
                </button>
              )}
              {spec.primaryCta && (
                <button
                  type="button"
                  onClick={() => trackEvent(spec.primaryCta!.event)}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
                >
                  {spec.primaryCta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InlinePillView({ pill }: { pill: InlinePill }) {
  const Icon = pill.icon;
  return (
    <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-[10px] border bg-muted/40 px-3 py-2 text-[12.5px] text-foreground/80">
      <Icon className="h-3.5 w-3.5 flex-none text-muted-foreground" />
      <span className="truncate">{pill.text}</span>
    </div>
  );
}

function SecondaryRow({ spec }: { spec: SecondaryRowSpec }) {
  const Icon = spec.icon;
  return (
    <button
      type="button"
      onClick={() => trackEvent(spec.cta.event)}
      className="group flex w-full items-center gap-3.5 rounded-[12px] border bg-card px-4 py-3.5 text-left transition-colors hover:border-brand-border hover:bg-brand-soft/30"
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
        <Icon className="h-4 w-4 text-brand" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-semibold text-foreground">{spec.title}</span>
        <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
          {spec.body}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
    </button>
  );
}

function EmailReportRow({
  data,
  initialEmail,
}: {
  data: AuditResponse;
  initialEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      // Persist for future sessions on this browser
      if (typeof window !== "undefined") {
        localStorage.setItem("auditEmail", trimmed);
      }
      await captureLead({
        email: trimmed,
        url: `https://www.airbnb.com/rooms/${data.listingId}`,
        listingId: data.listingId,
        title: data.title,
        score: data.score,
        rating: data.rating ?? null,
        reviewCount: data.reviewCount ?? null,
        result: data,
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3.5 rounded-[12px] border bg-card px-4 py-3.5 text-left transition-colors hover:border-brand-border hover:bg-brand-soft/30"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
          <Mail className="h-4 w-4 text-brand" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13.5px] font-semibold text-foreground">
            Email this report to me
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
            All rewrites in your inbox so you can paste them later.
          </span>
        </span>
        <ChevronRight className="h-4 w-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
      </button>
    );
  }

  return (
    <div className="rounded-[12px] border bg-card p-4">
      {state === "sent" ? (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-success-soft">
            <Check className="h-4 w-4 text-success" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13.5px] font-semibold text-foreground">
              Sent
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
              Check {email} in a minute or two.
            </span>
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
              <Mail className="h-4 w-4 text-brand" />
            </span>
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-foreground">
                Email this report to me
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                All rewrites in your inbox so you can paste them later.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              autoFocus
              placeholder="you@host.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              className="h-10 flex-1 rounded-[10px] border bg-card px-3 text-[13.5px] text-foreground outline-none transition-colors focus:border-brand"
              disabled={state === "sending"}
            />
            <button
              type="button"
              onClick={send}
              disabled={state === "sending"}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[13px] font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-60"
            >
              {state === "sending" ? "Sending..." : "Send report"}
              {state !== "sending" && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
          {state === "error" && (
            <p className="mt-2 text-[12px] text-danger">
              That doesn't look like a valid email. Try again?
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ReferralRow({ email }: { email: string }) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/audit?ref=${refCode}`;
  const { copied, copy } = useCopyToClipboard(2000);

  return (
    <div className="flex w-full items-center gap-3.5 rounded-[12px] border bg-card px-4 py-3.5">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-soft">
        <Gift className="h-4 w-4 text-brand" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-semibold text-foreground">
          Refer a host, get 1 free audit
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
          Share your link and get a free audit when they buy.
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          trackEvent("clicked_referral_copy");
          copy(link);
        }}
        className="inline-flex h-9 flex-none items-center gap-1.5 rounded-[10px] border bg-card px-3 text-[12.5px] font-semibold text-foreground transition-colors hover:bg-muted/40"
      >
        <Copy className="h-3.5 w-3.5" />
        {copied ? "Copied!" : "Copy referral link"}
      </button>
    </div>
  );
}

function FooterStrip() {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-4 text-center text-[12.5px] text-muted-foreground sm:px-8">
      <Sparkles className="h-3.5 w-3.5 text-brand" />
      <span>
        Want ongoing improvements with AI?{" "}
        <button
          type="button"
          onClick={() => trackEvent("clicked_ai_waitlist")}
          className="inline-flex items-center gap-1 font-semibold text-brand underline-offset-2 hover:underline"
        >
          Join the STR + AI waitlist
          <ArrowRight className="h-3 w-3" />
        </button>
      </span>
    </div>
  );
}

function buildRouteContent(route: NextStepRoute, data: AuditResponse): RouteContent {
  const hostListingCount = getHostListingCount(data);
  const overallScore = getOverallScore(data);
  const topGap = getTopGap(data);

  const referralAuditRow: SecondaryRowSpec = {
    icon: FileSearch,
    title: "Audit another listing — $19",
    body: "Run a new audit on any Airbnb listing.",
    cta: { label: "Buy 1 audit", event: "clicked_buy_one_audit" },
  };

  const fixHelpRow: SecondaryRowSpec = {
    icon: Wrench,
    title: "Get help fixing this listing",
    body: "Get a custom action plan to improve performance.",
    cta: { label: "Get a quote", event: "clicked_get_quote" },
  };

  const improveHelpRow: SecondaryRowSpec = {
    icon: TrendingUp,
    title: "Get help improving this listing",
    body: "Personalized recommendations to increase bookings and revenue.",
    cta: { label: "Get a quote", event: "clicked_get_quote" },
  };

  const portfolioReviewRow: SecondaryRowSpec = {
    icon: ClipboardList,
    title: "Review the portfolio with us",
    body: "See where your biggest opportunities are.",
    cta: { label: "Request portfolio review", event: "clicked_portfolio_review" },
  };

  const fivePackRow: SecondaryRowSpec = {
    icon: Tag,
    title: "Buy 5 audits — $79",
    body: "Use audits across your portfolio and save.",
    cta: { label: "Buy 5 audits", event: "clicked_buy_five_audits" },
  };

  const aiWaitlistRow: SecondaryRowSpec = {
    icon: Sparkles,
    title: "Learn the STR + AI system",
    body: "Use AI to audit listings, analyse reviews, and build better workflows.",
    cta: { label: "Join waitlist", event: "clicked_ai_waitlist" },
  };

  const secondOpinionRow: SecondaryRowSpec = {
    icon: MessageSquareQuote,
    title: "Get a second opinion",
    body: "Have our team review your listing and share feedback.",
    cta: { label: "Request review", event: "clicked_second_opinion" },
  };

  const scoreText = (score: number, withGap: boolean) => (
    <>
      Your listing scored{" "}
      <span className="font-semibold text-brand">
        {score}/100
      </span>
      {withGap && topGap ? <>, biggest upside in {topGap}.</> : "."}
    </>
  );

  switch (route) {
    case "portugal-management":
      return {
        primary: {
          eyebrow: "Portugal property management",
          title: "Have a property in Portugal?",
          body:
            "We can help with management, pricing, guest communication, turnovers, maintenance, and owner reporting, so your property performs and you stay stress-free.",
          visual: <PortugalIllustration />,
          primaryCta: { label: "Check management fit", event: "clicked_management_fit" },
        },
        secondaryRows: [improveHelpRow, referralAuditRow],
        showStrAiFooter: true,
      };

    case "portfolio-review":
      return {
        primary: {
          eyebrow: "Portfolio review",
          title: "Review your portfolio",
          body:
            "With several listings, the real question is which one has the biggest upside and what should be fixed first.",
          visual: <PortfolioIllustration count={hostListingCount} />,
          pill:
            hostListingCount > 1
              ? {
                  icon: Users,
                  text: `This host profile appears to have ${hostListingCount} listings.`,
                }
              : undefined,
          primaryCta: { label: "Request portfolio review", event: "clicked_portfolio_review" },
        },
        secondaryRows: [fivePackRow, fixHelpRow],
        showStrAiFooter: true,
      };

    case "audit-another-listing":
      return {
        primary: {
          eyebrow: "Get more audits",
          title: "Audit another listing",
          body:
            "Use another audit to compare your listings, or review a competitor to uncover new opportunities.",
          visual: <CompareListingsIllustration />,
          pill:
            hostListingCount > 1
              ? {
                  icon: Users,
                  text: `We found ${hostListingCount} listings associated with this host profile.`,
                }
              : undefined,
          primaryCta: { label: "Buy 1 audit — $19", event: "clicked_buy_one_audit" },
          secondaryCta: { label: "Buy 5 audits — $79", event: "clicked_buy_five_audits" },
        },
        secondaryRows: [fixHelpRow, portfolioReviewRow],
        showStrAiFooter: true,
      };

    case "ai-systems":
      return {
        primary: {
          eyebrow: "STR + AI systems",
          title: "Learn the system behind the audit",
          body:
            "Your listing is already strong. The next opportunity is learning how to keep improving with AI.",
          visual: <ScoreTile score={overallScore || 92} />,
          pill: overallScore
            ? { icon: Star, text: scoreText(overallScore, false) }
            : undefined,
          primaryCta: { label: "Join STR + AI waitlist", event: "clicked_ai_waitlist" },
          secondaryCta: { label: "Get the automation playbook", event: "clicked_automation_playbook" },
        },
        secondaryRows: [referralAuditRow, secondOpinionRow],
        showStrAiFooter: false,
      };

    case "improve-this-listing":
      return {
        primary: {
          eyebrow: "Improve this listing",
          title: "Get help improving this listing",
          body:
            "Your listing is already doing some things well. The audit found specific areas where it could convert better.",
          visual: <ScoreTile score={overallScore || 80} />,
          pill: overallScore
            ? { icon: Star, text: scoreText(overallScore, true) }
            : undefined,
          primaryCta: { label: "Get a quote", event: "clicked_get_quote" },
        },
        secondaryRows: [referralAuditRow, aiWaitlistRow],
        showStrAiFooter: false,
      };

    case "fix-this-listing":
    default:
      return {
        primary: {
          eyebrow: "Fix this listing",
          title: "Get help fixing this listing",
          body:
            "Your audit found meaningful gaps. We can turn the findings into a corrected listing for you.",
          visual: <ScoreTile score={overallScore || 60} />,
          pill: overallScore
            ? { icon: Star, text: scoreText(overallScore, true) }
            : undefined,
          primaryCta: { label: "Get a quote", event: "clicked_get_quote" },
        },
        secondaryRows: [referralAuditRow, aiWaitlistRow],
        showStrAiFooter: false,
      };
  }
}
