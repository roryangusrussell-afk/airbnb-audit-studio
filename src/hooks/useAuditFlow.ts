import { useCallback, useEffect, useRef, useState } from "react";
import {
  AuditError,
  captureLead,
  checkCredits,
  peekListing,
  redeemRef,
  runAudit,
  useCredit as consumeCredit,
} from "@/lib/api";
import type { PeekData } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";

export type FlowStatus = "landing" | "loading" | "results" | "error" | "paywall";
export type FixPlanTier = "single" | "portfolio";

const EMAIL_KEY = "auditEmail";
const PENDING_REF_KEY = "pendingRef";
const AUDITS_RUN_KEY = "auditsRun";
const FREE_AUDIT_USED_KEY = "freeAuditUsed";

// Stripe Payment Links. PLACEHOLDERS for now: these are the old EUR links.
// Phase 2 replaces them with the USD one-time products ($19 single / $49
// portfolio) and wires the webhook so payment unlocks the report automatically.
// See PAYWALL_REDESIGN.md.
const STRIPE_CHECKOUT_URLS: Record<FixPlanTier, string> = {
  single: "https://buy.stripe.com/14AeVfamFg2KbVQgGVaMU00",
  portfolio: "https://buy.stripe.com/bJe3cx1Q94k22lgbmBaMU01",
};

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
  // Drives the locked vs full report. Defaults locked; flipped by a successful
  // unlock (Phase 2 webhook) or the ?unlock=1 dev/demo override below.
  const [unlocked, setUnlocked] = useState(false);
  const completedCountRef = useRef(0);
  const pendingUrlRef = useRef<string>("");
  // Set when the current audit is consuming a paid credit (audit 2+ after free).
  // Drives the post-success useCredit decrement.
  const consumingCreditRef = useRef(false);

  // Capture ?ref= and ?unlock= on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(PENDING_REF_KEY, ref);
    }
    if (params.get("unlock") === "1") {
      setUnlocked(true);
    }
  }, []);

  const startCheckout = useCallback((tier: FixPlanTier) => {
    if (typeof window === "undefined") return;
    window.open(STRIPE_CHECKOUT_URLS[tier], "_blank", "noopener,noreferrer");
  }, []);

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
        setStatus("results");
        completedCountRef.current += 1;

        if (typeof window !== "undefined") {
          const prev = parseInt(localStorage.getItem(AUDITS_RUN_KEY) || "0", 10) || 0;
          localStorage.setItem(AUDITS_RUN_KEY, String(prev + 1));
          // First successful audit consumes the free allowance for this browser.
          // From here on, audit 2+ requires a credit on the email.
          localStorage.setItem(FREE_AUDIT_USED_KEY, "1");
        }

        // If this audit consumed a paid credit, decrement the ledger now that
        // we know the audit succeeded.
        if (consumingCreditRef.current && withEmail) {
          consumingCreditRef.current = false;
          consumeCredit({ email: withEmail }).catch(() => {});
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
        // Reset the consuming flag so a failed audit doesn't burn the credit
        // on retry, since useCredit was never called.
        consumingCreditRef.current = false;
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
    [],
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
    consumingCreditRef.current = false;
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
    submitUrl,
    submitEmail,
    startCheckout,
    reset,
    retry,
    closeCreditGate: () => setCreditGateOpen(false),
    setNeedsEmail,
  };
}
