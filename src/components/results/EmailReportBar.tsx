import { useState } from "react";
import { ArrowRight, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendReport } from "@/lib/api";
import type { AuditResponse } from "@/lib/types";

export function EmailReportBar({
  email,
  data,
}: {
  email: string;
  data: AuditResponse;
}) {
  const [state, setState] = useState<"idle" | "sent" | "dismissed">("idle");

  if (state === "dismissed" || !email) return null;

  const handleSend = async () => {
    setState("sent");
    sendReport({
      email,
      listingId: data.listingId,
      score: data.score,
      title: data.title,
    });
  };

  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:gap-4">
      <Mail className="h-4 w-4 flex-none text-muted-foreground" />
      <div className="flex-1 text-sm">
        <span className="font-medium text-foreground">Want to refer back to this later? </span>
        <span className="text-muted-foreground">
          We'll send a copy to <span className="text-foreground">{email}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSend}
          disabled={state === "sent"}
          className="gap-1.5"
        >
          {state === "sent" ? "Sent." : (
            <>
              Send report <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
        <button
          type="button"
          onClick={() => setState("dismissed")}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
