import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  business,
  routineServices,
  routineServicesFooter,
  specialistServices,
  customerReviews,
} from "@/features/business/data";
import { BrandStrip } from "@/features/brands/BrandStrip";
import { CinematicHero } from "@/features/hero/CinematicHero";
import { CAR_POSTER } from "@/features/hero/carModel";
import { PhotoGallery } from "@/features/gallery/PhotoGallery";
import { RatingSummary, ReviewGrid, ReviewQuote } from "@/features/reviews/Reviews";
import { ContactDetails, OpeningHoursTable } from "@/features/contact/ContactDetails";
import { ServiceList } from "@/features/services/ServiceList";
import { VisitSteps } from "@/features/services/VisitSteps";
import { Section, SectionHeading } from "@/shared/ui/Section";
import { ButtonRouterLink } from "@/shared/ui/Button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marios Garage — Car Service & Engine Repair in Paphos" },
      {
        name: "description",
        content: `Marios Garage in Paphos: servicing, brakes, A/C, electrical work and engine diagnostics for ${business.makes}. Call ${business.phoneDisplay}.`,
      },
      { property: "og:title", content: "Marios Garage — Car Service & Engine Repair in Paphos" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: CAR_POSTER.src },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: `Routine maintenance and difficult engine repairs, handled properly. Rated 4.3 on Google. Call ${business.phoneDisplay}.`,
      },
    ],
    links: [
      // The still of the car is the hero's largest image: fetch it early.
      {
        rel: "preload",
        as: "image",
        href: CAR_POSTER.src,
        imageSrcSet: CAR_POSTER.srcSet,
        imageSizes: "(min-width: 1024px) 62vw, 100vw",
        fetchPriority: "high",
      },
    ],
  }),
  component: HomePage,
});

const featured = customerReviews[0];

function HomePage() {
  return (
    <>
      <CinematicHero />

      <Section id="services" labelledBy="services-title">
        <SectionHeading
          id="services-title"
          title="Servicing, diagnostics and repair"
          intro="The everyday maintenance that keeps a car healthy, and the difficult faults that need someone to follow the evidence instead of replacing parts and hoping."
          aside={
            <ButtonRouterLink to="/services" variant="quiet">
              All services
              <ArrowRight aria-hidden="true" />
            </ButtonRouterLink>
          }
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <ServiceList
            title="Routine maintenance"
            services={routineServices}
            note={routineServicesFooter}
          />
          <ServiceList title="Diagnostics and repair" services={specialistServices} />
        </div>
      </Section>

      <Section tone="paper" labelledBy="visit-title">
        <SectionHeading
          id="visit-title"
          title="How a visit works"
          intro="You talk to the person who will work on the car, and nothing is done without your say-so."
        />
        <VisitSteps />
      </Section>

      <Section labelledBy="reviews-title">
        <h2 id="reviews-title" className="sr-only">
          What customers say
        </h2>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <RatingSummary className="lg:col-span-4" />
          {featured ? (
            <div className="lg:col-span-8">
              <ReviewQuote review={featured} featured />
            </div>
          ) : null}
        </div>
        <ReviewGrid ids={["german-car-repair", "mercedes-knocking-noise"]} className="mt-20" />
        <ButtonRouterLink to="/reviews" variant="quiet" className="mt-12">
          More reviews
          <ArrowRight aria-hidden="true" />
        </ButtonRouterLink>
      </Section>

      <Section tone="paper" labelledBy="makes-title">
        <SectionHeading
          id="makes-title"
          title="Specialists in German and Japanese cars"
          intro="Years of hands-on work across German and Japanese makes, from routine servicing to engine-deep repairs."
        />
        <BrandStrip />
      </Section>

      <Section labelledBy="workshop-title">
        <SectionHeading id="workshop-title" title="Inside the workshop" />
        <PhotoGallery />
      </Section>

      <Section tone="ink" id="visit" labelledBy="contact-title">
        <h2 id="contact-title" className="type-h2 max-w-2xl">
          Bring it in, or call first
        </h2>
        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <ContactDetails />
          <OpeningHoursTable />
        </div>
      </Section>
    </>
  );
}
