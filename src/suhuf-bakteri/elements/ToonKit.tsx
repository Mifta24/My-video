import type React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, toon } from "../theme";

// Latar kartun cerah: krem hangat, sinar matahari samar berputar pelan, gelembung lembut
// oranye dan biru yang naik pelan. Dipakai ulang oleh Shorts dan (nanti) video panjang.
export const ToonBackdrop: React.FC<{ readonly seed?: string }> = ({ seed = "toon" }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const cx = width / 2;
  const cy = height * 0.42;
  const rays = Array.from({ length: 12 }, (_, i) => i);
  const bubbles = Array.from({ length: 16 }, (_, i) => {
    const x0 = random(`${seed}-x-${i}`) * width;
    const y0 = random(`${seed}-y-${i}`) * height;
    const r = 14 + random(`${seed}-r-${i}`) * 34;
    const sp = 10 + random(`${seed}-s-${i}`) * 16;
    const blue = random(`${seed}-c-${i}`) > 0.55;
    const y = (((y0 - t * sp) % (height + 120)) + height + 120) % (height + 120) - 60;
    const x = x0 + Math.sin(t * 0.5 + i * 1.3) * 22;
    return { x, y, r, blue };
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(110% 80% at 50% 40%, #FFFBF0 0%, ${toon.bg} 55%, ${toon.bgWarm} 100%)`,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <g transform={`rotate(${t * 2.5} ${cx} ${cy})`} opacity={0.5}>
          {rays.map((i) => (
            <path
              key={i}
              d={`M${cx},${cy} L${cx + Math.cos(((i * 30 - 7) * Math.PI) / 180) * 1900},${cy + Math.sin(((i * 30 - 7) * Math.PI) / 180) * 1900} L${cx + Math.cos(((i * 30 + 7) * Math.PI) / 180) * 1900},${cy + Math.sin(((i * 30 + 7) * Math.PI) / 180) * 1900} Z`}
              fill="#FFF0CC"
            />
          ))}
        </g>
        {bubbles.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={b.blue ? toon.blueLight : toon.orangeLight}
            opacity={0.2}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Muncul dengan memantul (0 -> ~1,1 -> 1).
export const pop = (t: number, at: number, dur = 0.55) =>
  interpolate(t, [at, at + dur], [0, 1], { ...clamp01, easing: Easing.out(Easing.back(2.2)) });
export const appear = (t: number, at: number, dur = 0.2) =>
  interpolate(t, [at, at + dur], [0, 1], clamp01);
export const slide = (t: number, at: number, dur = 0.7) =>
  interpolate(t, [at, at + dur], [0, 1], { ...clamp01, easing: Easing.bezier(0.16, 1, 0.3, 1) });
export const bob = (t: number, amp = 8, speed = 3, phase = 0) => Math.sin(t * speed + phase) * amp;

// Penempatan elemen: pojok kiri-atas (x, y), muncul memantul pada `at`.
export const Place: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly at?: number;
  readonly rot?: number;
  readonly origin?: string;
  readonly dy?: number;
  readonly dx?: number;
  readonly scale?: number;
  readonly children: React.ReactNode;
}> = ({ x, y, t, at = 0, rot = 0, origin = "50% 100%", dy = 0, dx = 0, scale = 1, children }) => {
  const p = pop(t, at);
  if (t < at) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        opacity: appear(t, at, 0.12),
        transform: `scale(${p * scale}) rotate(${rot}deg)`,
        transformOrigin: origin,
      }}
    >
      {children}
    </div>
  );
};

// Kata kunci besar (1-4 kata): huruf tebal bulat, garis tepi tinta, bayangan.
export const BigWord: React.FC<{
  readonly text: string;
  readonly t: number;
  readonly at?: number;
  readonly y: number;
  readonly size?: number;
  readonly color?: string;
  readonly rot?: number;
  readonly pulse?: number; // detik denyut tambahan
  readonly width?: number;
  readonly cx?: number;
}> = ({ text, t, at = 0, y, size = 150, color = toon.orange, rot = 0, pulse, width = 1000, cx = 540 }) => {
  if (t < at) {
    return null;
  }
  const extra = pulse === undefined ? 0 : 0.14 * Math.max(0, 1 - Math.abs(t - pulse - 0.1) / 0.3);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - width / 2,
        width,
        top: y,
        textAlign: "center",
        fontFamily: "inherit",
        opacity: appear(t, at, 0.12),
        transform: `scale(${pop(t, at, 0.5) + extra}) rotate(${rot}deg)`,
        transformOrigin: "50% 50%",
      }}
    >
      <span
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.0,
          whiteSpace: "pre-line",
          color,
          WebkitTextStroke: `${Math.max(8, size * 0.09)}px ${toon.ink}`,
          paintOrder: "stroke fill",
          textShadow: `0 ${Math.round(size * 0.06)}px 0 ${toon.ink}`,
          letterSpacing: 2,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const toonFont = () => fonts.toon;

// Label wajib: "SKEMA" dan "PERUMPAMAAN - bukan data" (juga "MITOS"). Di bawah watermark,
// di luar zona aman atas (150 px).
export const Tag: React.FC<{
  readonly text: string;
  readonly t: number;
  readonly kind?: "skema" | "analogi" | "mitos";
  readonly y?: number;
  readonly at?: number;
}> = ({ text, t, kind = "skema", y = 212, at = 0.1 }) => {
  const bg = kind === "skema" ? toon.blue : kind === "analogi" ? toon.orange : toon.red;
  const p = slide(t, at, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        translate: `0px ${(1 - p) * -16}px`,
      }}
    >
      <div
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: "#fff",
          background: bg,
          border: `5px solid ${toon.ink}`,
          boxShadow: `0 5px 0 ${toon.ink}`,
          borderRadius: 999,
          padding: "6px 30px 8px",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Teks kecil pendukung (mis. label tokoh).
export const SmallText: React.FC<{
  readonly text: string;
  readonly t: number;
  readonly at?: number;
  readonly y: number;
  readonly size?: number;
  readonly color?: string;
}> = ({ text, t, at = 0, y, size = 44, color = toon.ink }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      textAlign: "center",
      fontFamily: toonFont(),
      fontWeight: 600,
      fontSize: size,
      color,
      opacity: appear(t, at, 0.3),
    }}
  >
    {text}
  </div>
);

// Bintang kecil berkilau.
export const Sparkle: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly size?: number; readonly phase?: number }> = ({
  x,
  y,
  t,
  size = 44,
  phase = 0,
}) => {
  const s = 0.7 + 0.3 * Math.sin(t * 5 + phase);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 -10 20 20"
      style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${t * 40 + phase * 20}deg)` }}
    >
      <path d="M0,-9 Q1.5,-1.5 9,0 Q1.5,1.5 0,9 Q-1.5,1.5 -9,0 Q-1.5,-1.5 0,-9 Z" fill={toon.yellow} stroke={toon.ink} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
};

// Satu "shot" di dalam adegan: tampil dari `from` sampai `to` (detik). Fade cepat supaya pergantian
// gambar terasa tegas. children menerima waktu lokal (detik sejak `from`).
export const Sh: React.FC<{
  readonly t: number;
  readonly from?: number;
  readonly to?: number;
  readonly children: (lt: number) => React.ReactNode;
}> = ({ t, from = 0, to = 9999, children }) => {
  const o = Math.min(
    interpolate(t, [from, from + 0.18], [0, 1], clamp01),
    interpolate(t, [to - 0.05, to + 0.15], [1, 0], clamp01),
  );
  if (o <= 0) {
    return null;
  }
  return <AbsoluteFill style={{ opacity: o }}>{children(t - from)}</AbsoluteFill>;
};

// Bergerak dari titik A ke B (pojok kiri-atas), mulai `at`, dengan lompatan kecil.
export const Mv: React.FC<{
  readonly t: number;
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
  readonly at: number;
  readonly dur?: number;
  readonly hop?: number;
  readonly children: React.ReactNode;
}> = ({ t, from, to, at, dur = 0.8, hop = 0, children }) => {
  if (t < at) {
    return null;
  }
  const p = slide(t, at, dur);
  const jump = hop * Math.abs(Math.sin(p * Math.PI * 3)) * (p < 1 ? 1 : 0);
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(from[0], to[0], p),
        top: lerp(from[1], to[1], p) - jump,
        opacity: appear(t, at, 0.1),
      }}
    >
      {children}
    </div>
  );
};
