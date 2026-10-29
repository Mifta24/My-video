import type React from "react";
import { interpolate } from "remotion";
import type { Cue } from "../elements/Sound";
import { bob, Place, Sh, Sparkle, slide, toonFont } from "../elements/ToonKit";
import { Bacteria, Cell, Stadium } from "../shorts/characters";
import { toon } from "../theme";
import { cue } from "../timing";
import { LogoSheet, Paper } from "../shorts/visuals";
import { Big, Board, Det, INK, Pill, Pinned, Stamp, Str, TeamScale, ToiletDoor, wig } from "./kit";

type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp01, easing: (x) => x * x * (3 - 2 * x) });

// ---------- L-40 Satu kali ke toilet (opsional) ----------
const L40: React.FC<V> = ({ t }) => {
  const tToilet = cue("l40", "sekali ke toilet");
  const tGeser = cue("l40", "Perbandingannya");
  const open = ease(t, tToilet - 0.2, tToilet + 0.8);
  const shift = ease(t, tGeser, tGeser + 1.6);
  const ang = -3 + 8 * shift; // condong ke Tim Sel Manusia (kanan turun)
  const leavers = [0, 1, 2];
  return (
    <>
      <Place x={90} y={230} t={t} at={0.3} origin="50% 100%">
        <TeamScale w={780} angle={ang} t={t} nb={Math.round(6 - 2 * shift)} nc={5} />
      </Place>
      <Place x={1300} y={230} t={t} at={0.5}>
        <ToiletDoor w={300} open={open} />
      </Place>
      {leavers.map((i) => {
        const s = tToilet + 0.5 + i * 0.55;
        const p = ease(t, s, s + 1.7);
        const x = 1130 + 50 - p * 130 + (1 - p) * 0;
        const startX = 1000;
        const endX = 1375;
        const cx = startX + (endX - startX) * p;
        const cy = 560 - 40 * Math.sin(p * Math.PI) + wig(t, 6, 7, i);
        return (
          <div key={i} style={{ position: "absolute", left: cx - 50, top: cy, opacity: t > s ? 1 - ease(p, 0.85, 1) : 0, transform: `scale(${1 - 0.35 * p})` }}>
            <Bacteria size={100} t={t} phase={i} mood="laugh" arms={{ l: 140 + 30 * Math.sin(t * 9 + i), r: 140 + 30 * Math.sin(t * 9 + i + 1) }} />
            <span style={{ display: "none" }}>{x}</span>
          </div>
        );
      })}
      <Big text="BISA BERGESER" t={t} at={tGeser} y={115} cx={760} size={104} color={toon.orange} width={1300} />
      <Sparkle x={1500} y={190} t={t} size={60} />
    </>
  );
};

// ---------- L-41 Bukan skor tetap ----------
const L41: React.FC<V> = ({ t }) => {
  const ang = 8 * Math.exp(-1.6 * t) * Math.sin(t * 7) + 0.6 * Math.sin(t * 2);
  return (
    <>
      <Place x={550} y={230} t={t} at={0.15} origin="50% 100%">
        <TeamScale w={820} angle={ang} t={t} nb={6} nc={5} />
      </Place>
      <Big text="BUKAN SKOR TETAP" t={t} at={0.6} y={125} size={104} color={toon.blue} width={1500} />
    </>
  );
};

// ---------- L-42 Pelajaran: cek ulang ----------
const L42: React.FC<V> = ({ t }) => {
  const tCek = cue("l42", "Angka yang");
  const k = ease(t, 0.2, 1.2);
  const lensY = 330 + 16 * Math.sin(t * 2.2);
  return (
    <>
      <Place x={700} y={230} t={t} at={0.2} rot={-3}>
        <Paper w={400} text="10 : 1" />
      </Place>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: k }}>
        <g transform={`translate(${830 + 0 * k} ${lensY + 80}) rotate(35) scale(${1.0 + 0.0 * k})`}>
          <line x1={0} y1={200} x2={0} y2={520} stroke={INK} strokeWidth={70} strokeLinecap="round" />
          <line x1={0} y1={200} x2={0} y2={520} stroke="#B9774A" strokeWidth={40} strokeLinecap="round" />
          <circle r={230} fill="#D8EEFF" fillOpacity={0.45} stroke={INK} strokeWidth={34} />
          <circle r={206} fill="none" stroke="#F2B544" strokeWidth={18} />
          <path d="M-120,-30 Q-100,-130 -10,-150" fill="none" stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.7} />
        </g>
      </svg>
      <Place x={80} y={400} t={t} at={0.5} dy={bob(t, 4, 2.4)}>
        <Det x={0} y={0} size={380} t={t} mood="think" bare hand={[128, 150]} />
      </Place>
      <Big text="CEK ULANG" t={t} at={tCek} y={420} cx={1450} size={130} color={toon.orange} width={700} />
    </>
  );
};

// ---------- L-43 Bakteri tetap penting ----------
const L43: React.FC<V> = ({ t }) => {
  const tHampir = cue("l43", "hampir sama");
  const tBaik = cue("l43", "Yang diperbaiki");
  const x = ease(t, 0.9, 1.5);
  const hug = ease(t, tHampir + 0.3, tHampir + 1.3);
  return (
    <>
      <Sh t={t} to={tHampir + 0.2}>
        {() => (
          <>
            <Big text="10 : 1" t={t} at={0.2} y={330} size={300} color={toon.orange} width={900} />
            <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 510, top: 280 }}>
              <path d="M120,320 L780,100" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - x)} fill="none" />
              <path d="M120,320 L780,100" stroke={toon.red} strokeWidth={30} strokeLinecap="round" strokeDasharray={760} strokeDashoffset={760 * (1 - x)} fill="none" />
            </svg>
          </>
        )}
      </Sh>
      <Sh t={t} from={tHampir}>
        {() => (
          <>
            <Big text="HAMPIR SAMA BANYAK" t={t} at={tHampir + 0.1} y={115} size={100} color={toon.orange} width={1600} />
            <Place x={650} y={235} t={t} at={tHampir + 0.2} origin="50% 100%">
              <TeamScale w={620} angle={1.1 * Math.sin(t * 1.8)} t={t} nb={6} nc={5} />
            </Place>
            <div style={{ position: "absolute", left: 380 + 90 * (1 - hug), top: 500 + wig(t, 5, 3), opacity: hug }}>
              <Bacteria size={180} t={t} mood="laugh" arms={{ r: 20 + 18 * Math.sin(t * 5) }} />
            </div>
            <div style={{ position: "absolute", left: 1360 - 90 * (1 - hug), top: 520 + wig(t, 5, 3, 1), opacity: hug }}>
              <Cell size={170} t={t} phase={1} mood="laugh" arms={{ l: 20 + 18 * Math.sin(t * 5 + 1) }} />
            </div>
          </>
        )}
      </Sh>
      <Big text="ANGKANYA DIPERBAIKI" t={t} at={tBaik} y={760} size={80} color={toon.blue} width={1600} />
    </>
  );
};

// ---------- L-44 Rekap akhir ----------
const L44: React.FC<V> = ({ t }) => {
  const tBilang = cue("l44", "tapi hitungan baru");
  const sw = (a: number, b: number) => (
    <Sh t={t} from={a} to={b}>
      {(lt) => (
        <>
          {a === 0 ? (
            <>
              <Place x={600} y={190} t={lt} at={0.1} rot={wig(lt, 2, 2)}>
                <Stadium w={640} fill={1} emptyCorner={1} t={lt} hideCell />
              </Place>
              <Pill text="tebakan kasar" cx={920} y={780} t={lt} at={0.3} bg={toon.orange} size={52} />
            </>
          ) : a < tBilang + 2 ? (
            <>
              <Place x={640} y={235} t={lt} at={0.1} origin="50% 100%">
                <TeamScale w={640} angle={1.1 * Math.sin(lt * 1.8)} t={lt} nb={6} nc={5} />
              </Place>
              <Pill text="hitungan baru" cx={930} y={780} t={lt} at={0.3} bg={toon.blue} size={52} />
            </>
          ) : (
            <>
              <Det x={640} y={190} size={520} t={lt} mood="happy" hand={[128, 150]} lens={140} lensRot={40} />
              <Sparkle x={560} y={260} t={lt} size={64} />
            </>
          )}
        </>
      )}
    </Sh>
  );
  const t1 = tBilang - 0.5;
  const t2 = tBilang + 2.3;
  const close = ease(t, t2 + 2.4, t2 + 3.4);
  return (
    <>
      {sw(0, t1)}
      {sw(t1, t2)}
      {sw(t2, t2 + 2.6)}
      <Sh t={t} from={t2 + 2.5}>
        {() => (
          <>
            <div style={{ position: "absolute", left: 500, top: 190, opacity: 1 - 0.0 * close }}>
              <Board w={1300} h={620} />
            </div>
            <Place x={600} y={300} t={t} at={t2 + 2.5} rot={-3}>
              <Pinned x={0} y={0} w={520} h={260} rot={-3} bg="#FFF3D6">
                <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 64, color: toon.orangeDark, textAlign: "center" }}>PERKIRAAN</div>
              </Pinned>
            </Place>
            <Place x={1170} y={380} t={t} at={t2 + 2.5} rot={2}>
              <Pinned x={0} y={0} w={560} h={260} rot={2} bg="#E3F1FF">
                <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 60, color: toon.blueDark, textAlign: "center" }}>MASIH DITELITI</div>
              </Pinned>
            </Place>
            <Place x={30} y={330} t={t} at={t2 + 2.6} dy={bob(t, 4, 2.4)}>
              <Det x={0} y={0} size={420} t={t} mood="happy" hand={[132, 110]} />
            </Place>
          </>
        )}
      </Sh>
    </>
  );
};

const appearT = (t: number) => interpolate(t, [0.6, 1.0], [0, 1], clamp01);
// ---------- L-45 Penutup ----------
const L45: React.FC<V> = ({ t }) => {
  const tHandle = cue("l45", "ikuti");
  const tJumpa = cue("l45", "Sampai jumpa");
  const wave = (ph: number) => 130 + 35 * Math.sin(t * 7 + ph);
  const k = slide(t, 0.2, 0.9);
  const closeP = ease(t, tJumpa + 1.6, tJumpa + 3.2);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scaleY(${1 - closeP * 0.93})`, transformOrigin: "50% 100%", opacity: 1 - closeP * 0.3 }}>
        <Place x={960 - 140} y={120} t={t} at={0.2} dy={bob(t, 6, 2)}>
          <LogoSheet w={280} />
        </Place>
        <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: toonFont(), fontWeight: 700, fontSize: 72, letterSpacing: 10, color: INK, opacity: appearT(t) }}>SUHUF PENGETAHUAN</div>
        <Place x={960 - 360} y={590} t={t} at={tHandle} origin="50% 50%">
          <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 68, color: toon.orangeDark, background: "#fff", border: `6px solid ${INK}`, boxShadow: `0 7px 0 ${INK}`, borderRadius: 999, padding: "4px 36px 12px" }}>@suhufpengetahuan</div>
        </Place>
        <div style={{ position: "absolute", left: 200 - 120 * (1 - k), top: 330, opacity: k }}>
          <Bacteria size={250} t={t} mood="laugh" arms={{ r: wave(0) }} />
        </div>
        <div style={{ position: "absolute", left: 1470 + 120 * (1 - k), top: 340, opacity: k }}>
          <Cell size={240} t={t} phase={1} mood="laugh" arms={{ l: wave(1.4) }} />
        </div>
        <Sparkle x={700} y={170} t={t} size={60} />
        <Sparkle x={1250} y={190} t={t} size={70} phase={3} />
      </div>
    </>
  );
};

export const BAB8_10: Record<string, React.FC<V>> = { l40: L40, l41: L41, l42: L42, l43: L43, l44: L44, l45: L45 };

export const SFX8_10: Record<string, readonly Cue[]> = {
  l40: [[cue("l40", "sekali ke toilet") - 0.1, "door", 0.4], [cue("l40", "Perbandingannya"), "scale", 0.4]],
  l41: [[0.2, "tick", 0.3], [1.4, "tingtong", 0.4]],
  l42: [[0.3, "whoosh", 0.4], [cue("l42", "Angka yang"), "ding", 0.5]],
  l43: [[0.9, "strike", 0.7], [cue("l43", "hampir sama"), "reveal", 0.5]],
  l44: [[0.3, "pop", 0.4], [cue("l44", "tapi hitungan baru") - 0.5, "pop", 0.4], [cue("l44", "tapi hitungan baru") + 2.3, "ding", 0.4]],
  l45: [[0.3, "tingtong", 0.6], [cue("l45", "Sampai jumpa") + 1.6, "page", 0.5]],
};
void Stamp;
void Str;
