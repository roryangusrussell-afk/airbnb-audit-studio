import { ScoreRing } from "@/components/results/ScoreRing";

export function PortugalIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-[14px] bg-[linear-gradient(180deg,#fcd9b6_0%,#f4a06f_55%,#3a6c8a_100%)]">
      <svg
        viewBox="0 0 240 240"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd9b6" />
            <stop offset="55%" stopColor="#f4a06f" />
            <stop offset="100%" stopColor="#3a6c8a" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a6c8a" />
            <stop offset="100%" stopColor="#1f4660" />
          </linearGradient>
          <linearGradient id="cliff" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7a5a4a" />
            <stop offset="100%" stopColor="#4a3a30" />
          </linearGradient>
        </defs>
        <rect width="240" height="240" fill="url(#sky)" />
        <circle cx="170" cy="80" r="22" fill="#fff5e0" opacity="0.9" />
        <path d="M0 160 L60 140 L80 145 L120 130 L160 145 L200 138 L240 150 L240 240 L0 240 Z" fill="url(#cliff)" />
        <path d="M0 195 L240 195 L240 240 L0 240 Z" fill="url(#sea)" />
        <g fill="#f7eee2" opacity="0.95">
          <rect x="58" y="118" width="14" height="22" />
          <rect x="74" y="125" width="11" height="15" />
          <rect x="88" y="115" width="13" height="25" />
          <rect x="104" y="120" width="10" height="20" />
          <rect x="118" y="110" width="14" height="30" />
          <rect x="135" y="120" width="11" height="20" />
          <rect x="150" y="115" width="13" height="25" />
          <rect x="167" y="123" width="10" height="17" />
          <rect x="180" y="118" width="12" height="22" />
        </g>
        <g fill="#c84a3c" opacity="0.85">
          <polygon points="58,118 65,112 72,118" />
          <polygon points="88,115 94.5,109 101,115" />
          <polygon points="118,110 125,104 132,110" />
          <polygon points="150,115 156.5,109 163,115" />
          <polygon points="180,118 186,112 192,118" />
        </g>
        <path d="M0 200 Q60 196 120 200 T240 200" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        <path d="M0 215 Q60 211 120 215 T240 215" stroke="#fff" strokeOpacity="0.3" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

export function PortfolioIllustration({ count }: { count: number }) {
  const display = Math.max(1, Math.min(99, Math.round(count)));
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-l-[14px] bg-[#faf6f1]">
      <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
        <g transform="translate(40 60)">
          <circle cx="55" cy="55" r="44" fill="none" stroke="#ececec" strokeWidth="14" />
          <circle
            cx="55"
            cy="55"
            r="44"
            fill="none"
            stroke="hsl(var(--brand))"
            strokeWidth="14"
            strokeDasharray="180 280"
            strokeLinecap="round"
            transform="rotate(-90 55 55)"
            opacity="0.85"
          />
          <text x="55" y="58" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#111">
            {display}
          </text>
          <text x="55" y="78" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#6b7280" letterSpacing="0.5">
            LISTINGS
          </text>
        </g>
        <g transform="translate(135 75)">
          <rect x="0" y="60" width="12" height="20" rx="2" fill="hsl(var(--brand))" opacity="0.85" />
          <rect x="18" y="40" width="12" height="40" rx="2" fill="hsl(var(--brand))" opacity="0.7" />
          <rect x="36" y="20" width="12" height="60" rx="2" fill="hsl(var(--brand))" />
          <rect x="54" y="48" width="12" height="32" rx="2" fill="hsl(var(--brand))" opacity="0.55" />
        </g>
        <text x="120" y="40" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#6b7280" fontWeight="600">
          Portfolio overview
        </text>
      </svg>
    </div>
  );
}

export function CompareListingsIllustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-l-[14px] bg-[#faf6f1]">
      <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
        <g transform="translate(28 50)">
          <rect x="0" y="0" width="86" height="120" rx="10" fill="#fff" stroke="hsl(var(--brand))" strokeWidth="2" />
          <rect x="10" y="10" width="66" height="50" rx="6" fill="#e9e2d6" />
          <path d="M22 38 L34 28 L46 38 L62 22 L70 30 L70 56 L22 56 Z" fill="#bfb29a" />
          <circle cx="58" cy="32" r="4" fill="#fff5e0" />
          <rect x="10" y="68" width="50" height="6" rx="3" fill="#cfcfcf" />
          <rect x="10" y="80" width="40" height="5" rx="2.5" fill="#e2e2e2" />
          <rect x="10" y="91" width="32" height="5" rx="2.5" fill="#e2e2e2" />
          <circle cx="76" cy="-2" r="11" fill="hsl(var(--success))" />
          <path d="M71 -2 L75 2 L82 -5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g transform="translate(130 65)" opacity="0.85">
          <rect x="0" y="0" width="78" height="108" rx="10" fill="#fff" stroke="#e6e3dd" strokeWidth="1.5" />
          <rect x="9" y="9" width="60" height="44" rx="5" fill="#ece7df" />
          <path d="M20 36 L30 28 L40 36 L54 24 L60 30 L60 50 L20 50 Z" fill="#cdc4b0" />
          <rect x="9" y="60" width="44" height="5" rx="2.5" fill="#d6d6d6" />
          <rect x="9" y="71" width="36" height="4" rx="2" fill="#e2e2e2" />
          <rect x="9" y="80" width="28" height="4" rx="2" fill="#e2e2e2" />
        </g>
      </svg>
    </div>
  );
}

export function ScoreTile({ score }: { score: number }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-l-[14px] bg-[#faf6f1]">
      <Sparkle className="absolute left-7 top-7 h-3.5 w-3.5 text-brand" />
      <Sparkle className="absolute right-9 top-12 h-2.5 w-2.5 text-brand/60" />
      <Sparkle className="absolute right-6 bottom-10 h-3 w-3 text-brand/80" />
      <Sparkle className="absolute left-10 bottom-8 h-2 w-2 text-brand/50" />
      <ScoreRing score={score} size={148} />
    </div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4 Z" />
    </svg>
  );
}
