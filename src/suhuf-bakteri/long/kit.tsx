import type React from "react";
import { interpolate } from "remotion";
import { clamp, easeOut, rise } from "../elements/common";
import { colors, fonts } from "../theme";
import { clipStart, cue } from "../timing";

// Video panjang 16:9 (1920 x 1080). Subtitle di ~950-1016; area visual y 100 .. 900.
export const W = 1920;
export const H = 1080;

export type LV = React.FC<{ readonly t: number }>;

// Waktu bantu per adegan: c("frasa") = detik frasa diucapkan, k(2) = awal kalimat ke-2.
export const at = (sceneId: string) => ({
  c: (phrase: string, off = 0) => cue(sceneId, phrase, off),
  k: (n: number, off = 0) => clipStart(sceneId, `${sceneId}_${String(n).padStart(2, "0")}`) + off,
});

export const Svg: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

// 10^11 -> 10 dengan pangkat kecil.
export const Pow: React.FC<{ readonly base?: string; readonly exp: string; readonly pre?: string }> = ({
  base = "10",
  exp,
  pre = "",
}) => (
  <span style={{ whiteSpace: "nowrap" }}>
    {pre}
    {base}
    <sup style={{ fontSize: "0.55em", verticalAlign: "0.75em", lineHeight: 0 }}>{exp}</sup>
  </span>
);

// Kotak angka/konsep: judul kecil (mono) + isi besar.
export const Box: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h?: number;
  readonly t: number;
  readonly at?: number;
  readonly label?: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly note?: React.ReactNode;
  readonly accent?: string;
  readonly size?: number;
  readonly dim?: number; // 0..1 meredup
  readonly dashed?: boolean;
  readonly align?: "left" | "center";
  readonly out?: number;
}> = ({
  x,
  y,
  w,
  h,
  t,
  at: a = 0,
  label,
  children,
  note,
  accent = colors.orange,
  size = 54,
  dim = 0,
  dashed = false,
  align = "center",
  out = 9999,
}) => {
  const p = rise(t, a, 0.7);
  const o = interpolate(t, [out - 0.1, out + 0.4], [1, 0], clamp);
  if (p * o <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        opacity: p * o * (1 - dim * 0.65),
        translate: `0px ${(1 - p) * 30}px`,
        scale: String(0.96 + 0.04 * p),
        background: dashed ? "rgba(15,27,56,0.35)" : `linear-gradient(180deg, ${colors.panel}, rgba(15,27,56,0.85))`,
        border: `${dashed ? 3 : 2}px ${dashed ? "dashed" : "solid"} ${dashed ? accent : colors.line}`,
        borderTop: dashed ? undefined : `6px solid ${accent}`,
        borderRadius: 18,
        padding: "22px 28px",
        textAlign: align,
        boxShadow: "0 18px 46px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {label ? (
        <div style={{ fontFamily: fonts.mono, fontSize: 24, letterSpacing: 2, color: colors.muted, textTransform: "uppercase" }}>
          {label}
        </div>
      ) : null}
      {children ? (
        <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: colors.text }}>
          {children}
        </div>
      ) : null}
      {note ? (
        <div style={{ fontFamily: fonts.mono, fontSize: 24, color: accent, lineHeight: 1.3 }}>{note}</div>
      ) : null}
    </div>
  );
};

// Operator besar (×, =, →) di antara kotak.
export const Op: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly at: number;
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
}> = ({ x, y, t, at: a, children, size = 90, color = colors.orange }) => {
  const p = rise(t, a, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 100,
        width: 200,
        top: y,
        textAlign: "center",
        opacity: p,
        scale: String(0.6 + 0.4 * p),
        fontFamily: fonts.heading,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
      }}
    >
      {children}
    </div>
  );
};

// Judul bab / adegan: kicker mono + judul besar, kiri atas.
export const Heading: React.FC<{
  readonly t: number;
  readonly kicker?: string;
  readonly title: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly size?: number;
  readonly at?: number;
  readonly out?: number;
  readonly align?: "left" | "center";
}> = ({ t, kicker, title, x = 120, y = 120, size = 72, at: a = 0, out = 9999, align = "left" }) => {
  const p = rise(t, a, 0.8);
  const o = interpolate(t, [out - 0.1, out + 0.4], [1, 0], clamp);
  if (p * o <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        textAlign: align,
        opacity: p * o,
        translate: `0px ${(1 - p) * 24}px`,
        textShadow: `0 2px 20px ${colors.bg}`,
      }}
    >
      {kicker ? (
        <div style={{ fontFamily: fonts.mono, fontSize: 26, letterSpacing: 5, color: colors.orange, marginBottom: 10 }}>
          {kicker}
        </div>
      ) : null}
      <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: colors.text }}>
        {title}
      </div>
    </div>
  );
};

// Kalimat kunci yang berganti mengikuti narasi: items = [[detik, teks], ...].
export const Keylines: React.FC<{
  readonly t: number;
  readonly items: readonly (readonly [number, React.ReactNode])[];
  readonly x?: number;
  readonly y: number;
  readonly w?: number;
  readonly size?: number;
  readonly align?: "left" | "center";
  readonly until?: number;
}> = ({ t, items, x = 960, y, w = 1500, size = 46, align = "center", until = 9999 }) => {
  let cur = -1;
  items.forEach(([a], i) => {
    if (t >= a) {
      cur = i;
    }
  });
  if (cur < 0 || t > until + 0.4) {
    return null;
  }
  const [a, text] = items[cur];
  const p = interpolate(t, [a, a + 0.5], [0, 1], { ...clamp, easing: easeOut });
  const o = interpolate(t, [until - 0.1, until + 0.4], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - w / 2 : x,
        width: w,
        top: y,
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity: p * o,
        translate: `0px ${(1 - p) * 16}px`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.15,
          color: colors.text,
          textAlign: align,
          textShadow: `0 2px 18px ${colors.bg}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Daftar kartu bernomor (peta jalan / rekap). `active(i)` 0..1 menyala.
export const StepCards: React.FC<{
  readonly t: number;
  readonly items: readonly { readonly at: number; readonly text: React.ReactNode }[];
  readonly active: (i: number) => number;
  readonly x?: number;
  readonly y?: number;
  readonly w?: number;
  readonly h?: number;
  readonly gap?: number;
  readonly size?: number;
  readonly horizontal?: boolean;
}> = ({ t, items, active, x = 120, y = 250, w = 760, h = 120, gap = 26, size = 40, horizontal = false }) => (
  <>
    {items.map((it, i) => {
      const p = rise(t, it.at, 0.7);
      if (p <= 0) {
        return null;
      }
      const a = active(i);
      const left = horizontal ? x + i * (w + gap) : x;
      const top = horizontal ? y : y + i * (h + gap);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left,
            top,
            width: w,
            height: h,
            boxSizing: "border-box",
            opacity: p * (0.4 + 0.6 * a),
            translate: horizontal ? `0px ${(1 - p) * 30}px` : `${(1 - p) * -40}px 0px`,
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "0 28px",
            borderRadius: 18,
            background: `linear-gradient(90deg, rgba(255,138,61,${0.16 * a}), rgba(15,27,56,0.85))`,
            border: `2px solid ${a > 0.5 ? colors.orange : colors.line}`,
            boxShadow: a > 0.5 ? `0 0 30px rgba(255,138,61,${0.25 * a})` : "none",
          }}
        >
          <div
            style={{
              flex: "none",
              width: h * 0.56,
              height: h * 0.56,
              borderRadius: 99,
              background: a > 0.5 ? colors.orange : colors.lineSoft,
              color: a > 0.5 ? colors.bg : colors.muted,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: h * 0.3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i + 1}
          </div>
          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: size, lineHeight: 1.1, color: colors.text }}>
            {it.text}
          </div>
        </div>
      );
    })}
  </>
);

// Stempel teks miring (DIPERKIRAKAN, KELIRU, dll).
export const Stamp: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly at: number;
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
}> = ({ x, y, t, at: a, children, size = 64, color = colors.orange }) => {
  const p = rise(t, a, 0.45);
  if (p <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0",
        opacity: p,
        rotate: `${interpolate(p, [0, 1], [-16, -5])}deg`,
        scale: String(interpolate(p, [0, 1], [1.7, 1])),
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: size * 0.12,
        color,
        border: `5px solid ${color}`,
        borderRadius: 14,
        padding: `${size * 0.08}px ${size * 0.3}px`,
        whiteSpace: "nowrap",
        background: "rgba(8,16,34,0.6)",
      }}
    >
      {children}
    </div>
  );
};

// Kartu parafrasa (bukan kutipan langsung: tanpa tanda kutip).
export const Paraphrase: React.FC<{
  readonly t: number;
  readonly at: number;
  readonly x?: number;
  readonly y?: number;
  readonly w?: number;
  readonly children: React.ReactNode;
  readonly source?: string;
}> = ({ t, at: a, x = 260, y = 260, w = 1400, children, source = "Parafrasa · Sender, Fuchs & Milo, 2016" }) => {
  const p = rise(t, a, 0.9);
  if (p <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        boxSizing: "border-box",
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
        padding: "44px 56px",
        borderRadius: 24,
        background: colors.cream,
        color: colors.bg,
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 58, lineHeight: 1.15 }}>{children}</div>
      <div style={{ marginTop: 22, fontFamily: fonts.mono, fontSize: 24, letterSpacing: 1.5, color: "#6B5F4A" }}>
        {source}
      </div>
    </div>
  );
};

// Garis waktu horizontal dengan simpul berlabel. `lit(i)` 0..1.
export const TimelineBar: React.FC<{
  readonly t: number;
  readonly nodes: readonly { readonly x: number; readonly label: string; readonly sub?: string }[];
  readonly y: number;
  readonly lit: (i: number) => number;
  readonly draw?: number;
}> = ({ t, nodes, y, lit, draw = 1 }) => {
  const x0 = nodes[0].x;
  const x1 = nodes[nodes.length - 1].x;
  const p = rise(t, 0, 0.8);
  return (
    <>
      <Svg>
        <line x1={x0} x2={x1} y1={y} y2={y} stroke={colors.line} strokeWidth={4} opacity={p} />
        <line x1={x0} x2={x0 + (x1 - x0) * draw} y1={y} y2={y} stroke={colors.orange} strokeWidth={4} opacity={p * 0.7} />
        {nodes.map((n, i) => (
          <g key={i} opacity={p}>
            <circle cx={n.x} cy={y} r={16} fill={colors.bg} stroke={lit(i) > 0.5 ? colors.orange : colors.line} strokeWidth={5} />
            <circle cx={n.x} cy={y} r={8 * lit(i)} fill={colors.orange} />
          </g>
        ))}
      </Svg>
      {nodes.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: n.x - 160,
            width: 320,
            top: y + 30,
            textAlign: "center",
            opacity: p * (0.45 + 0.55 * lit(i)),
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 38,
            color: lit(i) > 0.5 ? colors.orange : colors.muted,
          }}
        >
          {n.label}
          {n.sub ? (
            <div style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 22, color: colors.muted, marginTop: 4 }}>{n.sub}</div>
          ) : null}
        </div>
      ))}
    </>
  );
};
