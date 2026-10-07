import {
  ClipboardCheck,
  Cog,
  Disc3,
  Droplet,
  ScanSearch,
  Snowflake,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Service, ServiceIcon } from "@/features/business/data";
import { cn } from "@/lib/utils";

const icons: Record<ServiceIcon, LucideIcon> = {
  oil: Droplet,
  brakes: Disc3,
  ac: Snowflake,
  electrical: Zap,
  diagnostics: ScanSearch,
  engine: Cog,
  opinion: ClipboardCheck,
};

/** A ruled service list, like the job lines on a workshop sheet. */
export function ServiceList({
  title,
  services,
  note,
  className,
}: {
  title: string;
  services: Service[];
  note?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="type-h3 border-b-2 border-graphite pb-3">{title}</h3>
      <ul>
        {services.map((service) => {
          const Icon = icons[service.icon];
          return (
            <li
              key={service.id}
              className="grid grid-cols-[2.75rem_1fr] gap-x-5 border-b border-rule py-6"
            >
              <span className="flex size-11 items-center justify-center rounded-md bg-ink text-signal">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <h4 className="font-sans text-lg leading-snug font-semibold tracking-normal">
                  {service.title}
                </h4>
                <p className="mt-1.5 max-w-[52ch] text-steel">{service.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {note ? <p className={cn("mt-5 max-w-[52ch] text-steel")}>{note}</p> : null}
    </div>
  );
}
