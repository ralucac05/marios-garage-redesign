# Redesign and 3D car loading fix

## The car model
- `public/models/mercedes-e-class.glb` (3.9 MB) replaces the 25–83 MB files that were in `public/`.
  Textures are resized WebP, geometry is meshopt-compressed, the door clip and node hierarchy are unchanged.
- `public/images/car-poster-*.webp` is a still render of the same model and camera. It shows instantly;
  the 3D model downloads after the page has loaded and cross-fades in (`src/features/hero/RotatingCar.tsx`).
- Visitors with reduced motion, data saver, 2G or no WebGL keep the still image.
- Lighting is built into the scene, so no HDR is fetched from a CDN.
- To rebuild from the original model (keep it outside `public/`):
  `node scripts/optimize-car-model.mjs path/to/mercedes_e_class_w212.glb public/models/mercedes-e-class.glb`
  (needs Python 3 with Pillow). If you change the camera in `src/features/hero/carModel.ts`, re-render the poster.

## Hosting
Serve `/models/*.glb` and `/images/*` with a long cache lifetime and gzip/brotli enabled for `.glb`.

## Design
- Palette: navy (`--ink`), concrete (`--concrete`), paper, graphite, safety yellow (`--signal`) for calls to action.
- Type: Saira Condensed (headings, figures) and IBM Plex Sans (body).
- New: live open/closed status in Cyprus time, today highlighted in the hours table, mobile Call/Directions bar,
  map on the contact page, "How a visit works" steps, review pull quotes (verbatim sentences from each review).
