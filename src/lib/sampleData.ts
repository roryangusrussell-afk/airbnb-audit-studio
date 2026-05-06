import type { AuditResponse } from "./types";

export const sampleAudit: AuditResponse = {
  score: 71,
  verdict:
    "Solid listing with a strong review base but key USPs missing from the title and photos.",
  title: "Light-filled 1BR flat with balcony & private parking in Cais do Sodré",
  location: "Lisbon, Portugal",
  overview:
    "A beautifully designed one-bedroom apartment in the heart of Cais do Sodré, with a south-facing balcony and one of the few private parking spaces in the neighbourhood.",
  description:
    "The apartment is bright and fully equipped, with high ceilings, wooden floors, and a fully fitted kitchen. The balcony gets afternoon sun. Private parking is included and accessed from the rear of the building.",
  amenities: ["Wifi", "Kitchen", "Washer", "Private parking", "Balcony", "Workspace"],
  photoCount: 28,
  photoAnalysis: {
    verdict: "Mixed",
    technicalScore: 65,
    aestheticScore: 60,
    score: 61,
    signals: ["Competent framing", "No captions", "Parking not photographed"],
    missingRooms: ["parking"],
  },
  cats: [
    { name: "Title", score: 58, fb: "Location present but no differentiator" },
    { name: "Overview", score: 72, fb: "Good opening but buries the parking signal" },
    { name: "Description", score: 65, fb: "Well written but flat structure, no subsections" },
    { name: "Amenities", score: 80, fb: "Strong coverage, workspace not evidenced in photos" },
    { name: "Photos", score: 61, fb: "Technically competent, no captions, parking not photographed" },
    { name: "Reviews & rating", score: 84, fb: "High rating, guests mention parking repeatedly" },
  ],
  checks: [
    { ok: false, label: "Location keywords in title" },
    { ok: true, label: "Hook in first 50 characters of overview" },
    { ok: true, label: "At least 12 amenities declared" },
    { ok: false, label: "Workspace or desk declared" },
    { ok: false, label: "Photo captions look human-written" },
    { ok: true, label: "Review count 10 or above" },
    { ok: "unknown", label: "Instant Book enabled" },
    { ok: true, label: "Guest Favourite status" },
    { ok: "unknown", label: "Flexible or moderate cancellation" },
  ],
  issues: [
    {
      rank: "01",
      impact: "high",
      title: "Parking invisible above the fold",
      problem:
        "Private parking is rare in Cais do Sodré but missing from title and first photo",
      action: "Add parking to title and photograph the space with a caption",
    },
    {
      rank: "02",
      impact: "medium",
      title: "No photo captions",
      problem:
        "28 photos have no captions — a missed semantic signal for Airbnb search",
      action:
        "Write one descriptive sentence per photo referencing the room and a feature",
    },
  ],
  fixes: [
    {
      rank: "01",
      area: "Title",
      difficulty: "Easy",
      tier: "quick_win",
      title: "Lead with parking in the title",
      fix: "Light-filled 1BR in Cais do Sodré with private parking",
      whyItMatters:
        "Guests filtering on parking see your title before they open the listing",
      where: "Listing editor > Title",
    },
    {
      rank: "02",
      area: "Photos",
      difficulty: "Easy",
      tier: "quick_win",
      title: "Add captions to all 28 photos",
      fix: "Write one sentence per photo naming the room and one feature, e.g. Living room with south-facing balcony and city views",
      whyItMatters:
        "None of your 28 photos have captions. Airbnb indexes them for search matching",
      where: "Listing editor > Photos",
    },
    {
      rank: "03",
      area: "Description",
      difficulty: "Medium",
      tier: "quick_win",
      title: "Break description into subsections",
      fix: "Restructure into four paragraphs: The space / The balcony and parking / The neighbourhood / Good to know",
      whyItMatters:
        "Flat structure is hard to scan on mobile and undersells the balcony and parking",
      where: "Listing editor > About this space",
    },
    {
      rank: "04",
      area: "Overview",
      difficulty: "Easy",
      tier: "refinement",
      title: "Move parking to opening line",
      fix: "Start with: A light-filled apartment with a private parking space and south-facing balcony in Cais do Sodré",
      whyItMatters:
        "Parking currently appears in paragraph three. Most guests read only the first two lines",
      where: "Listing editor > About this space",
    },
  ],
  wins: [
    "4.87 rating across 94 reviews with Guest Favourite status",
    "Amenity count strong at 28, including workspace and parking",
  ],
  advisoryNotes: [
    {
      area: "Booking conversion",
      note: "Check your impression-to-booking rate in the host dashboard. High visibility with low bookings hurts your ranking: clicks without conversions sink you.",
    },
    {
      area: "Response time",
      note: "Aim for under 30 minutes. Over 6 hours and Airbnb routes premium guests away. We cannot measure this from the listing page; check the host dashboard.",
    },
    {
      area: "Price competitiveness",
      note: "Airbnb compares your nightly rate daily against nearby listings. Overpriced relative to comps means fewer conversions and lower ranking. Use a pricing tool or check Airbnb's smart pricing suggestions.",
    },
    {
      area: "Calendar consistency",
      note: "Blocked dates and frequent calendar changes signal unreliability. Keep at least 6 months of availability open and avoid frequent rate changes.",
    },
  ],
  categoryRatings: [
    { label: "Cleanliness", localizedRating: "4.9" },
    { label: "Accuracy", localizedRating: "4.8" },
    { label: "Communication", localizedRating: "5.0" },
    { label: "Location", localizedRating: "4.9" },
    { label: "Check-in", localizedRating: "4.8" },
    { label: "Value", localizedRating: "4.7" },
  ],
  bottomTenRisk: false,
  hostResponseRatio: 0.0,
  listingId: "12345678",
  rating: 4.87,
  reviewCount: 94,
  propertyType: "Entire apartment",
  guests: 3,
};
