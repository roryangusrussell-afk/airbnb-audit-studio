import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isPortugalListing, trackEvent } from "./nextStep";

describe("isPortugalListing", () => {
  it("matches any Portugal token in any of the location fields", () => {
    expect(isPortugalListing({ location: "Lisbon, Portugal" })).toBe(true);
    expect(isPortugalListing({ listingLocation: "Porto" })).toBe(true);
    expect(isPortugalListing({ listingCity: "Funchal" })).toBe(true);
    expect(isPortugalListing({ listingCountry: "PORTUGAL" })).toBe(true);
    expect(isPortugalListing({ city: "Cascais" })).toBe(true);
    expect(isPortugalListing({ country: "lisboa" })).toBe(true);
  });

  it("matches partial words and regional tokens", () => {
    expect(isPortugalListing({ location: "Estoril Coast" })).toBe(true);
    expect(isPortugalListing({ location: "ALGARVE villa" })).toBe(true);
  });

  it("returns false for non-Portugal locations and missing fields", () => {
    expect(isPortugalListing({ location: "Barcelona, Spain" })).toBe(false);
    expect(isPortugalListing({ location: "" })).toBe(false);
    expect(isPortugalListing({})).toBe(false);
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

  it("logs the event name and payload in dev", () => {
    trackEvent("clicked_strategy_call", { foo: "bar" });
    expect(logSpy).toHaveBeenCalledWith("[analytics] clicked_strategy_call", { foo: "bar" });
  });

  it("defaults payload to an empty object", () => {
    trackEvent("next_step_page_viewed");
    expect(logSpy).toHaveBeenCalledWith("[analytics] next_step_page_viewed", {});
  });
});
