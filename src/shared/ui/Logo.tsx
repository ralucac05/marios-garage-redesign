import { cn } from "@/lib/utils";

/** A hex nut seen face-on: the workshop's mark. */
export function NutMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25Z" fill="var(--signal)" />
      <circle cx="16" cy="16" r="5.6" fill="var(--ink)" />
      <circle
        cx="16"
        cy="16"
        r="5.6"
        fill="none"
        stroke="var(--ink-deep)"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <NutMark />
      <span className="font-display text-[1.45rem] leading-none font-bold tracking-[0.01em]">
        Marios Garage
      </span>
    </span>
  );
}
