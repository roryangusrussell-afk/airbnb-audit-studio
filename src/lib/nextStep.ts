import { track } from "@vercel/analytics";

import type { AuditResponse } from "./types";

export type NextStepRoute =
  | "portugal-management"
  | "portfolio-review"
  | "audit-another-listing"
  | "ai-systems"
  | "improve-this-listing"
  | "fix-this-listing";

type LocatableAudit = Partial<AuditResponse> & {
  listingLocation?: string;
  listingCountry?: string;
  country?: string;
  listingCity?: string;
  city?: string;
};

const PORTUGAL_TOKENS = [
  "portugal",
  "lisbon",
  "lisboa",
  "porto",
  "algarve",
  "cascais",
  "estoril",
  "comporta",
  "ericeira",
  "madeira",
  "funchal",
];

export function isPortugalListing(audit: LocatableAudit): boolean {
  const locationText = [
    audit.listingLocation,
    audit.location,
    audit.listingCountry,
    audit.country,
    audit.listingCity,
    audit.city,
  ]
    .filter((v): v is string => Boolean(v))
    .join(" ")
    .toLowerCase();

  return PORTUGAL_TOKENS.some((token) => locationText.includes(token));
}

export function getHostListingCount(audit: AuditResponse): number {
  const raw =
    audit.hostListingCount ??
    (audit as unknown as { hostListingsCount?: number }).hostListingsCount ??
    (audit as unknown as { hostTotalListings?: number }).hostTotalListings ??
    1;
  const count = Number(raw);
  return Number.isFinite(count) && count > 0 ? count : 1;
}

export function getOverallScore(audit: AuditResponse): number {
  const raw = audit.score ?? (audit as unknown as { overallScore?: number }).overallScore ?? 0;
  const score = Number(raw);
  return Number.isFinite(score) ? score : 0;
}

export function getTopGap(audit: AuditResponse): string | null {
  const firstIssue = audit.issues?.find((i) => (i.type ?? "gap") !== "opportunity") ?? audit.issues?.[0];
  const title = firstIssue?.title?.trim();
  if (!title) return null;
  return title.charAt(0).toLowerCase() + title.slice(1);
}

export function getRecommendedNextStep(audit: AuditResponse): NextStepRoute {
  if (!audit) return "audit-another-listing";

  const hostListingCount = getHostListingCount(audit);
  const overallScore = getOverallScore(audit);

  if (isPortugalListing(audit)) return "portugal-management";
  if (hostListingCount >= 10) return "portfolio-review";
  if (hostListingCount > 1 && hostListingCount < 10) return "audit-another-listing";
  if (overallScore >= 90) return "ai-systems";
  if (overallScore >= 75) return "improve-this-listing";
  return "fix-this-listing";
}

export type AnalyticsEvent =
  | "next_step_page_viewed"
  | "clicked_management_fit"
  | "clicked_get_quote"
  | "clicked_buy_one_audit"
  | "clicked_buy_five_audits"
  | "clicked_portfolio_review"
  | "clicked_referral_copy"
  | "clicked_ai_waitlist"
  | "clicked_automation_playbook"
  | "clicked_second_opinion";

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  track(event, toAnalyticsProperties(payload));

  if (import.meta.env.DEV) {
    console.log(`[analytics] ${event}`, payload);
  }
}

type AnalyticsProperty = string | number | boolean | null;

function toAnalyticsProperties(
  payload: Record<string, unknown>,
): Record<string, AnalyticsProperty> {
  const result: Record<string, AnalyticsProperty> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === null) {
      result[key] = null;
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      result[key] = value;
    } else if (value !== undefined) {
      result[key] = JSON.stringify(value);
    }
  }
  return result;
}
