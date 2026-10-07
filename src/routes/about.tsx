import { createFileRoute } from "@tanstack/react-router";
import { business, trustPoints } from "@/features/business/data";
import { CallButton, DirectionsButton } from "@/features/contact/ContactDetails";
import { PhotoGallery } from "@/features/gallery/PhotoGallery";
import { PageHero } from "@/features/layout/PageHero";
import { VisitSteps } from "@/features/services/VisitSteps";
import { Section, SectionHeading } from "@/shared/ui/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Marios Garage — Trusted Mechanic in Paphos" },
      {
        name: "description",
        content:
          "Marios Garage is an independent car repair and maintenance workshop in Agia Varvara, Paphos, handling routine servicing and complex engine faults.",
      },
      { property: "og:title", content: "About Marios Garage, Paphos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content:
          "An independent Paphos workshop for routine servicing and difficult engine repairs.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        title="An independent garage in Paphos"
        intro={`${business.name} is a ${business.category.toLowerCase()} in ${business.area}, looking after local drivers' cars from routine servicing through to engine work that needs real diagnosis.`}
      />

      <Section labelledBy="how-title">
        <SectionHeading
          id="how-title"
          title="Straight answers, careful work"
          intro="Cars come in for two reasons: to be kept healthy, or because something has gone wrong that nobody has managed to explain. Both get the same attention."
        />
        <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {trustPoints.map((point) => (
            <li key={point.title} className="border-t-2 border-graphite pt-6">
              <h3 className="type-h3">{point.title}</h3>
              <p className="mt-3 max-w-[40ch] text-steel">{point.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" labelledBy="workshop-title">
        <SectionHeading id="workshop-title" title="Inside Marios Garage" />
        <PhotoGallery />
      </Section>

      <Section labelledBy="visit-title">
        <SectionHeading id="visit-title" title="How a visit works" />
        <VisitSteps />
      </Section>

      <Section tone="ink" labelledBy="cta-title">
        <h2 id="cta-title" className="type-h2 max-w-2xl">
          Have a problem you want looked at?
        </h2>
        <p className="type-lead mt-5 max-w-[56ch] text-on-ink-dim">
          A quick phone call is usually the fastest way to find out what's involved.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CallButton />
          <DirectionsButton />
        </div>
      </Section>
    </>
  );
}
