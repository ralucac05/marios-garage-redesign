import { Navigation, Phone } from "lucide-react";
import { business } from "@/features/business/data";

/** Thumb-reach actions on phones: most visitors want to call or find the garage. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-deep/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="grid grid-cols-[1.6fr_1fr] gap-2">
        <a
          href={business.phoneHref}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-signal font-semibold text-ink-deep"
        >
          <Phone aria-hidden="true" className="size-5" />
          Call the garage
        </a>
        <a
          href={business.googleListingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 font-semibold text-on-ink"
        >
          <Navigation aria-hidden="true" className="size-5" />
          Directions
        </a>
      </div>
    </div>
  );
}
