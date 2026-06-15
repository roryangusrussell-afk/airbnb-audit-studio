import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AuditError,
  captureLead,
  createCheckout,
  fetchFixPlan,
  peekListing,
  redeemRef,
  runAudit,
  verifyCheckout,
} from "@/lib/api";
import type { PeekData } from "@/lib/api";
import { trackLead, trackPurchase } from "@/lib/metaPixel";
import type { AuditResponse } from "@/lib/types";

export type FlowStatus = "landing" | "loading" | "results" | "error" | "paywall";
export type FixPlanTier = "single" | "portfolio";

const EMAIL_KEY = "auditEmail";
const PENDING_REF_KEY = "pendingRef";
const AUDITS_RUN_KEY = "auditsRun";
// Local unlock tracking (cosmetic gate, v1). The Stripe webhook is the durable
// record; these keep the same-browser experience consistent across refreshes.
const UNLOCKED_LISTINGS_KEY = "unlockedListings"; // { [listingId]: stripeSessionId }
const PACK_CREDITS_KEY = "fixPlanCredits"; // remaining portfolio-pack unlocks (UI count)
const PACK_SESSION_KEY = "fixPlanPackSession"; // portfolio session, reused for banked unlocks
const PENDING_UNLOCK_KEY = "pendingUnlockAudit"; // {url,data} cached before Stripe redirect
const LEAD_TRACKED_KEY = "metaLeadTracked"; // fire the Meta Lead event at most once per browser

// Map of listingId -> the Stripe session id that unlocked it. Persisted so a
// re-audit of a paid listing can re-fetch its (now freshly generated) fixes
// server-side. Tolerates the legacy string[] format from before the seal gate.
function readUnlocks(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const v = JSON.parse(localStorage.getItem(UNLOCKED_LISTINGS_KEY) || "{}");
    if (Array.isArray(v)) return Object.fromEntries(v.map((id) => [String(id), ""]));
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function getUnlockSession(id?: string): string | undefined {
  if (!id) return undefined;
  const m = readUnlocks();
  return Object.prototype.hasOwnProperty.call(m, id) ? m[id] : undefined;
}

function markListingUnlocked(id?: string, sessionId = ""): void {
  if (!id || typeof window === "undefined") return;
  const m = readUnlocks();
  m[id] = sessionId || m[id] || "";
  localStorage.setItem(UNLOCKED_LISTINGS_KEY, JSON.stringify(m));
}

function readPackCredits(): number {
  if (typeof window === "undefined") return 0;
  const n = parseInt(localStorage.getItem(PACK_CREDITS_KEY) || "0", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function writePackCredits(n: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PACK_CREDITS_KEY, String(Math.max(0, n)));
}

export function useAuditFlow() {
  const [status, setStatus] = useState<FlowStatus>("landing");
  const [url, setUrl] = useState("");
  const [email, setEmailState] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem(EMAIL_KEY) ?? "" : "",
  );
  const [data, setData] = useState<AuditResponse | null>(null);
  const [peekData, setPeekData] = useState<PeekData | null>(null);
  const [error, setError] = useState<string>("");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [needsEmail, setNeedsEmail] = useState(false);
  const [creditGateOpen, setCreditGateOpen] = useState(false);
  // Drives the locked vs full report for the current listing. Set by performAudit
  // (already unlocked?), the checkout return, or the ?unlock=1 dev override.
  const [unlocked, setUnlocked] = useState(false);
  // Remaining portfolio-pack unlocks the buyer can spend on other listings.
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const completedCountRef = useRef(0);
  const pendingUrlRef = useRef<string>("");
  // Forces unlocked regardless of listing; set by the ?unlock= dev/demo override.
  const devUnlockRef = useRef(false);
  // Dev/demo unlock key passed as ?unlock=<DEV_UNLOCK_SECRET>; sent to fix-plan
  // so demos can open sealed fixes without paying.
  const devKeyRef = useRef<string>("");
  // True while we're fetching the paid fixes after a confirmed unlock.
  const [fixesLoading, setFixesLoading] = useState(false);

  // Unlock a listing by fetching its paid fixes from the server (which verifies
  // payment) and merging them into the report. `auth` is a paid Stripe session
  // or a dev key. When the backend seal is off, fixes arrive in the clear and we
  // just flip the flag. Returns true on success.
  const unlockListingWithFixes = useCallback(
    async (
      targetData: AuditResponse,
      auth: { sessionId?: string; devKey?: string },
    ): Promise<boolean> => {
      if (!targetData) return false;
      // Sealing disabled on the backend: fixes are already present in the clear.
      if (targetData.fixes) {
        if (auth.sessionId) markListingUnlocked(targetData.listingId, auth.sessionId);
        setUnlocked(true);
        return true;
      }
      if (!targetData.fixesSealed) return false;
      setFixesLoading(true);
      try {
        const fp = await fetchFixPlan({
          fixesSealed: targetData.fixesSealed,
          sessionId: auth.sessionId,
          devKey: auth.devKey,
        });
        if (fp && (fp.fixes || fp.rewrites)) {
          setData((prev) => {
            const base = prev && prev.listingId === targetData.listingId ? prev : targetData;
            return {
              ...base,
              fixes: fp.fixes ?? base.fixes,
              rewrites: fp.rewrites ?? base.rewrites,
            };
          });
          if (auth.sessionId) markListingUnlocked(targetData.listingId, auth.sessionId);
          setUnlocked(true);
          return true;
        }
        toast.error(
          "We couldn't load your fixes. If you were charged, email rory@santacatarinacollection.com and I'll sort it straight away.",
        );
        return false;
      } finally {
        setFixesLoading(false);
      }
    },
    [],
  );

  // First load: capture ?ref=, honour ?unlock=, restore pack credits, and
  // handle the Stripe success return (?fixplan=success&session_id=...).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const ref = params.get("ref");
    if (ref) localStorage.setItem(PENDING_REF_KEY, ref);

    const unlockParam = params.get("unlock");
    if (unlockParam) {
      // Dev/demo override. ?unlock=1 is the legacy local form (works only when
      // the backend seal is off). ?unlock=<DEV_UNLOCK_SECRET> opens sealed fixes
      // for demos by passing the key through to fix-plan once an audit runs.
      devUnlockRef.current = true;
      if (unlockParam !== "1") devKeyRef.current = unlockParam;
    }

    setCreditsRemaining(readPackCredits());

    if (params.get("fixplan") === "success") {
      const sessionId = params.get("session_id") || "";
      (async () => {
        // Restore the cached report (locked) so the buyer always lands on it.
        let cached: { url?: string; data?: AuditResponse } | null = null;
        try {
          const raw = localStorage.getItem(PENDING_UNLOCK_KEY);
          cached = raw ? JSON.parse(raw) : null;
        } catch {
          cached = null;
        }
        if (cached?.data) {
          setData(cached.data);
          setUrl(cached.url || "");
          pendingUrlRef.current = cached.url || "";
          setStatus("results");
        }

        if (sessionId) {
          const v = await verifyCheckout(sessionId);
          if (v?.paid) {
            if (v.email) {
              setEmailState(v.email);
              localStorage.setItem(EMAIL_KEY, v.email);
            }
            // Portfolio pack: bank the unlocks beyond the one just used, and
            // remember the session so banked unlocks on other listings can be
            // verified server-side.
            const granted =
              typeof v.credits === "number" && v.credits > 0
                ? v.credits
                : v.plan === "portfolio"
                ? 10
                : 1;
            if (v.plan === "portfolio" || granted > 1) {
              localStorage.setItem(PACK_SESSION_KEY, sessionId);
            }
            if (granted > 1) {
              const remaining = readPackCredits() + (granted - 1);
              writePackCredits(remaining);
              setCreditsRemaining(remaining);
            }
            localStorage.removeItem(PENDING_UNLOCK_KEY);

            // Fetch the now-paid fixes and merge them in, recording the session
            // against the listing so a later re-audit can re-fetch. If
            // localStorage was cleared mid-checkout there's no sealed blob to
            // open, so just mark it paid; re-running the audit will unlock it.
            if (cached?.data) {
              await unlockListingWithFixes(cached.data, { sessionId });
            } else {
              markListingUnlocked(v.listingId, sessionId);
            }

            // Fire the Meta Purchase event with the real amount + currency from
            // the verified Stripe session. amountTotal is in minor units (cents),
            // Meta expects major units. eventID = the Stripe session id, so a
            // refresh (params are stripped below) or a future server-side CAPI
            // event dedupes to a single purchase. Falls back to the list price
            // only if Stripe somehow returned no amount.
            const value =
              typeof v.amountTotal === "number" && v.amountTotal > 0
                ? v.amountTotal / 100
                : v.plan === "portfolio"
                ? 79
                : 19;
            trackPurchase({
              value,
              currency: v.currency || "USD",
              eventID: sessionId,
            });
          }
        }

        // Strip the success params so a refresh doesn't reprocess them.
        const clean = new URL(window.location.href);
        clean.searchParams.delete("fixplan");
        clean.searchParams.delete("session_id");
        window.history.replaceState({}, "", clean.toString());
      })();
    }
  }, [unlockListingWithFixes]);

  const startCheckout = useCallback(
    async (tier: FixPlanTier) => {
      if (typeof window === "undefined") return;
      // Preserve the current report so we can restore and unlock it on return.
      if (data) {
        try {
          localStorage.setItem(
            PENDING_UNLOCK_KEY,
            JSON.stringify({ url: pendingUrlRef.current || url, data }),
          );
        } catch {
          // localStorage quota; the report will simply re-run if needed.
        }
      }
      const checkout = await createCheckout({ plan: tier, listingId: data?.listingId });
      if (checkout?.url) {
        window.location.href = checkout.url;
      } else {
        console.error("[startCheckout] could not create checkout session");
      }
    },
    [data, url],
  );

  // Spend a banked portfolio-pack unlock on the current listing. The pack's
  // Stripe session is the credential: fix-plan verifies it and enforces the
  // 10-listing cap server-side, so this can't be forged from localStorage.
  const useFixPlanCredit = useCallback(async () => {
    if (!data?.listingId) return;
    const packSession =
      typeof window !== "undefined" ? localStorage.getItem(PACK_SESSION_KEY) : null;
    if (!packSession) {
      toast.error(
        "We couldn't find your portfolio pack on this device. Reopen your purchase confirmation, or email rory@santacatarinacollection.com.",
      );
      return;
    }
    const ok = await unlockListingWithFixes(data, { sessionId: packSession });
    if (ok) {
      const remaining = Math.max(0, creditsRemaining - 1);
      writePackCredits(remaining);
      setCreditsRemaining(remaining);
    }
  }, [creditsRemaining, data, unlockListingWithFixes]);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(EMAIL_KEY, value);
    }
  }, []);

  const performAudit = useCallback(
    async (auditUrl: string, withEmail: string) => {
      setStatus("loading");
      setError("");
      setErrorDetail("");
      setPeekData(null);
      peekListing(auditUrl).then(d => { if (d) setPeekData(d); });
      try {
        const result = await runAudit(auditUrl);
        setData(result);
        setUnlocked(false);
        setStatus("results");
        // Decide unlock. Cleartext fixes (seal off): unlock if dev or already
        // paid. Sealed: re-fetch the paid fixes using the dev key or the stored
        // session for this listing (covers the free re-audit of a paid listing).
        const unlockSession = getUnlockSession(result.listingId);
        if (result.fixes) {
          setUnlocked(devUnlockRef.current || unlockSession !== undefined);
        } else if (devUnlockRef.current) {
          void unlockListingWithFixes(result, { devKey: devKeyRef.current });
        } else if (unlockSession) {
          void unlockListingWithFixes(result, { sessionId: unlockSession });
        }
        completedCountRef.current += 1;

        if (typeof window !== "undefined") {
          const prev = parseInt(localStorage.getItem(AUDITS_RUN_KEY) || "0", 10) || 0;
          localStorage.setItem(AUDITS_RUN_KEY, String(prev + 1));
        }

        // Log to Sheet only if we already have an email. Without one,
        // ResultsScreen renders the GatePanel which calls submitEmail.
        if (withEmail) {
          captureLead({
            email: withEmail,
            url: auditUrl,
            listingId: result.listingId,
            title: result.title,
            score: result.score,
            rating: result.rating ?? null,
            reviewCount: result.reviewCount ?? null,
            result,
          });
        } else {
          pendingUrlRef.current = auditUrl;
        }

        // Redeem pending referral after first successful audit
        if (typeof window !== "undefined") {
          const pendingRef = localStorage.getItem(PENDING_REF_KEY);
          if (pendingRef && completedCountRef.current === 1 && withEmail) {
            redeemRef(withEmail, pendingRef);
            localStorage.removeItem(PENDING_REF_KEY);
          }
        }
      } catch (err) {
        const msg =
          err instanceof AuditError
            ? err.message
            : "Something went wrong. Please try again.";
        const detail =
          err instanceof AuditError && err.detail
            ? `${err.status ?? "?"}: ${err.detail}`
            : "";
        setError(msg);
        setErrorDetail(detail);
        setStatus("error");
      }
    },
    [unlockListingWithFixes],
  );

  const submitUrl = useCallback(
    async (auditUrl: string) => {
      setUrl(auditUrl);
      pendingUrlRef.current = auditUrl;

      const storedEmail =
        typeof window !== "undefined" ? localStorage.getItem(EMAIL_KEY) : "";

      // The audit is always free. Monetisation now happens at the fix reveal
      // (LockedReport / FixPlanUnlock), not by gating repeat audits. Every
      // submission runs the audit and lands on the locked report.
      await performAudit(auditUrl, storedEmail || "");
    },
    [performAudit],
  );

  const submitEmail = useCallback(
    async (
      value: string | { email: string; marketingOptIn?: boolean; consentText?: string; consentSource?: string },
    ) => {
      const payload =
        typeof value === "string"
          ? { email: value, marketingOptIn: false, consentText: undefined, consentSource: undefined }
          : { email: value.email, marketingOptIn: !!value.marketingOptIn, consentText: value.consentText, consentSource: value.consentSource };
      setEmail(payload.email);
      setNeedsEmail(false);
      // Email collected post-audit. Log to Sheet + trigger report email.
      const target = pendingUrlRef.current || url;
      if (data && target) {
        captureLead({
          email: payload.email,
          url: target,
          listingId: data.listingId,
          title: data.title,
          score: data.score,
          rating: data.rating ?? null,
          reviewCount: data.reviewCount ?? null,
          result: data,
          marketingOptIn: payload.marketingOptIn,
          consentTimestamp: new Date().toISOString(),
          consentText: payload.consentText,
          source: payload.consentSource ?? "gate_panel",
        });

        // Signup complete: fire the Meta Lead event once per browser. The gate
        // only shows when no email is stored, so this is the new-lead moment;
        // returning visitors with a stored email never reach here.
        if (typeof window !== "undefined" && !localStorage.getItem(LEAD_TRACKED_KEY)) {
          trackLead({ content_name: "free_audit_email_capture" });
          localStorage.setItem(LEAD_TRACKED_KEY, "1");
        }
      }
    },
    [data, setEmail, url],
  );

  const reset = useCallback(() => {
    setStatus("landing");
    setData(null);
    setError("");
    setErrorDetail("");
    setUrl("");
    setPeekData(null);
    setUnlocked(devUnlockRef.current);
    setFixesLoading(false);
    pendingUrlRef.current = "";
  }, []);

  const retry = useCallback(async () => {
    if (pendingUrlRef.current && email) {
      await performAudit(pendingUrlRef.current, email);
    } else {
      reset();
    }
  }, [email, performAudit, reset]);

  return {
    status,
    url,
    email,
    data,
    peekData,
    error,
    errorDetail,
    needsEmail,
    creditGateOpen,
    unlocked,
    fixesLoading,
    creditsRemaining,
    submitUrl,
    submitEmail,
    startCheckout,
    useFixPlanCredit,
    reset,
    retry,
    closeCreditGate: () => setCreditGateOpen(false),
    setNeedsEmail,
  };
}
