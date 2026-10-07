import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CAR_POSTER, STAGE, loadCarModel, type ModelLoadState } from "./carModel";

const CarCanvas = lazy(() => import("./CarCanvas"));

/** Skip the 3D download for people who asked for less data or less motion. */
function shouldLoad3d() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return false;
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return false;
  } catch {
    return false;
  }
  return true;
}

/** Run after the page has finished loading and the main thread is idle, so the model never delays first paint. */
function whenIdle(fn: () => void) {
  let cancelled = false;
  let idleId: number | undefined;
  const run = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function")
      idleId = window.requestIdleCallback(fn, { timeout: 2000 });
    else idleId = setTimeout(fn, 200) as unknown as number;
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idleId !== undefined) {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    }
  };
}

/**
 * A still render of the car shows instantly; the interactive model downloads in
 * the background and cross-fades in once its first frame is drawn. Scroll then
 * turns the car and opens its doors, exactly as before.
 */
export function RotatingCar({ progress, className }: { progress: number; className?: string }) {
  const [model, setModel] = useState<ModelLoadState | null>(null);
  const [shown, setShown] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!shouldLoad3d()) return;
    let active = true;
    const cancelIdle = whenIdle(() => {
      setModel({ status: "loading", progress: 0 });
      // Fetch the renderer code and the model together.
      void import("./CarCanvas");
      loadCarModel(
        (p) =>
          active &&
          setModel((m) => (m?.status === "loading" ? { status: "loading", progress: p } : m)),
      )
        .then((url) => active && setModel({ status: "ready", url }))
        .catch(() => active && setModel({ status: "error" }));
    });
    return () => {
      active = false;
      cancelIdle();
    };
  }, []);

  // Only show a loading indicator if the download is noticeable.
  useEffect(() => {
    if (model?.status !== "loading") return;
    const t = window.setTimeout(() => setSlow(true), 900);
    return () => window.clearTimeout(t);
  }, [model?.status]);

  const handleReady = useCallback(() => setShown(true), []);
  const clamped = Math.min(1, Math.max(0, progress));

  return (
    <div
      className={cn("relative w-full select-none", className)}
      style={{ aspectRatio: `${CAR_POSTER.width} / ${CAR_POSTER.height}` }}
      role="img"
      aria-label="Silver Mercedes-Benz E-Class. Scrolling turns the car and opens its doors, bonnet and boot."
    >
      {/* Floor shadow, shared by the still and the live model. */}
      <div
        aria-hidden="true"
        className="absolute left-[9%] right-[9%] h-[14%] -translate-y-1/2 rounded-[50%] bg-black/55 blur-2xl"
        style={{ top: `${STAGE.floorY * 100}%` }}
      />

      <img
        src={CAR_POSTER.src}
        srcSet={CAR_POSTER.srcSet}
        sizes="(min-width: 1024px) 62vw, 100vw"
        width={CAR_POSTER.width}
        height={CAR_POSTER.height}
        alt=""
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className={cn(
          "absolute inset-0 h-full w-full object-contain transition-opacity duration-700",
          shown ? "opacity-0" : "opacity-100",
        )}
      />

      {model?.status === "ready" ? (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            shown ? "opacity-100" : "opacity-0",
          )}
        >
          <Suspense fallback={null}>
            <CarCanvas url={model.url} progress={clamped} onReady={handleReady} />
          </Suspense>
        </div>
      ) : null}

      {slow && !shown && model?.status !== "error" ? (
        <div
          className="absolute left-1/2 w-40 -translate-x-1/2 text-center text-xs text-on-ink-dim"
          style={{ top: `${STAGE.floorY * 100 + 6}%` }}
          role="status"
        >
          <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
            {model?.status === "loading" && model.progress !== null ? (
              <div
                className="h-full bg-signal transition-[width] duration-200"
                style={{ width: `${Math.round(model.progress * 100)}%` }}
              />
            ) : (
              <div className="load-sweep h-full w-2/5 bg-signal" />
            )}
          </div>
          <p className="mt-2">Loading 3D view</p>
        </div>
      ) : null}
    </div>
  );
}
