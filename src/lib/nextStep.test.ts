import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isPortugalListing,
  getHostListingCount,
  getOverallScore,
  getTopGap,
  getRecommendedNextStep,
  trackEvent,
} from "./nextStep";
import type { AuditResponse } from "./types";

function makeAudit(over: Partial<AuditResponse> = {}): AuditResponse {
  return {
    score: 70,
    verdict: "",
    title: "",
    location: "",
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
    listingId: "1",
    ...over,
  };
}

describe("isPortugalListing", () => {
  it("matches any Portugal token in any of the location fields", () => {
    expect(isPortugalListing({ location: "Lisbon, Portugal" })).toBe(true);
    expect(isPortugalListing({ listingLocation: "Porto" })).toBe(true);
    expect(isPortugalListing({ listingCity: "Funchal" })).toBe(true);
    expect(isPortugalListing({ listingCountry: "PORTUGAL" })).toBe(true);
    expect(isPortugalListing({ city: "Cascais" })).toBe(true);
    expect(isPortugalListing({ country: "lisboa" })).toBe(true);
  });

  it("is case-insensitive and works on substrings", () => {
    expect(isPortugalListing({ location: "Estoril Coast" })).toBe(true);
    expect(isPortugalListing({ location: "ALGARVE villa" })).toBe(true);
  });

  it("returns false for non-Portugal locations", () => {
    expect(isPortugalListing({ location: "Barcelona, Spain" })).toBe(false);
    expect(isPortugalListing({ location: "" })).toBe(false);
    expect(isPortugalListing({})).toBe(false);
  });
});

describe("getHostListingCount", () => {
  it("returns the canonical hostListingCount when valid", () => {
    expect(getHostListingCount(makeAudit({ hostListingCount: 7 }))).toBe(7);
  });

  it("falls back to hostListingsCount alias", () => {
    const audit = makeAudit() as unknown as Record<string, unknown>;
    audit.hostListingsCount = 12;
    expect(getHostListingCount(audit as AuditResponse)).toBe(12);
  });

  it("falls back to hostTotalListings alias", () => {
    const audit = makeAudit() as unknown as Record<string, unknown>;
    audit.hostTotalListings = 4;
    expect(getHostListingCount(audit as AuditResponse)).toBe(4);
  });

  it("defaults to 1 when missing or invalid", () => {
    expect(getHostListingCount(makeAudit())).toBe(1);
    expect(getHostListingCount(makeAudit({ hostListingCount: 0 }))).toBe(1);
    expect(getHostListingCount(makeAudit({ hostListingCount: -3 }))).toBe(1);
    expect(
      getHostListingCount(makeAudit({ hostListingCount: NaN as unknown as number })),
    ).toBe(1);
  });
});

describe("getOverallScore", () => {
  it("returns the score field by default", () => {
    expect(getOverallScore(makeAudit({ score: 82 }))).toBe(82);
  });

  it("falls back to overallScore alias", () => {
    const audit = makeAudit({ score: undefined as unknown as number }) as unknown as Record<
      string,
      unknown
    >;
    audit.overallScore = 55;
    expect(getOverallScore(audit as AuditResponse)).toBe(55);
  });

  it("returns 0 for missing/invalid scores", () => {
    expect(getOverallScore(makeAudit({ score: undefined as unknown as number }))).toBe(0);
    expect(getOverallScore(makeAudit({ score: NaN }))).toBe(0);
  });
});

describe("getTopGap", () => {
  it("prefers the first non-opportunity issue", () => {
    const audit = makeAudit({
      issues: [
        { rank: "1", type: "opportunity", impact: "low", title: "Add badge", problem: "", action: "" },
        { rank: "2", type: "gap", impact: "high", title: "Photos are dim", problem: "", action: "" },
      ],
    });
    expect(getTopGap(audit)).toBe("photos are dim");
  });

  it("falls back to the first issue when only opportunities exist", () => {
    const audit = makeAudit({
      issues: [
        { rank: "1", type: "opportunity", impact: "low", title: "Tweak Title", problem: "", action: "" },
      ],
    });
    expect(getTopGap(audit)).toBe("tweak Title");
  });

  it("returns null when there are no issues", () => {
    expect(getTopGap(makeAudit({ issues: [] }))).toBeNull();
  });

  it("treats issues without a type as gaps", () => {
    const audit = makeAudit({
      issues: [
        { rank: "1", impact: "high", title: "Missing parking note", problem: "", action: "" },
      ],
    });
    expect(getTopGap(audit)).toBe("missing parking note");
  });
});

describe("getRecommendedNextStep", () => {
  it("routes Portugal listings to portugal-management regardless of score", () => {
    const audit = makeAudit({ location: "Lisbon, Portugal", score: 95, hostListingCount: 25 });
    expect(getRecommendedNextStep(audit)).toBe("portugal-management");
  });

  it("routes 10+ listings to portfolio-review", () => {
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 10, score: 60 })),
    ).toBe("portfolio-review");
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 50, score: 95 })),
    ).toBe("portfolio-review");
  });

  it("routes 2–9 listings to audit-another-listing", () => {
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 2, score: 95 })),
    ).toBe("audit-another-listing");
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 9, score: 30 })),
    ).toBe("audit-another-listing");
  });

  it("routes single-listing high scorers (>=90) to ai-systems", () => {
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 90 })),
    ).toBe("ai-systems");
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 100 })),
    ).toBe("ai-systems");
  });

  it("routes single-listing solid scorers (75-89) to improve-this-listing", () => {
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 75 })),
    ).toBe("improve-this-listing");
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 89 })),
    ).toBe("improve-this-listing");
  });

  it("routes everything else to fix-this-listing", () => {
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 74 })),
    ).toBe("fix-this-listing");
    expect(
      getRecommendedNextStep(makeAudit({ hostListingCount: 1, score: 0 })),
    ).toBe("fix-this-listing");
  });

  it("returns audit-another-listing for falsy audit input", () => {
    expect(
      getRecommendedNextStep(undefined as unknown as AuditResponse),
    ).toBe("audit-another-listing");
  });
});

describe("trackEvent", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("logs the event name and payload", () => {
    trackEvent("clicked_get_quote", { foo: "bar" });
    expect(logSpy).toHaveBeenCalledWith("[analytics] clicked_get_quote", { foo: "bar" });
  });

  it("defaults payload to an empty object", () => {
    trackEvent("next_step_page_viewed");
    expect(logSpy).toHaveBeenCalledWith("[analytics] next_step_page_viewed", {});
  });
});
