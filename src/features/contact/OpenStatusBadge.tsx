import { cn } from "@/lib/utils";
import { useOpenStatus } from "./openStatus";

/** "Open now until 17:00" with a status light. Falls back to the weekly hours before hydration. */
export function OpenStatusBadge({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const status = useOpenStatus();
  const label = status?.label ?? "Monday to Friday, 8:00 – 17:00";

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.95rem] font-medium",
        tone === "dark" ? "text-on-ink" : "text-graphite",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex size-2.5 rounded-full",
          status === null ? "bg-on-ink-dim/60" : status.open ? "bg-go" : "bg-[#e0695a]",
        )}
      >
        {status?.open ? (
          <span className="absolute inset-0 animate-ping rounded-full bg-go/60" />
        ) : null}
      </span>
      <span aria-live="polite">{label}</span>
    </p>
  );
}
