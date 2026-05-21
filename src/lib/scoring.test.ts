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
  it("returns 'strong' at and above 75", () => {
    expect(scoreBand(75)).toBe("strong");
    expect(scoreBand(100)).toBe("strong");
  });

  it("returns 'average' on [55, 75)", () => {
    expect(scoreBand(55)).toBe("average");
    expect(scoreBand(74)).toBe("average");
    expect(scoreBand(74.999)).toBe("average");
  });

  it("returns 'weak' below 55", () => {
    expect(scoreBand(54)).toBe("weak");
    expect(scoreBand(0)).toBe("weak");
    expect(scoreBand(-10)).toBe("weak");
  });
});

describe("verdictLabel", () => {
  it("uses three tiers: AI-ready / Room to grow / Leaking visibility", () => {
    expect(verdictLabel(100)).toBe("AI-ready");
    expect(verdictLabel(75)).toBe("AI-ready");
    expect(verdictLabel(74)).toBe("Room to grow");
    expect(verdictLabel(55)).toBe("Room to grow");
    expect(verdictLabel(54)).toBe("Leaking visibility");
    expect(verdictLabel(0)).toBe("Leaking visibility");
  });
});

describe("diagnosticLabel", () => {
  it("mirrors verdictLabel tiers", () => {
    expect(diagnosticLabel(100)).toBe("AI-ready");
    expect(diagnosticLabel(75)).toBe("AI-ready");
    expect(diagnosticLabel(74)).toBe("Room to grow");
    expect(diagnosticLabel(55)).toBe("Room to grow");
    expect(diagnosticLabel(54)).toBe("Leaking visibility");
    expect(diagnosticLabel(0)).toBe("Leaking visibility");
  });
});

describe("categoryRatingBand", () => {
  it("treats 4.8+ as strong, 4.5–4.79 as average, below 4.5 as weak", () => {
    expect(categoryRatingBand(4.8)).toBe("strong");
    expect(categoryRatingBand(5.0)).toBe("strong");
    expect(categoryRatingBand(4.5)).toBe("average");
    expect(categoryRatingBand(4.79)).toBe("average");
    expect(categoryRatingBand(4.49)).toBe("weak");
    expect(categoryRatingBand(0)).toBe("weak");
  });

  it("parses string ratings", () => {
    expect(categoryRatingBand("4.9")).toBe("strong");
    expect(categoryRatingBand("4.5")).toBe("average");
    expect(categoryRatingBand("4.0")).toBe("weak");
  });

  it("falls back to 'average' for unparseable input", () => {
    expect(categoryRatingBand("n/a")).toBe("average");
    expect(categoryRatingBand("")).toBe("average");
  });
});

describe("band class helpers", () => {
  it("bandTextClass maps each band to a text colour class", () => {
    expect(bandTextClass("strong")).toBe("text-success");
    expect(bandTextClass("average")).toBe("text-warning");
    expect(bandTextClass("weak")).toBe("text-danger");
  });

  it("bandBgClass maps each band to a bg colour class", () => {
    expect(bandBgClass("strong")).toBe("bg-success");
    expect(bandBgClass("average")).toBe("bg-warning");
    expect(bandBgClass("weak")).toBe("bg-danger");
  });

  it("bandSoftClasses returns soft tri-class strings per band", () => {
    expect(bandSoftClasses("strong")).toContain("bg-success-soft");
    expect(bandSoftClasses("strong")).toContain("text-success");
    expect(bandSoftClasses("average")).toContain("bg-warning-soft");
    expect(bandSoftClasses("weak")).toContain("bg-danger-soft");
  });
});
