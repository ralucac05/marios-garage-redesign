import { Clock, MapPin } from "lucide-react";
import { business, reviewSummary } from "@/features/business/data";
import { CallButton, DirectionsButton } from "@/features/contact/ContactDetails";
import { OpenStatusBadge } from "@/features/contact/OpenStatusBadge";
import { RotatingCar } from "@/features/hero/RotatingCar";
import { useScrollProgress } from "@/features/hero/useScrollRotation";
import { Container } from "@/shared/ui/Section";
import { Stars } from "@/shared/ui/Stars";

/**
 * Home hero. The car's angle and door clip follow the section's native scroll
 * progress; nothing is pinned and scrolling is never intercepted.
 */
export function CinematicHero() {
  const { ref, progress } = useScrollProgress<HTMLElement>();

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="studio-backdrop relative overflow-hidden text-on-ink"
    >
      <Container className="grid min-h-[min(100svh,64rem)] grid-rows-[1fr_auto] pt-24 md:pt-28">
        <div className="grid items-center gap-y-8 py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-12">
          <div className="lg:col-span-6 xl:col-span-5">
            <OpenStatusBadge className="hero-rise" />
            <h1 id="hero-title" className="type-display hero-rise mt-5 [animation-delay:60ms]">
              Car servicing and engine repair in Paphos
            </h1>
            <p className="type-lead hero-rise mt-6 max-w-[46ch] text-on-ink-dim [animation-delay:120ms]">
              From routine maintenance to the engine faults that are hard to pin down, on{" "}
              {business.makes}.
            </p>
            <div className="hero-rise mt-9 flex flex-wrap gap-3 [animation-delay:180ms]">
              <CallButton />
              <DirectionsButton />
            </div>
          </div>

          <div className="order-first -mx-5 sm:-mx-8 lg:order-none lg:col-span-6 xl:col-span-7 lg:mr-[calc((min(100vw,76rem)_-_100vw)/2_-_2rem)] lg:ml-0">
            <RotatingCar progress={progress} />
          </div>
        </div>

        <dl className="grid grid-cols-1 border-t border-white/10 py-5 text-[0.95rem] sm:grid-cols-3 sm:gap-6">
          <div className="py-1.5">
            <dt className="sr-only">Google rating</dt>
            <dd className="flex items-center gap-3">
              <Stars rating={reviewSummary.rating} className="text-base" />
              <a
                href={reviewSummary.url}
                target="_blank"
                rel="noreferrer"
                className="text-on-ink-dim underline-offset-4 hover:text-on-ink hover:underline"
              >
                <span className="font-semibold text-on-ink">{reviewSummary.rating}</span> from{" "}
                {reviewSummary.count} Google reviews
              </a>
            </dd>
          </div>
          <div className="py-1.5 text-on-ink-dim">
            <dt className="sr-only">Opening hours</dt>
            <dd className="flex items-center gap-3">
              <Clock aria-hidden="true" className="size-4 text-signal" />
              Monday to Friday, 8:00 – 17:00
            </dd>
          </div>
          <div className="py-1.5 text-on-ink-dim">
            <dt className="sr-only">Location</dt>
            <dd className="flex items-center gap-3">
              <MapPin aria-hidden="true" className="size-4 text-signal" />
              {business.area}
            </dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
