import { describe, it, expect } from "vitest";
import {
  scoreBand,
  verdictLabel,
  diagnosticLabel,
  categoryRatingBand,
  bandTextClass,
  bandBgClass,
  bandSoftClasses,
} from "./scoring";

describe("scoreBand", () => {
  it.each([
    [100, "strong"],
    [75, "strong"],
    [74, "average"],
    [55, "average"],
    [54, "weak"],
    [0, "weak"],
  ] as const)("score %i → %s", (score, expected) => {
    expect(scoreBand(score)).toBe(expected);
  });
});

describe("verdictLabel", () => {
  it.each([
    [100, "Excellent"],
    [80, "Excellent"],
    [79, "Strong"],
    [72, "Strong"],
    [71, "Solid"],
    [60, "Solid"],
    [59, "Needs work"],
    [48, "Needs work"],
    [47, "Critical"],
    [0, "Critical"],
  ] as const)("score %i → %s", (score, expected) => {
    expect(verdictLabel(score)).toBe(expected);
  });
});

describe("diagnosticLabel", () => {
  it("diverges from verdictLabel at the top bucket", () => {
    expect(diagnosticLabel(80)).toBe("Strong listing");
    expect(verdictLabel(80)).toBe("Excellent");
  });

  it.each([
    [79, "Strong"],
    [60, "Solid"],
    [48, "Needs work"],
    [47, "Critical"],
  ] as const)("score %i → %s", (score, expected) => {
    expect(diagnosticLabel(score)).toBe(expected);
  });
});

describe("categoryRatingBand", () => {
  it("treats numeric and string inputs equivalently", () => {
    expect(categoryRatingBand("4.8")).toBe("strong");
    expect(categoryRatingBand(4.8)).toBe("strong");
  });

  it.each([
    [4.9, "strong"],
    [4.8, "strong"],
    [4.7, "average"],
    [4.5, "average"],
    [4.4, "weak"],
    [0, "weak"],
  ] as const)("rating %s → %s", (rating, expected) => {
    expect(categoryRatingBand(rating)).toBe(expected);
  });

  it("falls back to 'average' for unparseable input", () => {
    expect(categoryRatingBand("not a number")).toBe("average");
  });
});

describe("band class helpers", () => {
  it("map each band to its tone token", () => {
    expect(bandTextClass("strong")).toBe("text-success");
    expect(bandTextClass("average")).toBe("text-warning");
    expect(bandTextClass("weak")).toBe("text-danger");

    expect(bandBgClass("strong")).toBe("bg-success");
    expect(bandBgClass("average")).toBe("bg-warning");
    expect(bandBgClass("weak")).toBe("bg-danger");

    expect(bandSoftClasses("strong")).toContain("success-soft");
    expect(bandSoftClasses("average")).toContain("warning-soft");
    expect(bandSoftClasses("weak")).toContain("danger-soft");
  });
});
