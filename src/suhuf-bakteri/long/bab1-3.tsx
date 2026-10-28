import type React from "react";
import { interpolate, random } from "remotion";
import { SheetOpen } from "../elements/Brand";
import { clamp, easeInOut, ramp, rise, SchemaTag, Shot, Txt } from "../elements/common";
import type { Cue } from "../elements/Sound";
import { Arrow, DotColumn, Figure, RatioText } from "../elements/viz";
import { colors, fonts } from "../theme";
import { at, Box, Heading, Keylines, Op, Paraphrase, Pow, StepCards, Svg, TimelineBar } from "./kit";
import type { LV } from "./kit";

const tag = (t: number, text = "SKEMA") => <SchemaTag t={t} x={64} y={40} align="right" text={text} size={22} />;

// ───────────── L-01 · HOOK ─────────────
const L01: LV = ({ t }) => {
  const { c } = at("l01");
  const recount = c("ketika seseorang menghitungnya");
  const shrink = interpolate(t, [recount, recount + 1.8], [0, 1], { ...clamp, easing: easeInOut });
  const echoAt = c("Dan diulang");
  const askAt = c("dari mana angka");
  const echoes = [
    [300, 180, 70, -8],
    [1500, 160, 64, 6],
    [220, 520, 56, 5],
    [1640, 520, 60, -6],
    [420, 760, 50, -4],
    [1480, 780, 52, 7],
  ] as const;
  return (
    <>
      {tag(t, "SKEMA · ilustrasi mitos")}
      {echoes.map(([x, y, s, r], i) => {
        const p = rise(t, echoAt + i * 0.22, 0.5) * (1 - ramp(t, askAt, 0.6) * 0.7);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 150,
              top: y,
              width: 300,
              textAlign: "center",
              opacity: p * 0.35,
              rotate: `${r}deg`,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: s,
              color: colors.orange,
            }}
          >
            10 : 1
          </div>
        );
      })}
      <RatioText
        text="10 : 1"
        x={960}
        y={140}
        size={210}
        appear={rise(t, 0.1, 0.5)}
        strike={ramp(t, recount + 0.4, 0.4)}
      />
      <Svg>
        <line x1={620} x2={1300} y1={872} y2={872} stroke={colors.line} strokeWidth={3} />
        <DotColumn x={800} base={860} n={interpolate(shrink, [0, 1], [100, 13])} cols={10} d={28} appear={ramp(t, 0.6, 2)} seed="l1b" />
        <DotColumn x={1140} base={860} n={10} cols={10} d={28} color={colors.cream} appear={ramp(t, 0.4, 0.8)} seed="l1h" />
      </Svg>
      <Txt x={800} y={888} w={360} align="center" size={26} mono color={colors.orange} t={t} at={0.6} spacing={3}>
        BAKTERI
      </Txt>
      <Txt x={1140} y={888} w={360} align="center" size={26} mono color={colors.cream} t={t} at={0.4} spacing={3}>
        SEL MANUSIA
      </Txt>
      <Keylines
        t={t}
        y={430}
        size={50}
        until={recount - 0.2}
        items={[
          [c("Angkanya rapi"), "Rapi. Mudah diingat."],
          [echoAt, "Diulang di mana-mana."],
          [askAt, <>Dari mana <span style={{ color: colors.orange }}>asalnya?</span></>],
          [c("Ternyata angka itu"), <>Berawal dari <span style={{ color: colors.orange }}>perkiraan kasar</span></>],
        ]}
      />
    </>
  );
};

// ───────────── L-02 · Kartu judul ─────────────
const L02: LV = ({ t }) => {
  const { c } = at("l02");
  const route = c("Perjalanannya");
  return (
    <>
      <SheetOpen t={t} cx={960} cy={360} w={860} taglineAt={0.45} title={t > c("Hari ini") ? "MITOS 10 : 1" : undefined} />
      <Svg>
        <line
          x1={240}
          x2={240 + 1440 * ramp(t, route, 1.2)}
          y1={360}
          y2={360}
          stroke={colors.orange}
          strokeWidth={3}
          strokeDasharray="12 12"
          opacity={0.6}
        />
      </Svg>
      <Txt x={170} y={300} w={300} align="center" size={56} color={colors.orange} t={t} at={route}>
        1972
      </Txt>
      <Txt x={1750} y={300} w={300} align="center" size={56} color={colors.cream} t={t} at={c("2016")}>
        2016
      </Txt>
      <Txt x={170} y={372} w={300} align="center" size={22} mono color={colors.muted} t={t} at={route + 0.2}>
        perkiraan
      </Txt>
      <Txt x={1750} y={372} w={300} align="center" size={22} mono color={colors.muted} t={t} at={c("2016") + 0.2}>
        hitung ulang
      </Txt>
    </>
  );
};

// ───────────── L-03 · Klaim yang sering diulang ─────────────
const QuoteCard: React.FC<{
  readonly t: number;
  readonly a: number;
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly children: React.ReactNode;
}> = ({ t, a, x, y, r, children }) => {
  const p = rise(t, a, 0.6);
  if (p <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 760,
        opacity: p,
        rotate: `${r}deg`,
        translate: `${(1 - p) * -60}px 0px`,
        background: colors.cream,
        color: colors.bg,
        borderRadius: 16,
        padding: "26px 34px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        fontFamily: fonts.heading,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 1.2,
      }}
    >
      {children}
      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <div style={{ height: 8, width: 280, borderRadius: 8, background: "rgba(8,16,34,0.25)" }} />
        <div style={{ height: 8, width: 160, borderRadius: 8, background: "rgba(8,16,34,0.18)" }} />
      </div>
    </div>
  );
};

const L03: LV = ({ t }) => {
  const { c } = at("l03");
  const small = c("Bakteri itu kecil");
  const dots = Array.from({ length: 160 }, (_, i) => i);
  return (
    <>
      {tag(t, "SKEMA · contoh kalimat")}
      <Heading t={t} kicker="APA KATA BANYAK ORANG" title="Klaimnya hampir selalu sama" size={58} y={110} />
      <QuoteCard t={t} a={c("Bakteri di tubuh")} x={140} y={290} r={-2}>
        Bakteri di tubuh manusia <span style={{ color: colors.orange }}>10 kali lipat</span> sel manusia.
      </QuoteCard>
      <QuoteCard t={t} a={c("Bakteri di tubuh", 1.6)} x={200} y={480} r={1.5}>
        …jumlahnya <span style={{ color: colors.orange }}>sepuluh kali lebih banyak</span>…
      </QuoteCard>
      <QuoteCard t={t} a={c("Sebagian orang")} x={160} y={670} r={-1}>
        …bahkan <span style={{ color: colors.orange }}>100 kali lipat</span>.
      </QuoteCard>
      <Svg>
        {dots.map((i) => {
          const p = rise(t, small + (i % 40) * 0.03, 0.4);
          const x = 1080 + random(`d3x${i}`) * 700;
          const y = 300 + random(`d3y${i}`) * 520;
          const drift = Math.sin(t * 1.3 + i) * 4;
          return <circle key={i} cx={x + drift} cy={y - drift} r={4 + random(`d3r${i}`) * 3} fill={colors.orange} opacity={p * 0.85} />;
        })}
      </Svg>
      <Keylines
        t={t}
        x={1430}
        w={760}
        y={830}
        size={38}
        items={[
          [small, "kecil sekali, dan banyak"],
          [c("Jadi sepuluh"), "10× terdengar wajar…"],
          [c("Seratus kali lipat pun"), "100× pun terdengar mungkin"],
        ]}
      />
    </>
  );
};

// ───────────── L-04 · Peta perjalanan: tiga hal ─────────────
const L04: LV = ({ t }) => {
  const { c } = at("l04");
  const a = [c("Pertama"), c("Kedua"), c("Ketiga")];
  const focus = c("Kita mulai dari");
  return (
    <>
      <Heading t={t} kicker="DI VIDEO INI" title="Tiga hal yang kita lakukan" size={60} y={120} />
      <StepCards
        t={t}
        x={160}
        y={300}
        w={1100}
        h={140}
        gap={34}
        size={46}
        items={[
          { at: a[0], text: "Mencari asal angkanya" },
          { at: a[1], text: "Menghitung ulang: bakteri & sel manusia" },
          { at: a[2], text: "Melihat yang masih belum pasti" },
        ]}
        active={(i) => (t >= focus ? (i === 0 ? 1 : 0.15) : t >= a[i] && (i === 2 || t < a[i + 1]) ? 1 : 0.35)}
      />
      <Svg>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={1470 + i * 110}
            cy={510}
            r={34}
            fill={i === 0 && t >= focus ? colors.orange : "none"}
            stroke={i === 0 && t >= focus ? colors.orange : colors.line}
            strokeWidth={5}
            opacity={rise(t, a[i], 0.5)}
          />
        ))}
        <line x1={1504} x2={1546} y1={510} y2={510} stroke={colors.line} strokeWidth={4} opacity={rise(t, a[1], 0.5)} />
        <line x1={1614} x2={1656} y1={510} y2={510} stroke={colors.line} strokeWidth={4} opacity={rise(t, a[2], 0.5)} />
      </Svg>
      <Txt x={1580} y={570} w={420} align="center" size={30} mono color={colors.orange} t={t} at={focus}>
        mulai dari no. 1
      </Txt>
    </>
  );
};

// ───────────── L-05 · 1972: hitungan di balik amplop ─────────────
const Envelope: React.FC<{ readonly x: number; readonly y: number; readonly t: number; readonly draw: number }> = ({ x, y, t, draw }) => {
  const p = rise(t, 0.3, 0.8);
  return (
    <g transform={`translate(${x} ${y})`} opacity={p}>
      <rect x={0} y={0} width={560} height={340} rx={14} fill={colors.cream} />
      <path d="M0,10 L280,190 L560,10" fill="none" stroke="#CDBB98" strokeWidth={5} />
      <path d="M0,340 L220,170 M560,340 L340,170" fill="none" stroke="#E2D3B5" strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M${70 + i * 18},${215 + i * 30} q60,-14 120,0 t120,0 t110,-4`}
          fill="none"
          stroke={colors.orange}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - interpolate(draw * 4 - i, [0, 1], [0, 1], clamp)}
        />
      ))}
    </g>
  );
};

const L05: LV = ({ t }) => {
  const { c } = at("l05");
  const env = c("hitungan di balik amplop");
  const n1 = c("Yang pertama");
  return (
    <>
      {tag(t, "SKEMA · perkiraan kasar, bukan data pengukuran")}
      <TimelineBar
        t={t}
        y={160}
        nodes={[
          { x: 360, label: "1972" },
          { x: 960, label: "1977" },
          { x: 1560, label: "2016" },
        ]}
        lit={(i) => (i === 0 ? rise(t, 0.3, 0.6) : 0)}
        draw={0}
      />
      <Txt x={360} y={250} w={500} align="center" size={30} mono color={colors.text} t={t} at={c("Luckey")}>
        Luckey
      </Txt>
      <Svg>
        <Envelope x={150} y={380} t={t} draw={ramp(t, env, 3)} />
      </Svg>
      <Txt x={430} y={760} w={600} align="center" size={30} mono color={colors.muted} t={t} at={env}>
        hitungan di balik amplop
      </Txt>
      <Txt x={430} y={800} w={600} align="center" size={26} mono color={colors.muted} t={t} at={env + 0.5}>
        (back-of-the-envelope)
      </Txt>
      <Keylines
        t={t}
        x={1320}
        w={760}
        y={420}
        size={52}
        until={n1 - 0.2}
        items={[
          [c("Hitungannya sederhana"), "Sederhana."],
          [c("Cepat, kasar"), "Cepat · kasar · cukup untuk gambaran"],
          [c("Ia memakai dua"), "Dua bilangan"],
        ]}
      />
      <Box t={t} at={n1} x={1010} y={380} w={640} label="bilangan 1 · per gram isi" size={84} note="≈ 100 miliar bakteri">
        <Pow pre="~" exp="11" />
      </Box>
    </>
  );
};

// ───────────── L-06 · × 1 liter = ? ─────────────
const L06: LV = ({ t }) => {
  const { c } = at("l06");
  const b2 = c("Bilangan kedua");
  const mul = c("Lalu kedua bilangan");
  const note = c("Tapi perhatikan");
  return (
    <>
      {tag(t)}
      <Box t={t} at={0} x={110} y={240} w={420} label="per gram isi" size={70}>
        <Pow pre="~" exp="11" />
      </Box>
      <Op x={600} y={300} t={t} at={b2}>
        ×
      </Op>
      <Box t={t} at={b2 + 0.3} x={680} y={240} w={420} label="kapasitas saluran cerna" size={70} note="≈ 1 kg isi">
        1 liter
      </Box>
      <Op x={1170} y={300} t={t} at={mul}>
        =
      </Op>
      <Txt x={1170} y={430} w={300} align="center" size={170} color={colors.orange} t={t} at={mul + 0.4}>
        ?
      </Txt>
      <Svg>
        <Figure x={1340} y={150} scale={0.86} appear={rise(t, 0.4, 0.8)} gutDraw={ramp(t, b2, 1.6)} tract={rise(t, b2 + 1, 1)} pulse={t} />
      </Svg>
      <Txt x={1512} y={910} w={500} align="center" size={24} mono color={colors.orangeSoft} t={t} at={b2 + 1}>
        dianggap terisi merata
      </Txt>
      <Keylines
        t={t}
        x={620}
        w={1100}
        y={600}
        size={48}
        items={[
          [c("dari perkiraan inilah"), <>Dari sinilah <span style={{ color: colors.orange }}>10 : 1</span> bermula</>],
          [note, "Bukan menghitung satu per satu…"],
          [c("Ini hasil perkalian"), <>…tapi <span style={{ color: colors.orange }}>perkalian dua perkiraan</span></>],
        ]}
      />
    </>
  );
};

// ───────────── L-07 · Perumpamaan gedung ─────────────
const L07: LV = ({ t }) => {
  const { c } = at("l07");
  const full = c("satu lantai bisa penuh");
  const assume = c("menganggap semua lantai");
  const test = c("asumsinya perlu diuji");
  const floors = 6;
  const fw = 560;
  const fh = 108;
  const bx = 220;
  const by = 200;
  return (
    <>
      <SchemaTag t={t} x={64} y={40} align="right" text="PERUMPAMAAN · bukan data" size={22} />
      <Svg>
        <rect x={bx - 20} y={by - 30} width={fw + 40} height={floors * fh + 50} rx={10} fill="none" stroke={colors.bodyLine} strokeWidth={5} opacity={rise(t, 0.2, 0.6)} />
        <path d={`M${bx - 40},${by - 30} L${bx + fw / 2},${by - 110} L${bx + fw + 40},${by - 30}`} fill="none" stroke={colors.bodyLine} strokeWidth={5} opacity={rise(t, 0.2, 0.6)} />
        {Array.from({ length: floors }, (_, f) => {
          const y = by + f * fh;
          const isFull = f === floors - 1;
          const show = isFull ? rise(t, full, 1) : rise(t, assume, 1.2) * (1 - ramp(t, test, 1.2));
          return (
            <g key={f} opacity={rise(t, 0.2 + f * 0.08, 0.5)}>
              <line x1={bx} x2={bx + fw} y1={y + fh} y2={y + fh} stroke={colors.line} strokeWidth={3} />
              {Array.from({ length: 36 }, (_, i) => {
                const cx = bx + 30 + (i % 18) * 29 + (Math.floor(i / 18) % 2) * 12;
                const cy = y + 40 + Math.floor(i / 18) * 36;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={9}
                    fill={colors.orange}
                    opacity={show * (isFull ? 1 : 0.35)}
                  />
                );
              })}
              {!isFull && t > test ? (
                <text x={bx + fw / 2} y={y + fh / 2 + 10} textAnchor="middle" fill={colors.muted} fontFamily={fonts.mono} fontSize={26} opacity={ramp(t, test + 0.8, 0.6)}>
                  kosong?
                </text>
              ) : null}
            </g>
          );
        })}
      </Svg>
      <Keylines
        t={t}
        x={1000}
        w={820}
        y={300}
        size={52}
        align="left"
        items={[
          [c("Bayangkan"), "Berapa orang di gedung ini?"],
          [full, "Satu lantai: penuh sesak"],
          [assume, <>Anggap <span style={{ color: colors.orange }}>semua lantai</span> sama penuh…</>],
          [c("Ini hanya perumpamaan"), "×6 lantai = angka besar"],
          [test, <>Rapi, tapi <span style={{ color: colors.orange }}>asumsinya perlu diuji</span></>],
          [c("Cukup untuk gambaran"), "Cukup untuk gambaran awal"],
          [c("Belum cukup"), <>Belum cukup untuk <span style={{ color: colors.orange }}>jadi acuan</span></>],
        ]}
      />
    </>
  );
};

// ───────────── L-08 · Estafet kutipan 1972 → 1977 → … → 2016 ─────────────
const L08: LV = ({ t }) => {
  const { c } = at("l08");
  const sav = c("tahun 1977");
  const many = c("Setelah itu");
  const back = c("ternyata mengutip Luckey");
  const relay = c("Jadi jalurnya");
  const nodes = [
    { x: 260, label: "1972", sub: "Luckey" },
    { x: 720, label: "1977", sub: "Savage" },
    { x: 1640, label: "2016", sub: "hitung ulang" },
  ];
  // Tongkat estafet: 1972 -> 1977 -> deretan kartu.
  const batonX = interpolate(t, [sav, sav + 1.2, many + 0.5, many + 4], [260, 720, 720, 1500], { ...clamp, easing: easeInOut });
  return (
    <>
      <TimelineBar t={t} y={250} nodes={nodes} lit={(i) => (i === 0 ? 1 : i === 1 ? rise(t, sav, 0.5) : 0.2)} draw={interpolate(batonX, [260, 1640], [0, 1])} />
      {Array.from({ length: 9 }, (_, i) => {
        const p = rise(t, many + 0.4 + i * 0.35, 0.5);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 840 + i * 74,
              top: 470 + (i % 2) * 34,
              width: 64,
              height: 84,
              borderRadius: 8,
              background: colors.cream,
              opacity: p * (0.95 - i * 0.05),
              rotate: `${(i % 2 ? 1 : -1) * 4}deg`,
              translate: `0px ${(1 - p) * 30}px`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ margin: "16px 10px 0", height: 6, borderRadius: 6, background: colors.orange }} />
            <div style={{ margin: "8px 10px 0", height: 5, borderRadius: 5, background: "rgba(8,16,34,0.3)" }} />
            <div style={{ margin: "6px 10px 0", height: 5, width: 26, borderRadius: 5, background: "rgba(8,16,34,0.3)" }} />
          </div>
        );
      })}
      <Txt x={1170} y={620} w={700} align="center" size={28} mono color={colors.muted} t={t} at={many + 1}>
        makalah mikrobiota · langsung / tidak langsung
      </Txt>
      <Svg>
        <g transform={`translate(${batonX} 250)`} opacity={rise(t, 0.4, 0.5)}>
          <rect x={-46} y={-86} width={92} height={26} rx={13} fill={colors.orange} style={{ filter: `drop-shadow(0 0 12px ${colors.orange})` }} />
        </g>
        <path
          d="M720,320 C640,420 360,420 270,320"
          fill="none"
          stroke={colors.orange}
          strokeWidth={4}
          strokeDasharray="10 10"
          pathLength={1}
          opacity={rise(t, back, 0.4)}
          style={{ strokeDashoffset: 0 }}
        />
      </Svg>
      <Txt x={490} y={420} w={500} align="center" size={26} mono color={colors.orange} t={t} at={back}>
        Savage mengutip Luckey
      </Txt>
      <Keylines
        t={t}
        y={740}
        size={54}
        items={[
          [relay, "Seperti estafet."],
          [c("Tongkatnya sama"), <>Tongkatnya <span style={{ color: colors.orange }}>sama</span>.</>],
          [c("Hanya tangannya"), <>Hanya <span style={{ color: colors.orange }}>tangannya</span> yang berganti.</>],
        ]}
      />
    </>
  );
};

// ───────────── L-09 · "Elegan", tapi bukan acuan puluhan tahun ─────────────
const L09: LV = ({ t }) => {
  const { c } = at("l09");
  const blame = c("Jadi cerita ini");
  const label = interpolate(t, [blame, blame + 4], [0, 2], clamp);
  const words = ["perkiraan kasar", "fakta umum", "fakta umum?"];
  const idx = Math.min(2, Math.floor(label));
  return (
    <>
      <Paraphrase t={t} at={c("elegan") - 0.6} x={260} y={210} w={1400}>
        Elegan, tapi <span style={{ color: colors.orange }}>tidak dimaksudkan</span> jadi acuan puluhan tahun.
      </Paraphrase>
      <Shot t={t} from={blame}>
        {(lt) => (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 600,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              key={idx}
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 54,
                padding: "16px 44px",
                borderRadius: 99,
                border: `3px solid ${idx === 2 ? colors.orange : colors.line}`,
                color: idx === 0 ? colors.text : colors.orange,
                background: colors.panel,
                opacity: interpolate(label - idx, [0, 0.25], [0.2, 1], clamp) * rise(lt, 0, 0.5),
              }}
            >
              {words[idx]}
            </div>
          </div>
        )}
      </Shot>
      <Keylines
        t={t}
        y={760}
        size={44}
        items={[
          [c("Luckey membuat"), "Luckey membuat perkiraan awal."],
          [c("Yang berlangsung"), <>Yang terlalu lama: <span style={{ color: colors.orange }}>pemakaiannya</span></>],
        ]}
      />
    </>
  );
};

// ───────────── L-10 · Jalur kedua: 100 : 1 ─────────────
const L10: LV = ({ t }) => {
  const { c } = at("l10");
  const nih = c("Ada laporan");
  const book = c("Angka persen itu");
  const res = c("Hasilnya");
  const claim = c("Dari situlah");
  const later = c("Nanti kita lihat");
  return (
    <>
      {tag(t, "SKEMA · dua jalur menuju satu mitos")}
      <Heading t={t} kicker="JALUR KEDUA" title={<>Dari mana <span style={{ color: colors.orange }}>100 : 1</span>?</>} size={60} y={110} />
      <Box t={t} at={nih} x={100} y={330} w={500} h={250} label="laporan NIH" size={56} note="tanpa rujukan yang jelas">
        1–3% massa tubuh
      </Box>
      <Op x={650} y={400} t={t} at={book}>
        ×
      </Op>
      <Box t={t} at={book + 0.3} x={700} y={330} w={440} h={250} label="ukuran bakteri" size={48} note="'standar buku teks'" accent={later < t ? colors.orange : colors.muted}>
        1 bakteri standar
      </Box>
      <Op x={1190} y={400} t={t} at={res}>
        =
      </Op>
      <Box t={t} at={res + 0.3} x={1240} y={330} w={260} h={250} label="hasil" size={70}>
        <Pow pre="~" exp="15" />
      </Box>
      <Svg>
        <Arrow x1={1520} y1={455} x2={1600} y2={455} draw={ramp(t, claim, 0.5)} />
      </Svg>
      <Box t={t} at={claim + 0.3} x={1610} y={360} w={230} h={190} size={56}>
        100 : 1
      </Box>
      <Txt x={960} y={650} w={1400} align="center" size={36} color={colors.orangeSoft} t={t} at={later}>
        ukuran “standar” itu ternyata juga bermasalah — nanti kita lihat
      </Txt>
    </>
  );
};

export const BAB1_3: Record<string, LV> = { l01: L01, l02: L02, l03: L03, l04: L04, l05: L05, l06: L06, l07: L07, l08: L08, l09: L09, l10: L10 };

export const SFX1_3: Record<string, readonly Cue[]> = (() => {
  const a1 = at("l01");
  const a2 = at("l02");
  const a3 = at("l03");
  const a4 = at("l04");
  const a5 = at("l05");
  const a6 = at("l06");
  const a7 = at("l07");
  const a8 = at("l08");
  const a9 = at("l09");
  const a10 = at("l10");
  return {
    l01: [
      [0.1, "bass", 0.7],
      [0.6, "count", 0.3],
      [a1.c("Dan diulang"), "shimmer", 0.25],
      [a1.c("ketika seseorang menghitungnya") + 0.4, "strike", 0.45],
      [a1.c("ketika seseorang menghitungnya") + 0.5, "shrink", 0.4],
    ],
    l02: [
      [0.02, "page", 0.5],
      [0.5, "ding", 0.25],
      [a2.c("Perjalanannya"), "whoosh", 0.3],
    ],
    l03: [
      [a3.c("Bakteri di tubuh"), "pop", 0.35],
      [a3.c("Bakteri di tubuh", 1.6), "pop", 0.3],
      [a3.c("Sebagian orang"), "pop", 0.35],
      [a3.c("Bakteri itu kecil"), "shimmer", 0.25],
    ],
    l04: [
      [a4.c("Pertama"), "tick", 0.4],
      [a4.c("Kedua"), "tick", 0.4],
      [a4.c("Ketiga"), "tick", 0.4],
      [a4.c("Kita mulai dari"), "ding", 0.25],
    ],
    l05: [
      [0.3, "whoosh", 0.3],
      [a5.c("hitungan di balik amplop"), "pencil", 0.35],
      [a5.c("Yang pertama"), "tick", 0.4],
    ],
    l06: [
      [a6.c("Bilangan kedua"), "tick", 0.4],
      [a6.c("Lalu kedua bilangan"), "pop", 0.35],
      [a6.c("Lalu kedua bilangan") + 0.4, "hmm", 0.3],
    ],
    l07: [
      [a7.c("satu lantai bisa penuh"), "count", 0.3],
      [a7.c("menganggap semua lantai"), "shimmer", 0.25],
      [a7.c("asumsinya perlu diuji"), "shrink", 0.3],
    ],
    l08: [
      [a8.c("tahun 1977"), "whoosh", 0.35],
      [a8.c("Setelah itu") + 0.4, "count", 0.3],
      [a8.c("ternyata mengutip Luckey"), "pop", 0.35],
    ],
    l09: [
      [a9.c("elegan") - 0.6, "page", 0.4],
      [a9.c("Jadi cerita ini"), "tick", 0.3],
    ],
    l10: [
      [a10.c("Ada laporan"), "pop", 0.35],
      [a10.c("Angka persen itu"), "pop", 0.3],
      [a10.c("Hasilnya"), "pop", 0.3],
      [a10.c("Dari situlah") + 0.3, "bass", 0.4],
    ],
  };
})();
