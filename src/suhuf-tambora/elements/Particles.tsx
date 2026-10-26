import type React from "react";

// Acak deterministik (tanpa Math.random supaya render konsisten antar frame).
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type ParticlesProps = {
  readonly kind: "ash" | "snow";
  readonly t: number;
  readonly count?: number;
  readonly opacity?: number;
};

// Abu naik pelan (letusan 1815, sebagian bara oranye) atau salju turun (dingin 1816).
export const Particles: React.FC<ParticlesProps> = ({
  kind,
  t,
  count = 60,
  opacity = 1,
}) => (
  <svg
    width={1080}
    height={1920}
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    opacity={opacity}
  >
    {Array.from({ length: count }, (_, i) => {
      const speed = (kind === "snow" ? 90 : 55) + rnd(i, 2) * 110;
      const run = (rnd(i, 3) * 2000 + t * speed) % 2000;
      const y = kind === "snow" ? run - 40 : 1960 - run;
      const x =
        rnd(i, 1) * 1080 +
        Math.sin(t * (0.6 + rnd(i, 5)) + i) * (kind === "snow" ? 34 : 22);
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
          opacity={
            (ember ? 0.9 : 0.35 + rnd(i, 6) * 0.45) *
            (y < 0 || y > 1920 ? 0 : 1)
          }
        />
      );
    })}
  </svg>
);
