/**
 * The hero model and its poster. The GLB is a web-optimised build of the
 * original 83 MB file (see scripts/optimize-car-model.mjs): meshopt-compressed
 * geometry and WebP textures, about 3.9 MB.
 */
export const CAR_MODEL_URL = "/models/mercedes-e-class.glb";

export const CAR_POSTER = {
  src: "/images/car-poster-1920.webp",
  srcSet: "/images/car-poster-960.webp 960w, /images/car-poster-1920.webp 1920w",
  width: 1920,
  height: 800,
} as const;

/**
 * Camera and stage settings shared by the 3D scene and the poster render so the
 * still image and the live model line up exactly when they cross-fade.
 */
export const STAGE = {
  aspect: 1920 / 800,
  fov: 18,
  camera: [16, 4, 0] as [number, number, number],
  target: [0, 1.3, 0] as [number, number, number],
  /** Floor line of the car as a fraction of the stage height, for the CSS shadow. */
  floorY: 0.84,
} as const;

export type ModelLoadState =
  | { status: "loading"; progress: number | null }
  | { status: "ready"; url: string }
  | { status: "error" };

let pending: Promise<string> | null = null;
const listeners = new Set<(progress: number | null) => void>();

/**
 * Downloads the GLB once with real byte progress and hands back an object URL
 * that the GLTF loader reads from memory. Repeat visits come from the HTTP cache.
 */
export function loadCarModel(onProgress?: (progress: number | null) => void): Promise<string> {
  if (onProgress) listeners.add(onProgress);
  if (pending) return pending;

  pending = (async () => {
    const res = await fetch(CAR_MODEL_URL);
    if (!res.ok || !res.body) throw new Error(`Model request failed (${res.status})`);

    // content-length is the compressed size when the host gzips, so only trust it for identity responses.
    const encoded = res.headers.get("content-encoding");
    const total =
      !encoded || encoded === "identity" ? Number(res.headers.get("content-length")) || 0 : 0;
    const reader = res.body.getReader();
    const parts: Uint8Array[] = [];
    let received = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(value);
      received += value.byteLength;
      const progress = total ? Math.min(1, received / total) : null;
      listeners.forEach((fn) => fn(progress));
    }

    return URL.createObjectURL(new Blob(parts as BlobPart[], { type: "model/gltf-binary" }));
  })();

  pending.catch(() => {
    pending = null;
  });
  return pending;
}
