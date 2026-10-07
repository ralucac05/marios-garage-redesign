import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "concrete" | "paper" | "ink";

const tones: Record<Tone, string> = {
  concrete: "bg-concrete text-graphite",
  paper: "bg-paper text-graphite",
  ink: "surface-ink",
};

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[76rem] px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "concrete",
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: Tone;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-20 md:py-28", tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  id,
  title,
  intro,
  aside,
  tone = "light",
}: {
  id?: string;
  title: string;
  intro?: string;
  /** Optional element aligned to the right of the heading on wide screens, e.g. a link. */
  aside?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="type-h2">
          {title}
        </h2>
        {intro ? (
          <p
            className={cn(
              "type-lead mt-5 max-w-[60ch]",
              tone === "dark" ? "text-on-ink-dim" : "text-steel",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </header>
  );
}
