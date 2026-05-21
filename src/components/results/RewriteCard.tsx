import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import type {
  MultiToneRewrite,
  SingleRewrite,
  RewriteOption,
  RewriteTone,
} from "@/lib/types";

const TONE_ORDER: RewriteTone[] = ["Concise", "Premium", "Warm"];

type Intent =
  | "Adding section"
  | "Added specifics"
  | "Tightened"
  | "Restructured";

type SafetyState = "ready" | "confirm";

const PLACEHOLDER_RX = /\[[^\]]+\]/;

function detectSafety(text: string): SafetyState {
  return PLACEHOLDER_RX.test(text) ? "confirm" : "ready";
}

function SafetyPill({ state }: { state: SafetyState }) {
  if (state === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-success-border bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        Ready to copy
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning-border bg-warning-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Confirm first
    </span>
  );
}

function deriveIntent(current: string, recommended: string): Intent {
  const cur = current.trim().length;
  const rec = recommended.trim().length;
  if (cur === 0 || (cur > 0 && rec >= cur * 2.5)) return "Adding section";
  const ratio = rec / cur;
  if (ratio < 0.75) return "Tightened";
  if (ratio > 1.4) return "Added specifics";
  return "Restructured";
}

function isEffectivelyEmpty(current: string): boolean {
  return current.trim().length < 60;
}

function CurrentBlock({ current }: { current: string }) {
  const empty = !current || current.trim().length === 0;
  const sparse = !empty && isEffectivelyEmpty(current);
  return (
    <div
      className={`rounded-xl border p-4 ${
        empty || sparse ? "border-dashed bg-muted/30" : "bg-muted/40"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Current
        </span>
        {sparse && (
          <span className="rounded-full border border-warning-border bg-warning-soft px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-warning">
            Sparse
          </span>
        )}
        {empty && (
          <span className="rounded-full border border-warning-border bg-warning-soft px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-warning">
            Missing
          </span>
        )}
      </div>
      {empty ? (
        <p className="mt-2 text-[13.5px] italic text-muted-foreground">
          This section isn't filled in on your listing.
        </p>
      ) : (
        <p className="mt-2 whitespace-pre-line text-[13.5px] leading-7 text-foreground">
          {current}
        </p>
      )}
    </div>
  );
}

function KeepAsIsBlock({ why, sectionMissing }: { why?: string; sectionMissing?: boolean }) {
  if (sectionMissing) {
    return (
      <div className="rounded-xl border border-warning-border bg-warning-soft p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-warning">
            Section not filled in
          </div>
        </div>
        {why && (
          <p className="mt-2 text-[13px] leading-5 text-foreground">{why}</p>
        )}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-success-border bg-success-soft p-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-success">
          This section is working
        </div>
      </div>
      {why && (
        <p className="mt-2 text-[13px] leading-5 text-foreground">{why}</p>
      )}
    </div>
  );
}

function DiagnosisBlock({
  why,
  isAdd,
}: {
  why: string;
  isAdd: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {isAdd ? "What this draft adds" : "Changes in this rewrite"}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-[13.5px] leading-7 text-foreground">
        {why}
      </p>
    </div>
  );
}

function IntentBadge({ intent }: { intent: Intent }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {intent}
    </span>
  );
}

function RecommendedBlock({
  text,
  toneLabel,
  intent,
  isAdd,
  toneWhy,
}: {
  text: string;
  toneLabel?: string;
  intent: Intent;
  isAdd: boolean;
  toneWhy?: string;
}) {
  const safety = detectSafety(text);
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            {isAdd ? "Suggested" : "Recommended"}
            {toneLabel ? ` · ${toneLabel}` : ""}
          </span>
          <IntentBadge intent={intent} />
          <SafetyPill state={safety} />
        </div>
        <CopyButton value={text} />
      </div>
      <p className="mt-2 whitespace-pre-line text-[14px] leading-7 text-foreground">
        {text}
      </p>
      {safety === "confirm" && (
        <p className="mt-3 text-[12px] leading-5 text-warning">
          Items in [brackets] are placeholders. Confirm or remove each one before publishing.
        </p>
      )}
      {toneWhy && toneLabel && (
        <p className="mt-3 border-t pt-3 text-[12.5px] leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">
            Why {toneLabel.toLowerCase()}:
          </span>{" "}
          {toneWhy}
        </p>
      )}
    </div>
  );
}

function ToneSwitcher({
  options,
  activeTone,
  onSelect,
}: {
  options: RewriteOption[];
  activeTone: RewriteTone;
  onSelect: (tone: RewriteTone) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt.tone === activeTone;
        return (
          <button
            key={opt.tone}
            type="button"
            onClick={() => onSelect(opt.tone)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold transition-colors ${
              active
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {opt.tone}
            {opt.recommended && (
              <span
                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  active ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
                }`}
              >
                Pick
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function MultiToneRewriteCard({
  current,
  rewrite,
}: {
  current: string;
  rewrite: MultiToneRewrite;
}) {
  const opts = useMemo(() => {
    const list = rewrite.options ?? [];
    const order = new Map(TONE_ORDER.map((t, i) => [t, i]));
    return [...list].sort(
      (a, b) => (order.get(a.tone) ?? 99) - (order.get(b.tone) ?? 99),
    );
  }, [rewrite.options]);

  const recommendedTone = useMemo(() => {
    return opts.find((o) => o.recommended)?.tone ?? opts[0]?.tone ?? "Concise";
  }, [opts]);

  const [activeTone, setActiveTone] = useState<RewriteTone>(recommendedTone);
  const active = opts.find((o) => o.tone === activeTone) ?? opts[0];

  if (rewrite.keepAsIs) {
    return (
      <div className="space-y-3">
        <CurrentBlock current={current} />
        <KeepAsIsBlock why={rewrite.why} sectionMissing={!current || current.trim().length === 0} />
      </div>
    );
  }

  if (!active) {
    return <CurrentBlock current={current} />;
  }

  const isAdd = !current || current.trim().length === 0;
  const intent = deriveIntent(current, active.text);

  return (
    <div className="space-y-3">
      <CurrentBlock current={current} />
      <ToneSwitcher
        options={opts}
        activeTone={activeTone}
        onSelect={setActiveTone}
      />
      <RecommendedBlock
        text={active.text}
        toneLabel={active.tone}
        intent={intent}
        isAdd={isAdd}
        toneWhy={active.why}
      />
    </div>
  );
}

export function SingleRewriteCard({
  current,
  rewrite,
}: {
  current: string;
  rewrite: SingleRewrite;
}) {
  if (rewrite.keepAsIs) {
    return (
      <div className="space-y-3">
        <CurrentBlock current={current} />
        <KeepAsIsBlock why={rewrite.why} sectionMissing={!current || current.trim().length === 0} />
      </div>
    );
  }

  if (!rewrite.text) {
    return <CurrentBlock current={current} />;
  }

  const isAdd = !current || current.trim().length === 0;
  const intent = deriveIntent(current, rewrite.text);

  return (
    <div className="space-y-3">
      <CurrentBlock current={current} />
      {rewrite.why && <DiagnosisBlock why={rewrite.why} isAdd={isAdd} />}
      <RecommendedBlock text={rewrite.text} intent={intent} isAdd={isAdd} />
    </div>
  );
}
