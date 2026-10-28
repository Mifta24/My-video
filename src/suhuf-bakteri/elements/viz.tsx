import type React from "react";
import { interpolate, random } from "remotion";
import { colors, fonts } from "../theme";
import { clamp, easeOut } from "./common";

// ─────────────── Kolom titik (bakteri oranye, sel manusia krem) ───────────────
// Digambar di dalam <svg>. `n` boleh pecahan (beranimasi), `appear` 0..1 memunculkan
// titik dari bawah bergelombang. Titik ke-i ada di baris floor(i/cols) dari bawah.
export const DotColumn: React.FC<{
  readonly x: number; // tengah kolom
  readonly base: number; // y dasar kolom
  readonly n: number;
  readonly cols?: number;
  readonly d?: number; // jarak antartitik
  readonly r?: number;
  readonly color?: string;
  readonly appear?: number;
  readonly t?: number; // untuk getar halus
  readonly jitter?: number;
  readonly colorAt?: (i: number) => string | undefined;
  readonly opacityAt?: (i: number) => number;
  readonly glow?: boolean;
  readonly seed?: string;
}> = ({
  x,
  base,
  n,
  cols = 5,
  d = 34,
  r,
  color = colors.orange,
  appear = 1,
  t = 0,
  jitter = 0,
  colorAt,
  opacityAt,
  glow = true,
  seed = "c",
}) => {
  const radius = r ?? d * 0.36;
  const count = Math.ceil(n);
  const shown = appear * (count + 2.5);
  const left = x - ((cols - 1) * d) / 2;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const partial = i === count - 1 ? n - Math.floor(n) || 1 : 1;
    const a = interpolate(shown - i, [0, 2.5], [0, 1], clamp);
    if (a <= 0) {
      continue;
    }
    const jx = jitter * Math.sin(t * 9 + random(`${seed}${i}a`) * 20);
    const jy = jitter * Math.cos(t * 8 + random(`${seed}${i}b`) * 20);
    const fill = colorAt?.(i) ?? color;
    dots.push(
      <circle
        key={i}
        cx={left + col * d + jx}
        cy={base - radius - row * d + (1 - a) * 14 + jy}
        r={radius * (0.6 + 0.4 * a)}
        fill={fill}
        opacity={a * partial * (opacityAt?.(i) ?? 1)}
      />,
    );
  }
  return (
    <g style={glow ? { filter: `drop-shadow(0 0 ${d * 0.25}px ${color}66)` } : undefined}>{dots}</g>
  );
};

export const columnHeight = (n: number, cols = 5, d = 34) => Math.ceil(Math.ceil(n) / cols) * d;

// Batang padat (untuk perbandingan cepat): tumbuh dari bawah.
export const Bar: React.FC<{
  readonly x: number;
  readonly base: number;
  readonly w: number;
  readonly h: number;
  readonly grow?: number;
  readonly color?: string;
  readonly opacity?: number;
  readonly dashed?: boolean;
}> = ({ x, base, w, h, grow = 1, color = colors.orange, opacity = 1, dashed = false }) => {
  const hh = h * grow;
  return (
    <rect
      x={x - w / 2}
      y={base - hh}
      width={w}
      height={Math.max(0, hh)}
      rx={Math.min(12, w / 6)}
      fill={dashed ? "none" : color}
      stroke={dashed ? color : "none"}
      strokeWidth={dashed ? 4 : 0}
      strokeDasharray={dashed ? "12 10" : undefined}
      opacity={opacity}
    />
  );
};

// ─────────────── Angka rasio besar dengan coretan dan stempel ───────────────
export const RatioText: React.FC<{
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly appear: number;
  readonly strike?: number; // 0..1 panjang coretan
  readonly stamp?: number; // 0..1 stempel KELIRU
  readonly stampText?: string;
  readonly color?: string;
  readonly dim?: number;
}> = ({
  text,
  x,
  y,
  size,
  appear,
  strike = 0,
  stamp = 0,
  stampText = "KELIRU",
  color = colors.orange,
  dim = 1,
}) => {
  const s = interpolate(appear, [0, 1], [1.35, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 800,
        width: 1600,
        top: y,
        textAlign: "center",
        opacity: appear * dim,
        scale: String(s),
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1,
            letterSpacing: -size * 0.02,
            color,
            textShadow: `0 0 ${size * 0.35}px ${color}55`,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
        {strike > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "-6%",
              top: "50%",
              height: Math.max(6, size * 0.07),
              width: `${112 * strike}%`,
              background: colors.text,
              borderRadius: 99,
              rotate: "-8deg",
              transformOrigin: "left center",
              boxShadow: `0 0 18px ${colors.bg}`,
            }}
          />
        ) : null}
        {stamp > 0 ? (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "100%",
              marginTop: size * 0.12,
              translate: "-50% 0",
              rotate: `${interpolate(stamp, [0, 1], [-18, -6])}deg`,
              scale: String(interpolate(stamp, [0, 1], [1.8, 1], { ...clamp, easing: easeOut })),
              opacity: stamp,
              fontFamily: fonts.mono,
              fontWeight: 500,
              fontSize: size * 0.3,
              letterSpacing: size * 0.04,
              color: colors.text,
              border: `${Math.max(3, size * 0.025)}px solid ${colors.text}`,
              borderRadius: 12,
              padding: `${size * 0.02}px ${size * 0.08}px`,
              whiteSpace: "nowrap",
            }}
          >
            {stampText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─────────────── Siluet pria (datar, tanpa wajah) + saluran cerna garis ───────────────
// Kotak lokal 400 x 900. Diletakkan dengan x,y (pojok kiri atas) dan scale.
const ARM_L = "M92,214 C72,300 64,400 60,505";
const ARM_R = "M308,214 C328,300 336,400 340,505";
const LEG_L = "M168,520 L160,858";
const LEG_R = "M232,520 L240,858";
const TORSO =
  "M112,176 C150,164 250,164 288,176 C312,184 318,203 316,228 L304,468 C302,510 282,538 250,544 L150,544 C118,538 98,510 96,468 L84,228 C82,203 88,184 112,176 Z";

export const GUT = {
  esophagus: "M200,150 L200,238",
  stomach: "M200,238 C206,252 238,246 252,262 C268,282 254,312 228,314 C214,315 208,312 210,318",
  small:
    "M210,318 L210,346 C210,350 206,352 200,352 L164,352 C150,352 150,374 164,374 L238,374 C252,374 252,396 238,396 L164,396 C150,396 150,418 164,418 L238,418 C252,418 252,440 238,440 L176,440 C164,440 160,452 172,458 L262,462",
  colon:
    "M264,470 L268,336 C268,329 263,326 256,326 L144,326 C137,326 132,329 132,336 L132,468 C132,490 162,500 194,504 L200,532",
};

const Silhouette: React.FC<{ readonly fill: string; readonly grow: number }> = ({ fill, grow }) => (
  <g fill={fill} stroke={fill}>
    <circle cx={200} cy={86} r={60 + grow} />
    <rect x={176 - grow} y={136} width={48 + grow * 2} height={44} rx={12} />
    <path d={ARM_L} fill="none" strokeWidth={44 + grow * 2} strokeLinecap="round" />
    <path d={ARM_R} fill="none" strokeWidth={44 + grow * 2} strokeLinecap="round" />
    <path d={LEG_L} fill="none" strokeWidth={60 + grow * 2} strokeLinecap="round" />
    <path d={LEG_R} fill="none" strokeWidth={60 + grow * 2} strokeLinecap="round" />
    <path d={TORSO} strokeWidth={grow * 2} strokeLinejoin="round" />
  </g>
);

export const Figure: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly scale?: number;
  readonly appear?: number;
  readonly gutDraw?: number; // 0..1 garis saluran cerna tergambar
  readonly tract?: number; // 0..1 seluruh saluran menyala oranye redup
  readonly colon?: number; // 0..1 kolon menyala terang
  readonly upperDim?: number; // 0..1 lambung & usus halus meredup
  readonly pulse?: number; // detik, untuk denyut kolon
  readonly ghost?: boolean;
}> = ({
  x,
  y,
  scale = 1,
  appear = 1,
  gutDraw = 0,
  tract = 0,
  colon = 0,
  upperDim = 0,
  pulse = 0,
  ghost = false,
}) => {
  const base = colors.creamDim;
  const tractColor = (k: number) =>
    k > 0 ? `color-mix(in srgb, ${colors.orange} ${Math.round(k * 70)}%, ${base})` : base;
  const upper = tractColor(tract * (1 - upperDim));
  const breathe = 1 + 0.06 * Math.sin(pulse * 3.2) * colon;
  const seg = (d: string, stroke: string, w: number, op = 1, key?: string) => (
    <path
      key={key}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - gutDraw}
      opacity={op}
    />
  );
  return (
    <g
      transform={`translate(${x} ${y + (1 - appear) * 30}) scale(${scale})`}
      opacity={appear * (ghost ? 0.4 : 1)}
    >
      <Silhouette fill={colors.bodyLine} grow={3} />
      <Silhouette fill={colors.body} grow={0} />
      {gutDraw > 0 ? (
        <g>
          {seg(GUT.esophagus, upper, 9, 1 - upperDim * 0.6)}
          {seg(GUT.stomach, upper, 11, 1 - upperDim * 0.6)}
          {seg(GUT.small, upper, 8, 1 - upperDim * 0.6)}
          {colon > 0 ? (
            <path
              d={GUT.colon}
              fill="none"
              stroke={colors.orange}
              strokeWidth={34 * breathe}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.25 * colon}
              style={{ filter: "blur(8px)" }}
            />
          ) : null}
          {seg(
            GUT.colon,
            colon > 0
              ? `color-mix(in srgb, ${colors.orange} ${Math.round(40 + colon * 60)}%, ${tractColor(tract)})`
              : tractColor(tract),
            16 + colon * 4,
          )}
        </g>
      ) : null}
    </g>
  );
};

// ─────────────── Grid 10 x 10 sel (90 tanpa inti, 10 berinti) ───────────────
// Indeks sel berinti: tersebar, deterministik.
export const NUCLEATED = new Set([3, 17, 24, 38, 46, 52, 61, 75, 83, 98]);

export const CellGrid: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly cell: number;
  readonly appear: number; // 0..1 gelombang diagonal
  readonly nucleus?: number; // 0..1 inti oranye muncul
  readonly dimPlain?: number; // 0..1 sel tanpa inti meredup
  readonly gather?: number; // 0..1 sel berinti berkumpul ke kolom kanan
  readonly gatherX?: number;
  readonly gatherY?: number;
}> = ({ x, y, cell, appear, nucleus = 0, dimPlain = 0, gather = 0, gatherX = 0, gatherY = 0 }) => {
  const r = cell * 0.38;
  let k = 0;
  return (
    <g>
      {Array.from({ length: 100 }, (_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const wave = interpolate(appear * 20 - (row + col), [0, 2], [0, 1], clamp);
        const isN = NUCLEATED.has(i);
        let cx = x + col * cell + cell / 2;
        let cy = y + row * cell + cell / 2;
        if (isN && gather > 0) {
          const j = k++;
          const tx = gatherX + (j % 2) * cell;
          const ty = gatherY - Math.floor(j / 2) * cell;
          const g = easeOut(gather);
          cx = cx + (tx - cx) * g;
          cy = cy + (ty - cy) * g;
        }
        const op = wave * (isN ? 1 : 1 - dimPlain * 0.82);
        return (
          <g key={i} opacity={op}>
            <circle
              cx={cx}
              cy={cy}
              r={r * (0.7 + 0.3 * wave)}
              fill={colors.cream}
              stroke={isN && nucleus > 0 ? colors.orange : "none"}
              strokeWidth={cell * 0.05 * nucleus}
            />
            {isN && nucleus > 0 ? (
              <circle cx={cx} cy={cy} r={r * 0.42 * nucleus} fill={colors.orange} />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// Sel darah merah datar (cakram dengan cekungan), bukan gambar medis.
export const RedCell: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly opacity?: number;
}> = ({ cx, cy, r, opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={cx} cy={cy} r={r} fill="#D9535B" />
    <circle cx={cx} cy={cy} r={r * 0.5} fill="#B23A47" />
  </g>
);

// Penghitung angka (format Indonesia, koma desimal).
export const fmt = (v: number, decimals = 0) =>
  v.toFixed(decimals).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Kurung/garis panah sederhana untuk anotasi di SVG.
export const Arrow: React.FC<{
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly draw?: number;
  readonly color?: string;
  readonly width?: number;
  readonly head?: number;
  readonly dashed?: boolean;
}> = ({ x1, y1, x2, y2, draw = 1, color = colors.orange, width = 5, head = 18, dashed = false }) => {
  const ex = x1 + (x2 - x1) * draw;
  const ey = y1 + (y2 - y1) * draw;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g opacity={draw > 0 ? 1 : 0}>
      <line
        x1={x1}
        y1={y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "10 10" : undefined}
      />
      {draw > 0.95 ? (
        <path
          d={`M${ex},${ey} L${ex - head * Math.cos(ang - 0.45)},${ey - head * Math.sin(ang - 0.45)} M${ex},${ey} L${ex - head * Math.cos(ang + 0.45)},${ey - head * Math.sin(ang + 0.45)}`}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
    </g>
  );
};
