import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { AuditResponse } from "@/lib/types";

const runAudit = vi.fn();
const peekListing = vi.fn();
const captureLead = vi.fn();
const redeemRef = vi.fn();
const checkCredits = vi.fn();
const useCreditFn = vi.fn();

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    runAudit: (...args: Parameters<typeof actual.runAudit>) => runAudit(...args),
    peekListing: (...args: Parameters<typeof actual.peekListing>) => peekListing(...args),
    captureLead: (...args: Parameters<typeof actual.captureLead>) => captureLead(...args),
    redeemRef: (...args: Parameters<typeof actual.redeemRef>) => redeemRef(...args),
    checkCredits: (...args: Parameters<typeof actual.checkCredits>) => checkCredits(...args),
    useCredit: (...args: Parameters<typeof actual.useCredit>) => useCreditFn(...args),
  };
});

import { useAuditFlow } from "./useAuditFlow";
import { AuditError } from "@/lib/api";

const URL = "https://www.airbnb.com/rooms/12345";

const sampleResponse: AuditResponse = {
  score: 80,
  verdict: "Strong",
  title: "Cozy loft",
  location: "Berlin",
  overview: "",
  description: "",
  amenities: [],
  photoCount: 0,
  photoAnalysis: {
    verdict: "",
    technicalScore: 0,
    aestheticScore: 0,
    score: 0,
    signals: [],
    missingRooms: [],
  },
  cats: [],
  checks: [],
  issues: [],
  fixes: [],
  wins: [],
  advisoryNotes: [],
  categoryRatings: [],
  bottomTenRisk: false,
  hostResponseRatio: 1,
  listingId: "12345",
  rating: 4.9,
  reviewCount: 200,
};

function setLocation({ hostname = "example.com", search = "" } = {}) {
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { hostname, search, origin: `https://${hostname}` } as unknown as Location,
  });
}

describe("useAuditFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Default: a real-world hostname so the free-audit cap is enforced
    setLocation();
    peekListing.mockResolvedValue(null);
    runAudit.mockResolvedValue(sampleResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("starts in the landing state with no data and no error", () => {
    const { result } = renderHook(() => useAuditFlow());
    expect(result.current.status).toBe("landing");
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.needsEmail).toBe(false);
    expect(result.current.creditGateOpen).toBe(false);
  });

  it("loads a previously stored email from localStorage", () => {
    localStorage.setItem("auditEmail", "saved@host.com");
    const { result } = renderHook(() => useAuditFlow());
    expect(result.current.email).toBe("saved@host.com");
  });

  it("captures ?ref= from the URL into localStorage on mount", () => {
    setLocation({ search: "?ref=ABC123" });
    renderHook(() => useAuditFlow());
    expect(localStorage.getItem("pendingRef")).toBe("ABC123");
  });

  it("runs an audit, transitions through loading → results, and persists the run count", async () => {
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.status).toBe("results");
    expect(result.current.data).toEqual(sampleResponse);
    expect(localStorage.getItem("auditsRun")).toBe("1");
    expect(runAudit).toHaveBeenCalledWith(URL);
  });

  it("logs the lead immediately when an email is already stored", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(captureLead).toHaveBeenCalledTimes(1);
    expect(captureLead.mock.calls[0][0]).toMatchObject({
      email: "host@example.com",
      url: URL,
      listingId: "12345",
      score: 80,
    });
    expect(result.current.needsEmail).toBe(false);
  });

  it("does not auto-open the email modal when no email is stored (ResultsScreen fires it on scroll)", async () => {
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.needsEmail).toBe(false);
    expect(captureLead).not.toHaveBeenCalled();
  });

  it("logs the lead and clears the modal flag when the user submits an email", async () => {
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    act(() => {
      result.current.setNeedsEmail(true);
    });
    expect(result.current.needsEmail).toBe(true);

    await act(async () => {
      await result.current.submitEmail("late@host.com");
    });

    expect(result.current.email).toBe("late@host.com");
    expect(localStorage.getItem("auditEmail")).toBe("late@host.com");
    expect(result.current.needsEmail).toBe(false);
    expect(captureLead).toHaveBeenCalledTimes(1);
    expect(captureLead.mock.calls[0][0]).toMatchObject({
      email: "late@host.com",
      url: URL,
      listingId: "12345",
    });
  });

  it("redeems a pending referral on the first audit when an email is set", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    localStorage.setItem("pendingRef", "REF1");

    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(redeemRef).toHaveBeenCalledWith("host@example.com", "REF1");
    expect(localStorage.getItem("pendingRef")).toBeNull();
  });

  it("does not redeem the referral on a second audit", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    localStorage.setItem("pendingRef", "REF1");

    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(redeemRef).toHaveBeenCalledTimes(1);

    // Re-add the pendingRef artificially: even so, the hook only redeems on the
    // first completed audit of the session.
    localStorage.setItem("pendingRef", "REF2");
    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(redeemRef).toHaveBeenCalledTimes(1);
  });

  it("runs the audit even after a prior free audit (no repeat-audit paywall; fixes are gated instead)", async () => {
    localStorage.setItem("freeAuditUsed", "1");
    localStorage.setItem("auditEmail", "host@example.com");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.status).toBe("results");
    expect(runAudit).toHaveBeenCalledTimes(1);
  });

  it("defaults to locked, and the ?unlock=1 dev override unlocks the report once it loads", async () => {
    const lockedHook = renderHook(() => useAuditFlow());
    expect(lockedHook.result.current.unlocked).toBe(false);

    // The dev override no longer flips unlocked on an empty mount: there is no
    // report to unlock yet. It applies once an audit loads (cleartext fixes
    // here, since the seal is a backend concern not exercised in this mock).
    setLocation({ hostname: "example.com", search: "?unlock=1" });
    const { result } = renderHook(() => useAuditFlow());
    expect(result.current.unlocked).toBe(false);

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(result.current.unlocked).toBe(true);
  });

  it("bypasses the cap on localhost", async () => {
    setLocation({ hostname: "localhost" });
    localStorage.setItem("auditsRun", "50");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.creditGateOpen).toBe(false);
    expect(runAudit).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("results");
  });

  it("bypasses the cap when ?dev=1 is in the URL", async () => {
    setLocation({ hostname: "example.com", search: "?dev=1" });
    localStorage.setItem("auditsRun", "50");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.creditGateOpen).toBe(false);
    expect(runAudit).toHaveBeenCalledTimes(1);
  });

  it("transitions to error state with the AuditError message when the API throws", async () => {
    runAudit.mockRejectedValueOnce(new AuditError("Listing not found", 422));
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("Listing not found");
  });

  it("uses a generic message for unknown errors", async () => {
    runAudit.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toContain("Something went wrong");
  });

  it("retry replays the last URL when an email is present", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    runAudit.mockRejectedValueOnce(new AuditError("server", 500));
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(result.current.status).toBe("error");

    runAudit.mockResolvedValueOnce(sampleResponse);
    await act(async () => {
      await result.current.retry();
    });

    expect(runAudit).toHaveBeenCalledTimes(2);
    expect(runAudit).toHaveBeenLastCalledWith(URL);
    expect(result.current.status).toBe("results");
  });

  it("retry resets to landing when no email is stored", async () => {
    runAudit.mockRejectedValueOnce(new AuditError("server", 500));
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(result.current.status).toBe("error");

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe("landing");
    expect(runAudit).toHaveBeenCalledTimes(1);
  });

  it("reset clears data and returns to the landing screen", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(result.current.status).toBe("results");

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe("landing");
    expect(result.current.data).toBeNull();
    expect(result.current.url).toBe("");
    expect(result.current.error).toBe("");
  });

  it("populates peekData when peekListing resolves", async () => {
    const peek = { imageUrl: "x", title: "T", rating: "4.9", reviewCount: 100, host: "Y" };
    peekListing.mockResolvedValueOnce(peek);
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });

    await waitFor(() => expect(result.current.peekData).toEqual(peek));
  });

  it("reset returns to landing after a completed audit", async () => {
    localStorage.setItem("auditEmail", "host@example.com");
    const { result } = renderHook(() => useAuditFlow());

    await act(async () => {
      await result.current.submitUrl(URL);
    });
    expect(result.current.status).toBe("results");

    act(() => result.current.reset());
    expect(result.current.status).toBe("landing");
  });
});
