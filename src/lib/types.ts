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

export interface SummaryAction {
  title: string;
  detail: string;
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
  detectedAmenities?: string[];
}

export type ArchetypeLabel =
  | "Remote worker"
  | "City break couple"
  | "Family"
  | "Group of friends"
  | "Solo explorer"
  | "Business traveller"
  | "Long-stay / digital nomad"
  | string;

export interface Archetype {
  primary: ArchetypeLabel;
  secondary: ArchetypeLabel | null;
  confidence: "high" | "medium" | "low";
}

export interface ArchetypeAlignment {
  score: number;
  strengths: string[];
  gaps: string[];
  mismatches: string[];
}

export interface AdvisoryNote {
  area: string;
  note: string;
}

export interface CategoryRating {
  label: string;
  localizedRating: string;
}

export type DataConfidence = "high" | "low" | "absent";

export interface AuditResponse {
  score: number;
  verdict: string;
  title: string;
  subtitle?: string;
  location: string;
  overview: string;
  overviewConfidence?: DataConfidence;
  description: string;
  descriptionConfidence?: DataConfidence;
  amenities: string[];
  photoCount: number;
  captionedCount?: number;
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
  // Host portfolio signals
  hostListingCount?: number | null;
  // Optional fields the API may return
  thumbnail?: string;
  rating?: number;
  reviewCount?: number;
  propertyType?: string;
  guests?: number;
  formulaBreakdown?: Record<string, number>;
  listingSignals?: string;
  positioningDiagnosis?: PositioningDiagnosis;
  archetype?: Archetype;
  archetypeAlignment?: ArchetypeAlignment;
  neighbourhood?: string | null;
  petPolicy?: string | null;
  // New Summary tab shape (session 7) — replaces listingSignals + positioningDiagnosis
  summary?: string;
  start?: SummaryAction[];
  stop?: SummaryAction[];
  continue?: SummaryAction[];
  // Session 8: Performance pattern (Strengths / Gaps & Risks / Untapped Leverage)
  performancePattern?: {
    strengths: PatternItem[];
    gaps: PatternItem[];
    leverage: PatternItem[];
  };
  // Session 9: paste-ready rewrites for each editor field
  subsections?: ListingSubsections;
  houseRules?: string;
  rewrites?: Rewrites;
}

export interface PatternItem {
  title: string;
  detail: string;
  /** Optional category hint to choose an icon. */
  category?: string;
}

export type RewriteTone = "Concise" | "Premium" | "Warm";

export interface RewriteOption {
  tone: RewriteTone;
  recommended: boolean;
  text: string;
  why: string;
}

export interface MultiToneRewrite {
  keepAsIs: boolean;
  why?: string;
  options?: RewriteOption[];
}

export interface SingleRewrite {
  keepAsIs: boolean;
  why?: string;
  text?: string;
}

export interface Rewrites {
  title: MultiToneRewrite;
  opening: MultiToneRewrite;
  theSpace: SingleRewrite;
  guestAccess: SingleRewrite;
  otherNotes: SingleRewrite;
  neighborhood: SingleRewrite;
  houseRules: SingleRewrite;
}

export interface ListingSubsections {
  theSpace?: string;
  guestAccess?: string;
  otherNotes?: string;
  neighborhood?: string;
}
