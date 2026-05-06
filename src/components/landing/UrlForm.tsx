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
    const trimmed = value.trim();
    if (!trimmed) {
      setErr("Please paste your Airbnb listing URL.");
      return;
    }
    try {
      const u = new URL(trimmed);
      if (!u.hostname.includes("airbnb.")) {
        setErr("That doesn't look like an Airbnb URL. Paste a link from airbnb.com.");
        return;
      }
    } catch {
      setErr("Please paste a full URL, including https://");
      return;
    }
    setErr("");
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handle} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
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
