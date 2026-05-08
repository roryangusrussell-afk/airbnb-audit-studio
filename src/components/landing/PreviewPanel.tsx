import { Camera, Smile, Type, Home, ChevronRight } from "lucide-react";
import heroApartment from "@/assets/hero-apartment.jpeg";

type PillProps = {
  icon: React.ReactNode;
  label: string;
  status: string;
  tone: "good" | "warn";
  className?: string;
};

function FloatingPill({ icon, label, status, tone, className = "" }: PillProps) {
  const dot = tone === "good" ? "bg-success" : "bg-warning";
  const statusText = tone === "good" ? "text-success" : "text-warning";
  return (
    <div
      className={`absolute z-10 hidden items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-3.5 py-2.5 shadow-elevated backdrop-blur-sm sm:flex ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-[13px] font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className={`text-[11px] font-medium ${statusText}`}>{status}</span>
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        </div>
      </div>
    </div>
  );
}

const categories = [
  { label: "Photo Quality", icon: Camera, score: 78, tone: "good" as const },
  { label: "Guest Experience", icon: Smile, score: 62, tone: "warn" as const },
  { label: "Title & SEO", icon: Type, score: 58, tone: "warn" as const },
  { label: "Amenities", icon: Home, score: 71, tone: "good" as const },
  { label: "Pricing", icon: ChevronRight, score: 76, tone: "good" as const },
  { label: "Description", icon: ChevronRight, score: 70, tone: "good" as const },
];

function ScoreRingMini() {
  const r = 38;
  const c = 2 * Math.PI * r;
  const pct = 72;
  const dash = (pct / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="hsl(var(--brand))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground leading-none">72</span>
        <span className="text-[10px] font-medium text-muted-foreground mt-0.5">/100</span>
      </div>
    </div>
  );
}

export function PreviewPanel() {
  return (
    <div className="relative">
      {/* Hero image — shorter on mobile so the score card sits closer */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-elevated">
        <img
          src={heroApartment}
          alt="Bright modern Airbnb living room with plants"
          className="h-64 w-full object-cover sm:h-[560px]"
          loading="eager"
        />
      </div>

      {/* Floating pills (desktop only — clutter mobile) */}
      <FloatingPill
        icon={<Camera className="h-4 w-4" />}
        label="Photo Quality"
        status="Good"
        tone="good"
        className="left-2 top-8 sm:-left-6"
      />
      <FloatingPill
        icon={<Smile className="h-4 w-4" />}
        label="Guest Experience"
        status="Needs Work"
        tone="warn"
        className="left-2 top-1/2 -translate-y-1/2 sm:-left-8"
      />
      <FloatingPill
        icon={<Type className="h-4 w-4" />}
        label="Title & SEO"
        status="Needs Work"
        tone="warn"
        className="bottom-12 left-6 sm:left-12"
      />
      <FloatingPill
        icon={<Home className="h-4 w-4" />}
        label="Amenities"
        status="Good"
        tone="good"
        className="bottom-6 right-6 sm:right-16"
      />

      {/* Score card — stacks below image on mobile (relative + negative margin to overlap slightly), absolute-positioned on desktop */}
      <div className="relative z-20 mx-auto -mt-12 w-[88%] max-w-[300px] rounded-2xl border border-border/70 bg-card p-5 shadow-elevated sm:absolute sm:-right-8 sm:top-16 sm:mt-0 sm:w-[260px] sm:max-w-none">
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Overall Score
          </div>
          <div className="mt-3 flex justify-center">
            <ScoreRingMini />
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-success">
            Good, room to grow
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-foreground">
                  <Icon className="h-3.5 w-3.5 text-brand" />
                  <span className="font-medium">{c.label}</span>
                </div>
                <span className="font-semibold text-muted-foreground">
                  {c.score}<span className="text-muted-foreground/60">/100</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
