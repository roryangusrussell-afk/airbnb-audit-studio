import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AuditError, runAudit, peekListing, checkCredits, sendReport, captureLead, redeemRef, useCredit, submitFeedback } from "./api";
import type { AuditResponse } from "./types";

const URL = "https://www.airbnb.com/rooms/12345";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function emptyResponse(status: number): Response {
  return new Response("", { status });
}

describe("runAudit", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on a 200 response and does not retry", async () => {
    const payload = { score: 80, title: "X" } as unknown as AuditResponse;
    fetchMock.mockResolvedValueOnce(jsonResponse(payload));

    const result = await runAudit(URL);

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/audit");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ url: URL });
  });

  it("throws an AuditError with the not-found copy on 422 (no retry)", async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(422));

    await expect(runAudit(URL)).rejects.toMatchObject({
      name: "Error",
      status: 422,
      message: expect.stringContaining("could not be found"),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws on other 4xx without retrying", async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(400));

    await expect(runAudit(URL)).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining("Audit failed (400)"),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries once on 5xx and returns the second response if it succeeds", async () => {
    const payload = { score: 60 } as unknown as AuditResponse;
    fetchMock
      .mockResolvedValueOnce(emptyResponse(500))
      .mockResolvedValueOnce(jsonResponse(payload));

    const promise = runAudit(URL);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(promise).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries once on 5xx and surfaces an AuditError if the retry also fails", async () => {
    fetchMock
      .mockResolvedValueOnce(emptyResponse(500))
      .mockResolvedValueOnce(emptyResponse(503));

    const promise = runAudit(URL);
    const assertion = expect(promise).rejects.toMatchObject({
      status: 503,
    });
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries once on a network error and returns the retry response", async () => {
    const payload = { score: 65 } as unknown as AuditResponse;
    fetchMock
      .mockRejectedValueOnce(new TypeError("Network is down"))
      .mockResolvedValueOnce(jsonResponse(payload));

    const promise = runAudit(URL);
    await vi.advanceTimersByTimeAsync(2000);
    await expect(promise).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws a 'could not reach' error when both attempts are network errors", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Network down"))
      .mockRejectedValueOnce(new TypeError("Still down"));

    const promise = runAudit(URL);
    const assertion = expect(promise).rejects.toMatchObject({
      message: expect.stringContaining("Could not reach"),
    });
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws the timeout message on AbortError without retrying", async () => {
    const abortErr = new Error("aborted");
    abortErr.name = "AbortError";
    fetchMock.mockRejectedValueOnce(abortErr);

    await expect(runAudit(URL)).rejects.toMatchObject({
      message: expect.stringContaining("taking longer than expected"),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("peekListing", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("extracts the listing id from the URL and returns the parsed peek payload", async () => {
    const payload = { imageUrl: "x", title: "T", rating: "4.9", reviewCount: 10, host: "Y" };
    fetchMock.mockResolvedValueOnce(jsonResponse(payload));

    const result = await peekListing("https://www.airbnb.com/rooms/12345?adults=2");

    expect(result).toEqual(payload);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/peek?id=12345");
  });

  it("returns null when the URL has no /rooms/<id>", async () => {
    const result = await peekListing("https://www.airbnb.com/");
    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null on non-OK responses", async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(500));
    expect(await peekListing(URL)).toBeNull();
  });

  it("returns null on network errors", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("network"));
    expect(await peekListing(URL)).toBeNull();
  });
});

describe("checkCredits", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("URL-encodes the email and returns the credit count", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ credits: 3 }));
    const result = await checkCredits("a+b@example.com");
    expect(result).toBe(3);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("email=a%2Bb%40example.com");
  });

  it("returns 0 when credits is missing from the payload", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}));
    expect(await checkCredits("a@b.com")).toBe(0);
  });

  it("returns 0 on non-OK responses", async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(500));
    expect(await checkCredits("a@b.com")).toBe(0);
  });

  it("returns 0 on network errors", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("network"));
    expect(await checkCredits("a@b.com")).toBe(0);
  });
});

describe("fire-and-forget endpoints", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sendReport posts to /api/send-report with the payload", async () => {
    await sendReport({ email: "a@b.com", listingId: "1", score: 80, title: "T" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/send-report");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com", listingId: "1", score: 80, title: "T" });
  });

  it("captureLead posts to /api/capture-lead", async () => {
    await captureLead({ email: "a@b.com", url: URL });
    expect(fetchMock.mock.calls[0][0]).toContain("/api/capture-lead");
  });

  it("redeemRef posts to /api/redeem-ref with email + refCode", async () => {
    await redeemRef("a@b.com", "REF1");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/redeem-ref");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com", refCode: "REF1" });
  });

  it("useCredit posts to /api/use-credit", async () => {
    await useCredit("a@b.com");
    expect(fetchMock.mock.calls[0][0]).toContain("/api/use-credit");
  });

  it("submitFeedback posts to /api/feedback", async () => {
    await submitFeedback({ listingId: "1", rating: "good" });
    expect(fetchMock.mock.calls[0][0]).toContain("/api/feedback");
  });

  it("swallows network errors silently", async () => {
    fetchMock.mockReset().mockRejectedValue(new TypeError("network"));
    await expect(sendReport({ email: "a@b.com", listingId: "1", score: 80, title: "T" })).resolves.toBeUndefined();
    await expect(captureLead({ email: "a@b.com", url: URL })).resolves.toBeUndefined();
    await expect(redeemRef("a@b.com", "REF1")).resolves.toBeUndefined();
    await expect(useCredit("a@b.com")).resolves.toBeUndefined();
    await expect(submitFeedback({ listingId: "1", rating: "good" })).resolves.toBeUndefined();
  });
});
