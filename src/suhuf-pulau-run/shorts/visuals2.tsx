import type React from "react";
import { interpolate } from "remotion";
import { appear, bob, BigWord, Place, pop, Sh, Sparkle, slide, Tag, toonFont } from "../../suhuf-bakteri/elements/ToonKit";
import { SheetMark } from "../../suhuf-bakteri/elements/Brand";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { cue } from "../timing";
import { Chip, CardG, FlagPole, Fist, INK, Island, RED, Speech, TableTop, ToyKid, TreatySheet, Card } from "./kit2d";
import { ScaleIslands3D, scaleState } from "./scene3d";
import { LogoSheet, type V } from "./visuals";

const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------------- S-07 Hasilnya ----------------
const Hold: React.FC<{ readonly lt: number; readonly kind: "manhattan" | "run"; readonly side: "l" | "r"; readonly label: string; readonly who: "en" | "nl" }> = ({ lt, kind, side, label, who }) => {
  const inn = slide(lt, 0.0, 0.7);
  const sq = interpolate(lt, [0.7, 1.1, 1.4], [0, 1, 0.7], clamp01);
  const hover = bob(lt, 5, 2.4);
  const dir = side === "l" ? -1 : 1;
  const color = who === "en" ? toon.orange : toon.blue;
  const dark = who === "en" ? toon.orangeDark : toon.blueDark;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: hover, width: 1080, transform: `translateX(${(1 - inn) * dir * 600}px)` }}>
        <div style={{ position: "absolute", left: 540 - 320, top: 620 }}>
          <Island kind={kind} w={640} t={lt} />
        </div>
        <div style={{ position: "absolute", left: side === "l" ? 210 : 350, top: 960, transform: side === "l" ? undefined : "scaleX(-1)" }}>
          <Fist color={color} dark={dark} w={520} squeeze={sq} />
        </div>
      </div>
      <FlagPole kind={who} x={700} y={900} h={230} w={150} t={lt} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: appear(lt, 0.6, 0.3), transform: `scale(${pop(lt, 0.6, 0.5)})` }}>
        <Chip text={label} color={color} size={110} />
      </div>
    </>
  );
};

const S07: React.FC<V> = ({ t }) => (
  <>
    <Sh t={t} to={3.2}>
      {(lt) => <Hold lt={lt} kind="manhattan" side="l" label="INGGRIS" who="en" />}
    </Sh>
    <Sh t={t} from={3.1}>
      {(lt) => <Hold lt={lt} kind="run" side="r" label="BELANDA" who="nl" />}
    </Sh>
  </>
);

// ---------------- S-08 Dibahas bersamaan, tapi bukan tukar ----------------
const S08: React.FC<V> = ({ t }) => (
  <>
    <Sh t={t} to={5.1}>
      {(lt) => {
        const st = scaleState(lt, 3 * Math.sin(lt * 2.2), 99);
        const together = appear(lt, 0.4, 0.4);
        return (
          <>
            <Tag text="SKEMA" kind="skema" t={lt} />
            <div style={{ position: "absolute", inset: 0, opacity: together }}>
              <BigWord text={"DIBAHAS\nBERSAMAAN"} t={lt} at={0.4} y={330} size={130} color={toon.blue} width={980} />
            </div>
            <ScaleIslands3D t={lt} st={st} morphAt={99} />
            <div style={{ position: "absolute", left: 222 - 220, width: 440, top: 1150, display: "flex", justifyContent: "center" }}>
              <Chip text="MANHATTAN" color="#fff" textColor={INK} size={42} />
            </div>
            <div style={{ position: "absolute", left: 858 - 220, width: 440, top: 1150, display: "flex", justifyContent: "center" }}>
              <Chip text="RUN" color="#fff" textColor={INK} size={42} />
            </div>
          </>
        );
      }}
    </Sh>
    <Sh t={t} from={5.0}>
      {(lt) => {
        const strike = slide(lt, 0.7, 0.4);
        return (
          <>
            <BigWord text="TIDAK TERTULIS" t={lt} at={0.15} y={300} size={118} color={toon.orange} width={1040} />
            <Place x={310} y={520} t={lt} at={0.05} origin="50% 100%">
              <TreatySheet w={460} stampP={1} rot={-3} />
            </Place>
            <div style={{ position: "absolute", left: 540 - 380, top: 1090, width: 760, display: "flex", justifyContent: "center", transform: `scale(${pop(lt, 0.4, 0.5)})` }}>
              <svg width={760} height={220} viewBox="0 0 760 220" style={{ overflow: "visible" }}>
                <rect x={10} y={30} width={740} height={160} rx={40} fill="#fff" stroke={INK} strokeWidth={8} />
                <text x={380} y={138} textAnchor="middle" fontFamily={toonFont()} fontWeight={700} fontSize={104} fill={INK}>
                  TUKAR
                </text>
                <line x1={40} y1={196 - 170 * strike} x2={40 + 680 * strike} y2={196 - 170 * strike + 10} stroke={RED} strokeWidth={22} strokeLinecap="round" />
                <line x1={720} y1={36} x2={720 - 680 * strike} y2={190 - 0 * strike} stroke={RED} strokeWidth={22} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
              </svg>
            </div>
          </>
        );
      }}
    </Sh>
  </>
);

// ---------------- S-09 Perumpamaan: dua anak main kartu ----------------
const kidPair = (lt: number, t: number, aHand: readonly [number, number], bHand: readonly [number, number], cardsHeld: boolean) => (
  <>
    <Place x={70} y={620} t={lt} at={0.1} origin="50% 100%">
      <ToyKid size={400} t={t} shirt={toon.orange} hair="#5A3B27" handTo={aHand} mood="happy" phase={0}>
        {cardsHeld ? <CardG x={aHand[0] + 4} y={aHand[1] - 28} w={44} tint={toon.blue} rot={-8} /> : null}
      </ToyKid>
    </Place>
    <Place x={610} y={620} t={lt} at={0.2} origin="50% 100%">
      <div style={{ transform: "scaleX(-1)" }}>
        <ToyKid size={400} t={t} shirt={toon.blue} hair="#2B2B2B" handTo={bHand} mood="happy" phase={1.5}>
          {cardsHeld ? <CardG x={bHand[0] + 4} y={bHand[1] - 28} w={44} tint={toon.orange} rot={-8} /> : null}
        </ToyKid>
      </div>
    </Place>
  </>
);

const S09: React.FC<V> = ({ t }) => (
  <>
    <Tag text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
    {/* A: berhenti main */}
    <Sh t={t} to={2.65}>
      {(lt) => {
        const fall = slide(lt, 0.3, 0.6);
        return (
          <>
            {kidPair(lt, t, [150, 150], [150, 150], true)}
            <Place x={140} y={1010} t={lt} at={0.0} origin="50% 100%">
              <TableTop w={800} h={120} />
            </Place>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 360 + i * 110, top: lerp(260, 940, fall) - i * 14, opacity: 1 - 0.0, transform: `rotate(${(i - 1) * 24 + fall * 30}deg)` }}>
                <Card w={90} tint={i % 2 ? toon.orange : toon.blue} />
              </div>
            ))}
            <BigWord text="BERHENTI" t={lt} at={0.25} y={330} size={140} color={toon.orange} width={980} />
          </>
        );
      }}
    </Sh>
    {/* B: kartu di tangan, simpan saja */}
    <Sh t={t} from={2.5} to={5.85}>
      {(lt) => (
        <>
          {kidPair(lt, t, [146, 160], [146, 160], true)}
          <Place x={140} y={1010} t={lt} at={0.0} origin="50% 100%">
            <TableTop w={800} h={120} />
          </Place>
          <BigWord text="SIMPAN SAJA" t={lt} at={0.35} y={330} size={128} color={toon.blue} width={1040} />
        </>
      )}
    </Sh>
    {/* C: terlihat seperti tukar, padahal tidak ada yang bilang */}
    <Sh t={t} from={5.75}>
      {(lt) => {
        const strike = slide(t, cue("s09", "padahal") + 0.1, 0.4);
        const swap = 0.5 + 0.5 * Math.sin(lt * 3);
        return (
          <>
            {kidPair(lt, t, [146, 160], [146, 160], true)}
            <Place x={140} y={1010} t={lt} at={0.0} origin="50% 100%">
              <TableTop w={800} h={120} />
            </Place>
            <div style={{ position: "absolute", left: 540 - 105, top: 880 + bob(lt, 6, 2.5), opacity: 0.55 + 0.45 * swap, transform: "scale(0.75)", transformOrigin: "50% 50%" }}>
              <svg width={280} height={120} viewBox="0 0 280 120" style={{ overflow: "visible" }}>
                <path d="M30,40 L230,40 M200,16 L232,40 L200,64" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M250,92 L50,92 M80,68 L48,92 L80,116" fill="none" stroke={toon.blueDark} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <Place x={330} y={370} t={lt} at={0.4} origin="50% 100%">
              <Speech text="tukar" size={110} tail="down" strike={strike} />
            </Place>
          </>
        );
      }}
    </Sh>
  </>
);

// ---------------- S-10 Pelajaran: cek dulu yang tertulis ----------------
const S10: React.FC<V> = ({ t }) => (
  <>
    <Sh t={t} to={3.95}>
      {(lt) => {
        const shrink = slide(lt, 1.0, 1.2);
        return (
          <>
            <Place x={330} y={500} t={lt} at={0.05} origin="50% 100%">
              <TreatySheet w={420} stampP={1} rot={-3} />
            </Place>
            <svg width={1080} height={300} style={{ position: "absolute", left: 0, top: 1050, overflow: "visible" }}>
              <path d={`M360,120 L${360 + 220 * shrink},120`} stroke={INK} strokeWidth={16} strokeLinecap="round" opacity={shrink > 0 ? 1 : 0} />
            </svg>
            {lt < cue("s10", "disederhanakan") - 0.9 ? (
              <BigWord text="PELAJARAN" t={lt} at={0.25} y={300} size={130} color={toon.blue} width={1040} />
            ) : (
              <BigWord text="DIPERSINGKAT" t={lt} at={cue("s10", "disederhanakan") - 0.9} y={300} size={110} color={toon.orange} width={1040} />
            )}
            <Place x={160} y={1120} t={lt} at={1.0} origin="50% 100%">
              <Speech text="ditukar!" size={90} tail="left" />
            </Place>
          </>
        );
      }}
    </Sh>
    <Sh t={t} from={3.85}>
      {(lt) => {
        const move = slide(lt, 0.2, 0.9);
        const mx = lerp(250, 520, move) + Math.sin(lt * 2) * 12;
        return (
          <>
            <Place x={270} y={540} t={lt} at={0.0} origin="50% 100%">
              <TreatySheet w={540} stampP={1} rot={1} />
            </Place>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <g transform={`translate(${mx} ${lerp(860, 960, move)})`}>
                <circle r={120} fill="#fff" fillOpacity={0.35} stroke={INK} strokeWidth={16} />
                <circle r={120} fill="none" stroke={toon.orange} strokeWidth={7} />
                <line x1={86} y1={86} x2={210} y2={210} stroke={INK} strokeWidth={34} strokeLinecap="round" />
                <line x1={86} y1={86} x2={210} y2={210} stroke={toon.orangeDark} strokeWidth={18} strokeLinecap="round" />
              </g>
            </svg>
            <BigWord text={"CEK DULU"} t={lt} at={0.3} y={290} size={150} color={toon.blue} width={980} />
            {lt > 1.0 ? <Sparkle x={820} y={640} t={t} size={70} /> : null}
          </>
        );
      }}
    </Sh>
  </>
);

// ---------------- S-11 Penutup ----------------
const S11: React.FC<V> = ({ t }) => (
  <>
    <Place x={420} y={400} t={t} at={0.05} dy={bob(t, 6, 3)} origin="50% 50%">
      <LogoSheet w={240} />
    </Place>
    <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: appear(t, 0.3, 0.3), fontFamily: toonFont(), fontWeight: 700, fontSize: 56, letterSpacing: 5, color: INK }}>
      SUHUF PENGETAHUAN
    </div>
    <BigWord text="@suhufpengetahuan" t={t} at={0.3} y={850} size={84} color={toon.orange} width={1040} />
    <Place x={60} y={1030} t={t} at={0.4} dy={bob(t, 6, 4)} rot={-5}>
      <Island kind="manhattan" w={420} t={t} />
    </Place>
    <Place x={600} y={1040} t={t} at={0.5} dy={bob(t, 6, 4, 2)} rot={5}>
      <Island kind="run" w={420} t={t} />
    </Place>
    <Sparkle x={150} y={500} t={t} size={64} />
    <Sparkle x={850} y={520} t={t} size={70} phase={2} />
  </>
);

export const PART2: Record<string, React.FC<V>> = { s07: S07, s08: S08, s09: S09, s10: S10, s11: S11 };

export const SFX2: Record<string, readonly Cue[]> = {
  s07: [
    [0.05, "whoosh", 0.45],
    [0.9, "tick", 0.7],
    [3.1 + 0.05, "whoosh", 0.45],
    [3.1 + 0.9, "tick", 0.7],
  ],
  s08: [
    [0.3, "scale", 0.4],
    [0.45, "pop", 0.5],
    [5.0 + 0.4, "pop", 0.5],
    [5.0 + 0.7, "strike", 0.7],
  ],
  s09: [
    [0.3, "shuffle", 0.5],
    [0.9, "plop", 0.5],
    [2.5 + 0.4, "pop", 0.5],
    [5.75 + 0.2, "giggle", 0.4],
    [cue("s09", "padahal") + 0.1, "strike", 0.6],
  ],
  s10: [
    [0.1, "page", 0.5],
    [1.0, "shrink", 0.4],
    [3.85 + 0.2, "whoosh", 0.4],
    [3.85 + 0.9, "ding", 0.6],
  ],
  s11: [
    [0.1, "page", 0.5],
    [0.4, "ding", 0.6],
    [0.9, "shimmer", 0.35],
  ],
};

export { SheetMark };
