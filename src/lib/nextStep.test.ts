import { describe, it, expect, vi } from "vitest";
import {
  isPortugalListing,
  getHostListingCount,
  getOverallScore,
  getTopGap,
  getRecommendedNextStep,
  trackEvent,
} from "./nextStep";
import type { AuditResponse } from "./types";

function audit(overrides: Partial<AuditResponse> = {}): AuditResponse {
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
    hostResponseRatio: 0,
    listingId: "1",
    ...overrides,
  };
}

describe("isPortugalListing", () => {
  it.each([
    "Lisbon, Portugal",
    "Porto",
    "Cascais, Lisboa",
    "Funchal, Madeira",
    "Algarve",
  ])("matches %s", (location) => {
    expect(isPortugalListing(audit({ location }))).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(isPortugalListing(audit({ location: "LISBON" }))).toBe(true);
  });

  it("matches across alternate location fields", () => {
    expect(isPortugalListing({ city: "Porto" })).toBe(true);
    expect(isPortugalListing({ listingCountry: "Portugal" })).toBe(true);
  });

  it("returns false for non-Portugal locations", () => {
    expect(isPortugalListing(audit({ location: "Barcelona, Spain" }))).toBe(false);
    expect(isPortugalListing(audit({ location: "" }))).toBe(false);
  });
});

describe("getHostListingCount", () => {
  it("reads the canonical field", () => {
    expect(getHostListingCount(audit({ hostListingCount: 7 }))).toBe(7);
  });

  it("falls back to legacy aliases", () => {
    expect(
      getHostListingCount({ ...audit(), hostListingsCount: 4 } as never),
    ).toBe(4);
    expect(
      getHostListingCount({ ...audit(), hostTotalListings: 3 } as never),
    ).toBe(3);
  });

  it("defaults missing/invalid values to 1", () => {
    expect(getHostListingCount(audit())).toBe(1);
    expect(getHostListingCount(audit({ hostListingCount: 0 }))).toBe(1);
    expect(getHostListingCount(audit({ hostListingCount: -5 }))).toBe(1);
  });
});

describe("getOverallScore", () => {
  it("reads score, with overallScore as a legacy alias", () => {
    expect(getOverallScore(audit({ score: 82 }))).toBe(82);
    expect(
      getOverallScore({ ...audit({ score: undefined as never }), overallScore: 65 } as never),
    ).toBe(65);
  });

  it("defaults to 0 when neither is present", () => {
    expect(getOverallScore(audit({ score: undefined as never }))).toBe(0);
  });
});

describe("getTopGap", () => {
  it("lowercases the first character of the first non-opportunity issue", () => {
    const result = getTopGap(
      audit({
        issues: [
          { rank: "1", type: "opportunity", impact: "low", title: "Add captions", problem: "", action: "" },
          { rank: "2", type: "gap", impact: "high", title: "Title is generic", problem: "", action: "" },
        ],
      }),
    );
    expect(result).toBe("title is generic");
  });

  it("falls back to the first issue when only opportunities exist", () => {
    expect(
      getTopGap(
        audit({
          issues: [
            { rank: "1", type: "opportunity", impact: "low", title: "Add a hot tub", problem: "", action: "" },
          ],
        }),
      ),
    ).toBe("add a hot tub");
  });

  it("returns null when there are no issues", () => {
    expect(getTopGap(audit({ issues: [] }))).toBeNull();
  });
});

describe("getRecommendedNextStep", () => {
  it("Portugal trumps all other signals", () => {
    expect(
      getRecommendedNextStep(
        audit({ location: "Lisbon", hostListingCount: 50, score: 95 }),
      ),
    ).toBe("portugal-management");
  });

  it("≥10 listings → portfolio-review", () => {
    expect(getRecommendedNextStep(audit({ hostListingCount: 10 }))).toBe("portfolio-review");
  });

  it("2–9 listings → audit-another-listing", () => {
    expect(getRecommendedNextStep(audit({ hostListingCount: 2 }))).toBe("audit-another-listing");
    expect(getRecommendedNextStep(audit({ hostListingCount: 9 }))).toBe("audit-another-listing");
  });

  it("single-listing host routes by score", () => {
    expect(getRecommendedNextStep(audit({ hostListingCount: 1, score: 90 }))).toBe("ai-systems");
    expect(getRecommendedNextStep(audit({ hostListingCount: 1, score: 75 }))).toBe("improve-this-listing");
    expect(getRecommendedNextStep(audit({ hostListingCount: 1, score: 74 }))).toBe("fix-this-listing");
  });

  it("returns audit-another-listing when no audit is provided", () => {
    expect(getRecommendedNextStep(null as never)).toBe("audit-another-listing");
  });
});

describe("trackEvent", () => {
  it("logs the event and payload (placeholder analytics)", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    trackEvent("clicked_get_quote", { source: "test" });
    expect(spy).toHaveBeenCalledWith("[analytics] clicked_get_quote", { source: "test" });
    spy.mockRestore();
  });
});
