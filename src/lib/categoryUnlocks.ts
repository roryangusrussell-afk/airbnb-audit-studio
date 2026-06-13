/**
 * Per-category "what the paid Fix Plan unlocks for this category".
 *
 * Shown beneath each free finding in the locked report. States the deliverable,
 * never the fix itself, and never a fabricated number. The free finding
 * (`cat.fb`) names the problem; this names what the host gets when they pay.
 */
export const CATEGORY_UNLOCKS: Record<string, string> = {
  Title:
    "Three rewritten titles built from your top comps, ready to paste.",
  Overview:
    "A rewritten opening that front-loads what search and guests scan first.",
  Description:
    "A restructured description with scannable sections and the details guests search for.",
  Photos:
    "A cover-image recommendation, ordering guidance, and the room types you are missing.",
  "Reviews & rating":
    "The themes Airbnb surfaces first and how to echo them in your copy.",
  Amenities:
    "The amenities worth confirming or adding, ranked by search and booking weight.",
  "Conversion Signals":
    "The trust, clarity, and house-rule signals to add before guests decide.",
};

export function getCategoryUnlock(name: string): string {
  return (
    CATEGORY_UNLOCKS[name] ??
    "Specific, paste-ready fixes for this section, included in the Fix Plan."
  );
}
