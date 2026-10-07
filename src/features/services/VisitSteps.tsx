import { visitSteps } from "@/features/business/data";

/** How a visit runs, in order. */
export function VisitSteps() {
  return (
    <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
      {visitSteps.map((step, i) => (
        <li key={step.title} className="border-t-2 border-graphite pt-6">
          <span
            aria-hidden="true"
            className="type-figure block text-[3.5rem] leading-none text-ink/25"
          >
            {i + 1}
          </span>
          <h3 className="type-h3 mt-4">{step.title}</h3>
          <p className="mt-3 max-w-[40ch] text-steel">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
