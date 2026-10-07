import { MapPin, Navigation, Phone } from "lucide-react";
import { business, openingHours } from "@/features/business/data";
import { ButtonLink } from "@/shared/ui/Button";
import { cn } from "@/lib/utils";
import { OpenStatusBadge } from "./OpenStatusBadge";
import { useOpenStatus } from "./openStatus";

export function CallButton({ size = "lg", className }: { size?: "md" | "lg"; className?: string }) {
  return (
    <ButtonLink href={business.phoneHref} size={size} className={className}>
      <Phone aria-hidden="true" />
      Call {business.phoneDisplay}
    </ButtonLink>
  );
}

export function DirectionsButton({
  size = "lg",
  variant = "outline",
  className,
}: {
  size?: "md" | "lg";
  variant?: "outline" | "quiet";
  className?: string;
}) {
  return (
    <ButtonLink
      href={business.googleListingUrl}
      target="_blank"
      rel="noreferrer"
      size={size}
      variant={variant}
      className={className}
    >
      <Navigation aria-hidden="true" />
      Get directions
    </ButtonLink>
  );
}

/** Phone, address and actions. Designed for the navy surface. */
export function ContactDetails() {
  return (
    <div>
      <p className="text-on-ink-dim">Call the garage</p>
      <a
        href={business.phoneHref}
        className="type-figure mt-1 block text-[clamp(2.25rem,4.6vw,3.75rem)] leading-none whitespace-nowrap text-on-ink decoration-signal decoration-2 underline-offset-8 hover:underline"
      >
        {business.phoneDisplay}
      </a>

      <div className="mt-8 flex items-start gap-3 text-on-ink-dim">
        <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-signal" />
        <p>
          <span className="text-on-ink">{business.address}</span>
          <br />
          {business.area}
        </p>
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <CallButton />
        <DirectionsButton />
      </div>
    </div>
  );
}

/** The weekly hours with today highlighted once the client knows what day it is in Cyprus. */
export function OpeningHoursTable({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const status = useOpenStatus();
  const dark = tone === "dark";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="type-h3">Opening hours</h3>
        <OpenStatusBadge tone={tone} className="text-sm" />
      </div>
      <table className="mt-5 w-full text-[0.975rem]">
        <caption className="sr-only">Marios Garage opening hours</caption>
        <tbody>
          {openingHours.map((entry, i) => {
            const isToday = status?.todayIndex === i;
            return (
              <tr
                key={entry.day}
                aria-current={isToday ? "date" : undefined}
                className={cn("border-b last:border-0", dark ? "border-white/10" : "border-rule")}
              >
                <th
                  scope="row"
                  className={cn(
                    "py-3 text-left font-medium",
                    dark ? "text-on-ink" : "text-graphite",
                    isToday && "font-semibold",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {isToday ? (
                      <span aria-hidden="true" className="h-4 w-1 rounded-full bg-signal" />
                    ) : null}
                    {entry.day}
                    {isToday ? <span className="sr-only"> (today)</span> : null}
                  </span>
                </th>
                <td
                  className={cn(
                    "py-3 text-right tabular-nums",
                    entry.closed
                      ? dark
                        ? "text-on-ink-dim/70"
                        : "text-steel/80"
                      : dark
                        ? "text-on-ink-dim"
                        : "text-steel",
                    isToday && (dark ? "text-on-ink" : "text-graphite"),
                  )}
                >
                  {entry.hours}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
