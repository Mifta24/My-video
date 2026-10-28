import type React from "react";
import { interpolate, random } from "remotion";
import { clamp, easeInOut, easeOut, ramp, rise, SchemaTag, Shot, Txt } from "../elements/common";
import type { Cue } from "../elements/Sound";
import { Arrow, CellGrid, Figure, RedCell } from "../elements/viz";
import { colors, fonts } from "../theme";
import { at, Box, Heading, Keylines, Op, Pow, StepCards, Svg } from "./kit";
import type { LV } from "./kit";

const tag = (t: number, text = "SKEMA") => <SchemaTag t={t} x={64} y={40} align="right" text={text} size={22} />;

// Ikon tiga langkah: letak (pin), ruang (kotak), kepadatan (titik rapat).
const StepIcon: React.FC<{ readonly kind: "pin" | "box" | "dense"; readonly cx: number; readonly cy: number; readonly on: number }> = ({
  kind,
  cx,
  cy,
  on,
}) => {
  const col = on > 0.5 ? colors.orange : colors.muted;
  return (
    <g transform={`translate(${cx} ${cy})`} opacity={0.4 + 0.6 * on}>
      <circle r={120} fill={colors.panel} stroke={on > 0.5 ? colors.orange : colors.line} strokeWidth={4} />
      {kind === "pin" ? (
        <g>
          <path d="M0,58 C-40,10 -48,-10 -48,-26 A48,48 0 1 1 48,-26 C48,-10 40,10 0,58 Z" fill={col} />
          <circle cy={-26} r={18} fill={colors.panel} />
        </g>
      ) : kind === "box" ? (
        <g>
          <rect x={-52} y={-40} width={104} height={92} rx={8} fill="none" stroke={col} strokeWidth={8} />
          <path d="M-52,-40 L-28,-62 L76,-62 L52,-40 M76,-62 L76,30 L52,52" fill="none" stroke={col} strokeWidth={8} strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={-48 + (i % 5) * 24} cy={-48 + Math.floor(i / 5) * 24} r={9} fill={col} />
          ))}
        </g>
      )}
    </g>
  );
};

// ───────────── L-11 · Cara menaksir: letak, ruang, kepadatan ─────────────
const L11: LV = ({ t }) => {
  const { c } = at("l11");
  const a = [c("Di mana letaknya"), c("Berapa ruangnya"), c("Dan seberapa padat")];
  const recap = c("Letak, ruang, kepadatan");
  const on = (i: number) => (t >= recap ? 1 : t >= a[i] && (i === 2 || t < a[i + 1]) ? 1 : 0);
  const labels = ["LETAK", "RUANG", "KEPADATAN"];
  return (
    <>
      {tag(t, "SKEMA · cara menaksir")}
      <Heading t={t} kicker="BAB 4" title="Menghitung ulang: bakteri" size={70} y={110} />
      <Svg>
        {(["pin", "box", "dense"] as const).map((k, i) => (
          <g key={k} opacity={rise(t, a[i] - 0.3, 0.6)}>
            <StepIcon kind={k} cx={480 + i * 480} cy={520} on={on(i)} />
          </g>
        ))}
      </Svg>
      <Op x={1200} y={470} t={t} at={recap} size={80}>
        ×
      </Op>
      {labels.map((l, i) => (
        <Txt key={l} x={480 + i * 480} y={670} w={400} align="center" size={36} mono color={on(i) ? colors.orange : colors.muted} t={t} at={a[i]} spacing={4}>
          {l}
        </Txt>
      ))}
      <Txt x={960} y={780} w={1400} align="center" size={36} color={colors.text} t={t} at={recap + 0.5}>
        jumlah ≈ ruang × kepadatan · di tempat yang tepat
      </Txt>
    </>
  );
};

// ───────────── L-12 · Langkah 1: letak ─────────────
const L12: LV = ({ t }) => {
  const { c } = at("l12");
  const colon = c("Di usus besar");
  const upper = c("Di lambung");
  const why = c("Kenapa sedikit");
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="LANGKAH 1 · LETAK" title="Tidak tersebar rata" size={60} y={110} />
      <Svg>
        <Figure x={640} y={100} scale={0.95} appear={rise(t, 0.2, 0.7)} gutDraw={ramp(t, 0.3, 1.4)} tract={0.15} colon={ramp(t, colon, 0.8)} upperDim={ramp(t, upper, 0.8)} pulse={t} />
        <Arrow x1={1000} y1={330} x2={880} y2={360} draw={ramp(t, upper + 0.3, 0.5)} color={colors.muted} width={4} />
        <Arrow x1={1060} y1={520} x2={920} y2={480} draw={ramp(t, colon + 0.3, 0.5)} width={4} />
      </Svg>
      <Box t={t} at={upper} x={1020} y={210} w={560} label="lambung & usus halus atas" size={50} note="per mililiter" accent={colors.muted} align="left">
        <Pow exp="3" />–<Pow exp="4" />
      </Box>
      <Box t={t} at={colon} x={1080} y={450} w={600} label="usus besar (kolon)" size={50} align="left">
        ≥100× <span style={{ fontSize: 34 }}>lebih banyak dari organ lain</span>
      </Box>
      <Shot t={t} from={why}>
        {(lt) => (
          <>
            <Box t={lt} at={c("Asam lambung") - why} x={1080} y={690} w={280} h={150} label="sebab 1" size={46} accent={colors.muted}>
              pH rendah
            </Box>
            <Box t={lt} at={c("isi yang mengalir") - why} x={1390} y={690} w={290} h={150} label="sebab 2" size={46} accent={colors.muted}>
              aliran cepat
            </Box>
          </>
        )}
      </Shot>
      {t > c("isi yang mengalir") ? (
        <Svg>
          {[0, 1, 2].map((i) => {
            const x = 1420 + (((t - c("isi yang mengalir")) * 320 + i * 80) % 240);
            return <line key={i} x1={x} x2={x + 50} y1={862 + i * 10} y2={862 + i * 10} stroke={colors.muted} strokeWidth={4} strokeLinecap="round" />;
          })}
        </Svg>
      ) : null}
    </>
  );
};

// ───────────── L-13 · Mulut, kulit, organ lain: sedikit ─────────────
const L13: LV = ({ t }) => {
  const { c } = at("l13");
  const mouth = c("Seluruh bakteri di mulut");
  const other = c("Organ lain");
  const fill = ramp(t, 0.3, 1.4);
  const x0 = 160;
  const w = 1600;
  const slice = 0.03 * w;
  return (
    <>
      {tag(t, "SKEMA · proporsi kasar")}
      <Heading t={t} kicker="DI MANA BAKTERI TINGGAL?" title="Hampir semuanya di satu tempat" size={60} y={110} />
      <Svg>
        <rect x={x0} y={420} width={w} height={130} rx={18} fill={colors.panel} stroke={colors.line} strokeWidth={3} />
        <rect x={x0} y={420} width={(w - slice) * fill} height={130} rx={18} fill={colors.orange} />
        <rect x={x0 + w - slice} y={420} width={slice} height={130} rx={6} fill={colors.cream} opacity={rise(t, other, 0.5)} />
        <Arrow x1={x0 + w - slice / 2} y1={640} x2={x0 + w - slice / 2} y2={570} draw={ramp(t, other + 0.3, 0.4)} color={colors.cream} width={4} />
      </Svg>
      <Txt x={x0 + 40} y={455} w={800} size={52} color={colors.bg} t={t} at={0.8}>
        KOLON
      </Txt>
      <Txt x={x0 + w} y={660} w={700} align="right" size={36} color={colors.cream} t={t} at={other}>
        organ lain {"<"} 3% <span style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.muted }}>(maks ~<Pow exp="12" />, kulit ~<Pow exp="12" />)</span>
      </Txt>
      <Box t={t} at={mouth} x={160} y={630} w={760} label="mulut" size={42} align="left" accent={colors.cream}>
        seluruh mulut {"<"} 1% <span style={{ fontSize: 30, color: colors.muted }}>dari bakteri kolon</span>
      </Box>
      <Keylines t={t} y={820} size={54} items={[[c("Kolon."), <>Satu tempat: <span style={{ color: colors.orange }}>kolon</span>.</>]]} />
    </>
  );
};

// ───────────── L-14 · Langkah 2: ruang (1 L vs 0,4 L) ─────────────
const L14: LV = ({ t }) => {
  const { c } = at("l14");
  const old = c("Luckey memakai");
  const mri = c("Para penulis memakai");
  const meal = c("Setelah makan");
  const ref = c("Jadi nol koma empat");
  const H = 520;
  const base = 820;
  const fill = ramp(t, mri + 0.6, 1.4) * 0.4;
  const wob = t > meal ? 1 + 0.1 * Math.sin((t - meal) * 3.4) * (1 - ramp(t, ref, 0.8)) : 1;
  return (
    <>
      {tag(t, "SKEMA · bukan skala sebenarnya")}
      <Heading t={t} kicker="LANGKAH 2 · RUANG" title="Berapa isi kolon?" size={60} y={110} />
      <Svg>
        <g opacity={rise(t, old, 0.6)}>
          <rect x={360} y={base - H} width={420} height={H} rx={18} fill="rgba(142,156,192,0.12)" stroke={colors.muted} strokeWidth={4} strokeDasharray="14 10" />
        </g>
        <g opacity={rise(t, mri, 0.6)}>
          <rect x={1040} y={base - H} width={420} height={H} rx={18} fill="none" stroke={colors.line} strokeWidth={3} strokeDasharray="8 10" />
          <rect x={1046} y={base - H * fill * wob} width={408} height={H * fill * wob - 6} rx={14} fill={colors.orange} />
          <rect x={1040} y={base - H * 0.4 * 1.25} width={420} height={H * 0.4 * 0.5} fill={colors.orange} opacity={0.14 * rise(t, c("ketidakpastian"), 0.6)} />
        </g>
      </Svg>
      <Txt x={570} y={base + 20} w={500} align="center" size={56} color={colors.muted} t={t} at={old}>
        1 liter
      </Txt>
      <Txt x={570} y={base + 90} w={500} align="center" size={24} mono color={colors.muted} t={t} at={old + 0.3}>
        1972 · seluruh saluran cerna
      </Txt>
      <Txt x={1250} y={base + 20} w={500} align="center" size={56} color={colors.orange} t={t} at={mri + 1}>
        ~0,4 liter
      </Txt>
      <Txt x={1250} y={base + 90} w={600} align="center" size={24} mono color={colors.muted} t={t} at={mri + 1.2}>
        analisis MRI · ketidakpastian ~25%
      </Txt>
      <Box t={t} at={meal} x={1520} y={360} w={300} h={150} label="setelah makan" size={50} out={ref}>
        ±10%
      </Box>
      <Keylines t={t} y={180} x={1250} w={600} size={34} items={[[ref, <span style={{ color: colors.orange }}>angka acuan</span>]]} />
    </>
  );
};

// ───────────── L-15 · Langkah 3: kepadatan dari 14 studi ─────────────
const L15: LV = ({ t }) => {
  const { c } = at("l15");
  const st = c("Para penulis mengumpulkan");
  const val = c("Kepadatan terukurnya");
  const v90 = c("Atau sekitar sembilan");
  const vary = c("Variasi antarorang");
  const merge = ramp(t, val - 0.2, 1.2);
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="LANGKAH 3 · KEPADATAN" title="Berapa padat isinya?" size={60} y={110} />
      <Svg>
        {Array.from({ length: 14 }, (_, i) => {
          const p = rise(t, st + 0.5 + i * 0.12, 0.4);
          const ang = (i / 14) * Math.PI * 2;
          const sx = 960 + Math.cos(ang) * 330;
          const sy = 470 + Math.sin(ang) * 170;
          const x = sx + (960 - sx) * easeOut(merge);
          const y = sy + (470 - sy) * easeOut(merge);
          return <circle key={i} cx={x} cy={y} r={22 - merge * 10} fill={colors.orange} opacity={p * (1 - merge * 0.9)} />;
        })}
      </Svg>
      <Txt x={960} y={420} w={600} align="center" size={86} color={colors.text} t={t} at={st} out={val}>
        14 studi
      </Txt>
      <Box t={t} at={val + 0.6} x={560} y={330} w={800} label="per gram tinja basah" size={88} note={t > v90 ? "≈ 90 miliar bakteri per gram" : undefined}>
        ~0,9 × <Pow exp="11" />
      </Box>
      {t > vary ? (
        <Svg>
          <g opacity={rise(t, vary, 0.6)}>
            <line x1={600} x2={1320} y1={700} y2={700} stroke={colors.line} strokeWidth={4} />
            <rect x={960 - 360 * 0.46 * ramp(t, vary, 1)} y={684} width={720 * 0.46 * ramp(t, vary, 1)} height={32} rx={16} fill={colors.orange} opacity={0.5} />
            <circle cx={960} cy={700} r={12} fill={colors.orange} />
          </g>
        </Svg>
      ) : null}
      <Txt x={960} y={740} w={800} align="center" size={30} mono color={colors.orangeSoft} t={t} at={vary + 0.4}>
        variasi antarorang ~46%
      </Txt>
    </>
  );
};

// ───────────── L-16 · Yang meleset: ruangnya ─────────────
const L16: LV = ({ t }) => {
  const { c } = at("l16");
  const same = c("Kepadatan ini");
  const miss = c("Yang meleset");
  const mul = c("Kalikan ruang");
  const base = 820;
  const grow = ramp(t, 0.3, 1);
  return (
    <>
      {tag(t, "SKEMA · bukan skala sebenarnya")}
      <Heading t={t} kicker="PERHATIKAN" title="Yang berubah: ruangnya" size={60} y={110} />
      <Svg>
        <line x1={160} x2={900} y1={base + 4} y2={base + 4} stroke={colors.line} strokeWidth={3} />
        <rect x={250} y={base - 520 * grow} width={200} height={520 * grow} rx={14} fill={colors.muted} opacity={0.35} />
        <rect x={600} y={base - 520 * 0.4 * ramp(t, mul, 1.4) - (t < mul ? 520 * grow : 0) * 0} width={200} height={520 * (t < mul ? 0 : 0.4 * ramp(t, mul, 1.4))} rx={14} fill={colors.orange} />
        {t < mul ? <rect x={600} y={base - 520 * grow} width={200} height={520 * grow} rx={14} fill="none" stroke={colors.orange} strokeWidth={3} strokeDasharray="10 10" opacity={0.5} /> : null}
      </Svg>
      <Txt x={350} y={base + 20} w={300} align="center" size={28} mono color={colors.muted} t={t} at={0.3}>
        perkiraan 1972
      </Txt>
      <Txt x={700} y={base + 20} w={300} align="center" size={28} mono color={colors.orange} t={t} at={0.5}>
        hitung ulang
      </Txt>
      <Box t={t} at={same} x={1040} y={290} w={700} h={170} label="kepadatan" size={52} align="left" accent={colors.muted}>
        ≈ sama ✓
      </Box>
      <Box t={t} at={miss} x={1040} y={500} w={700} h={170} label="ruang" size={52} align="left">
        1 L → 0,4 L ↓
      </Box>
      <Keylines
        t={t}
        x={1040}
        w={820}
        y={720}
        size={36}
        align="left"
        items={[[c("Bukan karena"), <>bukan kepadatannya diubah, tapi <span style={{ color: colors.orange }}>ruangnya diukur</span></>]]}
      />
    </>
  );
};

// ───────────── L-17 · Ukuran bakteri: 1 pg vs ~5 pg ─────────────
const L17: LV = ({ t }) => {
  const { c } = at("l17");
  const std = c("Buku teks");
  const pg = c("Pikogram itu");
  const gut = c("Tapi bakteri usus");
  const fewer = c("Kalau bakterinya");
  const cause = c("Inilah salah satu");
  const small = Array.from({ length: 30 }, (_, i) => i);
  const big = Array.from({ length: 6 }, (_, i) => i);
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="SATU HAL LAGI" title="Ukuran bakteri" size={60} y={110} />
      <Shot t={t} from={0} to={fewer}>
        {() => (
          <>
            <Svg>
              <circle cx={520} cy={500} r={46 * rise(t, std, 0.6)} fill={colors.orangeSoft} />
              <circle cx={1220} cy={500} r={46 * Math.cbrt(5) * rise(t, gut, 0.8)} fill={colors.orange} />
            </Svg>
            <Txt x={520} y={620} w={600} align="center" size={34} color={colors.text} t={t} at={std}>
              standar buku teks
            </Txt>
            <Txt x={520} y={670} w={600} align="center" size={28} mono color={colors.muted} t={t} at={std + 0.4}>
              1 µm³ · ~1 pg
            </Txt>
            <Txt x={1220} y={640} w={600} align="center" size={34} color={colors.orange} t={t} at={gut}>
              bakteri usus
            </Txt>
            <Txt x={1220} y={690} w={600} align="center" size={28} mono color={colors.muted} t={t} at={gut + 0.4}>
              ~5 pg (basah)
            </Txt>
            <Txt x={960} y={780} w={1400} align="center" size={30} mono color={colors.muted} t={t} at={pg} out={gut}>
              1 pikogram = sepersejuta dari sepersejuta gram
            </Txt>
          </>
        )}
      </Shot>
      <Shot t={t} from={fewer}>
        {(lt) => (
          <>
            <Svg>
              <rect x={300} y={300} width={500} height={400} rx={18} fill="none" stroke={colors.line} strokeWidth={4} />
              <rect x={1120} y={300} width={500} height={400} rx={18} fill="none" stroke={colors.line} strokeWidth={4} />
              {small.map((i) => (
                <circle key={i} cx={350 + (i % 6) * 80} cy={350 + Math.floor(i / 6) * 75} r={22} fill={colors.orangeSoft} opacity={rise(lt, i * 0.03, 0.3)} />
              ))}
              {big.map((i) => (
                <circle key={i} cx={1215 + (i % 3) * 155} cy={420 + Math.floor(i / 3) * 160} r={22 * Math.cbrt(5)} fill={colors.orange} opacity={rise(lt, 0.3 + i * 0.1, 0.3)} />
              ))}
            </Svg>
            <Txt x={550} y={720} w={500} align="center" size={28} mono color={colors.muted} t={lt} at={0.2}>
              massa sama · bakteri kecil
            </Txt>
            <Txt x={1370} y={720} w={500} align="center" size={28} mono color={colors.orange} t={lt} at={0.4}>
              massa sama · bakteri besar
            </Txt>
            <Txt x={960} y={790} w={1500} align="center" size={40} t={lt} at={0.8}>
              bakteri lebih besar → <span style={{ color: colors.orange }}>jumlahnya lebih sedikit</span>
            </Txt>
          </>
        )}
      </Shot>
      <Keylines t={t} y={180} x={1500} w={700} size={30} items={[[cause, <span style={{ color: colors.orangeSoft }}>salah satu sebab 100 : 1 kebesaran</span>]]} />
    </>
  );
};

// ───────────── L-18 · Rekap sisi bakteri ─────────────
const L18: LV = ({ t }) => {
  const { c } = at("l18");
  const a = [c("Satu, hampir"), c("Dua, ruangnya"), c("Tiga, kepadatannya"), c("Empat, bakteri usus")];
  const done = c("Sisi bakteri selesai");
  const next = c("Sekarang sisi satunya");
  const cur = a.reduce((n, x, i) => (t >= x ? i : n), -1);
  const slide = interpolate(t, [next, next + 1.2], [0, -1920], { ...clamp, easing: easeInOut });
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${slide}px 0px` }}>
      <Heading t={t} kicker="JEDA RINGKAS 1" title="Rekap sisi bakteri" size={60} y={110} />
      <StepCards
        t={t}
        x={110}
        y={260}
        w={860}
        h={128}
        gap={24}
        size={36}
        items={[
          { at: a[0], text: "Hampir semua di kolon" },
          { at: a[1], text: "Ruang ~0,4 L, bukan 1 L" },
          { at: a[2], text: <>~0,9 × <Pow exp="11" />/g · 14 studi</> },
          { at: a[3], text: "Bakteri usus lebih besar" },
        ]}
        active={(i) => (t >= done ? 1 : i === cur ? 1 : 0.3)}
      />
      <Svg>
        <g opacity={cur === 0 ? 1 : 0}>
          <Figure x={1250} y={120} scale={0.85} gutDraw={1} tract={0.1} colon={1} upperDim={1} pulse={t} />
        </g>
        <g opacity={cur === 1 ? 1 : 0}>
          <rect x={1260} y={300} width={360} height={460} rx={16} fill="none" stroke={colors.muted} strokeWidth={4} strokeDasharray="12 10" />
          <rect x={1266} y={760 - 460 * 0.4} width={348} height={460 * 0.4 - 6} rx={12} fill={colors.orange} />
        </g>
        <g opacity={cur === 3 ? 1 : 0}>
          <circle cx={1300} cy={520} r={44} fill={colors.orangeSoft} />
          <circle cx={1560} cy={520} r={44 * Math.cbrt(5)} fill={colors.orange} />
        </g>
      </Svg>
      {cur === 1 ? (
        <Txt x={1440} y={790} w={500} align="center" size={52} color={colors.orange}>
          0,4 L
        </Txt>
      ) : null}
      {cur === 2 ? (
        <Txt x={1440} y={430} w={600} align="center" size={110} color={colors.orange}>
          14 studi
        </Txt>
      ) : null}
      <Txt x={540} y={850} w={900} align="center" size={34} mono color={colors.orange} t={t} at={done}>
        ✓ sisi bakteri selesai
      </Txt>
      <div style={{ position: "absolute", left: 1920, top: 0, width: 1920, height: 1080 }}>
        <Heading t={t} at={next} kicker="BERIKUTNYA" title="Sisi sel manusia →" size={86} y={380} align="center" />
        <Svg>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={640 + i * 80} cy={640} r={24} fill={colors.cream} opacity={rise(t, next + 0.6 + i * 0.06, 0.4)} />
          ))}
        </Svg>
      </div>
    </div>
  );
};

// ───────────── L-19 · Sisi sel manusia: mosaik sel ─────────────
const L19: LV = ({ t }) => {
  const cells = Array.from({ length: 70 }, (_, i) => i);
  return (
    <>
      {tag(t, "SKEMA · ilustrasi keragaman sel")}
      <Heading t={t} kicker="BAB 5" title="Menghitung ulang: sel manusia" size={70} y={110} />
      <Svg>
        {cells.map((i) => {
          const x = 180 + (i % 14) * 115 + random(`m${i}x`) * 40;
          const y = 330 + Math.floor(i / 14) * 115 + random(`m${i}y`) * 30;
          const kind = Math.floor(random(`m${i}k`) * 4);
          const s = 0.5 + random(`m${i}s`) * 0.9;
          const p = rise(t, 0.3 + random(`m${i}d`) * 2.5, 0.6);
          const fill = kind === 3 ? colors.creamDim : colors.cream;
          const wob = Math.sin(t * 1.2 + i) * 3;
          return (
            <g key={i} transform={`translate(${x} ${y + wob}) scale(${s * p})`} opacity={0.85 * p}>
              {kind === 0 ? <circle r={34} fill={fill} /> : null}
              {kind === 1 ? <rect x={-36} y={-28} width={72} height={56} rx={22} fill={fill} /> : null}
              {kind === 2 ? <ellipse rx={46} ry={16} fill={fill} /> : null}
              {kind === 3 ? <path d="M-40,0 L-14,-30 L30,-22 L42,8 L10,32 L-30,24 Z" fill={fill} /> : null}
            </g>
          );
        })}
      </Svg>
    </>
  );
};

// ───────────── L-20 · ~37 triliun vs ~30 triliun ─────────────
const L20: LV = ({ t }) => {
  const { c } = at("l20");
  const a = c("Satu cara");
  const b = c("Lalu para penulis");
  const near = c("Dua angka itu");
  return (
    <>
      <Heading t={t} kicker="DUA CARA MENGHITUNG" title="Angkanya berdekatan" size={60} y={110} />
      <Box t={t} at={a} x={220} y={320} w={660} h={300} label="per jenis sel · 56 kategori" size={110} accent={colors.cream}>
        ~37 <span style={{ fontSize: 44 }}>triliun</span>
      </Box>
      <Box t={t} at={b} x={1040} y={320} w={660} h={300} label="hitung ulang penulis" size={110} accent={colors.cream}>
        ~30 <span style={{ fontSize: 44 }}>triliun</span>
      </Box>
      <Svg>
        <path
          d="M550,660 L550,700 L1370,700 L1370,660"
          fill="none"
          stroke={colors.orange}
          strokeWidth={6}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ramp(t, near, 0.8)}
        />
      </Svg>
      <Txt x={960} y={720} w={800} align="center" size={40} color={colors.orange} t={t} at={near + 0.6}>
        kisaran yang dekat
      </Txt>
      <Txt x={960} y={790} w={800} align="center" size={24} mono color={colors.muted} t={t} at={near + 0.8}>
        Sender, Fuchs & Milo, 2016
      </Txt>
    </>
  );
};

// ───────────── L-21 · 90% tanpa inti ─────────────
const L21: LV = ({ t }) => {
  const { c } = at("l21");
  const nuc = c("Hanya sekitar sepuluh");
  return (
    <>
      {tag(t, "SKEMA · 100 sel, ilustrasi proporsi")}
      <Svg>
        <CellGrid x={240} y={200} cell={66} appear={ramp(t, 0.2, 2.4)} nucleus={rise(t, nuc - 0.4, 0.8)} />
      </Svg>
      <Box t={t} at={c("Sekitar sembilan")} x={1050} y={240} w={700} label="tanpa inti" size={92} accent={colors.cream} align="left" note="terutama sel darah merah & trombosit">
        ~90%
      </Box>
      <Box t={t} at={nuc} x={1050} y={530} w={700} label="berinti" size={92} align="left">
        ~10%
      </Box>
      <Keylines t={t} x={1050} w={800} y={810} size={34} align="left" items={[[c("Jadi dari sisi"), "jumlah sel didominasi sel tanpa inti"]]} />
    </>
  );
};

// ───────────── L-22 · Ukuran sel darah merah (penanda satuan) ─────────────
const L22: LV = ({ t }) => {
  const { c } = at("l22");
  const unit = c("Kita sudah bertemu");
  const lesson = c("Pelajarannya");
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="SEL DARAH MERAH" title="Kecil juga" size={60} y={110} />
      <Svg>
        <RedCell cx={620} cy={500} r={120 * rise(t, 0.3, 0.8)} />
        <circle cx={1300} cy={500} r={26 * rise(t, unit, 0.6)} fill={colors.orangeSoft} />
      </Svg>
      <Txt x={620} y={660} w={600} align="center" size={56} color={colors.text} t={t} at={c("Volumenya")}>
        ~100 µm³
      </Txt>
      <Txt x={1300} y={560} w={600} align="center" size={40} color={colors.orangeSoft} t={t} at={unit}>
        1 µm³
      </Txt>
      <Txt x={1300} y={620} w={600} align="center" size={24} mono color={colors.muted} t={t} at={unit + 0.3}>
        bakteri buku teks · penanda satuan
      </Txt>
      <Keylines
        t={t}
        y={780}
        size={50}
        items={[
          [lesson, "Ukuran sel beragam sekali"],
          [c("Dan ukuran tidak"), <>Ukuran <span style={{ color: colors.orange }}>≠</span> jumlah</>],
        ]}
      />
    </>
  );
};

export const BAB4_5: Record<string, LV> = {
  l11: L11,
  l12: L12,
  l13: L13,
  l14: L14,
  l15: L15,
  l16: L16,
  l17: L17,
  l18: L18,
  l19: L19,
  l20: L20,
  l21: L21,
  l22: L22,
};

export const SFX4_5: Record<string, readonly Cue[]> = (() => {
  const s = (id: string) => at(id);
  return {
    l11: [
      [0.1, "whoosh", 0.35],
      [s("l11").c("Di mana letaknya"), "tick", 0.4],
      [s("l11").c("Berapa ruangnya"), "tick", 0.4],
      [s("l11").c("Dan seberapa padat"), "tick", 0.4],
      [s("l11").c("Letak, ruang, kepadatan"), "ding", 0.25],
    ],
    l12: [
      [s("l12").c("Di usus besar"), "pop", 0.45],
      [s("l12").c("Di lambung"), "tick", 0.35],
      [s("l12").c("Asam lambung"), "tick", 0.3],
      [s("l12").c("isi yang mengalir"), "whoosh", 0.25],
    ],
    l13: [
      [0.3, "whoosh", 0.3],
      [s("l13").c("Organ lain"), "tick", 0.35],
      [s("l13").c("Kolon."), "pop", 0.4],
    ],
    l14: [
      [s("l14").c("Luckey memakai"), "tick", 0.35],
      [s("l14").c("Para penulis memakai") + 0.6, "shimmer", 0.25],
      [s("l14").c("Setelah makan"), "pop", 0.3],
    ],
    l15: [
      [s("l15").c("Para penulis mengumpulkan") + 0.5, "count", 0.3],
      [s("l15").c("Kepadatan terukurnya"), "reveal", 0.3],
      [s("l15").c("Variasi antarorang"), "shimmer", 0.2],
    ],
    l16: [
      [s("l16").c("Kepadatan ini"), "tick", 0.35],
      [s("l16").c("Yang meleset"), "pop", 0.35],
      [s("l16").c("Kalikan ruang"), "shrink", 0.35],
    ],
    l17: [
      [s("l17").c("Buku teks"), "pop", 0.3],
      [s("l17").c("Tapi bakteri usus"), "pop", 0.35],
      [s("l17").c("Kalau bakterinya"), "whoosh", 0.3],
    ],
    l18: [
      [s("l18").c("Satu, hampir"), "tick", 0.35],
      [s("l18").c("Dua, ruangnya"), "tick", 0.35],
      [s("l18").c("Tiga, kepadatannya"), "tick", 0.35],
      [s("l18").c("Empat, bakteri usus"), "tick", 0.35],
      [s("l18").c("Sisi bakteri selesai"), "ding", 0.25],
      [s("l18").c("Sekarang sisi satunya"), "whoosh", 0.4],
    ],
    l19: [[0.2, "shimmer", 0.25]],
    l20: [
      [s("l20").c("Satu cara"), "pop", 0.35],
      [s("l20").c("Lalu para penulis"), "pop", 0.35],
    ],
    l21: [
      [0.3, "count", 0.3],
      [s("l21").c("Hanya sekitar sepuluh") - 0.4, "pop", 0.35],
    ],
    l22: [
      [0.3, "pop", 0.3],
      [s("l22").c("Kita sudah bertemu"), "tick", 0.3],
    ],
  };
})();

