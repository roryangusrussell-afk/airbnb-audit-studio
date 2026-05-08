import { useCallback, useEffect, useRef, useState } from "react";
import { AuditError, captureLead, checkCredits, peekListing, redeemRef, runAudit, useCredit } from "@/lib/api";
import type { PeekData } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";

export type FlowStatus = "landing" | "loading" | "results" | "error";

const EMAIL_KEY = "auditEmail";
const PENDING_REF_KEY = "pendingRef";
const AUDITS_RUN_KEY = "auditsRun";
const FREE_AUDIT_LIMIT = 5;

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
  const completedCountRef = useRef(0);
  const pendingUrlRef = useRef<string>("");

  // Capture ?ref= on first load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(PENDING_REF_KEY, ref);
    }
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

        // Persist audit count so refreshes can't reset the cap
        if (typeof window !== "undefined") {
          const prev = parseInt(localStorage.getItem(AUDITS_RUN_KEY) || "0", 10) || 0;
          localStorage.setItem(AUDITS_RUN_KEY, String(prev + 1));
        }

        // Log every audit's email + listing context to the Sheet (only if we
        // already have an email — otherwise the post-audit modal will fire
        // and capture there).
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
          // No email yet — show the post-audit save-to-inbox modal
          pendingUrlRef.current = auditUrl;
          setNeedsEmail(true);
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
    [],
  );

  const submitUrl = useCallback(
    async (auditUrl: string) => {
      setUrl(auditUrl);
      pendingUrlRef.current = auditUrl;

      const storedEmail =
        typeof window !== "undefined" ? localStorage.getItem(EMAIL_KEY) : "";

      // Credit gate disabled until Stripe is wired. Counter still increments
      // (line ~60) so the gate can be re-enabled later.
      await performAudit(auditUrl, storedEmail || "");
    },
    [performAudit],
  );

  const submitEmail = useCallback(
    async (value: string) => {
      setEmail(value);
      setNeedsEmail(false);
      // Email collected post-audit — log to Sheet + send report email to the tester
      const target = pendingUrlRef.current || url;
      if (data && target) {
        captureLead({
          email: value,
          url: target,
          listingId: data.listingId,
          title: data.title,
          score: data.score,
          rating: data.rating ?? null,
          reviewCount: data.reviewCount ?? null,
          result: data,
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
    submitUrl,
    submitEmail,
    reset,
    retry,
    closeCreditGate: () => setCreditGateOpen(false),
    setNeedsEmail,
  };
}
