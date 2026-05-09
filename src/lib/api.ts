import type { AuditResponse } from "./types";

const BASE = "https://airbnb-audit-rho.vercel.app";

export class AuditError extends Error {
  status?: number;
  detail?: string;
  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function readBodySnippet(res: Response): Promise<string | undefined> {
  try {
    const text = await res.text();
    if (!text) return undefined;
    // Strip HTML tags from Vercel/CDN error pages, collapse whitespace, cap length.
    const cleaned = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return cleaned.slice(0, 500) || undefined;
  } catch {
    return undefined;
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

      // Pre-streaming responses (URL validation, method-not-allowed) come back
      // with non-200 HTTP status. The streaming /api/audit path always returns
      // 200 and encodes status in the body via { ok, status, error } so Safari
      // doesn't kill long fetches.
      if (res.status >= 400 && res.status < 500) {
        const detail = await readBodySnippet(res);
        const err = new AuditError(`Audit failed (${res.status}). Please try again.`, res.status, detail);
        console.error("[runAudit] 4xx", { url, attempt, status: res.status, detail });
        throw err;
      }
      if (!res.ok) {
        const detail = await readBodySnippet(res);
        lastError = new AuditError(`Audit failed (${res.status}). Please try again.`, res.status, detail);
        console.error("[runAudit] 5xx", { url, attempt, status: res.status, detail });
        if (attempt < MAX_ATTEMPTS) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw lastError;
      }

      const body = await res.json();

      // Body-encoded error from the streaming handler
      if (body && body.ok === false) {
        const status = typeof body.status === "number" ? body.status : 500;
        const errorText = typeof body.error === "string" ? body.error : "Unknown error";
        if (status === 422) {
          const err = new AuditError(
            "This listing could not be found. Check the URL is public and try again.",
            422,
            errorText,
          );
          console.error("[runAudit] body-422", { url, attempt, errorText });
          throw err;
        }
        if (status >= 500) {
          lastError = new AuditError(`Audit failed (${status}). Please try again.`, status, errorText);
          console.error("[runAudit] body-5xx", { url, attempt, status, errorText });
          if (attempt < MAX_ATTEMPTS) {
            await new Promise(r => setTimeout(r, 2000));
            continue;
          }
          throw lastError;
        }
        const err = new AuditError(`Audit failed (${status}). Please try again.`, status, errorText);
        console.error("[runAudit] body-4xx", { url, attempt, status, errorText });
        throw err;
      }

      return body as AuditResponse;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof AuditError) {
        // 4xx and other AuditErrors don't retry
        if (err.status && err.status >= 400 && err.status < 500) throw err;
        // 5xx already handled above; for safety fall through
        lastError = err;
      } else if ((err as Error).name === "AbortError") {
        const e = new AuditError("The audit is taking longer than expected. Please try again.", undefined, "client timeout (240s)");
        console.error("[runAudit] timeout", { url, attempt });
        throw e;
      } else {
        // Network error — retryable
        const message = (err as Error)?.message || String(err);
        lastError = new AuditError("Could not reach the audit service. Please try again.", undefined, message);
        console.error("[runAudit] network", { url, attempt, message });
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
  result?: AuditResponse;
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
