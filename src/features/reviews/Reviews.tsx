import { ArrowUpRight } from "lucide-react";
import { customerReviews, reviewSummary, type CustomerReview } from "@/features/business/data";
import { ButtonLink } from "@/shared/ui/Button";
import { Stars } from "@/shared/ui/Stars";
import { cn } from "@/lib/utils";

export function RatingSummary({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="type-figure text-[clamp(5rem,10vw,7.5rem)] leading-[0.85] text-ink">
        {reviewSummary.rating}
      </p>
      <Stars rating={reviewSummary.rating} className="mt-4 text-2xl text-graphite" />
      <p className="mt-3 text-steel">
        Average from {reviewSummary.count} {reviewSummary.source}
      </p>
      <ButtonLink
        href={reviewSummary.url}
        target="_blank"
        rel="noreferrer"
        variant="quiet"
        className="mt-7"
      >
        Read them on Google
        <ArrowUpRight aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}

/** A customer review: the highlighted line large, the full review as written beneath it. */
export function ReviewQuote({
  review,
  featured = false,
}: {
  review: CustomerReview;
  featured?: boolean;
}) {
  return (
    <figure className={cn(featured ? "" : "border-t-2 border-graphite pt-6")}>
      <blockquote>
        <p
          className={cn(
            "font-display font-bold text-graphite",
            featured
              ? "text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.02]"
              : "text-[1.75rem] leading-[1.08]",
          )}
        >
          “{review.highlight}”
        </p>
        <p
          className={cn(
            "mt-5 max-w-[62ch] whitespace-pre-line text-steel",
            featured && "type-lead",
          )}
        >
          {review.text}
        </p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 text-sm text-steel">
        <Stars rating={5} className="text-graphite" />
        <span>Customer review on Google</span>
      </figcaption>
    </figure>
  );
}

export function ReviewGrid({ ids, className }: { ids?: string[]; className?: string }) {
  const reviews = ids ? customerReviews.filter((r) => ids.includes(r.id)) : customerReviews;
  return (
    <div className={cn("grid items-start gap-x-10 gap-y-14 md:grid-cols-2", className)}>
      {reviews.map((review) => (
        <ReviewQuote key={review.id} review={review} />
      ))}
    </div>
  );
}
