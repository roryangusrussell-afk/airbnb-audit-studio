import { describe, it, expect } from "vitest";
import { CATEGORY_META, getCategoryMeta } from "./categoryMeta";

describe("getCategoryMeta", () => {
  it("returns the metadata object for known category names", () => {
    expect(getCategoryMeta("Title")).toBe(CATEGORY_META.Title);
    expect(getCategoryMeta("Photos")).toBe(CATEGORY_META.Photos);
    expect(getCategoryMeta("Reviews & rating")).toBe(CATEGORY_META["Reviews & rating"]);
  });

  it("returns the muted-foreground fallback for unknown category names", () => {
    const meta = getCategoryMeta("Something New");
    expect(meta.iconText).toBe("text-muted-foreground");
    expect(meta.iconBg).toBe("bg-muted");
    expect(meta.subtext).toBe("");
    expect(meta.icon).toBeTruthy();
  });

  it("supplies an icon, iconText, iconBg and subtext for every defined category", () => {
    for (const [name, meta] of Object.entries(CATEGORY_META)) {
      expect(meta.icon, `${name} icon`).toBeTruthy();
      expect(typeof meta.iconText).toBe("string");
      expect(typeof meta.iconBg).toBe("string");
      expect(typeof meta.subtext).toBe("string");
    }
  });
});
