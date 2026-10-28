import type React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Latar navy "lembar": gradasi, kisi titik halus yang bergeser pelan, butir cahaya
// samar (bukan bakteri, hanya suasana), dan vignette. Sama untuk Shorts dan Long.
export const Backdrop: React.FC<{ readonly seed?: string; readonly glow?: number }> = ({
  seed = "bg",
  glow = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const grid = 46;
  const drift = (t * 6) % grid;
  const motes = Array.from({ length: 22 }, (_, i) => {
    const x0 = random(`${seed}-x-${i}`) * width;
    const y0 = random(`${seed}-y-${i}`) * height;
    const r = 2 + random(`${seed}-r-${i}`) * 5;
    const sp = 4 + random(`${seed}-s-${i}`) * 10;
    const warm = random(`${seed}-c-${i}`) > 0.6;
    const y = (((y0 - t * sp) % height) + height) % height;
    const x = x0 + Math.sin(t * 0.3 + i) * 18;
    const tw = 0.25 + 0.2 * Math.sin(t * 0.9 + i * 1.7);
    return { x, y, r, warm, o: tw };
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 38%, #10204A 0%, ${colors.bg} 55%, ${colors.bgDeep} 100%)`,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern
            id={`dots-${seed}`}
            width={grid}
            height={grid}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${drift} ${drift * 0.5})`}
          >
            <circle cx={grid / 2} cy={grid / 2} r={1.6} fill={colors.line} />
          </pattern>
          <radialGradient id={`fade-${seed}`} cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity={0.55} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <mask id={`mask-${seed}`}>
            <rect width={width} height={height} fill={`url(#fade-${seed})`} />
          </mask>
        </defs>
        <rect
          width={width}
          height={height}
          fill={`url(#dots-${seed})`}
          mask={`url(#mask-${seed})`}
        />
        {motes.map((m, i) => (
          <circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill={m.warm ? colors.orange : colors.cream}
            opacity={m.o * 0.35 * glow}
            style={{ filter: "blur(2px)" }}
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 ${Math.round(width * 0.18)}px rgba(0,0,0,0.65)`,
        }}
      />
    </AbsoluteFill>
  );
};
