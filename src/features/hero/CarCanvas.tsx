import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { AnimationMixer, MathUtils, type PerspectiveCamera } from "three";
import { STAGE } from "./carModel";

const TURN_DEGREES = 350;
const TURN_SPEED = 1.5;
const TURN_SPEED_MOBILE = 3;
const MOBILE_QUERY = "(max-width: 767px)";
const DOOR_CLIP = "model_open_all";

/** Aims the camera at the car's centre and widens the shot on narrow stages so the car always fits. */
function StageCamera() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    camera.lookAt(...STAGE.target);
    const aspect = size.width / Math.max(1, size.height);
    camera.zoom = Math.min(1, aspect / STAGE.aspect);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);

  return null;
}

function Mercedes({ url, progress, onReady }: { url: string; progress: number; onReady: () => void }) {
  const { scene, animations } = useGLTF(url);
  const invalidate = useThree((s) => s.invalidate);
  const doors = animations.find((clip) => clip.name === DOOR_CLIP);
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const [turnSpeed, setTurnSpeed] = useState(TURN_SPEED);

  // Phones turn the car faster; tablets and desktop keep the original speed.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setTurnSpeed(mq.matches ? TURN_SPEED_MOBILE : TURN_SPEED);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!doors) return;
    const action = mixer.clipAction(doors);
    action.play();
    return () => {
      action.stop();
      mixer.stopAllAction();
    };
  }, [doors, mixer]);

  // Scrub the door clip directly from scroll position: reversible, no independent playback.
  useEffect(() => {
    if (!doors) return;
    const opening = Math.min(1, progress * 3);
    mixer.setTime(opening === 0 ? 0 : 2 + opening * 1.8);
    invalidate();
  }, [doors, mixer, progress, invalidate]);

  // Tell the page once the first frame with the model has been drawn.
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [onReady]);

  return (
    <group scale={2} rotation-y={MathUtils.degToRad(-Math.min(1, progress * turnSpeed) * TURN_DEGREES)}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * Studio lighting built from light panels rendered into the environment map.
 * Nothing is fetched from a CDN, so the scene appears as soon as the model is parsed.
 */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#1b2a40"]} />
      <Lightformer intensity={2.2} position={[0, 7, 0]} rotation-x={Math.PI / 2} scale={[14, 4, 1]} />
      <Lightformer intensity={1.6} position={[7, 2.2, 0]} rotation-y={-Math.PI / 2} scale={[14, 1.4, 1]} />
      <Lightformer intensity={0.6} position={[-7, 2.2, 0]} rotation-y={Math.PI / 2} scale={[14, 1.4, 1]} />
      <Lightformer intensity={1} position={[0, 3, 9]} rotation-y={Math.PI} scale={[8, 3, 1]} />
      <Lightformer intensity={1} position={[0, 3, -9]} scale={[8, 3, 1]} />
    </Environment>
  );
}

export default function CarCanvas({
  url,
  progress,
  onReady,
}: {
  url: string;
  progress: number;
  onReady: () => void;
}) {
  return (
    <Canvas
      camera={{ position: STAGE.camera, fov: STAGE.fov, near: 0.5, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      frameloop="demand"
      style={{ background: "transparent" }}
    >
      <StageCamera />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} />
      <directionalLight position={[-5, 5, -4]} intensity={1} />
      <Studio />
      <Mercedes url={url} progress={progress} onReady={onReady} />
    </Canvas>
  );
}
