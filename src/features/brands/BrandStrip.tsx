import { brands } from "@/features/business/data";

export function BrandStrip() {
  return (
    <ul className="mt-12 grid border-t-2 border-graphite sm:grid-cols-2 lg:grid-cols-4">
      {brands.map((brand) => (
        <li
          key={brand.name}
          className="border-b border-rule py-6 sm:odd:pr-6 sm:even:pl-6 lg:border-b-0 lg:border-l lg:px-6 lg:odd:pr-6 lg:even:pl-6 lg:first:border-l-0 lg:first:pl-0"
        >
          <p className="font-display text-[2rem] leading-none font-bold">{brand.name}</p>
          <p className="mt-2 text-steel">{brand.note}</p>
        </li>
      ))}
    </ul>
  );
}
