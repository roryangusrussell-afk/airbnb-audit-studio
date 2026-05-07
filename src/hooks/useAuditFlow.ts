import { useCallback, useEffect, useRef, useState } from "react";
import { AuditError, checkCredits, peekListing, redeemRef, runAudit, useCredit } from "@/lib/api";
import type { PeekData } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";

export type FlowStatus = "landing" | "loading" | "results" | "error";

const EMAIL_KEY = "auditEmail";
const PENDING_REF_KEY = "pendingRef";

export function useAuditFlow() {
  const [status, setStatus] = useState<FlowStatus>("landing");
  const [url, setUrl] = useState("");
  const [email, setEmailState] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem(EMAIL_KEY) ?? "" : "",
  );
  const [data, setData] = useState<AuditResponse | null>(null);
  const [peekData, setPeekData] = useState<PeekData | null>(null);
  const [error, setError] = useState<string>("");
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
      setPeekData(null);
      peekListing(auditUrl).then(d => { if (d) setPeekData(d); });
      try {
        const result = await runAudit(auditUrl);
        setData(result);
        setStatus("results");
        completedCountRef.current += 1;

        // Redeem pending referral after first successful audit
        if (typeof window !== "undefined") {
          const pendingRef = localStorage.getItem(PENDING_REF_KEY);
          if (pendingRef && completedCountRef.current === 1) {
            redeemRef(withEmail, pendingRef);
            localStorage.removeItem(PENDING_REF_KEY);
          }
        }
      } catch (err) {
        const msg =
          err instanceof AuditError
            ? err.message
            : "Something went wrong. Please try again.";
        setError(msg);
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

      if (!storedEmail) {
        setNeedsEmail(true);
        return;
      }

      // Subsequent audits: gate by credits
      if (completedCountRef.current >= 1) {
        const credits = await checkCredits(storedEmail);
        if (credits > 0) {
          await useCredit(storedEmail);
        } else {
          setCreditGateOpen(true);
          return;
        }
      }

      await performAudit(auditUrl, storedEmail);
    },
    [performAudit],
  );

  const submitEmail = useCallback(
    async (value: string) => {
      setEmail(value);
      setNeedsEmail(false);
      const target = pendingUrlRef.current || url;
      if (target) {
        await performAudit(target, value);
      }
    },
    [email, performAudit, setEmail, url],
  );

  const reset = useCallback(() => {
    setStatus("landing");
    setData(null);
    setError("");
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
