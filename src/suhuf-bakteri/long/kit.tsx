import type React from "react";
import { Easing, interpolate } from "remotion";
import { appear, BigWord, pop, slide, Tag, toonFont } from "../elements/ToonKit";
import { Arm, Bacteria, blinkOf, Cell, Detective, Face, MagnifierG, type Mood, Scale } from "../shorts/characters";
import { toon } from "../theme";

// Kit bersama video panjang V3 (16:9, 1920x1080). Gaya sama dengan Shorts V3: kartun cerah, wajah datar (stiker).
// Zona: label di y 100, isi utama y 150-880, subtitle y >= 925.
export const INK = toon.ink;
export const CX = 960;
export const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type BigProps = Omit<React.ComponentProps<typeof BigWord>, "cx" | "width"> & { readonly cx?: number; readonly width?: number };
export const Big: React.FC<BigProps> = ({ cx = CX, width = 1700, ...p }) => <BigWord cx={cx} width={width} {...p} />;

export const Lbl: React.FC<{ readonly text: string; readonly t: number; readonly kind?: "skema" | "analogi" | "mitos"; readonly at?: number }> = ({
  text,
  t,
  kind = "skema",
  at = 0.1,
}) => <Tag text={text} t={t} kind={kind} y={100} at={at} />;

// Pil kecil hijau untuk "CATATAN MENARIK".
export const Note: React.FC<{ readonly text: string; readonly t: number; readonly at?: number }> = ({ text, t, at = 0.1 }) => {
  const p = slide(t, at, 0.5);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * -16}px` }}>
      <div
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: INK,
          background: toon.yellow,
          border: `5px solid ${INK}`,
          boxShadow: `0 5px 0 ${INK}`,
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

// Respons langkah teredam: 0 -> 1 dengan sedikit overshoot (untuk timbangan dan tokoh yang mendarat).
export const stepResp = (t: number, at: number, k = 3.4, f = 1.35) => {
  const dt = t - at;
  if (dt <= 0) {
    return 0;
  }
  const w = 2 * Math.PI * f;
  return 1 - Math.exp(-k * dt) * (Math.cos(w * dt) + (k / w) * Math.sin(w * dt));
};

export const wig = (t: number, amp: number, speed = 3, ph = 0) => amp * Math.sin(t * speed + ph);

// ---------- Orang (guru, remaja, kakek) ----------
export const Person: React.FC<{
  readonly size: number;
  readonly who: "guru" | "remaja" | "kakek";
  readonly t?: number;
  readonly mood?: Mood;
  readonly phase?: number;
  readonly shirt?: string;
}> = ({ size, who, t = 0, mood = "happy", phase = 0, shirt: shirtOverride }) => {
  const shirt = shirtOverride ?? (who === "guru" ? toon.blue : who === "remaja" ? toon.orange : toon.green);
  const hair = who === "kakek" ? "#ECECF3" : who === "remaja" ? "#3B2A22" : "#5B3A29";
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" style={{ overflow: "visible", display: "block" }}>
      <path d="M12,138 Q12,98 60,98 Q108,98 108,138 Z" fill={shirt} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M48,98 L60,112 L72,98" fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={60} cy={58} r={34} fill={toon.skin} stroke={INK} strokeWidth={4.5} />
      {who === "kakek" ? (
        <>
          <path d="M28,60 Q24,40 36,36 Q32,52 36,66 Z" fill={hair} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M92,60 Q96,40 84,36 Q88,52 84,66 Z" fill={hair} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M44,80 Q60,72 76,80 Q70,90 60,88 Q50,90 44,80 Z" fill={hair} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        </>
      ) : who === "remaja" ? (
        <path d="M27,56 Q26,22 60,22 Q94,22 93,56 Q80,38 60,40 Q40,38 27,56 Z M52,24 Q56,10 70,16 Q64,22 62,26 Z" fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ) : (
        <>
          <path d="M26,58 Q24,22 60,22 Q96,22 94,58 Q82,40 60,42 Q38,40 26,58 Z" fill={hair} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={46} cy={64} r={13} fill="#D8EEFF" fillOpacity={0.4} stroke={INK} strokeWidth={3} />
          <circle cx={74} cy={64} r={13} fill="#D8EEFF" fillOpacity={0.4} stroke={INK} strokeWidth={3} />
          <line x1={59} y1={64} x2={61} y2={64} stroke={INK} strokeWidth={3} />
        </>
      )}
      <Face cx={60} cy={66} gap={14} r={6.4} mood={mood} blink={blinkOf(t, phase)} />
    </svg>
  );
};

// ---------- Sel manusia berjenis (datar, wajah stiker) ----------
export type CellKindX = "plain" | "red" | "muscle" | "skin" | "nuc" | "fat";
export const BodyCell: React.FC<{
  readonly kind: CellKindX;
  readonly size: number;
  readonly t?: number;
  readonly mood?: Mood;
  readonly phase?: number;
  readonly glow?: number; // 0..1 kilau inti
  readonly dim?: number; // 0..1 redup
}> = ({ kind, size, t = 0, mood = "happy", phase = 0, glow = 0, dim = 0 }) => {
  const blink = blinkOf(t, phase);
  const body = kind === "red" ? toon.red : kind === "fat" ? "#FFE08A" : kind === "skin" ? toon.blueLight : toon.blue;
  const deep = kind === "red" ? "#B92B2B" : kind === "fat" ? "#E0B94A" : toon.blueDark;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block", opacity: 1 - 0.6 * dim }}>
      {kind === "muscle" ? (
        <>
          <Arm x={9} y={56} angle={140} side="l" len={26} color={body} />
          <Arm x={91} y={56} angle={140} side="r" len={26} color={body} />
        </>
      ) : null}
      {kind === "skin" ? (
        <rect x={10} y={10} width={80} height={80} rx={22} fill={body} stroke={INK} strokeWidth={4.5} />
      ) : (
        <circle cx={50} cy={50} r={42} fill={body} stroke={INK} strokeWidth={4.5} />
      )}
      {kind === "red" ? <ellipse cx={50} cy={50} rx={26} ry={22} fill={deep} opacity={0.25} /> : null}
      <path d="M24,34 Q30,20 46,16" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
      <circle cx={72} cy={74} r={8} fill={deep} opacity={0.3} />
      {kind === "nuc" ? (
        <g>
          {glow > 0 ? <circle cx={50} cy={31} r={20 + 6 * glow} fill={toon.yellow} opacity={0.5 * glow} /> : null}
          <circle cx={50} cy={31} r={13} fill="#7B5FD1" stroke={INK} strokeWidth={3.5} />
          <circle cx={46} cy={27} r={3.4} fill="#fff" opacity={0.8} />
        </g>
      ) : null}
      <Face cx={50} cy={kind === "nuc" ? 60 : 49} gap={kind === "nuc" ? 13 : 15} r={kind === "nuc" ? 7 : 9} mood={mood} blink={blink} />
    </svg>
  );
};

// ---------- Papan investigasi ----------
export const Board: React.FC<{ readonly w: number; readonly h: number; readonly children?: React.ReactNode }> = ({ w, h, children }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: 30,
      border: `12px solid #8A5A32`,
      outline: `5px solid ${INK}`,
      boxShadow: `0 12px 0 ${INK}`,
      background: "#DDAE72",
      backgroundImage: "radial-gradient(#C8955A 2px, transparent 2.5px)",
      backgroundSize: "26px 26px",
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

export const Pinned: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly rot?: number;
  readonly children?: React.ReactNode;
  readonly bg?: string;
}> = ({ x, y, w, h, rot = 0, children, bg = "#fff" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      border: `5px solid ${INK}`,
      borderRadius: 10,
      boxShadow: `0 6px 0 rgba(43,45,66,0.55)`,
      transform: `rotate(${rot}deg)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
    }}
  >
    <div style={{ position: "absolute", top: -14, left: w / 2 - 13, width: 26, height: 26, borderRadius: 26, background: toon.red, border: `4px solid ${INK}` }} />
    {children}
  </div>
);

// Stempel membanting masuk: besar -> pas, lalu diam.
export const Stamp: React.FC<{ readonly text: string; readonly t: number; readonly at: number; readonly color?: string; readonly size?: number; readonly rot?: number }> = ({
  text,
  t,
  at,
  color = toon.red,
  size = 64,
  rot = -8,
}) => {
  if (t < at) {
    return null;
  }
  const s = interpolate(t, [at, at + 0.16], [2.6, 1], { ...clamp01, easing: Easing.out(Easing.cubic) });
  const kick = t > at + 0.16 && t < at + 0.4 ? 1 + 0.05 * Math.sin(((t - at - 0.16) / 0.24) * Math.PI) : 1;
  return (
    <div
      style={{
        opacity: appear(t, at, 0.08),
        transform: `rotate(${rot}deg) scale(${s * kick})`,
        border: `${Math.max(8, size * 0.12)}px solid ${color}`,
        borderRadius: 22,
        padding: `${size * 0.06}px ${size * 0.3}px ${size * 0.12}px`,
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 3,
        color,
        background: "rgba(255,255,255,0.78)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Str: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly p: number }> = ({ x1, y1, x2, y2, p }) => (
  <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={toon.red} strokeWidth={7} strokeLinecap="round" />
);

// ---------- Tanda tanya bulat besar ----------
export const QOrb: React.FC<{ readonly size: number; readonly t: number; readonly color?: string; readonly text?: string }> = ({ size, t, color = toon.orange, text = "?" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: color,
      border: `${size * 0.03}px solid ${INK}`,
      boxShadow: `0 ${size * 0.03}px 0 ${INK}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: toonFont(),
      fontWeight: 700,
      fontSize: size * 0.82,
      color: "#fff",
      WebkitTextStroke: `${size * 0.03}px ${INK}`,
      paintOrder: "stroke fill",
      transform: `rotate(${wig(t, 8, 3)}deg)`,
    }}
  >
    {text}
  </div>
);

// ---------- Pintu toilet (ikon sederhana, tanpa detail) ----------
export const ToiletDoor: React.FC<{ readonly w: number; readonly open: number }> = ({ w, open }) => {
  const h = w * 1.5;
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: w * 3 }}>
      <div style={{ position: "absolute", inset: 0, background: "#FFE3B8", border: `8px solid ${INK}`, borderRadius: 18, boxSizing: "border-box" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: toon.blueLight,
          border: `8px solid ${INK}`,
          borderRadius: 18,
          boxSizing: "border-box",
          transformOrigin: "0% 50%",
          transform: `rotateY(${-open * 68}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={w * 0.5} height={w * 0.8} viewBox="0 0 50 80">
          <circle cx={25} cy={14} r={11} fill={toon.blue} stroke={INK} strokeWidth={4} />
          <path d="M8,76 L8,44 Q8,30 25,30 Q42,30 42,44 L42,76 Z" fill={toon.blue} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", right: w * 0.08, top: "52%", width: 16, height: 16, borderRadius: 16, background: toon.yellow, border: `4px solid ${INK}` }} />
      </div>
    </div>
  );
};

// Koper kecil (bakteri "pindahan").
export const Suitcase: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 50 40" style={{ overflow: "visible", display: "block" }}>
    <path d="M18,8 L18,4 Q18,2 20,2 L30,2 Q32,2 32,4 L32,8" fill="none" stroke={INK} strokeWidth={3.5} />
    <rect x={3} y={8} width={44} height={28} rx={6} fill={toon.yellow} stroke={INK} strokeWidth={4} />
    <rect x={3} y={19} width={44} height={4} fill={INK} opacity={0.35} />
  </svg>
);

export const Chair: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" style={{ overflow: "visible", display: "block" }}>
    <path d="M12,6 L12,30 M12,30 L38,30 M38,30 L38,46 M12,30 L12,46 M12,20 L20,20" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
    <rect x={10} y={26} width={32} height={8} rx={3} fill={toon.blueLight} stroke={INK} strokeWidth={3.5} />
  </svg>
);

// ---------- Kelereng dan bola basket ----------
export const Marble: React.FC<{ readonly size: number; readonly color?: string }> = ({ size, color = toon.blue }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible", display: "block" }}>
    <circle cx={20} cy={20} r={17} fill={color} stroke={INK} strokeWidth={3.5} />
    <path d="M10,15 Q13,8 21,8" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    <circle cx={26} cy={26} r={5} fill="#fff" opacity={0.25} />
  </svg>
);

export const Basketball: React.FC<{ readonly size: number; readonly rot?: number }> = ({ size, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <circle cx={50} cy={50} r={44} fill="#F28A3A" stroke={INK} strokeWidth={5} />
    <path d="M6,50 L94,50 M50,6 L50,94 M18,18 Q40,50 18,82 M82,18 Q60,50 82,82" fill="none" stroke={INK} strokeWidth={4} />
  </svg>
);

export const Sack: React.FC<{ readonly w: number }> = ({ w }) => (
  <svg width={w} height={w * 1.05} viewBox="0 0 120 126" style={{ overflow: "visible", display: "block" }}>
    <path d="M40,24 Q10,60 10,96 Q10,120 60,120 Q110,120 110,96 Q110,60 80,24 Z" fill="#D9B27C" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M36,28 Q60,40 84,28" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d="M40,24 Q36,8 24,6 M80,24 Q84,8 96,6" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d="M30,64 Q40,80 30,100" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
  </svg>
);

// ---------- Papan tulis ----------
export const Whiteboard: React.FC<{ readonly w: number; readonly h: number; readonly children?: React.ReactNode }> = ({ w, h, children }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      background: "#3F7F5F",
      border: `10px solid #C9965E`,
      outline: `5px solid ${INK}`,
      borderRadius: 22,
      boxShadow: `0 10px 0 ${INK}`,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

export const Compass: React.FC<{ readonly size: number; readonly t: number }> = ({ size, t }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: "visible", transform: `rotate(${wig(t, 6, 2.4)}deg)` }}>
    <path d="M40,6 L16,72 M40,6 L64,72" stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
    <path d="M40,6 L16,72 M40,6 L64,72" stroke="#E7E9F2" strokeWidth={4.5} strokeLinecap="round" fill="none" />
    <circle cx={40} cy={8} r={7} fill={toon.yellow} stroke={INK} strokeWidth={3.5} />
  </svg>
);

export const Ruler: React.FC<{ readonly w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.22} viewBox="0 0 200 44" style={{ overflow: "visible", display: "block" }}>
    <rect x={3} y={3} width={194} height={38} rx={8} fill={toon.yellow} stroke={INK} strokeWidth={4.5} />
    {Array.from({ length: 13 }, (_, i) => (
      <line key={i} x1={16 + i * 14} y1={3} x2={16 + i * 14} y2={i % 2 ? 18 : 26} stroke={INK} strokeWidth={3} />
    ))}
  </svg>
);

// ---------- Burung kecil ----------
export const Bird: React.FC<{ readonly size: number; readonly t: number }> = ({ size, t }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 60 48" style={{ overflow: "visible", display: "block" }}>
    <path d="M10,28 Q10,10 30,10 Q50,10 50,28 Q50,42 30,42 Q10,42 10,28 Z" fill={toon.blue} stroke={INK} strokeWidth={4} />
    <path d="M48,24 L58,28 L48,32 Z" fill={toon.yellow} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={38} cy={22} r={5} fill="#fff" stroke={INK} strokeWidth={2.6} />
    <circle cx={39.5} cy={22} r={2.2} fill={INK} />
    <path d={`M20,30 Q14,${20 + 6 * Math.sin(t * 9)} 26,${24 + 4 * Math.sin(t * 9)}`} fill={toon.blueDark} stroke={INK} strokeWidth={3} />
  </svg>
);

// ---------- Awan asam hijau lucu ----------
export const AcidCloud: React.FC<{ readonly w: number; readonly t: number }> = ({ w, t }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 260 160" style={{ overflow: "visible", display: "block" }}>
    <path d="M50,120 Q10,120 14,88 Q18,62 46,64 Q52,28 96,28 Q132,8 160,38 Q204,26 214,66 Q250,70 244,102 Q240,120 210,120 Z" fill="#9BE08F" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <Face cx={130} cy={78} gap={26} r={11} mood="worry" blink={blinkOf(t, 0.4)} />
    {[70, 130, 190].map((x, i) => {
      const y = ((t * 60 + i * 37) % 70) + 128;
      return <path key={i} d={`M${x},${y} q-7,14 0,18 q7,-4 0,-18 z`} fill="#6FC764" stroke={INK} strokeWidth={2.5} />;
    })}
  </svg>
);

// Titik-titik di sepanjang garis patah (px), untuk bakteri kecil di saluran skematis.
export const along = (pts: readonly (readonly [number, number])[], k: number, n: number): [number, number] => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = (total * (k + 0.5)) / n;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const r = Math.min(1, d / seg[i]);
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
    }
    d -= seg[i];
  }
  return pts[0] as [number, number];
};

export const popIn = (t: number, at: number, dur = 0.5) => pop(t, at, dur);

// Titik hitung mundur dua detik: cincin yang terisi (tanpa angka).
export const CountRing: React.FC<{ readonly size: number; readonly p: number }> = ({ size, p }) => {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="#fff" stroke={INK} strokeWidth={8} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r - 2}
        fill="none"
        stroke={toon.orange}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - p)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <line x1={size / 2} y1={size / 2} x2={size / 2 + (r - 18) * Math.cos(p * 2 * Math.PI - Math.PI / 2)} y2={size / 2 + (r - 18) * Math.sin(p * 2 * Math.PI - Math.PI / 2)} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <circle cx={size / 2} cy={size / 2} r={7} fill={INK} />
    </svg>
  );
};

// Kamera 2D: fokus (cx, cy) dan zoom diinterpolasi antar keyframe [detik, cx, cy, zoom]; halus (ease in-out).
export const Cam: React.FC<{ readonly t: number; readonly keys: readonly (readonly [number, number, number, number])[]; readonly children: React.ReactNode }> = ({ t, keys, children }) => {
  let a = keys[0];
  let b = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (t >= keys[i][0]) {
      a = keys[i];
      b = keys[Math.min(i + 1, keys.length - 1)];
    }
  }
  const span = b[0] - a[0];
  const p = span <= 0 ? 1 : interpolate(t, [a[0], b[0]], [0, 1], { ...clamp01, easing: Easing.inOut(Easing.cubic) });
  const cx = a[1] + (b[1] - a[1]) * p;
  const cy = a[2] + (b[2] - a[2]) * p;
  const z = a[3] + (b[3] - a[3]) * p;
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: `${cx}px ${cy}px`, transform: `translate(${960 - cx}px, ${540 - cy}px) scale(${z})` }}>{children}</div>
  );
};

export const Eye: React.FC<{ readonly size: number; readonly slash: number }> = ({ size, slash }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 100 62" style={{ overflow: "visible", display: "block" }}>
    <path d="M6,31 Q50,-12 94,31 Q50,74 6,31 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={50} cy={31} r={15} fill={toon.blue} stroke={INK} strokeWidth={4} />
    <circle cx={50} cy={31} r={7} fill={INK} />
    <circle cx={45} cy={26} r={3.4} fill="#fff" />
    <line x1={16} y1={8} x2={16 + 68 * slash} y2={8 + 46 * slash} stroke={INK} strokeWidth={13} strokeLinecap="round" />
    <line x1={16} y1={8} x2={16 + 68 * slash} y2={8 + 46 * slash} stroke={toon.red} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

// Silang merah (X) gambar-tangan dari p 0..1.
export const RedX: React.FC<{ readonly x: number; readonly y: number; readonly size: number; readonly p: number }> = ({ x, y, size, p }) => {
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible" }}>
      <line x1={14} y1={14} x2={14 + 72 * a} y2={14 + 72 * a} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <line x1={86} y1={14} x2={86 - 72 * b} y2={14 + 72 * b} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <line x1={14} y1={14} x2={14 + 72 * a} y2={14 + 72 * a} stroke={toon.red} strokeWidth={13} strokeLinecap="round" />
      <line x1={86} y1={14} x2={86 - 72 * b} y2={14 + 72 * b} stroke={toon.red} strokeWidth={13} strokeLinecap="round" />
    </svg>
  );
};

// Coretan merah besar (strike) menyilang kotak: dua garis.
export const Strike: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly p: number; readonly q?: number }> = ({ x, y, w, h, p, q }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
    {[
      [0.04, 0.12, 0.96, 0.9, p],
      [0.96, 0.1, 0.04, 0.92, q ?? p],
    ].map(([x1, y1, x2, y2, pp], i) => (
      <g key={i}>
        <line x1={w * x1} y1={h * y1} x2={w * (x1 + (x2 - x1) * pp)} y2={h * (y1 + (y2 - y1) * pp)} stroke={INK} strokeWidth={Math.max(18, h * 0.12)} strokeLinecap="round" />
        <line x1={w * x1} y1={h * y1} x2={w * (x1 + (x2 - x1) * pp)} y2={h * (y1 + (y2 - y1) * pp)} stroke={toon.red} strokeWidth={Math.max(11, h * 0.07)} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// Titik-titik saluran pencernaan skematis dalam koordinat siluet (viewBox 200x400), lalu dipetakan ke layar.
export const TRACT_ALL: readonly (readonly [number, number])[] = [
  [100, 100],
  [100, 128],
  [84, 156],
  [100, 164],
  [96, 190],
  [86, 216],
  [112, 214],
  [100, 232],
  [88, 250],
  [112, 262],
  [64, 232],
  [70, 270],
  [142, 215],
  [136, 240],
  [138, 270],
  [102, 198],
  [78, 198],
  [124, 198],
  [58, 222],
  [60, 262],
];
export const TRACT_COLON: readonly (readonly [number, number])[] = [
  [142, 215],
  [136, 240],
  [138, 270],
  [102, 198],
  [78, 198],
  [124, 198],
  [58, 222],
  [60, 262],
  [64, 240],
  [140, 280],
  [90, 198],
  [58, 280],
];
export const mapSil = (x0: number, y0: number, w: number, h: number, p: readonly [number, number]): [number, number] => [x0 + (p[0] / 200) * w, y0 + (p[1] / 400) * h];

export const Orange: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly o?: number }> = ({ x, y, r, o = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, background: toon.orange, border: `${Math.max(2, r * 0.22)}px solid ${INK}`, opacity: o, boxSizing: "border-box" }} />
);

export const Gift: React.FC<{ readonly size: number; readonly t: number }> = ({ size, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block", transform: `rotate(${wig(t, 7, 4)}deg)` }}>
    <rect x={14} y={42} width={72} height={48} rx={8} fill={toon.orange} stroke={INK} strokeWidth={5} />
    <rect x={8} y={30} width={84} height={20} rx={7} fill={toon.orangeLight} stroke={INK} strokeWidth={5} />
    <rect x={44} y={30} width={12} height={60} fill={toon.blue} stroke={INK} strokeWidth={4} />
    <path d="M50,30 Q30,2 24,18 Q20,30 50,30 Q80,30 76,18 Q70,2 50,30" fill={toon.yellow} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const ScoreBoard: React.FC<{ readonly w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.5, background: "#2B2D42", border: `8px solid ${INK}`, borderRadius: 26, boxShadow: `0 10px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6%", boxSizing: "border-box" }}>
    <div style={{ width: w * 0.12, height: w * 0.12, borderRadius: 14, background: toon.orange, border: `5px solid #fff` }} />
    <div style={{ display: "flex", gap: w * 0.04 }}>
      <div style={{ width: w * 0.2, height: w * 0.3, borderRadius: 14, background: "#fff", border: `5px solid ${INK}` }} />
      <div style={{ width: w * 0.2, height: w * 0.3, borderRadius: 14, background: "#fff", border: `5px solid ${INK}` }} />
    </div>
    <div style={{ width: w * 0.12, height: w * 0.12, borderRadius: 14, background: toon.blue, border: `5px solid #fff` }} />
  </div>
);

// ---------- Tambahan: pil, kartu, amplop, halaman kalender, timbangan 2D dengan tim ----------
export const Pill: React.FC<{
  readonly text: string;
  readonly cx: number;
  readonly y: number;
  readonly t: number;
  readonly at: number;
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
}> = ({ text, cx, y, t, at, bg = toon.blue, color = "#fff", size = 44 }) => {
  if (t < at) {
    return null;
  }
  const p = pop(t, at, 0.45);
  return (
    <div style={{ position: "absolute", left: cx, top: y, transform: `translate(-50%, 0) scale(${p})`, opacity: appear(t, at, 0.1), whiteSpace: "nowrap" }}>
      <div
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: size,
          letterSpacing: 2,
          color,
          background: bg,
          border: `5px solid ${INK}`,
          boxShadow: `0 5px 0 ${INK}`,
          borderRadius: 999,
          padding: "4px 28px 8px",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Card: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly bg?: string; readonly dashed?: boolean; readonly op?: number; readonly children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  bg = "#fff",
  dashed = false,
  op = 1,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      border: `7px ${dashed ? "dashed" : "solid"} ${INK}`,
      borderRadius: 34,
      boxShadow: dashed ? undefined : `0 9px 0 ${INK}`,
      opacity: op,
      boxSizing: "border-box",
      overflow: "visible",
    }}
  >
    {children}
  </div>
);

export const Envelope: React.FC<{ readonly w: number; readonly children?: React.ReactNode }> = ({ w, children }) => (
  <div style={{ position: "relative", width: w, height: w * 0.64 }}>
    <div style={{ position: "absolute", inset: 0, background: "#FFF3D6", border: `6px solid ${INK}`, borderRadius: 14, boxShadow: `0 8px 0 ${INK}`, boxSizing: "border-box" }} />
    <svg width={w} height={w * 0.64} viewBox="0 0 100 64" style={{ position: "absolute", inset: 0 }}>
      <path d="M3,4 L50,38 L97,4" fill="none" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
    {children}
  </div>
);

export const Page: React.FC<{ readonly w: number; readonly rot?: number }> = ({ w, rot = 0 }) => (
  <svg width={w} height={w * 1.05} viewBox="0 0 100 105" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <rect x={5} y={8} width={90} height={92} rx={9} fill="#fff" stroke={INK} strokeWidth={5} />
    <path d="M5,17 Q5,8 14,8 L86,8 Q95,8 95,17 L95,34 L5,34 Z" fill={toon.red} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={20} y={50} width={60} height={9} rx={4.5} fill="#D9DCEB" />
    <rect x={20} y={68} width={44} height={9} rx={4.5} fill="#D9DCEB" />
  </svg>
);

// Timbangan 2D (komponen Scale Shorts) dengan anggota tim di kedua piring. angle: derajat, positif = kanan turun.
export const TeamScale: React.FC<{
  readonly w: number;
  readonly angle: number;
  readonly t: number;
  readonly nb: number;
  readonly nc: number;
  readonly cellNuc?: boolean;
}> = ({ w, angle, t, nb, nc, cellNuc = false }) => {
  const rowsOf = (n: number, size: number, h: number, cx: number, cy: number, make: (x: number, y: number, i: number) => React.ReactNode) =>
    Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / 3);
      const inRow = Math.min(3, n - row * 3);
      const col = i % 3;
      const x = cx + (col - (inRow - 1) / 2) * (size * 1.04) - size / 2;
      const y = cy + 6 - (row + 1) * h - row * 3 + 2 * Math.sin(t * 4 + i);
      return make(x, y, i);
    });
  return (
    <Scale
      w={w}
      angle={angle}
      left={(cx, cy) => <g>{rowsOf(nb, 50, 34, cx, cy, (x, y, i) => <Bacteria key={i} size={50} x={x} y={y} t={t} phase={i} mood="laugh" />)}</g>}
      right={(cx, cy) => <g>{rowsOf(nc, 44, 44, cx, cy, (x, y, i) => <Cell key={i} size={44} x={x} y={y} t={t} phase={i + 1} mood="laugh" />)}</g>}
    />
  );
};

export const grid = (n: number, cols: number, x0: number, y0: number, dx: number, dy: number, stagger = 0) =>
  Array.from({ length: n }, (_, i) => ({ x: x0 + (i % cols) * dx + (Math.floor(i / cols) % 2) * stagger, y: y0 + Math.floor(i / cols) * dy, i }));

// Sendok dengan titik (skema "sedikit isi usus").
export const Spoon: React.FC<{ readonly w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", display: "block" }}>
    <path d="M70,50 L190,44" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M70,50 L190,44" stroke={toon.blueLight} strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={46} cy={50} rx={40} ry={32} fill="#fff" stroke={INK} strokeWidth={5} />
    {[[32, 44], [50, 38], [48, 58], [30, 58], [60, 52]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={5.5} fill={toon.orange} stroke={INK} strokeWidth={2} />
    ))}
  </svg>
);

// Detektif + kaca pembesar yang gagangnya berakhir tepat di tangan.
export const Det: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly t: number;
  readonly mood?: Mood;
  readonly hand?: readonly [number, number];
  readonly lens?: number;
  readonly lensRot?: number;
  readonly flip?: boolean;
  readonly bare?: boolean;
  readonly phase?: number;
  readonly children?: React.ReactNode;
}> = ({ x, y, size, t, mood = "happy", hand = [128, 158], lens = 0, lensRot = 40, flip = false, bare = false, phase = 0, children }) => {
  const k = size / 160;
  const hx = flip ? x + (160 - hand[0]) * k : x + hand[0] * k;
  const hy = y + hand[1] * k;
  const a = (lensRot * Math.PI) / 180;
  const lx = hx - 2.3 * lens * -Math.sin(a);
  const ly = hy - 2.3 * lens * Math.cos(a);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y }}>
        <Detective size={size} t={t} mood={mood} hand={hand} flip={flip} bare={bare} phase={phase} />
      </div>
      {lens > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <MagnifierG x={lx} y={ly} r={lens} rot={lensRot} />
          {children}
        </svg>
      ) : null}
    </>
  );
};
export const lensCenter = (x: number, y: number, size: number, hand: readonly [number, number], lens: number, lensRot: number, flip = false): [number, number] => {
  const k = size / 160;
  const hx = flip ? x + (160 - hand[0]) * k : x + hand[0] * k;
  const hy = y + hand[1] * k;
  const a = (lensRot * Math.PI) / 180;
  return [hx - 2.3 * lens * -Math.sin(a), hy - 2.3 * lens * Math.cos(a)];
};
