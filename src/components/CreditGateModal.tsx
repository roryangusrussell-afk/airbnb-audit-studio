import { X, Sparkles, Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export function CreditGateModal({
  open,
  onOpenChange,
  email,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  email: string;
}) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/?ref=${refCode}`;
  const { copied, copy } = useCopyToClipboard(2000);

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px" }}
      role="dialog"
      aria-modal="true"
      aria-label="Credit gate: audit another listing"
    >
      {/* Overlay */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)" }}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 820,
        background: "#fff",
        borderRadius: 24,
        border: "1px solid rgba(229,231,235,0.8)",
        boxShadow: "0 24px 64px rgba(17,24,39,0.16), 0 4px 16px rgba(17,24,39,0.08)",
        padding: "clamp(24px, 4vw, 40px)",
        fontFamily: "Inter, sans-serif",
      }}>

        {/* Close button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => onOpenChange(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#6b7280",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLButtonElement).style.color = "#111827"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#6b7280"; }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Sparkles size={18} style={{ color: "#e8185c", flexShrink: 0 }} />
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#e8185c",
              lineHeight: 1,
            }}>
              Free audits used
            </span>
          </div>
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "#111827",
            margin: "0 0 12px",
          }}>
            You've used your 5 free audits.
          </h2>
          <p style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            lineHeight: 1.5,
            color: "#6b7280",
            margin: 0,
          }}>
            One referral unlocks another audit free. Or buy credits and check every listing you manage.
          </p>
        </header>

        {/* Two-column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
          className="credit-modal-grid"
        >
          {/* Left: Free path */}
          <div style={{
            background: "#faf9f7",
            border: "1px solid #e5e7eb",
            borderRadius: 18,
            padding: 28,
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#374151",
              background: "#eeeeec",
              borderRadius: 999,
              padding: "6px 11px",
              marginBottom: 20,
            }}>
              Free
            </span>

            <h3 style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#111827",
              margin: "0 0 10px",
            }}>
              Refer a host, get one free
            </h3>

            <p style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "#4b5563",
              margin: "0 0 18px",
            }}>
              Know a host whose listing could score better? Send them your link. When they run their first audit, yours unlocks instantly.
            </p>

            {/* Referral URL field */}
            <input
              readOnly
              value={link}
              onFocus={e => e.currentTarget.select()}
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: "13px 16px",
                fontSize: 13,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                color: "#4b5563",
                marginBottom: 14,
                outline: "none",
                cursor: "text",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            />

            {/* Copy button */}
            <button
              type="button"
              onClick={() => copy(link)}
              style={{
                width: "100%",
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px solid rgba(232,24,92,0.38)",
                borderRadius: 12,
                background: "#fff",
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                cursor: "pointer",
                transition: "background 150ms ease, border-color 150ms ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.background = "#fdf2f5"; b.style.borderColor = "#e8185c"; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.background = "#fff"; b.style.borderColor = "rgba(232,24,92,0.38)"; }}
            >
              {copied
                ? <><Check size={15} style={{ color: "#e8185c" }} /> Copied!</>
                : <><Copy size={15} style={{ color: "#e8185c" }} /> Copy my link</>
              }
            </button>
          </div>

          {/* Right: Buy path */}
          <div style={{
            background: "#fdf2f5",
            border: "1px solid rgba(232,24,92,0.14)",
            borderRadius: 18,
            padding: 28,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#e8185c",
              background: "rgba(232,24,92,0.12)",
              borderRadius: 999,
              padding: "6px 13px",
              marginBottom: 20,
            }}>
              Buy
            </span>

            <h3 style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#111827",
              margin: "0 0 10px",
            }}>
              Buy credits
            </h3>

            <p style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "#4b5563",
              margin: "0 0 20px",
            }}>
              Most hosts manage multiple listings. One missed issue can cost you bookings for months. Credits don't expire: buy once, audit whenever.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <BuyRow
                label="1 audit"
                price="$19"
                aria-label="Buy one audit for 19 dollars"
              />
              <BuyRow
                label="Up to 10 Fix Plans"
                price="$79"
                originalPrice="$190"
                savingsNote="Save $111"
                aria-label="Buy up to ten Fix Plans for 79 dollars"
              />
              <BuyRow
                label="Portfolio / Enterprise"
                contact
                aria-label="Contact us for portfolio or enterprise audits"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .credit-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function BuyRow({
  label,
  price,
  originalPrice,
  savingsNote,
  contact,
  "aria-label": ariaLabel,
}: {
  label: string;
  price?: string;
  originalPrice?: string;
  savingsNote?: string;
  contact?: boolean;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "16px 18px",
        minHeight: 64,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
        fontFamily: "inherit",
        outline: "none",
      }}
      onMouseEnter={e => {
        const b = e.currentTarget;
        b.style.background = "#fff7fa";
        b.style.borderColor = "rgba(232,24,92,0.35)";
        b.style.transform = "translateY(-1px)";
        b.style.boxShadow = "0 8px 20px rgba(17,24,39,0.06)";
      }}
      onMouseLeave={e => {
        const b = e.currentTarget;
        b.style.background = "#fff";
        b.style.borderColor = "#e5e7eb";
        b.style.transform = "translateY(0)";
        b.style.boxShadow = "none";
      }}
      onFocus={e => { e.currentTarget.style.outline = "2px solid rgba(232,24,92,0.35)"; e.currentTarget.style.outlineOffset = "2px"; }}
      onBlur={e => { e.currentTarget.style.outline = "none"; }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{label}</span>
      {contact ? (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 700, color: "#e8185c" }}>
          Contact us <span style={{ fontSize: 17, lineHeight: 1 }}>→</span>
        </span>
      ) : (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {savingsNote && (
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#16a34a",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              padding: "3px 7px",
            }}>
              {savingsNote}
            </span>
          )}
          {originalPrice && (
            <span style={{ fontSize: 14, color: "#9ca3af", textDecoration: "line-through" }}>
              {originalPrice}
            </span>
          )}
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{price}</span>
          <span style={{ fontSize: 16, color: "#9ca3af", lineHeight: 1 }}>→</span>
        </span>
      )}
    </button>
  );
}
