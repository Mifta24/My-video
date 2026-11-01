import { Audio } from "@remotion/media";
import type React from "react";
import { Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { appear, BigWord, pop, slide, toonFont } from "../../suhuf-bakteri/elements/ToonKit";
import { Face, blinkOf } from "../../suhuf-bakteri/shorts/characters";
import { Scale3D, panSpot, scalePose } from "../../suhuf-bakteri/shorts/scale3d";
import { SoftShadow, Stage3D, wx, wy } from "../../suhuf-bakteri/shorts/toy3d";
import { setStageSize } from "../../suhuf-bakteri/shorts/stage";
import { toon } from "../../suhuf-bakteri/theme";
import { FlagArt, FlagG, INK, RED, WOOD, WOOD_DARK } from "../shorts/kit2d";
import { Island3D, Question3D } from "../shorts/scene3d";
import { clipDuration, clipStart, getScene } from "./timing";

// Kit Long Suhuf #03 (16:9, 1920x1080). Margin aman 90 px di semua sisi.
// Zona: baris label y 92-140 (label kiri-atas, watermark kanan-atas) | kata besar y >= 150 | gambar y ~280-870 |
// caption kotak putih, tepi bawah y = 990 (satu baris, tidak meluap, bertahan sampai klip selesai).
export const W = 1920;
export const H = 1080;
export const CX = 960;
export const M = 90;
export const BIG_Y = 150;
export const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = (t: number, a: number, d: number) => interpolate(t, [a, a + d], [0, 1], { ...clamp01, easing: Easing.inOut(Easing.cubic) });
export const STAMP_RED = "#C62828";
export const SAILS: readonly [string, string] = ["#F0A443", "#86AEE6"]; // layar lebih gelap (tidak pucat di latar krem)

// ---------------- Teks ----------------
type BigProps = Omit<React.ComponentProps<typeof BigWord>, "cx" | "width"> & { readonly cx?: number; readonly width?: number };
export const Big: React.FC<BigProps> = ({ cx = CX, width = 1700, y, ...p }) => <BigWord cx={cx} width={width} y={y} {...p} />;

// Label wajib (SKEMA / PERUMPAMAAN - bukan data): pill putih, teks tinta, tepi berwarna. Pojok kiri atas.
export const Label: React.FC<{ readonly text: string; readonly t: number; readonly kind?: "skema" | "analogi"; readonly at?: number }> = ({ text, t, kind = "skema", at = 0 }) => {
  const c = kind === "skema" ? toon.blueDark : toon.orangeDark;
  const p = at <= 0 ? 1 : slide(t, at, 0.4);
  return (
    <div style={{ position: "absolute", left: M, top: 92, opacity: Math.max(p, at <= 0 ? 1 : 0), translate: `${(1 - p) * -20}px 0px` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 2,
          color: INK,
          background: "#fff",
          border: `5px solid ${c}`,
          boxShadow: `0 5px 0 ${INK}`,
          borderRadius: 999,
          padding: "4px 26px 6px 16px",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: 22, background: c, border: `4px solid ${INK}`, display: "inline-block" }} />
        {text}
      </div>
    </div>
  );
};

// Pil nama (pulau, pihak): putih, teks tinta, tepi berwarna; bendera kecil opsional.
export const LChip: React.FC<{ readonly text: string; readonly color?: string; readonly size?: number; readonly flag?: "en" | "nl" }> = ({ text, color = INK, size = 44, flag }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      fontFamily: toonFont(),
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 2,
      color: INK,
      background: "#fff",
      border: `${Math.max(5, size * 0.12)}px solid ${color}`,
      boxShadow: `0 ${Math.max(5, size * 0.11)}px 0 ${INK}`,
      borderRadius: 999,
      padding: `${size * 0.06}px ${size * 0.6}px ${size * 0.14}px`,
      whiteSpace: "nowrap",
    }}
  >
    {flag ? <FlagArt kind={flag} w={size * 1.05} /> : null}
    {text}
  </div>
);

// Pil di posisi pusat (cx, y).
export const ChipAt: React.FC<{ readonly cx: number; readonly y: number; readonly t: number; readonly at?: number; readonly children: React.ReactNode }> = ({ cx, y, t, at = 0, children }) => {
  if (t < at) {
    return null;
  }
  const s = at <= 0 ? 1 : pop(t, at, 0.45);
  return (
    <div style={{ position: "absolute", left: cx - 600, width: 1200, top: y, display: "flex", justifyContent: "center", transform: `scale(${s})`, opacity: at <= 0 ? 1 : appear(t, at, 0.1) }}>
      {children}
    </div>
  );
};

// Teks kecil tinta di pill putih (keterangan 2-5 kata).
export const Sub: React.FC<{ readonly text: string; readonly t: number; readonly at?: number; readonly y: number; readonly cx?: number; readonly size?: number }> = ({ text, t, at = 0, y, cx = CX, size = 46 }) =>
  t < at ? null : (
    <div style={{ position: "absolute", left: cx - 800, width: 1600, top: y, display: "flex", justifyContent: "center", opacity: appear(t, at, 0.2), translate: `0px ${(1 - slide(t, at, 0.4)) * 14}px` }}>
      <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: size, color: INK, background: "#fff", border: `5px solid ${INK}`, borderRadius: 999, padding: "2px 30px 6px", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );

// Masuk tanpa frame kosong: elemen yang ada sejak awal adegan (at <= 0) langsung terlihat (skala 0,92 -> 1);
// elemen yang datang kemudian muncul memantul.
export const In: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly at?: number;
  readonly rot?: number;
  readonly dy?: number;
  readonly dx?: number;
  readonly origin?: string;
  readonly scale?: number;
  readonly children: React.ReactNode;
}> = ({ x, y, t, at = 0, rot = 0, dy = 0, dx = 0, origin = "50% 100%", scale = 1, children }) => {
  if (t < at) {
    return null;
  }
  const early = at <= 0.05;
  const s = early ? 0.92 + 0.08 * interpolate(t, [0, 0.45], [0, 1], { ...clamp01, easing: Easing.out(Easing.back(1.8)) }) : pop(t, at, 0.5);
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, opacity: early ? 1 : appear(t, at, 0.12), transform: `scale(${s * scale}) rotate(${rot}deg)`, transformOrigin: origin }}>
      {children}
    </div>
  );
};

// Shot: tampil dari `from` sampai `to`. Shot pertama (from <= 0) langsung penuh (tidak ada frame kosong di awal adegan);
// shot berikutnya silang-pudar dengan shot sebelumnya (tumpang 0,1 dtk).
export const Shot: React.FC<{ readonly t: number; readonly from?: number; readonly to?: number; readonly children: (lt: number) => React.ReactNode }> = ({ t, from = 0, to = 9999, children }) => {
  const inn = from <= 0 ? 1 : interpolate(t, [from, from + 0.18], [0, 1], clamp01);
  const out = interpolate(t, [to - 0.05, to + 0.15], [1, 0], clamp01);
  const o = Math.min(inn, out);
  if (o <= 0) {
    return null;
  }
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>{children(t - Math.max(0, from))}</div>;
};

// ---------------- Caption (landscape) ----------------
const MAXC = 44;
export const splitCaption = (text: string): string[] => {
  if (text.includes("|")) {
    return text.split("|").map((x) => x.trim()).filter(Boolean);
  }
  const phrases = text.match(/[^.,:?!]+[.,:?!]?/g) ?? [text];
  const out: string[] = [];
  for (const raw of phrases) {
    const words = raw.trim().split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      if (line && (line + " " + w).length > MAXC) {
        out.push(line);
        line = w;
      } else {
        line = line ? line + " " + w : w;
      }
    }
    if (line) {
      const prev = out[out.length - 1];
      if (prev && (prev + " " + line).length <= MAXC && (line.length < 14 || prev.length < 14)) {
        out[out.length - 1] = prev + " " + line;
      } else {
        out.push(line);
      }
    }
  }
  // draf 3: potongan tidak boleh berakhir di kata sambung ("... memegang apa yang" | "sudah dikuasainya.");
  // kata itu dipindah ke awal potongan berikutnya. Teks narasi tetap sama, hanya titik potong tampilan.
  for (let i = 0; i < out.length - 1; i++) {
    let words = out[i].split(" ");
    let next = out[i + 1];
    while (words.length > 2 && DANGLING.has(words[words.length - 1].toLowerCase()) && (words[words.length - 1] + " " + next).length <= MAXC) {
      next = words.pop() + " " + next;
    }
    out[i] = words.join(" ");
    out[i + 1] = next;
  }
  return out;
};
const DANGLING = new Set(["yang", "apa", "dan", "di", "ke", "dari", "untuk", "dengan", "pada", "atau", "tapi", "para", "si"]);

const Words: React.FC<{ readonly text: string }> = ({ text }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span key={i} style={{ color: /\d/.test(w) ? toon.orangeDark : undefined }}>
        {i > 0 ? " " : ""}
        {w}
      </span>
    ))}
  </>
);

export const CAPTION_BOTTOM = H - 990;
export const LongCaption: React.FC<{ readonly text: string; readonly durationSec: number }> = ({ text, durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = splitCaption(text);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  let cur: { text: string; from: number } | null = null;
  for (let i = 0; i < chunks.length; i++) {
    const from = (acc / total) * durationSec;
    acc += chunks[i].length;
    const to = i === chunks.length - 1 ? 9999 : (acc / total) * durationSec;
    if (t >= from && t < to) {
      cur = { text: chunks[i], from };
      break;
    }
  }
  if (!cur) {
    return null;
  }
  const p = interpolate(t, [cur.from, cur.from + 2 / fps], [0.6, 1], clamp01);
  return (
    <div style={{ position: "absolute", left: M, right: M, bottom: CAPTION_BOTTOM, display: "flex", justifyContent: "center", opacity: p }}>
      <div
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: Math.min(54, Math.floor(1560 / (cur.text.length * 0.6))),
          lineHeight: 1.16,
          color: INK,
          background: "#fff",
          border: `6px solid ${toon.orange}`,
          boxShadow: `0 6px 0 ${INK}`,
          padding: "8px 34px 12px",
          borderRadius: 28,
          maxWidth: W - 2 * M,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <Words text={cur.text} />
      </div>
    </div>
  );
};

// Narasi satu adegan Long: <Audio> per klip + caption. Posisi dari durasi audio nyata (long/timing.ts).
export const LongVoice: React.FC<{ readonly sceneId: string }> = ({ sceneId }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {getScene(sceneId).clips.map((c) => (
        <Sequence key={c.id} from={Math.round(clipStart(sceneId, c.id) * fps)} durationInFrames={Math.max(1, Math.round(clipDuration(c.id) * fps))} layout="none" name={`VO · ${c.id}`}>
          <Audio src={staticFile(`suhuf-pulau-run/vo-long/${c.id}.mp3`)} />
          <LongCaption text={c.caption ?? c.text} durationSec={clipDuration(c.id)} />
        </Sequence>
      ))}
    </>
  );
};

// Watermark pojok kanan atas: tinta pekat (bukan abu-abu), di dalam margin aman.
export const LongWatermark: React.FC<{ readonly hideAfter: number }> = ({ hideAfter }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 15], [0, 1], clamp01) * interpolate(frame, [hideAfter, hideAfter + 15], [1, 0], clamp01);
  return (
    <div style={{ position: "absolute", right: M, top: 98, opacity: o, fontFamily: toonFont(), fontWeight: 700, fontSize: 28, letterSpacing: 6, color: INK, textShadow: "0 0 8px #FFF4DE, 0 0 3px #FFF4DE", whiteSpace: "nowrap" }}>
      SUHUF PENGETAHUAN
    </div>
  );
};

// ---------------- Timbangan 3D (landscape) ----------------
export const ScaleLong3D: React.FC<{
  readonly t: number;
  readonly angle: number;
  readonly morphAt?: number;
  readonly pivot?: readonly [number, number];
  readonly floor?: number;
  readonly qY?: number;
  readonly qScale?: number;
}> = ({ t, angle, morphAt = 999, pivot = [960, 330], floor = 770, qY = 540, qScale = 1.6 }) => {
  // wx/wy adalah fungsi modul global; Stage3D baru mengatur ukuran saat child dirender.
  // Set lebih awal agar koordinat yang dihitung di komponen induk tidak memakai default Shorts 1080x1920.
  setStageSize(W, H);
  const pose = scalePose(angle, pivot, 318, 236, 142);
  const vis = interpolate(t, [morphAt, morphAt + 0.5], [1, 0], { ...clamp01, easing: Easing.in(Easing.cubic) }) * interpolate(t, [0, 0.4], [0.9, 1], { ...clamp01, easing: Easing.out(Easing.back(1.6)) });
  const q = pop(t, morphAt + 0.32, 0.7);
  const spin = interpolate(t, [morphAt, morphAt + 0.5], [0, Math.PI * 2], { ...clamp01, easing: Easing.inOut(Easing.cubic) });
  const land = (center: readonly [number, number], kind: "manhattan" | "run", key: string, ph: number) => {
    const sp = panSpot(center, 0, 0);
    return (
      <group key={key} position={[wx(sp.x), wy(sp.y) + Math.sin(t * 3 + ph) * 1.8, sp.z]} rotation={[0.3, 0, 0]} scale={[0.92, 0.92, 0.92]}>
        <group rotation={[0, kind === "run" ? -0.3 : 0.3, 0]}>
          <Island3D kind={kind} />
        </group>
      </group>
    );
  };
  return (
    <Stage3D>
      {vis > 0.001 ? (
        <group position={[wx(pivot[0]), wy(floor), 0]} rotation={[0, spin, 0]} scale={[vis, vis, vis]}>
          <group position={[-wx(pivot[0]), -wy(floor), 0]}>
            <Scale3D pose={pose} vis={1} floorY={floor} />
            {land(pose.left, "manhattan", "L", 0)}
            {land(pose.right, "run", "R", 1.7)}
          </group>
        </group>
      ) : null}
      {q > 0.001 ? (
        <group position={[wx(CX), wy(qY), 0]}>
          <SoftShadow x={0} y={-235 * q} w={330 * q} op={0.9} z={-120} />
          <group rotation={[0.04, 0.4 * Math.sin((t - morphAt) * 2.1), 0.1 * Math.sin((t - morphAt) * 2.9)]} scale={[qScale * q, qScale * q, qScale * q]}>
            <Question3D />
          </group>
        </group>
      ) : null}
    </Stage3D>
  );
};

// ---------------- Tokoh mainan (kapten, penengah, raja) ----------------
// viewBox 160 x 250. Wajah stiker sederhana (tanpa wajah rinci). Tangan: koordinat viewBox.
export const ToyFigure: React.FC<{
  readonly size: number;
  readonly t: number;
  readonly hat: "captain" | "feather" | "crown";
  readonly coat: string;
  readonly lHand?: readonly [number, number];
  readonly rHand?: readonly [number, number];
  readonly shake?: number; // derajat kepala menggeleng
  readonly mood?: "happy" | "laugh" | "oh" | "think" | "worry";
  readonly phase?: number;
  readonly children?: React.ReactNode;
}> = ({ size, t, hat, coat, lHand = [30, 200], rHand = [130, 200], shake = 0, mood = "happy", phase = 0, children }) => {
  const arm = (sx: number, sy: number, h: readonly [number, number], key: string) => (
    <g key={key}>
      <line x1={sx} y1={sy} x2={h[0]} y2={h[1]} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <line x1={sx} y1={sy} x2={h[0]} y2={h[1]} stroke={coat} strokeWidth={13} strokeLinecap="round" />
      <circle cx={h[0]} cy={h[1]} r={10.5} fill={toon.skin} stroke={INK} strokeWidth={4} />
    </g>
  );
  return (
    <svg width={size} height={(size * 250) / 160} viewBox="0 0 160 250" style={{ overflow: "visible", display: "block" }}>
      <rect x={52} y={204} width={22} height={36} rx={9} fill="#3B4A78" stroke={INK} strokeWidth={4} />
      <rect x={86} y={204} width={22} height={36} rx={9} fill="#3B4A78" stroke={INK} strokeWidth={4} />
      <ellipse cx={60} cy={242} rx={20} ry={8} fill={INK} />
      <ellipse cx={100} cy={242} rx={20} ry={8} fill={INK} />
      <path d="M38,140 Q38,128 52,128 L108,128 Q122,128 122,140 L128,212 Q128,220 118,220 L42,220 Q32,220 32,212 Z" fill={coat} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M80,130 L80,218" stroke={INK} strokeWidth={3} opacity={0.4} />
      {[152, 172, 192].map((y) => (
        <circle key={y} cx={88} cy={y} r={3.6} fill={toon.yellow} stroke={INK} strokeWidth={2} />
      ))}
      <path d="M62,128 L80,148 L98,128" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {arm(44, 146, lHand, "l")}
      {arm(116, 146, rHand, "r")}
      <g transform={`rotate(${shake} 80 120)`}>
        <circle cx={80} cy={86} r={40} fill={toon.skin} stroke={INK} strokeWidth={5} />
        <circle cx={41} cy={92} r={7.5} fill={toon.skin} stroke={INK} strokeWidth={4} />
        <circle cx={119} cy={92} r={7.5} fill={toon.skin} stroke={INK} strokeWidth={4} />
        <Face cx={80} cy={92} gap={15} r={8} mood={mood} look={[0.5, 0]} blink={blinkOf(t, phase)} />
        {hat === "captain" ? (
          <g>
            <path d="M26,62 Q80,8 134,62 Q80,46 26,62 Z" fill="#2E3350" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d="M34,58 Q80,44 126,58" fill="none" stroke={toon.yellow} strokeWidth={5} strokeLinecap="round" />
            <circle cx={80} cy={36} r={7} fill={toon.yellow} stroke={INK} strokeWidth={3} />
          </g>
        ) : hat === "feather" ? (
          <g>
            <path d={`M104,46 Q${136 + 4 * Math.sin(t * 3 + phase)},6 ${150 + 5 * Math.sin(t * 3 + phase)},-6 Q130,30 112,54 Z`} fill={toon.orange} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={80} cy={58} rx={62} ry={13} fill="#7B5AA6" stroke={INK} strokeWidth={5} />
            <path d="M48,58 Q50,22 80,22 Q110,22 112,58 Z" fill="#7B5AA6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d="M50,50 L110,50" stroke={toon.yellow} strokeWidth={6} />
          </g>
        ) : (
          <g>
            <path d="M46,58 L46,22 L62,40 L80,14 L98,40 L114,22 L114,58 Z" fill={toon.yellow} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <rect x={44} y={50} width={72} height={12} rx={5} fill="#F2B544" stroke={INK} strokeWidth={4} />
            <circle cx={80} cy={34} r={5} fill={RED} stroke={INK} strokeWidth={2.5} />
          </g>
        )}
      </g>
      {children}
    </svg>
  );
};

// ---------------- Lengan memeluk: lengan atas lurus, lengan bawah MELENGKUNG mengikuti sisi keranjang ----------------
// Digambar dalam <svg> koordinat halaman. s = bahu, e = siku, c = titik kendali lengkung, h = tangan.
export const CurveArm: React.FC<{
  readonly s: readonly [number, number];
  readonly e: readonly [number, number];
  readonly c: readonly [number, number];
  readonly h: readonly [number, number];
  readonly thick?: number;
  readonly sleeve: string;
}> = ({ s, e, c, h, thick = 46, sleeve }) => {
  const up = `M${s[0]},${s[1]} L${e[0]},${e[1]}`;
  const fo = `M${e[0]},${e[1]} Q${c[0]},${c[1]} ${h[0]},${h[1]}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`${up} Q${c[0]},${c[1]} ${h[0]},${h[1]}`} stroke={INK} strokeWidth={thick + 16} />
      <path d={up} stroke={sleeve} strokeWidth={thick} />
      <path d={fo} stroke={toon.skin} strokeWidth={thick} />
      <circle cx={e[0]} cy={e[1]} r={thick / 2 - 1} fill={toon.skin} stroke="none" />
      <path d={up} stroke="#fff" strokeWidth={thick} strokeDasharray="10 24" opacity={0.55} />
      <path d={fo} stroke="#fff" strokeWidth={6} opacity={0.5} transform="translate(-5 -8)" />
    </g>
  );
};

// Tangan mitten yang mencengkeram tepi (jari menekuk ke dalam). Pusat (x,y), jari ke arah `dir` (1 = kanan).
export const GripHand: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly dir: 1 | -1; readonly rot?: number; readonly squeeze?: number }> = ({ x, y, r, dir, rot = 0, squeeze = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${dir} 1)`}>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.9} fill={toon.skin} stroke={INK} strokeWidth={r * 0.17} />
    {[-0.42, 0, 0.42].map((k, i) => (
      <path key={i} d={`M${r * 0.2 - squeeze * 3},${r * k} Q${r * 0.6},${r * k + r * 0.14} ${r * 0.95},${r * k}`} fill="none" stroke={INK} strokeWidth={r * 0.11} strokeLinecap="round" />
    ))}
    <ellipse cx={-r * 0.1} cy={-r * 0.82} rx={r * 0.55} ry={r * 0.28} transform={`rotate(18 ${-r * 0.1} ${-r * 0.82})`} fill={toon.skin} stroke={INK} strokeWidth={r * 0.14} />
    <ellipse cx={-r * 0.3} cy={-r * 0.3} rx={r * 0.24} ry={r * 0.1} fill="#fff" opacity={0.6} />
  </g>
);

// ---------------- Benda pendukung ----------------
export const House: React.FC<{ readonly w: number; readonly body: string; readonly roof: string }> = ({ w, body, roof }) => (
  <svg width={w} height={w * 1.05} viewBox="0 0 100 105" style={{ overflow: "visible", display: "block" }}>
    <rect x={12} y={44} width={76} height={58} rx={5} fill={body} stroke={INK} strokeWidth={4.5} />
    <path d="M4,48 L50,8 L96,48 Z" fill={roof} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={42} y={70} width={16} height={32} rx={3} fill={WOOD_DARK} stroke={INK} strokeWidth={3} />
    <rect x={20} y={58} width={16} height={14} rx={2} fill={toon.blueLight} stroke={INK} strokeWidth={3} />
    <rect x={64} y={58} width={16} height={14} rx={2} fill={toon.blueLight} stroke={INK} strokeWidth={3} />
  </svg>
);

export const IceShop: React.FC<{ readonly w: number; readonly t: number }> = ({ w, t }) => (
  <svg width={w} height={w * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", display: "block" }}>
    {/* es krim besar di atap */}
    <g transform={`translate(100 46) rotate(${3 * Math.sin(t * 2.4)})`}>
      <path d="M-22,4 L0,52 L22,4 Z" fill="#E9B26A" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M-14,14 L10,14 M-8,28 L8,28" stroke={WOOD_DARK} strokeWidth={3} />
      <circle cx={-10} cy={-6} r={16} fill="#FF9EB5" stroke={INK} strokeWidth={4.5} />
      <circle cx={12} cy={-8} r={16} fill={toon.blueLight} stroke={INK} strokeWidth={4.5} />
      <circle cx={0} cy={-24} r={15} fill="#FFF4DE" stroke={INK} strokeWidth={4.5} />
      <circle cx={2} cy={-42} r={5} fill={RED} stroke={INK} strokeWidth={2.5} />
    </g>
    <rect x={14} y={96} width={172} height={118} rx={8} fill="#FFF4DE" stroke={INK} strokeWidth={5} />
    {/* kanopi bergaris */}
    <path d="M6,82 L194,82 L186,116 L14,116 Z" fill={toon.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${22 + i * 38},82 L${36 + i * 38},82 L${34 + i * 38},116 L${22 + i * 37},116 Z`} fill="#fff" />
    ))}
    <path d="M6,82 L194,82 L186,116 L14,116 Z" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d={`M14,116 ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `Q${25 + i * 21.5},132 ${35.5 + i * 21.5},116`).join(" ")}`} fill={toon.orange} stroke={INK} strokeWidth={4} />
    <rect x={30} y={140} width={84} height={50} rx={6} fill={toon.blueLight} stroke={INK} strokeWidth={4} />
    <rect x={30} y={174} width={84} height={16} rx={4} fill={WOOD} stroke={INK} strokeWidth={4} />
    <rect x={128} y={140} width={44} height={74} rx={5} fill={WOOD_DARK} stroke={INK} strokeWidth={4} />
    <circle cx={162} cy={180} r={4} fill={toon.yellow} stroke={INK} strokeWidth={2} />
  </svg>
);

export const Plate: React.FC<{ readonly w: number; readonly cakes: number; readonly tint: string }> = ({ w, cakes, tint }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible", display: "block" }}>
    <ellipse cx={100} cy={96} rx={96} ry={22} fill="#fff" stroke={INK} strokeWidth={5} />
    <ellipse cx={100} cy={94} rx={70} ry={13} fill="none" stroke="#D9DEEC" strokeWidth={4} />
    {Array.from({ length: cakes }, (_, i) => {
      const x = 100 + (i - (cakes - 1) / 2) * 56;
      return (
        <g key={i} transform={`translate(${x} 0)`}>
          <path d="M-24,58 L24,58 L18,92 L-18,92 Z" fill={tint} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <path d="M-10,60 L-8,90 M8,60 L6,90" stroke={INK} strokeWidth={2.5} opacity={0.35} />
          <path d="M-28,60 Q-30,30 0,28 Q30,30 28,60 Z" fill="#FFF4DE" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <circle cx={0} cy={22} r={8} fill={RED} stroke={INK} strokeWidth={3} />
        </g>
      );
    })}
  </svg>
);

// Jabat tangan: dua lengan (oranye dari kiri, biru dari kanan) bertemu di (cx, cy).
export const Handshake: React.FC<{ readonly cx: number; readonly cy: number; readonly t: number; readonly shake: number }> = ({ cx, cy, t, shake }) => {
  const dy = Math.sin(t * 12) * 10 * shake;
  const arm = (dir: -1 | 1, color: string, dark: string) => (
    <g>
      <path d={`M${cx + dir * 760},${cy + 70} Q${cx + dir * 380},${cy + 40 + dy * 0.4} ${cx + dir * 70},${cy + dy}`} fill="none" stroke={INK} strokeWidth={112} strokeLinecap="round" />
      <path d={`M${cx + dir * 760},${cy + 70} Q${cx + dir * 380},${cy + 40 + dy * 0.4} ${cx + dir * 70},${cy + dy}`} fill="none" stroke={color} strokeWidth={96} strokeLinecap="round" />
      <path d={`M${cx + dir * 700},${cy + 40} Q${cx + dir * 380},${cy + 12 + dy * 0.4} ${cx + dir * 160},${cy - 22 + dy}`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.45} />
      <rect x={cx + dir * 150 - 24} y={cy - 62 + dy} width={48} height={124} rx={18} fill="#fff" stroke={INK} strokeWidth={7} />
      <rect x={cx + dir * 150 - 8} y={cy - 50 + dy} width={8} height={100} rx={4} fill={dark} opacity={0.35} />
    </g>
  );
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {arm(-1, toon.orange, toon.orangeDark)}
      {arm(1, toon.blue, toon.blueDark)}
      <g transform={`translate(${cx} ${cy + dy})`}>
        <ellipse cx={0} cy={0} rx={120} ry={66} fill={toon.skin} stroke={INK} strokeWidth={8} />
        {[-28, 0, 28].map((y) => (
          <path key={y} d={`M-46,${y} Q0,${y + 12} 52,${y - 2}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        ))}
        <ellipse cx={-14} cy={-58} rx={52} ry={20} transform="rotate(-8 -14 -58)" fill={toon.skin} stroke={INK} strokeWidth={7} />
        <ellipse cx={-30} cy={-62} rx={18} ry={6} fill="#fff" opacity={0.6} />
      </g>
    </svg>
  );
};

// Lencana panah "TETAP": badan putih, tepi warna, teks tinta (kontras tinggi).
export const Tetap: React.FC<{ readonly color: string; readonly w?: number; readonly dir?: 1 | -1 }> = ({ color, w = 280, dir = 1 }) => (
  <div style={{ position: "relative", width: w, height: (w * 120) / 300, transform: dir < 0 ? "scaleX(-1)" : undefined }}>
    <svg width={w} height={(w * 120) / 300} viewBox="0 0 300 120" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d="M8,22 L196,22 L196,2 L292,60 L196,118 L196,98 L8,98 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M196,18 L280,60 L196,102 Z" fill={color} />
      <path d="M8,22 L196,22 L196,2 L292,60 L196,118 L196,98 L8,98 Z" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: (w * 196) / 300, height: (w * 120) / 300, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: toonFont(), fontWeight: 700, fontSize: w * 0.18, letterSpacing: 2, color: INK, transform: dir < 0 ? "scaleX(-1)" : undefined }}>
      TETAP
    </div>
  </div>
);

// Bendera berkibar kecil berdiri sendiri (tiang di bawah, (x,y) = pangkal tiang).
export const MiniFlag: React.FC<{ readonly kind: "en" | "nl"; readonly x: number; readonly y: number; readonly h?: number; readonly w?: number; readonly t: number; readonly phase?: number }> = ({ kind, x, y, h = 150, w = 110, t, phase = 0 }) => (
  <svg width={w + 40} height={h + 20} viewBox={`0 0 ${w + 40} ${h + 20}`} style={{ position: "absolute", left: x - 14, top: y - h - 10, overflow: "visible" }}>
    <line x1={14} y1={h + 10} x2={14} y2={6} stroke={INK} strokeWidth={12} strokeLinecap="round" />
    <line x1={14} y1={h + 10} x2={14} y2={6} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    <circle cx={14} cy={6} r={8} fill={toon.yellow} stroke={INK} strokeWidth={4} />
    <g transform={`translate(20 12) skewY(${5 * Math.sin(t * 5 + phase)}) scale(${w / 90})`}>
      <FlagG kind={kind} />
    </g>
  </svg>
);

export { INK, RED, WOOD, WOOD_DARK };
