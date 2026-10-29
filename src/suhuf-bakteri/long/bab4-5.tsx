import type React from "react";
import { interpolate } from "remotion";
import type { Cue } from "../elements/Sound";
import { appear, bob, Place, pop, Sh, Sparkle, slide, SmallText, toonFont } from "../elements/ToonKit";
import { Bacteria, BodySilhouette, Cell } from "../shorts/characters";
import { Flag3D, panSpot, Rope3D, Scale3D, scaleAngle, scalePose } from "../shorts/scale3d";
import { hopMotion, Stage3D, standAt, topForRope, Toy } from "../shorts/toy3d";
import { toon } from "../theme";
import { clipEnd, cue } from "../timing";
import { crowdPos } from "../shorts/visuals";
import { AcidCloud, along, Big, Board, BodyCell, Card, CountRing, Det, INK, Lbl, Person, Pill, Pinned, QOrb, RedX, Stamp, Str, Whiteboard, Compass, Ruler, wig, Chair, Strike, Suitcase, TeamScale } from "./kit";
import { Stadium3D, type StadiumPose } from "./stadium3d";

type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp01, easing: (x) => x * x * (3 - 2 * x) });

// Garis saluran skematis (koordinat siluet 200x400).
const UPPER: readonly (readonly [number, number])[] = [[100, 92], [100, 148], [89, 160]];
const SMALL: readonly (readonly [number, number])[] = [[80, 214], [122, 228], [78, 252], [122, 274]];
const COLON: readonly (readonly [number, number])[] = [[142, 288], [142, 206], [124, 190], [76, 190], [58, 206], [58, 288]];

const Dot: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly o?: number }> = ({ x, y, r, o = 1 }) => (
  <circle cx={x} cy={y} r={r} fill={toon.orange} stroke={INK} strokeWidth={r * 0.32} opacity={o} />
);

// ---------- L-16 Tidak merata ----------
const L16: React.FC<V> = ({ t }) => {
  const tTak = cue("l16", "Karena bakteri");
  const gather = ease(t, tTak, tTak + 2.2);
  const sx = 830;
  const sy = 180;
  const spread = Array.from({ length: 36 }, (_, i) => {
    const poly = i < 8 ? UPPER : i < 18 ? SMALL : COLON;
    const idx = i < 8 ? i : i < 18 ? i - 8 : i - 18;
    const n = i < 8 ? 8 : i < 18 ? 10 : 18;
    return { p: along(poly, idx, n), i, toColon: i >= 18 };
  });
  const colonSpots = Array.from({ length: 18 }, (_, i) => along(COLON, i, 18));
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <div style={{ position: "absolute", left: sx, top: sy }}>
        <BodySilhouette w={200 * 1.7} h={400 * 1.7} t={t} glow={0.2} tract="dim" uid="l16" />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`translate(${sx} ${sy}) scale(1.7)`}>
          {spread.map(({ p, i, toColon }) => {
            const tgt = toColon ? p : colonSpots[i % 18];
            const q = ease(t, tTak + (i % 9) * 0.1, tTak + 1.6 + (i % 9) * 0.1);
            const x = toColon ? p[0] : p[0] + (tgt[0] - p[0]) * q;
            const y = toColon ? p[1] : p[1] + (tgt[1] - p[1]) * q;
            const o = toColon ? 1 : 1 - 0.85 * q;
            return <Dot key={i} x={x + wig(t, 1.2, 3, i)} y={y + wig(t, 1.2, 2.6, i * 2)} r={5} o={appear(t, 0.2 + i * 0.03, 0.2) * (toColon ? 1 : o)} />;
          })}
        </g>
      </svg>
      <Big text={"TIDAK MERATA"} t={t} at={tTak + 0.2} y={380} cx={380} width={640} size={104} color={toon.orange} rot={-3} />
      <div style={{ position: "absolute", left: 1330, top: 420, opacity: gather }}>
        <Bacteria size={170} t={t} mood="laugh" />
      </div>
    </>
  );
};

// ---------- L-17 Bagian atas sepi ----------
const L17: React.FC<V> = ({ t }) => {
  const tAsam = cue("l17", "cairan asam");
  const tMakan = cue("l17", "Makanan juga");
  const slideP = ease(t, tMakan + 0.2, tMakan + 2.2);
  const away = ease(t, cue("l17", "Jadi bakteri"), cue("l17", "Jadi bakteri") + 1.8);
  // pipa dari atas ke "perut" miring seperti perosotan
  const pts = [[620, 270], [760, 330], [900, 560], [1060, 700], [1260, 780]];
  const fx = interpolate(slideP, [0, 0.35, 0.65, 1], [pts[0][0], pts[1][0], pts[3][0], pts[4][0]], clamp01);
  const fy = interpolate(slideP, [0, 0.35, 0.65, 1], [pts[0][1], pts[1][1], pts[3][1], pts[4][1]], clamp01);
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M560,240 C720,260 780,300 860,420 C940,540 1060,640 1360,760" fill="none" stroke={INK} strokeWidth={118} strokeLinecap="round" />
        <path d="M560,240 C720,260 780,300 860,420 C940,540 1060,640 1360,760" fill="none" stroke={toon.orangeLight} strokeWidth={96} strokeLinecap="round" />
        <path d="M560,240 C720,260 780,300 860,420 C940,540 1060,640 1360,760" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeDasharray="4 30" opacity={0.7} />
      </svg>
      <Place x={880} y={190} t={t} at={tAsam - 0.2} origin="50% 100%" dy={bob(t, 8, 2)}>
        <AcidCloud w={420} t={t} />
      </Place>
      {t > tMakan ? (
        <div style={{ position: "absolute", left: fx - 50, top: fy - 50, transform: `rotate(${slideP * 540}deg)`, opacity: appear(t, tMakan, 0.2) * (1 - ease(slideP, 0.95, 1)) }}>
          <svg width={100} height={100} viewBox="0 0 100 100">
            <circle cx={50} cy={54} r={36} fill="#E8584E" stroke={INK} strokeWidth={5} />
            <path d="M50,20 Q52,8 62,6" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            <path d="M52,18 Q66,14 70,24 Q60,30 52,18 Z" fill={toon.green} stroke={INK} strokeWidth={3.5} />
          </svg>
        </div>
      ) : null}
      {[0, 1, 2].map((i) => {
        const bx = 690 + i * 120 + away * (i % 2 ? 520 : -380) ;
        const by = 260 + i * 80 - away * 70 + wig(t, 5, 4, i);
        const vis = appear(t, tAsam + i * 0.25, 0.3) * (1 - ease(away, 0.6, 1));
        return (
          <div key={i} style={{ position: "absolute", left: bx, top: by, opacity: vis }}>
            <Bacteria size={96} t={t} phase={i} mood="worry" arms={{ r: 100 + 40 * Math.sin(t * 9 + i) }} />
          </div>
        );
      })}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: "absolute", left: 1480 + i * 20, top: 500 + i * 120, opacity: away }}>
          <Suitcase size={90} />
        </div>
      ))}
      <Big text={"SEPI"} t={t} at={cue("l17", "sulit tinggal") } y={620} cx={440} width={600} size={170} color={toon.blue} rot={-4} />
    </>
  );
};

// ---------- L-18 Berkumpul di usus besar ----------
const L18: React.FC<V> = ({ t }) => {
  const tBesar = cue("l18", "usus besar");
  const glow = ease(t, tBesar - 0.2, tBesar + 1.2);
  const bx = crowdPos(10, 5, 150, 120);
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <div style={{ position: "absolute", left: 330, top: 170 }}>
        <BodySilhouette w={300} h={600} t={t} glow={0.3} tract="focus" focus={glow} uid="l18" />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: glow }}>
        <path d="M640,520 L1020,420" stroke={toon.orange} strokeWidth={6} strokeDasharray="14 12" fill="none" />
        <circle cx={640} cy={520} r={10} fill={toon.orange} />
      </svg>
      <Card x={1000} y={240} w={800} h={500} bg="#FFE3B8" op={glow}>
        <svg width={800} height={500} viewBox="0 0 800 500" style={{ position: "absolute", inset: 0 }}>
          <path d="M110,430 L110,190 Q110,110 190,110 L610,110 Q690,110 690,190 L690,430" fill="none" stroke={INK} strokeWidth={90} strokeLinecap="round" opacity={0.9} />
          <path d="M110,430 L110,190 Q110,110 190,110 L610,110 Q690,110 690,190 L690,430" fill="none" stroke={toon.orange} strokeWidth={70} strokeLinecap="round" />
        </svg>
        {bx.map((c, i) => {
          const pos = i < 5 ? [100 + c.x * 0.9 + (i % 2) * 40, 62 + (i % 2) * 8] : [80 + (i - 5) * 0 + (i % 2) * 560, 180 + (i % 3) * 70];
          const px = i < 5 ? 120 + i * 120 : i % 2 ? 640 : 70;
          const py = i < 5 ? 40 + (i % 2) * 14 : 170 + ((i - 5) % 3) * 90;
          void pos;
          return (
            <div key={i} style={{ position: "absolute", left: px, top: py, transform: `scale(${pop(t, tBesar + 0.3 + i * 0.12, 0.4)})` }}>
              <Bacteria size={110} t={t} phase={i} mood="laugh" arms={i % 3 === 0 ? { r: 150 + 15 * Math.sin(t * 6 + i) } : undefined} />
            </div>
          );
        })}
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", left: 250 + i * 230, top: 290, opacity: appear(t, tBesar + 1.4 + i * 0.3, 0.2) }}>
            <Chair size={90} />
          </div>
        ))}
      </Card>
      <Big text="USUS BESAR" t={t} at={tBesar} y={790} cx={1400} width={900} size={96} color={toon.orange} />
    </>
  );
};

// ---------- L-19 Kembali ke stadion (3D) ----------
const L19: React.FC<V> = ({ t }) => {
  const fill = ease(t, 0.8, 3.2);
  const pose: StadiumPose = { tilt: -0.55 + 0.12 * ease(t, 0, 7), scale: 0.82 + 0.05 * ease(t, 0, 7), x: 960, y: 535, yaw: 0.05 * Math.sin(t * 0.6) };
  return (
    <>
      <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <Stage3D>
        <Stadium3D state={{ fill, mode: "one" }} pose={pose} />
      </Stage3D>
      <Big text="SATU TRIBUN" t={t} at={cue("l19", "satu tribun")} y={800} size={120} color={toon.orange} width={1200} />
    </>
  );
};

// ---------- L-20 Ruangnya lebih kecil ----------
const L20: React.FC<V> = ({ t }) => {
  const tKecil = cue("l20", "lebih kecil");
  const shrink = ease(t, tKecil + 0.1, tKecil + 1.6);
  const w = 760 - 340 * shrink;
  const h = 520 - 230 * shrink;
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <div style={{ position: "absolute", left: 960 - w / 2 - 0, top: 250 + (520 - h) / 2, width: w, height: h, background: "#fff", border: `7px dashed ${INK}`, borderRadius: 38, opacity: 0.85 - 0.45 * shrink, boxSizing: "border-box", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ marginTop: -62, fontFamily: toonFont(), fontWeight: 700, fontSize: 44, color: INK, opacity: 0.8 * (1 - shrink), background: toon.bg, padding: "0 20px", borderRadius: 20 }}>dugaan lama</div>
      </div>
      <Card x={960 - 190} y={380} w={380} h={290} bg="#FFE3B8" op={appear(t, 0.5, 0.4)}>
        <div style={{ position: "absolute", top: -70, width: "100%", textAlign: "center", fontFamily: toonFont(), fontWeight: 700, fontSize: 44, color: toon.orangeDark }}>hitungan baru</div>
        <div style={{ position: "absolute", left: 40, top: 100, opacity: appear(t, 1.2, 0.3) }}>
          <Bacteria size={120} t={t} mood="happy" />
        </div>
        <div style={{ position: "absolute", left: 200, top: 120, opacity: appear(t, 1.4, 0.3) }}>
          <Bacteria size={110} t={t} phase={1} mood="laugh" />
        </div>
      </Card>
      <Big text="LEBIH KECIL" t={t} at={tKecil} y={770} size={120} color={toon.blue} width={1200} />
    </>
  );
};

// ---------- L-21 Rekap bab 4 ----------
const L21: React.FC<V> = ({ t }) => {
  const x1 = ease(t, 0.9, 1.5);
  const x2 = ease(t, 1.4, 2.0);
  const tStamp = cue("l21", "kebesaran");
  const sx = 740;
  const sy = 190;
  return (
    <>
      <div style={{ position: "absolute", left: 210, top: 190 }}>
        <Board w={1500} h={640} />
      </div>
      <Place x={300} y={250} t={t} at={0.3}>
        <Pinned x={0} y={0} w={380} h={520} rot={-2}>
          <div style={{ position: "absolute", left: 80, top: 36 }}>
            <BodySilhouette w={200} h={420} t={t} glow={0.1} tract="dim" uid="l21" />
          </div>
          <RedX x={105} y={200} size={90} p={x1} />
          <RedX x={105} y={290} size={90} p={x2} />
        </Pinned>
      </Place>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Str x1={600} y1={440} x2={sx + 190} y2={sy + 320} p={ease(t, 0.5, 1.2)} />
      </svg>
      <div style={{ position: "absolute", left: sx + 130, top: sy + 140, transform: "translateX(0)" }}>
        <Stamp text="KEBESARAN" t={t} at={tStamp + 0.3} size={110} rot={-8} />
      </div>
      <Place x={1520} y={420} t={t} at={0.3}>
        <Det x={0} y={0} size={260} t={t} mood="happy" flip hand={[128, 150]} />
      </Place>
    </>
  );
};

// ---------- L-22 Pertanyaan untukmu (jeda 2 detik) ----------
const L22: React.FC<V> = ({ t }) => {
  const tEnd = clipEnd("l22", "l22_02");
  const ring = ease(t, tEnd + 0.1, tEnd + 2.1);
  return (
    <>
      <Stage3D>
        <Toy kind="bact" size={300} left={320} top={420} t={t} at={0.3} mood="laugh" arms={{ l: 150 + 25 * Math.sin(t * 7) }} yaw={14} {...hopMotion(t, 8, 3, 0, 0.9)} />
        <Toy kind="cell" size={260} left={1340} top={440} t={t} at={0.4} mood="laugh" arms={{ r: 150 + 25 * Math.sin(t * 7 + 1) }} yaw={-14} {...hopMotion(t, 8, 3, 2, 1.0)} />
      </Stage3D>
      <Place x={825} y={190} t={t} at={1.0} rot={wig(t, 8, 3)} origin="50% 50%">
        <QOrb size={270} t={t} />
      </Place>
      <Big text={"Menurutmu, mana\nyang lebih banyak?"} t={t} at={cue("l22", "Menurutmu")} y={600} size={78} color={toon.blue} width={1500} />
      {t > tEnd + 0.1 ? (
        <div style={{ position: "absolute", left: 960 - 80, top: 800, opacity: appear(t, tEnd + 0.1, 0.2) * (1 - appear(t, tEnd + 2.1, 0.3)) }}>
          <CountRing size={160} p={ring} />
        </div>
      ) : null}
    </>
  );
};

// ---------- L-23 Menghitung ulang ----------
const L23: React.FC<V> = ({ t }) => {
  const tPria = cue("l23", "pria dewasa");
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <div style={{ position: "absolute", left: 260, top: 190 }}>
        <Whiteboard w={1400} h={640}>
          <svg width={1380} height={620} viewBox="0 0 1380 620" style={{ position: "absolute", inset: 0 }}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={80} y1={90 + i * 40} x2={80 + 220 * ease(t, 0.6 + i * 0.5, 1.2 + i * 0.5)} y2={90 + i * 40} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.75} />
            ))}
            {[0, 1, 2].map((i) => (
              <line key={i} x1={1080} y1={90 + i * 40} x2={1080 + 200 * ease(t, 1 + i * 0.5, 1.6 + i * 0.5)} y2={90 + i * 40} stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.75} />
            ))}
          </svg>
          <div style={{ position: "absolute", left: 540, top: 70 }}>
            <BodySilhouette w={280} h={520} t={t} glow={0.5} uid="l23" />
          </div>
        </Whiteboard>
      </div>
      <Pill text="Pria dewasa rata-rata" cx={960} y={800} t={t} at={tPria - 0.2} bg={toon.orange} size={44} />
      <Place x={90} y={420} t={t} at={0.4} dy={bob(t, 4, 2.4)}>
        <Det x={0} y={0} size={300} t={t} mood="think" bare hand={[128, 120]} />
      </Place>
      <Place x={1590} y={420} t={t} at={0.7} dy={bob(t, 4, 2.4, 1)}>
        <Det x={0} y={0} size={300} t={t} mood="happy" bare flip hand={[128, 150]} phase={1} />
      </Place>
      <div style={{ position: "absolute", left: 340, top: 660 }}>
        <Compass size={110} t={t} />
      </div>
      <div style={{ position: "absolute", left: 1350, top: 700 }}>
        <Ruler w={230} />
      </div>
    </>
  );
};

// ---------- L-24 / L-25 Kerumunan ----------
const Crowd: React.FC<{ readonly t: number; readonly kind: "bact" | "cell"; readonly at: number }> = ({ t, kind, at }) => {
  const cols = 12;
  const rows = 6;
  const items = Array.from({ length: cols * rows }, (_, i) => ({ c: i % cols, r: Math.floor(i / cols), i }));
  const kinds = ["plain", "red", "muscle", "skin"] as const;
  return (
    <>
      {items.map(({ c, r, i }) => {
        const x = 70 + c * 150 + (r % 2) * 40;
        const y = 185 + r * 118 + 5 * Math.sin(t * 3 + i);
        const delay = at + ((i * 7) % 54) * 0.03;
        const p = pop(t, delay, 0.4);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${p})`, opacity: 0.95 }}>
            {kind === "bact" ? <Bacteria size={110} t={t} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} /> : <BodyCell kind={kinds[(i * 5 + r) % 4]} size={100} t={t} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} />}
          </div>
        );
      })}
    </>
  );
};
const NumBanner: React.FC<{ readonly text: string; readonly t: number; readonly at: number; readonly sub: string }> = ({ text, t, at, sub }) => (
  <div style={{ position: "absolute", left: 960 - 560, top: 300, width: 1120, height: 330, background: "#FFFBF0", border: `9px solid ${INK}`, borderRadius: 50, boxShadow: `0 14px 0 ${INK}`, transform: `scale(${pop(t, at, 0.5)})`, opacity: appear(t, at, 0.1), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 150, lineHeight: 1, color: toon.orange, WebkitTextStroke: `9px ${INK}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${INK}`, letterSpacing: 2 }}>{text}</div>
    <div style={{ fontFamily: toonFont(), fontWeight: 600, fontSize: 48, color: INK, marginTop: 6 }}>{sub}</div>
  </div>
);
const L24: React.FC<V> = ({ t }) => {
  const tn = cue("l24", "sekitar 38");
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <Crowd t={t} kind="bact" at={0.4} />
      <NumBanner text="~38 TRILIUN" t={t} at={tn + 0.5} sub="bakteri" />
      <Sparkle x={380} y={260} t={t} size={70} />
      <Sparkle x={1500} y={620} t={t} size={80} phase={2} />
    </>
  );
};
const L25: React.FC<V> = ({ t }) => {
  const tn = cue("l25", "sekitar 30");
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <Crowd t={t} kind="cell" at={cue("l25", "Semuanya")} />
      <NumBanner text="~30 TRILIUN" t={t} at={tn + 0.5} sub="sel manusia" />
    </>
  );
};

// ---------- L-26 Hampir sama banyak (timbangan 3D) ----------
const L26: React.FC<V> = ({ t }) => {
  const lockStart = 0.9;
  const lockDur = 0.5;
  const pivot: [number, number] = [960, 385];
  const pose = scalePose(scaleAngle(t, -17, lockStart, lockDur), pivot, 400, 215, 160);
  const spots: readonly (readonly [number, number])[] = [[-72, 48], [72, 48], [0, -52]];
  const onPan = (center: readonly [number, number], kind: "bact" | "cell", size: number, k: number, atT: number) => {
    const [ox, oz] = spots[k];
    const sp = panSpot(center, ox, oz);
    const stand = standAt(kind, size, sp.x, sp.y);
    const h = hopMotion(t, 4, 3.4, k + (kind === "cell" ? 1.3 : 0), 1.4);
    return <Toy key={`${kind}${k}`} kind={kind} size={size} left={stand.left} top={stand.top + h.dy} z={sp.z} squash={h.squash} t={t} at={atT} phase={k} mood="laugh" yaw={kind === "bact" ? 12 : -12} shadow={false} popDur={0.4} />;
  };
  const balanced = appear(t, lockStart + lockDur - 0.05, 0.15);
  return (
    <>
      <Big text="HAMPIR SAMA BANYAK" t={t} at={cue("l26", "Hampir sama")} y={115} size={96} color={toon.orange} width={1500} />
      <Stage3D>
        <Scale3D pose={pose} vis={pop(t, 0.05, 0.5)} floorY={850} shadowsL={spots} shadowsR={spots} shadowW={96} />
        {[0, 1, 2].map((k) => onPan(pose.left, "bact", 112, k, 0.05 + k * 0.06))}
        {[0, 1, 2].map((k) => onPan(pose.right, "cell", 104, k, 0.1 + k * 0.06))}
      </Stage3D>
      <div style={{ opacity: balanced }}>
        <Sparkle x={420} y={260} t={t} size={70} />
        <Sparkle x={1440} y={250} t={t} size={80} phase={2} />
      </div>
    </>
  );
};

// ---------- L-27 Tarik tambang (3D) ----------
const L27: React.FC<V> = ({ t }) => {
  const strike = cue("l27", "Bukan sepuluh");
  const sk = slide(t, strike + 0.1, 0.45);
  const sk2 = slide(t, strike + 0.4, 0.4);
  const swayR = 4 * Math.sin(t * 3.1);
  const ropeBase = 640;
  const ropeY = (x: number) => ropeBase + 14 * (1 - ((x - 960) / 960) ** 2) + swayR;
  const ropeZ = 62;
  const pull = 5 * Math.sin(t * 2.4);
  const teamB = [0, 1, 2].map((i) => ({ cx: 330 + i * 190, i }));
  const teamC = [0, 1, 2].map((i) => ({ cx: 1590 - i * 190, i }));
  const grip = { ropeY, z: ropeZ, span: 0.5 };
  return (
    <>
      <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 705, height: 120, background: toon.green, borderTop: `7px solid ${INK}`, borderBottom: `7px solid ${INK}` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={960} y1={560} x2={960} y2={760} stroke={INK} strokeWidth={6} strokeDasharray="12 10" opacity={0.55} />
      </svg>
      <Stage3D>
        <Rope3D y={ropeY} x0={-40} x1={1960} z={() => ropeZ} r={6} sig={`${Math.round(swayR * 20)}`} />
        <Flag3D x={960 - pull} y={ropeY(960)} z={ropeZ} lift={90} />
        {teamB.map(({ cx, i }) => {
          const size = 168;
          const rot = -(27 + 3 * Math.sin(t * 2.4 + i * 1.3));
          return <Toy key={`b${i}`} kind="bact" size={size} left={cx - size / 2 - pull} top={topForRope("bact", size, ropeY(cx))} t={t} at={0.3 + i * 0.12} phase={i} mood="laugh" yaw={14} rot={rot} squash={0.04 + 0.025 * Math.sin(t * 5.2 + i)} faceUp={0.28} grip={grip} shadowW={1.05} />;
        })}
        {teamC.map(({ cx, i }) => {
          const size = 160;
          const rot = 29 + 3 * Math.sin(t * 2.4 + i * 1.3 + 1);
          return <Toy key={`c${i}`} kind="cell" size={size} left={cx - size / 2 - pull} top={topForRope("cell", size, ropeY(cx))} t={t} at={0.4 + i * 0.12} phase={i + 1} mood="laugh" yaw={-14} rot={rot} squash={0.04 + 0.025 * Math.sin(t * 5.2 + i + 1)} faceUp={0.28} grip={grip} shadowW={1.05} />;
        })}
      </Stage3D>
      <Big text="SERU!" t={t} at={cue("l27", "seimbang")} y={170} size={120} color={toon.blue} width={600} rot={-5} cx={960} />
      {t > strike ? (
        <>
          <Big text="10 : 1" t={t} at={strike - 0.1} y={250} size={260} color={toon.orange} width={900} />
          <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 510, top: 200 }}>
            <path d="M120,120 L780,330" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - sk)} fill="none" />
            <path d="M120,120 L780,330" stroke={toon.red} strokeWidth={30} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - sk)} fill="none" />
            <path d="M780,110 L130,340" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - sk2)} fill="none" />
            <path d="M780,110 L130,340" stroke={toon.red} strokeWidth={30} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={800 * (1 - sk2)} fill="none" />
          </svg>
        </>
      ) : null}
    </>
  );
};

// ---------- L-28 Awas kata hampir ----------
const L28: React.FC<V> = ({ t }) => {
  const tHampir = cue("l28", "Perhatikan");
  const ring = ease(t, tHampir + 0.3, tHampir + 1.1);
  const tSkor = cue("l28", "bukan skor");
  const x1 = ease(t, tSkor + 0.2, tSkor + 0.7);
  const x2 = ease(t, tSkor + 0.5, tSkor + 1.0);
  return (
    <>
      <Sh t={t} to={tSkor - 0.2}>
        {() => (
          <>
            <Big text="HAMPIR" t={t} at={tHampir - 0.5} y={330} size={260} color={toon.blue} width={1400} />
            <svg width={1400} height={420} viewBox="0 0 1400 420" style={{ position: "absolute", left: 260, top: 250 }}>
              <ellipse cx={700} cy={210} rx={640} ry={170} fill="none" stroke={INK} strokeWidth={26} strokeDasharray={3600} strokeDashoffset={3600 * (1 - ring)} transform="rotate(-3 700 210)" />
              <ellipse cx={700} cy={210} rx={640} ry={170} fill="none" stroke={toon.orange} strokeWidth={14} strokeDasharray={3600} strokeDashoffset={3600 * (1 - ring)} transform="rotate(-3 700 210)" />
            </svg>
          </>
        )}
      </Sh>
      <Sh t={t} from={tSkor - 0.3}>
        {() => (
          <>
            <Place x={570} y={250} t={t} at={tSkor - 0.2} origin="50% 50%">
              <ScoreBoardX w={780} />
            </Place>
            <Strike x={560} y={250} w={800} h={400} p={x1} q={x2} />
            <Pill text="PERKIRAAN" cx={960} y={720} t={t} at={tSkor + 1.0} bg={toon.orange} size={78} />
          </>
        )}
      </Sh>
    </>
  );
};
const ScoreBoardX: React.FC<{ readonly w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.5, background: "#2B2D42", border: `8px solid ${INK}`, borderRadius: 26, boxShadow: `0 10px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 6%", boxSizing: "border-box" }}>
    <div style={{ width: w * 0.12, height: w * 0.12, borderRadius: 14, background: toon.orange, border: `5px solid #fff` }} />
    <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: w * 0.2, color: "#fff", letterSpacing: 6 }}>SKOR</div>
    <div style={{ width: w * 0.12, height: w * 0.12, borderRadius: 14, background: toon.blue, border: `5px solid #fff` }} />
  </div>
);

// ---------- L-29 Rekap bab 5 ----------
const L29: React.FC<V> = ({ t }) => {
  const ang = 1.2 * Math.sin(t * 1.8) * Math.exp(-0.5 * t);
  return (
    <>
      <Big text="HAMPIR SAMA BANYAK" t={t} at={0.3} y={115} size={96} color={toon.orange} width={1500} />
      <Place x={430} y={230} t={t} at={0.2} origin="50% 100%">
        <TeamScale w={820} angle={ang} t={t} nb={6} nc={5} />
      </Place>
      <Place x={1380} y={380} t={t} at={0.6} dy={bob(t, 4, 2.4)}>
        <Det x={0} y={0} size={330} t={t} mood="laugh" flip hand={[140, 50 + 8 * Math.sin(t * 7)]} />
      </Place>
      <Sparkle x={380} y={250} t={t} size={64} />
    </>
  );
};

export const BAB4_5: Record<string, React.FC<V>> = { l16: L16, l17: L17, l18: L18, l19: L19, l20: L20, l21: L21, l22: L22, l23: L23, l24: L24, l25: L25, l26: L26, l27: L27, l28: L28, l29: L29 };

export const SFX4_5: Record<string, readonly Cue[]> = {
  l16: [[cue("l16", "Karena bakteri"), "shrink", 0.6]],
  l17: [[cue("l17", "cairan asam"), "hmm", 0.4], [cue("l17", "Makanan juga") + 0.2, "whoosh", 0.5]],
  l18: [[cue("l18", "usus besar"), "shimmer", 0.5], [cue("l18", "usus besar") + 0.4, "pop", 0.5]],
  l19: [[0.8, "crowd", 0.4]],
  l20: [[cue("l20", "lebih kecil"), "shrink", 0.6]],
  l21: [[0.9, "pencil", 0.4], [1.4, "pencil", 0.4], [cue("l21", "kebesaran") + 0.3, "strike", 0.8]],
  l22: [[0.3, "pop", 0.5], [clipEnd("l22", "l22_02") + 0.1, "count", 0.4]],
  l23: [[0.6, "pencil", 0.3], [1.1, "tick", 0.3]],
  l24: [[cue("l24", "sekitar 38") + 0.5, "ding", 0.8]],
  l25: [[cue("l25", "sekitar 30") + 0.5, "ding", 0.8]],
  l26: [[0.15, "scale", 0.5], [1.9, "tingtong", 0.8]],
  l27: [[0.4, "crowd", 0.15], [cue("l27", "Bukan sepuluh") + 0.1, "strike", 0.8]],
  l28: [[cue("l28", "Perhatikan") + 0.3, "ding", 0.5], [cue("l28", "bukan skor") + 0.2, "strike", 0.5]],
  l29: [[0.3, "tingtong", 0.4]],
};
void SmallText;
void Cell;
void Person;
