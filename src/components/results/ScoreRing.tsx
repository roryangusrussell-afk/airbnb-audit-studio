import { useEffect, useState } from "react";
import { verdictLabel, scoreBand, bandSoftClasses, bandTextClass } from "@/lib/scoring";

function bandStrokeVar(score: number): string {
  const b = scoreBand(score);
  if (b === "strong") return "hsl(var(--success))";
  if (b === "average") return "hsl(var(--warning))";
  return "hsl(var(--danger))";
}

export function ScoreRing({ score, size = 172 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const stroke = size >= 170 ? 12 : 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (displayed / 100) * c;
  const arcColor = bandStrokeVar(score);
  const numberColor = bandTextClass(scoreBand(score));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={arcColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={`font-extrabold tracking-tight tabular-nums ${numberColor} ${size >= 170 ? "text-4xl" : "text-[32px]"}`}
        >
          {displayed}
        </div>
        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          / 100
        </div>
      </div>
    </div>
  );
}

export function VerdictLabel({ score }: { score: number }) {
  const band = scoreBand(score);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${bandSoftClasses(band)}`}
    >
      {verdictLabel(score)}
    </span>
  );
}
