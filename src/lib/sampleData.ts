import type { AuditResponse } from "./types";

export const sampleAudit: AuditResponse = {
  score: 71,
  verdict: "Strong reviews held back by a buried parking USP.",
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
      action: "Make private parking visible above the fold: add it to the title and photograph the space.",
    },
    {
      rank: "02",
      impact: "medium",
      title: "Photo metadata is missing",
      problem:
        "28 photos have no captions, a missed semantic signal for Airbnb search",
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
  hostMessageResponseRate: 100,
  hostMessageResponseTime: "Responds within an hour",
  isGuestFavorite: true,
  guestFavoriteTier: "Top 5%",
  summary:
    "This listing reads as a base for travellers who want to be in the heart of Lisbon's nightlife and food scene with the rare luxury of a private parking space. The promise is delivering: 4.87 across 94 reviews, Guest Favourite status, 5.0 communication, and 4.9 location and cleanliness. Recent reviews mention the parking by name.\n\nThe fundamental tension is that the rarest signal on this listing, private parking in Cais do Sodré, is invisible above the fold. The title doesn't mention it, and the first photo doesn't show it. The shift worth making is treating parking as the primary differentiator, not a footnote in paragraph three.",
  start: [
    {
      title: "Add parking to the title",
      detail:
        "Private parking is rare in Cais do Sodré and currently missing from your title. Guests filtering for parking will see your listing before they open it, which is the highest-leverage edit available.",
    },
    {
      title: "Caption every photo",
      detail:
        "28 photos with no captions is 28 missed semantic signals. Each caption is a free conversion tool: room name plus one specific feature like 'south-facing balcony at golden hour'.",
    },
    {
      title: "Photograph the parking space",
      detail:
        "Parking is your strongest differentiator and there isn't a photo of it. A single shot with the gate or door visible would close the credibility gap for guests filtering on it.",
    },
  ],
  stop: [
    {
      title: "Burying parking in paragraph three",
      detail:
        "Most guests read only the first two lines of the overview. Putting parking after a generic 'beautifully designed' opener wastes the highest-leverage real estate on the page.",
    },
    {
      title: "Letting the description run flat",
      detail:
        "One paragraph for the whole space, balcony, and parking. Hard to scan on mobile, and it undersells each individual signal by treating them all the same.",
    },
    {
      title: "Claiming a workspace you don't show",
      detail:
        "Workspace is declared but not evidenced in any of the 28 photos. Either show it or remove the claim. Guests filtering on it will downgrade trust either way.",
    },
  ],
  continue: [
    {
      title: "Replying within the hour, every time",
      detail:
        "100% messaging response rate at 'within an hour' is top-tier territory and a direct ranking signal in Airbnb's algorithm. Most hosts can't sustain this.",
    },
    {
      title: "Whatever you're doing on cleanliness",
      detail:
        "4.9 cleanliness across 94 reviews is rare. Whatever the operating routine is, protect it. This is the foundation everything else stands on.",
    },
    {
      title: "Holding Top 5% Guest Favourite status",
      detail:
        "Top 5% is the kind of social proof new listings spend years building. It's earning conversion before guests even read the copy. Don't break what's earning it.",
    },
  ],
  positioningDiagnosis: {
    targetGuest:
      "Independent travellers and small groups visiting Lisbon for nightlife, food and city exploration who also need to drive or arrive by car.",
    promise:
      "A bright, well-equipped flat in the heart of Cais do Sodré with the rare luxury of a private parking space and a south-facing balcony.",
    reviewAlignment:
      "Reviews repeatedly validate the parking, the location and the cleanliness, all pillars of the implied promise.",
    adjustment:
      "Private parking is already validated by reviews, but the listing under-displays it in the title and gallery. The shift is treating parking as the headline differentiator, not a footnote.",
  },
  subsections: {
    theSpace:
      "Welcome to our home! This beautiful home is close to many of Lisbon's top attractions! This minimalist apartment comes with open living and dining areas as well as a fully fitted kitchen, the home acts as a peaceful retreat after a day out in the city. The kitchen is fully equipped with essential cookware and cutlery. The 2 bedrooms come with a comfy double beds. The beds are fitted with complimentary hotel-quality linens for maximum comfort. There's also another single couch bed in the living room should you need it. The bathroom has all the amenities you'll need to freshen up such as a shower, a toilet, and a sink. Fresh towels and free toiletries will also be supplied for your convenience. The flat is always professionally cleaned and sanitized for your health and safety. Enjoy!",
    guestAccess: "Guests have access to the entire property.",
    otherNotes:
      "This property is a self-check-in property, and you will be requested to verify your identity before checking into the property. Check-in can be done from 3 PM, pending availability and confirmation. Once a reservation is confirmed, guests are requested to complete a guest registration form following the legal obligations stipulated by local authorities in Portugal. There is a zero-tolerance policy for smoking on the property. If our team discovers evidence that this rule has been breached (e.g., smoke smell, ashes, butts, etc.), we fully reserve the right to charge a 200 euro smoking fee at minimum. Please note that for stays longer than 30 nights, a fair use policy of the utilities will apply with a limit of 80 euros. For the first days, we provide the basic amenities: samples of shower gel, shampoo, soap, toilet paper, kitchen roll, sponge, dishwashing products and bin bag. Extra keys: 20 euros. Extra cleaning with linen: the price of a cleaning fee. Extra Clothing: 30 euros (Towels and sheets for 2pax, i.e. when the sofa bed is not included).",
    neighborhood: "",
  },
  houseRules: "",
  rewrites: {
    title: {
      keepAsIs: false,
      options: [
        {
          tone: "Concise",
          recommended: true,
          text: "Cais do Sodré 1BR with private parking & balcony",
          why: "Leads with the rarest USP (private parking) and the neighbourhood that filters guests in. Drops 'Light-filled' which is generic and unproven.",
        },
        {
          tone: "Premium",
          recommended: false,
          text: "Cais do Sodré apartment, private parking, south-facing balcony",
          why: "Adds the balcony orientation as a second specific. Keeps parking up front so the title still earns the parking-filter click.",
        },
        {
          tone: "Warm",
          recommended: false,
          text: "Bright Cais do Sodré flat, balcony at golden hour, private parking",
          why: "Trades a small amount of scannability for personality. Still keeps the parking USP visible in the second clause.",
        },
      ],
    },
    opening: {
      keepAsIs: false,
      options: [
        {
          tone: "Concise",
          recommended: true,
          text: "A one-bedroom apartment in Cais do Sodré with a south-facing balcony and one of the few private parking spaces in the neighbourhood.",
          why: "Leads with the strongest two specifics: balcony orientation and parking rarity. Drops 'beautifully designed' which adds nothing the photos can't prove.",
        },
        {
          tone: "Premium",
          recommended: false,
          text: "One bedroom in Cais do Sodré with rare private parking, a south-facing balcony, and a 5-minute walk to the riverside.",
          why: "Adds a third specific (walk time) without bloat. Premium voice earned through specificity, not adjectives.",
        },
        {
          tone: "Warm",
          recommended: false,
          text: "Our place is in Cais do Sodré with a south-facing balcony for afternoon sun and a private parking space, which is rare around here.",
          why: "Operator voice without slipping into 'home away from home' territory. Still surfaces the parking and balcony as specifics.",
        },
      ],
    },
    theSpace: {
      keepAsIs: false,
      text: "Two bedrooms with double beds, hotel-quality linens, and a sofa bed in the living room for a fourth guest. Open-plan living and dining area with a glass dining table for 4. Fully fitted kitchen with oven, induction hob, microwave, coffee machine, kettle, and toaster. All cookware and cutlery provided. Bathroom with walk-in shower, marble-effect tiles, and fresh towels. Air conditioning throughout. Flat-screen TV and console table workspace. Professionally cleaned and sanitized before each stay. Fresh toiletries, shower gel, shampoo, and basic supplies provided on arrival.",
      why: "Removes 'Welcome to our home', 'peaceful retreat', and generic adjectives. Leads with room count and sleeping arrangements (key for families). Adds specific kitchen appliances and workspace detail visible in photos. Factual and scannable.",
    },
    guestAccess: {
      keepAsIs: false,
      text: "Entire apartment. Self check-in via keypad or lockbox. You will be asked to verify your identity before arrival. Check-in from 3 PM pending availability. Guest registration form required on arrival (Portuguese legal requirement).",
      why: "Procedural and clear. Sets identity verification and registration expectations upfront so guests aren't surprised on arrival. Operator voice.",
    },
    otherNotes: {
      keepAsIs: false,
      text: "Zero-tolerance smoking policy. Smoking evidence (smell, ashes, butts) will incur a 200 euro minimum fee. For stays over 30 nights, utilities capped at 80 euros. Basic amenities provided on arrival; extra keys 20 euros, extra cleaning [cleaning fee], extra linens 30 euros. Building has stairs to entrance. Quiet neighbourhood but tram noise audible early mornings and evenings.",
      why: "Consolidates house rules and fees into one honest disclosure. Adds 'stairs to entrance' and 'tram noise' as friction-point disclosures (reviews mention tram proximity; honesty protects future reviews). Removes marketing language.",
    },
    neighborhood: {
      keepAsIs: false,
      text: "Cais do Sodré, on the Tagus riverside. 5 minutes to Time Out Market, 10 minutes to Bairro Alto for nightlife, 15 minutes by tram to Belém. Cais do Sodré train station is a 3-minute walk for trains to Cascais and Estoril. Two supermarkets within 200m. Pingo Doce on Rua do Alecrim is the closer of the two. [Add your favourite breakfast spot within 5 minutes].",
      why: "Replaces empty section with specific names, walk times and a transit anchor. Brackets a single owner-only detail rather than fabricating a recommendation.",
    },
    houseRules: {
      keepAsIs: false,
      text: "No smoking (200 euro minimum fee if breached). No parties or events. Quiet hours 10 PM to 8 AM. Maximum 4 guests including infants. Pets considered case by case, please ask before booking. Check-in from 3 PM, check-out by 11 AM.",
      why: "Adds quiet hours and explicit guest cap, which the current rules don't carry. Pet policy framed as 'ask first' rather than absolute, opens optionality without committing.",
    },
  },
  performancePattern: {
    strengths: [
      {
        category: "Reviews",
        title: "Early trust is unusually strong",
        detail:
          "A 4.87 rating across 94 reviews and Top 5% Guest Favourite status creates strong proof and reduces booking friction for new visitors.",
      },
      {
        category: "Overview",
        title: "The space has a real point of view",
        detail:
          "Wooden floors, high ceilings and a south-facing balcony give the apartment a memorable personality beyond a generic city flat.",
      },
      {
        category: "Amenities",
        title: "Guest expectations are well managed",
        detail:
          "Private parking, balcony, kitchen and workspace are all declared upfront, helping guests self-qualify before they book.",
      },
    ],
    gaps: [
      {
        category: "Title",
        title: "Strongest USP is buried",
        detail:
          "Private parking is the rarest signal in Cais do Sodré, but it doesn't appear in the title and isn't shown in the first photo.",
      },
      {
        category: "Photos",
        title: "Photo metadata is underdeveloped",
        detail:
          "None of the 28 photos carry captions, so the gallery doesn't explain room function, amenities or neighbourhood context to guests.",
      },
      {
        category: "Description",
        title: "Description structure flattens the story",
        detail:
          "A single block of copy treats the balcony, parking and neighbourhood as equal, and undersells each individual signal.",
      },
    ],
    leverage: [
      {
        category: "Title",
        title: "The cultural positioning could be more visible",
        detail:
          "The listing has a distinctive identity, but the title and opening copy could surface the Cais do Sodré character more clearly.",
      },
      {
        category: "Reviews",
        title: "The review profile can work harder",
        detail:
          "94 strong reviews are enough to start building visible host credibility if the host engages publicly with recent ones.",
      },
      {
        category: "Photos",
        title: "The gallery can carry more selling power",
        detail:
          "The room is visually distinctive, but the gallery is not yet doing enough explanatory work for guests scanning quickly on mobile.",
      },
    ],
  },
};
