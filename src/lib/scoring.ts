export type Band = "strong" | "average" | "weak";

export function scoreBand(n: number): Band {
  if (n >= 75) return "strong";
  if (n >= 55) return "average";
  return "weak";
}

export function verdictLabel(n: number): string {
  if (n >= 80) return "Excellent";
  if (n >= 72) return "Strong";
  if (n >= 60) return "Solid";
  if (n >= 48) return "Needs work";
  return "Critical";
}

export function categoryRatingBand(rating: string | number): Band {
  const r = typeof rating === "string" ? parseFloat(rating) : rating;
  if (Number.isNaN(r)) return "average";
  if (r >= 4.8) return "strong";
  if (r >= 4.5) return "average";
  return "weak";
}

export function bandTextClass(band: Band): string {
  if (band === "strong") return "text-success";
  if (band === "average") return "text-warning";
  return "text-danger";
}

export function bandBgClass(band: Band): string {
  if (band === "strong") return "bg-success";
  if (band === "average") return "bg-warning";
  return "bg-danger";
}

export function bandSoftClasses(band: Band): string {
  if (band === "strong") return "bg-success-soft border-success-border text-success";
  if (band === "average") return "bg-warning-soft border-warning-border text-warning";
  return "bg-danger-soft border-danger-border text-danger";
}
