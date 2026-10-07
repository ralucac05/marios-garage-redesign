import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five stars with the last one partially filled to match a decimal rating. */
export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block size-[1em]">
            <Star
              className="absolute inset-0 size-full text-current opacity-25"
              strokeWidth={0}
              fill="currentColor"
            />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-[1em] text-signal" strokeWidth={0} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
