import type { ReactNode } from "react";
import { Container } from "@/shared/ui/Section";

export function PageHero({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="studio-backdrop relative overflow-hidden pt-32 pb-16 text-on-ink md:pt-40 md:pb-24">
      <Container>
        <h1 className="type-display hero-rise max-w-4xl">{title}</h1>
        <p className="type-lead hero-rise mt-6 max-w-[58ch] text-on-ink-dim [animation-delay:80ms]">
          {intro}
        </p>
        {children ? (
          <div className="hero-rise mt-9 flex flex-wrap gap-3 [animation-delay:160ms]">
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
