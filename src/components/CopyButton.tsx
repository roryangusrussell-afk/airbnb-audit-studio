import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  className,
  label = "Copy",
  resetMs = 1500,
}: {
  value: string;
  className?: string;
  label?: string;
  resetMs?: number;
}) {
  const { copied, copy } = useCopyToClipboard(resetMs);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => copy(value)}
      className={cn("h-8 gap-1.5 text-xs", className)}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copied!
        </>
      ) : (
        label
      )}
    </Button>
  );
}
