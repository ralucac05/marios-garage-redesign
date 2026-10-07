import { createFileRoute } from "@tanstack/react-router";
import {
  business,
  routineServices,
  routineServicesFooter,
  specialistServices,
} from "@/features/business/data";
import { BrandStrip } from "@/features/brands/BrandStrip";
import { CallButton, DirectionsButton } from "@/features/contact/ContactDetails";
import { PageHero } from "@/features/layout/PageHero";
import { ServiceList } from "@/features/services/ServiceList";
import { VisitSteps } from "@/features/services/VisitSteps";
import { Section, SectionHeading } from "@/shared/ui/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Servicing, Brakes, A/C & Engine Repair | Marios Garage" },
      {
        name: "description",
        content:
          "Oil changes, brake servicing, A/C, electrical repairs, engine diagnostics and complex engine repairs at Marios Garage, Paphos.",
      },
      { property: "og:title", content: "Services at Marios Garage, Paphos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: `Routine servicing and engine diagnostics for ${business.makes}.`,
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        title="Everything from a service to a stripped engine"
        intro="Marios Garage covers the maintenance every car needs and the difficult mechanical work many garages turn away."
      >
        <CallButton />
      </PageHero>

      <Section labelledBy="services-title">
        <h2 id="services-title" className="sr-only">
          Services
        </h2>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <ServiceList
            title="Routine maintenance"
            services={routineServices}
            note={routineServicesFooter}
          />
          <ServiceList title="Diagnostics and repair" services={specialistServices} />
        </div>
      </Section>

      <Section tone="paper" labelledBy="makes-title">
        <SectionHeading
          id="makes-title"
          title="German and Japanese car specialist"
          intro="Complete maintenance, diagnostics and mechanical repairs for German and Japanese vehicles, from routine servicing to complex engine work."
        />
        <BrandStrip />
      </Section>

      <Section labelledBy="visit-title">
        <SectionHeading id="visit-title" title="How a visit works" />
        <VisitSteps />
      </Section>

      <Section tone="ink" labelledBy="cta-title">
        <h2 id="cta-title" className="type-h2 max-w-2xl">
          Not sure what the car needs?
        </h2>
        <p className="type-lead mt-5 max-w-[56ch] text-on-ink-dim">
          Describe what it's doing over the phone. You'll get a straight answer about what's likely
          involved.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CallButton />
          <DirectionsButton />
        </div>
      </Section>
    </>
  );
}
