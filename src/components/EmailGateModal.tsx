import { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmailGateModal({
  open,
  onOpenChange,
  onSubmit,
  title = "Save these rewrites to your inbox?",
  description = "We'll email you a copy of the audit so you can come back to the rewrites whenever you're ready to paste them in. No spam.",
  cta = "Email me my report",
  dismissLabel = "Skip, I'll just read it here",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (email: string) => void;
  title?: string;
  description?: string;
  cta?: string;
  dismissLabel?: string;
}) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Please enter a valid email.");
      return;
    }
    setErr("");
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handle} className="space-y-3">
          <Input
            type="email"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (err) setErr("");
            }}
            placeholder="you@host.com"
            className="h-11"
          />
          {err && <p className="text-sm text-danger">{err}</p>}
          <Button type="submit" className="w-full h-11">
            {cta}
          </Button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="block w-full text-center text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {dismissLabel}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
