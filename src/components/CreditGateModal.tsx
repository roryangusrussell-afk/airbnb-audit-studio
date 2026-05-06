import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyButton } from "@/components/CopyButton";

export function CreditGateModal({
  open,
  onOpenChange,
  email,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  email: string;
}) {
  const refCode = email ? btoa(email).slice(0, 10) : "";
  const link = `https://airbnb-audit-rho.vercel.app/audit?ref=${refCode}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">You've used your free audit</DialogTitle>
          <DialogDescription>
            Share with another host to unlock another. Each referral unlocks one more
            free audit.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground break-all">
          {link}
        </div>
        <CopyButton value={link} label="Copy my link" resetMs={2000} />
      </DialogContent>
    </Dialog>
  );
}
