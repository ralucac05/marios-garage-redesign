import { createFileRoute } from "@tanstack/react-router";
import { reviewSummary } from "@/features/business/data";
import { CallButton } from "@/features/contact/ContactDetails";
import { PageHero } from "@/features/layout/PageHero";
import { RatingSummary, ReviewGrid } from "@/features/reviews/Reviews";
import { Section } from "@/shared/ui/Section";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Marios Garage, Paphos" },
      {
        name: "description",
        content: `Marios Garage is rated ${reviewSummary.rating} from ${reviewSummary.count} Google reviews by drivers in Paphos, Cyprus.`,
      },
      { property: "og:title", content: "Reviews of Marios Garage, Paphos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: `Rated ${reviewSummary.rating} out of 5 from ${reviewSummary.count} Google reviews.`,
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <>
      <PageHero
        title={`Rated ${reviewSummary.rating} on Google`}
        intro={`${reviewSummary.count} customers have rated Marios Garage on its Google listing. A selection of their reviews is below, exactly as written.`}
      />

      <Section labelledBy="reviews-title">
        <h2 id="reviews-title" className="sr-only">
          Customer reviews
        </h2>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <RatingSummary className="lg:sticky lg:top-28" />
          </div>
          <ReviewGrid className="lg:col-span-8 md:grid-cols-1 lg:grid-cols-1" />
        </div>
      </Section>

      <Section tone="ink" labelledBy="cta-title">
        <h2 id="cta-title" className="type-h2 max-w-2xl">
          Bring your car in
        </h2>
        <p className="type-lead mt-5 max-w-[56ch] text-on-ink-dim">
          Call the garage and describe the problem. You'll get an honest view of what it needs.
        </p>
        <div className="mt-9">
          <CallButton />
        </div>
      </Section>
    </>
  );
}
