import type { AuditResponse } from "./types";

const BASE = "https://airbnb-audit-rho.vercel.app";

// Optional shared secret for the backend's X-Audit-Token gate. Set
// VITE_AUDIT_TOKEN at build time and the backend's AUDIT_FRONTEND_TOKEN env
// var to the same value. Leaving both unset preserves the previous unauthed
// behaviour, but the production backend will reject requests once
// AUDIT_FRONTEND_TOKEN is configured. The value is bundled into the JS so
// it's not a real auth boundary; treat it as a rotatable speed bump that
// stops the casual curl abuse path.
const AUDIT_TOKEN: string | undefined = (import.meta as { env?: Record<string, string> }).env?.VITE_AUDIT_TOKEN;

function authHeaders(extra: Record<string, string> = {}): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(AUDIT_TOKEN ? { "X-Audit-Token": AUDIT_TOKEN } : {}),
    ...extra,
  };
}

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
        headers: authHeaders(),
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // Pre-streaming responses (URL validation, method-not-allowed, rate
      // limit, forbidden) come back with non-200 HTTP status. The streaming
      // /api/audit path always returns 200 and encodes status in the body
      // via { ok, status, error } so Safari doesn't kill long fetches.
      if (res.status === 429) {
        const detail = await readBodySnippet(res);
        const err = new AuditError(detail || "You're going too fast. Please wait a moment.", 429, detail);
        console.error("[runAudit] 429", { url, attempt, detail });
        throw err;
      }
      if (res.status === 403) {
        const err = new AuditError("Audit service is unavailable from this site.", 403);
        console.error("[runAudit] 403", { url, attempt });
        throw err;
      }
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
    const res = await fetch(`${BASE}/api/peek?id=${idMatch[1]}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    return (await res.json()) as PeekData;
  } catch {
    return null;
  }
}

// Best-effort POST. Logs failures to the console rather than swallowing
// silently, but never throws — these are non-blocking side effects from the
// caller's perspective.
async function postBestEffort(path: string, body: unknown, label: string): Promise<void> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await readBodySnippet(res);
      console.warn(`[${label}] non-OK`, { status: res.status, detail });
    }
  } catch (err) {
    console.warn(`[${label}] failed`, (err as Error)?.message);
  }
}

export async function sendReport(payload: {
  email: string;
  listingId: string;
  score: number;
  title: string;
}): Promise<void> {
  await postBestEffort("/api/send-report", payload, "sendReport");
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
  marketingOptIn?: boolean;
  consentTimestamp?: string;
  source?: string;
}): Promise<void> {
  await postBestEffort("/api/capture-lead", payload, "captureLead");
}

export async function redeemRef(email: string, refCode: string): Promise<void> {
  // Backend now expects the field name `refereeEmail` so it can apply the
  // self-referral guard. Keep the call signature stable for callers.
  await postBestEffort("/api/redeem-ref", { refereeEmail: email, refCode }, "redeemRef");
}

export async function checkCredits(
  identity: { refCode: string } | { email: string },
): Promise<number> {
  const param = "refCode" in identity
    ? `refCode=${encodeURIComponent(identity.refCode)}`
    : `email=${encodeURIComponent(identity.email)}`;
  try {
    const res = await fetch(`${BASE}/api/check-credits?${param}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { credits?: number };
    return data.credits ?? 0;
  } catch {
    return 0;
  }
}

export async function useCredit(
  identity: { refCode: string } | { email: string },
): Promise<{ ok: boolean; remaining?: number }> {
  try {
    const res = await fetch(`${BASE}/api/use-credit`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(identity),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { ok?: boolean; remaining?: number };
    return { ok: !!data.ok, remaining: data.remaining };
  } catch {
    return { ok: false };
  }
}

export async function submitFeedback(payload: {
  listingId: string;
  rating: string;
  comment?: string;
  email?: string;
  url?: string;
}): Promise<void> {
  await postBestEffort("/api/feedback", payload, "submitFeedback");
}
