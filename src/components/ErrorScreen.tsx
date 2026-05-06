import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorScreen({
  message,
  onRetry,
  onReset,
}: {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight">Audit failed</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onRetry} className="h-11">Try again</Button>
          <Button variant="outline" onClick={onReset} className="h-11">
            Audit a different listing
          </Button>
        </div>
      </div>
    </div>
  );
}
