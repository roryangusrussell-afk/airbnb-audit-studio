import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/lib/api";

const RATINGS = [
  { value: "useful", label: "Useful" },
  { value: "inaccurate", label: "Inaccurate" },
  { value: "confusing", label: "Confusing" },
  { value: "missing_context", label: "Missing context" },
] as const;

type FeedbackRating = (typeof RATINGS)[number]["value"];

export function FeedbackButton({
  listingId,
  email,
  url,
  variant = "pill",
}: {
  listingId: string;
  email?: string;
  url?: string;
  variant?: "pill" | "panel";
}) {
  const [open, setOpen] = useState(false);

  const trigger =
    variant === "panel" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-start gap-3 rounded-2xl border border-brand-border bg-brand-soft p-4 text-left transition-colors hover:border-brand hover:bg-brand-soft/80"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-brand">
          <MessageSquare className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
            Beta feedback wanted
          </span>
          <span className="mt-1 block text-[14px] font-semibold text-foreground">
            How did this audit land for you?
          </span>
          <span className="mt-1 block text-[13px] text-muted-foreground">
            Two clicks. Tells us what's useful, what's off, what's missing.
          </span>
        </span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <MessageSquare className="h-3 w-3" />
        Beta feedback
      </button>
    );

  return (
    <>
      {trigger}

      {open && (
        <FeedbackModal
          listingId={listingId}
          email={email}
          url={url}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function FeedbackModal({
  listingId,
  email,
  url,
  onClose,
}: {
  listingId: string;
  email?: string;
  url?: string;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sent">("idle");

  const handleSubmit = () => {
    if (!selected) return;
    setState("sent");
    submitFeedback({
      listingId,
      rating: selected,
      comment: comment.trim(),
      email,
      url,
    });
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border bg-card p-6 shadow-elevated">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {state === "sent" ? (
          <div className="py-4 text-center">
            <p className="text-base font-semibold text-foreground">Thanks for the feedback.</p>
            <p className="mt-1 text-sm text-muted-foreground">It helps us improve the audit.</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Beta feedback
            </p>
            <h3 className="mt-1.5 text-base font-bold tracking-tight text-foreground">
              Is this result useful?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us if something looks wrong or unclear.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelected(r.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    selected === r.value
                      ? "border-brand-border bg-brand-soft text-brand"
                      : "border-border bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note (optional)"
              rows={3}
              className="mt-3 w-full resize-none rounded-lg border bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />

            <Button
              className="mt-3 h-9 w-full bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold disabled:opacity-40"
              disabled={!selected}
              onClick={handleSubmit}
            >
              Send feedback
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
