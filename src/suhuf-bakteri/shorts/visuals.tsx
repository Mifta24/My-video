import type React from "react";
import { interpolate, random } from "remotion";
import type { Cue } from "../elements/Sound";
import {
  appear,
  bob,
  BigWord,
  Mv,
  Place,
  pop,
  Sh,
  SmallText,
  Sparkle,
  slide,
  Tag,
  toonFont,
} from "../elements/ToonKit";
import { toon } from "../theme";
import { clipStart, cue } from "../timing";
import {
  Bacteria,
  BodySilhouette,
  Calendar,
  Cell,
  Detective,
  MagnifierG,
  PencilG,
  Stadium,
} from "./characters";

// Shorts V3 (ramah pemula): 11 adegan kartun cerah. Kanvas 1080x1920.
// Zona aman: 150 px atas dan 250 px bawah bebas teks penting; subtitle di y ~1430-1590.
// Gambar berganti tiap 3-5 detik (komponen <Sh>). Teks besar hanya 1-4 kata.
// Angka di layar hanya yang ada di narasi: 10 : 1, 38 triliun, 30 triliun, 1972.

type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = toon.ink;

// ---------- potongan kecil ----------
export const Paper: React.FC<{ readonly w: number; readonly text?: string; readonly rot?: number }> = ({ w, text = "10 : 1", rot = 0 }) => (
  <div
    style={{
      width: w,
      height: w * 1.25,
      background: "#fff",
      border: `${Math.max(4, w * 0.035)}px solid ${INK}`,
      borderRadius: w * 0.08,
      boxShadow: `0 ${w * 0.04}px 0 ${INK}`,
      transform: `rotate(${rot}deg)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: w * 0.06,
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: w * 0.3, color: toon.orangeDark, whiteSpace: "nowrap" }}>{text}</div>
    <div style={{ width: "62%", height: w * 0.04, borderRadius: 99, background: "#D9DCEB" }} />
    <div style={{ width: "46%", height: w * 0.04, borderRadius: 99, background: "#D9DCEB" }} />
  </div>
);

// Lembar kertas dengan lipatan sudut: logo sederhana (pengganti logo resmi).
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

export const Cloud: React.FC<{ readonly x: number; readonly y: number; readonly s: number }> = ({ x, y, s }) => (
  <svg width={260 * s} height={130 * s} viewBox="0 0 260 130" style={{ position: "absolute", left: x, top: y }}>
    <path d="M50,110 Q10,110 14,80 Q18,56 46,58 Q52,24 96,24 Q132,6 160,34 Q204,22 214,62 Q250,66 244,96 Q240,112 210,110 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

export const Bubble: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly at: number; readonly text: string }> = ({ x, y, t, at, text }) => (
  <Place x={x} y={y} t={t} at={at} origin="0% 100%">
    <div
      style={{
        minWidth: 130,
        padding: "10px 34px 14px",
        background: "#fff",
        border: `6px solid ${INK}`,
        borderRadius: 60,
        boxShadow: `0 6px 0 ${INK}`,
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: 110,
        lineHeight: 1,
        color: toon.orange,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  </Place>
);

// ---------- S-01 Hook ----------
const S01: React.FC<V> = ({ t }) => {
  const bacts = Array.from({ length: 10 }, (_, i) => ({
    x: 30 + (i % 3) * 124 + (Math.floor(i / 3) % 2) * 30,
    y: 560 + Math.floor(i / 3) * 112,
  }));
  const qrot = 8 * Math.sin(t * 3);
  return (
    <>
      <Sh t={t} to={4.4}>
        {() => (
          <>
            <Tag text="MITOS" kind="mitos" t={t} />
            <Place x={380} y={450} t={t} at={0.05} dy={bob(t, 6, 2.5)}>
              <BodySilhouette w={320} h={640} t={t} glow={appear(t, 0.2, 0.6)} uid="s01" />
            </Place>
            {bacts.map((b, i) => (
              <Mv key={i} t={t} from={[500, 730]} to={[b.x, b.y]} at={0.3 + i * 0.13} dur={0.75} hop={36}>
                <Bacteria size={118} t={t} phase={i} mood={i % 4 === 0 ? "laugh" : "happy"} />
              </Mv>
            ))}
            <Mv t={t} from={[560, 760]} to={[800, 760]} at={1.9} dur={0.8} hop={20}>
              <Cell size={130} t={t} mood="worry" />
            </Mv>
            <BigWord text="10 : 1 ?" t={t} at={cue("s01", "Sepuluh") - 0.1} y={300} size={200} color={toon.orange} width={900} />
          </>
        )}
      </Sh>
      <Sh t={t} from={4.3}>
        {() => (
          <>
            <Place x={310} y={440} t={t} at={4.35} rot={qrot}>
              <div
                style={{
                  width: 460,
                  height: 460,
                  borderRadius: 460,
                  background: toon.orange,
                  border: `10px solid ${INK}`,
                  boxShadow: `0 12px 0 ${INK}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: toonFont(),
                  fontWeight: 700,
                  fontSize: 380,
                  color: "#fff",
                  WebkitTextStroke: `12px ${INK}`,
                  paintOrder: "stroke fill",
                }}
              >
                ?
              </div>
            </Place>
            <Place x={90} y={950} t={t} at={4.6} dy={bob(t, 8, 3)}>
              <Bacteria size={230} t={t} mood="think" look={[0.8, -0.4]} />
            </Place>
            <Place x={760} y={930} t={t} at={4.8} dy={bob(t, 8, 3, 2)}>
              <Cell size={200} t={t} mood="oh" look={[-0.8, -0.4]} />
            </Place>
            <BigWord text="Dari mana?" t={t} at={cue("s01", "Dari mana")} y={1180} size={130} color={toon.blue} />
            <Sparkle x={150} y={470} t={t} size={60} />
            <Sparkle x={850} y={420} t={t} size={70} phase={2} />
            <Sparkle x={880} y={760} t={t} size={50} phase={4} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-02 Satu lembar, satu cerita ----------
const S02: React.FC<V> = ({ t }) => {
  const p = slide(t, 0.05, 0.8);
  const fade = appear(t, 0.7, 0.4);
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
        <div style={{ opacity: fade, transform: `scale(${pop(t, 0.6)})` }}>
          <LogoSheet w={230} />
        </div>
        <div style={{ opacity: fade, fontFamily: toonFont(), fontWeight: 700, fontSize: 54, letterSpacing: 5, color: INK }}>SUHUF PENGETAHUAN</div>
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

// ---------- S-03 Tahun 1972, perkiraan kasar ----------
const S03: React.FC<V> = ({ t }) => {
  const hx = 128 + 7 * Math.sin(t * 9);
  const hy = 158 + 4 * Math.cos(t * 11);
  const shake = (ph: number) => 11 * Math.sin(t * 8 + ph);
  return (
    <>
      <Sh t={t} to={3.55}>
        {() => (
          <>
            <Place x={190} y={430} t={t} at={0.05} origin="50% 50%">
              <Calendar w={700} t={t} flipAt={0.5} reveal={pop(t, cue("s03", "1972") - 0.35, 0.5)} />
            </Place>
            <Sparkle x={140} y={430} t={t} size={64} phase={1} />
            <Sparkle x={880} y={1060} t={t} size={70} phase={3} />
          </>
        )}
      </Sh>
      <Sh t={t} from={3.45}>
        {() => (
          <>
            <BigWord text={"PERKIRAAN\nKASAR"} t={t} at={clipStart("s03", "s03_02")} y={330} size={128} color={toon.orange} />
            <Place x={50} y={640} t={t} at={3.5} dy={bob(t, 5, 2.4)} origin="50% 100%">
              <Detective size={440} t={t} mood="think" hand={[hx, hy]}>
                <rect x={96} y={150} width={58} height={46} rx={4} fill="#fff" stroke={INK} strokeWidth={3.5} transform="rotate(-8 125 173)" />
                <path d="M104,162 L140,158 M104,172 L146,168 M104,182 L130,179" stroke="#9AA0BE" strokeWidth={3} strokeLinecap="round" fill="none" />
                <PencilG x={hx} y={hy} rot={25 + 8 * Math.sin(t * 9)} />
              </Detective>
            </Place>
            <Place x={640} y={880} t={t} at={clipStart("s03", "s03_03") - 0.2} rot={shake(0)} origin="50% 100%">
              <Bacteria size={250} t={t} mood="worry" />
            </Place>
            <Place x={680} y={1090} t={t} at={clipStart("s03", "s03_03")} rot={shake(2)} origin="50% 100%">
              <Bacteria size={200} t={t} phase={1} mood="oh" />
            </Place>
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-04 Perumpamaan stadion ----------
const S04: React.FC<V> = ({ t }) => {
  const fillP = interpolate(t, [cue("s04", "Kamu kira") - 0.1, cue("s04", "sampai ke pojok") + 0.3], [0, 1], clamp01);
  const zoomP = slide(t, 5.9, 0.9);
  const zoom = 1 + 1.5 * zoomP;
  const corner = appear(t, 6.1, 0.4);
  return (
    <>
      <Tag text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 340,
          width: 960,
          height: 840,
          borderRadius: 48,
          overflow: "hidden",
          border: `7px solid ${INK}`,
          boxShadow: `0 10px 0 ${INK}`,
          background: "#E9DCB8",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 45,
            transformOrigin: "717px 138px",
            transform: `scale(${zoom})`,
          }}
        >
          <Stadium w={900} fill={fillP} emptyCorner={corner} t={t} />
        </div>
      </div>
      <Sh t={t} to={3.1}>
        {() => (
          <>
            <Place x={90} y={1230} t={t} at={0.4} dy={bob(t, 6, 3)}>
              <Cell size={150} t={t} mood="think" look={[0.6, -0.5]} arms={{ r: 150 }} />
            </Place>
            <Bubble x={250} y={1190} t={t} at={0.9} text="?" />
          </>
        )}
      </Sh>
      <Sh t={t} from={3.0} to={5.9}>
        {() => (
          <Place x={90} y={1230} t={t} at={3.05} dy={bob(t, 10, 6)}>
            <Cell size={150} t={t} mood="laugh" arms={{ l: 165, r: 165 }} />
          </Place>
        )}
      </Sh>
      <BigWord text="KEBESARAN" t={t} at={6.5} y={1235} size={118} color={toon.red} />
    </>
  );
};

// ---------- S-05 Usus besar ----------
const S05: React.FC<V> = ({ t }) => {
  const tBig = cue("s05", "usus besar");
  const focus = slide(t, cue("s05", "Padahal") - 0.1, 1.0);
  // Bakteri kecil di sepanjang saluran (awal), lalu menyusut dan berkumpul di usus besar.
  const along = [
    [480, 480],
    [560, 520],
    [470, 600],
    [560, 640],
    [500, 700],
    [590, 760],
  ];
  const inColon = [
    [452, 790],
    [452, 870],
    [506, 716],
    [570, 716],
    [626, 790],
    [626, 870],
  ];
  const meet = [
    { x: 170, y: 640, side: "l" },
    { x: 110, y: 800, side: "l" },
    { x: 170, y: 940, side: "l" },
    { x: 780, y: 640, side: "r" },
    { x: 830, y: 800, side: "r" },
    { x: 770, y: 940, side: "r" },
  ];
  const showAlong = 1 - appear(t, cue("s05", "Padahal") + 0.1, 0.4);
  return (
    <>
      <Tag text="SKEMA" kind="skema" t={t} />
      <Place x={340} y={330} t={t} at={0.05} origin="50% 50%">
        <BodySilhouette w={400} h={800} t={t} glow={0.55} tract="focus" focus={focus} uid="s05" />
      </Place>
      {along.map(([x, y], i) => (
        <div key={i} style={{ opacity: showAlong }}>
          <Place x={x - 30} y={y - 20} t={t} at={0.5 + i * 0.45} dy={bob(t, 3, 4, i)}>
            <Bacteria size={62} t={t} phase={i} mood="happy" />
          </Place>
        </div>
      ))}
      {inColon.map(([x, y], i) => (
        <Place key={i} x={x - 28} y={y - 20} t={t} at={tBig + 0.2 + i * 0.1} dy={bob(t, 3, 5, i)}>
          <Bacteria size={70} t={t} phase={i} mood="laugh" />
        </Place>
      ))}
      {meet.map((m, i) => (
        <Mv
          key={i}
          t={t}
          from={[m.side === "l" ? -170 : 1100, m.y]}
          to={[m.x, m.y]}
          at={tBig + 0.1 + i * 0.12}
          dur={0.7}
          hop={22}
        >
          <div style={{ transform: `translateY(${bob(t, 7, 5, i * 1.3)}px) scaleX(${m.side === "l" ? 1 : -1})` }}>
            <Bacteria size={150} t={t} phase={i} mood="laugh" arms={{ l: 150, r: 150 }} />
          </div>
        </Mv>
      ))}
      <BigWord text="USUS BESAR" t={t} at={tBig} y={1180} size={130} color={toon.orange} />
    </>
  );
};

// ---------- S-06 Angka disalin dan diulang ----------
const S06: React.FC<V> = ({ t }) => {
  const stack = Math.max(0, Math.min(7, Math.floor((t - 0.5) * 4)));
  const flyers = [0, 1, 2, 3, 4];
  return (
    <>
      <Sh t={t} to={2.3}>
        {() => (
          <>
            <Place x={60} y={760} t={t} at={0.05} dy={bob(t, 7, 4)}>
              <Cell size={210} t={t} mood="happy" arms={{ r: 100 }} />
            </Place>
            <Place x={420} y={800} t={t} at={0.15} dy={bob(t, 7, 4, 1)}>
              <Bacteria size={250} t={t} mood="happy" arms={{ l: 100, r: 100 }} />
            </Place>
            <Place x={830} y={760} t={t} at={0.25} dy={bob(t, 7, 4, 2)}>
              <Cell size={190} t={t} mood="happy" arms={{ l: 100 }} />
            </Place>
            {flyers.map((i) => {
              const s = 0.3 + i * 0.4;
              const u = (t - s) / 0.85;
              if (u <= 0 || u >= 1) {
                return null;
              }
              const leg = u < 0.5 ? u * 2 : (u - 0.5) * 2;
              const x0 = u < 0.5 ? 210 : 560;
              const x1 = u < 0.5 ? 560 : 900;
              return (
                <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * leg - 55, top: 620 - Math.sin(Math.PI * leg) * 150 }}>
                  <Paper w={110} rot={u * 300} />
                </div>
              );
            })}
            {Array.from({ length: stack }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: 400 + (i % 2) * 18 - 10 * (i % 3), top: 1110 - i * 22 }}>
                <Paper w={190} rot={((i * 37) % 15) - 7} />
              </div>
            ))}
          </>
        )}
      </Sh>
      <Sh t={t} from={2.2}>
        {() => (
          <>
            {Array.from({ length: 26 }, (_, i) => {
              const x = 20 + random(`s06x${i}`) * 900;
              const s = 2.25 + random(`s06s${i}`) * 1.4;
              const fall = (t - s) / 1.5;
              const startY = -260;
              const endY = 780 + random(`s06e${i}`) * 560;
              const y = startY + (endY - startY) * Math.min(1, Math.max(0, fall)) ** 0.8;
              if (t < s) {
                return null;
              }
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y }}>
                  <Paper w={120 + random(`s06w${i}`) * 60} rot={(random(`s06r${i}`) - 0.5) * 70 + Math.sin(t * 2 + i) * 4} />
                </div>
              );
            })}
            <SmallText text="diulang puluhan tahun" t={t} at={2.4} y={330} size={66} color={INK} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-07 Hitung ulang: 38 vs 30 ----------
export const crowdPos = (n: number, cols: number, dx: number, dy: number) =>
  Array.from({ length: n }, (_, i) => ({
    x: (i % cols) * dx + (Math.floor(i / cols) % 2) * (dx * 0.25),
    y: Math.floor(i / cols) * dy,
  }));

const S07: React.FC<V> = ({ t }) => {
  const left = crowdPos(16, 4, 118, 96);
  const right = crowdPos(13, 4, 118, 108);
  const tCount = cue("s07", "sekitar 38");
  const tCell = cue("s07", "sekitar 30");
  const chalk = (i: number) => appear(t, 0.5 + i * 0.25, 0.2);
  return (
    <>
      <Tag text="SKEMA" kind="skema" t={t} />
      <Sh t={t} to={2.5}>
        {() => (
          <>
            <div
              style={{
                position: "absolute",
                left: 100,
                top: 400,
                width: 880,
                height: 520,
                background: "#3F7F5F",
                border: `14px solid #B9774A`,
                borderRadius: 24,
                boxShadow: `0 0 0 6px ${INK}, 0 14px 0 6px ${INK}`,
              }}
            >
              <svg width={852} height={492} viewBox="0 0 852 492" style={{ position: "absolute", inset: 0 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <g key={i} opacity={chalk(i)} stroke="#F4F6EE" strokeWidth={9} strokeLinecap="round" fill="none">
                    <circle cx={120 + (i % 3) * 230} cy={140 + Math.floor(i / 3) * 190} r={46} />
                    <path d={`M${60 + (i % 3) * 230},${200 + Math.floor(i / 3) * 190} l30,-8`} />
                  </g>
                ))}
              </svg>
            </div>
            <Place x={120} y={990} t={t} at={0.3} dy={bob(t, 5, 3)}>
              <Detective size={250} t={t} mood="happy" hand={[130, 70]} />
            </Place>
            <Place x={700} y={990} t={t} at={0.45} dy={bob(t, 5, 3, 2)}>
              <Detective size={250} t={t} phase={1} mood="think" hat="#5D8F58" hand={[132, 66]} />
            </Place>
          </>
        )}
      </Sh>
      <Sh t={t} from={2.4} to={4.0}>
        {() => (
          <>
            <Place x={390} y={380} t={t} at={2.45} dy={bob(t, 5, 3)} origin="50% 50%">
              <BodySilhouette w={300} h={600} t={t} fill={toon.blueLight} uid="s07" />
            </Place>
            <SmallText text="Pria dewasa rata-rata" t={t} at={2.7} y={1060} size={62} color={INK} />
          </>
        )}
      </Sh>
      <Sh t={t} from={3.9}>
        {() => (
          <>
            <BigWord text={"~38\nTRILIUN"} t={t} at={tCount} y={330} size={104} color={toon.orange} cx={290} width={540} />
            {left.map((c, i) => (
              <Place key={i} x={42 + c.x} y={720 + c.y} t={t} at={tCount + 0.05 + i * 0.06} dy={bob(t, 4, 4, i)}>
                <Bacteria size={108} t={t} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} />
              </Place>
            ))}
            <BigWord text={"~30\nTRILIUN"} t={t} at={tCell} y={330} size={104} color={toon.blue} cx={790} width={540} />
            {right.map((c, i) => (
              <Place key={i} x={570 + c.x} y={730 + c.y} t={t} at={tCell + 0.05 + i * 0.06} dy={bob(t, 4, 4, i + 1)}>
                <Cell size={96} t={t} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} />
              </Place>
            ))}
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-08 Hampir sama banyak: tarik tambang ----------
const S08: React.FC<V> = ({ t }) => {
  const tTug = 1.85;
  const sway = 7 * Math.sin(t * 4.5);
  const strike = slide(t, cue("s08", "Bukan sepuluh") + 0.1, 0.45);
  const strike2 = slide(t, cue("s08", "Bukan sepuluh") + 0.4, 0.4);
  return (
    <>
      <Sh t={t} to={2.0}>
        {() => (
          <>
            <BigWord text={"HAMPIR\nSAMA BANYAK"} t={t} at={0.15} y={350} size={124} color={toon.orange} />
            <Place x={110} y={860} t={t} at={0.35} dy={bob(t, 10, 5)}>
              <Bacteria size={310} t={t} mood="laugh" arms={{ l: 160, r: 160 }} />
            </Place>
            <Place x={660} y={800} t={t} at={0.5} dy={bob(t, 10, 5, 2)}>
              <Cell size={280} t={t} mood="laugh" arms={{ l: 160, r: 160 }} />
            </Place>
            <Sparkle x={90} y={760} t={t} size={70} />
            <Sparkle x={900} y={720} t={t} size={80} phase={2} />
          </>
        )}
      </Sh>
      <Sh t={t} from={tTug - 0.1} to={6.5}>
        {() => (
          <>
            <Tag text="PERUMPAMAAN - bukan data" kind="analogi" t={t} at={tTug} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 940, height: 110, background: toon.green, borderTop: `7px solid ${INK}`, borderBottom: `7px solid ${INK}` }} />
            <svg width={1080} height={300} viewBox="0 0 1080 300" style={{ position: "absolute", left: 0, top: 660 }}>
              <line x1={540} y1={150} x2={540} y2={280} stroke={INK} strokeWidth={6} strokeDasharray="12 10" />
            </svg>
            {[0, 1, 2].map((i) => (
              <Place key={i} x={22 + i * 165} y={818 + (i % 2) * 8} t={t} at={tTug + 0.1 + i * 0.12} rot={-10 + sway * 0.3} origin="50% 100%">
                <Bacteria size={168} t={t} phase={i} mood="laugh" arms={{ r: 100 }} />
              </Place>
            ))}
            {[0, 1, 2].map((i) => (
              <Place key={i} x={600 + i * 150} y={796 + (i % 2) * 8} t={t} at={tTug + 0.2 + i * 0.12} rot={10 + sway * 0.3} origin="50% 100%">
                <Cell size={144} t={t} phase={i} mood="laugh" arms={{ l: 100 }} />
              </Place>
            ))}
            <svg width={1080} height={300} viewBox="0 0 1080 300" style={{ position: "absolute", left: 0, top: 660 }}>
              <path d={`M20,${232 + sway * 0.2} Q540,${262 + sway} 1060,${232 - sway * 0.2}`} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
              <path d={`M20,${232 + sway * 0.2} Q540,${262 + sway} 1060,${232 - sway * 0.2}`} fill="none" stroke="#D9A66B" strokeWidth={15} strokeLinecap="round" strokeDasharray="20 7" />
              <g transform={`translate(${540 + sway * 0.6} ${247 + sway * 0.5})`}>
                <circle r={13} fill={toon.red} stroke={INK} strokeWidth={5} />
                <path d="M0,-12 L0,-70" stroke={INK} strokeWidth={6} />
                <path d="M0,-70 L52,-52 L0,-34 Z" fill={toon.red} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
              </g>
            </svg>
            <BigWord text="SERU!" t={t} at={3.6} y={400} size={130} color={toon.blue} rot={-5} />
            <Sparkle x={120} y={560} t={t} size={64} />
            <Sparkle x={900} y={540} t={t} size={72} phase={2} />
          </>
        )}
      </Sh>
      <Sh t={t} from={6.35}>
        {() => (
          <>
            <BigWord text="10 : 1" t={t} at={6.4} y={560} size={310} color={toon.orange} />
            <svg width={1080} height={900} viewBox="0 0 1080 900" style={{ position: "absolute", left: 0, top: 360 }}>
              <path d="M130,230 L930,570" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - strike)} fill="none" />
              <path d="M130,230 L930,570" stroke={toon.red} strokeWidth={30} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - strike)} fill="none" />
              <path d="M930,250 L150,590" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - strike2)} fill="none" />
              <path d="M930,250 L150,590" stroke={toon.red} strokeWidth={30} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - strike2)} fill="none" />
            </svg>
            <Place x={140} y={1080} t={t} at={6.5} dy={bob(t, 6, 4)}>
              <Bacteria size={200} t={t} mood="laugh" />
            </Place>
            <Place x={740} y={1060} t={t} at={6.6} dy={bob(t, 6, 4, 2)}>
              <Cell size={180} t={t} mood="laugh" />
            </Place>
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-09 Ini perkiraan ----------
const S09: React.FC<V> = ({ t }) => {
  const wob = (ph: number) => ({
    transform: `translate(${6 * Math.sin(t * 3 + ph)}px, ${8 * Math.sin(t * 2.3 + ph * 2)}px) rotate(${3 * Math.sin(t * 2 + ph)}deg)`,
    filter: `blur(${5 + 4 * Math.sin(t * 2.6 + ph)}px)`,
  });
  const lvl = [0.95, 0.4, 0.7];
  return (
    <>
      <Sh t={t} to={2.5}>
        {() => (
          <>
            <Cloud x={70} y={400} s={1.6} />
            <Cloud x={560} y={780} s={1.5} />
            <Cloud x={120} y={1050} s={1.3} />
            <div
              style={{
                position: "absolute",
                left: 70,
                top: 470,
                fontFamily: toonFont(),
                fontWeight: 700,
                fontSize: 210,
                color: toon.orange,
                WebkitTextStroke: `10px ${INK}`,
                paintOrder: "stroke fill",
                ...wob(0),
              }}
            >
              ~38
            </div>
            <div
              style={{
                position: "absolute",
                left: 620,
                top: 850,
                fontFamily: toonFont(),
                fontWeight: 700,
                fontSize: 210,
                color: toon.blue,
                WebkitTextStroke: `10px ${INK}`,
                paintOrder: "stroke fill",
                ...wob(2),
              }}
            >
              ~30
            </div>
            <Place x={160} y={1060} t={t} at={0.6} dy={bob(t, 6, 3)}>
              <Cell size={170} t={t} mood="think" look={[0.5, -0.5]} />
            </Place>
          </>
        )}
      </Sh>
      <Sh t={t} from={2.4}>
        {() => (
          <>
            {[
              { x: 70, w: 230, h: 480, fill: toon.blueLight },
              { x: 420, w: 230, h: 400, fill: toon.orangeLight },
              { x: 780, w: 230, h: 440, fill: "#CFEBC9" },
            ].map((b, i) => (
              <Place key={i} x={b.x} y={1140 - b.h} t={t} at={2.5 + i * 0.2} dy={bob(t, 5, 3, i * 2)}>
                <BodySilhouette w={b.w} h={b.h} t={t + i * 0.8} glow={lvl[i]} uid={`s09${i}`} fill={b.fill} />
              </Place>
            ))}
            <BigWord text="PERKIRAAN" t={t} at={2.6} y={300} size={140} color={toon.orange} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-10 Pelajaran: cek ulang ----------
const S10: React.FC<V> = ({ t }) => {
  const sx = 60;
  const sy = 560;
  const k = 440 / 160;
  const hand: [number, number] = [150 + 3 * Math.sin(t * 2.4), 118 + 4 * Math.cos(t * 2.1)];
  const hx = sx + hand[0] * k;
  const hy = sy + hand[1] * k;
  const r = 100;
  const rot = 40 + 5 * Math.sin(t * 2.4);
  const a = (rot * Math.PI) / 180;
  const lx = hx + Math.sin(a) * 2.3 * r;
  const ly = hy - Math.cos(a) * 2.3 * r;
  return (
    <>
      <Sh t={t} to={3.65}>
        {() => (
          <>
            <Place x={560} y={600} t={t} at={0.2} rot={4} origin="50% 50%">
              <Paper w={420} />
            </Place>
            <Place x={sx} y={sy} t={t} at={0.1} origin="50% 100%">
              <Detective size={440} t={t} mood="think" hand={hand} />
            </Place>
            <svg width={1080} height={1400} viewBox="0 0 1080 1400" style={{ position: "absolute", left: 0, top: 0, opacity: appear(t, 0.5, 0.3) }}>
              <MagnifierG x={lx} y={ly} r={r} rot={rot} />
            </svg>
          </>
        )}
      </Sh>
      <Sh t={t} from={3.55}>
        {() => (
          <>
            <Place x={30} y={880} t={t} at={3.6} dy={bob(t, 5, 3)} origin="50% 100%">
              <Detective size={310} t={t} mood="laugh" hand={[138, 72]} />
            </Place>
            <BigWord text="CEK" t={t} at={cue("s10", "Kadang")} y={420} size={250} color={toon.orange} cx={640} width={800} />
            <BigWord text="ULANG" t={t} at={cue("s10", "perlu dihitung")} y={700} size={250} color={toon.blue} cx={640} width={800} />
            <Sparkle x={880} y={380} t={t} size={80} />
            <Sparkle x={840} y={1010} t={t} size={60} phase={3} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-11 Penutup ----------
const S11: React.FC<V> = ({ t }) => (
  <>
    <Place x={420} y={380} t={t} at={0.05} dy={bob(t, 6, 3)} origin="50% 50%">
      <LogoSheet w={240} />
    </Place>
    <div style={{ position: "absolute", left: 0, right: 0, top: 710, textAlign: "center", opacity: appear(t, 0.3, 0.3), fontFamily: toonFont(), fontWeight: 700, fontSize: 56, letterSpacing: 5, color: INK }}>
      SUHUF PENGETAHUAN
    </div>
    <BigWord text="@suhufpengetahuan" t={t} at={0.3} y={820} size={84} color={toon.orange} width={1040} />
    <Place x={70} y={1010} t={t} at={0.4} dy={bob(t, 6, 4)} rot={-6}>
      <Bacteria size={290} t={t} mood="laugh" arms={{ l: 160 + 14 * Math.sin(t * 9) }} />
    </Place>
    <Place x={770} y={990} t={t} at={0.5} dy={bob(t, 6, 4, 2)} rot={6}>
      <Cell size={240} t={t} mood="laugh" arms={{ r: 160 + 14 * Math.sin(t * 9 + 1) }} />
    </Place>
    <Sparkle x={150} y={500} t={t} size={64} />
    <Sparkle x={850} y={520} t={t} size={70} phase={2} />
  </>
);

export const SHORTS_VISUALS: Record<string, React.FC<{ readonly t: number }>> = {
  s01: S01,
  s02: S02,
  s03: S03,
  s04: S04,
  s05: S05,
  s06: S06,
  s07: S07,
  s08: S08,
  s09: S09,
  s10: S10,
  s11: S11,
};

// SFX prosedural, volume rendah (SFX_MASTER di Sound.tsx). Waktu = detik relatif awal adegan.
export const SHORTS_SFX: Record<string, readonly Cue[]> = {
  s01: [
    [0.3, "whoosh", 0.45],
    [cue("s01", "Sepuluh") - 0.05, "pop", 0.8],
    [4.35, "pop", 0.6],
    [6.4, "shimmer", 0.3],
  ],
  s02: [
    [0.05, "page", 0.7],
    [0.9, "ding", 0.5],
  ],
  s03: [
    [0.45, "page", 0.6],
    [cue("s03", "1972") - 0.3, "pop", 0.6],
    [3.5, "whoosh", 0.4],
    [clipStart("s03", "s03_02"), "pencil", 0.6],
    [clipStart("s03", "s03_03") - 0.1, "pop", 0.5],
  ],
  s04: [
    [3.0, "crowd", 0.45],
    [5.95, "whoosh", 0.4],
    [6.6, "plop", 0.8],
  ],
  s05: [
    [0.5, "tick", 0.5],
    [1.0, "tick", 0.5],
    [1.5, "tick", 0.5],
    [cue("s05", "Padahal"), "shrink", 0.5],
    [cue("s05", "usus besar") + 0.1, "ding", 0.55],
  ],
  s06: [
    [0.3, "count", 0.45],
    [2.2, "page", 0.5],
    [2.6, "page", 0.4],
  ],
  s07: [
    [0.5, "pencil", 0.5],
    [2.45, "pop", 0.5],
    [cue("s07", "sekitar 38"), "ding", 0.6],
    [cue("s07", "sekitar 30"), "ding", 0.6],
  ],
  s08: [
    [0.15, "reveal", 0.5],
    [1.85, "pop", 0.5],
    [cue("s08", "Bukan sepuluh") + 0.1, "strike", 0.5],
    [cue("s08", "Bukan sepuluh") + 0.7, "tingtong", 0.6],
  ],
  s09: [
    [0.2, "shimmer", 0.35],
    [2.5, "pop", 0.5],
  ],
  s10: [
    [0.2, "pop", 0.5],
    [cue("s10", "Kadang"), "ding", 0.5],
    [cue("s10", "perlu dihitung"), "ding", 0.5],
  ],
  s11: [[0.25, "ding", 0.5]],
};
