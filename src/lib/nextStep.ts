import { track } from "@vercel/analytics";
import type { AuditResponse } from "./types";

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

export type AnalyticsEvent =
  | "next_step_page_viewed"
  | "clicked_strategy_call"
  | "clicked_management_fit"
  | "clicked_referral_copy"
  | "clicked_buy_five_audits";

type AllowedPropertyValue = string | number | boolean | null;

function toAnalyticsProperties(
  payload: Record<string, unknown>,
): Record<string, AllowedPropertyValue> {
  const result: Record<string, AllowedPropertyValue> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (
      value === null ||
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

export function trackEvent(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const properties = toAnalyticsProperties(payload);
  track(event, properties);
  if (import.meta.env?.DEV) {
    console.log(`[analytics] ${event}`, properties);
  }
}
