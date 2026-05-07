import { MapPin, Star, Sparkles, Home, CheckCircle2 } from "lucide-react";
import type { AuditResponse } from "@/lib/types";

const NOTABLE = [
  "Private parking",
  "Hot tub",
  "Pool",
  "Sauna",
  "Sea view",
  "Ocean view",
  "Fireplace",
  "EV charger",
];

function pickNotable(amenities: string[]): string | null {
  for (const target of NOTABLE) {
    const match = amenities.find((a) => a.toLowerCase().includes(target.toLowerCase()));
    if (match) return match;
  }
  return null;
}

export function ListingCard({ data }: { data: AuditResponse }) {
  const notable = pickNotable(data.amenities);
  const today = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border bg-card p-3 shadow-card sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {data.thumbnail ? (
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-muted sm:w-40 sm:flex-none">
            <img
              src={data.thumbnail}
              alt={data.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-2 top-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Analysed
              </span>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[3/2] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground sm:w-40 sm:flex-none">
            <Home className="h-8 w-8 opacity-50" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl">
            {data.title}
          </h2>

          {data.subtitle && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {data.subtitle}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
            {data.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {data.location}
              </span>
            )}
            {data.rating != null && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current text-foreground" />
                <span className="font-medium text-foreground">{data.rating.toFixed(2)}</span>
                {data.reviewCount != null && <span>· {data.reviewCount} reviews</span>}
              </span>
            )}
            {data.amenities.length > 0 && (
              <span>{data.amenities.length} amenities</span>
            )}
            {notable && (
              <span className="inline-flex items-center gap-1 text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand" /> {notable}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {data.propertyType && (
              <span className="rounded-full border border-brand-border bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                {data.propertyType}
              </span>
            )}
            {data.guests != null && (
              <span className="rounded-full border border-brand-border bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                Hosts up to {data.guests} guests
              </span>
            )}
            <span className="ml-auto text-[11px] text-muted-foreground">
              Audited {today}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
