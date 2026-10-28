import type React from "react";
import { interpolate } from "remotion";
import { SheetMark } from "../elements/Brand";
import { clamp, easeInOut, ramp, rise, SchemaTag, Shot, Txt } from "../elements/common";
import type { Cue } from "../elements/Sound";
import { Bar, RatioText } from "../elements/viz";
import { colors, fonts } from "../theme";
import { at, Box, Heading, Keylines, Paraphrase, Stamp, StepCards, Svg } from "./kit";
import type { LV } from "./kit";

const tag = (t: number, text = "SKEMA") => <SchemaTag t={t} x={64} y={40} align="right" text={text} size={22} />;

// Tiga kartu "yang belum pasti" di atas layar; `on` = indeks yang menyala (-1 = semua).
const UNSURE = ["tinja sebagai wakil", "perempuan", "bayi dan anak"];
const UnsureCards: React.FC<{ readonly t: number; readonly on: number; readonly at?: number[]; readonly y?: number }> = ({
  t,
  on,
  at: a = [0, 0, 0],
  y = 110,
}) => (
  <>
    {UNSURE.map((u, i) => {
      const p = rise(t, a[i], 0.6);
      const lit = on === -1 || on === i;
      return (
        <div
          key={u}
          style={{
            position: "absolute",
            left: 160 + i * 540,
            top: y,
            width: 500,
            height: 96,
            boxSizing: "border-box",
            opacity: p * (lit ? 1 : 0.35),
            translate: `0px ${(1 - p) * 20}px`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 24px",
            borderRadius: 16,
            border: `2px solid ${lit ? colors.orange : colors.line}`,
            background: colors.panel,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 99,
              background: lit ? colors.orange : colors.lineSoft,
              color: colors.bg,
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ?
          </div>
          <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 34, color: colors.text }}>
            {i + 1}. {u}
          </div>
        </div>
      );
    })}
  </>
);

// ───────────── L-31 · Yang belum pasti ─────────────
const L31: LV = ({ t }) => {
  const { c } = at("l31");
  const list = c("Para penulis menyebut");
  return (
    <>
      <Heading t={t} kicker="BAB 8" title="Yang belum pasti" size={80} y={250} align="center" />
      <Keylines t={t} y={420} size={40} items={[[c("Dalam sains"), "Mengakui batas = bagian dari pekerjaan sains"]]} />
      <UnsureCards t={t} on={-1} at={[list, list + 0.4, list + 0.8]} y={600} />
    </>
  );
};

// ───────────── L-32 · Tinja sebagai wakil ─────────────
const L32: LV = ({ t }) => {
  const { c } = at("l32");
  const assume = c("Lalu para penulis");
  return (
    <>
      <UnsureCards t={t} on={0} />
      <Box t={t} at={c("Kepadatan bakteri diukur")} x={220} y={360} w={560} h={220} label="terukur" size={50} accent={colors.cream}>
        kepadatan di tinja
      </Box>
      <Txt x={960} y={390} w={300} align="center" size={110} color={colors.orange} t={t} at={assume}>
        =?
      </Txt>
      <Box t={t} at={assume + 0.3} x={1140} y={360} w={560} h={220} label="yang ingin diketahui" size={50} dashed>
        kepadatan di kolon
      </Box>
      <Txt x={960} y={640} w={1000} align="center" size={32} mono color={colors.orange} t={t} at={c("Asumsi ini")}>
        asumsi penulis · perlu diteliti
      </Txt>
      <Keylines t={t} y={740} size={40} items={[[c("Kalau ternyata"), "Kalau berbeda, angka totalnya ikut bergeser"]]} />
    </>
  );
};

// ───────────── L-33 · Perempuan: DIPERKIRAKAN ─────────────
const L33: LV = ({ t }) => {
  const { c } = at("l33");
  const est = c("Untuk perempuan");
  const key = c("Kata kuncinya");
  const why = c("Alasannya");
  const rbc = c("volume darah");
  const none = c("Sementara belum");
  return (
    <>
      <UnsureCards t={t} on={1} />
      <Txt x={960} y={270} w={1500} align="center" size={44} t={t} at={est}>
        rasio bakteri : sel manusia <span style={{ color: colors.orange }}>naik ~sepertiga</span> (perkiraan)
      </Txt>
      <Stamp x={960} y={360} t={t} at={key} size={70}>
        DIPERKIRAKAN
      </Stamp>
      <Txt x={960} y={480} w={900} align="center" size={28} mono color={colors.muted} t={t} at={key + 0.6}>
        bukan hasil pengukuran
      </Txt>
      <Box t={t} at={why} x={160} y={580} w={500} h={190} label="sel darah merah" size={44} accent={colors.cream}>
        ~10% lebih rendah
      </Box>
      <Box t={t} at={rbc} x={710} y={580} w={500} h={190} label="volume darah" size={44} accent={colors.cream}>
        20–30% lebih rendah
      </Box>
      <Box t={t} at={none} x={1260} y={580} w={500} h={190} label="kepadatan bakteri kolon" size={40} dashed accent={colors.muted}>
        belum ada laporan beda
      </Box>
    </>
  );
};

// ───────────── L-34 · Bayi dan anak: kesenjangan pengetahuan ─────────────
const L34: LV = ({ t }) => {
  const { c } = at("l34");
  const gap = c("Tapi data volume");
  const no = c("Karena itu");
  return (
    <>
      <UnsureCards t={t} on={2} />
      <Box t={t} at={c("Kepadatan bakteri kolon")} x={260} y={320} w={640} h={260} label="kepadatan bakteri kolon" size={54} accent={colors.cream}>
        relatif konstan sejak bayi ✓
      </Box>
      <Box t={t} at={gap} x={1020} y={320} w={640} h={260} label="volume kolon anak" size={54} dashed>
        data terbatas
      </Box>
      <Txt x={1340} y={610} w={640} align="center" size={32} mono color={colors.orange} t={t} at={c("kesenjangan pengetahuan")}>
        kesenjangan pengetahuan
      </Txt>
      <Keylines
        t={t}
        y={720}
        size={48}
        items={[
          [no, "Tidak ada angka anak di video ini"],
          [c("Lebih baik"), <>Lebih baik <span style={{ color: colors.orange }}>dikosongkan</span>, daripada ditebak</>],
        ]}
      />
    </>
  );
};

// ───────────── L-35 · Tiga pertanyaan untuk setiap angka ─────────────
const L35: LV = ({ t }) => {
  const { c } = at("l35");
  const q = [c("Dari mana datangnya"), c("Diukur, atau"), c("Berapa ketidakpastiannya")];
  const table = c("Angka baru");
  const cell = (ok: boolean) => (
    <span style={{ color: ok ? colors.orange : colors.muted, fontFamily: fonts.heading, fontWeight: 700 }}>{ok ? "✓" : "?"}</span>
  );
  return (
    <>
      {tag(t, "SKEMA · cara memeriksa angka")}
      <Heading t={t} kicker="CARA SEDERHANA" title="Tiga pertanyaan untuk setiap angka" size={56} y={110} />
      <StepCards
        t={t}
        x={140}
        y={290}
        w={820}
        h={130}
        gap={30}
        size={42}
        items={[
          { at: q[0], text: "Dari mana?" },
          { at: q[1], text: "Diukur atau diasumsikan?" },
          { at: q[2], text: "Berapa ketidakpastiannya?" },
        ]}
        active={(i) => (t >= q[i] ? 1 : 0.3)}
      />
      <Shot t={t} from={table}>
        {(lt) => (
          <div
            style={{
              position: "absolute",
              left: 1080,
              top: 290,
              width: 700,
              opacity: rise(lt, 0, 0.6),
              fontFamily: fonts.mono,
              fontSize: 30,
              color: colors.text,
            }}
          >
            <div style={{ display: "flex", padding: "0 0 18px", borderBottom: `2px solid ${colors.line}`, color: colors.muted }}>
              <div style={{ flex: 1 }} />
              <div style={{ width: 200, textAlign: "center" }}>lama</div>
              <div style={{ width: 200, textAlign: "center", color: colors.orange }}>baru</div>
            </div>
            {["dari mana", "diukur?", "ketidakpastian"].map((r, i) => (
              <div key={r} style={{ display: "flex", padding: "26px 0", borderBottom: `1px solid ${colors.lineSoft}`, opacity: rise(lt, 0.3 + i * 0.3, 0.4), fontSize: 30 }}>
                <div style={{ flex: 1 }}>{r}</div>
                <div style={{ width: 200, textAlign: "center", fontSize: 44 }}>{cell(false)}</div>
                <div style={{ width: 200, textAlign: "center", fontSize: 44 }}>{cell(true)}</div>
              </div>
            ))}
            <div style={{ marginTop: 22, fontSize: 24, color: colors.muted, opacity: rise(lt, 1.4, 0.5) }}>angka baru menyebut bagian yang masih asumsi</div>
          </div>
        )}
      </Shot>
    </>
  );
};

// ───────────── L-36 · Diukur / diasumsikan / diperkirakan / kosong ─────────────
const L36: LV = ({ t }) => {
  const { c } = at("l36");
  const lanes = [
    { k: "DIUKUR", at: c("Yang diukur"), items: ["kepadatan bakteri · 14 studi", "volume kolon · MRI"], style: "solid" },
    { k: "DIASUMSIKAN", at: c("Yang diasumsikan"), items: ["tinja mewakili isi kolon"], style: "line" },
    { k: "DIPERKIRAKAN", at: c("Yang diperkirakan"), items: ["rasio perempuan"], style: "soft" },
    { k: "KOSONG", at: c("Yang masih kosong"), items: ["angka untuk anak"], style: "dash" },
  ] as const;
  return (
    <>
      <Heading t={t} kicker="MARI KITA PISAHKAN" title="Status setiap angka" size={56} y={110} />
      {lanes.map((l, i) => {
        const p = rise(t, l.at - 0.2, 0.6);
        const bg =
          l.style === "solid" ? colors.orange : l.style === "soft" ? "rgba(255,138,61,0.28)" : "transparent";
        return (
          <div
            key={l.k}
            style={{
              position: "absolute",
              left: 130 + i * 420,
              top: 260,
              width: 390,
              height: 580,
              boxSizing: "border-box",
              opacity: 0.35 + 0.65 * p,
              borderRadius: 20,
              border: `${l.style === "dash" ? 4 : 3}px ${l.style === "dash" ? "dashed" : "solid"} ${l.style === "line" || l.style === "dash" ? colors.orange : colors.line}`,
              background: colors.panel,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 3,
                textAlign: "center",
                padding: "12px 0",
                borderRadius: 12,
                color: l.style === "solid" ? colors.bg : colors.text,
                background: bg,
                border: l.style === "line" ? `3px solid ${colors.orange}` : "none",
              }}
            >
              {l.k}
            </div>
            {l.items.map((it, j) => (
              <div
                key={it}
                style={{
                  opacity: rise(t, l.at + 0.4 + j * 0.5, 0.5),
                  translate: `0px ${(1 - rise(t, l.at + 0.4 + j * 0.5, 0.5)) * 30}px`,
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1.2,
                  color: l.style === "dash" ? colors.muted : colors.text,
                  padding: "18px 18px",
                  borderRadius: 12,
                  border: `2px ${l.style === "dash" ? "dashed" : "solid"} ${colors.line}`,
                }}
              >
                {it}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

// ───────────── L-37 · Catatan ringan: setelah dari toilet ─────────────
const Door: React.FC<{ readonly x: number; readonly y: number; readonly open: number }> = ({ x, y, open }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width={150} height={260} rx={8} fill="none" stroke={colors.muted} strokeWidth={5} />
    <path d={`M0,0 L${150 * (1 - open * 0.6)},${-14 * open} L${150 * (1 - open * 0.6)},${274 * 1 - 0 + 14 * open} L0,260 Z`} fill={colors.panel} stroke={colors.bodyLine} strokeWidth={4} />
    <circle cx={150 * (1 - open * 0.6) - 22} cy={140} r={8} fill={colors.orange} />
  </g>
);

const L37: LV = ({ t }) => {
  const { c } = at("l37");
  const flip = c("satu kali buang");
  const after = c("Setelah dari toilet");
  const shift = c("Dan rasionya bergeser");
  const cut = ramp(t, after + 0.6, 1.4);
  const doorOpen = interpolate(t, [after - 0.2, after + 0.4, after + 1.4, after + 2], [0, 1, 1, 0], clamp);
  const base = 800;
  const bh = 420;
  const hh = bh / 1.3;
  return (
    <>
      {tag(t)}
      <Heading t={t} kicker="BAB 9" title="Satu catatan ringan" size={70} y={110} />
      <Svg>
        <line x1={400} x2={1200} y1={base + 6} y2={base + 6} stroke={colors.line} strokeWidth={3} />
        <Bar x={620} base={base} w={200} h={bh * (1 - cut / 3)} grow={rise(t, 0.3, 0.8)} />
        <Bar x={960} base={base} w={200} h={hh} grow={rise(t, 0.5, 0.8)} color={colors.cream} />
        {cut > 0 ? <Bar x={620} base={base - bh * (1 - cut / 3)} w={200} h={(bh * cut) / 3} color={colors.orange} opacity={0.2 * (1 - cut)} dashed /> : null}
        <g opacity={rise(t, flip, 0.6)}>
          <Door x={1400} y={420} open={doorOpen} />
        </g>
      </Svg>
      <Txt x={620} y={base + 24} w={300} align="center" size={24} mono color={colors.orange} t={t} at={0.4}>
        BAKTERI
      </Txt>
      <Txt x={960} y={base + 24} w={300} align="center" size={24} mono color={colors.cream} t={t} at={0.6}>
        SEL MANUSIA
      </Txt>
      <Txt x={1475} y={700} w={400} align="center" size={26} mono color={colors.muted} t={t} at={flip + 0.3}>
        toilet
      </Txt>
      <Txt x={620} y={base - bh - 80} w={400} align="center" size={32} mono color={colors.orangeSoft} t={t} at={after + 0.8}>
        −⅓ bakteri kolon
      </Txt>
      <Keylines t={t} y={250} x={800} w={900} size={40} items={[[shift, <>rasio bergeser ke arah <span style={{ color: colors.cream }}>sel manusia</span></>]]} />
    </>
  );
};

// ───────────── L-38 · Bergantung kapan kamu bertanya ─────────────
const L38: LV = ({ t }) => {
  const { c } = at("l38");
  const moves = c("Rasionya bukan angka");
  const myth = c("Kalau rasionya seratus");
  const base = 800;
  const wob = Math.sin(t * 1.6) * 0.5 + 0.5;
  const mythCut = ramp(t, myth + 1.2, 1.2);
  return (
    <>
      <Keylines
        t={t}
        y={150}
        size={52}
        items={[
          [c("Jadi, kalau"), "Mana yang lebih banyak?"],
          [c("Bergantung"), <>Bergantung <span style={{ color: colors.orange }}>kapan</span> kamu bertanya 🙂</>],
          [moves, "Rasionya bergerak."],
          [c("Dan itu hanya mungkin"), <>hanya karena rasionya <span style={{ color: colors.orange }}>dekat dengan 1</span></>],
          [myth, "Kalau 100 : 1? Tidak akan terbalik."],
        ]}
      />
      <Svg>
        <line x1={260} x2={860} y1={base + 6} y2={base + 6} stroke={colors.line} strokeWidth={3} />
        <Bar x={440} base={base} w={150} h={300 + 150 * (moves < t ? wob : 0.6)} />
        <Bar x={680} base={base} w={150} h={340} color={colors.cream} />
        <g opacity={rise(t, myth, 0.6)}>
          <line x1={1060} x2={1660} y1={base + 6} y2={base + 6} stroke={colors.line} strokeWidth={3} />
          <Bar x={1240} base={base} w={150} h={520 * (1 - mythCut / 3)} />
          <Bar x={1480} base={base} w={150} h={6} color={colors.cream} />
        </g>
      </Svg>
      <Txt x={560} y={base + 24} w={500} align="center" size={26} mono color={colors.muted} t={t} at={0.3}>
        ~1,3 : 1 · bisa terbalik
      </Txt>
      <Txt x={1360} y={base + 24} w={500} align="center" size={26} mono color={colors.muted} t={t} at={myth}>
        mitos 100 : 1 · tetap
      </Txt>
    </>
  );
};

// ───────────── L-39 · Pelajaran 1: angka populer perlu dicek ─────────────
const L39: LV = ({ t }) => {
  const { c } = at("l39");
  const fact = c("Tapi karena perkiraan");
  const start = c("Masalahnya");
  const grow = ramp(t, fact, 2.2);
  return (
    <>
      <Heading t={t} kicker="BAB 10 · PELAJARAN" title="1. Angka populer perlu dicek" size={64} y={130} />
      <Svg>
        <circle cx={300} cy={540} r={18} fill={colors.orange} opacity={rise(t, fact, 0.4)} />
        <line x1={300} x2={300 + 1300 * grow} y1={540} y2={540} stroke={colors.orange} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" />
        <circle cx={1600} cy={540} r={18} fill={colors.cream} opacity={rise(t, fact + 2, 0.4)} />
      </Svg>
      <Txt x={300} y={580} w={400} align="center" size={36} color={colors.orange} t={t} at={fact}>
        perkiraan
      </Txt>
      <Txt x={1600} y={580} w={400} align="center" size={36} color={colors.cream} t={t} at={fact + 2}>
        “fakta”
      </Txt>
      <Txt x={950} y={470} w={700} align="center" size={26} mono color={colors.muted} t={t} at={fact + 1}>
        diulang puluhan tahun
      </Txt>
      <Keylines
        t={t}
        y={720}
        size={46}
        items={[
          [c("Bukan karena"), "Bukan karena berniat salah"],
          [c("Perkiraan itu tetap"), "Perkiraan tetap berguna sebagai titik awal"],
          [start, <>Masalahnya: titik awal dianggap <span style={{ color: colors.orange }}>titik akhir</span></>],
        ]}
      />
    </>
  );
};

// ───────────── L-40 · Pelajaran 2: hitung ulang bagian dari sains ─────────────
const L40: LV = ({ t }) => {
  const { c } = at("l40");
  return (
    <>
      <Heading t={t} kicker="PELAJARAN" title="2. Hitung ulang itu bagian dari sains" size={64} y={130} />
      <Paraphrase t={t} at={c("Kesimpulan para penulis")} x={260} y={330} w={1400}>
        Kita mungkin masih tampak kalah jumlah, tapi kini kita tahu <span style={{ color: colors.orange }}>seberapa jauh</span> dan{" "}
        <span style={{ color: colors.orange }}>seberapa pasti</span>.
      </Paraphrase>
      <Keylines t={t} y={760} size={40} items={[[c("Itu kemajuan"), "kemajuan yang tenang, tapi nyata"]]} />
    </>
  );
};

// ───────────── L-41 · Pelajaran 3: angka berubah, pentingnya tidak ─────────────
const L41: LV = ({ t }) => {
  const { c } = at("l41");
  const only = c("Yang berubah hanya");
  const rows = [
    { k: "10 : 1", w: 1, old: true },
    { k: "100 : 1", w: 1, old: true },
    { k: "~1,3 : 1", w: 1, old: false },
  ];
  return (
    <>
      <Heading t={t} kicker="PELAJARAN" title="3. Angkanya berubah, pentingnya tidak berkurang" size={56} y={130} />
      {rows.map((r, i) => {
        const p = rise(t, 0.4 + i * 0.6, 0.6);
        return (
          <div
            key={r.k}
            style={{
              position: "absolute",
              left: 360,
              top: 340 + i * 130,
              width: 1200,
              height: 100,
              opacity: p * (r.old ? 0.55 : 1),
              display: "flex",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div style={{ width: 160, fontFamily: fonts.mono, fontSize: 28, letterSpacing: 3, color: only < t ? colors.orange : colors.muted }}>ANGKA</div>
            <div
              style={{
                flex: 1,
                height: 84,
                borderRadius: 16,
                background: r.old ? colors.panel : colors.orange,
                border: `2px solid ${r.old ? colors.line : colors.orange}`,
                display: "flex",
                alignItems: "center",
                paddingLeft: 30,
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 50,
                color: r.old ? colors.muted : colors.bg,
                textDecoration: r.old ? "line-through" : "none",
              }}
            >
              {r.k}
            </div>
          </div>
        );
      })}
      <Keylines t={t} y={760} size={40} items={[[c("Dan angka yang dikutip"), "angka yang dikutip luas → sebaiknya dari data terbaik"]]} />
    </>
  );
};

// ───────────── L-42 · Rekap besar ─────────────
const L42: LV = ({ t }) => {
  const { c } = at("l42");
  const a = [c("Satu, sepuluh"), c("Dua, bakteri"), c("Tiga, sel manusia"), c("Empat, hasilnya"), c("Lima, yang belum")];
  const items = [
    "10:1 dari perkiraan kasar 1972 · 100:1 dari persen massa tanpa rujukan jelas",
    "Bakteri terutama di kolon · ~0,4 L · 14 studi",
    "Sel manusia ~30 triliun · ~90% tanpa inti",
    "Hasil ~1,3 : 1 · pria referensi",
    "Belum pasti: tinja sebagai wakil, perempuan, anak",
  ];
  const end = interpolate(t, [a[4] + 4.5, a[4] + 6], [0, 1], { ...clamp, easing: easeInOut });
  const cur = a.reduce((n, x, i) => (t >= x ? i : n), -1);
  return (
    <>
      <Heading t={t} kicker="REKAP BESAR" title="Lima hal yang perlu diingat" size={58} y={100} />
      {items.map((it, i) => {
        const p = rise(t, a[i], 0.7);
        const active = i === cur;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 160,
              top: interpolate(end, [0, 1], [250 + i * 128, 260 + i * 120]),
              width: 1600,
              height: 108,
              boxSizing: "border-box",
              opacity: p * (active || end > 0.5 ? 1 : 0.42),
              translate: `${(1 - p) * -40}px 0px`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 28px",
              borderRadius: 18,
              border: `2px solid ${active ? colors.orange : colors.line}`,
              background: active ? "rgba(255,138,61,0.12)" : colors.panel,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                flex: "none",
                borderRadius: 99,
                background: active ? colors.orange : colors.lineSoft,
                color: active ? colors.bg : colors.muted,
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 36, color: colors.text }}>{it}</div>
          </div>
        );
      })}
    </>
  );
};

// ───────────── L-43 · Penutup ─────────────
const L43: LV = ({ t }) => {
  const { c } = at("l43");
  const thanks = c("Terima kasih");
  const follow = c("Kalau kamu suka");
  const bye = c("Sampai jumpa");
  const shrink = ramp(t, 0.3, 2.2);
  return (
    <>
      <Shot t={t} from={0} to={thanks}>
        {(lt) => (
          <>
            <Svg>
              <line x1={660} x2={1260} y1={706} y2={706} stroke={colors.line} strokeWidth={3} />
              <Bar x={830} base={700} w={180} h={interpolate(shrink, [0, 1], [500, 230])} />
              <Bar x={1090} base={700} w={180} h={177} color={colors.cream} />
            </Svg>
            <RatioText text="10 : 1" x={960} y={160} size={120} appear={rise(lt, 0, 0.4) * (1 - ramp(lt, 1.6, 0.6))} />
            <RatioText text="sekitar 1,3 : 1" x={960} y={170} size={110} appear={ramp(lt, 2, 0.6)} />
            <Keylines
              t={t}
              y={780}
              size={42}
              items={[
                [c("Satu angka lama"), "satu angka lama, dihitung ulang dengan sabar"],
                [c("Lain kali"), <>siapa yang pertama menghitungnya, dan <span style={{ color: colors.orange }}>bagaimana caranya?</span></>],
              ]}
            />
          </>
        )}
      </Shot>
      <Shot t={t} from={thanks}>
        {(lt) => (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 230,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 30,
              }}
            >
              <div style={{ opacity: rise(lt, 0, 0.6), scale: String(0.85 + 0.15 * rise(lt, 0, 0.8)) }}>
                <SheetMark size={140} />
              </div>
              <div style={{ opacity: rise(lt, 0.3, 0.6), fontFamily: fonts.heading, fontWeight: 700, fontSize: 64, letterSpacing: 8, color: colors.text }}>
                SUHUF PENGETAHUAN
              </div>
              <div
                style={{
                  opacity: rise(lt, follow - thanks, 0.6),
                  fontFamily: fonts.mono,
                  fontWeight: 500,
                  fontSize: 52,
                  color: colors.orange,
                  padding: "12px 40px",
                  border: `3px solid ${colors.orange}`,
                  borderRadius: 99,
                }}
              >
                @suhufpengetahuan
              </div>
              <div style={{ marginTop: 20, opacity: rise(lt, bye - thanks, 0.7), fontFamily: fonts.heading, fontWeight: 700, fontSize: 48, color: colors.cream }}>
                Sampai jumpa di lembar berikutnya.
              </div>
            </div>
            <Txt x={960} y={870} w={1400} align="center" size={22} mono color={colors.muted} t={lt} at={0.8}>
              Sumber: Sender, Fuchs & Milo 2016 · PLoS Biology 14(8):e1002533 · Cell 164:337–340 · Nature news 2016
            </Txt>
          </>
        )}
      </Shot>
    </>
  );
};

export const BAB8_11: Record<string, LV> = {
  l31: L31,
  l32: L32,
  l33: L33,
  l34: L34,
  l35: L35,
  l36: L36,
  l37: L37,
  l38: L38,
  l39: L39,
  l40: L40,
  l41: L41,
  l42: L42,
  l43: L43,
};

export const SFX8_11: Record<string, readonly Cue[]> = (() => {
  const s = (id: string) => at(id);
  return {
    l31: [
      [0.1, "whoosh", 0.35],
      [s("l31").c("Para penulis menyebut"), "tick", 0.3],
      [s("l31").c("Para penulis menyebut") + 0.4, "tick", 0.3],
      [s("l31").c("Para penulis menyebut") + 0.8, "tick", 0.3],
    ],
    l32: [
      [s("l32").c("Lalu para penulis"), "hmm", 0.3],
      [s("l32").c("Asumsi ini"), "tick", 0.3],
    ],
    l33: [
      [s("l33").c("Kata kuncinya") + 0.1, "bass", 0.35],
      [s("l33").c("Alasannya"), "pop", 0.3],
      [s("l33").c("volume darah"), "pop", 0.3],
      [s("l33").c("Sementara belum"), "pop", 0.25],
    ],
    l34: [
      [s("l34").c("Tapi data volume"), "pop", 0.3],
      [s("l34").c("kesenjangan pengetahuan"), "shimmer", 0.25],
    ],
    l35: [
      [s("l35").c("Dari mana datangnya"), "tick", 0.35],
      [s("l35").c("Diukur, atau"), "tick", 0.35],
      [s("l35").c("Berapa ketidakpastiannya"), "tick", 0.35],
      [s("l35").c("Angka baru"), "whoosh", 0.3],
    ],
    l36: [
      [s("l36").c("Yang diukur"), "pop", 0.3],
      [s("l36").c("Yang diasumsikan"), "pop", 0.3],
      [s("l36").c("Yang diperkirakan"), "pop", 0.3],
      [s("l36").c("Yang masih kosong"), "pop", 0.25],
    ],
    l37: [
      [0.1, "whoosh", 0.3],
      [s("l37").c("Setelah dari toilet") - 0.2, "door", 0.35],
      [s("l37").c("Setelah dari toilet") + 0.6, "shrink", 0.3],
    ],
    l38: [
      [s("l38").c("Bergantung"), "pop", 0.3],
      [s("l38").c("Kalau rasionya seratus"), "whoosh", 0.3],
    ],
    l39: [
      [0.1, "whoosh", 0.3],
      [s("l39").c("Tapi karena perkiraan"), "pencil", 0.3],
    ],
    l40: [
      [0.1, "whoosh", 0.3],
      [s("l40").c("Kita mungkin"), "page", 0.35],
    ],
    l41: [
      [0.4, "tick", 0.3],
      [1.0, "tick", 0.3],
      [1.6, "pop", 0.35],
    ],
    l42: [
      [s("l42").c("Satu, sepuluh"), "tick", 0.35],
      [s("l42").c("Dua, bakteri"), "tick", 0.35],
      [s("l42").c("Tiga, sel manusia"), "tick", 0.35],
      [s("l42").c("Empat, hasilnya"), "tick", 0.35],
      [s("l42").c("Lima, yang belum"), "tick", 0.35],
    ],
    l43: [
      [0.3, "shrink", 0.35],
      [2.3, "reveal", 0.3],
      [s("l43").c("Terima kasih"), "whoosh", 0.3],
      [s("l43").c("Sampai jumpa"), "ding", 0.25],
      [s("l43").c("Sampai jumpa") + 2.4, "page", 0.4],
    ],
  };
})();

