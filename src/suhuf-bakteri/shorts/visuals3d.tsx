import type React from "react";
import { interpolate } from "remotion";
import { appear, bob, BigWord, Place, pop, Sh, Sparkle, Tag, toonFont, slide } from "../elements/ToonKit";
import { toon } from "../theme";
import { clipStart, cue } from "../timing";
import { BodySilhouette, Stadium } from "./characters";
import { Flag3D, panSpot, Rope3D, Scale3D, scaleAngle, scalePose } from "./scale3d";
import { hopMotion, mvToy, Stage3D, standAt, sway, topForRope, Toy } from "./toy3d";
import { Bubble, crowdPos } from "./visuals";

// Shorts V3 draf 2: tokoh 3D (Three.js) di semua adegan yang menampilkan Tim Bakteri / Tim Sel Manusia.
// Tata letak mengikuti draf 1 (px kanvas 1080x1920). Teks, label, subtitle tetap 2D di atas lapisan 3D.
// Detektif, siluet tubuh, kalender, kertas tetap 2D. S-02 dan S-10 tidak punya tokoh utama: tetap 2D.
// Zona aman: 150 px atas, 250 px bawah. Semua gerak murni fungsi t (detik = frame / fps).
type V = { readonly t: number };
const INK = toon.ink;
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Pindah A -> B dengan lompatan kecil, lalu memantul pelan di tempat.
const walk = (t: number, from: readonly [number, number], to: readonly [number, number], at: number, dur: number, hop: number, i: number, amp = 5) => {
  const m = mvToy(t, from, to, at, dur, hop);
  const h = hopMotion(t, amp, 3.2, i, at + dur);
  return { left: m.left, top: m.top + h.dy, squash: m.squash + h.squash, at, popDur: 0.12 };
};

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
            <Stage3D>
              {bacts.map((b, i) => (
                <Toy key={i} kind="bact" size={118} t={t} phase={i} mood={i % 4 === 0 ? "laugh" : "happy"} yaw={14} {...walk(t, [500, 730], [b.x, b.y], 0.3 + i * 0.13, 0.75, 36, i)} />
              ))}
              <Toy kind="cell" size={130} t={t} mood="worry" yaw={-14} {...walk(t, [560, 760], [800, 760], 1.9, 0.8, 20, 3)} />
            </Stage3D>
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
            <Stage3D>
              <Toy kind="bact" size={230} left={90} top={950} t={t} at={4.6} mood="think" look={[0.8, -0.4]} yaw={18} rot={sway(t, 2.5, 2.2)} {...hopMotion(t, 8, 2.4, 0, 4.9)} />
              <Toy kind="cell" size={200} left={760} top={930} t={t} at={4.8} mood="oh" look={[-0.8, -0.4]} yaw={-18} rot={sway(t, 2.5, 2.2, 1.5)} {...hopMotion(t, 8, 2.4, 2, 5.1)} />
            </Stage3D>
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

// ---------- S-03 Tahun 1972 (kalender dan detektif 2D, dua bakteri 3D) ----------
export const S03: React.FC<V> = ({ t }) => {
  const shake = (ph: number) => 6 * Math.sin(t * 8 + ph);
  const tw = clipStart("s03", "s03_03");
  return (
    <Sh t={t} from={3.45}>
      {() => (
        <Stage3D>
          <Toy kind="bact" size={250} left={640} top={880} t={t} at={tw - 0.2} mood="worry" yaw={-16} rot={shake(0)} />
          <Toy kind="bact" size={200} left={680} top={1090} t={t} at={tw} phase={1} mood="oh" yaw={-12} rot={shake(2)} />
        </Stage3D>
      )}
    </Sh>
  );
};

// ---------- S-04 Perumpamaan stadion (sel kecil di pojok jadi 3D) ----------
const S04: React.FC<V> = ({ t }) => {
  const fillP = interpolate(t, [cue("s04", "Kamu kira") - 0.1, cue("s04", "sampai ke pojok") + 0.3], [0, 1], clamp01);
  const zoomP = slide(t, 5.9, 0.9);
  const zoom = 1 + 1.5 * zoomP;
  const corner = appear(t, 6.1, 0.4);
  // Pusat sel kecil di pojok stadion (sama dengan posisi di SVG draf 1) dan ukurannya pada zoom saat ini.
  const csize = 78 * zoom;
  const ccx = 60 + 7 + 30 + 717;
  const ccy = 340 + 7 + 45 + 138 + (126 - 138) * zoom;
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
        <div style={{ position: "absolute", left: 30, top: 45, transformOrigin: "717px 138px", transform: `scale(${zoom})` }}>
          <Stadium w={900} fill={fillP} emptyCorner={corner} t={t} hideCell />
        </div>
      </div>
      <Sh t={t} to={3.1}>
        {() => (
          <>
            <Stage3D>
              <Toy kind="cell" size={150} left={90} top={1230} t={t} at={0.4} mood="think" look={[0.6, -0.5]} arms={{ r: 150 }} yaw={16} {...hopMotion(t, 6, 3, 0, 0.9)} />
            </Stage3D>
            <Bubble x={250} y={1190} t={t} at={0.9} text="?" />
          </>
        )}
      </Sh>
      <Sh t={t} from={3.0} to={5.9}>
        {() => (
          <Stage3D>
            <Toy kind="cell" size={150} left={90} top={1230} t={t} at={3.05} mood="laugh" arms={{ l: 165, r: 165 }} yaw={10} {...hopMotion(t, 10, 6, 0, 3.4)} />
          </Stage3D>
        )}
      </Sh>
      {corner > 0.01 ? (
        <Stage3D>
          <Toy
            kind="cell"
            size={csize}
            left={ccx - csize / 2}
            top={ccy - csize / 2}
            t={t}
            at={6.1}
            mood="think"
            look={[-0.8, -0.2]}
            arms={{ r: 150 + 10 * Math.sin(t * 7) }}
            shadow={false}
            breathe={false}
            popDur={0.3}
          />
        </Stage3D>
      ) : null}
      <BigWord text="KEBESARAN" t={t} at={6.5} y={1235} size={118} color={toon.red} />
    </>
  );
};

// ---------- S-05 Usus besar ----------
const S05: React.FC<V> = ({ t }) => {
  const tBig = cue("s05", "usus besar");
  const focus = slide(t, cue("s05", "Padahal") - 0.1, 1.0);
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
      <Stage3D>
        {along.map(([x, y], i) => (
          <Toy key={`a${i}`} kind="bact" size={62} left={x - 30} top={y - 20 + bob(t, 3, 4, i)} t={t} at={0.5 + i * 0.45} phase={i} mood="happy" vis={showAlong} shadow={false} yaw={10} />
        ))}
        {inColon.map(([x, y], i) => (
          <Toy key={`c${i}`} kind="bact" size={70} left={x - 28} top={y - 20 + bob(t, 3, 5, i)} t={t} at={tBig + 0.2 + i * 0.1} phase={i} mood="laugh" shadow={false} />
        ))}
        {meet.map((m, i) => (
          <Toy
            key={`m${i}`}
            kind="bact"
            size={150}
            t={t}
            phase={i}
            mood="laugh"
            arms={{ l: 150, r: 150 }}
            yaw={m.side === "l" ? 16 : -16}
            {...walk(t, [m.side === "l" ? -170 : 1100, m.y], [m.x, m.y], tBig + 0.1 + i * 0.12, 0.7, 22, i * 1.3, 7)}
          />
        ))}
      </Stage3D>
      <BigWord text="USUS BESAR" t={t} at={tBig} y={1180} size={130} color={toon.orange} />
    </>
  );
};

// ---------- S-06 Angka disalin dan diulang ----------
const S06: React.FC<V> = ({ t }) => {
  // Visual 2D (kertas melayang dan hujan kertas) dipakai ulang dari draf 1 lewat SHORTS_VISUALS; di sini hanya tokoh 3D.
  return (
    <Sh t={t} to={2.3}>
      {() => (
        <Stage3D>
          <Toy kind="cell" size={210} left={60} top={760} t={t} at={0.05} mood="happy" arms={{ r: 100 }} yaw={14} {...hopMotion(t, 7, 4, 0, 0.5)} />
          <Toy kind="bact" size={250} left={420} top={800} t={t} at={0.15} mood="happy" arms={{ l: 100, r: 100 }} {...hopMotion(t, 7, 4, 1, 0.6)} />
          <Toy kind="cell" size={190} left={830} top={760} t={t} at={0.25} mood="happy" arms={{ l: 100 }} yaw={-14} {...hopMotion(t, 7, 4, 2, 0.7)} />
        </Stage3D>
      )}
    </Sh>
  );
};

// ---------- S-07 Hitung ulang: 38 vs 30 ----------
const S07: React.FC<V> = ({ t }) => {
  const left = crowdPos(16, 4, 118, 96);
  const right = crowdPos(13, 4, 118, 108);
  const tCount = cue("s07", "sekitar 38");
  const tCell = cue("s07", "sekitar 30");
  return (
    <Sh t={t} from={3.9}>
      {() => (
        <>
          <Stage3D>
            {left.map((c, i) => (
              <Toy key={`b${i}`} kind="bact" size={108} left={42 + c.x} top={720 + c.y + bob(t, 4, 4, i)} t={t} at={tCount + 0.05 + i * 0.06} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} yaw={8} shadow={false} breathe={false} />
            ))}
            {right.map((c, i) => (
              <Toy key={`c${i}`} kind="cell" size={96} left={570 + c.x} top={730 + c.y + bob(t, 4, 4, i + 1)} t={t} at={tCell + 0.05 + i * 0.06} phase={i} mood={i % 5 === 0 ? "laugh" : "happy"} yaw={-8} shadow={false} breathe={false} />
            ))}
          </Stage3D>
        </>
      )}
    </Sh>
  );
};

// ---------- S-08 Hampir sama banyak: timbangan 3D, tarik tambang 3D ----------
const S08: React.FC<V> = ({ t }) => {
  const tTug = 1.85;
  const strike = slide(t, cue("s08", "Bukan sepuluh") + 0.1, 0.45);
  const strike2 = slide(t, cue("s08", "Bukan sepuluh") + 0.4, 0.4);

  // Timbangan: mulai miring, berayun, lalu dikunci tepat seimbang saat narasi selesai "banyak".
  const lockStart = 0.72;
  const lockDur = 0.42;
  const pose = scalePose(scaleAngle(t, -17, lockStart, lockDur), [540, 800], 340, 230, 150);
  const spots: readonly (readonly [number, number])[] = [
    [-72, 48],
    [72, 48],
    [0, -52],
  ];
  const onPan = (center: readonly [number, number], kind: "bact" | "cell", size: number, k: number, atT: number) => {
    const [ox, oz] = spots[k];
    const sp = panSpot(center, ox, oz);
    const stand = standAt(kind, size, sp.x, sp.y);
    const h = hopMotion(t, 4, 3.4, k + (kind === "cell" ? 1.3 : 0), 1.3);
    return (
      <Toy
        key={`${kind}${k}`}
        kind={kind}
        size={size}
        left={stand.left}
        top={stand.top + h.dy}
        z={sp.z}
        squash={h.squash}
        t={t}
        at={atT}
        phase={k}
        mood="laugh"
        yaw={kind === "bact" ? 12 : -12}
        shadow={false}
        popDur={0.4}
      />
    );
  };
  const balanced = appear(t, lockStart + lockDur - 0.05, 0.15);

  // Tarik tambang: tali lurus nyaris diam; tangan tepat di tali (grip), kedua tim condong ke luar.
  const swayR = 4 * Math.sin(t * 3.1);
  const ropeBase = 930;
  const ropeY = (x: number) => ropeBase + 16 * (1 - ((x - 540) / 540) ** 2) + swayR;
  const ropeZ = 62;
  const pull = 5 * Math.sin(t * 2.4);
  const teamB = [0, 1, 2].map((i) => ({ cx: 135 + i * 148, i }));
  const teamC = [0, 1, 2].map((i) => ({ cx: 945 - i * 148, i }));
  const grip = { ropeY, z: ropeZ, span: 0.5 };

  return (
    <>
      <Sh t={t} to={2.0}>
        {() => (
          <>
            <BigWord text={"HAMPIR\nSAMA BANYAK"} t={t} at={0.15} y={330} size={124} color={toon.orange} />
            <Stage3D>
              <Scale3D pose={pose} vis={pop(t, 0.05, 0.5)} floorY={1330} shadowsL={spots} shadowsR={spots} shadowW={96} />
              {[0, 1, 2].map((k) => onPan(pose.left, "bact", 104, k, 0.05 + k * 0.06))}
              {[0, 1, 2].map((k) => onPan(pose.right, "cell", 96, k, 0.1 + k * 0.06))}
            </Stage3D>
            <div style={{ opacity: balanced }}>
              <Sparkle x={110} y={640} t={t} size={70} />
              <Sparkle x={900} y={620} t={t} size={80} phase={2} />
              <Sparkle x={500} y={1380} t={t} size={0} phase={1} />
            </div>
          </>
        )}
      </Sh>
      <Sh t={t} from={tTug - 0.1} to={6.5}>
        {() => (
          <>
            <Tag text="PERUMPAMAAN - bukan data" kind="analogi" t={t} at={tTug} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 905, height: 140, background: toon.green, borderTop: `7px solid ${INK}`, borderBottom: `7px solid ${INK}` }} />
            <svg width={1080} height={300} viewBox="0 0 1080 300" style={{ position: "absolute", left: 0, top: 800 }}>
              <line x1={540} y1={130} x2={540} y2={235} stroke={INK} strokeWidth={6} strokeDasharray="12 10" opacity={0.55} />
            </svg>
            <Stage3D>
              <Rope3D y={ropeY} x0={-40} x1={1120} z={() => ropeZ} r={6} sig={`${Math.round(swayR * 20)}`} />
              <Flag3D x={540 - pull} y={ropeY(540)} z={ropeZ} lift={90} />
              {teamB.map(({ cx, i }) => {
                const size = 156;
                const rot = -(27 + 3 * Math.sin(t * 2.4 + i * 1.3));
                return (
                  <Toy
                    key={`b${i}`}
                    kind="bact"
                    size={size}
                    left={cx - size / 2 - pull}
                    top={topForRope("bact", size, ropeY(cx))}
                    t={t}
                    at={tTug + 0.1 + i * 0.12}
                    phase={i}
                    mood="laugh"
                    yaw={14}
                    rot={rot}
                    squash={0.04 + 0.025 * Math.sin(t * 5.2 + i)}
                    faceUp={0.28}
                    grip={grip}
                    shadowW={1.05}
                  />
                );
              })}
              {teamC.map(({ cx, i }) => {
                const size = 150;
                const rot = 29 + 3 * Math.sin(t * 2.4 + i * 1.3 + 1);
                return (
                  <Toy
                    key={`c${i}`}
                    kind="cell"
                    size={size}
                    left={cx - size / 2 - pull}
                    top={topForRope("cell", size, ropeY(cx))}
                    t={t}
                    at={tTug + 0.2 + i * 0.12}
                    phase={i + 1}
                    mood="laugh"
                    yaw={-14}
                    rot={rot}
                    squash={0.04 + 0.025 * Math.sin(t * 5.2 + i + 1)}
                    faceUp={0.28}
                    grip={grip}
                    shadowW={1.05}
                  />
                );
              })}
            </Stage3D>
            <BigWord text="SERU!" t={t} at={3.6} y={440} size={130} color={toon.blue} rot={-5} />
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
            <Stage3D>
              <Toy kind="bact" size={200} left={140} top={1080} t={t} at={6.5} mood="laugh" yaw={14} {...hopMotion(t, 6, 4, 0, 6.9)} />
              <Toy kind="cell" size={180} left={740} top={1060} t={t} at={6.6} mood="laugh" yaw={-14} {...hopMotion(t, 6, 4, 2, 7.0)} />
            </Stage3D>
          </>
        )}
      </Sh>
    </>
  );
};

// ---------- S-09 Ini perkiraan (sel berpikir jadi 3D) ----------
const S09: React.FC<V> = ({ t }) => (
  <Sh t={t} to={2.5}>
    {() => (
      <Stage3D>
        <Toy kind="cell" size={170} left={160} top={1060} t={t} at={0.6} mood="think" look={[0.5, -0.5]} yaw={14} {...hopMotion(t, 6, 3, 0, 1.0)} />
      </Stage3D>
    )}
  </Sh>
);

// ---------- S-11 Penutup ----------
const S11: React.FC<V> = ({ t }) => (
  <Stage3D>
    <Toy kind="bact" size={290} left={70} top={1010} t={t} at={0.4} mood="laugh" arms={{ l: 160 + 14 * Math.sin(t * 9) }} rot={-6 + sway(t, 2, 2)} yaw={16} {...hopMotion(t, 6, 3, 0, 0.9)} />
    <Toy kind="cell" size={240} left={770} top={990} t={t} at={0.5} mood="laugh" arms={{ r: 160 + 14 * Math.sin(t * 9 + 1) }} rot={6 + sway(t, 2, 2, 1)} yaw={-16} {...hopMotion(t, 6, 3, 2, 1.0)} />
  </Stage3D>
);


// Adegan 3D PENUH (menggantikan visual 2D) dan adegan OVERLAY (visual 2D draf 1 dengan tokoh 2D disembunyikan,
// tokoh 3D digambar di atasnya). Sisanya (S-02, S-10: tanpa tokoh utama) memakai visual 2D apa adanya.
export const FULL_3D: Record<string, React.FC<{ readonly t: number }>> = { s01: S01, s04: S04, s05: S05, s08: S08 };
export const OVERLAY_3D: Record<string, React.FC<{ readonly t: number }>> = { s03: S03, s06: S06, s07: S07, s09: S09, s11: S11 };
