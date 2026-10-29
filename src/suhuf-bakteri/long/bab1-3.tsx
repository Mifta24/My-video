import type React from "react";
import { interpolate } from "remotion";
import type { Cue } from "../elements/Sound";
import { appear, bob, Place, pop, Sh, Sparkle, slide, toonFont } from "../elements/ToonKit";
import { Bacteria, BodySilhouette, Calendar, Cell } from "../shorts/characters";
import { hopMotion, mvToy, Stage3D, Toy } from "../shorts/toy3d";
import { toon } from "../theme";
import { cue } from "../timing";
import { Bubble, crowdPos, LogoSheet, Paper } from "../shorts/visuals";
import { Big, Board, BodyCell, Det, INK, Lbl, lensCenter, Person, Pinned, QOrb, Stamp, Str, wig } from "./kit";
import { Stadium3D, stadiumProject, type StadiumPose } from "./stadium3d";

type V = { readonly t: number };
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp01, easing: (x) => x * x * (3 - 2 * x) });

// ---------- L-01 Hook: 10 : 1 ----------
const L01: React.FC<V> = ({ t }) => {
  const tSep = cue("l01", "Sepuluh");
  const glow = interpolate(t, [0.3, 1.8], [0, 1], clamp01);
  const bacts = crowdPos(10, 5, 140, 110);
  return (
    <>
      <Lbl text="MITOS" kind="mitos" t={t} at={tSep - 0.1} />
      <Sh t={t} to={4.4}>
        {() => (
          <>
            <div style={{ position: "absolute", left: 470, top: 215 }}>
              <BodySilhouette w={290} h={580} t={t} glow={glow} uid="l01a" />
            </div>
            <Big text="10 : 1" t={t} at={tSep} y={330} cx={1380} width={800} size={290} color={toon.orange} pulse={tSep} />
            {[0, 1, 2].map((i) => (
              <Place key={i} x={720 + i * 40} y={440 + i * 70} t={t} at={0.9 + i * 0.5} dy={-6 * Math.abs(Math.sin(t * 3 + i))}>
                <Bacteria size={110} t={t} phase={i} mood="laugh" />
              </Place>
            ))}
          </>
        )}
      </Sh>
      <Sh t={t} from={4.3}>
        {() => (
          <>
            <div style={{ position: "absolute", left: 810, top: 170 }}>
              <BodySilhouette w={270} h={540} t={t} glow={1} uid="l01b" />
            </div>
            <Stage3D>
              {bacts.map((c, i) => {
                const m = mvToy(t, [830, 480], [90 + c.x, 300 + c.y], 4.5 + i * 0.07, 0.8, 30);
                return <Toy key={`b${i}`} kind="bact" size={118} {...m} t={t} phase={i} mood={i % 4 === 0 ? "laugh" : "happy"} yaw={10} dy={-5 * Math.abs(Math.sin(t * 3 + i)) * (t > 5.4 ? 1 : 0)} shadow={false} popDur={0.3} />;
              })}
              {[0, 1].map((i) => (
                <Toy key={`c${i}`} kind="cell" size={150} left={1230 + i * 220} top={280 + i * 70} t={t} at={5.2 + i * 0.2} mood="oh" yaw={-12} {...hopMotion(t, 5, 3, i, 5.8)} shadow={false} />
              ))}
            </Stage3D>
            <Big text="10 : 1" t={t} at={4.6} y={650} cx={1500} size={160} color={toon.orange} width={700} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-02 Dua pertanyaan ----------
const L02: React.FC<V> = ({ t }) => {
  const k = slide(t, 3.5, 0.8);
  return (
    <>
      <Sh t={t} to={3.4}>
        {() => (
          <>
            <div style={{ position: "absolute", left: 790, top: 290 }}>
              <BodySilhouette w={340} h={600} t={t} glow={0.9} uid="l02" />
            </div>
            <Place x={810} y={120} t={t} at={0.3} rot={wig(t, 8, 3)}>
              <QOrb size={190} t={t} />
            </Place>
            <Big text="Benar?" t={t} at={cue("l02", "Dan apakah")} y={440} cx={470} width={600} size={170} color={toon.blue} />
          </>
        )}
      </Sh>
      <Sh t={t} from={3.3}>
        {() => (
          <>
            <Place x={560} y={330} t={t} at={3.5} rot={wig(t, 3, 2)}>
              <Paper w={380} text="10 : 1" />
            </Place>
            <Det x={1130 + (1 - k) * 600} y={290} size={440} t={t} mood="think" hand={[128, 150]} lens={110} lensRot={40} />
            <Big text="Benar?" t={t} at={3.6} y={140} cx={960} width={900} size={150} color={toon.blue} />
            <Sparkle x={1160} y={240} t={t} size={70} />
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-03 Salam pembuka ----------
const L03: React.FC<V> = ({ t }) => {
  const open = ease(t, 0.3, 1.2);
  return (
    <>
      <div style={{ position: "absolute", left: 700, top: 150 + (1 - open) * 700, opacity: open }}>
        <LogoSheet w={520} />
      </div>
      <Big text={"SATU LEMBAR,\nSATU CERITA"} t={t} at={cue("l03", "Satu lembar")} y={290} cx={1480} width={760} size={104} color={toon.orange} />
      <div style={{ position: "absolute", left: 0, width: 920, top: 800, textAlign: "center", fontFamily: toonFont(), fontWeight: 700, fontSize: 56, letterSpacing: 6, color: INK, opacity: appear(t, cue("l03", "Selamat datang"), 0.3) }}>
        SUHUF PENGETAHUAN
      </div>
      <Place x={150} y={380} t={t} at={cue("l03", "Hari ini")} >
        <Det x={0} y={0} size={340} t={t} mood="laugh" hand={[146, 60 + 6 * Math.sin(t * 9)]} />
      </Place>
      <Sparkle x={620} y={190} t={t} size={60} />
      <Sparkle x={1250} y={170} t={t} size={70} phase={2} />
    </>
  );
};

// ---------- L-04 Kata orang ----------
const L04: React.FC<V> = ({ t }) => {
  const xs = [270, 790, 1310];
  const whos = ["guru", "remaja", "kakek"] as const;
  const ats = [cue("l04", "bakteri di tubuh") + 0.1, cue("l04", "bakteri di tubuh") + 1.9, cue("l04", "bakteri di tubuh") + 3.5];
  const tSep = cue("l04", "Sepuluh banding satu");
  const echo = (i: number) => 0.14 * Math.max(0, 1 - Math.abs(t - tSep - i * 0.18 - 0.15) / 0.3);
  return (
    <>
      <Big text="KATA ORANG" t={t} at={0.3} y={130} size={110} color={toon.blue} width={1200} />
      {whos.map((w, i) => (
        <Place key={w} x={xs[i]} y={450} t={t} at={0.6 + i * 0.25} origin="50% 100%" dy={bob(t, 5, 2.6, i)}>
          <Person size={340} who={w} t={t} phase={i} mood={t > ats[i] ? "laugh" : "happy"} />
        </Place>
      ))}
      {xs.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${1 + echo(i)})`, transformOrigin: `${x + 130}px 430px` }}>
          <Bubble x={x + 70} y={250} t={t} at={ats[i]} text="10 : 1" />
          {t > ats[i] + 0.35 ? (
            <div style={{ position: "absolute", left: x + 190, top: 235, opacity: 0.5 * appear(t, ats[i] + 0.35, 0.2), fontFamily: toonFont(), fontWeight: 700, fontSize: 40, color: toon.orange }}>
              {i === 2 ? "10 : 1" : ""}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

// ---------- L-05 Kecil sekali ----------
const L05: React.FC<V> = ({ t }) => {
  const tKecil = cue("l05", "Bakteri itu");
  const grow = ease(t, tKecil, tKecil + 0.9);
  const [lx, ly] = lensCenter(250, 230, 500, [128, 150], 130, 40);
  const tJadi = cue("l05", "Jadi wajar");
  const dots = Array.from({ length: 26 }, (_, i) => ({ x: 1190 + ((i * 97) % 420), y: 260 + ((i * 61) % 330), i }));
  return (
    <>
      <Sh t={t} to={5.6}>
        {() => (
          <>
            <Det x={250} y={230} size={500} t={t} mood="think" hand={[128, 150]} lens={130} lensRot={40}>
              <circle cx={lx} cy={ly} r={4 + 2 * Math.sin(t * 6)} fill={toon.orange} opacity={1 - grow} />
              <g transform={`translate(${lx - 85 * grow} ${ly - 55 * grow}) scale(${grow})`} style={{ transformOrigin: "0 0" }}>
                <Bacteria size={170} t={t} mood="laugh" />
              </g>
            </Det>
            <Big text={"KECIL\nSEKALI"} t={t} at={tKecil} y={330} cx={1330} width={700} size={190} color={toon.orange} rot={-4} />
          </>
        )}
      </Sh>
      <Sh t={t} from={5.5}>
        {() => (
          <>
            <Place x={260} y={330} t={t} at={5.7}>
              <Person size={430} who="remaja" t={t} mood="think" />
            </Place>
            <div style={{ position: "absolute", left: 760, top: 150, width: 900, height: 520, borderRadius: 260, background: "#fff", border: `7px solid ${INK}`, boxShadow: `0 9px 0 ${INK}`, opacity: appear(t, tJadi - 1.2, 0.3) }}>
              <svg width={900} height={520} viewBox="0 0 900 520" style={{ position: "absolute", inset: 0 }}>
                {dots.map((d, i) => {
                  const a = appear(t, tJadi - 1 + i * 0.07, 0.12);
                  return <rect key={i} x={d.x - 760 + wig(t, 5, 2.4, i) - 230} y={d.y - 150 + wig(t, 5, 3, i * 2)} width={40} height={26} rx={13} fill={toon.orange} stroke={INK} strokeWidth={3} opacity={a} />;
                })}
              </svg>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 640 + i * 54, top: 520 + i * 40, width: 40 - i * 10, height: 40 - i * 10, borderRadius: 50, background: "#fff", border: `5px solid ${INK}`, opacity: appear(t, 5.8 + i * 0.1, 0.1) }} />
            ))}
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-06 Sel manusia (balok susun) ----------
const BODY = ["..XX..", "..XX..", ".XXXX.", "XXXXXX", "XXXXXX", ".XXXX.", ".XX.XX", ".XX.XX"];
const BLOCKS = [toon.orange, toon.blue, toon.yellow, toon.green, toon.red];
const L06: React.FC<V> = ({ t }) => {
  const cells: { r: number; c: number; i: number }[] = [];
  BODY.forEach((row, r) => [...row].forEach((ch, c) => ch === "X" && cells.push({ r, c, i: cells.length })));
  const spread = ease(t, 2.4, 3.8);
  const tDarah = cue("l06", "sel darah");
  const tOtot = cue("l06", "sel otot");
  const tKulit = cue("l06", "sel kulit");
  return (
    <>
      <Big text="SEL MANUSIA" t={t} at={0.3} y={130} size={110} color={toon.blue} width={1200} />
      <Sh t={t} to={4.6}>
        {() => (
          <>
            {cells.map(({ r, c, i }) => {
              const p = pop(t, 0.5 + i * 0.045, 0.4);
              const ang = (i * 2.399) % (Math.PI * 2);
              const ox = Math.cos(ang) * 190 * spread;
              const oy = Math.sin(ang) * 120 * spread;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 960 - 3 * 76 + c * 76 + ox,
                    top: 250 + r * 76 + oy,
                    width: 70,
                    height: 70,
                    borderRadius: 14,
                    background: BLOCKS[i % 5],
                    border: `5px solid ${INK}`,
                    boxShadow: `0 6px 0 ${INK}`,
                    transform: `scale(${p}) rotate(${spread * (i % 2 ? 8 : -8)}deg)`,
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ position: "absolute", left: 14, top: 8, width: 14, height: 14, borderRadius: 14, background: "#fff", opacity: 0.6 }} />
                </div>
              );
            })}
          </>
        )}
      </Sh>
      <Sh t={t} from={4.5}>
        {() => (
          <>
            {[
              { x: 330, kind: "red", at: tDarah, label: "sel darah", bg: toon.red },
              { x: 800, kind: "muscle", at: tOtot, label: "sel otot", bg: toon.blue },
              { x: 1270, kind: "skin", at: tKulit, label: "sel kulit", bg: toon.blueDark },
            ].map((o, i) => (
              <Place key={o.label} x={o.x} y={300} t={t} at={o.at - 0.2} origin="50% 100%" dy={bob(t, 6, 3, i)}>
                <BodyCell kind={o.kind as "red" | "muscle" | "skin"} size={310} t={t} phase={i} mood="laugh" />
              </Place>
            ))}
            {[
              { x: 485, at: tDarah, label: "sel darah", bg: toon.red },
              { x: 955, at: tOtot, label: "sel otot", bg: toon.blue },
              { x: 1425, at: tKulit, label: "sel kulit", bg: toon.blueDark },
            ].map((o) => (
              <div key={o.label} style={{ position: "absolute", left: o.x, top: 690, transform: `translate(-50%, 0) scale(${pop(t, o.at, 0.4)})`, fontFamily: toonFont(), fontWeight: 700, fontSize: 48, color: "#fff", background: o.bg, border: `5px solid ${INK}`, boxShadow: `0 5px 0 ${INK}`, borderRadius: 999, padding: "2px 28px 6px", whiteSpace: "nowrap" }}>
                {o.label}
              </div>
            ))}
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-07 Rekap bab 2 ----------
const L07: React.FC<V> = ({ t }) => {
  const line = ease(t, 2.2, 3.4);
  return (
    <>
      <Big text="Dari mana?" t={t} at={2.6} y={105} size={110} color={toon.blue} width={1100} />
      <div style={{ position: "absolute", left: 360, top: 250 }}>
        <Board w={1320} h={600} />
      </div>
      <Place x={560} y={320} t={t} at={0.5}>
        <div style={{ position: "relative" }}>
          <Pinned x={0} y={0} w={230} h={290} rot={-4}>
            <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 64, color: toon.orange, textAlign: "center", lineHeight: 1 }}>{"10\n:\n1"}</div>
          </Pinned>
        </div>
      </Place>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <Str x1={760} y1={500} x2={1380} y2={540} p={line} />
      </svg>
      <Place x={1300} y={440} t={t} at={2.2} rot={wig(t, 6, 3)}>
        <QOrb size={190} t={t} />
      </Place>
      <Place x={20} y={330} t={t} at={0.3}>
        <Det x={0} y={0} size={400} t={t} mood="think" hand={[132, 120 + 8 * Math.sin(t * 2)]} />
      </Place>
    </>
  );
};

// ---------- L-08 Tahun 1972 ----------
const L08: React.FC<V> = ({ t }) => (
  <>
    <Sh t={t} to={3.8}>
      {() => (
        <>
          <div style={{ position: "absolute", left: 640, top: 130 }}>
            <Calendar w={640} t={t} flipAt={0.5} reveal={pop(t, 2.1, 0.5)} />
          </div>
          <Sparkle x={620} y={220} t={t} size={70} />
          <Sparkle x={1240} y={260} t={t} size={60} phase={2} />
        </>
      )}
    </Sh>
    <Sh t={t} from={3.7}>
      {() => (
        <>
          <Big text="1972" t={t} at={3.9} y={180} size={220} color={toon.orange} width={700} cx={1420} />
          <div style={{ position: "absolute", left: 220, top: 820, width: 880, height: 40, background: "#C9965E", border: `6px solid ${INK}`, borderRadius: 12, boxShadow: `0 8px 0 ${INK}` }} />
          <Det x={400} y={230} size={440} t={t} mood="think" bare hand={[112 - 4 * Math.sin(t * 5), 40 + 5 * Math.sin(t * 5)]} />
          <Place x={1180} y={230} t={t} at={4.2}>
            <BodySilhouette w={300} h={600} t={t} glow={0.5} uid="l08" />
          </Place>
        </>
      )}
    </Sh>
  </>
);

// ---------- L-09 Tebakan kasar ----------
const L09: React.FC<V> = ({ t }) => {
  const tKasar = cue("l09", "perkiraan kasar");
  return (
    <>
      <Sh t={t} to={3.4}>
        {() => (
          <>
            <Det x={750} y={240} size={420} t={t} mood="think" bare hand={[126, 150]} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const pos = [[330, 380], [530, 560], [1250, 380], [1450, 560], [380, 700], [1400, 700]][i];
              return (
                <Place key={i} x={pos[0]} y={pos[1]} t={t} at={0.4 + i * 0.15} rot={wig(t, 12, 6, i)}>
                  <Bacteria size={150} t={t} phase={i} mood="worry" />
                </Place>
              );
            })}
            <Place x={900} y={170} t={t} at={1.2}>
              <QOrb size={130} t={t} color={toon.blue} />
            </Place>
          </>
        )}
      </Sh>
      <Sh t={t} from={3.3}>
        {() => (
          <>
            <Det x={260} y={230} size={500} t={t} mood="happy" bare hand={[150, 200 + 4 * Math.sin(t * 12)]} />
            <Place x={880} y={420} t={t} at={3.5} rot={-4}>
              <div style={{ position: "relative", width: 480, height: 308, background: "#FFF3D6", border: `6px solid ${INK}`, borderRadius: 14, boxShadow: `0 8px 0 ${INK}` }}>
                <svg width={480} height={308} viewBox="0 0 480 308" style={{ position: "absolute", inset: 0 }}>
                  <path d="M20,22 L240,160 L460,22" fill="none" stroke={INK} strokeWidth={4} />
                  <path d="M110,200 q30,-34 60,0 t60,0 t60,0 t60,0" fill="none" stroke={toon.blueDark} strokeWidth={7} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - ease(t, 3.8, 5.2))} />
                  <path d="M110,244 q30,-34 60,0 t60,0 t60,0" fill="none" stroke={toon.blueDark} strokeWidth={7} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - ease(t, 5.0, 6.0))} />
                </svg>
              </div>
            </Place>
            <div style={{ position: "absolute", left: 1180, top: 230, transform: "translateX(-50%)" }}>
              <Stamp text="PERKIRAAN KASAR" t={t} at={tKasar + 0.2} size={74} rot={-7} />
            </div>
            {[0, 1].map((i) => (
              <Place key={i} x={1480 + i * 130} y={560 + i * 40} t={t} at={4.2 + i * 0.3} rot={wig(t, 10, 6, i)}>
                <Bacteria size={150} t={t} phase={i} mood="worry" />
              </Place>
            ))}
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-10 Cara hitungnya ----------
const L10: React.FC<V> = ({ t }) => {
  const t1 = cue("l10", "sedikit isi usus");
  const t2 = cue("l10", "seluruh saluran");
  const t3 = cue("l10", "dikalikan");
  const tube = ease(t, t2, t2 + 1.2);
  return (
    <>
      <Lbl text="SKEMA" t={t} />
      <Place x={190} y={250} t={t} at={t1 - 0.3} origin="50% 50%">
        <div style={{ width: 520, height: 440, background: "#fff", border: `7px solid ${INK}`, borderRadius: 34, boxShadow: `0 9px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={420} height={260} viewBox="0 0 420 260">
            <path d="M120,130 L400,100" stroke={INK} strokeWidth={22} strokeLinecap="round" />
            <path d="M120,130 L400,100" stroke={toon.blueLight} strokeWidth={11} strokeLinecap="round" />
            <ellipse cx={92} cy={130} rx={86} ry={70} fill="#fff" stroke={INK} strokeWidth={7} />
            {[[62, 112], [100, 100], [112, 140], [70, 150], [128, 118], [84, 130]].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx={13} ry={9} fill={toon.orange} stroke={INK} strokeWidth={3} opacity={appear(t, t1 + i * 0.12, 0.15)} transform={`rotate(${i * 30} ${x} ${y})`} />
            ))}
          </svg>
        </div>
      </Place>
      <div style={{ position: "absolute", left: 190, width: 520, top: 715, textAlign: "center", fontFamily: toonFont(), fontWeight: 600, fontSize: 36, color: INK, opacity: appear(t, t1, 0.3) }}>bakteri di sedikit isi usus</div>
      <Place x={830} y={250} t={t} at={t2 - 0.3} origin="50% 50%">
        <div style={{ width: 520, height: 440, background: "#fff", border: `7px solid ${INK}`, borderRadius: 34, boxShadow: `0 9px 0 ${INK}` }}>
          <svg width={506} height={426} viewBox="0 0 506 426">
            <path d="M80,70 C80,140 420,80 420,170 C420,260 80,200 80,290 C80,370 420,330 420,380" fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" />
            <path d="M80,70 C80,140 420,80 420,170 C420,260 80,200 80,290 C80,370 420,330 420,380" fill="none" stroke={toon.orangeLight} strokeWidth={30} strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - tube)} />
          </svg>
        </div>
      </Place>
      <div style={{ position: "absolute", left: 830, width: 520, top: 715, textAlign: "center", fontFamily: toonFont(), fontWeight: 600, fontSize: 36, color: INK, opacity: appear(t, t2, 0.3) }}>isi seluruh saluran pencernaan</div>
      <Place x={745} y={400} t={t} at={t3} origin="50% 50%">
        <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 110, color: toon.orangeDark, WebkitTextStroke: `8px ${INK}`, paintOrder: "stroke fill" }}>×</div>
      </Place>
      <Place x={1390} y={300} t={t} at={t3 + 0.5} origin="50% 50%" rot={wig(t, 6, 3)}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 100, color: INK }}>=</div>
          <QOrb size={190} t={t} />
        </div>
      </Place>
    </>
  );
};

// ---------- L-11 / L-12 Perumpamaan stadion (3D) ----------
const centerPose = (base: StadiumPose, u: number, v: number, tx: number, ty: number): StadiumPose => {
  let p = base;
  for (let k = 0; k < 3; k++) {
    const pr = stadiumProject(p, u, v);
    p = { ...p, x: p.x + (tx - pr.x), y: p.y + (ty - pr.y) };
  }
  return p;
};

const L11: React.FC<V> = ({ t }) => {
  const tRow = cue("l11", "Kamu menghitung");
  const tAll = cue("l11", "Lalu kamu mengira");
  const rows = ease(t, tRow, tRow + 1.4);
  const fill = ease(t, tAll + 0.3, tAll + 3.2);
  const pose: StadiumPose = { tilt: -0.55 + 0.18 * ease(t, 0, 10), scale: 0.8 + 0.06 * ease(t, 0, 10), x: 960, y: 535, yaw: 0.04 * Math.sin(t * 0.5) };
  const row = stadiumProject(pose, 300, 34);
  return (
    <>
      <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <Stage3D>
        <Stadium3D state={{ fill, rows: fill < 0.02 ? rows : 0 }} pose={pose} />
      </Stage3D>
      {rows > 0.3 && fill < 0.02 ? (
        <Place x={row.x - 60} y={row.y - 120} t={t} at={tRow + 0.6} origin="50% 100%">
          <Sparkle x={0} y={0} t={t} size={70} />
        </Place>
      ) : null}
    </>
  );
};

const L12: React.FC<V> = ({ t }) => {
  const zoom = ease(t, 2.0, 4.2);
  const base: StadiumPose = { tilt: -0.5 + 0.1 * zoom, scale: 0.8 + 1.24 * zoom, x: 960, y: 535, yaw: 0 };
  const far = centerPose({ ...base, scale: 2.04, tilt: -0.4 }, 478, 92, 960, 500);
  const pose: StadiumPose = { tilt: base.tilt, scale: base.scale, x: 960 + (far.x - 960) * zoom, y: 535 + (far.y - 535) * zoom, yaw: 0 };
  const corner = stadiumProject(pose, 478, 92);
  const empty = ease(t, 0.7, 1.7);
  const tKebesaran = cue("l12", "kebesaran");
  const birdX = interpolate(t, [3.2, 6.2], [corner.x - 380, corner.x + 480], clamp01);
  return (
    <>
      <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <Stage3D>
        <Stadium3D state={{ fill: 1, emptyCorner: empty }} pose={pose} />
      </Stage3D>
      {zoom > 0.9 ? (
        <>
          <Place x={corner.x - 70} y={corner.y - 140} t={t} at={3.9} origin="50% 100%">
            <Cell size={150} t={t} mood="think" arms={{ r: 150 + 12 * Math.sin(t * 7) }} look={[-0.6, -0.2]} />
          </Place>
        </>
      ) : null}
      {t > 3.2 ? <div style={{ position: "absolute", left: birdX, top: corner.y - 250 + 20 * Math.sin(t * 3) }}>{/* burung kecil */}<BirdTiny t={t} /></div> : null}
      <Big text="KEBESARAN" t={t} at={tKebesaran} y={760} size={140} color={toon.red} width={1200} />
    </>
  );
};

const BirdTiny: React.FC<V> = ({ t }) => (
  <svg width={110} height={90} viewBox="0 0 60 48" style={{ overflow: "visible" }}>
    <path d="M10,28 Q10,10 30,10 Q50,10 50,28 Q50,42 30,42 Q10,42 10,28 Z" fill={toon.blue} stroke={INK} strokeWidth={4} />
    <path d="M48,24 L58,28 L48,32 Z" fill={toon.yellow} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={38} cy={22} r={5} fill="#fff" stroke={INK} strokeWidth={2.6} />
    <circle cx={39.5} cy={22} r={2.2} fill={INK} />
    <path d={`M20,30 Q14,${20 + 6 * Math.sin(t * 9)} 26,${24 + 4 * Math.sin(t * 9)}`} fill={toon.blueDark} stroke={INK} strokeWidth={3} />
  </svg>
);

// ---------- L-13 Bukan soal salah ----------
const L13: React.FC<V> = ({ t }) => (
  <>
    <Big text={"BUKAN SOAL SALAH"} t={t} at={0.3} y={115} size={104} color={toon.blue} width={1500} />
    {Array.from({ length: 7 }, (_, i) => {
      const x = ((1 - ((t * 0.12 + i / 7) % 1)) * 1700) + 100;
      return (
        <div key={i} style={{ position: "absolute", left: x, top: 600 + 40 * Math.sin(i * 2.1), opacity: 0.9, transform: `rotate(${wig(t, 5, 2, i)}deg)` }}>
          <Calendar w={190} t={t} flipAt={9999} reveal={0} />
        </div>
      );
    })}
    <Place x={720} y={220} t={t} at={0.5} dy={bob(t, 5, 2.4)}>
      <Det x={0} y={0} size={480} t={t} mood="laugh" bare hand={[148, 42 + 5 * Math.sin(t * 6)]} />
    </Place>
    <Place x={1230} y={420} t={t} at={cue("l13", "wajar")}>
      <svg width={120} height={120} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <circle cx={50} cy={50} r={44} fill={toon.yellow} stroke={INK} strokeWidth={5} />
        <path d="M24,54 L42,54 L42,78 L24,78 Z M42,56 L52,30 Q60,28 60,38 L58,48 L76,48 Q82,50 80,56 L76,72 Q74,78 68,78 L42,78 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </Place>
  </>
);

// ---------- L-14 Pesan berantai ----------
const L14: React.FC<V> = ({ t }) => {
  const shirts = [toon.blue, toon.orange, toon.green, toon.red, toon.blueDark];
  const tMid = cue("l14", "Angka itu juga");
  const hop = (t0: number, n: number, dur = 1.2) => {
    const k = Math.min(n - 1, Math.max(0, (t - t0) / dur));
    const i = Math.floor(k);
    const f = k - i;
    return { i, f: i >= n - 1 ? 1 : f };
  };
  const h = hop(2.9, 5, 1.1);
  return (
    <>
      <Lbl text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
      <Sh t={t} to={7.2}>
        {() => (
          <>
            {shirts.map((c, i) => (
              <Place key={i} x={150 + i * 350} y={400} t={t} at={0.6 + i * 0.2} dy={bob(t, 4, 2.5, i)}>
                <Person size={290} who={i % 2 ? "remaja" : "guru"} shirt={c} t={t} phase={i} mood={h.i === i || h.i === i - 1 ? "oh" : "happy"} />
              </Place>
            ))}
            {t > 2.9 ? (
              <div style={{ position: "absolute", left: 170 + (h.i + ease(h.f, 0.1, 0.9)) * 350 - 10, top: 250 - 40 * Math.sin(Math.min(1, h.f) * Math.PI), transform: `translateX(0)` }}>
                <div style={{ padding: "6px 26px 10px", background: "#fff", border: `6px solid ${INK}`, borderRadius: 50, boxShadow: `0 6px 0 ${INK}`, fontFamily: toonFont(), fontWeight: 700, fontSize: 84, color: toon.orange }}>10 : 1</div>
              </div>
            ) : null}
            {["psst", "psst"].map((s, i) => (
              <div key={i} style={{ position: "absolute", left: 360 + i * 700, top: 400 + i * 30, fontFamily: toonFont(), fontWeight: 600, fontSize: 36, color: toon.inkSoft, opacity: appear(t, 3.3 + i * 1.2, 0.2) * (0.5 + 0.5 * Math.sin(t * 6)) }}>
                {s}
              </div>
            ))}
          </>
        )}
      </Sh>
      <Sh t={t} from={tMid - 0.1}>
        {(lt) => (
          <>
            {[0, 1, 2, 3].map((i) => {
              const pg = pop(t, tMid + i * 0.25, 0.5);
              return (
                <div key={i} style={{ position: "absolute", left: 250 + i * 420, top: 300 + 20 * Math.sin(i * 1.7), transform: `scale(${pg}) rotate(${wig(t, 3, 1.5, i)}deg)` }}>
                  <Paper w={270} text="10 : 1" />
                </div>
              );
            })}
            {[0, 1, 2].map((i) => {
              const f = ease(lt, 0.9 + i * 0.8, 1.6 + i * 0.8);
              return (
                <div key={i} style={{ position: "absolute", left: 250 + 280 + i * 420 + f * 130, top: 320 - 70 * Math.sin(f * Math.PI), opacity: f > 0 && f < 1 ? 1 : 0, fontFamily: toonFont(), fontWeight: 700, fontSize: 110, color: toon.orange, WebkitTextStroke: `7px ${INK}`, paintOrder: "stroke fill" }}>
                  →
                </div>
              );
            })}
            
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- L-15 Rekap bab 3 ----------
const L15: React.FC<V> = ({ t }) => {
  const tTebak = cue("l15", "tebakan kasar");
  return (
    <>
      <div style={{ position: "absolute", left: 360, top: 200 }}>
        <Board w={1300} h={620} />
      </div>
      <Place x={560} y={290} t={t} at={0.4}>
        <Pinned x={0} y={0} w={300} h={380} rot={-3}>
          <div style={{ fontFamily: toonFont(), fontWeight: 700, fontSize: 74, color: toon.orange, textAlign: "center", lineHeight: 1 }}>{"10\n:\n1"}</div>
        </Pinned>
      </Place>
      <div style={{ position: "absolute", left: 1060, top: 480, transform: "translateX(-50%)" }}>
        <Stamp text="TEBAKAN KASAR" t={t} at={tTebak + 0.3} size={78} rot={-10} />
      </div>
      <Place x={20} y={330} t={t} at={0.3}>
        <Det x={0} y={0} size={420} t={t} mood="happy" hand={[132, 110]} />
      </Place>
      <Sparkle x={1400} y={250} t={t} size={70} phase={1} />
    </>
  );
};

export const BAB1_3: Record<string, React.FC<V>> = { l01: L01, l02: L02, l03: L03, l04: L04, l05: L05, l06: L06, l07: L07, l08: L08, l09: L09, l10: L10, l11: L11, l12: L12, l13: L13, l14: L14, l15: L15 };

export const SFX1_3: Record<string, readonly Cue[]> = {
  l01: [[0.3, "whoosh", 0.45], [cue("l01", "Sepuluh") - 0.05, "pop", 0.8], [4.4, "pop", 0.6], [6.2, "shimmer", 0.3]],
  l02: [[0.9, "hmm", 0.5], [3.5, "whoosh", 0.4], [3.9, "pencil", 0.4]],
  l03: [[0.3, "page", 0.7], [1.0, "ding", 0.5]],
  l04: [[cue("l04", "bakteri di tubuh") + 0.1, "pop", 0.6], [cue("l04", "bakteri di tubuh") + 1.9, "pop", 0.6], [cue("l04", "bakteri di tubuh") + 3.5, "pop", 0.6]],
  l05: [[cue("l05", "Bakteri itu"), "shimmer", 0.4], [cue("l05", "Bakteri itu") + 0.3, "whoosh", 0.3]],
  l06: [[0.5, "tick", 0.5], [0.8, "tick", 0.5], [1.1, "tick", 0.5], [1.4, "tick", 0.5], [2.4, "whoosh", 0.4], [cue("l06", "sel darah"), "pop", 0.6], [cue("l06", "sel otot"), "pop", 0.6], [cue("l06", "sel kulit"), "pop", 0.6]],
  l07: [[0.5, "pop", 0.5], [2.2, "pencil", 0.5], [2.6, "ding", 0.4]],
  l08: [[0.5, "page", 0.7], [1.0, "page", 0.6], [1.5, "page", 0.6], [2.1, "pop", 0.6]],
  l09: [[3.8, "pencil", 0.5], [cue("l09", "perkiraan kasar") + 0.2, "strike", 0.8]],
  l10: [[cue("l10", "sedikit isi usus"), "tick", 0.6], [cue("l10", "seluruh saluran"), "tick", 0.6], [cue("l10", "dikalikan"), "tick", 0.6]],
  l11: [[0.3, "crowd", 0.15], [cue("l11", "Lalu kamu mengira") + 0.3, "crowd", 0.4]],
  l12: [[3.9, "plop", 0.6]],
  l13: [[0.5, "pop", 0.5]],
  l14: [[2.9, "tick", 0.4], [4.1, "tick", 0.4], [5.3, "tick", 0.4], [cue("l14", "Angka itu juga"), "page", 0.5]],
  l15: [[cue("l15", "tebakan kasar") + 0.3, "strike", 0.8]],
};
