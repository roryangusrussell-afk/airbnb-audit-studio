export type CheckOk = boolean | "unknown";

export interface Check {
  ok: CheckOk;
  label: string;
}

export interface Cat {
  name: string;
  score: number;
  fb: string;
}

export interface Issue {
  rank: string;
  type?: "gap" | "perception_risk" | "opportunity" | string;
  impact: "high" | "medium" | "low" | string;
  title: string;
  problem: string;
  action: string;
}

export interface PositioningDiagnosis {
  targetGuest: string;
  promise: string;
  reviewAlignment: string;
  adjustment: string;
}

export type FixTier = "quick_win" | "refinement" | string;
export type Difficulty = "Easy" | "Medium" | "Hard" | string;

export interface Fix {
  rank: string;
  area: string;
  difficulty: Difficulty;
  tier: FixTier;
  title: string;
  fix: string;
  whyItMatters: string;
  where: string;
}

export interface PhotoAnalysis {
  verdict: string;
  technicalScore: number;
  aestheticScore: number;
  score: number;
  signals: string[];
  missingRooms: string[];
}

export interface AdvisoryNote {
  area: string;
  note: string;
}

export interface CategoryRating {
  label: string;
  localizedRating: string;
}

export interface AuditResponse {
  score: number;
  verdict: string;
  title: string;
  location: string;
  overview: string;
  description: string;
  amenities: string[];
  photoCount: number;
  photoAnalysis: PhotoAnalysis;
  cats: Cat[];
  checks: Check[];
  issues: Issue[];
  fixes: Fix[];
  wins: string[];
  advisoryNotes: AdvisoryNote[];
  categoryRatings: CategoryRating[];
  bottomTenRisk: boolean;
  hostResponseRatio: number;
  listingId: string;
  // New optional review/host signals
  hostMessageResponseRate?: number | null;
  hostMessageResponseTime?: string | null;
  isGuestFavorite?: boolean | null;
  guestFavoriteTier?: "Top 1%" | "Top 5%" | "Top 10%" | string | null;
  isElvisListing?: boolean;
  // Optional fields the API may return
  thumbnail?: string;
  rating?: number;
  reviewCount?: number;
  propertyType?: string;
  guests?: number;
  formulaBreakdown?: Record<string, number>;
  listingSignals?: string;
  positioningDiagnosis?: PositioningDiagnosis;
}
