import React, { createContext, useContext } from "react";
import { toon } from "../theme";

// Tokoh kartun Shorts V3 (dibuat dari SVG, dipakai ulang di semua adegan):
// Tim Bakteri (kapsul oranye), Tim Sel Manusia (bulat biru), Detektif, siluet tubuh,
// timbangan, stadion, kalender. Semua menerima `t` (detik) untuk kedip dan gerak halus.

export type Mood = "happy" | "laugh" | "oh" | "worry" | "think";
export type Arms = { readonly l?: number; readonly r?: number };

const OUT = toon.ink;

// Draf 2 (3D): tokoh 2D Bakteri/Sel disembunyikan, tokoh 3D digambar di atasnya. Default false (draf 1 tidak berubah).
export const HideToyChars = createContext(false);

const blinkOf = (t: number, phase: number) => ((t * 0.8 + phase) % 3 > 2.9 ? 0.1 : 1);

const Face: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly gap: number;
  readonly r: number;
  readonly mood: Mood;
  readonly look?: readonly [number, number];
  readonly blink: number;
}> = ({ cx, cy, gap, r, mood, look = [0, 0], blink }) => {
  const m = r * 1.1;
  const my = cy + r * 1.75;
  const eye = (ex: number) => (
    <g key={ex}>
      <ellipse cx={ex} cy={cy} rx={r} ry={Math.max(1.2, r * blink)} fill="#fff" stroke={OUT} strokeWidth={r * 0.28} />
      {blink > 0.5 ? (
        <circle cx={ex + look[0] * r * 0.4} cy={cy + look[1] * r * 0.4} r={r * 0.5} fill={OUT} />
      ) : null}
    </g>
  );
  return (
    <g>
      <ellipse cx={cx - gap * 1.45} cy={cy + r * 1.2} rx={r * 0.62} ry={r * 0.4} fill="#FF8FA3" opacity={0.55} />
      <ellipse cx={cx + gap * 1.45} cy={cy + r * 1.2} rx={r * 0.62} ry={r * 0.4} fill="#FF8FA3" opacity={0.55} />
      {eye(cx - gap)}
      {eye(cx + gap)}
      {mood === "happy" ? (
        <path d={`M${cx - m},${my} Q${cx},${my + m * 0.95} ${cx + m},${my}`} fill="none" stroke={OUT} strokeWidth={r * 0.36} strokeLinecap="round" />
      ) : null}
      {mood === "laugh" ? (
        <path d={`M${cx - m},${my - 1} Q${cx},${my + m * 1.9} ${cx + m},${my - 1} Z`} fill="#7A2E2E" stroke={OUT} strokeWidth={r * 0.3} strokeLinejoin="round" />
      ) : null}
      {mood === "oh" ? <ellipse cx={cx} cy={my + 2} rx={m * 0.36} ry={m * 0.5} fill="#7A2E2E" stroke={OUT} strokeWidth={r * 0.26} /> : null}
      {mood === "worry" ? (
        <path d={`M${cx - m * 0.85},${my + m * 0.4} Q${cx},${my - m * 0.4} ${cx + m * 0.85},${my + m * 0.4}`} fill="none" stroke={OUT} strokeWidth={r * 0.36} strokeLinecap="round" />
      ) : null}
      {mood === "think" ? (
        <path d={`M${cx - m * 0.6},${my + 1} L${cx + m * 0.6},${my - 2}`} fill="none" stroke={OUT} strokeWidth={r * 0.36} strokeLinecap="round" />
      ) : null}
    </g>
  );
};

// Lengan: 0 = turun, 90 = lurus ke samping, 180 = lurus ke atas.
const Arm: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  readonly side: "l" | "r";
  readonly len: number;
  readonly color: string;
}> = ({ x, y, angle, side, len, color }) => {
  const a = (angle * Math.PI) / 180;
  const dir = side === "l" ? -1 : 1;
  const ex = x + dir * Math.sin(a) * len;
  const ey = y + Math.cos(a) * len;
  return (
    <g>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={OUT} strokeWidth={len * 0.42} strokeLinecap="round" />
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={len * 0.2} strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={len * 0.24} fill={color} stroke={OUT} strokeWidth={len * 0.1} />
    </g>
  );
};

type CharProps = {
  readonly size: number;
  readonly t?: number;
  readonly mood?: Mood;
  readonly arms?: Arms;
  readonly look?: readonly [number, number];
  readonly phase?: number;
  readonly x?: number;
  readonly y?: number;
};

// Tim Bakteri: kapsul oranye, mata bulat, senyum.
const BacteriaFlat: React.FC<CharProps> = ({ size, t = 0, mood = "happy", arms, look, phase = 0, x, y }) => (
  <svg x={x} y={y} width={size} height={(size * 80) / 120} viewBox="0 0 120 80" style={{ overflow: "visible", display: "block" }}>
    {arms?.l !== undefined ? <Arm x={14} y={46} angle={arms.l} side="l" len={26} color={toon.orange} /> : null}
    {arms?.r !== undefined ? <Arm x={106} y={46} angle={arms.r} side="r" len={26} color={toon.orange} /> : null}
    <rect x={8} y={8} width={104} height={64} rx={32} fill={toon.orange} stroke={OUT} strokeWidth={4.5} />
    <rect x={24} y={14} width={34} height={8} rx={4} fill={toon.orangeLight} opacity={0.85} />
    <circle cx={92} cy={58} r={4} fill={toon.orangeDark} opacity={0.4} />
    <circle cx={101} cy={30} r={3} fill={toon.orangeDark} opacity={0.4} />
    <circle cx={22} cy={52} r={3.2} fill={toon.orangeDark} opacity={0.4} />
    <Face cx={60} cy={36} gap={17} r={9.5} mood={mood} look={look} blink={blinkOf(t, phase)} />
  </svg>
);

// Tim Sel Manusia: bulat biru, mata bulat.
const CellFlat: React.FC<CharProps> = ({ size, t = 0, mood = "happy", arms, look, phase = 0, x, y }) => (
  <svg x={x} y={y} width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block" }}>
    {arms?.l !== undefined ? <Arm x={9} y={56} angle={arms.l} side="l" len={24} color={toon.blue} /> : null}
    {arms?.r !== undefined ? <Arm x={91} y={56} angle={arms.r} side="r" len={24} color={toon.blue} /> : null}
    <circle cx={50} cy={50} r={42} fill={toon.blue} stroke={OUT} strokeWidth={4.5} />
    <path d="M24,34 Q30,20 46,16" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
    <circle cx={72} cy={72} r={9} fill={toon.blueDark} opacity={0.3} />
    <Face cx={50} cy={47} gap={15} r={9} mood={mood} look={look} blink={blinkOf(t, phase)} />
  </svg>
);

export const Bacteria: React.FC<CharProps> = (props) => {
  const hide = useContext(HideToyChars);
  return hide ? <div style={{ width: props.size, height: (props.size * 80) / 120 }} /> : <BacteriaFlat {...props} />;
};

export const Cell: React.FC<CharProps> = (props) => {
  const hide = useContext(HideToyChars);
  return hide ? <div style={{ width: props.size, height: props.size }} /> : <CellFlat {...props} />;
};

// Kaca pembesar (dipakai di dalam <svg>). (x, y) = pusat lensa.
export const MagnifierG: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly rot?: number }> = ({
  x,
  y,
  r,
  rot = 40,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <line x1={0} y1={r} x2={0} y2={r * 2.3} stroke={OUT} strokeWidth={r * 0.46} strokeLinecap="round" />
    <line x1={0} y1={r} x2={0} y2={r * 2.3} stroke="#B9774A" strokeWidth={r * 0.26} strokeLinecap="round" />
    <circle r={r} fill="#D8EEFF" fillOpacity={0.55} stroke={OUT} strokeWidth={r * 0.2} />
    <circle r={r * 0.9} fill="none" stroke="#F2B544" strokeWidth={r * 0.12} />
    <path d={`M${-r * 0.55},${-r * 0.1} Q${-r * 0.45},${-r * 0.6} ${r * 0.05},${-r * 0.65}`} fill="none" stroke="#fff" strokeWidth={r * 0.14} strokeLinecap="round" opacity={0.9} />
  </g>
);

// Pensil kecil (di dalam <svg>), ujung di (x, y).
export const PencilG: React.FC<{ readonly x: number; readonly y: number; readonly rot?: number }> = ({ x, y, rot = 30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-3.5} y={-40} width={7} height={34} rx={2} fill={toon.yellow} stroke={OUT} strokeWidth={2} />
    <path d="M-3.5,-6 L0,2 L3.5,-6 Z" fill={toon.skin} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
    <rect x={-3.5} y={-44} width={7} height={6} rx={2} fill={toon.red} stroke={OUT} strokeWidth={2} />
  </g>
);

// Detektif / peneliti: topi, kacamata bulat, jas putih. Anak-anak <svg> digambar dalam koordinat 160x230,
// dengan tangan kanan di `hand`.
export const Detective: React.FC<{
  readonly size: number;
  readonly t?: number;
  readonly mood?: Mood;
  readonly hand?: readonly [number, number];
  readonly hat?: string;
  readonly flip?: boolean;
  readonly phase?: number;
  readonly children?: React.ReactNode;
}> = ({ size, t = 0, mood = "happy", hand = [128, 158], hat = "#A9683C", flip = false, phase = 0, children }) => {
  const blink = blinkOf(t, phase);
  return (
    <svg
      width={size}
      height={(size * 230) / 160}
      viewBox="0 0 160 230"
      style={{ overflow: "visible", display: "block", transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* kaki */}
      <rect x={56} y={190} width={18} height={30} rx={8} fill="#3B4A78" stroke={OUT} strokeWidth={4} />
      <rect x={86} y={190} width={18} height={30} rx={8} fill="#3B4A78" stroke={OUT} strokeWidth={4} />
      <ellipse cx={62} cy={224} rx={16} ry={7} fill={OUT} />
      <ellipse cx={98} cy={224} rx={16} ry={7} fill={OUT} />
      {/* lengan kiri (diam) */}
      <line x1={44} y1={122} x2={32} y2={166} stroke={OUT} strokeWidth={17} strokeLinecap="round" />
      <line x1={44} y1={122} x2={32} y2={166} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <circle cx={31} cy={170} r={8} fill={toon.skin} stroke={OUT} strokeWidth={3.5} />
      {/* jas */}
      <path d="M42,108 Q42,100 52,100 L108,100 Q118,100 118,108 L122,200 Q122,208 114,208 L46,208 Q38,208 38,200 Z" fill="#fff" stroke={OUT} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M80,100 L80,208" stroke={OUT} strokeWidth={3} opacity={0.5} />
      <path d="M64,100 L80,128 L96,100" fill={toon.blue} stroke={OUT} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={72} cy={150} r={3} fill={OUT} opacity={0.6} />
      <circle cx={72} cy={172} r={3} fill={OUT} opacity={0.6} />
      <rect x={90} y={140} width={16} height={14} rx={3} fill="none" stroke={OUT} strokeWidth={2.5} opacity={0.6} />
      {/* kepala */}
      <circle cx={80} cy={72} r={35} fill={toon.skin} stroke={OUT} strokeWidth={4.5} />
      <circle cx={45} cy={76} r={7} fill={toon.skin} stroke={OUT} strokeWidth={3.5} />
      <circle cx={115} cy={76} r={7} fill={toon.skin} stroke={OUT} strokeWidth={3.5} />
      {/* topi */}
      <path d="M45,58 Q46,18 80,16 Q114,18 115,58 Z" fill={hat} stroke={OUT} strokeWidth={4.5} strokeLinejoin="round" />
      <ellipse cx={80} cy={58} rx={41} ry={9} fill={hat} stroke={OUT} strokeWidth={4.5} />
      <path d="M47,52 Q80,60 113,52" fill="none" stroke="#7A4524" strokeWidth={5} opacity={0.7} />
      <circle cx={80} cy={15} r={5} fill="#7A4524" stroke={OUT} strokeWidth={3} />
      {/* wajah + kacamata */}
      <Face cx={80} cy={76} gap={14} r={7.5} mood={mood} blink={blink} look={[0.6, 0]} />
      <circle cx={66} cy={76} r={11.5} fill="#D8EEFF" fillOpacity={0.35} stroke={OUT} strokeWidth={3} />
      <circle cx={94} cy={76} r={11.5} fill="#D8EEFF" fillOpacity={0.35} stroke={OUT} strokeWidth={3} />
      <line x1={77.5} y1={76} x2={82.5} y2={76} stroke={OUT} strokeWidth={3} />
      {/* lengan kanan ke `hand` */}
      <line x1={116} y1={122} x2={hand[0]} y2={hand[1]} stroke={OUT} strokeWidth={17} strokeLinecap="round" />
      <line x1={116} y1={122} x2={hand[0]} y2={hand[1]} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      <circle cx={hand[0]} cy={hand[1]} r={8.5} fill={toon.skin} stroke={OUT} strokeWidth={3.5} />
      {children}
    </svg>
  );
};

// Siluet tubuh ramah (bukan anatomi asli). `tract`: tampilkan garis saluran pencernaan sederhana.
export const BodySilhouette: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly t?: number;
  readonly glow?: number; // cahaya oranye di perut, 0..1
  readonly tract?: "none" | "dim" | "focus";
  readonly focus?: number; // 0..1 peralihan dim -> focus
  readonly fill?: string;
  readonly uid?: string;
}> = ({ w, h, t = 0, glow = 0, tract = "none", focus = 0, fill = toon.blueLight, uid = "b" }) => {
  const pulse = 0.85 + 0.15 * Math.sin(t * 4);
  const limb = (x1: number, y1: number, x2: number, y2: number, wd: number) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={OUT} strokeWidth={wd + 7} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={fill} strokeWidth={wd} strokeLinecap="round" />
    </g>
  );
  const dimOp = tract === "focus" ? 0.85 * (1 - focus) + 0.3 * focus : 0.85;
  return (
    <svg width={w} height={h} viewBox="0 0 200 400" preserveAspectRatio="none" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <radialGradient id={`belly-${uid}`}>
          <stop offset="0%" stopColor={toon.orange} stopOpacity={0.95} />
          <stop offset="60%" stopColor={toon.orange} stopOpacity={0.45} />
          <stop offset="100%" stopColor={toon.orange} stopOpacity={0} />
        </radialGradient>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>
      {limb(70, 322, 66, 384, 30)}
      {limb(130, 322, 134, 384, 30)}
      {limb(50, 112, 28, 220, 22)}
      {limb(150, 112, 172, 220, 22)}
      <rect x={45} y={86} width={110} height={226} rx={52} fill={fill} stroke={OUT} strokeWidth={5.5} />
      <rect x={90} y={72} width={20} height={24} fill={fill} />
      <circle cx={100} cy={48} r={36} fill={fill} stroke={OUT} strokeWidth={5.5} />
      <Face cx={100} cy={48} gap={13} r={7} mood="happy" blink={blinkOf(t, 0.3)} />
      {glow > 0 ? <circle cx={100} cy={205} r={90} fill={`url(#belly-${uid})`} opacity={glow * pulse} /> : null}
      {tract !== "none" ? (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M100,86 L100,148" stroke={toon.orangeDark} strokeWidth={6} opacity={dimOp} />
          <path d="M70,152 Q70,142 90,144 Q112,147 108,167 Q100,184 80,174 Q68,167 70,152 Z" stroke={toon.orangeDark} strokeWidth={5} fill={toon.orange} fillOpacity={dimOp * 0.45} opacity={dimOp} />
          <path d="M80,214 C100,204 122,214 122,228 C122,242 78,238 78,252 C78,266 122,262 122,274" stroke={toon.orangeDark} strokeWidth={6} opacity={dimOp} />
          {tract === "focus" ? (
            <g opacity={focus}>
              <path d="M142,288 L142,206 Q142,190 124,190 L76,190 Q58,190 58,206 L58,288" stroke={toon.orange} strokeWidth={26} filter={`url(#blur-${uid})`} opacity={0.8 * pulse} />
              <path d="M142,288 L142,206 Q142,190 124,190 L76,190 Q58,190 58,206 L58,288" stroke={OUT} strokeWidth={21} />
              <path d="M142,288 L142,206 Q142,190 124,190 L76,190 Q58,190 58,206 L58,288" stroke={toon.orange} strokeWidth={13} />
            </g>
          ) : null}
          <path
            d="M142,288 L142,206 Q142,190 124,190 L76,190 Q58,190 58,206 L58,288"
            stroke={toon.orangeDark}
            strokeWidth={13}
            opacity={tract === "focus" ? 0.85 * (1 - focus) : dimOp}
          />
        </g>
      ) : null}
    </svg>
  );
};

// Timbangan dua piring. `angle` derajat (positif = sisi kanan turun). Anak-anak digambar dalam
// koordinat viewBox 0 0 420 330 dan menerima titik tengah piring lewat render prop.
export const Scale: React.FC<{
  readonly w: number;
  readonly angle: number;
  readonly left?: (cx: number, cy: number) => React.ReactNode;
  readonly right?: (cx: number, cy: number) => React.ReactNode;
}> = ({ w, angle, left, right }) => {
  const a = (angle * Math.PI) / 180;
  const half = 150;
  const px = 210;
  const py = 70;
  const lx = px - Math.cos(a) * half;
  const ly = py - Math.sin(a) * half;
  const rx = px + Math.cos(a) * half;
  const ry = py + Math.sin(a) * half;
  const drop = 120;
  const pan = (x: number, y: number) => (
    <g>
      <line x1={x} y1={y} x2={x - 62} y2={y + drop} stroke={OUT} strokeWidth={4} />
      <line x1={x} y1={y} x2={x + 62} y2={y + drop} stroke={OUT} strokeWidth={4} />
      <path d={`M${x - 78},${y + drop} L${x + 78},${y + drop} Q${x + 70},${y + drop + 34} ${x},${y + drop + 34} Q${x - 70},${y + drop + 34} ${x - 78},${y + drop} Z`} fill={toon.yellow} stroke={OUT} strokeWidth={4.5} strokeLinejoin="round" />
    </g>
  );
  return (
    <svg width={w} height={(w * 330) / 420} viewBox="0 0 420 330" style={{ overflow: "visible", display: "block" }}>
      <path d="M210,70 L210,290" stroke={OUT} strokeWidth={16} strokeLinecap="round" />
      <path d="M210,70 L210,290" stroke="#B9774A" strokeWidth={8} strokeLinecap="round" />
      <path d="M130,308 Q130,286 150,286 L270,286 Q290,286 290,308 Z" fill="#B9774A" stroke={OUT} strokeWidth={4.5} strokeLinejoin="round" />
      {pan(lx, ly)}
      {pan(rx, ry)}
      {left ? left(lx, ly + drop - 2) : null}
      {right ? right(rx, ry + drop - 2) : null}
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={OUT} strokeWidth={14} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke="#E8A35E" strokeWidth={7} strokeLinecap="round" />
      <circle cx={px} cy={py} r={13} fill={toon.yellow} stroke={OUT} strokeWidth={4} />
    </svg>
  );
};

// Stadion dari atas. `fill` 0..1 = orange memenuhi tribun dari tengah ke pojok.
// `emptyCorner`: satu pojok tetap kosong (tampil setelah fill selesai).
export const Stadium: React.FC<{
  readonly w: number;
  readonly fill: number;
  readonly emptyCorner?: number;
  readonly t?: number;
  readonly hideCell?: boolean;
}> = ({ w, fill, emptyCorner = 0, t = 0, hideCell = false }) => {
  const stands = "M170,20 L430,20 A150,150 0 0 1 580,170 L580,350 A150,150 0 0 1 430,500 L170,500 A150,150 0 0 1 20,350 L20,170 A150,150 0 0 1 170,20 Z M210,120 L390,120 A90,90 0 0 1 480,210 L480,310 A90,90 0 0 1 390,400 L210,400 A90,90 0 0 1 120,310 L120,210 A90,90 0 0 1 210,120 Z";
  const R = fill * 520;
  return (
    <svg width={w} height={(w * 520) / 600} viewBox="0 0 600 520" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <pattern id="st-seats" width={16} height={16} patternUnits="userSpaceOnUse">
          <rect width={16} height={16} fill={toon.seat} />
          <rect x={2} y={4} width={12} height={8} rx={3} fill="#E4CFA3" />
        </pattern>
        <pattern id="st-crowd" width={16} height={16} patternUnits="userSpaceOnUse">
          <rect width={16} height={16} fill={toon.orangeLight} />
          <circle cx={8} cy={7} r={5} fill={toon.orange} />
          <rect x={3} y={11} width={10} height={5} rx={2.5} fill={toon.orangeDark} />
        </pattern>
        <clipPath id="st-clip">
          <path d={stands} clipRule="evenodd" />
        </clipPath>
        <clipPath id="st-reveal">
          <circle cx={300} cy={260} r={R} />
        </clipPath>
      </defs>
      <rect x={4} y={4} width={592} height={512} rx={160} fill={toon.concourse} stroke={OUT} strokeWidth={5} />
      <path d={stands} fillRule="evenodd" fill="url(#st-seats)" />
      <g clipPath="url(#st-clip)">
        <g clipPath="url(#st-reveal)">
          <rect width={600} height={520} fill="url(#st-crowd)" />
        </g>
        {emptyCorner > 0 ? (
          <g opacity={emptyCorner}>
            <circle cx={478} cy={92} r={64} fill="url(#st-seats)" />
            <circle cx={478} cy={92} r={64} fill="none" stroke={toon.concourse} strokeWidth={4} strokeDasharray="8 8" />
          </g>
        ) : null}
      </g>
      <path d={stands} fillRule="evenodd" fill="none" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      <rect x={120} y={120} width={360} height={280} rx={90} fill="#8FD18A" stroke={OUT} strokeWidth={5} />
      <rect x={150} y={150} width={300} height={220} rx={60} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
      <line x1={300} y1={150} x2={300} y2={370} stroke="#fff" strokeWidth={4} opacity={0.8} />
      <circle cx={300} cy={260} r={36} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
      {emptyCorner > 0 && !hideCell ? (
        <g opacity={emptyCorner}>
          <Cell x={452} y={58} size={52} t={t} mood="think" arms={{ r: 150 + 10 * Math.sin(t * 7) }} look={[-0.8, -0.2]} />
        </g>
      ) : null}
    </svg>
  );
};

// Kalender kartun. Halaman kosong terbalik satu per satu dari `flipAt`, membuka tahun di bawahnya.
export const Calendar: React.FC<{
  readonly w: number;
  readonly t: number;
  readonly flipAt: number;
  readonly reveal: number; // 0..1 skala angka tahun
}> = ({ w, t, flipAt, reveal }) => {
  const h = w * 0.92;
  const pages = [2, 1, 0];
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: w * 2.2 }}>
      <svg width={w} height={h} viewBox="0 0 400 368" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={8} y={28} width={384} height={332} rx={28} fill="#fff" stroke={OUT} strokeWidth={6} />
        <path d="M8,56 Q8,28 36,28 L364,28 Q392,28 392,56 L392,96 L8,96 Z" fill={toon.red} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        {[70, 140, 210, 280, 330].map((x) => (
          <rect key={x} x={x - 9} y={8} width={18} height={44} rx={9} fill="#E7E9F2" stroke={OUT} strokeWidth={4} />
        ))}
        <text
          x={200}
          y={252}
          textAnchor="middle"
          fontFamily="Fredoka, sans-serif"
          fontWeight={700}
          fontSize={118}
          fill={OUT}
          transform={`translate(200 220) scale(${reveal}) translate(-200 -220)`}
        >
          1972
        </text>
        <rect x={150} y={290} width={100} height={10} rx={5} fill={toon.orange} opacity={reveal} />
      </svg>
      {pages.map((i) => {
        const p = Math.min(1, Math.max(0, (t - (flipAt + i * 0.5)) / 0.5));
        if (p >= 1) {
          return null;
        }
        const deg = -p * 175;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 8 * (w / 400),
              top: 28 * (w / 400),
              width: 384 * (w / 400),
              height: 332 * (w / 400),
              transformOrigin: "50% 0%",
              transform: `rotateX(${-deg * -1}deg)`,
              opacity: p > 0.5 ? 0 : 1,
              borderRadius: 28,
              background: i === 2 ? "#fff" : "#FFFDF6",
              border: `6px solid ${OUT}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ height: "28%", background: toon.red, borderRadius: "20px 20px 0 0", borderBottom: `6px solid ${OUT}` }} />
            <div style={{ margin: "10% 12%", height: 14, borderRadius: 7, background: "#E7E9F2" }} />
            <div style={{ margin: "5% 12%", height: 14, width: "60%", borderRadius: 7, background: "#E7E9F2" }} />
          </div>
        );
      })}
    </div>
  );
};
