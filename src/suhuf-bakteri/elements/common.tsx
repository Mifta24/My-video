import type React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { colors, fonts } from "../theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const END = 9999;

// 0 -> 1 dalam `dur` detik setelah `at`, dengan ease-out.
export const rise = (t: number, at: number, dur = 0.8) =>
  interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: easeOut });
export const ramp = (t: number, at: number, dur = 0.8) =>
  interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: easeInOut });

// Satu "shot" di dalam adegan: tampil dari `from` sampai `to` (detik), fade halus,
// children menerima waktu lokal.
export const Shot: React.FC<{
  readonly t: number;
  readonly from?: number;
  readonly to?: number;
  readonly children: (lt: number) => React.ReactNode;
}> = ({ t, from = 0, to = END, children }) => {
  const o = Math.min(
    interpolate(t, [from, from + 0.5], [0, 1], clamp),
    interpolate(t, [to - 0.15, to + 0.35], [1, 0], clamp),
  );
  if (o <= 0) {
    return null;
  }
  return <AbsoluteFill style={{ opacity: o }}>{children(t - from)}</AbsoluteFill>;
};

// Label wajib script: "SKEMA" untuk diagram konsep, "PERUMPAMAAN - bukan data" untuk analogi.
export const SchemaTag: React.FC<{
  readonly text?: string;
  readonly t: number;
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly align?: "left" | "right";
}> = ({ text = "SKEMA", t, x, y, size = 26, align = "left" }) => {
  const p = rise(t, 0.2, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        ...(align === "left" ? { left: x } : { right: x }),
        opacity: p,
        translate: `0px ${(1 - p) * -10}px`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: 3,
        color: colors.muted,
        border: `2px solid ${colors.line}`,
        background: "rgba(8,16,34,0.72)",
        borderRadius: 8,
        padding: "5px 14px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size,
          background: colors.orange,
        }}
      />
      {text}
    </div>
  );
};

// Teks bebas dengan bayangan navy supaya terbaca di atas diagram.
export const Txt: React.FC<{
  readonly children: React.ReactNode;
  readonly x: number;
  readonly y: number;
  readonly w?: number;
  readonly size?: number;
  readonly color?: string;
  readonly mono?: boolean;
  readonly weight?: number;
  readonly align?: "left" | "center" | "right";
  readonly t?: number;
  readonly at?: number;
  readonly out?: number;
  readonly lh?: number;
  readonly spacing?: number;
}> = ({
  children,
  x,
  y,
  w,
  size = 40,
  color = colors.text,
  mono = false,
  weight,
  align = "left",
  t,
  at = 0,
  out = END,
  lh = 1.12,
  spacing = 0,
}) => {
  const p = t === undefined ? 1 : rise(t, at, 0.7);
  const o = t === undefined ? 1 : interpolate(t, [out - 0.1, out + 0.35], [1, 0], clamp);
  if (p * o <= 0) {
    return null;
  }
  const width = w ?? 1600;
  const left = align === "center" ? x - width / 2 : align === "right" ? x - width : x;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: y,
        width,
        textAlign: align,
        opacity: p * o,
        translate: `0px ${(1 - p) * 22}px`,
        fontFamily: mono ? fonts.mono : fonts.heading,
        fontWeight: weight ?? (mono ? 500 : 700),
        fontSize: size,
        lineHeight: lh,
        letterSpacing: spacing,
        color,
        textShadow: `0 2px 18px ${colors.bg}, 0 0 6px ${colors.bg}`,
      }}
    >
      {children}
    </div>
  );
};

// Kartu panel dengan garis kiri berwarna: dipakai untuk poin, rekap, dan parafrasa.
export const Panel: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h?: number;
  readonly t: number;
  readonly at?: number;
  readonly accent?: string;
  readonly dim?: boolean;
  readonly children: React.ReactNode;
  readonly pad?: number;
  readonly from?: "left" | "bottom" | "right";
}> = ({
  x,
  y,
  w,
  h,
  t,
  at = 0,
  accent = colors.orange,
  dim = false,
  children,
  pad = 28,
  from = "bottom",
}) => {
  const p = rise(t, at, 0.75);
  if (p <= 0) {
    return null;
  }
  const off = (1 - p) * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: p * (dim ? 0.38 : 1),
        translate:
          from === "left" ? `${-off}px 0px` : from === "right" ? `${off}px 0px` : `0px ${off}px`,
        background: `linear-gradient(180deg, ${colors.panel}, rgba(15,27,56,0.82))`,
        border: `2px solid ${colors.line}`,
        borderLeft: `8px solid ${accent}`,
        borderRadius: 18,
        padding: pad,
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};
