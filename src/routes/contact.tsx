import { createFileRoute } from "@tanstack/react-router";
import { business } from "@/features/business/data";
import { ContactDetails, OpeningHoursTable } from "@/features/contact/ContactDetails";
import { Container } from "@/shared/ui/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact Marios Garage — Call ${business.phoneDisplay}, Paphos` },
      {
        name: "description",
        content: `Call Marios Garage on ${business.phoneDisplay}. ${business.address}. Open Monday to Friday, 8:00 to 17:00.`,
      },
      { property: "og:title", content: "Contact Marios Garage, Paphos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: `Phone ${business.phoneDisplay}, open Monday to Friday, 8:00 to 17:00, in ${business.area}.`,
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="studio-backdrop pt-32 pb-20 text-on-ink md:pt-40 md:pb-28">
        <Container>
          <h1 className="type-display hero-rise max-w-3xl">Call the garage</h1>
          <p className="type-lead hero-rise mt-6 max-w-[56ch] text-on-ink-dim [animation-delay:80ms]">
            The quickest way to get your car looked at is a phone call. Tell Marios what the car is
            doing and he'll tell you what's involved.
          </p>
          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
            <ContactDetails />
            <OpeningHoursTable />
          </div>
        </Container>
      </section>

      <section aria-label="Map" className="bg-concrete py-16 md:py-20">
        <Container>
          <div className="overflow-hidden rounded-md border border-rule bg-paper">
            <iframe
              title={`Map showing ${business.name} at ${business.plusCode}`}
              src={business.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[22rem] w-full md:h-[28rem]"
            />
          </div>
          <p className="mt-3 text-sm text-steel">
            Plus code {business.plusCode}.{" "}
            <a
              href={business.googleListingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-graphite underline underline-offset-4"
            >
              Open the garage on Google Maps
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
