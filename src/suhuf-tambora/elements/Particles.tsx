import type React from "react";

// Acak deterministik (tanpa Math.random supaya render konsisten antar frame).
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type ParticlesProps = {
  readonly kind: "ash" | "snow" | "rain";
  readonly t: number;
  readonly count?: number;
  readonly opacity?: number;
  readonly width?: number;
  readonly height?: number;
};

// Abu naik pelan (letusan 1815, sebagian bara oranye), salju turun (dingin 1816), atau hujan.
export const Particles: React.FC<ParticlesProps> = ({
  kind,
  t,
  count = 60,
  opacity = 1,
  width = 1080,
  height = 1920,
}) => {
  const span = height + 80;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      opacity={opacity}
    >
      {Array.from({ length: count }, (_, i) => {
        const speed =
          kind === "rain"
            ? 700 + rnd(i, 2) * 500
            : (kind === "snow" ? 90 : 55) + rnd(i, 2) * 110;
        const run = (rnd(i, 3) * span + t * speed) % span;
        const y = kind === "ash" ? height + 40 - run : run - 40;
        const sway =
          kind === "rain"
            ? 0
            : Math.sin(t * (0.6 + rnd(i, 5)) + i) * (kind === "snow" ? 34 : 22);
        const x = rnd(i, 1) * width + sway;
        const visible = y >= 0 && y <= height ? 1 : 0;
        if (kind === "rain") {
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - 10}
              y2={y + 34}
              stroke="#9DBBEE"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={(0.25 + rnd(i, 6) * 0.35) * visible}
            />
          );
        }
        const r =
          (kind === "snow" ? 3 : 2.5) + rnd(i, 4) * (kind === "snow" ? 6 : 5);
        const ember = kind === "ash" && i % 6 === 0;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={ember ? "#FF8A3D" : kind === "snow" ? "#EAF4FF" : "#A9B0BE"}
            opacity={(ember ? 0.9 : 0.35 + rnd(i, 6) * 0.45) * visible}
          />
        );
      })}
    </svg>
  );
};
