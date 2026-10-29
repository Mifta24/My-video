import type React from "react";
import { interpolate } from "remotion";
import type { Cue } from "../elements/Sound";
import { appear, bob, Place, pop, Sh, Sparkle, toonFont } from "../elements/ToonKit";
import { Bacteria, BodySilhouette, Cell } from "../shorts/characters";
import { toon } from "../theme";
import { cue } from "../timing";
import { Paper } from "../shorts/visuals";
import { Basketball, Big, Board, BodyCell, Card, Det, INK, lensCenter, Marble, Note, Person, Pill, Pinned, QOrb, Sack, Str, TeamScale, wig, type CellKindX } from "./kit";

type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp01, easing: (x) => x * x * (3 - 2 * x) });

const KINDS: readonly CellKindX[] = ["red", "nuc", "red", "skin", "red", "muscle", "red", "nuc", "red", "fat", "red", "skin"];

// ---------- L-30 Catatan menarik: sel berpusat kendali ----------
const L30: React.FC<V> = ({ t }) => {
  const tSek = cue("l30", "Sekarang coba");
  const focus = ease(t, tSek + 0.3, tSek + 1.4);
  const cells = Array.from({ length: 36 }, (_, i) => ({ c: i % 12, r: Math.floor(i / 12), i }));
  const target = cells.find((c) => c.r === 2 && KINDS[(c.i + c.r * 5) % 12] === "nuc") ?? cells[25];
  const tx = 150 + target.c * 135 + (target.r % 2) * 30 + 50;
  const ty = 235 + target.r * 150 + 112;
  return (
    <>
      <Note text="CATATAN MENARIK" t={t} at={0.2} />
      {cells.map(({ c, r, i }) => {
        const kind = KINDS[(i + r * 5) % 12];
        const isNuc = kind === "nuc";
        return (
          <div key={i} style={{ position: "absolute", left: 150 + c * 135 + (r % 2) * 30, top: 235 + r * 150 + 4 * Math.sin(t * 3 + i), transform: `scale(${pop(t, 0.3 + c * 0.05 + r * 0.1, 0.4)})` }}>
            <BodyCell kind={kind} size={100} t={t} phase={i} mood={isNuc ? "laugh" : "happy"} glow={isNuc ? focus * (0.7 + 0.3 * Math.sin(t * 5)) : 0} dim={isNuc ? 0 : focus * 0.7} />
          </div>
        );
      })}
      {t > tSek + 0.6 ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M${tx},${ty} L${tx},${ty + 30}`} stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={appear(t, tSek + 0.6, 0.2)} />
          </svg>
          <Pill text="pusat kendali" cx={tx} y={ty + 30} t={t} at={tSek + 0.6} bg={toon.orange} size={40} />
        </>
      ) : null}
      <Big text="PUNYA PUSAT KENDALI" t={t} at={tSek + 0.2} y={760} size={92} color={toon.blue} width={1600} />
    </>
  );
};

// ---------- L-31 Sepuluh banding satu muncul (catatan, bukan penyebab) ----------
const L31: React.FC<V> = ({ t }) => {
  const tBukan = cue("l31", "Ini bukan");
  const ang = -14 * ease(t, 0.8, 2.0) + 0.8 * Math.sin(t * 2.2) * ease(t, 2, 3);
  return (
    <>
      <Note text="CATATAN MENARIK" t={t} at={0.2} />
      <Place x={150} y={210} t={t} at={0.3} origin="50% 100%">
        <TeamScale w={780} angle={ang} t={t} nb={9} nc={1} cellNuc />
      </Place>
      {[0, 1, 2, 3].map((i) => (
        <div key={`n${i}`} style={{ position: "absolute", left: 1040 + i * 165, top: 250 + 5 * Math.sin(t * 3 + i), transform: `scale(${pop(t, 0.5 + i * 0.15, 0.4)})` }}>
          <BodyCell kind="nuc" size={120} t={t} phase={i} mood="laugh" glow={0.8} />
        </div>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={`d${i}`} style={{ position: "absolute", left: 1060 + (i % 4) * 165, top: 450 + Math.floor(i / 4) * 130, transform: `scale(${pop(t, 0.9 + i * 0.07, 0.4)})` }}>
          <BodyCell kind="red" size={100} t={t} phase={i + 3} dim={0.7} />
        </div>
      ))}
      <Pill text="BUKAN PENYEBAB MITOS" cx={960} y={800} t={t} at={tBukan} bg={toon.red} size={44} />
    </>
  );
};

// ---------- L-32 Kenapa bisa beda ----------
const L32: React.FC<V> = ({ t }) => {
  const tContoh = cue("l32", "Contohnya");
  const nucIdx = new Set([7, 22, 34]);
  return (
    <>
      <Note text="CATATAN MENARIK" t={t} at={0.2} />
      {Array.from({ length: 40 }, (_, i) => {
        const c = i % 10;
        const r = Math.floor(i / 10);
        const isNuc = nucIdx.has(i);
        return (
          <div key={i} style={{ position: "absolute", left: 205 + c * 150 + (r % 2) * 35, top: 215 + r * 135 + 4 * Math.sin(t * 3 + i), transform: `scale(${pop(t, 0.3 + ((i * 7) % 40) * 0.03, 0.4)})` }}>
            <BodyCell kind={isNuc ? "nuc" : "red"} size={110} t={t} phase={i} mood={isNuc ? "laugh" : "happy"} glow={isNuc ? 0.6 + 0.4 * Math.sin(t * 4 + i) : 0} />
          </div>
        );
      })}
      <Pill text="sel darah merah" cx={960} y={790} t={t} at={tContoh} bg={toon.red} size={52} />
    </>
  );
};

// ---------- L-33 Perumpamaan kelereng ----------
const L33: React.FC<V> = ({ t }) => {
  const tKel = cue("l33", "Kelereng banyak");
  const tBola = cue("l33", "Bola basket cuma");
  const tSel = cue("l33", "Sel darah merah itu");
  const colors = [toon.blue, toon.orange, toon.red, toon.green, toon.yellow];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 100 }} />
      <LblAnalogi t={t} />
      <Place x={290} y={200} t={t} at={0.3} dy={bob(t, 3, 2.4)}>
        <Sack w={380} />
      </Place>
      {Array.from({ length: 44 }, (_, i) => {
        const row = Math.floor(i / 11);
        return (
          <div key={i} style={{ position: "absolute", left: 215 + (i % 11) * 56 + (row % 2) * 28 + wig(t, 3, 2.4, i), top: 540 + row * 46 + wig(t, 2, 3, i * 2), transform: `scale(${pop(t, tKel + i * 0.04, 0.35)}) rotate(${(t - tKel) * 40 * (i % 2 ? 1 : -1)}deg)` }}>
            <Marble size={46} color={colors[i % 5]} />
          </div>
        );
      })}
      <Place x={1090} y={200} t={t} at={tBola} dy={bob(t, 6, 2.2)}>
        <Basketball size={380} rot={(t - tBola) * 20} />
      </Place>
      <Place x={330} y={745} t={t} at={tSel} dy={bob(t, 4, 3)}>
        <BodyCell kind="red" size={90} t={t} mood="laugh" />
      </Place>
      <Pill text="sel darah merah" cx={560} y={760} t={t} at={tSel + 0.1} bg={toon.red} size={38} />
      <Place x={1160} y={600} t={t} at={tSel + 0.6} dy={bob(t, 4, 2.6, 1)}>
        <BodyCell kind="fat" size={190} t={t} mood="happy" phase={2} />
      </Place>
      <Pill text="sel lemak" cx={1290} y={790} t={t} at={tSel + 0.7} bg={toon.orangeDark} size={38} />
    </>
  );
};
import { Lbl } from "./kit";
const LblAnalogi: React.FC<V> = ({ t }) => <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />;

// ---------- L-34 Rekap bab 6 ----------
const L34: React.FC<V> = ({ t }) => (
  <>
    <Big text="HITUNG SEMUANYA" t={t} at={cue("l34", "Karena itu")} y={125} size={110} color={toon.orange} width={1500} />
    <Place x={250} y={280} t={t} at={0.2} origin="50% 100%">
      <TeamScale w={740} angle={1.2 * Math.sin(t * 1.8)} t={t} nb={6} nc={5} />
    </Place>
    <Place x={1280} y={380} t={t} at={0.6} dy={bob(t, 4, 2.4)}>
      <Det x={0} y={0} size={380} t={t} mood="happy" flip hand={[140, 50 + 8 * Math.sin(t * 7)]} />
    </Place>
    <Sparkle x={1180} y={300} t={t} size={60} />
  </>
);

// ---------- L-35 Bagian jujur: perkiraan ----------
const L35: React.FC<V> = ({ t }) => {
  const tHasil = cue("l35", "Hasil tadi");
  const fog = 0.6 + 0.5 * Math.sin(t * 2) + 0.9 * ease(t, tHasil, tHasil + 1.2);
  const fogText = (txt: string, left: number, color: string, ph: number) => (
    <div style={{ position: "absolute", left, top: 470, width: 560, textAlign: "center", fontFamily: toonFont(), fontWeight: 700, fontSize: 86, color, WebkitTextStroke: `6px ${INK}`, paintOrder: "stroke fill", filter: `blur(${fog}px)`, opacity: (0.72 + 0.2 * Math.sin(t * 2.2 + ph)) * appear(t, 0.5, 0.4), transform: `translateY(${wig(t, 8, 1.6, ph)}px)` }}>
      {txt}
    </div>
  );
  return (
    <>
      <Big text="PERKIRAAN" t={t} at={tHasil - 0.3} y={115} size={140} color={toon.blue} width={1300} />
      <Place x={640} y={300} t={t} at={0.2} origin="50% 100%">
        <TeamScale w={640} angle={1.6 * Math.sin(t * 2.4)} t={t} nb={6} nc={5} />
      </Place>
      {fogText("38 triliun", 70, toon.orange, 0)}
      {fogText("30 triliun", 1290, toon.blue, 2)}
      <Sparkle x={560} y={300} t={t} size={54} phase={1} />
    </>
  );
};

// ---------- L-36 Tiap orang beda ----------
const Belly: React.FC<{ readonly size: number; readonly op: number; readonly t: number; readonly ph: number }> = ({ size, op, t, ph }) => (
  <div style={{ position: "absolute", left: size * 0.5 - size * 0.2, top: size * 1.15 * 0.84 - size * 0.12, width: size * 0.4, height: size * 0.26, borderRadius: "50%", background: `radial-gradient(ellipse, ${toon.orange} 0%, rgba(255,150,60,0.0) 72%)`, opacity: op * (0.85 + 0.15 * Math.sin(t * 4 + ph)) }} />
);
const L36: React.FC<V> = ({ t }) => {
  const tOrang = cue("l36", "Orang lain");
  const people: readonly { readonly who: "guru" | "remaja" | "kakek"; readonly size: number; readonly cx: number; readonly op: number; readonly shirt: string; readonly at: number }[] = [
    { who: "guru", size: 400, cx: 520, op: 0.95, shirt: toon.blue, at: 0.3 },
    { who: "remaja", size: 300, cx: 960, op: 0.45, shirt: toon.orange, at: tOrang + 0.1 },
    { who: "kakek", size: 350, cx: 1400, op: 0.75, shirt: toon.green, at: tOrang + 0.5 },
  ];
  return (
    <>
      <Big text="TIAP ORANG BEDA" t={t} at={cue("l36", "Setiap orang")} y={120} size={100} color={toon.orange} width={1500} />
      {people.map((p, i) => (
        <Place key={p.who} x={p.cx - p.size / 2} y={800 - p.size * 1.15} t={t} at={p.at} dy={bob(t, 4, 2.4, i)}>
          <div style={{ position: "relative" }}>
            <Person size={p.size} who={p.who} t={t} phase={i} shirt={p.shirt} mood={i === 1 ? "laugh" : "happy"} />
            <Belly size={p.size} op={p.op} t={t} ph={i} />
          </div>
        </Place>
      ))}
      <Pill text="pria dewasa rata-rata" cx={520} y={835} t={t} at={0.7} bg={toon.blue} size={40} />
    </>
  );
};

// ---------- L-37 Perempuan dan anak ----------
const L37: React.FC<V> = ({ t }) => {
  const tPer = cue("l37", "memperkirakan");
  const tAnak = cue("l37", "Untuk anak");
  return (
    <>
      <Place x={360 - 115} y={820 - 460} t={t} at={0.3} dy={bob(t, 4, 2.4)}>
        <BodySilhouette w={230} h={460} t={t} glow={0.6} uid="l37m" />
      </Place>
      <Place x={880 - 105} y={820 - 420} t={t} at={tPer - 0.2} dy={bob(t, 4, 2.4, 1)}>
        <BodySilhouette w={210} h={420} t={t} glow={0.5} fill="#FFD9B8" uid="l37w" />
      </Place>
      <Place x={1380 - 70} y={820 - 280} t={t} at={tAnak - 0.2} dy={bob(t, 4, 2.4, 2)}>
        <BodySilhouette w={140} h={280} t={t} glow={0.4} fill="#D4F0D0" uid="l37c" />
      </Place>
      <Pill text="PERKIRAAN" cx={880} y={270} t={t} at={tPer} bg={toon.orange} size={52} />
      <Pill text="DATA MASIH KURANG" cx={1380} y={250} t={t} at={tAnak} bg={toon.blue} size={46} />
      <Place x={1315} y={360} t={t} at={tAnak + 0.4} rot={wig(t, 8, 3)} origin="50% 50%">
        <QOrb size={150} t={t} />
      </Place>
    </>
  );
};

// ---------- L-38 Satu dugaan ----------
const L38: React.FC<V> = ({ t }) => {
  const tMengira = cue("l38", "Mereka mengira");
  const tDugaan = cue("l38", "Dugaan ini");
  const [lx, ly] = lensCenter(190, 215, 400, [128, 150], 105, 40);
  const U = "M110,430 L110,190 Q110,110 190,110 L610,110 Q690,110 690,190 L690,430";
  const arrow = ease(t, tMengira, tMengira + 1);
  return (
    <>
      <div style={{ position: "absolute", left: lx - 39, top: ly - 42, opacity: appear(t, 0.5, 0.3) }}>
        <svg width={170} height={85} viewBox="0 0 200 100" style={{ overflow: "visible" }}>
          <path d="M70,50 L190,44" stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d="M70,50 L190,44" stroke={toon.blueLight} strokeWidth={6} strokeLinecap="round" />
          <ellipse cx={46} cy={50} rx={40} ry={32} fill="#fff" stroke={INK} strokeWidth={5} />
          {[[32, 44], [50, 38], [48, 58], [30, 58], [60, 52]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={5.5} fill={toon.orange} stroke={INK} strokeWidth={2} />
          ))}
        </svg>
      </div>
      <Place x={150} y={260} t={t} at={0.2} dy={bob(t, 3, 2.4)}>
        <div />
      </Place>
      <Det x={190} y={215} size={400} t={t} mood="think" hand={[128, 150]} lens={105} lensRot={40} />
      <Big text="?" t={t} at={tDugaan - 0.2} y={110} cx={lx} size={190} width={300} color={toon.orange} rot={wig(t, 6, 3)} />
      <Card x={990} y={280} w={760} h={430} bg="#FFE3B8" op={appear(t, tMengira - 0.3, 0.4)}>
        <svg width={760} height={430} viewBox="0 0 800 500" style={{ position: "absolute", inset: 0 }}>
          <path d={U} fill="none" stroke={INK} strokeWidth={90} strokeLinecap="round" />
          <path d={U} fill="none" stroke={toon.orange} strokeWidth={70} strokeLinecap="round" />
        </svg>
      </Card>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${lx + 125},${ly} L${lx + 125 + (990 - lx - 150) * arrow},${ly - 30 * arrow}`} stroke={INK} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" fill="none" />
      </svg>
      <Big text="PERLU DITELITI" t={t} at={tDugaan} y={745} size={92} color={toon.blue} width={1500} />
    </>
  );
};

// ---------- L-39 Rekap bab 7 ----------
const Note2: React.FC<{ readonly text: string; readonly color: string }> = ({ text, color }) => (
  <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 62, color, textAlign: "center", lineHeight: 1.1 }}>{text}</div>
);
const L39: React.FC<V> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 500, top: 190 }}>
      <Board w={1300} h={620} />
    </div>
    <Place x={600} y={320} t={t} at={0.6} rot={-3}>
      <Pinned x={0} y={0} w={520} h={260} rot={-3} bg="#FFF3D6">
        <Note2 text="PERKIRAAN" color={toon.orangeDark} />
      </Pinned>
    </Place>
    <Place x={1180} y={400} t={t} at={1.8} rot={2}>
      <Pinned x={0} y={0} w={560} h={260} rot={2} bg="#E3F1FF">
        <Note2 text="MASIH DITELITI" color={toon.blueDark} />
      </Pinned>
    </Place>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <Str x1={860} y1={320} x2={1460} y2={400} p={ease(t, 2.3, 3.0)} />
    </svg>
    <Place x={20} y={330} t={t} at={0.3} dy={bob(t, 4, 2.4)}>
      <Det x={0} y={0} size={420} t={t} mood="happy" hand={[132, 110]} />
    </Place>
  </>
);

export const BAB6_7: Record<string, React.FC<V>> = { l30: L30, l31: L31, l32: L32, l33: L33, l34: L34, l35: L35, l36: L36, l37: L37, l38: L38, l39: L39 };

export const SFX6_7: Record<string, readonly Cue[]> = {
  l30: [[cue("l30", "Sekarang coba") + 0.3, "hmm", 0.4]],
  l31: [[0.9, "ding", 0.6], [cue("l31", "Ini bukan"), "strike", 0.5]],
  l32: [[cue("l32", "Soalnya") + 0.2, "shimmer", 0.5]],
  l33: [[cue("l33", "Kelereng banyak"), "tick", 0.4], [cue("l33", "Kelereng banyak") + 0.3, "tick", 0.4], [cue("l33", "Kelereng banyak") + 0.6, "tick", 0.4], [cue("l33", "Bola basket cuma"), "pop", 0.5]],
  l34: [[0.3, "tingtong", 0.4]],
  l35: [[0.2, "hmm", 0.4]],
  l36: [[cue("l36", "Orang lain"), "pop", 0.5]],
  l37: [[cue("l37", "memperkirakan"), "pop", 0.5], [cue("l37", "Untuk anak"), "pop", 0.5]],
  l38: [[cue("l38", "Mereka mengira"), "hmm", 0.4], [cue("l38", "Dugaan ini"), "pop", 0.5]],
  l39: [[0.6, "pencil", 0.4], [1.8, "pencil", 0.4], [2.4, "strike", 0.8]],
};
void Sh;
void Cell;
void Bacteria;
void Paper;
