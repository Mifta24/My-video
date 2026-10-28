import type React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SheetMark, SheetOpen } from "../elements/Brand";
import { clamp, easeInOut, easeOut, ramp, rise, SchemaTag, Shot, Txt } from "../elements/common";
import type { Cue } from "../elements/Sound";
import { Arrow, DotColumn, Figure, RatioText, fmt } from "../elements/viz";
import { colors, fonts } from "../theme";
import { clipEnd, clipStart, cue } from "../timing";

// Shorts 9:16 (1080 x 1920). Zona aman: 150 px atas, 250 px bawah; subtitle di ~1510.
// Area visual utama: y 220 .. 1440.
type V = React.FC<{ readonly t: number }>;
const W = 1080;
const H = 1920;

const Svg: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

const ColLabel: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly color: string;
  readonly t: number;
  readonly at: number;
}> = ({ x, y, text, color, t, at }) => (
  <Txt x={x} y={y} w={400} align="center" size={30} mono color={color} t={t} at={at} spacing={3}>
    {text}
  </Txt>
);

// ── S-01 · HOOK: "10 : 1" lalu dicoret, kolom bakteri menyusut ──
const S01: V = ({ t }) => {
  const keliru = clipStart("s01", "s01_02");
  const shrink = interpolate(t, [keliru, keliru + 1.4], [0, 1], { ...clamp, easing: easeInOut });
  const bact = interpolate(shrink, [0, 1], [100, 13]);
  return (
    <>
      <SchemaTag t={t} x={70} y={232} text="SKEMA · ilustrasi mitos" size={24} />
      <Txt x={540} y={300} w={900} align="center" size={34} mono color={colors.muted} t={t} at={0.1} spacing={6}>
        KATANYA…
      </Txt>
      <RatioText
        text="10 : 1"
        x={540}
        y={360}
        size={240}
        appear={rise(t, 0.05, 0.5)}
        strike={ramp(t, keliru, 0.35)}
        stamp={rise(t, keliru + 0.25, 0.4)}
      />
      <Txt
        x={540}
        y={625}
        w={900}
        align="center"
        size={36}
        mono
        color={colors.text}
        t={t}
        at={0.7}
        out={keliru}
        spacing={2}
      >
        bakteri : sel manusia
      </Txt>
      <Svg>
        <line x1={150} x2={930} y1={1262} y2={1262} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={330} base={1250} n={10} cols={8} d={30} color={colors.cream} appear={ramp(t, 0.4, 0.8)} seed="h1" />
        <DotColumn x={750} base={1250} n={bact} cols={8} d={30} appear={ramp(t, 0.6, 1.6)} seed="b1" />
      </Svg>
      <ColLabel x={330} y={1280} text="SEL MANUSIA" color={colors.cream} t={t} at={0.5} />
      <ColLabel x={750} y={1280} text="BAKTERI" color={colors.orange} t={t} at={0.7} />
    </>
  );
};

// ── S-02 · kalimat khas: lembar terbuka ──
const S02: V = ({ t }) => (
  <SheetOpen t={t} cx={540} cy={760} w={780} taglineAt={clipStart("s02", "s02_01")} />
);

// ── S-03 · "10 : 1" bergema, disalin dari tempat ke tempat ──
const S03: V = ({ t }) => {
  const start = 0.2;
  const step = 0.55;
  const cards = Array.from({ length: 8 }, (_, i) => i);
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      {cards.map((i) => {
        const at = start + i * step;
        const p = rise(t, at, 0.6);
        if (p <= 0) {
          return null;
        }
        const tx = 540 + (i % 2 === 0 ? -1 : 1) * (40 + i * 14);
        const ty = 360 + i * 108;
        const fromX = i === 0 ? tx : 540 + (i % 2 === 1 ? -1 : 1) * (40 + (i - 1) * 14);
        const fromY = i === 0 ? ty : 360 + (i - 1) * 108;
        const x = fromX + (tx - fromX) * p;
        const y = fromY + (ty - fromY) * p;
        const fade = 1 - i * 0.075;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 250,
              top: y,
              width: 500,
              height: 92,
              rotate: `${(i % 2 === 0 ? -1 : 1) * (2 + i * 0.6)}deg`,
              opacity: p * fade,
              background: i === 0 ? colors.cream : `rgba(244,233,212,${0.92 - i * 0.07})`,
              borderRadius: 12,
              boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              gap: 22,
            }}
          >
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 60,
                color: colors.orange,
                whiteSpace: "nowrap",
                textShadow: "none",
              }}
            >
              10 : 1
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ height: 9, width: "92%", borderRadius: 9, background: "rgba(8,16,34,0.35)" }} />
              <div style={{ height: 9, width: "70%", borderRadius: 9, background: "rgba(8,16,34,0.25)" }} />
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 20,
                color: colors.bg,
                opacity: 0.7,
                whiteSpace: "nowrap",
              }}
            >
              {i === 0 ? "perkiraan" : "dikutip"}
            </div>
          </div>
        );
      })}
      <Txt
        x={540}
        y={1270}
        w={940}
        align="center"
        size={44}
        t={t}
        at={cue("s03", "perkiraan kasar")}
        color={colors.text}
      >
        perkiraan kasar,{" "}
        <span style={{ color: colors.orange }}>diulang puluhan tahun</span>
      </Txt>
    </>
  );
};

// ── S-04 · pria dewasa rata-rata (acuan), dihitung ulang ──
const S04: V = ({ t }) => {
  const recount = clipStart("s04", "s04_02");
  const scan = interpolate(t, [recount, recount + 1.8], [0, 1], { ...clamp, easing: easeInOut });
  const scanY = 330 + scan * 820;
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      <Svg>
        <Figure x={350} y={300} scale={0.95} appear={rise(t, 0.1, 0.8)} />
        {scan > 0 && scan < 1 ? (
          <g>
            <rect x={240} y={scanY - 60} width={600} height={60} fill="url(#scanGrad)" />
            <line x1={240} x2={840} y1={scanY} y2={scanY} stroke={colors.orange} strokeWidth={4} />
            <defs>
              <linearGradient id="scanGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={colors.orange} stopOpacity={0} />
                <stop offset="1" stopColor={colors.orange} stopOpacity={0.35} />
              </linearGradient>
            </defs>
          </g>
        ) : null}
      </Svg>
      <Txt x={540} y={1180} w={900} align="center" size={40} t={t} at={0.5}>
        Pria dewasa rata-rata
      </Txt>
      <Txt x={540} y={1236} w={900} align="center" size={30} mono color={colors.muted} t={t} at={0.7}>
        (ACUAN)
      </Txt>
      <Txt x={150} y={560} w={300} size={30} mono color={colors.orange} t={t} at={recount + 0.3}>
        bakteri
        <br />
        <span style={{ fontSize: 64, fontFamily: fonts.heading }}>?</span>
      </Txt>
      <Txt x={930} y={560} w={300} align="right" size={30} mono color={colors.cream} t={t} at={recount + 0.5}>
        sel manusia
        <br />
        <span style={{ fontSize: 64, fontFamily: fonts.heading }}>?</span>
      </Txt>
    </>
  );
};

// ── S-05 · hasil: ~38 triliun vs ~30 triliun ──
const S05: V = ({ t }) => {
  const b = clipStart("s05", "s05_01");
  const h = clipStart("s05", "s05_02");
  const same = clipStart("s05", "s05_03");
  const ratio = clipStart("s05", "s05_04");
  const bN = interpolate(t, [b + 0.3, b + 2.2], [0, 38], { ...clamp, easing: easeOut });
  const hN = interpolate(t, [h + 0.3, h + 2.0], [0, 30], { ...clamp, easing: easeOut });
  const base = 1180;
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      <Svg>
        <line x1={150} x2={930} y1={base + 12} y2={base + 12} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={360} base={base} n={38} cols={4} d={44} appear={bN / 38} seed="b5" />
        <DotColumn x={720} base={base} n={30} cols={4} d={44} color={colors.cream} appear={hN / 30} seed="h5" />
        {t > same ? (
          <g opacity={rise(t, same, 0.5)}>
            <line x1={470} x2={610} y1={base - 418} y2={base - 330} stroke={colors.muted} strokeWidth={3} strokeDasharray="8 8" />
          </g>
        ) : null}
      </Svg>
      <Txt x={360} y={base - 540} w={420} align="center" size={78} color={colors.orange} t={t} at={b + 0.2}>
        ~{fmt(bN)}
        <div style={{ fontSize: 30, fontFamily: fonts.mono, fontWeight: 500 }}>triliun</div>
      </Txt>
      <Txt x={720} y={base - 452} w={420} align="center" size={78} color={colors.cream} t={t} at={h + 0.2}>
        ~{fmt(hN)}
        <div style={{ fontSize: 30, fontFamily: fonts.mono, fontWeight: 500 }}>triliun</div>
      </Txt>
      <ColLabel x={360} y={base + 30} text="BAKTERI" color={colors.orange} t={t} at={b} />
      <ColLabel x={720} y={base + 30} text="SEL MANUSIA" color={colors.cream} t={t} at={h} />
      <Txt x={540} y={base + 100} w={900} align="center" size={50} t={t} at={same}>
        hampir sama banyak
      </Txt>
      {t > ratio - 0.2 ? (
        <>
          <RatioText text="≈ 1 : 1" x={420} y={280} size={130} appear={rise(t, ratio, 0.5)} color={colors.text} />
          <RatioText
            text="10 : 1"
            x={830}
            y={318}
            size={70}
            appear={rise(t, cue("s05", "bukan sepuluh"), 0.4)}
            strike={ramp(t, cue("s05", "bukan sepuluh") + 0.3, 0.3)}
            dim={0.7}
          />
        </>
      ) : null}
    </>
  );
};

// ── S-06 · kenapa kebesaran: seluruh saluran cerna (~1 L) vs usus besar (~0,4 L) ──
const VolumeBox: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly fill: number;
  readonly color: string;
  readonly opacity?: number;
}> = ({ x, y, w, h, fill, color, opacity = 1 }) => (
  <g opacity={opacity}>
    <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={colors.muted} strokeWidth={3} strokeDasharray="10 8" />
    <rect x={x + 6} y={y + h - (h - 12) * fill - 6} width={w - 12} height={(h - 12) * fill} rx={6} fill={color} opacity={0.85} />
  </g>
);

const S06: V = ({ t }) => {
  const old = clipStart("s06", "s06_02");
  const now = clipStart("s06", "s06_03");
  const draw = ramp(t, old, 1.6);
  const tract = rise(t, old + 0.8, 1.2);
  const focus = ramp(t, now, 1.4);
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      <Txt x={540} y={290} w={940} align="center" size={60} t={t} at={0.05} out={old + 0.4}>
        Kenapa angka lama
        <br />
        <span style={{ color: colors.orange }}>terlalu besar?</span>
      </Txt>
      <Svg>
        <Figure
          x={110}
          y={420}
          scale={0.98}
          appear={rise(t, 0.3, 0.8)}
          gutDraw={draw}
          tract={tract}
          colon={focus}
          upperDim={focus}
          pulse={t}
        />
        <VolumeBox x={720} y={560} w={220} h={300} fill={rise(t, old + 1.2, 1)} color={colors.orangeDim} opacity={1 - focus * 0.55} />
        <VolumeBox x={760} y={980} w={150} h={150} fill={rise(t, now + 0.6, 1)} color={colors.orange} opacity={focus} />
        <Arrow x1={430} y1={890} x2={700} y2={1040} draw={ramp(t, now + 0.4, 0.6)} />
      </Svg>
      <Shot t={t} from={old} to={now}>
        {(lt) => (
          <>
            <Txt x={560} y={330} w={480} size={34} mono color={colors.muted} t={lt} at={0.2}>
              PERKIRAAN LAMA · 1972
            </Txt>
            <Txt x={560} y={380} w={480} size={40} t={lt} at={0.5}>
              seluruh saluran cerna
            </Txt>
          </>
        )}
      </Shot>
      <Txt x={830} y={870} w={300} align="center" size={44} t={t} at={old + 1.2} color={colors.orangeSoft}>
        ~1 liter
      </Txt>
      <Shot t={t} from={now}>
        {(lt) => (
          <>
            <Txt x={560} y={330} w={480} size={34} mono color={colors.orange} t={lt} at={0.1}>
              SEBAGIAN BESAR BAKTERI
            </Txt>
            <Txt x={560} y={380} w={480} size={44} t={lt} at={0.3}>
              usus besar
            </Txt>
          </>
        )}
      </Shot>
      <Txt x={835} y={1140} w={340} align="center" size={46} t={t} at={now + 0.8} color={colors.orange}>
        ~0,4 liter
      </Txt>
      <Txt x={540} y={1305} w={940} align="center" size={38} t={t} at={cue("s06", "dengan kepadatan")} color={colors.text}>
        kepadatan terukur <span style={{ color: colors.orange }}>lebih rendah</span>
      </Txt>
    </>
  );
};

// ── S-07 · catatan menarik: sel berinti saja ≈ 10 : 1 ──
const S07: V = ({ t }) => {
  const nucAt = cue("s07", "sel berinti");
  const tenAt = cue("s07", "sepuluh banding satu");
  const back = clipStart("s07", "s07_02");
  const rbc = cue("s07", "terutama sel darah merah");
  const join = clipEnd("s07", "s07_02") - 0.2;
  const hide = ramp(t, nucAt, 0.8) * (1 - ramp(t, back, 0.8));
  const red = ramp(t, rbc - 0.6, 0.6) * (1 - ramp(t, join, 0.6));
  const base = 1240;
  const nucleated = (i: number) => i < 3;
  return (
    <>
      <SchemaTag t={t} x={70} y={232} text="SKEMA · catatan menarik" size={24} />
      <Svg>
        <line x1={150} x2={930} y1={base + 12} y2={base + 12} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={330} base={base} n={38} cols={4} d={44} seed="b7" />
        <DotColumn
          x={750}
          base={base}
          n={30}
          cols={4}
          d={44}
          color={colors.cream}
          seed="h7"
          colorAt={(i) => (!nucleated(i) && red > 0 ? `color-mix(in srgb, #D9535B ${Math.round(red * 100)}%, ${colors.cream})` : undefined)}
          opacityAt={(i) => (nucleated(i) ? 1 : 1 - hide * 0.85)}
        />
        <DotColumn x={750} base={base} n={3} cols={4} d={44} r={7} color={colors.orange} glow={false} appear={rise(t, 0.6, 0.6)} seed="n7" />
        {red > 0
          ? Array.from({ length: 27 }, (_, k) => {
              const i = k + 3;
              const row = Math.floor(i / 4);
              const col = i % 4;
              return (
                <circle
                  key={k}
                  cx={750 - 66 + col * 44}
                  cy={base - 16 - row * 44}
                  r={6}
                  fill="#B23A47"
                  opacity={red}
                />
              );
            })
          : null}
      </Svg>
      <ColLabel x={330} y={base + 30} text="BAKTERI" color={colors.orange} t={t} at={0} />
      <ColLabel x={750} y={base + 30} text="SEL MANUSIA" color={colors.cream} t={t} at={0} />
      <Txt x={900} y={base - 70} w={200} size={26} mono color={colors.orange} t={t} at={0.8} lh={1.1}>
        BERINTI
        <br />
        ~10%
      </Txt>
      <Txt x={900} y={base - 330} w={200} size={26} mono color={colors.cream} t={t} at={1.2} out={nucAt} lh={1.1}>
        TANPA
        <br />
        INTI ~90%
      </Txt>
      <Shot t={t} from={tenAt - 0.2} to={back}>
        {(lt) => (
          <>
            <RatioText text="≈ 10 : 1" x={540} y={330} size={120} appear={rise(lt, 0, 0.5)} />
            <Txt x={540} y={480} w={940} align="center" size={36} mono color={colors.muted} t={lt} at={0.3}>
              dibanding sel berinti saja
            </Txt>
          </>
        )}
      </Shot>
      <Shot t={t} from={back + 0.2} to={join}>
        {(lt) => (
          <>
            <Txt x={540} y={320} w={940} align="center" size={64} t={lt} at={0}>
              <span style={{ color: colors.cream }}>~90%</span> tanpa inti
            </Txt>
            <Txt x={540} y={410} w={940} align="center" size={38} mono color="#E77A80" t={lt} at={rbc - back - 0.4}>
              terutama sel darah merah
            </Txt>
          </>
        )}
      </Shot>
      <Shot t={t} from={join + 0.4}>
        {(lt) => (
          <Txt x={540} y={340} w={940} align="center" size={56} t={lt} at={0.1}>
            kembali <span style={{ color: colors.orange }}>hampir sama tinggi</span>
          </Txt>
        )}
      </Shot>
    </>
  );
};

// ── S-08 · massa: ~0,2 kg ──
const S08: V = ({ t }) => {
  const kg = cue("s08", "nol koma dua");
  const block = rise(t, kg - 0.4, 0.7);
  const drop = interpolate(block, [0, 1], [-260, 0]);
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      <Txt x={540} y={290} w={940} align="center" size={56} t={t} at={0.1}>
        Soal <span style={{ color: colors.orange }}>bobot</span>
      </Txt>
      <Svg>
        <Figure x={120} y={420} scale={0.92} appear={rise(t, 0.2, 0.7)} ghost />
        <line x1={600} x2={960} y1={1210} y2={1210} stroke={colors.muted} strokeWidth={5} strokeLinecap="round" />
        <rect x={760} y={1210} width={40} height={50} fill={colors.line} />
        <rect x={690} y={1260} width={180} height={14} rx={7} fill={colors.line} />
        <g transform={`translate(0 ${drop})`} opacity={block}>
          <rect x={740} y={1130} width={80} height={80} rx={10} fill={colors.orange} style={{ filter: `drop-shadow(0 0 22px ${colors.orange}88)` }} />
        </g>
      </Svg>
      <Txt x={780} y={880} w={460} align="center" size={110} color={colors.orange} t={t} at={kg}>
        ~0,2 kg
      </Txt>
      <Txt x={780} y={1010} w={460} align="center" size={34} mono color={colors.text} t={t} at={kg + 0.4} lh={1.25}>
        total massa
        <br />
        bakteri
      </Txt>
    </>
  );
};

// ── S-09 · ketidakpastian ~25%, antarorang bervariasi ──
const S09: V = ({ t }) => {
  const unc = clipStart("s09", "s09_02");
  const band = ramp(t, cue("s09", "dua puluh lima"), 0.8);
  const vary = ramp(t, cue("s09", "angka tiap orang"), 0.8);
  const base = 1180;
  const d = 44;
  const bh = Math.ceil(38 / 4) * d;
  const wob = (k: number) => Math.sin(t * 2.2 + k) * 0.5 + 0.5;
  return (
    <>
      <SchemaTag t={t} x={70} y={232} size={24} />
      <Txt x={540} y={290} w={940} align="center" size={60} t={t} at={0.05}>
        Tentu ini <span style={{ color: colors.orange }}>perkiraan</span>
      </Txt>
      <Svg>
        <line x1={120} x2={960} y1={base + 12} y2={base + 12} stroke={colors.line} strokeWidth={3} />
        {band > 0 ? (
          <g opacity={band}>
            <rect x={240} y={base - bh * 1.25} width={240} height={bh * 0.5} rx={10} fill={colors.orange} opacity={0.16} />
            <line x1={240} x2={480} y1={base - bh * 1.25} y2={base - bh * 1.25} stroke={colors.orange} strokeWidth={3} strokeDasharray="10 8" />
            <line x1={240} x2={480} y1={base - bh * 0.75} y2={base - bh * 0.75} stroke={colors.orange} strokeWidth={3} strokeDasharray="10 8" />
          </g>
        ) : null}
        <DotColumn x={360} base={base} n={38} cols={4} d={d} t={t} jitter={2.2} seed="b9" />
        <DotColumn x={680} base={base} n={30} cols={4} d={d} t={t} jitter={2.2} color={colors.cream} seed="h9" />
        {vary > 0
          ? [0, 1, 2, 3].map((k) => (
              <rect
                key={k}
                x={830 + k * 34}
                y={base - (150 + 220 * wob(k * 1.7))}
                width={22}
                height={150 + 220 * wob(k * 1.7)}
                rx={6}
                fill={colors.orange}
                opacity={vary * 0.75}
              />
            ))
          : null}
      </Svg>
      <Txt x={360} y={base - bh * 1.25 - 60} w={420} align="center" size={32} mono color={colors.orange} t={t} at={cue("s09", "dua puluh lima")}>
        ±25%
      </Txt>
      <Txt x={880} y={base + 30} w={300} align="center" size={26} mono color={colors.muted} t={t} at={cue("s09", "angka tiap orang")} lh={1.15}>
        antarorang
        <br />
        bervariasi
      </Txt>
      <Txt x={540} y={base + 140} w={940} align="center" size={36} mono color={colors.text} t={t} at={unc + 0.3}>
        perkiraan · ketidakpastian ~25%
      </Txt>
    </>
  );
};

// ── S-10 · refleksi: angka lama dicoret, kolom baru ──
const S10: V = ({ t }) => {
  const upd = clipStart("s10", "s10_02");
  const base = 1120;
  return (
    <>
      <RatioText
        text="10 : 1"
        x={290}
        y={760}
        size={130}
        appear={rise(t, 0.1, 0.5)}
        strike={ramp(t, cue("s10", "belum dihitung"), 0.4)}
        dim={interpolate(t, [upd, upd + 0.6], [1, 0.45], clamp)}
      />
      <Txt x={290} y={920} w={420} align="center" size={30} mono color={colors.muted} t={t} at={0.4}>
        sering diulang
      </Txt>
      <Svg>
        <line x1={590} x2={990} y1={base + 10} y2={base + 10} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={700} base={base} n={38} cols={4} d={34} appear={ramp(t, upd - 0.4, 1.2)} seed="b10" />
        <DotColumn x={880} base={base} n={30} cols={4} d={34} color={colors.cream} appear={ramp(t, upd - 0.2, 1.2)} seed="h10" />
      </Svg>
      <Txt x={790} y={base + 30} w={420} align="center" size={30} mono color={colors.text} t={t} at={upd}>
        dihitung ulang
      </Txt>
      <Txt x={540} y={330} w={940} align="center" size={64} t={t} at={upd + 0.1}>
        Hitungan sudah
        <br />
        <span style={{ color: colors.orange }}>diperbarui ✓</span>
      </Txt>
    </>
  );
};

// ── S-11 · CTA tunggal ──
const S11: V = ({ t }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        position: "absolute",
        top: 560,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 34,
      }}
    >
      <div style={{ opacity: rise(t, 0.05, 0.6), scale: String(0.85 + 0.15 * rise(t, 0.05, 0.8)) }}>
        <SheetMark size={190} />
      </div>
      <div
        style={{
          opacity: rise(t, 0.3, 0.6),
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 58,
          letterSpacing: 6,
          color: colors.text,
        }}
      >
        SUHUF PENGETAHUAN
      </div>
      <div
        style={{
          opacity: rise(t, 0.5, 0.6),
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 54,
          color: colors.orange,
          padding: "14px 36px",
          border: `3px solid ${colors.orange}`,
          borderRadius: 99,
        }}
      >
        @suhufpengetahuan
      </div>
      <div
        style={{
          marginTop: 90,
          opacity: rise(t, 0.9, 0.6) * 0.85,
          fontFamily: fonts.mono,
          fontSize: 26,
          color: colors.muted,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Sumber: Sender, Fuchs & Milo, 2016,
        <br />
        PLoS Biology
      </div>
    </div>
  </AbsoluteFill>
);

export const SHORTS_VISUALS: Record<string, V> = {
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

// SFX per adegan: [detik, nama, volume]. Volume rendah; narasi selalu dominan.
export const SHORTS_SFX: Record<string, readonly Cue[]> = {
  s01: [
    [0.05, "bass", 0.7],
    [0.6, "count", 0.35],
    [clipStart("s01", "s01_02"), "strike", 0.55],
    [clipStart("s01", "s01_02") + 0.25, "pop", 0.45],
    [clipStart("s01", "s01_02") + 0.4, "shrink", 0.4],
  ],
  s02: [
    [0.02, "page", 0.55],
    [clipStart("s02", "s02_01") + 0.1, "ding", 0.3],
  ],
  s03: Array.from({ length: 8 }, (_, i) => [0.2 + i * 0.55, "tick", 0.45 - i * 0.03] as const),
  s04: [
    [0.1, "whoosh", 0.4],
    [clipStart("s04", "s04_02"), "shimmer", 0.3],
  ],
  s05: [
    [clipStart("s05", "s05_01") + 0.3, "count", 0.4],
    [clipStart("s05", "s05_02") + 0.3, "count", 0.35],
    [clipStart("s05", "s05_03"), "reveal", 0.4],
    [clipStart("s05", "s05_04"), "pop", 0.4],
    [cue("s05", "bukan sepuluh") + 0.3, "strike", 0.4],
  ],
  s06: [
    [clipStart("s06", "s06_02"), "pencil", 0.35],
    [clipStart("s06", "s06_03"), "whoosh", 0.35],
    [clipStart("s06", "s06_03") + 0.6, "pop", 0.45],
  ],
  s07: [
    [cue("s07", "sel berinti"), "hmm", 0.4],
    [cue("s07", "sepuluh banding satu") - 0.2, "pop", 0.35],
    [clipStart("s07", "s07_02") + 0.2, "whoosh", 0.3],
    [clipEnd("s07", "s07_02") - 0.2, "reveal", 0.3],
  ],
  s08: [
    [0.1, "whoosh", 0.3],
    [cue("s08", "nol koma dua") + 0.25, "scale", 0.5],
  ],
  s09: [
    [cue("s09", "dua puluh lima"), "shimmer", 0.35],
    [cue("s09", "angka tiap orang"), "tick", 0.35],
  ],
  s10: [
    [cue("s10", "belum dihitung"), "strike", 0.4],
    [clipStart("s10", "s10_02"), "reveal", 0.35],
  ],
  s11: [
    [0.05, "page", 0.4],
    [0.5, "ding", 0.25],
  ],
};
