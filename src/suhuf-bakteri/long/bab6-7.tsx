import type React from "react";
import { interpolate } from "remotion";
import { clamp, ramp, rise, SchemaTag, Shot, Txt } from "../elements/common";
import type { Cue } from "../elements/Sound";
import { Arrow, CellGrid, DotColumn, Figure, RatioText, RedCell, fmt } from "../elements/viz";
import { colors, fonts } from "../theme";
import { at, Box, Heading, Keylines, Pow, Svg } from "./kit";
import type { LV } from "./kit";

const tag = (t: number, text = "SKEMA") => <SchemaTag t={t} x={64} y={40} align="right" text={text} size={22} />;

// Dua kolom hasil (bakteri ~38, sel ~30) yang dipakai beberapa adegan.
const ResultColumns: React.FC<{
  readonly t: number;
  readonly x: number;
  readonly base: number;
  readonly bAt: number;
  readonly hAt: number;
  readonly d?: number;
  readonly counters?: boolean;
  readonly jitter?: number;
}> = ({ t, x, base, bAt, hAt, d = 40, counters = true, jitter = 0 }) => {
  const bN = interpolate(t, [bAt, bAt + 1.8], [0, 38], clamp);
  const hN = interpolate(t, [hAt, hAt + 1.6], [0, 30], clamp);
  return (
    <>
      <Svg>
        <line x1={x - 220} x2={x + 420} y1={base + 10} y2={base + 10} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={x} base={base} n={38} cols={4} d={d} appear={bN / 38} t={t} jitter={jitter} seed="rb" />
        <DotColumn x={x + 220} base={base} n={30} cols={4} d={d} color={colors.cream} appear={hN / 30} t={t} jitter={jitter} seed="rh" />
      </Svg>
      {counters ? (
        <>
          <Txt x={x} y={base - Math.ceil(38 / 4) * d - 100} w={300} align="center" size={56} color={colors.orange} t={t} at={bAt}>
            ~{fmt(bN)} T
          </Txt>
          <Txt x={x + 220} y={base - Math.ceil(30 / 4) * d - 100} w={300} align="center" size={56} color={colors.cream} t={t} at={hAt}>
            ~{fmt(hN)} T
          </Txt>
        </>
      ) : null}
      <Txt x={x} y={base + 24} w={300} align="center" size={24} mono color={colors.orange} t={t} at={bAt} spacing={2}>
        BAKTERI
      </Txt>
      <Txt x={x + 220} y={base + 24} w={300} align="center" size={24} mono color={colors.cream} t={t} at={hAt} spacing={2}>
        SEL MANUSIA
      </Txt>
    </>
  );
};

// ───────────── L-23 · Hasilnya: pria referensi ─────────────
const L23: LV = ({ t }) => {
  const { c } = at("l23");
  const prof = c("Untuk seorang pria");
  const b = c("Jumlah bakteri");
  const h = c("Jumlah sel manusia");
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="BAB 6" title="Hasilnya" size={80} y={110} />
      <Svg>
        <Figure x={170} y={330} scale={0.55} appear={rise(t, prof, 0.7)} />
      </Svg>
      <Box t={t} at={prof + 0.3} x={420} y={360} w={560} label="pria referensi" size={44} align="left" accent={colors.cream}>
        <div style={{ lineHeight: 1.35 }}>
          70 kg
          <br />
          20–30 tahun
          <br />
          1,7 m
        </div>
      </Box>
      <ResultColumns t={t} x={1300} base={840} bAt={b} hAt={h} />
      <Txt x={1410} y={900} w={600} align="center" size={22} mono color={colors.muted} t={t} at={h + 1}>
        Sender, Fuchs & Milo, 2016
      </Txt>
    </>
  );
};

// ───────────── L-24 · sekitar 1,3 : 1 ─────────────
const L24: LV = ({ t }) => {
  const { c } = at("l24");
  const no10 = c("Bukan sepuluh");
  const no100 = c("Bukan seratus");
  const colon = c("Dan bakteri paling");
  return (
    <>
      <RatioText text="10 : 1" x={420} y={200} size={90} appear={rise(t, no10, 0.4)} strike={ramp(t, no10 + 0.3, 0.3)} dim={0.45} />
      <RatioText text="100 : 1" x={420} y={330} size={90} appear={rise(t, no100, 0.4)} strike={ramp(t, no100 + 0.3, 0.3)} dim={0.45} />
      <RatioText text="sekitar 1,3 : 1" x={960} y={560} size={130} appear={rise(t, 0.2, 0.6)} />
      <Txt x={960} y={720} w={1000} align="center" size={46} t={t} at={c("Artinya")}>
        hampir sama banyak
      </Txt>
      <Svg>
        <DotColumn x={1200} base={440} n={38} cols={4} d={28} appear={ramp(t, 0.2, 1)} seed="r24b" />
        <DotColumn x={1360} base={440} n={30} cols={4} d={28} color={colors.cream} appear={ramp(t, 0.3, 1)} seed="r24h" />
        <g opacity={rise(t, colon, 0.6)}>
          <Figure x={1600} y={120} scale={0.5} gutDraw={1} colon={1} upperDim={1} pulse={t} />
        </g>
      </Svg>
      <Txt x={1700} y={580} w={400} align="center" size={28} mono color={colors.orange} t={t} at={colon + 0.3}>
        kolon: ~<Pow exp="13" />
      </Txt>
    </>
  );
};

// ───────────── L-25 · Ketidakpastian vs variasi ─────────────
const L25: LV = ({ t }) => {
  const { c } = at("l25");
  const unc = c("Untuk jumlah bakteri");
  const vary = c("Lalu ada hal");
  const base = 820;
  const bh = 460;
  const men = [0.62, 1.1, 0.78, 1.35, 0.9, 0.55, 1.2, 0.85, 1.48];
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="SEBERAPA PASTI?" title="Dua hal yang berbeda" size={60} y={110} />
      <Svg>
        <line x1={160} x2={800} y1={base + 6} y2={base + 6} stroke={colors.line} strokeWidth={3} />
        <rect x={360} y={base - bh} width={200} height={bh} rx={14} fill={colors.orange} opacity={rise(t, 0.3, 0.6)} />
        <g opacity={rise(t, unc, 0.6)}>
          <rect x={330} y={base - bh * 1.25} width={260} height={bh * 0.5} rx={10} fill={colors.orange} opacity={0.18} />
          <line x1={330} x2={590} y1={base - bh * 1.25} y2={base - bh * 1.25} stroke={colors.orange} strokeWidth={3} strokeDasharray="10 8" />
          <line x1={330} x2={590} y1={base - bh * 0.75} y2={base - bh * 0.75} stroke={colors.orange} strokeWidth={3} strokeDasharray="10 8" />
        </g>
        <line x1={1000} x2={1780} y1={base + 6} y2={base + 6} stroke={colors.line} strokeWidth={3} />
        {men.map((m, i) => {
          const p = rise(t, vary + i * 0.12, 0.6);
          const hh = 300 * m * p;
          return <rect key={i} x={1030 + i * 82} y={base - hh} width={56} height={hh} rx={10} fill={colors.orange} opacity={0.8} />;
        })}
      </Svg>
      <Txt x={460} y={base + 24} w={500} align="center" size={30} mono color={colors.orange} t={t} at={unc}>
        ketidakpastian ~25%
      </Txt>
      <Txt x={460} y={base + 64} w={500} align="center" size={22} mono color={colors.muted} t={t} at={unc + 0.5}>
        batas pengukuran
      </Txt>
      <Txt x={1390} y={base + 24} w={700} align="center" size={30} mono color={colors.orange} t={t} at={vary}>
        variasi antarpria ~separuh
      </Txt>
      <Txt x={1390} y={base + 64} w={700} align="center" size={22} mono color={colors.muted} t={t} at={vary + 0.5}>
        manusia memang tidak sama
      </Txt>
      <Txt x={1780} y={200} w={500} align="right" size={24} mono color={colors.muted} t={t} at={0.6}>
        hanya pria referensi
      </Txt>
    </>
  );
};

// ───────────── L-26 · Jeda ringkas kedua ─────────────
const L26: LV = ({ t }) => {
  const { c } = at("l26");
  const rows = [
    { at: c("Mitosnya berasal"), k: "ASAL", v: "perkiraan kasar 1972" },
    { at: c("Hitung ulang"), k: "HITUNG ULANG", v: "~38 T vs ~30 T" },
    { at: c("Rasionya sekitar"), k: "RASIO", v: "~1,3 : 1 (pria referensi)" },
  ];
  const next = c("Berikutnya");
  return (
    <>
      <Heading t={t} kicker="JEDA RINGKAS 2" title="Sejauh ini" size={60} y={110} />
      {rows.map((r, i) => {
        const p = rise(t, r.at, 0.7);
        const active = t >= r.at && (i === 2 || t < rows[i + 1].at);
        return (
          <div
            key={r.k}
            style={{
              position: "absolute",
              left: 220,
              top: 290 + i * 170,
              width: 1480,
              opacity: p * (active || t >= next ? 1 : 0.45),
              translate: `${(1 - p) * -40}px 0px`,
              display: "flex",
              alignItems: "baseline",
              gap: 40,
              borderBottom: `2px solid ${colors.line}`,
              paddingBottom: 26,
            }}
          >
            <div style={{ width: 360, fontFamily: fonts.mono, fontSize: 30, letterSpacing: 4, color: colors.orange }}>{r.k}</div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 64, color: colors.text }}>{r.v}</div>
          </div>
        );
      })}
      <Txt x={960} y={830} w={1200} align="center" size={34} mono color={colors.muted} t={t} at={next}>
        berikutnya: dua catatan menarik →
      </Txt>
    </>
  );
};

// ───────────── L-27 · Dibanding sel berinti saja ≈ 10 : 1 ─────────────
const L27: LV = ({ t }) => {
  const { c } = at("l27");
  const only = c("Kalau bakteri dibandingkan");
  const remind = c("Ingat");
  const drop = c("Kalau yang tanpa inti");
  const gather = ramp(t, drop + 0.4, 1.4);
  return (
    <>
      {tag(t, "SKEMA · catatan hitungan")}
      <Heading t={t} kicker="BAB 7" title="Catatan menarik" size={70} y={110} />
      <Svg>
        <CellGrid
          x={140}
          y={300}
          cell={52}
          appear={ramp(t, 0.2, 1.8)}
          nucleus={1}
          dimPlain={ramp(t, remind, 1)}
          gather={gather}
          gatherX={760}
          gatherY={814}
          gatherCols={10}
        />
        <line x1={740} x2={1800} y1={846} y2={846} stroke={colors.line} strokeWidth={3} opacity={rise(t, drop + 1.4, 0.6)} />
        <DotColumn x={1520} base={840} n={100} cols={10} d={44} appear={ramp(t, drop + 1.6, 1.4)} seed="l27b" />
      </Svg>
      <Txt x={1020} y={866} w={500} align="center" size={24} mono color={colors.cream} t={t} at={drop + 1.6}>
        10 sel berinti
      </Txt>
      <Txt x={1520} y={866} w={500} align="center" size={24} mono color={colors.orange} t={t} at={drop + 2}>
        ~100 bakteri
      </Txt>
      <Box t={t} at={only + 1.2} x={1120} y={210} w={700} label="dibanding sel berinti saja" size={70}>
        sekitar 10 : 1
      </Box>
    </>
  );
};

// ───────────── L-28 · Catatan, bukan asal mitos ─────────────
const L28: LV = ({ t }) => {
  const { c } = at("l28");
  const born = c("Mitosnya lahir");
  return (
    <>
      <Box t={t} at={0.2} x={1080} y={300} w={680} label="catatan hitungan" size={56} accent={colors.cream} note="catatan, bukan asal mitos">
        berinti saja ≈ 10 : 1
      </Box>
      <Box t={t} at={born - 0.3} x={160} y={300} w={560} label="asal mitos" size={70}>
        1972
      </Box>
      <Txt x={440} y={530} w={600} align="center" size={30} mono color={colors.orange} t={t} at={born}>
        perkiraan kasar ini
      </Txt>
      <Svg>
        <Arrow x1={1060} y1={420} x2={760} y2={420} draw={ramp(t, born, 0.8)} dashed />
      </Svg>
      <Keylines
        t={t}
        y={680}
        size={56}
        items={[
          [c("Ini hanya catatan"), "Hanya catatan hitungan."],
          [c("Bukan penyebab"), <>Bukan <span style={{ color: colors.orange }}>penyebab</span> lahirnya mitos.</>],
          [c("Dua hal yang berbeda"), "Dua hal berbeda · angkanya saja yang mirip"],
        ]}
      />
    </>
  );
};

// ───────────── L-29 · Massa: ~0,2 kg vs 1–3 kg ─────────────
const Platform: React.FC<{ readonly x: number; readonly y: number; readonly w: number }> = ({ x, y, w }) => (
  <g>
    <rect x={x - w / 2} y={y} width={w} height={14} rx={7} fill={colors.muted} />
    <rect x={x - 20} y={y + 14} width={40} height={60} fill={colors.line} />
    <rect x={x - w / 2 + 20} y={y + 74} width={w - 40} height={16} rx={8} fill={colors.line} />
  </g>
);

const L29: LV = ({ t }) => {
  const { c } = at("l29");
  const kg = c("massanya sekitar");
  const pct = c("Itu sekitar nol koma tiga");
  const old = c("Bandingkan");
  const drop = (a: number) => interpolate(rise(t, a, 0.6), [0, 1], [-300, 0]);
  return (
    <>
      {tag(t, "SKEMA · bukan skala sebenarnya")}
      <Heading t={t} kicker="SEKARANG BICARA BERAT" title="Seberapa berat bakterinya?" size={60} y={110} />
      <Svg>
        <Platform x={560} y={700} w={420} />
        <Platform x={1360} y={700} w={420} />
        <g transform={`translate(0 ${drop(kg)})`} opacity={rise(t, kg, 0.4)}>
          <rect x={520} y={620} width={80} height={80} rx={10} fill={colors.orange} style={{ filter: `drop-shadow(0 0 20px ${colors.orange}88)` }} />
        </g>
        <g transform={`translate(0 ${drop(old)})`} opacity={rise(t, old, 0.4) * 0.55}>
          <rect x={1220} y={420} width={280} height={280} rx={16} fill="none" stroke={colors.muted} strokeWidth={5} strokeDasharray="14 10" />
        </g>
      </Svg>
      <Txt x={560} y={460} w={500} align="center" size={84} color={colors.orange} t={t} at={kg + 0.3}>
        ~0,2 kg
      </Txt>
      <Txt x={560} y={810} w={500} align="center" size={30} mono color={colors.orangeSoft} t={t} at={pct}>
        ~0,3% berat tubuh
      </Txt>
      <Txt x={1360} y={520} w={500} align="center" size={64} color={colors.muted} t={t} at={old + 0.3}>
        1–3 kg
      </Txt>
      <Txt x={1360} y={810} w={500} align="center" size={30} mono color={colors.muted} t={t} at={old + 0.5}>
        klaim lama · 1–3%
      </Txt>
    </>
  );
};

// ───────────── L-30 · Jumlah ≠ massa ─────────────
const L30: LV = ({ t }) => {
  const { c } = at("l30");
  const mass = c("Sel lemak dan sel otot");
  const count = c("Tapi jumlahnya");
  const rbc = c("Sementara sel darah merah");
  const two = c("Jadi bakteri lebih banyak");
  const fin = c("Rasio jumlah");
  const x0 = 520;
  const w = 1200;
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="GAGASAN TADI KEMBALI" title={<>Jumlah <span style={{ color: colors.orange }}>≠</span> massa</>} size={64} y={110} out={fin} />
      <Shot t={t} from={0} to={fin}>
        {() => (
          <>
            <Svg>
              <rect x={x0} y={300} width={w} height={90} rx={14} fill={colors.panel} stroke={colors.line} strokeWidth={3} opacity={rise(t, mass, 0.5)} />
              <rect x={x0} y={300} width={w * 0.75 * ramp(t, mass + 0.3, 1.2)} height={90} rx={14} fill={colors.orange} />
              <rect x={x0} y={460} width={w} height={90} rx={14} fill={colors.panel} stroke={colors.line} strokeWidth={3} opacity={rise(t, count, 0.5)} />
              <rect x={x0} y={460} width={Math.max(4, w * 0.002) * ramp(t, count + 0.3, 0.8)} height={90} rx={2} fill={colors.orange} />
              <Arrow x1={x0 + 70} y1={600} x2={x0 + 8} y2={560} draw={ramp(t, count + 0.8, 0.4)} width={4} />
              {Array.from({ length: 18 }, (_, i) => (
                <RedCell key={i} cx={x0 + 40 + i * 64} cy={720} r={20} opacity={rise(t, rbc + i * 0.04, 0.4)} />
              ))}
            </Svg>
            <Txt x={140} y={322} w={360} size={34} mono color={colors.text} t={t} at={mass}>
              MASSA
            </Txt>
            <Txt x={140} y={482} w={360} size={34} mono color={colors.text} t={t} at={count}>
              JUMLAH
            </Txt>
            <Txt x={x0 + 30} y={318} w={900} size={40} color={colors.bg} t={t} at={mass + 1}>
              sel lemak & otot ~75%
            </Txt>
            <Txt x={x0 + 100} y={588} w={900} size={32} color={colors.orangeSoft} t={t} at={count + 0.8}>
              sel lemak & otot ~0,2% — sedikit, tapi berat
            </Txt>
            <Txt x={140} y={700} w={360} size={30} mono color="#E77A80" t={t} at={rbc} lh={1.2}>
              SEL DARAH
              <br />
              MERAH
            </Txt>
            <Txt x={x0 + w / 2} y={770} w={900} align="center" size={30} mono color={colors.muted} t={t} at={rbc + 0.6}>
              banyak, tapi kecil
            </Txt>
            <Keylines t={t} y={840} size={40} items={[[two, "“Lebih banyak” dan “lebih berat”: dua pertanyaan berbeda"]]} />
          </>
        )}
      </Shot>
      <Box t={t} at={fin} x={200} y={300} w={720} h={300} label="jumlah" size={84}>
        10:1 → <span style={{ color: colors.orange }}>~1,3:1</span>
      </Box>
      <Box t={t} at={c("Persen massa")} x={1000} y={300} w={720} h={300} label="massa" size={84}>
        1–3% → <span style={{ color: colors.orange }}>~0,3%</span>
      </Box>
    </>
  );
};

export const BAB6_7: Record<string, LV> = { l23: L23, l24: L24, l25: L25, l26: L26, l27: L27, l28: L28, l29: L29, l30: L30 };

export const SFX6_7: Record<string, readonly Cue[]> = (() => {
  const s = (id: string) => at(id);
  return {
    l23: [
      [0.1, "whoosh", 0.35],
      [s("l23").c("Jumlah bakteri"), "count", 0.35],
      [s("l23").c("Jumlah sel manusia"), "count", 0.3],
    ],
    l24: [
      [0.2, "reveal", 0.4],
      [s("l24").c("Bukan sepuluh") + 0.3, "strike", 0.35],
      [s("l24").c("Bukan seratus") + 0.3, "strike", 0.35],
      [s("l24").c("Dan bakteri paling"), "pop", 0.3],
    ],
    l25: [
      [s("l25").c("Untuk jumlah bakteri"), "shimmer", 0.25],
      [s("l25").c("Lalu ada hal"), "count", 0.3],
    ],
    l26: [
      [s("l26").c("Mitosnya berasal"), "tick", 0.35],
      [s("l26").c("Hitung ulang"), "tick", 0.35],
      [s("l26").c("Rasionya sekitar"), "tick", 0.35],
      [s("l26").c("Berikutnya"), "whoosh", 0.3],
    ],
    l27: [
      [0.2, "count", 0.25],
      [s("l27").c("Kalau bakteri dibandingkan") + 1.2, "hmm", 0.4],
      [s("l27").c("Kalau yang tanpa inti") + 0.4, "shrink", 0.3],
    ],
    l28: [
      [s("l28").c("Mitosnya lahir"), "whoosh", 0.3],
      [s("l28").c("Bukan penyebab"), "tick", 0.3],
    ],
    l29: [
      [s("l29").c("massanya sekitar") + 0.4, "scale", 0.45],
      [s("l29").c("Bandingkan") + 0.4, "scale", 0.35],
    ],
    l30: [
      [s("l30").c("Sel lemak dan sel otot") + 0.3, "whoosh", 0.3],
      [s("l30").c("Tapi jumlahnya") + 0.3, "pop", 0.3],
      [s("l30").c("Sementara sel darah merah"), "count", 0.25],
      [s("l30").c("Rasio jumlah"), "reveal", 0.35],
    ],
  };
})();

