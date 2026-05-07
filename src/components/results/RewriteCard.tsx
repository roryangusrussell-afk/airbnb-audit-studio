import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import type {
  MultiToneRewrite,
  SingleRewrite,
  RewriteOption,
  RewriteTone,
} from "@/lib/types";

const TONE_ORDER: RewriteTone[] = ["Concise", "Premium", "Warm"];

function CurrentBlock({ current }: { current: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Current
      </div>
      {current ? (
        <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-foreground">
          {current}
        </p>
      ) : (
        <p className="mt-2 text-[13px] italic text-muted-foreground">
          Not detected in this listing's data.
        </p>
      )}
    </div>
  );
}

function KeepAsIsBlock({ why }: { why?: string }) {
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

function RecommendedBlock({
  text,
  why,
  toneLabel,
}: {
  text: string;
  why?: string;
  toneLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-soft p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
            Recommended{toneLabel ? ` · ${toneLabel}` : ""}
          </span>
        </div>
        <CopyButton value={text} />
      </div>
      <p className="mt-2 whitespace-pre-line text-[13.5px] leading-6 text-foreground">
        {text}
      </p>
      {why && (
        <div className="mt-3 border-t border-brand-border/60 pt-3 text-[12.5px] leading-5 text-muted-foreground">
          <span className="font-semibold text-foreground">Why this works: </span>
          {why}
        </div>
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
        <KeepAsIsBlock why={rewrite.why} />
      </div>
    );
  }

  if (!active) {
    return <CurrentBlock current={current} />;
  }

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
        why={active.why}
        toneLabel={active.tone}
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
        <KeepAsIsBlock why={rewrite.why} />
      </div>
    );
  }

  if (!rewrite.text) {
    return <CurrentBlock current={current} />;
  }

  return (
    <div className="space-y-3">
      <CurrentBlock current={current} />
      <RecommendedBlock text={rewrite.text} why={rewrite.why} />
    </div>
  );
}
