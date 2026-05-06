import { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EmailGateModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (email: string) => void;
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
          <DialogTitle className="text-xl">Enter your email to see your results</DialogTitle>
          <DialogDescription>
            We'll send a copy of the audit so you can refer back to it later. No spam.
          </DialogDescription>
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
            See my audit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
