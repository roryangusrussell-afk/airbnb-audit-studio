import { useEffect, useState } from "react";
import type { PeekData } from "@/lib/api";

const PINK = "#e8185c";
const PALE_PINK = "rgba(232,24,92,0.06)";
const PINK_BORDER = "rgba(232,24,92,0.20)";
const GREEN = "#2FA36B";
const PALE_GREEN = "rgba(47,163,107,0.10)";
const DARK = "#111827";
const MUTED = "#64748B";
const BORDER = "rgba(15,23,42,0.08)";

const STEPS = [
  {
    title: "Listing data",
    desc: "Fetching title, description, amenities, photos and reviews",
  },
  {
    title: "Copy clarity",
    desc: "Reading the title, overview and description for conversion strength",
  },
  {
    title: "Photo intelligence",
    desc: "Scanning the first photos for quality, clarity and guest appeal",
  },
  {
    title: "Guest trust signals",
    desc: "Checking ratings, review patterns, amenities and friction points",
  },
  {
    title: "Priority fix list",
    desc: "Compiling the highest-impact actions for your listing",
  },
];

export function LoadingScreen({ url, peek }: { url: string; peek: PeekData | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step]);

  const activeStep = Math.min(step, STEPS.length - 1);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF8F4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      fontFamily: "Inter, sans-serif",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .audit-card { animation: fadeIn 0.4s ease both; }
        .spinner { animation: spin 1s linear infinite; }
        @media (max-width: 768px) {
          .audit-card { grid-template-columns: 1fr !important; }
          .left-panel { border-right: none !important; border-bottom: 1px solid rgba(15,23,42,0.08) !important; padding: 28px 24px !important; }
          .right-panel { padding: 32px 24px !important; }
          .main-heading { font-size: 26px !important; }
          .step-row { padding: 14px 16px !important; }
          .deco-svg { display: none; }
        }
        @media (max-width: 480px) {
          .step-badge { display: none; }
          .step-row { min-height: auto !important; }
        }
      `}</style>

      <div
        className="audit-card"
        style={{
          width: "100%",
          maxWidth: 1140,
          background: "#fff",
          borderRadius: 26,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "360px 1fr",
        }}
      >
        {/* LEFT PANEL */}
        <div
          className="left-panel"
          style={{
            background: "#F7F1E8",
            padding: "48px 40px",
            borderRight: `1px solid rgba(15,23,42,0.06)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Status badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: PINK,
            background: "rgba(232,24,92,0.08)",
            border: "1px solid rgba(232,24,92,0.18)",
            width: "fit-content",
          }}>
            <PulseIcon />
            Audit in progress
          </div>

          {/* Listing image */}
          <div style={{ marginTop: 28 }}>
            {peek?.imageUrl ? (
              <img
                src={peek.imageUrl}
                alt={peek.title ?? "Listing"}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 18,
                  boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                  display: "block",
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: 150,
                borderRadius: 18,
                background: "rgba(15,23,42,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* Listing title */}
          {peek?.title && (
            <h2 style={{
              marginTop: 24,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.25,
              color: DARK,
              margin: "24px 0 0",
            }}>
              {peek.title}
            </h2>
          )}

          {/* Rating row */}
          {(peek?.rating || peek?.reviewCount) && (
            <div style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              {peek.rating && (
                <>
                  <span style={{ color: "#F59E0B", fontSize: 16, lineHeight: 1 }}>★</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{peek.rating}</span>
                </>
              )}
              {peek.rating && peek.reviewCount && (
                <span style={{ width: 1, height: 14, background: "rgba(15,23,42,0.15)", display: "inline-block" }} />
              )}
              {peek.reviewCount && (
                <span style={{ fontSize: 14, color: MUTED }}>{peek.reviewCount} reviews</span>
              )}
            </div>
          )}

          {/* Divider */}
          <div style={{
            marginTop: 24,
            marginBottom: 20,
            height: 1,
            background: "rgba(15,23,42,0.10)",
          }} />

          {/* What we're checking */}
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: 0 }}>
              What we're checking
            </p>
            <p style={{
              marginTop: 10,
              fontSize: 14,
              lineHeight: 1.6,
              color: MUTED,
              margin: "10px 0 0",
            }}>
              We evaluate your listing data, copy clarity, photo quality, amenity visibility and guest review patterns — then turn those signals into a prioritised list of fixes.
            </p>
          </div>

          {/* Decorative illustration */}
          <div className="deco-svg" style={{ marginTop: "auto", paddingTop: 32, opacity: 0.65 }}>
            <DecoIllustration />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="right-panel"
          style={{
            background: "#fff",
            padding: "52px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Top label */}
          <p style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: PINK,
            margin: "0 0 22px",
          }}>
            Auditing · Almost ready
          </p>

          {/* Main heading */}
          <h1
            className="main-heading"
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: DARK,
              margin: "0 0 32px",
              maxWidth: 640,
            }}
          >
            Reading your listing the way Airbnb does.
          </h1>

          {/* Progress steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STEPS.map((s, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              return (
                <div key={s.title}>
                  <div
                    className="step-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "16px 20px",
                      borderRadius: 14,
                      minHeight: 76,
                      border: active
                        ? `1.5px solid ${PINK_BORDER}`
                        : done
                          ? "1px solid rgba(47,163,107,0.22)"
                          : `1px solid ${BORDER}`,
                      background: active
                        ? "rgba(232,24,92,0.07)"
                        : done
                          ? "rgba(47,163,107,0.05)"
                          : "#F8F8F8",
                      boxShadow: active ? "0 4px 16px rgba(232,24,92,0.08)" : "none",
                      transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                    }}
                  >
                    {/* Left: icon + text */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                      {/* Icon */}
                      <div style={{ flexShrink: 0 }}>
                        {done ? (
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 999,
                            background: GREEN,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : active ? (
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 999,
                            background: "rgba(232,24,92,0.10)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <svg
                              className="spinner"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle cx="12" cy="12" r="9" stroke="rgba(232,24,92,0.18)" strokeWidth="2.5" />
                              <path d="M12 3a9 9 0 0 1 9 9" stroke={PINK} strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          </div>
                        ) : (
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 999,
                            background: "rgba(15,23,42,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>{i + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          fontSize: 16,
                          fontWeight: done ? 600 : active ? 700 : 500,
                          color: done ? DARK : active ? DARK : "#B0BAC9",
                          margin: 0,
                        }}>
                          {s.title}
                        </p>
                        <p style={{
                          fontSize: 14,
                          lineHeight: 1.4,
                          color: done ? MUTED : active ? MUTED : "#C4CCDA",
                          margin: "3px 0 0",
                        }}>
                          {s.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right: status badge */}
                    <div className="step-badge" style={{ flexShrink: 0 }}>
                      {done ? (
                        <span style={{
                          background: PALE_GREEN,
                          color: "#1D7A52",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 13,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}>
                          Complete
                        </span>
                      ) : active ? (
                        <span style={{
                          background: "rgba(232,24,92,0.12)",
                          color: PINK,
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 13,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}>
                          In progress
                        </span>
                      ) : null}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ margin: "24px 0", height: 1, background: BORDER }} />

          {/* Reassurance note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "rgba(232,24,92,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
            </div>
            <p style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: MUTED,
              margin: 0,
              paddingTop: 2,
            }}>
              This audit usually takes 30–60 seconds.<br />
              We'll prioritise the fixes most likely to improve your visibility, conversion and guest trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PulseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function DecoIllustration() {
  return (
    <svg width="180" height="72" viewBox="0 0 180 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* House */}
      <path d="M32 48 L32 30 L48 18 L64 30 L64 48 Z" stroke="#C4AA88" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <rect x="40" y="36" width="16" height="12" rx="1" stroke="#C4AA88" strokeWidth="1.5" fill="none" />
      <path d="M48 18 L48 12" stroke="#C4AA88" strokeWidth="1.5" strokeLinecap="round" />
      {/* Door arch */}
      <path d="M40 48 L40 40 Q48 34 56 40 L56 48" stroke="#C4AA88" strokeWidth="1.2" fill="none" />
      {/* Small window */}
      <rect x="33" y="33" width="6" height="6" rx="1" stroke="#C4AA88" strokeWidth="1.2" fill="none" />
      <rect x="57" y="33" width="6" height="6" rx="1" stroke="#C4AA88" strokeWidth="1.2" fill="none" />
      {/* Palm */}
      <line x1="16" y1="48" x2="16" y2="28" stroke="#C4AA88" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 28 Q8 22 4 26" stroke="#C4AA88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M16 28 Q10 18 14 14" stroke="#C4AA88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M16 28 Q22 20 26 23" stroke="#C4AA88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Sun */}
      <circle cx="136" cy="18" r="6" stroke="#C4AA88" strokeWidth="1.2" fill="none" />
      <line x1="136" y1="8" x2="136" y2="6" stroke="#C4AA88" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="136" y1="28" x2="136" y2="30" stroke="#C4AA88" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="126" y1="18" x2="124" y2="18" stroke="#C4AA88" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="146" y1="18" x2="148" y2="18" stroke="#C4AA88" strokeWidth="1.2" strokeLinecap="round" />
      {/* Waves */}
      <path d="M4 58 Q14 54 24 58 Q34 62 44 58 Q54 54 64 58" stroke="#C4AA88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M74 62 Q84 58 94 62 Q104 66 114 62 Q124 58 134 62" stroke="#C4AA88" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
