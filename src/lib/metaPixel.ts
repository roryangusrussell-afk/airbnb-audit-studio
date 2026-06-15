// Meta (Facebook) Pixel helper.
//
// The base pixel and the initial PageView are installed in index.html so they
// fire on first paint regardless of React. This module wraps only the
// conversion events the funnel fires from React (Lead, Purchase). Every call is
// guarded so it is a safe no-op when fbq is unavailable: server-side rendering,
// an ad blocker, or the pixel script failing to load.

export const META_PIXEL_ID = "1722243085473936";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function fbq(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

// Standard "Lead" event, fired when a visitor submits the email gate (the
// signup action for this funnel).
export function trackLead(params?: { content_name?: string }): void {
  fbq("track", "Lead", params);
}

// Standard "Purchase" event, fired after a Stripe payment is confirmed.
// `value` is in major currency units (e.g. 19.00), `currency` an ISO 4217 code
// (e.g. "USD"). `eventID` (the Stripe session id) dedupes against any future
// server-side Conversions API event and guards against an accidental
// double-fire for the same purchase.
export function trackPurchase(args: {
  value: number;
  currency: string;
  eventID?: string;
}): void {
  const { value, currency, eventID } = args;
  fbq(
    "track",
    "Purchase",
    { value, currency: currency.toUpperCase() },
    eventID ? { eventID } : undefined,
  );
}
