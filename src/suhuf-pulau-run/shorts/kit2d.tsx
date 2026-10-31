import type React from "react";
import { random } from "remotion";
import { toonFont } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import { Arm, blinkOf, Face } from "../../suhuf-bakteri/shorts/characters";

// Kit 2D Suhuf #03 (Pulau Run): semua digambar dari kode (SVG), gaya stiker/clay, garis tepi tinta.
// Bendera sengaja SEDERHANA dan seimbang (Inggris dan Belanda ukuran sama, tanpa simbol lain).

export const INK = toon.ink;
export const SAND = "#F4D79B";
export const SAND_DARK = "#E9C27E";
export const GRASS = "#8FD18A";
export const GRASS_DARK = "#5FB36A";
export const WOOD = "#E8A35E";
export const WOOD_DARK = "#B9774A";
export const RED = "#E4453F";
export const TEAL = "#1C8798";
export const TEAL_DEEP = "#0C4F5F";

// ---------------- Bendera ----------------
// Gambar di dalam <svg> (koordinat 90 x 60). Dipakai oleh FlagArt, FlagPole, dan kapal.
export const FlagG: React.FC<{ readonly kind: "en" | "nl" }> = ({ kind }) => (
  <g>
    <defs>
      <clipPath id="pr-flag-clip">
        <rect width="90" height="60" rx="3" />
      </clipPath>
    </defs>
    <g clipPath="url(#pr-flag-clip)">
      {kind === "nl" ? (
        <>
          <rect width="90" height="20" fill="#D8343C" />
          <rect y="20" width="90" height="20" fill="#FFFFFF" />
          <rect y="40" width="90" height="20" fill="#2F5FB8" />
        </>
      ) : (
        <>
          <rect width="90" height="60" fill="#2B4C9B" />
          <path d="M0,0 L90,60 M90,0 L0,60" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M0,0 L90,60 M90,0 L0,60" stroke="#D8343C" strokeWidth="4" />
          <path d="M45,0 V60 M0,30 H90" stroke="#FFFFFF" strokeWidth="20" />
          <path d="M45,0 V60 M0,30 H90" stroke="#D8343C" strokeWidth="12" />
        </>
      )}
    </g>
    <rect width="90" height="60" rx="3" fill="none" stroke={INK} strokeWidth="3.5" />
  </g>
);

export const FlagArt: React.FC<{ readonly kind: "en" | "nl"; readonly w: number }> = ({ kind, w }) => (
  <svg width={w} height={(w * 2) / 3} viewBox="0 0 90 60" style={{ display: "block", overflow: "visible" }}>
    <FlagG kind={kind} />
  </svg>
);

// Tiang + bendera berkibar. (x, y) = pangkal tiang; h = tinggi tiang; w = lebar bendera.
export const FlagPole: React.FC<{
  readonly kind: "en" | "nl";
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly w: number;
  readonly t: number;
  readonly phase?: number;
  readonly scale?: number;
}> = ({ kind, x, y, h, w, t, phase = 0, scale = 1 }) => {
  return (
    <svg
      width={w + 60}
      height={h + 30}
      viewBox={`0 0 ${w + 60} ${h + 30}`}
      style={{ position: "absolute", left: x - 16, top: y - h - 10, overflow: "visible", transform: `scale(${scale})`, transformOrigin: "16px 100%" }}
    >
      <line x1={16} y1={h + 10} x2={16} y2={6} stroke={INK} strokeWidth={13} strokeLinecap="round" />
      <line x1={16} y1={h + 10} x2={16} y2={6} stroke="#fff" strokeWidth={5.5} strokeLinecap="round" />
      <circle cx={16} cy={6} r={9} fill={toon.yellow} stroke={INK} strokeWidth={4} />
      <g transform={`translate(22 14) skewY(${5 * Math.sin(t * 5 + phase)})`}>
        <g transform={`scale(${w / 90})`}>
          <FlagG kind={kind} />
        </g>
      </g>
    </svg>
  );
};

// ---------------- Pulau (tampak samping, clay) ----------------
const tree = (cx: number, base: number, s: number, key: string) => {
  const crown: [number, number, number][] = [
    [cx, base - 92 * s, 30 * s],
    [cx - 24 * s, base - 70 * s, 24 * s],
    [cx + 24 * s, base - 72 * s, 25 * s],
  ];
  const fruits: [number, number][] = [
    [cx - 8 * s, base - 78 * s],
    [cx + 20 * s, base - 88 * s],
    [cx - 28 * s, base - 62 * s],
  ];
  return (
    <g key={key}>
      <path
        d={`M${cx - 7 * s},${base} Q${cx - 4 * s},${base - 40 * s} ${cx - 5 * s},${base - 66 * s} L${cx + 5 * s},${base - 66 * s} Q${cx + 4 * s},${base - 40 * s} ${cx + 7 * s},${base} Z`}
        fill={WOOD_DARK}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {crown.map(([x, y, r], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r={r} fill={INK} stroke={INK} strokeWidth={9} />
      ))}
      {crown.map(([x, y, r], i) => (
        <circle key={`i${i}`} cx={x} cy={y} r={r} fill={GRASS_DARK} />
      ))}
      <ellipse cx={cx - 8 * s} cy={base - 102 * s} rx={10 * s} ry={5 * s} fill="#fff" opacity={0.35} />
      {fruits.map(([x, y], i) => (
        <circle key={`f${i}`} cx={x} cy={y} r={7.5 * s} fill={toon.orange} stroke={INK} strokeWidth={3} />
      ))}
    </g>
  );
};

const house = (x: number, base: number, w: number, h: number, body: string, roof: string, key: string) => (
  <g key={key}>
    <rect x={x} y={base - h} width={w} height={h} rx={3} fill={body} stroke={INK} strokeWidth={4} />
    <path d={`M${x - 6},${base - h + 2} L${x + w / 2},${base - h - w * 0.55} L${x + w + 6},${base - h + 2} Z`} fill={roof} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={x + w * 0.4} y={base - h * 0.5} width={w * 0.2} height={h * 0.5} rx={2} fill={WOOD_DARK} stroke={INK} strokeWidth={2.5} />
    <rect x={x + w * 0.12} y={base - h * 0.78} width={w * 0.2} height={w * 0.2} rx={2} fill={toon.blueLight} stroke={INK} strokeWidth={2.2} />
    <rect x={x + w * 0.68} y={base - h * 0.78} width={w * 0.2} height={w * 0.2} rx={2} fill={toon.blueLight} stroke={INK} strokeWidth={2.2} />
  </g>
);

export const Island: React.FC<{
  readonly kind: "manhattan" | "manhattan-en" | "run";
  readonly w: number;
  readonly t?: number;
  readonly bare?: boolean; // tanpa bayangan/halo bawah (dipakai saat digenggam)
  readonly detail?: number; // pembesar rumah/pohon/kincir terhadap pulau (1 = asli)
  readonly detailDy?: number; // geser vertikal rumah/pohon (unit viewBox 300), negatif = ke belakang pulau
}> = ({ kind, w, t = 0, bare = false, detail = 1, detailDy = 0 }) => {
  const angle = t * 55;
  return (
    <svg width={w} height={w * 0.74} viewBox="0 0 300 222" style={{ overflow: "visible", display: "block" }}>
      {bare ? null : (
        <>
          <ellipse cx={168} cy={206} rx={146} ry={20} fill="#0C3140" opacity={0.42} />
          <ellipse cx={150} cy={192} rx={138} ry={20} fill="#fff" opacity={0.6} />
        </>
      )}
      <path d="M18,150 Q20,196 150,198 Q280,196 282,150 Z" fill={SAND_DARK} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M22,172 Q30,197 150,198 Q270,197 278,172 Q150,190 22,172 Z" fill="#C98F4E" opacity={0.7} />
      <ellipse cx={150} cy={150} rx={132} ry={46} fill={SAND} stroke={INK} strokeWidth={5} />
      <ellipse cx={150} cy={142} rx={112} ry={36} fill={GRASS} stroke={INK} strokeWidth={4} />
      <path d="M60,138 Q80,118 112,114" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
      <path d="M30,152 Q60,118 120,111" fill="none" stroke="#FFF6DC" strokeWidth={4} strokeLinecap="round" opacity={0.9} transform="translate(-2 -5)" />
      <g transform={detail === 1 && detailDy === 0 ? undefined : `translate(0 ${detailDy}) translate(150 150) scale(${detail}) translate(-150 -150)`}>
        {kind === "manhattan" ? (
          <>
            {house(70, 150, 40, 40, "#FFF4DE", toon.red, "h1")}
            {house(116, 156, 46, 56, toon.blueLight, toon.orange, "h2")}
            {/* kincir angin kecil: hanya Manhattan versi New Amsterdam (Belanda) */}
            <path d="M196,152 L204,96 L222,96 L230,152 Z" fill="#FFF4DE" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <path d="M198,98 L213,72 L228,98 Z" fill={toon.red} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <g transform={`rotate(${angle} 213 98)`}>
              {[0, 90, 180, 270].map((a) => (
                <g key={a} transform={`rotate(${a} 213 98)`}>
                  <rect x={209} y={52} width={8} height={46} rx={3} fill="#fff" stroke={INK} strokeWidth={3} />
                </g>
              ))}
            </g>
            <circle cx={213} cy={98} r={6} fill={toon.yellow} stroke={INK} strokeWidth={3} />
          </>
        ) : kind === "manhattan-en" ? (
          <>
            {/* versi Inggris: rumah + pohon pala (elemen netral, tanpa kincir) */}
            {house(84, 152, 42, 42, "#FFF4DE", toon.red, "h1")}
            {house(130, 158, 46, 56, toon.blueLight, toon.orange, "h2")}
            {tree(212, 156, 0.95, "t1")}
          </>
        ) : (
          <>
            {tree(110, 150, 0.9, "t1")}
            {tree(192, 154, 1.15, "t2")}
          </>
        )}
      </g>
    </svg>
  );
};

// ---------------- Pulau tampak atas (peta SKEMA, 3 : 1) ----------------
export const MapIsland: React.FC<{ readonly w: number }> = ({ w }) => {
  const pts = Array.from({ length: 80 }, (_, i) => {
    const a = (i / 80) * Math.PI * 2;
    const n = 1 + 0.06 * Math.sin(a * 3 + 1) + 0.045 * Math.sin(a * 5 + 2) + 0.025 * Math.sin(a * 9);
    return [150 + Math.cos(a) * 146 * n, 50 + Math.sin(a) * 41 * n] as const;
  });
  const d = `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L")} Z`;
  const trees: [number, number, number][] = [
    [74, 50, 10],
    [104, 40, 11],
    [132, 56, 10],
    [166, 44, 12],
    [198, 54, 10],
    [226, 46, 9],
  ];
  return (
    <svg width={w} height={w / 3} viewBox="0 0 300 100" style={{ overflow: "visible", display: "block" }}>
      <g transform="translate(150 50) scale(1.1) translate(-150 -50)">
        <path d={d} fill="#fff" opacity={0.75} />
      </g>
      <path d={d} fill={SAND} stroke={INK} strokeWidth={3.2} strokeLinejoin="round" />
      <g transform="translate(150 50) scale(0.8) translate(-150 -50)">
        <path d={d} fill={GRASS} stroke={INK} strokeWidth={2} strokeLinejoin="round" opacity={0.95} />
      </g>
      {trees.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={GRASS_DARK} stroke={INK} strokeWidth={2.4} />
          <circle cx={x + r * 0.35} cy={y - r * 0.2} r={r * 0.22} fill={toon.orange} stroke={INK} strokeWidth={1.4} />
          <circle cx={x - r * 0.4} cy={y + r * 0.3} r={r * 0.2} fill={toon.orange} stroke={INK} strokeWidth={1.4} />
        </g>
      ))}
    </svg>
  );
};

// ---------------- Laut (panel peta / diorama) ----------------
export const SeaPanel: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly t: number;
  readonly seed?: string;
  readonly grid?: boolean;
}> = ({ x, y, w, h, t, seed = "sea", grid = true }) => {
  const marks = Array.from({ length: 24 }, (_, i) => ({
    mx: random(`${seed}-x-${i}`) * (w - 140) + 40,
    my: random(`${seed}-y-${i}`) * (h - 100) + 40,
    s: 0.7 + random(`${seed}-s-${i}`) * 0.8,
    ph: random(`${seed}-p-${i}`) * 6,
  }));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={52} fill="#CFE6FD" stroke={INK} strokeWidth={7} />
      <rect x={14} y={14} width={w - 28} height={h - 28} rx={44} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
      {grid
        ? [0.25, 0.5, 0.75].map((k) => (
            <g key={k} opacity={0.55}>
              <line x1={w * k} y1={30} x2={w * k} y2={h - 30} stroke="#fff" strokeWidth={4} strokeDasharray="14 14" />
              <line x1={30} y1={h * k} x2={w - 30} y2={h * k} stroke="#fff" strokeWidth={4} strokeDasharray="14 14" />
            </g>
          ))
        : null}
      {marks.map((m, i) => (
        <path
          key={i}
          d="M0,0 q10,-12 20,0 q10,12 20,0"
          transform={`translate(${m.mx + Math.sin(t * 0.8 + m.ph) * 8} ${m.my}) scale(${m.s})`}
          fill="none"
          stroke="#fff"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

// Air untuk diorama (tanpa bingkai): pita biru dengan garis ombak, dari y0 sampai y1.
// inset = margin kiri-kanan (draf 4: >= 80 px supaya tidak menempel tepi layar).
export const WaterBand: React.FC<{ readonly y0: number; readonly y1: number; readonly t: number; readonly seed?: string; readonly inset?: number }> = ({ y0, y1, t, seed = "wb", inset = 84 }) => {
  const h = y1 - y0;
  const x0 = inset;
  const x1 = 1080 - inset;
  const W = x1 - x0;
  const q = W / 4;
  const wob = 4 + Math.sin(t * 1.6) * 6;
  const top = `M${x0},24 Q${x0 + q / 2},${wob} ${x0 + q},24 T${x0 + 2 * q},24 T${x0 + 3 * q},24 T${x1},24`;
  const shape = `${top} L${x1},${h - 40} Q${x1},${h} ${x1 - 40},${h} L${x0 + 40},${h} Q${x0},${h} ${x0},${h - 40} Z`;
  const nRows = Math.max(2, Math.round(h / 52));
  const rows = Array.from({ length: nRows }, (_, i) => i);
  return (
    <svg width={1080} height={h + 40} viewBox={`0 0 1080 ${h + 40}`} style={{ position: "absolute", left: 0, top: y0 - 20, overflow: "visible" }}>
      <defs>
        <clipPath id={`wb-${seed}`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill={TEAL} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <g clipPath={`url(#wb-${seed})`}>
        <rect x={0} y={h * 0.42} width={1080} height={h * 0.58 + 40} fill={TEAL_DEEP} opacity={0.6} />
        <rect x={0} y={h * 0.2} width={1080} height={h * 0.22} fill={TEAL_DEEP} opacity={0.28} />
        <path d={`M${x0},30 Q${x0 + q / 2},${10 + Math.sin(t * 1.6) * 6} ${x0 + q},30 T${x0 + 2 * q},30 T${x0 + 3 * q},30 T${x1},30`} fill="none" stroke="#BFF1EE" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
        {rows.map((r) =>
          Array.from({ length: 5 }, (_, c) => {
            const span = W - 80;
            const px = x0 + 20 + ((((c * 190 + r * 90 + t * 30 * (r % 2 ? 1 : -1)) % span) + span) % span);
            const py = 56 + r * ((h - 80) / nRows) + random(`${seed}-${r}-${c}`) * 12;
            return (
              <path key={`${r}-${c}`} d="M0,0 q10,-12 20,0 q10,12 20,0" transform={`translate(${px} ${py})`} fill="none" stroke="#D6F6F2" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
            );
          }),
        )}
      </g>
    </svg>
  );
};

// Garis permukaan air (sama persis dengan tepi atas WaterBand): y absolut pada x tertentu.
export const waterSurfaceY = (x: number, y0: number, t: number, inset = 84): number => {
  const q = (1080 - 2 * inset) / 4;
  const node = y0 + 4;
  const amp = 4 + Math.sin(t * 1.6) * 6 - 24; // ctrl0 - node
  const rel = Math.min(4 * q - 0.001, Math.max(0, x - inset));
  const i = Math.floor(rel / q);
  const u = (rel - i * q) / q;
  return node + amp * (i % 2 === 0 ? 1 : -1) * 2 * u * (1 - u);
};

// Path clip: area DI ATAS permukaan air (kapal "tenggelam" tepat di garis air). Koordinat halaman.
export const aboveWaterClip = (y0: number, t: number, inset = 84): string => {
  const pts: string[] = [];
  for (let x = 0; x <= 1080; x += 12) {
    pts.push(`${x},${waterSurfaceY(x, y0, t, inset).toFixed(1)}`);
  }
  return `path('M0,0 L1080,0 L1080,${waterSurfaceY(1080, y0, t, inset).toFixed(1)} ${pts.reverse().map((p) => `L${p}`).join(" ")} Z')`;
};

// Tepi air di DEPAN dasar lambung: garis tinta mengikuti permukaan + busa putus-putus + dua riak yang melebar.
// Lambung jadi jelas terpisah dari garis air (tidak menempel di atasnya).
export const WaterLip: React.FC<{ readonly cx: number; readonly y0: number; readonly rx: number; readonly t: number; readonly phase?: number }> = ({ cx, y0, rx, t, phase = 0 }) => {
  const ext = rx + 90;
  const pts: string[] = [];
  for (let x = Math.max(84, cx - ext); x <= Math.min(996, cx + ext); x += 10) {
    pts.push(`${x},${waterSurfaceY(x, y0, t).toFixed(1)}`);
  }
  const d = `M${pts.join(" L")}`;
  const base = waterSurfaceY(cx, y0, t);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {[0.0, 0.5].map((k) => {
        const r = (((t * 0.55 + k + phase) % 1) + 1) % 1;
        const op = Math.min(1, (1 - r) * 1.4);
        const rxx = rx - 6 + r * 110;
        const ryy = 12 + r * 26;
        return (
          <g key={k} opacity={op}>
            <path d={`M${cx - rxx},${base + 16} A${rxx},${ryy} 0 0 0 ${cx + rxx},${base + 16}`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <path d={`M${cx - rxx},${base + 16} A${rxx},${ryy} 0 0 0 ${cx + rxx},${base + 16}`} fill="none" stroke="#E6FBF8" strokeWidth={3.6} strokeLinecap="round" />
          </g>
        );
      })}
      <path d={d} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} transform="translate(0 7)" fill="none" stroke="#E6FBF8" strokeWidth={5} strokeLinecap="round" strokeDasharray="30 22" opacity={0.95} />
    </svg>
  );
};

// Bayangan jatuh yang TEGAS di air/lantai (tepi keras + cincin busa), digambar SETELAH WaterBand.
export const ContactShadow: React.FC<{ readonly cx: number; readonly cy: number; readonly rx: number; readonly ry?: number; readonly op?: number }> = ({ cx, cy, rx, ry = rx * 0.14, op = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: cx - rx,
      top: cy - ry,
      width: rx * 2,
      height: ry * 2,
      borderRadius: "50%",
      background: "rgba(4,30,42,0.5)",
      boxShadow: "0 0 0 8px #BDF3EE, 0 0 0 12px rgba(255,255,255,0.5)",
      opacity: op,
    }}
  />
);

// ---------------- Buah pala terbelah dengan fuli merah ----------------
export const Nutmeg: React.FC<{ readonly size: number; readonly rot?: number }> = ({ size, rot = 0 }) => (
  <svg width={size} height={size} viewBox="-130 -130 260 260" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <g transform="translate(-16 0) rotate(-6)">
      <path d="M0,-100 A100,100 0 0 0 0,100 Z" fill={toon.orange} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M0,-76 A76,76 0 0 0 0,76 Z" fill="#FFE2B8" />
      <path d="M-70,-52 Q-86,-20 -84,10" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.5} />
    </g>
    <g transform="translate(16 0) rotate(6)">
      <path d="M0,-100 A100,100 0 0 1 0,100 Z" fill={toon.orange} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M0,-76 A76,76 0 0 1 0,76 Z" fill="#FFE2B8" />
    </g>
    {/* fuli (merah) membungkus biji */}
    <ellipse cx={0} cy={0} rx={56} ry={72} fill={RED} stroke={INK} strokeWidth={7} />
    <ellipse cx={0} cy={0} rx={42} ry={58} fill="#6B3E26" stroke={INK} strokeWidth={5} />
    <ellipse cx={-14} cy={-24} rx={10} ry={18} fill="#fff" opacity={0.25} transform="rotate(14 -14 -24)" />
    {[
      "M-34,-30 Q-4,-12 -36,18",
      "M34,-34 Q6,-8 36,22",
      "M-18,-56 Q8,-30 -10,-4 Q10,22 -6,54",
    ].map((p, i) => (
      <g key={i}>
        <path d={p} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
        <path d={p} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// ---------------- Kalender dengan tahun ----------------
export const CalendarYear: React.FC<{
  readonly w: number;
  readonly t: number;
  readonly flipAt: number;
  readonly reveal: number;
  readonly year: string;
  readonly step?: number;
}> = ({ w, t, flipAt, reveal, year, step = 0.5 }) => {
  const h = w * 0.92;
  const pages = [2, 1, 0];
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: w * 2.2 }}>
      <svg width={w} height={h} viewBox="0 0 400 368" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect x={8} y={28} width={384} height={332} rx={28} fill="#fff" stroke={INK} strokeWidth={6} />
        <path d="M8,56 Q8,28 36,28 L364,28 Q392,28 392,56 L392,96 L8,96 Z" fill={toon.red} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {[70, 140, 210, 280, 330].map((x) => (
          <rect key={x} x={x - 9} y={8} width={18} height={44} rx={9} fill="#E7E9F2" stroke={INK} strokeWidth={4} />
        ))}
        <text
          x={200}
          y={252}
          textAnchor="middle"
          fontFamily="Fredoka, sans-serif"
          fontWeight={700}
          fontSize={128}
          fill={INK}
          transform={`translate(200 220) scale(${reveal}) translate(-200 -220)`}
        >
          {year}
        </text>
        <rect x={140} y={290} width={120} height={10} rx={5} fill={toon.orange} opacity={reveal} />
      </svg>
      {pages.map((i) => {
        const p = Math.min(1, Math.max(0, (t - (flipAt + i * step)) / 0.45));
        if (p >= 1) {
          return null;
        }
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
              transform: `rotateX(${-p * 175}deg)`,
              opacity: p > 0.5 ? 0 : 1,
              borderRadius: 28,
              background: i === 2 ? "#fff" : "#FFFDF6",
              border: `6px solid ${INK}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ height: "28%", background: toon.red, borderRadius: "20px 20px 0 0", borderBottom: `6px solid ${INK}` }} />
            <div style={{ margin: "10% 12%", height: 14, borderRadius: 7, background: "#E7E9F2" }} />
            <div style={{ margin: "5% 12%", height: 14, width: "60%", borderRadius: 7, background: "#E7E9F2" }} />
          </div>
        );
      })}
    </div>
  );
};

// ---------------- Lembar perjanjian (hanya gambar: garis acak, TANPA teks hukum) ----------------
const LINE_W = [78, 70, 76, 62, 74, 56, 72, 66, 40];
export const TreatySheet: React.FC<{ readonly w: number; readonly stampP?: number; readonly rot?: number }> = ({ w, stampP = 0, rot = 0 }) => (
  <svg width={w} height={w * 1.28} viewBox="0 0 100 128" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <rect x={4} y={7} width={92} height={118} rx={7} fill="#000" opacity={0.12} />
    <rect x={4} y={2} width={92} height={118} rx={7} fill="#fff" stroke={INK} strokeWidth={3.4} />
    {/* kop: tanda dua warna + garis tebal */}
    <circle cx={22} cy={20} r={8} fill={toon.orange} stroke={INK} strokeWidth={2.2} />
    <path d="M22,12 A8,8 0 0 1 22,28 Z" fill={toon.blue} />
    <circle cx={22} cy={20} r={8} fill="none" stroke={INK} strokeWidth={2.2} />
    <rect x={36} y={14} width={46} height={5} rx={2.5} fill={INK} opacity={0.8} />
    <rect x={36} y={22} width={32} height={3.6} rx={1.8} fill="#C9CEE0" />
    {LINE_W.map((lw, i) => (
      <rect key={i} x={12} y={40 + i * 8.6} width={lw} height={3.6} rx={1.8} fill="#C9CEE0" />
    ))}
    {/* tanda tangan (coretan) */}
    <path d="M14,106 q6,-10 10,0 t10,0 t8,-3" fill="none" stroke={toon.blueDark} strokeWidth={2.2} strokeLinecap="round" />
    <path d="M52,106 q6,-10 10,0 t10,0" fill="none" stroke={toon.orangeDark} strokeWidth={2.2} strokeLinecap="round" />
    {stampP > 0 ? (
      <g transform={`translate(66 82) rotate(-14) scale(${1 + (1 - stampP) * 1.3})`} opacity={Math.min(1, stampP * 1.6)}>
        <circle r={21} fill="none" stroke={RED} strokeWidth={3.4} />
        <circle r={16.5} fill="none" stroke={RED} strokeWidth={1.6} />
        <path d="M0,-11 L3.2,-3.4 L11,-3.2 L5,2 L7,10 L0,5.6 L-7,10 L-5,2 L-11,-3.2 L-3.2,-3.4 Z" fill={RED} />
      </g>
    ) : null}
  </svg>
);

// ---------------- Tangan mainan menggenggam (datang dari kiri; cermin untuk kanan) ----------------
// viewBox 0 0 520 300; pusat kepalan (330, 150); bagian atas kepalan di y = 62.
// Semua bentuk (lengan, telapak, jari, jempol) digambar sebagai SATU siluet (tepi tinta di bawah, warna di atas)
// sehingga tidak ada sambungan pergelangan yang terputus. Manset menutupi pergelangan.
export const FIST_CX = 330;
export const FIST_TOP = 62;
export const Fist: React.FC<{ readonly color: string; readonly dark: string; readonly w: number; readonly squeeze?: number }> = ({ color, dark, w, squeeze = 0 }) => {
  const fingerY = [94, 134, 174, 212];
  const body = (
    <>
      {/* lengan: lekuk halus (otot lengan bawah) mengecil mulus ke pergelangan */}
      <path d="M-300,108 C-110,106 40,78 215,112 L285,118 L285,184 L215,190 C40,232 -110,196 -300,194 Z" />
      {/* telapak bulat */}
      <ellipse cx={318} cy={152} rx={86} ry={96} />
      {/* jari bulat (mitten) */}
      {fingerY.map((y, i) => (
        <ellipse key={y} cx={376 - squeeze * 9 * (i % 2 ? 1 : 0.6)} cy={y} rx={60} ry={24} />
      ))}
      {/* jempol */}
      <ellipse cx={322} cy={54} rx={58} ry={27} transform="rotate(-8 322 54)" />
    </>
  );
  return (
    <svg width={w} height={(w * 300) / 520} viewBox="0 0 520 300" style={{ overflow: "visible", display: "block", filter: "drop-shadow(0 10px 10px rgba(40,30,60,0.22))" }}>
      <g fill={INK} stroke={INK} strokeWidth={16} strokeLinejoin="round">
        {body}
      </g>
      <g fill={color}>{body}</g>
      {/* bayangan lembut telapak + sorot lengan */}
      <path d="M-280,120 C-120,118 20,98 150,116" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.4} />
      {/* garis antarjari */}
      {[114, 154, 193].map((y) => (
        <path key={y} d={`M${352 - squeeze * 6},${y} Q${392 - squeeze * 6},${y + 4} ${428 - squeeze * 8},${y - 1}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      ))}
      {fingerY.map((y, i) => (
        <ellipse key={`h${y}`} cx={398 - squeeze * 9 * (i % 2 ? 1 : 0.6)} cy={y - 9} rx={14} ry={5} fill="#fff" opacity={0.45} />
      ))}
      {/* jempol melingkup */}
      <path d="M268,70 Q320,86 384,64" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={338} cy={42} rx={18} ry={5.5} fill="#fff" opacity={0.5} transform="rotate(-8 338 42)" />
      {/* manset menyatu dengan lengan (sedikit melebar, dengan lipatan) */}
      <rect x={174} y={92} width={66} height={116} rx={22} fill="#fff" stroke={INK} strokeWidth={7} />
      <path d="M186,106 L186,194" stroke={dark} strokeWidth={6} strokeLinecap="round" opacity={0.35} />
      <path d="M222,108 Q230,150 222,192" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
    </svg>
  );
};

// ---------------- Tangan mitten kecil (untuk lengan kapal) ----------------
// Digambar di koordinat halaman (di dalam <svg>): pusat (x, y), jari-jari r, putar rot derajat.
export const Mitten: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly rot?: number; readonly color?: string; readonly flip?: boolean }> = ({ x, y, r, rot = 0, color = toon.skin, flip = false }) => {
  // bola tangan + jempol kecil mengarah ke bawah-dalam (bukan thumbs-up)
  const parts = (
    <>
      <ellipse cx={0} cy={0} rx={r} ry={r * 0.9} />
      <ellipse cx={-r * 0.55} cy={r * 0.62} rx={r * 0.42} ry={r * 0.3} transform={`rotate(35 ${-r * 0.55} ${r * 0.62})`} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
      <g fill={INK} stroke={INK} strokeWidth={r * 0.3} strokeLinejoin="round">
        {parts}
      </g>
      <g fill={color}>{parts}</g>
      <path d={`M${r * 0.18},${-r * 0.35} L${r * 0.62},${-r * 0.3}`} fill="none" stroke={INK} strokeWidth={r * 0.11} strokeLinecap="round" />
      <path d={`M${r * 0.2},${r * 0.02} L${r * 0.66},${r * 0.08}`} fill="none" stroke={INK} strokeWidth={r * 0.11} strokeLinecap="round" />
      <ellipse cx={r * 0.2} cy={-r * 0.62} rx={r * 0.3} ry={r * 0.11} fill="#fff" opacity={0.6} />
    </g>
  );
};

// Lengan tebal dari bahu (sx, sy) ke tangan: lengan baju putih di pangkal, kulit, manset biru tua tepat
// sebelum tangan mitten. pts = kurva cubic [c1x, c1y, c2x, c2y, ex, ey]. Seluruh lengan digambar di depan.
export const HugArm: React.FC<{
  readonly sx: number;
  readonly sy: number;
  readonly pts: readonly [number, number, number, number, number, number];
  readonly thick?: number;
  readonly cuff: string;
  readonly handRot?: number;
  readonly part?: "arm" | "hand" | "both";
}> = ({ sx, sy, pts, thick = 48, cuff, handRot = 0, part = "both" }) => {
  const d = `M${sx},${sy} C${pts[0]},${pts[1]} ${pts[2]},${pts[3]} ${pts[4]},${pts[5]}`;
  const hand = <Mitten x={pts[4]} y={pts[5]} r={thick * 0.85} rot={handRot} flip={handRot > 0} />;
  if (part === "hand") {
    return hand;
  }
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={thick + 16} strokeLinecap="round" />
      <path d={d} fill="none" stroke={toon.skin} strokeWidth={thick} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray="0.25 0.35 0.2 2" opacity={0.55} transform="translate(-4 -9)" />
      {/* lengan baju putih di pangkal (bahu) */}
      <path d={d} fill="none" stroke={INK} strokeWidth={thick + 16} strokeLinecap="round" pathLength={1} strokeDasharray="0.2 2" />
      <path d={d} fill="none" stroke={toon.blue} strokeWidth={thick + 2} strokeLinecap="round" pathLength={1} strokeDasharray="0.185 2" />
      {/* manset biru tua tepat sebelum tangan */}
      <path d={d} fill="none" stroke={INK} strokeWidth={thick + 14} pathLength={1} strokeDasharray="0 0.8 0.17 2" />
      <path d={d} fill="none" stroke={cuff} strokeWidth={thick + 2} pathLength={1} strokeDasharray="0 0.805 0.16 2" />
      {part === "both" ? hand : null}
    </g>
  );
};

// ---------------- Anak mainan (berdiri; wajah datar seperti stiker) ----------------
// viewBox 160 x 270. Tangan "kartu" mengarah ke `hand`; saku di dada kanan.
export const Card: React.FC<{ readonly w: number; readonly tint: string; readonly rot?: number }> = ({ w, tint, rot = 0 }) => (
  <svg width={w} height={w * 1.4} viewBox="0 0 50 70" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <rect x={2} y={2} width={46} height={66} rx={7} fill="#fff" stroke={INK} strokeWidth={3.4} />
    <rect x={8} y={8} width={34} height={54} rx={4} fill={tint} />
    <circle cx={25} cy={35} r={9} fill="#fff" opacity={0.85} />
    <circle cx={25} cy={35} r={4.4} fill={tint} />
  </svg>
);

export const ToyKid: React.FC<{
  readonly size: number;
  readonly t: number;
  readonly shirt: string;
  readonly hair: string;
  readonly handTo: readonly [number, number]; // titik tangan kanan (koordinat 160 x 270)
  readonly mood?: "happy" | "laugh" | "oh" | "think";
  readonly nod?: number; // derajat kemiringan kepala
  readonly phase?: number;
  readonly children?: React.ReactNode; // digambar SEBELUM saku (kartu bisa "masuk" saku)
  readonly overlay?: React.ReactNode; // digambar paling depan
}> = ({ size, t, shirt, hair, handTo, mood = "happy", nod = 0, phase = 0, children, overlay }) => {
  const blink = (t * 0.8 + phase) % 3 > 2.9 ? 0.1 : 1;
  const sh: [number, number] = [118, 140];
  return (
    <svg width={size} height={(size * 270) / 160} viewBox="0 0 160 270" style={{ overflow: "visible", display: "block" }}>
      {/* kaki */}
      <rect x={52} y={206} width={22} height={44} rx={9} fill="#3B4A78" stroke={INK} strokeWidth={4} />
      <rect x={86} y={206} width={22} height={44} rx={9} fill="#3B4A78" stroke={INK} strokeWidth={4} />
      <ellipse cx={60} cy={254} rx={20} ry={9} fill={INK} />
      <ellipse cx={100} cy={254} rx={20} ry={9} fill={INK} />
      {/* lengan kiri (turun) */}
      <line x1={44} y1={142} x2={34} y2={192} stroke={INK} strokeWidth={21} strokeLinecap="round" />
      <line x1={44} y1={142} x2={34} y2={192} stroke={shirt} strokeWidth={12} strokeLinecap="round" />
      <circle cx={33} cy={196} r={10} fill={toon.skin} stroke={INK} strokeWidth={4} />
      {/* badan */}
      <path d="M40,132 Q40,122 52,122 L108,122 Q120,122 120,132 L124,214 Q124,222 114,222 L46,222 Q36,222 36,214 Z" fill={shirt} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M62,122 Q80,140 98,122" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {/* kartu: di belakang saku */}
      {children}
      {/* saku */}
      <path d="M84,176 L112,176 L112,206 Q112,212 106,212 L90,212 Q84,212 84,206 Z" fill="#fff" fillOpacity={0.35} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M84,176 L112,176" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {/* lengan kanan ke kartu */}
      <line x1={sh[0]} y1={sh[1]} x2={handTo[0]} y2={handTo[1]} stroke={INK} strokeWidth={21} strokeLinecap="round" />
      <line x1={sh[0]} y1={sh[1]} x2={handTo[0]} y2={handTo[1]} stroke={shirt} strokeWidth={12} strokeLinecap="round" />
      <circle cx={handTo[0]} cy={handTo[1]} r={10} fill={toon.skin} stroke={INK} strokeWidth={4} />
      {/* kepala */}
      <g transform={`rotate(${nod} 80 112)`}>
        <circle cx={80} cy={76} r={44} fill={toon.skin} stroke={INK} strokeWidth={5} />
        <circle cx={38} cy={82} r={8} fill={toon.skin} stroke={INK} strokeWidth={4} />
        <circle cx={122} cy={82} r={8} fill={toon.skin} stroke={INK} strokeWidth={4} />
        <path d="M36,70 Q32,28 80,26 Q128,28 124,70 Q108,50 80,52 Q52,50 36,70 Z" fill={hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <Face cx={80} cy={84} gap={17} r={9} mood={mood} look={[0.7, 0]} blink={blink} />
      </g>
      {overlay}
    </svg>
  );
};

// ---------------- Papan nama kartun ----------------
export const SignBoard: React.FC<{ readonly w: number; readonly text: string; readonly color: string; readonly size: number; readonly post?: number; readonly t?: number }> = ({ w, text, color, size, post = 70, t = 0 }) => (
  <div style={{ position: "relative", width: w, height: size * 1.9 + post, display: "flex", flexDirection: "column", alignItems: "center", transform: `rotate(${1.6 * Math.sin(t * 2.2)}deg) translateY(${Math.sin(t * 2.6) * 5}px)`, filter: "drop-shadow(16px 26px 0 rgba(30,34,70,0.30))" }}>
    <div
      style={{
        width: w,
        height: size * 1.9,
        borderRadius: 34,
        background: color,
        border: `8px solid ${INK}`,
        boxShadow: `0 12px 0 color-mix(in srgb, ${color} 52%, #000), 0 24px 0 ${INK}, inset 0 -14px 0 rgba(0,0,0,0.14), inset 0 8px 0 rgba(255,255,255,0.5)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        color: "#fff",
        WebkitTextStroke: `${Math.max(7, size * 0.1)}px ${INK}`,
        paintOrder: "stroke fill",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {text}
      <div style={{ position: "absolute", left: 38, top: 16, width: 90, height: 12, borderRadius: 6, background: "#fff", opacity: 0.55 }} />
      <div style={{ position: "absolute", left: 24, top: 18, width: 12, height: 12, borderRadius: 6, background: INK, opacity: 0.8 }} />
      <div style={{ position: "absolute", right: 24, top: 18, width: 12, height: 12, borderRadius: 6, background: INK, opacity: 0.8 }} />
    </div>
    {post > 0 ? <div style={{ width: 26, flex: 1, background: WOOD_DARK, border: `6px solid ${INK}`, borderTop: "none", boxSizing: "border-box" }} /> : null}
  </div>
);

// ---------------- Kapal mainan (Inggris = oranye, Belanda = biru; ukuran dan bentuk SAMA) ----------------
// viewBox 260 x 260. Tanpa meriam, tanpa api. Wajah datar seperti stiker; lengan opsional (melambai).
export const Ship: React.FC<{
  readonly kind: "en" | "nl";
  readonly w: number;
  readonly t: number;
  readonly flip?: boolean;
  readonly mood?: "happy" | "laugh" | "oh";
  readonly wave?: number; // 0 = tanpa lengan; >0 = sudut lengan yang melambai (derajat, 0..180)
  readonly phase?: number;
  readonly sway?: number; // derajat goyang (default 2,2)
  readonly belly?: number; // tambahan tinggi lambung (unit), dipakai saat memeluk keranjang di depan badan
  readonly faceDy?: number; // geser wajah (unit)
  readonly sails?: readonly [string, string]; // [layar depan, layar belakang]; default = warna Shorts (tidak berubah)
  readonly hullShape?: "tub" | "ship"; // "ship" = haluan dan buritan naik (siluet kapal lebih jelas); default "tub" (Shorts)
  readonly emblem?: boolean; // lingkaran lambang di layar (default true)
  readonly face?: boolean; // wajah di lambung (default true)
}> = ({ kind, w, t, flip = false, mood = "happy", wave = 0, phase = 0, sway = 2.2, belly = 0, faceDy = 0, sails = ["#F1C47E", "#BCD3F2"], hullShape = "tub", emblem = true, face = true }) => {
  const b = belly;
  const hull =
    hullShape === "ship"
      ? `M4,118 Q16,146 40,150 L220,150 Q244,146 256,118 Q248,${206 + b} 196,${232 + b} L64,${232 + b} Q12,${206 + b} 4,118 Z`
      : `M22,150 L238,150 Q230,${222 + b} 184,${232 + b} L76,${232 + b} Q30,${222 + b} 22,150 Z`;
  const c = kind === "en" ? toon.orange : toon.blue;
  const cd = kind === "en" ? toon.orangeDark : toon.blueDark;
  const cl = kind === "en" ? toon.orangeLight : toon.blueLight;
  return (
    <svg width={w} height={w} viewBox="0 0 260 260" style={{ overflow: "visible", display: "block", transform: `${flip ? "scaleX(-1) " : ""}rotate(${sway * Math.sin(t * 2.1 + phase)}deg)`, transformOrigin: "50% 88%" }}>
      {/* halo tepi tipis (kontras terhadap air gelap) */}
      <path d={hull} transform="translate(0 15)" fill="none" stroke="#fff" strokeWidth={15} strokeLinejoin="round" opacity={0.9} />
      {/* tiang dan layar */}
      <path d="M138,34 Q224,66 218,138 L138,138 Z" transform="translate(7 7)" fill="#B9C6E2" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M122,56 Q66,84 62,138 L122,138 Z" transform="translate(7 7)" fill="#E3CFA6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={130} y1={156} x2={130} y2={26} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <line x1={130} y1={156} x2={130} y2={26} stroke={WOOD} strokeWidth={5} strokeLinecap="round" />
      <path d="M138,34 Q224,66 218,138 L138,138 Z" fill={sails[1]} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M122,56 Q66,84 62,138 L122,138 Z" fill={sails[0]} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M150,60 Q196,80 206,118" fill="none" stroke="#9BB4DC" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      {emblem ? (
        <>
          <circle cx={186} cy={98} r={17} fill={c} stroke={INK} strokeWidth={4.5} />
          <circle cx={186} cy={98} r={7} fill="#fff" />
        </>
      ) : null}
      <g transform="translate(136 -2) scale(0.56)">
        <FlagG kind={kind} />
      </g>
      {/* lengan */}
      {wave > 0 ? (
        <>
          <Arm x={34} y={186} angle={wave + 10 * Math.sin(t * 9 + phase)} side="l" len={34} color={c} />
          <Arm x={226} y={186} angle={wave + 10 * Math.sin(t * 9 + phase + 1)} side="r" len={34} color={c} />
        </>
      ) : null}
      {/* lambung: ekstrusi (sisi tebal lebih gelap) lalu muka lambung */}
      <path d={hull} transform="translate(0 15)" fill={cd} stroke={INK} strokeWidth={6.5} strokeLinejoin="round" />
      <path d={hull} fill={c} stroke={INK} strokeWidth={6.5} strokeLinejoin="round" />
      <path d={`M30,158 Q36,${214 + b} 80,${224 + b}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
      <path d="M34,153 L230,153" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
      <path d="M28,166 L232,166" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      <path d={`M40,${222 + b} Q80,${232 + b} 130,${232 + b} L184,${232 + b} Q222,${226 + b} 232,${196 + b * 0.6} Q200,${226 + b} 150,${224 + b} Z`} fill={cd} opacity={0.38} />
      <path d="M150,60 Q196,80 206,118" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <path d="M130,124 Q196,126 214,120 L214,138 L138,138 Z" fill="#DCE6F5" opacity={0.55} />
      <path d="M52,158 Q90,152 112,158" fill="none" stroke={cl} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
      <circle cx={206} cy={216 + b * 0.6} r={5} fill={cd} opacity={0.5} />
      {face ? <Face cx={130} cy={196 + faceDy} gap={24} r={11} mood={mood} look={[0.5, 0]} blink={blinkOf(t, phase)} /> : null}
    </svg>
  );
};

// ---------------- Keranjang pala ----------------
export const Basket: React.FC<{ readonly w: number }> = ({ w }) => {
  const nuts: [number, number][] = [
    [58, 56],
    [100, 40],
    [142, 56],
    [80, 72],
    [122, 72],
  ];
  return (
    <svg width={w} height={w * 0.9} viewBox="0 0 200 180" style={{ overflow: "visible", display: "block" }}>
      <path d="M26,70 L174,70 L160,164 Q158,172 148,172 L52,172 Q42,172 40,164 Z" fill={WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[96, 122, 148].map((y) => (
        <path key={y} d={`M32,${y} L168,${y}`} stroke={WOOD_DARK} strokeWidth={5} strokeLinecap="round" />
      ))}
      {[70, 100, 130].map((x) => (
        <path key={x} d={`M${x},72 L${x},170`} stroke={WOOD_DARK} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      ))}
      {nuts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={22} fill="#A8693A" stroke={INK} strokeWidth={5} />
          <path d={`M${x - 14},${y + 6} Q${x - 4},${y + 22} ${x + 14},${y + 8} L${x + 18},${y - 2} Q${x + 4},${y + 10} ${x - 16},${y - 2} Z`} fill={RED} opacity={0.9} />
          <path d={`M${x - 14},${y - 8} Q${x - 10},${y - 15} ${x - 2},${y - 17}`} fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" opacity={0.7} />
          <circle cx={x} cy={y} r={22} fill="none" stroke={INK} strokeWidth={5} />
        </g>
      ))}
      <path d="M26,70 L174,70" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    </svg>
  );
};

// ---------------- Surat kecil bergambar ----------------
export const Letter: React.FC<{ readonly w: number; readonly rot?: number }> = ({ w, rot = 0 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 100 70" style={{ overflow: "visible", display: "block", transform: `rotate(${rot}deg)` }}>
    <rect x={3} y={3} width={94} height={64} rx={8} fill="#FFFDF2" stroke={INK} strokeWidth={4} />
    <path d="M4,6 L50,40 L96,6" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={50} cy={40} r={9} fill={RED} stroke={INK} strokeWidth={3} />
    <path d="M46,40 l3,3 l6,-7" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------------- Gelembung ucapan bebas ----------------
export const Speech: React.FC<{
  readonly text: string;
  readonly size?: number;
  readonly color?: string;
  readonly tail?: "left" | "right" | "down";
  readonly strike?: number; // 0..1 coretan merah
  readonly t?: number; // waktu untuk goyang
}> = ({ text, size = 84, color = toon.ink, tail = "down", strike = 0, t = 0 }) => (
  <div style={{ position: "relative", display: "inline-block", transform: `rotate(${2 * Math.sin(t * 2.4)}deg) translateY(${Math.sin(t * 3.1) * 5}px)`, transformOrigin: "50% 100%", filter: "drop-shadow(14px 24px 0 rgba(30,34,70,0.26))" }}>
    <div
      style={{
        padding: "14px 40px 20px",
        background: "#fff",
        border: `8px solid ${INK}`,
        borderRadius: 70,
        boxShadow: `0 10px 0 #A9B7E0, 0 20px 0 ${INK}, inset 0 -10px 0 rgba(120,130,170,0.18), inset 0 6px 0 rgba(255,255,255,0.9)`,
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.05,
        color,
        whiteSpace: "nowrap",
        textAlign: "center",
        position: "relative",
      }}
    >
      {text}
      <div style={{ position: "absolute", left: 46, top: 14, width: 70, height: 10, borderRadius: 5, background: "#fff", boxShadow: "0 0 0 2px rgba(120,130,170,0.25)", opacity: 0.0 }} />
      <div style={{ position: "absolute", left: 50, top: 14, width: 80, height: 12, borderRadius: 6, background: "#BFD2F3" }} />
      <div style={{ position: "absolute", left: 140, top: 14, width: 14, height: 12, borderRadius: 6, background: "#BFD2F3" }} />
    </div>
    <div
      style={{
        position: "absolute",
        width: 38,
        height: 38,
        background: "#fff",
        borderRight: `8px solid ${INK}`,
        borderBottom: `8px solid ${INK}`,
        transform: "rotate(45deg)",
        ...(tail === "down" ? { left: "50%", marginLeft: -19, bottom: -22 } : tail === "left" ? { left: 56, bottom: -22 } : { right: 56, bottom: -22 }),
      }}
    />
    {strike > 0 ? (
      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <path d="M3,22 L97,16" stroke={INK} strokeWidth={5.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
      </svg>
    ) : null}
    {strike > 0 ? (
      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <path d="M3,22 L97,16" stroke={toon.red} strokeWidth={3.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
      </svg>
    ) : null}
  </div>
);

// ---------------- Lencana panah "TETAP" ----------------
export const ArrowBadge: React.FC<{ readonly text: string; readonly color: string; readonly w?: number }> = ({ text, color, w = 300 }) => (
  <div style={{ position: "relative", width: w, height: 120 }}>
    <svg width={w} height={120} viewBox="0 0 300 120" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d="M8,22 L196,22 L196,2 L292,60 L196,118 L196,98 L8,98 Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 200,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: 58,
        letterSpacing: 2,
        color: "#fff",
        WebkitTextStroke: `7px ${INK}`,
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  </div>
);

// ---------------- Meja ----------------
export const TableTop: React.FC<{ readonly w: number; readonly h?: number }> = ({ w, h = 120 }) => (
  <svg width={w} height={h + 150} viewBox={`0 0 ${w} ${h + 150}`} style={{ overflow: "visible", display: "block" }}>
    <rect x={w * 0.1} y={h * 0.5} width={34} height={h + 100} fill={WOOD_DARK} stroke={INK} strokeWidth={6} />
    <rect x={w * 0.9 - 34} y={h * 0.5} width={34} height={h + 100} fill={WOOD_DARK} stroke={INK} strokeWidth={6} />
    <rect x={4} y={4} width={w - 8} height={h * 0.34} rx={16} fill="#F7C985" stroke={INK} strokeWidth={6.5} />
    <rect x={14} y={h * 0.34 + 4} width={w - 28} height={h * 0.66} rx={14} fill={WOOD} stroke={INK} strokeWidth={6.5} />
    <path d={`M30,${h * 0.14} L${w * 0.4},${h * 0.14}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
  </svg>
);

// Teks pil (label pulau, dll.)
export const Chip: React.FC<{ readonly text: string; readonly color: string; readonly size?: number; readonly textColor?: string }> = ({ text, color, size = 48, textColor = "#fff" }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: toonFont(),
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 2,
      color: textColor,
      background: color,
      border: `6px solid ${INK}`,
      boxShadow: `0 6px 0 ${INK}`,
      borderRadius: 999,
      padding: "4px 30px 8px",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// Kartu di dalam <svg> (pusat di x, y; lebar w dalam satuan svg).
export const CardG: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly tint: string; readonly rot?: number }> = ({ x, y, w, tint, rot = 0 }) => {
  const k = w / 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k}) translate(-25 -35)`}>
      <rect x={2} y={2} width={46} height={66} rx={7} fill="#fff" stroke={INK} strokeWidth={3.4} />
      <rect x={8} y={8} width={34} height={54} rx={4} fill={tint} />
      <circle cx={25} cy={35} r={9} fill="#fff" opacity={0.85} />
      <circle cx={25} cy={35} r={4.4} fill={tint} />
    </g>
  );
};

// Penggaris/pengukur kartun (garis dengan ujung tegak). Gambar dalam <svg> koordinat halaman.
export const Ruler: React.FC<{
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly p: number; // 0..1 digambar
  readonly color?: string;
}> = ({ x1, y1, x2, y2, p, color = toon.orangeDark }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * 22;
  const ny = (dx / len) * 22;
  const ex = x1 + dx * p;
  const ey = y1 + dy * p;
  return (
    <g strokeLinecap="round">
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={INK} strokeWidth={17} />
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={8} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} stroke={INK} strokeWidth={17} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} stroke={color} strokeWidth={8} />
      {p > 0.98 ? (
        <>
          <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} stroke={INK} strokeWidth={17} />
          <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} stroke={color} strokeWidth={8} />
        </>
      ) : null}
    </g>
  );
};

// ---------------- Lengan memeluk (dua segmen + siku) dan tangan mitten besar ----------------
// Lengan: bahu -> siku -> tangan. Lengan baju putih (atas) menyambung ke lengan bawah berwarna kulit; siku bulat jelas.
export const ElbowArm: React.FC<{
  readonly s: readonly [number, number];
  readonly e: readonly [number, number];
  readonly h: readonly [number, number];
  readonly thick?: number;
  readonly cuff: string;
  readonly handR?: number; // jari-jari tangan: manset diletakkan tepat di luar tepi tangan
}> = ({ s, e, h, thick = 56, cuff, handR = 48 }) => {
  const up = `M${s[0]},${s[1]} L${e[0]},${e[1]}`;
  const fo = `M${e[0]},${e[1]} L${h[0]},${h[1]}`;
  const ang = (Math.atan2(h[1] - e[1], h[0] - e[0]) * 180) / Math.PI;
  const fl = Math.hypot(h[0] - e[0], h[1] - e[1]) || 1;
  const cd = Math.min(0.9, (handR + 6) / fl); // jarak manset dari tangan (fraksi panjang lengan bawah)
  const cx = h[0] - (h[0] - e[0]) * cd;
  const cy = h[1] - (h[1] - e[1]) * cd;
  const nx = -(h[1] - e[1]);
  const ny = h[0] - e[0];
  const nl = Math.hypot(nx, ny) || 1;
  const ox = (nx / nl) * thick * 0.28;
  const oy = (ny / nl) * thick * 0.28;
  return (
    <g>
      <path d={`${up} L${h[0]},${h[1]}`} fill="none" stroke={INK} strokeWidth={thick + 16} strokeLinecap="round" strokeLinejoin="round" />
      {/* lengan atas: lengan baju putih belang biru (gaya pelaut); lengan bawah: kulit */}
      <path d={up} fill="none" stroke="#fff" strokeWidth={thick} strokeLinecap="round" />
      <path d={`M${s[0] + (e[0] - s[0]) * 0.12},${s[1] + (e[1] - s[1]) * 0.12} L${e[0]},${e[1]}`} fill="none" stroke={cuff} strokeWidth={thick} strokeDasharray="9 26" />
      <path d={fo} fill="none" stroke={toon.skin} strokeWidth={thick} strokeLinecap="round" />
      <path d={`M${e[0] + ox},${e[1] + oy} L${h[0] + ox},${h[1] + oy}`} fill="none" stroke="#EDA27A" strokeWidth={thick * 0.28} strokeLinecap="round" />
      <path d={`M${e[0] - ox * 0.9},${e[1] - oy * 0.9} L${h[0] - ox * 0.9},${h[1] - oy * 0.9}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
      {/* siku: tekukan bulat (sambungan lengan baju ke lengan bawah) + lipatan di sisi dalam tekukan */}
      <circle cx={e[0]} cy={e[1]} r={thick / 2 - 1} fill={toon.skin} />
      <ellipse cx={e[0] - ox * 0.9} cy={e[1] - oy * 0.9 - thick * 0.05} rx={thick * 0.15} ry={thick * 0.07} fill="#fff" opacity={0.75} />
      {/* manset di pergelangan */}
      <g transform={`translate(${cx} ${cy}) rotate(${ang})`}>
        <rect x={-14} y={-(thick / 2 + 7)} width={28} height={thick + 14} rx={11} fill={cuff} stroke={INK} strokeWidth={6} />
      </g>
    </g>
  );
};

// Mitten kecil dengan ibu jari: telapak bulat, tiga garis jari di ujung, ibu jari terpisah di sisi atas mengarah ke tengah.
// Titik (x, y) = pusat telapak; ujung jari mengarah ke +x (cermin dengan flip).
export const WrapHand: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly rot?: number; readonly flip?: boolean; readonly squeeze?: number }> = ({ x, y, r, rot = 0, flip = false, squeeze = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.86} fill={toon.skin} stroke={INK} strokeWidth={r * 0.15} />
    {[-0.34, 0, 0.34].map((k, i) => (
      <path key={i} d={`M${r * 0.3 - squeeze * 3},${r * k - r * 0.08} Q${r * 0.62},${r * k + r * 0.1} ${r * 0.9},${r * k - r * 0.02}`} fill="none" stroke={INK} strokeWidth={r * 0.095} strokeLinecap="round" />
    ))}
    {/* ibu jari: kapsul terpisah di sisi atas, melengkung ke dalam */}
    <ellipse cx={r * 0.02} cy={-r * 0.78} rx={r * 0.56} ry={r * 0.27} transform={`rotate(14 ${r * 0.02} ${-r * 0.78})`} fill={toon.skin} stroke={INK} strokeWidth={r * 0.13} />
    <ellipse cx={-r * 0.1} cy={-r * 0.8} rx={r * 0.2} ry={r * 0.07} transform={`rotate(14 ${-r * 0.1} ${-r * 0.8})`} fill="#fff" opacity={0.7} />
    <ellipse cx={-r * 0.35} cy={r * 0.3} rx={r * 0.22} ry={r * 0.09} fill="#EDA27A" opacity={0.6} />
  </g>
);

// ---------------- Pulau DIGENGGAM (draf 4, tangan merangkul) ----------------
// Satu siluet menyatu (tinta di bawah, warna di atas): telapak bulat di bawah dan di BELAKANG-DEPAN dasar pulau, empat jari
// BERBEDA tinggi (ujung membulat, sedikit melengkung ke tengah) naik MERANGKUL bagian depan dasar pulau, ibu jari besar
// naik di atas tepi kiri pulau. Pulau terbenam di telapak (dasar pasirnya tersembunyi); rumah/pohon/bendera tetap terbaca.
// Koordinat unit: pulau 400 lebar (x 0..400), tangan datang dari kiri; mirror=true untuk dari kanan (cermin terhadap x=200).
export const GRASP_X0 = -400;
export const GRASP_Y0 = -70;
export const GRASP_W = 880;
export const GRASP_H = 600;
export const GRASP_CX = 200;
export const GRASP_FLAG_TOP = 84; // y unit puncak tiang bendera

const ISL_TOP = 60;

export const GraspedIsland: React.FC<{
  readonly kind: "manhattan" | "manhattan-en" | "run";
  readonly color: string;
  readonly dark: string;
  readonly k: number; // skala (1 unit = k px)
  readonly t: number;
  readonly squeeze?: number; // 0..1: jari menutup rapat
  readonly flag?: "en" | "nl";
  readonly mirror?: boolean;
  readonly lift?: number; // unit: rumah/pohon/bendera digeser ke belakang (naik) di atas rumput supaya jari tidak menutupi rumah (default 0)
  readonly reach?: number; // unit: lengan diperpanjang ke luar (masuk dari tepi layar) (default 0)
}> = ({ kind, color, dark, k, t, squeeze = 0, flag, mirror = false, lift = 0, reach = 0 }) => {
  const sq = squeeze;
  const poleX = kind === "run" ? 214 : 124;
  // draf 2: kaki tiang tetap di rumput (y 228, tertutup jari); tiang memanjang sebesar lift supaya bendera naik
  // bersama rumah tanpa tiang melayang. puncak bendera = GRASP_FLAG_TOP - lift. lift=0 -> sama dengan sebelumnya.
  const poleBase = 228;
  const poleH = 228 - GRASP_FLAG_TOP + lift;
  const a0 = -420 - reach;
  const a1 = -400 - reach;
  // jari: pangkal (di dalam telapak) -> ujung; tinggi BERBEDA (tengah paling tinggi), kelingking paling pendek
  const fingers = [
    { bx: 382, by: 352, tx: 376 - sq * 10, ty: 300 + sq * 8, cx: 392 - sq * 4, cy: 322, w: 56 }, // kelingking
    { bx: 322, by: 352, tx: 314 - sq * 14, ty: 262 + sq * 10, cx: 330 - sq * 6, cy: 316, w: 62 }, // manis
    { bx: 260, by: 352, tx: 250 - sq * 14, ty: 238 + sq * 10, cx: 266 - sq * 4, cy: 308, w: 64 }, // tengah
    { bx: 198, by: 352, tx: 190 - sq * 8, ty: 262 + sq * 8, cx: 196, cy: 314, w: 60 }, // telunjuk
  ];
  const fd = (f: (typeof fingers)[number]) => `M${f.bx},${f.by} Q${f.cx},${f.cy} ${f.tx},${f.ty}`;
  const thumb = `M50,420 Q2,350 46,298 Q62,278 ${100 + sq * 12},${258 + sq * 6}`;
  const wristY = 380;
  return (
    <svg width={GRASP_W * k} height={GRASP_H * k} viewBox={`${GRASP_X0} ${GRASP_Y0} ${GRASP_W} ${GRASP_H}`} style={{ overflow: "visible", display: "block" }}>
      <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
        {/* bayangan jatuh tegas */}
        <ellipse cx={218} cy={446} rx={230} ry={14} fill="#0C3140" opacity={0.26} />
        {/* pulau (dasar pasirnya terbenam di telapak) */}
        <g transform={`translate(0 ${ISL_TOP})`}>
          <Island kind={kind} w={400} t={t} bare detail={1.12} detailDy={(-lift * 300) / 400} />
        </g>
        {flag ? (
          <g transform={`translate(${poleX} ${poleBase})`}>
            <line x1={0} y1={0} x2={0} y2={-poleH} stroke={INK} strokeWidth={14} strokeLinecap="round" />
            <line x1={0} y1={0} x2={0} y2={-poleH} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <circle cx={0} cy={-poleH - 2} r={9.5} fill={toon.yellow} stroke={INK} strokeWidth={4.5} />
            <g transform={`translate(${mirror ? -7 : 7} ${-poleH + 5}) scale(${mirror ? -1 : 1} 1) skewY(${5 * Math.sin(t * 5)}) scale(1.4)`}>
              <FlagG kind={flag} />
            </g>
          </g>
        ) : null}
        {/* --- tinta dasar (siluet menyatu) --- */}
        <g stroke={INK} fill={INK} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${a0},${wristY} L0,${wristY}`} strokeWidth={166} strokeLinecap="butt" fill="none" />
          <ellipse cx={218} cy={384} rx={228} ry={86} strokeWidth={14} />
          {fingers.map((f, i) => (
            <path key={`ik${i}`} d={fd(f)} fill="none" strokeWidth={f.w + 15} />
          ))}
          <path d={thumb} fill="none" strokeWidth={88} />
        </g>
        {/* --- warna --- */}
        <path d={`M${a0},${wristY} L0,${wristY}`} stroke={color} strokeWidth={150} fill="none" />
        <ellipse cx={218} cy={384} rx={228} ry={86} fill={color} />
        {fingers.map((f, i) => (
          <g key={`f${i}`}>
            <path d={fd(f)} fill="none" stroke={color} strokeWidth={f.w} strokeLinecap="round" />
            {/* garis pemisah jari (tinta) di sisi kanan */}
            <path d={`M${f.tx + f.w * 0.5 + 1},${f.ty + 26} Q${f.cx + f.w * 0.5 + 1},${f.cy + 6} ${f.bx + f.w * 0.5 + 1},${f.by - 6}`} fill="none" stroke={INK} strokeWidth={5.5} strokeLinecap="round" opacity={i === 0 ? 0 : 0.85} />
            {/* ruas jari */}
            <path d={`M${f.tx - f.w * 0.26},${f.ty + 38} Q${f.tx},${f.ty + 48} ${f.tx + f.w * 0.26},${f.ty + 38}`} fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" opacity={0.6} />
            <ellipse cx={f.tx - f.w * 0.14} cy={f.ty - f.w * 0.1} rx={f.w * 0.12} ry={f.w * 0.2} fill="#fff" opacity={0.55} transform={`rotate(14 ${f.tx} ${f.ty})`} />
          </g>
        ))}
        {/* pemisah jari paling kiri (telunjuk) terhadap ibu jari tidak perlu: ibu jari di depan */}
        <path d={`M-10,${wristY - 40} Q40,300 60,330`} fill="none" stroke="none" />
        <path d={thumb} fill="none" stroke={color} strokeWidth={72} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M42,410 Q8,350 50,308`} transform="translate(22 4)" fill="none" stroke={dark} strokeWidth={13} strokeLinecap="round" opacity={0.3} />
        <path d={`M18,364 Q50,372 84,356`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        <ellipse cx={88 + sq * 12} cy={262 + sq * 6} rx={12} ry={18} fill="#fff" opacity={0.5} transform={`rotate(20 ${88 + sq * 12} ${262 + sq * 6})`} />
        {/* bayangan lembut telapak + sorot */}
        <path d="M110,448 Q218,478 340,448" fill="none" stroke={dark} strokeWidth={14} strokeLinecap="round" opacity={0.3} />
        <path d="M96,420 Q110,402 146,398" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.45} />
        {/* lengan: sorot + bayangan */}
        <path d={`M${a1},${wristY - 44} L-80,${wristY - 44}`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.45} />
        <path d={`M${a1},${wristY + 46} L-80,${wristY + 46}`} fill="none" stroke={dark} strokeWidth={12} strokeLinecap="round" opacity={0.4} />
        {/* manset putih menempel di pergelangan, dekat tangan */}
        <rect x={-74} y={wristY - 92} width={46} height={184} rx={18} fill="#fff" stroke={INK} strokeWidth={8} />
        <path d={`M-58,${wristY - 70} L-58,${wristY + 70}`} stroke={dark} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
      </g>
    </svg>
  );
};
