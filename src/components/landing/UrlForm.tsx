import { ArrowRight } from "lucide-react";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function UrlForm({
  onSubmit,
  loading,
  className,
}: {
  onSubmit: (url: string) => void;
  loading?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    if (!raw) {
      setErr("Please paste your Airbnb listing URL.");
      return;
    }
    const normalised = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let u: URL;
    try {
      u = new URL(normalised);
    } catch {
      setErr("That URL doesn't look right. Paste a link from airbnb.com.");
      return;
    }
    if (!u.hostname.includes("airbnb.")) {
      setErr("That doesn't look like an Airbnb URL. Paste a link from airbnb.com.");
      return;
    }
    if (!/\/rooms\/\d+/.test(u.pathname)) {
      setErr(
        "Open the listing on airbnb.com, then copy the URL. We need the one with /rooms/ in it.",
      );
      return;
    }
    setErr("");
    onSubmit(normalised);
  };

  return (
    <form onSubmit={handle} className={cn("w-full", className)} noValidate>
      <label htmlFor="listing-url" className="sr-only">
        Airbnb listing URL
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="listing-url"
          type="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (err) setErr("");
          }}
          placeholder="https://www.airbnb.com/rooms/12345678"
          className="h-12 flex-1 rounded-lg border-border bg-card px-4 text-base shadow-sm"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-12 gap-2 rounded-lg px-5 text-sm font-semibold"
        >
          Audit my listing free
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      {err && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {err}
        </p>
      )}
    </form>
  );
}
