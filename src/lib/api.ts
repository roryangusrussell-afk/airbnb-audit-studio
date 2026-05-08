import type { AuditResponse } from "./types";

const BASE = "https://airbnb-audit-rho.vercel.app";

export class AuditError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function runAudit(url: string): Promise<AuditResponse> {
  // One transparent retry on transient backend failures (5xx, network errors).
  // 4xx (e.g. invalid URL) and AbortError pass through immediately.
  const MAX_ATTEMPTS = 2;
  let lastError: AuditError | null = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 240_000);
    try {
      const res = await fetch(`${BASE}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.status === 422) {
        throw new AuditError(
          "This listing could not be found. Check the URL is public and try again.",
          422,
        );
      }
      if (res.status >= 400 && res.status < 500) {
        throw new AuditError(`Audit failed (${res.status}). Please try again.`, res.status);
      }
      if (!res.ok) {
        // 5xx — retryable
        lastError = new AuditError(`Audit failed (${res.status}). Please try again.`, res.status);
        if (attempt < MAX_ATTEMPTS) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw lastError;
      }
      return (await res.json()) as AuditResponse;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof AuditError) {
        // 4xx and other AuditErrors don't retry
        if (err.status && err.status >= 400 && err.status < 500) throw err;
        // 5xx already handled above; for safety fall through
        lastError = err;
      } else if ((err as Error).name === "AbortError") {
        throw new AuditError("The audit is taking longer than expected. Please try again.");
      } else {
        // Network error — retryable
        lastError = new AuditError("Could not reach the audit service. Please try again.");
      }
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      throw lastError;
    }
  }
  throw lastError ?? new AuditError("Audit failed. Please try again.");
}

export interface PeekData {
  imageUrl: string | null;
  title: string | null;
  rating: string | null;
  reviewCount: number | null;
  host: string | null;
}

export async function peekListing(url: string): Promise<PeekData | null> {
  try {
    const idMatch = url.match(/\/rooms\/(\d+)/);
    if (!idMatch) return null;
    const res = await fetch(`${BASE}/api/peek?id=${idMatch[1]}`);
    if (!res.ok) return null;
    return (await res.json()) as PeekData;
  } catch {
    return null;
  }
}

export async function sendReport(payload: {
  email: string;
  listingId: string;
  score: number;
  title: string;
}): Promise<void> {
  // TODO: wire up Resend on the server
  await fetch(`${BASE}/api/send-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function captureLead(payload: {
  email: string;
  url: string;
  listingId?: string;
  title?: string;
  score?: number;
  rating?: number | null;
  reviewCount?: number | null;
}): Promise<void> {
  await fetch(`${BASE}/api/capture-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function redeemRef(email: string, refCode: string): Promise<void> {
  await fetch(`${BASE}/api/redeem-ref`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, refCode }),
  }).catch(() => {});
}

export async function checkCredits(email: string): Promise<number> {
  try {
    const res = await fetch(
      `${BASE}/api/check-credits?email=${encodeURIComponent(email)}`,
    );
    if (!res.ok) return 0;
    const data = (await res.json()) as { credits?: number };
    return data.credits ?? 0;
  } catch {
    return 0;
  }
}

export async function useCredit(email: string): Promise<void> {
  await fetch(`${BASE}/api/use-credit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).catch(() => {});
}

export async function submitFeedback(payload: {
  listingId: string;
  rating: string;
  comment?: string;
  email?: string;
  url?: string;
}): Promise<void> {
  await fetch(`${BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
