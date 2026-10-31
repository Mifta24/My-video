import type React from "react";
import { interpolate } from "remotion";
import {
  appear,
  bob,
  BigWord,
  Place,
  pop,
  Sh,
  Sparkle,
  slide,
  Tag,
  toonFont,
} from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { clipStart, cue } from "../timing";
import {
  Basket,
  CalendarYear,
  Chip,
  INK,
  Island,
  Letter,
  MapIsland,
  Nutmeg,
  Ruler,
  SeaPanel,
  Ship,
  SignBoard,
  TreatySheet,
  WaterBand,
  Fist,
  FlagPole,
  Speech,
  RED,
} from "./kit2d";
import { ScaleIslands3D, scaleState } from "./scene3d";

// Shorts Suhuf #03 (Pulau Run), kanvas 1080x1920. Zona aman: 150 px atas, 250 px bawah.
// Subtitle di y ~1430-1590. Gambar berganti tiap 3-5 detik (<Sh>). Teks besar 1-4 kata.
// 3D hanya di S-01 dan S-08 (timbangan -> tanda tanya); sisanya 2D agar tidak ramai.
// Label wajib: "SKEMA" (peta/diagram) dan "PERUMPAMAAN - bukan data" (S-09).

export type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const fade = (t: number, a: number, b: number) => interpolate(t, [a, b], [1, 0], clamp01);

// Kotak tengah horizontal: konten diposisikan dengan pusat x tertentu.
const CenterX: React.FC<{ readonly cx: number; readonly y: number; readonly w?: number; readonly children: React.ReactNode; readonly op?: number }> = ({ cx, y, w = 600, children, op = 1 }) => (
  <div style={{ position: "absolute", left: cx - w / 2, width: w, top: y, display: "flex", justifyContent: "center", opacity: op }}>{children}</div>
);

const NeutralChip: React.FC<{ readonly text: string }> = ({ text }) => <Chip text={text} color="#fff" textColor={INK} size={38} />;

// ---------------- S-01 Hook: timbangan 3D -> tanda tanya ----------------
const S01: React.FC<V> = ({ t }) => {
  const morphAt = 3.0;
  const angle = 9 * Math.sin(t * 2.6) * interpolate(t, [2.2, 3.0], [1, 0.3], clamp01);
  const st = scaleState(t, angle, morphAt);
  const labelOp = fade(t, morphAt - 0.15, morphAt + 0.25);
  return (
    <>
      <Tag text="SKEMA" kind="skema" t={t} />
      <div style={{ position: "absolute", inset: 0, opacity: labelOp }}>
        <BigWord text="DITUKAR?" t={t} at={cue("s01", "Ditukar") - 0.05} y={330} size={158} color={toon.orange} width={980} />
      </div>
      <ScaleIslands3D t={t} st={st} morphAt={morphAt} />
      <div style={{ position: "absolute", inset: 0, opacity: labelOp * appear(t, 0.5, 0.3) }}>
        <CenterX cx={222} y={1150} w={440}>
          <NeutralChip text="MANHATTAN" />
        </CenterX>
        <CenterX cx={858} y={1150} w={440}>
          <NeutralChip text="RUN" />
        </CenterX>
      </div>
      <Sparkle x={130} y={600} t={t} size={60} />
      <Sparkle x={930} y={580} t={t} size={70} phase={2} />
      {t > morphAt + 0.6 ? (
        <>
          <Sparkle x={170} y={760} t={t} size={64} phase={1} />
          <Sparkle x={860} y={700} t={t} size={72} phase={3} />
          <Sparkle x={780} y={1240} t={t} size={54} phase={5} />
        </>
      ) : null}
    </>
  );
};

// ---------------- S-02 Satu lembar, satu cerita ----------------
const S02: React.FC<V> = ({ t }) => {
  const p = slide(t, 0.05, 0.8);
  const fadeIn = appear(t, 0.7, 0.4);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 470,
          width: 700,
          height: 780,
          background: "#fff",
          border: `8px solid ${INK}`,
          borderRadius: 48,
          boxShadow: `0 14px 0 ${INK}`,
          transformOrigin: "50% 100%",
          transform: `perspective(1600px) rotateX(${(1 - p) * -78}deg) translateY(${(1 - p) * 140}px)`,
          opacity: appear(t, 0, 0.15),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div style={{ opacity: fadeIn, transform: `scale(${pop(t, 0.6)})` }}>
          <LogoSheet w={230} />
        </div>
        <div style={{ opacity: fadeIn, fontFamily: toonFont(), fontWeight: 700, fontSize: 54, letterSpacing: 5, color: INK }}>SUHUF PENGETAHUAN</div>
        <div style={{ opacity: appear(t, 1.0, 0.4), fontFamily: toonFont(), fontWeight: 600, fontSize: 56, color: toon.orangeDark, textAlign: "center", padding: "0 30px" }}>
          Satu lembar, satu cerita.
        </div>
      </div>
      <Sparkle x={150} y={520} t={t} size={70} />
      <Sparkle x={880} y={460} t={t} size={56} phase={3} />
      <Sparkle x={850} y={1230} t={t} size={64} phase={5} />
    </>
  );
};

// Lembar kertas dengan lipatan sudut: logo sederhana (pengganti logo resmi, sama dengan video #02).
export const LogoSheet: React.FC<{ readonly w: number }> = ({ w }) => (
  <svg width={w} height={w * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", display: "block" }}>
    <path d="M10,6 L68,6 L90,28 L90,114 L10,114 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M68,6 L68,28 L90,28 Z" fill={toon.orangeLight} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <rect x={22} y={44} width={56} height={9} rx={4.5} fill={toon.orange} stroke={INK} strokeWidth={2.5} />
    <rect x={22} y={64} width={48} height={7} rx={3.5} fill={toon.blue} />
    <rect x={22} y={80} width={52} height={7} rx={3.5} fill={toon.blue} />
    <rect x={22} y={96} width={34} height={7} rx={3.5} fill={toon.blue} />
  </svg>
);

// ---------------- S-03 Pulau Run ----------------
const S03: React.FC<V> = ({ t }) => (
  <>
    <Tag text="SKEMA" kind="skema" t={t} />
    {/* shot A: peta, pulau mungil muncul di laut */}
    <Sh t={t} to={1.95}>
      {(lt) => {
        const p = pop(lt, 0.25, 0.6);
        return (
          <>
            <SeaPanel x={60} y={330} w={960} h={960} t={t} seed="s03a" />
            {[0, 1].map((k) => {
              const r = ((lt * 0.9 + k * 0.5) % 1.4) / 1.4;
              return (
                <svg key={k} width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: (1 - r) * 0.8 * appear(lt, 0.3, 0.2) }}>
                  <ellipse cx={540} cy={800} rx={200 + r * 220} ry={90 + r * 100} fill="none" stroke="#fff" strokeWidth={7} />
                </svg>
              );
            })}
            <div style={{ position: "absolute", left: 170, top: 640, transform: `scale(${p})`, transformOrigin: "50% 60%" }}>
              <MapIsland w={740} />
            </div>
            <CenterX cx={540} y={960} op={appear(lt, 0.6, 0.3)}>
              <Chip text="RUN" color={toon.orange} size={92} />
            </CenterX>
          </>
        );
      }}
    </Sh>
    {/* shot B: garis ukur 3 x 1 km */}
    <Sh t={t} from={1.9} to={5.05}>
      {(lt) => {
        const rh = slide(lt, 0.3, 0.7);
        const rv = slide(lt, 0.7, 0.6);
        return (
          <>
            <SeaPanel x={60} y={330} w={960} h={960} t={t} seed="s03b" grid={false} />
            <div style={{ position: "absolute", left: 140, top: 640, transform: `scale(${1 + 0.02 * Math.sin(lt * 2)})` }}>
              <MapIsland w={800} />
            </div>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <Ruler x1={172} y1={1000} x2={968} y2={1000} p={rh} />
              <Ruler x1={126} y1={660} x2={126} y2={880} p={rv} color={toon.blueDark} />
            </svg>
            <BigWord text="3 x 1 km" t={lt} at={0.5} y={1070} size={132} color={toon.orange} width={900} />
          </>
        );
      }}
    </Sh>
    {/* shot C: pala jatuh, bersinar */}
    <Sh t={t} from={4.95}>
      {(lt) => {
        const drop = interpolate(lt, [0.15, 0.85], [-560, 0], { ...clamp01, easing: (x) => x * x });
        const bounce = lt > 0.85 ? Math.abs(Math.sin((lt - 0.85) * 7)) * 46 * Math.exp(-(lt - 0.85) * 3.2) : 0;
        const glow = appear(lt, 0.9, 0.4) * (0.75 + 0.25 * Math.sin(lt * 6));
        return (
          <>
            <Place x={230} y={830} t={lt} at={0.02} origin="50% 100%">
              <Island kind="run" w={620} t={lt} />
            </Place>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: glow }}>
              <defs>
                <radialGradient id="pr-glow">
                  <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#FFE9A8" stopOpacity={0} />
                </radialGradient>
              </defs>
              <circle cx={540} cy={640} r={330} fill="url(#pr-glow)" />
            </svg>
            <div style={{ position: "absolute", left: 540 - 150, top: 480 + drop - bounce, transform: `rotate(${interpolate(lt, [0.15, 0.85], [-80, 8], clamp01)}deg)` }}>
              <Nutmeg size={300} />
            </div>
            <BigWord text="PALA BERHARGA" t={lt} at={0.7} y={310} size={112} color={toon.orange} width={1040} />
            {glow > 0.3 ? (
              <>
                <Sparkle x={250} y={560} t={t} size={80} />
                <Sparkle x={800} y={520} t={t} size={90} phase={2} />
                <Sparkle x={830} y={760} t={t} size={60} phase={4} />
                <Sparkle x={220} y={780} t={t} size={56} phase={1} />
              </>
            ) : null}
          </>
        );
      }}
    </Sh>
  </>
);

// ---------------- S-04 Dua negara berebut ----------------
const S04: React.FC<V> = ({ t }) => {
  const bobY = (ph: number) => Math.sin(t * 2.4 + ph) * 7;
  return (
    <>
      {/* shot A: dua kapal berlayar ke Run */}
      <Sh t={t} to={2.75}>
        {(lt) => {
          const pe = slide(lt, 0.15, 2.0);
          const xe = lerp(-340, -20, pe);
          const xn = lerp(1100, 780, pe);
          return (
            <>
              <Place x={320} y={720} t={lt} at={0.02} origin="50% 100%">
                <Island kind="run" w={440} t={lt} />
              </Place>
              <BigWord text="BEREBUT" t={lt} at={0.3} y={330} size={150} color={toon.orange} width={980} />
              <div style={{ position: "absolute", left: xe, top: 700 + bobY(0) }}>
                <Ship kind="en" w={320} t={t} mood="happy" />
              </div>
              <div style={{ position: "absolute", left: xn, top: 700 + bobY(1.5) }}>
                <Ship kind="nl" w={320} t={t} flip mood="happy" phase={1} />
              </div>
              <WaterBand y0={1010} y1={1330} t={t} seed="s04a" />
            </>
          );
        }}
      </Sh>
      {/* shot B: kalender 1616, kapal Inggris berlabuh, surat */}
      <Sh t={t} from={2.65} to={5.55}>
        {(lt) => {
          const reveal = pop(lt, 1.55, 0.5);
          const dock = slide(lt, 0.0, 1.0);
          return (
            <>
              <Place x={590} y={740} t={lt} at={0.02} origin="50% 100%">
                <Island kind="run" w={440} t={lt} />
              </Place>
              <div style={{ position: "absolute", left: 90, top: 290 }}>
                <CalendarYear w={380} t={lt} flipAt={0.2} step={0.28} reveal={reveal} year="1616" />
              </div>
              <div style={{ position: "absolute", left: lerp(-200, 120, dock), top: 780 + bobY(0.5) }}>
                <Ship kind="en" w={330} t={t} mood="laugh" />
              </div>
              <Place x={470} y={650 + bob(lt, 8, 3)} t={lt} at={1.9} rot={-8} origin="50% 100%">
                <Letter w={150} />
              </Place>
              <WaterBand y0={1070} y1={1390} t={t} seed="s04b" />
            </>
          );
        }}
      </Sh>
      {/* shot C: kapal Belanda memeluk keranjang pala */}
      <Sh t={t} from={5.45}>
        {(lt) => {
          const slideIn = slide(lt, 0.0, 0.7);
          const hug = slide(lt, 0.6, 0.7);
          const shipX = 540 - 240;
          const shipTop = 690 + bobY(1);
          const arm = (side: 1 | -1) => {
            const sx = 540 + side * 215;
            const sy = shipTop + 335;
            const ex = lerp(540 + side * 150, 540 + side * 28, hug);
            const ey = lerp(shipTop + 300, shipTop + 238, hug);
            const cx = 540 + side * lerp(215, 170, hug);
            const cy = lerp(shipTop + 330, shipTop + 215, hug);
            return { d: `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`, ex, ey };
          };
          const l = arm(-1);
          const r = arm(1);
          return (
            <>
              <div style={{ position: "absolute", left: lerp(1100, shipX, slideIn), top: shipTop }}>
                <Ship kind="nl" w={480} t={t} mood="laugh" phase={1} />
              </div>
              <Place x={415} y={shipTop + 55 + bob(lt, 5, 3)} t={lt} at={0.5} origin="50% 100%">
                <Basket w={250} />
              </Place>
              <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                {[l, r].map((a, i) => (
                  <g key={i}>
                    <path d={a.d} fill="none" stroke={INK} strokeWidth={38} strokeLinecap="round" />
                    <path d={a.d} fill="none" stroke={toon.skin} strokeWidth={24} strokeLinecap="round" />
                  </g>
                ))}
                {[l, r].map((a, i) => (
                  <circle key={i} cx={a.ex} cy={a.ey} r={27} fill={toon.skin} stroke={INK} strokeWidth={6.5} opacity={hug} />
                ))}
              </svg>
              <WaterBand y0={1110} y1={1400} t={t} seed="s04c" />
              <BigWord text={"HANYA\nKAMI"} t={lt} at={cue("s04", "Belanda ingin") - 5.45 + 0.1} y={330} size={140} color={toon.blue} width={900} />
            </>
          );
        }}
      </Sh>
    </>
  );
};

// ---------------- S-05 New Amsterdam -> New York ----------------
const S05: React.FC<V> = ({ t }) => {
  const flipAt = cue("s05", "menamainya") - 0.1;
  const fp = interpolate(t, [flipAt, flipAt + 0.55], [0, 1], clamp01);
  const old = fp < 0.5;
  const rot = old ? fp * 2 * 90 : -(1 - (fp - 0.5) * 2) * 90;
  const zoom = 1 + 0.07 * slide(t, flipAt, 1.4);
  return (
    <>
      <Tag text="SKEMA" kind="skema" t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "540px 900px" }}>
        <Place x={160} y={640} t={t} at={0.15} origin="50% 100%">
          <Island kind="manhattan" w={760} t={t} />
        </Place>
        <FlagPole kind={old ? "nl" : "en"} x={285} y={950} h={240} w={160} t={t} />
        <div style={{ position: "absolute", left: 540 - 400, top: 360, width: 800, display: "flex", justifyContent: "center", opacity: appear(t, 0.5, 0.2), transform: `scale(${pop(t, 0.5, 0.5)})`, perspective: 1200 }}>
          <div style={{ transform: `rotateX(${rot}deg)` }}>
            {old ? <SignBoard w={780} text="NEW AMSTERDAM" color={toon.blue} size={74} post={0} /> : <SignBoard w={780} text="NEW YORK" color={toon.orange} size={110} post={0} />}
          </div>
        </div>
        <CenterX cx={540} y={1230} op={appear(t, 0.8, 0.3)}>
          <NeutralChip text="MANHATTAN" />
        </CenterX>
      </div>
      {fp >= 0.5 ? (
        <>
          <Sparkle x={150} y={560} t={t} size={70} />
          <Sparkle x={900} y={520} t={t} size={80} phase={2} />
        </>
      ) : null}
    </>
  );
};

// ---------------- S-06 Perjanjian 1667 ----------------
const S06: React.FC<V> = ({ t }) => {
  const tHeld = cue("s06", "Aturannya");
  const strikeAt = cue("s06", "tukar-menukar") + 0.15;
  return (
    <>
      {/* shot A: kalender 1667, lembar perjanjian meluncur dari samping ke tengah (selalu di zona aman) dan distempel */}
      <Sh t={t} to={4.95}>
        {(lt) => {
          const reveal = pop(lt, 0.95, 0.5);
          const calOut = slide(lt, 2.5, 0.6);
          const IN_AT = 2.6;
          const x = Math.max(0, lt - IN_AT);
          const inP = slide(lt, IN_AT, 0.75);
          const swing = lt < IN_AT ? 0 : -16 * Math.exp(-4.5 * x) * Math.cos(11 * x);
          const stamp = slide(lt, 3.85, 0.22);
          const shake = lt > 3.85 && lt < 4.2 ? 6 * Math.sin(lt * 70) * (4.2 - lt) : 0;
          // Setelah distempel, lembar mengecil halus ke pose shot B (sama persis saat cut).
          const mv = slide(lt, 4.3, 0.55);
          const cx = lerp(540 + 330 * (1 - inP), 540, 1) + shake;
          const cy = lerp(800, 883, inP);
          const scl = lerp(0.7, 1, inP) * lerp(1, 380 / 440, mv);
          return (
            <>
              <div style={{ position: "absolute", left: 270, top: lerp(380, 300, calOut), opacity: 1 - calOut, transform: `scale(${lerp(1, 0.86, calOut)})` }}>
                <CalendarYear w={540} t={lt} flipAt={0.05} step={0.25} reveal={reveal} year="1667" />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: cx - 220,
                  top: cy - 281,
                  opacity: appear(lt, IN_AT, 0.15),
                  transform: `scale(${scl}) rotate(${lerp(swing, 2, mv)}deg)`,
                  transformOrigin: "50% 50%",
                  filter: "drop-shadow(0 14px 14px rgba(40,30,60,0.22))",
                }}
              >
                <TreatySheet w={440} stampP={stamp} rot={0} />
              </div>
            </>
          );
        }}
      </Sh>
      {/* shot B: gelembung "kita tukar ya" dicoret merah */}
      <Sh t={t} from={4.9} to={7.4}>
        {(lt) => {
          const strike = slide(t, strikeAt, 0.4);
          return (
            <>
              <div style={{ position: "absolute", left: 540 - 190, top: 640 + bob(lt, 6, 2.5), opacity: 1, filter: "drop-shadow(0 14px 14px rgba(40,30,60,0.22))" }}>
                <TreatySheet w={380} stampP={1} rot={2 + bob(lt, 1.2, 2)} />
              </div>
              <Place x={190} y={360} t={lt} at={0.15} origin="50% 100%">
                <Speech text="kita tukar ya" size={92} tail="down" strike={strike} />
              </Place>
              {strike > 0.8 ? <Sparkle x={860} y={470} t={t} size={70} phase={1} /> : null}
            </>
          );
        }}
      </Sh>
      {/* shot C: dua tangan menggenggam pulau masing-masing */}
      <Sh t={t} from={7.3}>
        {(lt) => {
          const inn = slide(lt, 0.0, 0.7);
          const sq = interpolate(lt, [0.8, 1.2, 1.5], [0, 1, 0.7], clamp01);
          const hover = bob(lt, 5, 2.4);
          return (
            <>
              <div style={{ position: "absolute", left: 0, top: hover, transform: `translateX(${(1 - inn) * -520}px)` }}>
                <div style={{ position: "absolute", left: 10, top: 790 }}>
                  <Island kind="manhattan" w={440} t={lt} />
                </div>
                <div style={{ position: "absolute", left: -120, top: 970 }}>
                  <Fist color={toon.orange} dark={toon.orangeDark} w={520} squeeze={sq} />
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, top: hover, transform: `translateX(${(1 - inn) * 520}px)` }}>
                <div style={{ position: "absolute", left: 630, top: 790 }}>
                  <Island kind="run" w={440} t={lt} />
                </div>
                <div style={{ position: "absolute", left: 680, top: 970, transform: "scaleX(-1)" }}>
                  <Fist color={toon.blue} dark={toon.blueDark} w={520} squeeze={sq} />
                </div>
              </div>
              <BigWord text={"YANG DIPEGANG,\nTETAP DIPEGANG"} t={t - 7.3} at={tHeld - 7.3 + 0.55} y={330} size={104} color={toon.orange} width={1040} />
              {lt > 1.2 ? (
                <>
                  <Sparkle x={500} y={900} t={t} size={60} />
                  <Sparkle x={600} y={1000} t={t} size={50} phase={3} />
                </>
              ) : null}
            </>
          );
        }}
      </Sh>
    </>
  );
};

export const PART1: Record<string, React.FC<V>> = { s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06 };

export const SFX1: Record<string, readonly Cue[]> = {
  s01: [
    [0.35, "pop", 0.7],
    [cue("s01", "Ditukar") - 0.05, "tick", 0.8],
    [1.5, "scale", 0.4],
    [3.0, "shrink", 0.5],
    [3.45, "hmm", 0.6],
  ],
  s02: [
    [0.05, "page", 0.7],
    [0.9, "ding", 0.5],
  ],
  s03: [
    [0.25, "pop", 0.7],
    [1.95, "tick", 0.5],
    [clipStart("s03", "s03_02") + 0.4, "pencil", 0.5],
    [4.95 + 0.15, "whoosh", 0.4],
    [4.95 + 0.85, "plop", 0.7],
    [4.95 + 1.0, "ding", 0.6],
  ],
  s04: [
    [0.1, "waves", 0.5],
    [0.2, "whoosh", 0.35],
    [2.65 + 0.2, "flip", 0.5],
    [2.65 + 0.6, "flip", 0.4],
    [2.65 + 1.55, "tick", 0.6],
    [2.65 + 1.9, "pop", 0.5],
    [5.45 + 0.1, "whoosh", 0.4],
    [5.45 + 0.6, "pop", 0.6],
    [cue("s04", "Belanda ingin") + 0.2, "ding", 0.5],
  ],
  s05: [
    [0.5, "pop", 0.5],
    [cue("s05", "menamainya") - 0.1, "flip", 0.7],
    [cue("s05", "menamainya") + 0.45, "ding", 0.6],
  ],
  s06: [
    [0.05, "flip", 0.5],
    [0.3, "flip", 0.4],
    [2.65, "whoosh", 0.45],
    [3.85, "stamp", 1.0],
    [4.9 + 0.15, "pop", 0.5],
    [cue("s06", "tukar-menukar") + 0.2, "strike", 0.6],
    [cue("s06", "tukar-menukar") + 0.8, "tingtong", 0.6],
    [7.3 + 0.1, "whoosh", 0.45],
    [7.3 + 0.9, "tick", 0.7],
    [cue("s06", "yang sudah") + 0.55, "shimmer", 0.35],
  ],
};

export { RED };
