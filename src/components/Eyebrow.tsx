import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "muted";
}) {
  return (
    <div
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.16em]",
        tone === "brand" ? "text-brand" : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
