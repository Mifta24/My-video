import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const SpinningCube: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const loop = (frame / durationInFrames) * Math.PI * 2;
  const squash = interpolate(Math.sin(loop * 2), [-1, 1], [0.92, 1.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#F0EDE8" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 30, position: [0, 1.2, 7] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-4, 6, 5]} intensity={2.5} color="#FFF4E8" />
        <directionalLight position={[3, 3, -5]} intensity={1.5} />
        <mesh rotation={[0.4, loop, 0]} scale={[1, squash, 1]}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial color="#D97757" roughness={0.35} metalness={0.1} />
        </mesh>
      </ThreeCanvas>
      <div style={{ position: "absolute", bottom: 60, width: "100%", textAlign: "center", fontFamily: "monospace", fontSize: 28, color: "#1C1B1A" }}>
        t = {t.toFixed(2)} s | frame {frame}
      </div>
    </AbsoluteFill>
  );
};
