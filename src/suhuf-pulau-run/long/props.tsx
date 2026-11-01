import type React from "react";
import { Easing, interpolate, random } from "remotion";
import { appear, pop, slide, toonFont } from "../../suhuf-bakteri/elements/ToonKit";
import { Detective, MagnifierG } from "../../suhuf-bakteri/shorts/characters";
import { toon } from "../../suhuf-bakteri/theme";
import { INK, RED, Ship, TEAL, TEAL_DEEP } from "../shorts/kit2d";
import { clamp01, H, SAILS, W } from "./kitLong";

// Properti tambahan khusus Long (landscape). Semua 2D, gaya sama dengan kit Shorts.

// ---------------- Air lebar (x0..x1), tepi atas berombak ----------------
export const WaterL: React.FC<{ readonly x0: number; readonly x1: number; readonly y0: number; readonly y1: number; readonly t: number; readonly seed?: string }> = ({ x0, x1, y0, y1, t, seed = "wl" }) => {
  const w = x1 - x0;
  const h = y1 - y0;
  const n = Math.max(4, Math.round(w / 220));
  const q = w / n;
  const wob = 4 + Math.sin(t * 1.6) * 6;
  let top = `M0,24`;
  for (let i = 0; i < n; i++) {
    top += ` Q${i * q + q / 2},${i % 2 ? 44 - wob : wob} ${(i + 1) * q},24`;
  }
  const shape = `${top} L${w},${h - 40} Q${w},${h} ${w - 40},${h} L40,${h} Q0,${h} 0,${h - 40} Z`;
  const rows = Math.max(2, Math.round(h / 52));
  return (
    <svg width={w} height={h + 40} viewBox={`0 0 ${w} ${h + 40}`} style={{ position: "absolute", left: x0, top: y0 - 20, overflow: "visible" }}>
      <defs>
        <clipPath id={`wl-${seed}`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill={TEAL} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <g clipPath={`url(#wl-${seed})`}>
        <rect x={0} y={h * 0.45} width={w} height={h} fill={TEAL_DEEP} opacity={0.55} />
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: Math.round(w / 200) }, (_, c) => {
            const span = w - 60;
            const px = 20 + ((((c * 200 + r * 90 + t * 30 * (r % 2 ? 1 : -1)) % span) + span) % span);
            const py = 52 + r * ((h - 70) / rows) + random(`${seed}-${r}-${c}`) * 10;
            return <path key={`${r}-${c}`} d="M0,0 q10,-12 20,0 q10,12 20,0" transform={`translate(${px} ${py})`} fill="none" stroke="#D6F6F2" strokeWidth={5} strokeLinecap="round" opacity={0.8} />;
          }),
        )}
      </g>
    </svg>
  );
};

// Kapal duduk di air: (cx, wl) = pusat x dan garis air. Gambar SEBELUM WaterL supaya dasar lambung tertutup air.
export const ShipAt: React.FC<{
  readonly kind: "en" | "nl";
  readonly cx: number;
  readonly wl: number;
  readonly w: number;
  readonly t: number;
  readonly flip?: boolean;
  readonly phase?: number;
  readonly wave?: number;
  readonly mood?: "happy" | "laugh" | "oh";
}> = ({ kind, cx, wl, w, t, flip = false, phase = 0, wave = 0, mood = "happy" }) => (
  <div style={{ position: "absolute", left: cx - w / 2, top: wl - (w * 212) / 260 + Math.sin(t * 2.4 + phase) * 6 }}>
    <Ship kind={kind} w={w} t={t} flip={flip} phase={phase} wave={wave} mood={mood} sails={SAILS} />
  </div>
);

// Cahaya lembut di belakang benda penting.
export const Glow: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly op: number; readonly id: string; readonly color?: string }> = ({ cx, cy, r, op, id, color = "#FFE9A8" }) =>
  op <= 0 ? null : (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op, pointerEvents: "none" }}>
      <defs>
        <radialGradient id={`gl-${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={0.95} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#gl-${id})`} />
    </svg>
  );

// Cincin waktu menipis (jeda menebak) TANPA angka di layar.
export const TimerRing: React.FC<{ readonly cx: number; readonly cy: number; readonly r: number; readonly p: number; readonly op?: number }> = ({ cx, cy, r, p, op = 1 }) => {
  const c = 2 * Math.PI * r;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <circle cx={cx} cy={cy} r={r + 14} fill="#fff" stroke={INK} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E7E9F2" strokeWidth={20} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={toon.orange} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${c * (1 - p)} ${c}`} transform={`rotate(-90 ${cx} ${cy})`} />
      <path d={`M${cx - 18},${cy - 26} L${cx + 18},${cy - 26} L${cx},${cy} L${cx + 18},${cy + 26} L${cx - 18},${cy + 26} L${cx},${cy} Z`} fill={toon.yellow} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

// Panah tukar (dua arah).
export const SwapArrows: React.FC<{ readonly w: number }> = ({ w }) => (
  <svg width={w} height={(w * 120) / 280} viewBox="0 0 280 120" style={{ overflow: "visible", display: "block" }}>
    <path d="M30,36 L230,36 M200,12 L232,36 L200,60" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30,36 L230,36 M200,12 L232,36 L200,60" fill="none" stroke={toon.orange} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M250,88 L50,88 M80,64 L48,88 L80,112" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M250,88 L50,88 M80,64 L48,88 L80,112" fill="none" stroke={toon.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Kata di pil putih yang dicoret merah (mis. "TUKAR"). strike 0..1.
export const StruckWord: React.FC<{ readonly text: string; readonly w: number; readonly strike: number; readonly size?: number }> = ({ text, w, strike, size = 96 }) => {
  const h = size * 1.55;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", display: "block" }}>
      <rect x={6} y={6} width={w - 12} height={h - 12} rx={h / 2.6} fill="#fff" stroke={INK} strokeWidth={8} />
      <text x={w / 2} y={h / 2 + size * 0.35} textAnchor="middle" fontFamily={toonFont()} fontWeight={700} fontSize={size} fill={INK}>
        {text}
      </text>
      {strike > 0 ? (
        <>
          <line x1={24} y1={h - 20} x2={24 + (w - 48) * strike} y2={h - 20 - (h - 40) * strike} stroke={INK} strokeWidth={26} strokeLinecap="round" />
          <line x1={24} y1={h - 20} x2={24 + (w - 48) * strike} y2={h - 20 - (h - 40) * strike} stroke={RED} strokeWidth={16} strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
};

// Tanda tanya 2D besar (kartun) di lingkaran.
export const QBadge: React.FC<{ readonly size: number; readonly color?: string }> = ({ size, color = toon.orange }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: "#fff",
      border: `${size * 0.06}px solid ${INK}`,
      boxShadow: `0 ${size * 0.06}px 0 ${INK}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: toonFont(),
      fontWeight: 700,
      fontSize: size * 0.72,
      color,
      WebkitTextStroke: `${size * 0.04}px ${INK}`,
      paintOrder: "stroke fill",
      lineHeight: 1,
      paddingBottom: size * 0.05,
      boxSizing: "border-box",
    }}
  >
    ?
  </div>
);

// Kartu foto (polaroid) untuk papan investigasi.
export const PhotoCard: React.FC<{ readonly w: number; readonly h: number; readonly label?: string; readonly tint?: string; readonly children?: React.ReactNode }> = ({ w, h, label, tint = "#FFFDF6", children }) => (
  <div
    style={{
      width: w,
      background: "#fff",
      border: `6px solid ${INK}`,
      borderRadius: 18,
      boxShadow: `0 8px 0 rgba(40,30,60,0.25)`,
      padding: 12,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}
  >
    <div style={{ width: w - 36, height: h, background: tint, borderRadius: 10, border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible", position: "relative" }}>{children}</div>
    {label ? <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 34, color: INK, letterSpacing: 1, whiteSpace: "nowrap" }}>{label}</div> : null}
  </div>
);

// ---------------- Papan investigasi detektif (rekap tiap bab) ----------------
export const BOARD = { x: 470, y: 292, w: 1270, h: 560 } as const;
// draf 3: judul "CATATAN" di atas papan lebih kecil + naik (draf 2: size 115 di y 150 menempel tab "CATATAN DETEKTIF" y 262)
export const RECAP_TITLE_Y = 124;
export type PinItem = { readonly x: number; readonly y: number; readonly at: number; readonly node: React.ReactNode; readonly rot?: number };

export const RecapBoard: React.FC<{
  readonly t: number;
  readonly items: readonly PinItem[];
  readonly strings?: readonly (readonly [number, number, number])[]; // [indeks a, indeks b, mulai]
  readonly stamp?: { readonly text: string; readonly at: number; readonly color: string; readonly size?: number };
}> = ({ t, items, strings = [], stamp }) => {
  const { x: bx, y: by, w: bw, h: bh } = BOARD;
  const pinXY = (i: number) => [bx + items[i].x, by + items[i].y] as const;
  const stampP = stamp ? interpolate(t, [stamp.at, stamp.at + 0.22], [0, 1], { ...clamp01, easing: Easing.in(Easing.quad) }) : 0;
  const shake = stamp && t > stamp.at + 0.22 && t < stamp.at + 0.5 ? 5 * Math.sin(t * 70) * (stamp.at + 0.5 - t) : 0;
  return (
    <>
      {/* papan gabus dengan bingkai kayu (selalu terlihat sejak frame pertama) */}
      <div style={{ position: "absolute", left: bx + shake, top: by, width: bw, height: bh, borderRadius: 30, background: "#E9C48E", border: `10px solid ${INK}`, boxShadow: `inset 0 0 0 14px #B9774A, inset 0 0 0 18px ${INK}, 0 14px 0 rgba(40,30,60,0.25)`, boxSizing: "border-box" }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 30 + random(`bd-x-${i}`) * (bw - 80), top: 30 + random(`bd-y-${i}`) * (bh - 80), width: 8, height: 8, borderRadius: 8, background: "#C99A62", opacity: 0.7 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: bx + 40, top: by - 30, fontFamily: toonFont(), fontWeight: 700, fontSize: 36, letterSpacing: 3, color: INK, background: "#fff", border: `5px solid ${INK}`, borderRadius: 999, padding: "2px 26px 6px", whiteSpace: "nowrap" }}>
        CATATAN DETEKTIF
      </div>
      {/* item yang ditempel */}
      {items.map((it, i) => {
        if (t < it.at) {
          return null;
        }
        const s = it.at <= 0.05 ? 1 : pop(t, it.at, 0.45);
        return (
          <div key={i} style={{ position: "absolute", left: bx + it.x - 400, width: 800, top: by + it.y, display: "flex", justifyContent: "center", transform: `scale(${s}) rotate(${(it.rot ?? 0) + Math.sin(t * 1.8 + i) * 0.8}deg)`, transformOrigin: "50% 0%", opacity: appear(t, it.at, 0.1) }}>
            {it.node}
          </div>
        );
      })}
      {/* benang merah antar pin */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
        {strings.map(([a, b, at], i) => {
          const p = slide(t, at, 0.5);
          if (p <= 0) {
            return null;
          }
          const [x1, y1] = pinXY(a);
          const [x2, y2] = pinXY(b);
          const mx = (x1 + x2) / 2;
          const my = Math.max(y1, y2) + 50;
          return (
            <g key={i}>
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
              <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            </g>
          );
        })}
        {items.map((it, i) =>
          t < it.at ? null : (
            <g key={`p${i}`}>
              <circle cx={bx + it.x} cy={by + it.y} r={14} fill={RED} stroke={INK} strokeWidth={5} />
              <circle cx={bx + it.x - 4} cy={by + it.y - 4} r={4} fill="#fff" opacity={0.8} />
            </g>
          ),
        )}
      </svg>
      {/* draf 2: stempel lebih rendah dan lebih datar (-2,5 deg) supaya tidak menimpa label kartu (mis. "ATURAN", "RUN") */}
      {stamp && t >= stamp.at ? (
        <div style={{ position: "absolute", left: bx + bw / 2 - 600, width: 1200, top: by + bh - 112, display: "flex", justifyContent: "center", opacity: Math.min(1, stampP * 1.5), transform: `scale(${1 + (1 - stampP) * 0.9}) rotate(-2.5deg)` }}>
          <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: Math.min(stamp.size ?? 66, 58), letterSpacing: 3, color: INK, background: "#fff", border: `9px solid ${stamp.color}`, outline: `5px solid ${INK}`, borderRadius: 22, padding: "2px 30px 6px", whiteSpace: "nowrap", boxShadow: `0 8px 0 ${INK}` }}>
            {stamp.text}
          </div>
        </div>
      ) : null}
    </>
  );
};

// Detektif di kiri papan, kaca pembesar terangkat ke arah papan.
export const BoardDetective: React.FC<{ readonly t: number; readonly x?: number; readonly y?: number; readonly size?: number }> = ({ t, x = 130, y = 470, size = 250 }) => {
  const lift = 0.5 + 0.5 * Math.sin(t * 2.2);
  const hand: readonly [number, number] = [150 + 4 * lift, 108 - 8 * lift];
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin(t * 2.6) * 5 }}>
      <Detective size={size} t={t} mood="happy" hand={hand}>
        <MagnifierG x={hand[0] + 12} y={hand[1] - 22} r={22} rot={-30} />
      </Detective>
    </div>
  );
};

// Detektif berdiri bebas (mood, posisi tangan, kaca pembesar opsional).
export const Det: React.FC<{
  readonly t: number;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly mood?: "happy" | "laugh" | "oh" | "think" | "worry";
  readonly hand?: readonly [number, number];
  readonly glass?: boolean;
  readonly flip?: boolean;
  readonly phase?: number;
}> = ({ t, x, y, size, mood = "happy", hand = [150, 110], glass = true, flip = false, phase = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y + Math.sin(t * 2.6 + phase) * 5 }}>
    <Detective size={size} t={t} mood={mood} hand={hand} flip={flip} phase={phase}>
      {glass ? <MagnifierG x={hand[0] + 12} y={hand[1] - 22} r={22} rot={-30} /> : null}
    </Detective>
  </div>
);

// Pita/tekanan "HUBUNGAN" antara dua titik (panah putus-putus).
export const DashArrow: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly p: number; readonly color?: string; readonly bend?: number }> = ({ x1, y1, x2, y2, p, color = toon.orangeDark, bend = -120 }) => {
  if (p <= 0) {
    return null;
  }
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  // ujung panah di titik akhir
  const ang = Math.atan2(y2 - my, x2 - mx);
  const a1 = ang + Math.PI * 0.8;
  const a2 = ang - Math.PI * 0.8;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      {p >= 0.98 ? (
        <path d={`M${x2 + Math.cos(a1) * 40},${y2 + Math.sin(a1) * 40} L${x2},${y2} L${x2 + Math.cos(a2) * 40},${y2 + Math.sin(a2) * 40}`} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {p >= 0.98 ? (
        <path d={`M${x2 + Math.cos(a1) * 40},${y2 + Math.sin(a1) * 40} L${x2},${y2} L${x2 + Math.cos(a2) * 40},${y2 + Math.sin(a2) * 40}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
};

// Kaca pembesar besar berdiri sendiri (dalam svg halaman).
export const BigGlass: React.FC<{ readonly x: number; readonly y: number; readonly r: number }> = ({ x, y, r }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <g transform={`translate(${x} ${y})`}>
      <line x1={r * 0.72} y1={r * 0.72} x2={r * 1.75} y2={r * 1.75} stroke={INK} strokeWidth={r * 0.3} strokeLinecap="round" />
      <line x1={r * 0.72} y1={r * 0.72} x2={r * 1.75} y2={r * 1.75} stroke={toon.orangeDark} strokeWidth={r * 0.16} strokeLinecap="round" />
      <circle r={r} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={r * 0.14} />
      <circle r={r} fill="none" stroke={toon.orange} strokeWidth={r * 0.06} />
      <path d={`M${-r * 0.55},${-r * 0.1} Q${-r * 0.45},${-r * 0.6} ${r * 0.05},${-r * 0.65}`} fill="none" stroke="#fff" strokeWidth={r * 0.1} strokeLinecap="round" opacity={0.9} />
    </g>
  </svg>
);
