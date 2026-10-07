import { garagePhotos } from "@/features/business/data";
import { cn } from "@/lib/utils";

// Mosaic on wide screens:  [ 0 0 ][ 1 1 ]
//                          [ 0 0 ][2][3]
const layout = [
  { item: "sm:col-span-2 lg:row-span-2", image: "aspect-[4/3] lg:aspect-auto lg:h-full" },
  { item: "sm:col-span-2", image: "aspect-[4/3] sm:aspect-[8/3]" },
  { item: "", image: "aspect-[4/3]" },
  { item: "", image: "aspect-[4/3]" },
];

export function PhotoGallery({ className }: { className?: string }) {
  return (
    <ul className={cn("mt-12 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {garagePhotos.map((photo, i) => {
        const l = layout[i] ?? { item: "", image: "aspect-[4/3]" };
        return (
          <li key={photo.caption} className={l.item}>
            <figure className="flex h-full flex-col">
              <div className="min-h-0 flex-1 overflow-hidden rounded-md bg-ink">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={960}
                  className={cn("w-full object-cover", l.image)}
                />
              </div>
              <figcaption className="mt-2.5 text-sm text-steel">{photo.caption}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
