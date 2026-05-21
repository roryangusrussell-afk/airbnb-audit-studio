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

function isEffectivelyEmpty(current: string): boolean {
  return current.trim().length < 60;
}

function RewriteParagraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) {
    return (
      <p className="whitespace-pre-line text-[15px] leading-[1.8] text-foreground">
        {text}
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line text-[15px] leading-[1.8] text-foreground">
          {para}
        </p>
      ))}
    </div>
  );
}

function CurrentBlock({ current }: { current: string }) {
  const empty = !current || current.trim().length === 0;
  const sparse = !empty && isEffectivelyEmpty(current);
  return (
    <div
      className={`rounded-xl border p-4 ${
        empty || sparse ? "border-dashed bg-muted/20" : "border-border/60 bg-muted/20"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
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
        <p className="mt-2 text-[13px] italic text-muted-foreground/70">
          This section isn't filled in on your listing.
        </p>
      ) : (
        <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.65] text-muted-foreground">
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

function WhatChangedNote({ why, isAdd }: { why: string; isAdd: boolean }) {
  return (
    <div className="flex items-start gap-2 pt-1">
      <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-none text-muted-foreground/50" />
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground/55">
          {isAdd ? "What this adds" : "What changed"}
        </span>
        <p className="mt-0.5 text-[12.5px] leading-[1.6] text-muted-foreground">
          {why}
        </p>
      </div>
    </div>
  );
}

function RecommendedBlock({
  text,
  toneLabel,
  isAdd,
  toneWhy,
}: {
  text: string;
  toneLabel?: string;
  isAdd: boolean;
  toneWhy?: string;
}) {
  const safety = detectSafety(text);
  return (
    <div className="rounded-xl border border-brand/20 bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
            {isAdd ? "Suggested" : "Recommended"}
            {toneLabel ? ` · ${toneLabel}` : ""}
          </span>
          <SafetyPill state={safety} />
        </div>
        <CopyButton value={text} />
      </div>
      <div className="mt-3">
        <RewriteParagraphs text={text} />
      </div>
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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_3fr]">
      <CurrentBlock current={current} />
      <div className="space-y-3">
        <ToneSwitcher
          options={opts}
          activeTone={activeTone}
          onSelect={setActiveTone}
        />
        <RecommendedBlock
          text={active.text}
          toneLabel={active.tone}
          isAdd={isAdd}
          toneWhy={active.why}
        />
      </div>
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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_3fr]">
      <CurrentBlock current={current} />
      <div className="space-y-3">
        <RecommendedBlock text={rewrite.text} isAdd={isAdd} />
        {rewrite.why && <WhatChangedNote why={rewrite.why} isAdd={isAdd} />}
      </div>
    </div>
  );
}
