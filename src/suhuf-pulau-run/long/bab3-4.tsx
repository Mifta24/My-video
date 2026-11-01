import type React from "react";
import { Easing, interpolate } from "remotion";
import { bob, pop, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { CalendarYear, FlagG, FlagPole, Island, Ship, TreatySheet, WOOD, WOOD_DARK } from "../shorts/kit2d";
import { Big, BIG_Y, ChipAt, clamp01, H, INK, In, IceShop, Label, LChip, Shot, Sub, ToyFigure, W } from "./kitLong";
import { BoardDetective, Glow, PhotoCard, QBadge, RecapBoard, RECAP_TITLE_Y, ShipAt, WaterL } from "./props";
import type { V } from "./bab1-2";

// L-07: kedatangan kapten Inggris. Kapal tetap berada di laut, kapten ramah (tanpa aksi perang).
const L07: React.FC<V> = ({ t }) => (
  <>
    <Shot t={t} to={4.9}>
      {(lt) => (
        <>
          <Big text="1616" t={lt} y={BIG_Y} size={145} color={toon.orange} />
          <In x={735} y={312 + bob(t, 6, 2)} t={lt}><CalendarYear w={450} t={lt} flipAt={0.2} step={0.28} reveal={pop(lt, 1.25, 0.5)} year="1616" /></In>
        </>
      )}
    </Shot>
    <Shot t={t} from={4.8}>
      {(lt) => (
        <>
          <Big text="KAPTEN INGGRIS" t={lt} y={BIG_Y} size={112} color={toon.orange} />
          <In x={1040} y={445 + bob(t, 5, 2)} t={lt}><Island kind="run" w={610} t={t} /></In>
          <ShipAt kind="en" cx={470 + 85 * slide(lt, 0, 1.0)} wl={735} w={340} t={t} />
          <WaterL x0={90} x1={1830} y0={730} y1={855} t={t} seed="pr-l07" />
          <In x={745} y={370 + bob(t, 5, 2, 1)} t={lt} at={0.2}><ToyFigure size={240} t={t} hat="captain" coat={toon.orange} mood="happy" /></In>
          <ChipAt cx={990} y={759} t={lt} at={1.0}><LChip text="NATHANIEL COURTHOPE" color={toon.orangeDark} size={37} flag="en" /></ChipAt>
        </>
      )}
    </Shot>
  </>
);

const L08: React.FC<V> = ({ t }) => (
  <>
    <Shot t={t} to={3.1}>
      {(lt) => (
        <>
          <Big text="SURAT" t={lt} y={BIG_Y} size={134} color={toon.blue} />
          <In x={780} y={312 + bob(t, 7, 2)} t={lt}><TreatySheet w={360} stampP={slide(lt, 1.4, 0.35)} /></In>
          <Sub text="ditandatangani penduduk" t={lt} at={0.45} y={798} size={42} />
        </>
      )}
    </Shot>
    <Shot t={t} from={3.0}>
      {(lt) => (
        <>
          <Big text="RAJA JAMES" t={lt} y={BIG_Y} size={123} color={toon.orange} />
          <In x={520} y={320 + bob(t, 6, 2)} t={lt}><TreatySheet w={385} stampP={1} /></In>
          <In x={1110} y={363 + bob(t, 6, 2, 1)} t={lt} at={0.2}><ToyFigure size={250} t={t} hat="crown" coat={toon.orange} mood="happy" /></In>
          <ChipAt cx={960} y={788} t={lt} at={0.5}><LChip text="INGGRIS" color={toon.orangeDark} size={45} flag="en" /></ChipAt>
        </>
      )}
    </Shot>
  </>
);

// Pelukan L-09 (draf 3). Tata letak (px kanvas): judul y 150-268, pil subjudul y 288-~354, puncak bendera ~398
// (jarak >= 30 px dari pil), elemen terbawah <= ~830 (caption bawah mulai ~897).
// Draf 2 terbaca "menyangga dari bawah" + layar seperti kubah/helm + dua bulatan merah seperti kacamata. Draf 3:
// - kapal digambar khusus Long: lambung LEBAR (+-345 px) berhaluan/berburitan naik, DUA tiang dengan dua layar
//   segi empat TERPISAH (celah ~90 px), bendera Belanda di puncak tiang depan, tanpa wajah;
// - keranjang pala dengan FULI: biji cokelat dibungkus jaring merah tipis (bukan bulatan merah padat), tumpukan
//   asimetris 7 biji (tidak membentuk pasangan mata);
// - pelukan: lengan atas turun di sisi kapal, siku di luar sisi keranjang, lengan bawah MELINTANG di depan badan
//   keranjang (dua lapis, bersilang), tangan mencengkeram sisi seberang dengan ibu jari terpisah + empat jari.
const SX = 960;
type Pt = readonly [number, number];
const SKIN = toon.skin;
const SKIN_D = "#EDA27A";

const MaceNut: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly mace?: number; readonly rot?: number }> = ({ x, y, r, mace = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.88} fill="#9A5B30" stroke={INK} strokeWidth={5} />
    <ellipse cx={-r * 0.35} cy={-r * 0.38} rx={r * 0.28} ry={r * 0.14} fill="#fff" opacity={0.45} transform={`rotate(-25 ${-r * 0.35} ${-r * 0.38})`} />
    {mace > 0 ? (
      // fuli: jaring merah bercabang melilit biji (tali bergaris tinta supaya tetap terbaca saat kecil; biji cokelat tetap terlihat di sela)
      <g fill="none" strokeLinecap="round">
        {[0, 1].map((layer) => (
          <g key={layer} stroke={layer === 0 ? "#5A1E14" : "#E8392C"} strokeWidth={layer === 0 ? 5.5 : 3}>
            <path d={`M${-r * 0.1},${r * 0.86} Q${-r * 0.8},${r * 0.3} ${-r * 0.55},${-r * 0.62}`} />
            <path d={`M${r * 0.05},${r * 0.88} Q${-r * 0.1},${0} ${r * 0.18},${-r * 0.8}`} />
            <path d={`M${r * 0.2},${r * 0.82} Q${r * 0.9},${r * 0.25} ${r * 0.7},${-r * 0.45}`} />
            <path d={`M${-r * 0.66},${r * 0.1} Q${0},${-r * 0.12} ${r * 0.78},${r * 0.12}`} strokeWidth={layer === 0 ? 4.5 : 2.4} />
          </g>
        ))}
      </g>
    ) : null}
  </g>
);

const HugBasket: React.FC<{ readonly cx: number; readonly top: number }> = ({ cx, top }) => {
  const bw = 150; // setengah lebar bibir
  const bb = 112; // setengah lebar dasar
  const h = 150;
  const nuts: readonly [number, number, number, number, number][] = [
    // dx, dy (relatif bibir), r, fuli, rot
    [-108, -12, 27, 1, -20],
    [-60, -40, 32, 1, -12],
    [-4, -62, 33, 1, 4],
    [50, -38, 31, 0, 0],
    [100, -14, 28, 1, 22],
    [-28, -8, 27, 0, 0],
    [62, -4, 24, 1, 10],
  ];
  return (
    <g>
      {nuts.map(([dx, dy, r, m, rot], i) => <MaceNut key={i} x={cx + dx} y={top + dy} r={r} mace={m} rot={rot} />)}
      <path d={`M${cx - bw},${top} L${cx + bw},${top} L${cx + bb},${top + h - 12} Q${cx + bb - 2},${top + h} ${cx + bb - 16},${top + h} L${cx - bb + 16},${top + h} Q${cx - bb + 2},${top + h} ${cx - bb},${top + h - 12} Z`} fill={WOOD} stroke={INK} strokeWidth={6.5} strokeLinejoin="round" />
      {[0.28, 0.55, 0.8].map((f) => {
        const hw = bw + (bb - bw) * f;
        return <path key={f} d={`M${cx - hw + 8},${top + h * f} L${cx + hw - 8},${top + h * f}`} stroke={WOOD_DARK} strokeWidth={5} strokeLinecap="round" />;
      })}
      {[-0.5, 0, 0.5].map((f) => <path key={f} d={`M${cx + f * bw},${top + 4} L${cx + f * bb},${top + h - 4}`} stroke={WOOD_DARK} strokeWidth={4} opacity={0.55} />)}
      <path d={`M${cx - bw - 6},${top} L${cx + bw + 6},${top}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${cx - bw},${top} L${cx + bw},${top}`} stroke={WOOD_DARK} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

// Kapal Belanda khusus pelukan: lambung lebar, dua tiang, dua layar segi empat terpisah.
const HugShip: React.FC<{ readonly cx: number; readonly deck: number; readonly t: number }> = ({ cx, deck, t }) => {
  const hw = 345;
  const hull = `M${cx - hw},${deck - 52} Q${cx - hw + 30},${deck - 2} ${cx - hw + 90},${deck} L${cx + hw - 90},${deck} Q${cx + hw - 30},${deck - 2} ${cx + hw},${deck - 52} Q${cx + hw - 40},${deck + 130} ${cx + 240},${deck + 172} L${cx - 240},${deck + 172} Q${cx - hw + 40},${deck + 130} ${cx - hw},${deck - 52} Z`;
  // layar segi empat (sisi lurus, sedikit mengembang ke bawah karena angin), digantung di yard; bukan bentuk kubah/pot
  const sail = (mx: number, y0: number, y1: number, hw2: number, fill: string, ph: number) => {
    const bel = 18 + 4 * Math.sin(t * 2.2 + ph);
    return (
      <g>
        <path d={`M${mx - hw2},${y0} L${mx + hw2},${y0} L${mx + hw2 + 8},${y1} Q${mx},${y1 + bel} ${mx - hw2 - 8},${y1} Z`} fill={fill} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M${mx - hw2 + 14},${y0 + 18} L${mx - hw2 + 18},${y1 - 10}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
        <path d={`M${mx - hw2 + 6},${(y0 + y1) / 2} Q${mx},${(y0 + y1) / 2 + bel * 0.5} ${mx + hw2 - 6},${(y0 + y1) / 2}`} fill="none" stroke={INK} strokeWidth={3.5} opacity={0.3} />
        <path d={`M${mx - hw2 - 12},${y0} L${mx + hw2 + 12},${y0}`} stroke={INK} strokeWidth={12} strokeLinecap="round" />
        <path d={`M${mx - hw2 - 12},${y0} L${mx + hw2 + 12},${y0}`} stroke={WOOD} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };
  // tiang di LUAR lebar keranjang supaya terlihat menapak di geladak
  const mA = cx - 225;
  const mB = cx + 222;
  return (
    <g>
      {/* cucur haluan (bowsprit) + tali: penanda kapal */}
      <path d={`M${cx - hw + 6},${deck - 48} L${cx - hw - 70},${deck - 96}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${cx - hw + 6},${deck - 48} L${cx - hw - 70},${deck - 96}`} stroke={WOOD} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${cx - hw - 66},${deck - 94} L${mA},${430}`} stroke={INK} strokeWidth={3.5} opacity={0.6} />
      <path d={`M${mB},${448} L${cx + hw - 6},${deck - 48}`} stroke={INK} strokeWidth={3.5} opacity={0.6} />
      {/* tiang */}
      {[[mA, 420], [mB, 446]].map(([x, y]) => (
        <g key={x}>
          <line x1={x} y1={deck} x2={x} y2={y} stroke={INK} strokeWidth={17} strokeLinecap="round" />
          <line x1={x} y1={deck} x2={x} y2={y} stroke={WOOD} strokeWidth={7} strokeLinecap="round" />
        </g>
      ))}
      {sail(mA, 466, 566, 74, "#F0A443", 0)}
      {sail(mB, 484, 566, 66, "#86AEE6", 1.3)}
      {/* bendera Belanda di puncak tiang depan */}
      <circle cx={mA} cy={418} r={9} fill={toon.yellow} stroke={INK} strokeWidth={4} />
      <g transform={`translate(${mA + 6} ${423}) skewY(${4 * Math.sin(t * 5)}) scale(0.78)`}><FlagG kind="nl" /></g>
      {/* pagar geladak kayu (dek kapal, bukan bak): tiang kecil + rel */}
      <path d={`M${cx - hw + 70},${deck - 26} L${cx + hw - 70},${deck - 26}`} stroke={INK} strokeWidth={13} strokeLinecap="round" />
      <path d={`M${cx - hw + 70},${deck - 26} L${cx + hw - 70},${deck - 26}`} stroke={WOOD} strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => cx - hw + 90 + i * ((2 * hw - 180) / 8)).map((x) => <line key={x} x1={x} y1={deck - 26} x2={x} y2={deck} stroke={INK} strokeWidth={6} />)}
      {/* lambung: ekstrusi lalu muka */}
      <path d={hull} transform="translate(0 16)" fill={toon.blueDark} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={hull} fill={toon.blue} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={`M${cx - hw + 60},${deck + 14} L${cx + hw - 60},${deck + 14}`} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      <path d={`M${cx - hw + 40},${deck - 30} Q${cx - hw + 60},${deck + 100} ${cx - 220},${deck + 150}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
      {/* draf 3: tanpa jendela bulat (dua bulatan simetris + manset terbaca seperti wajah) */}
      <path d={`M${cx - hw + 80},${deck + 70} L${cx + hw - 80},${deck + 70}`} stroke={toon.blueDark} strokeWidth={6} strokeLinecap="round" opacity={0.45} />
    </g>
  );
};

// Tangan mencengkeram sisi keranjang: telapak + empat jari (panjang berbeda) melengkung ke sisi, ibu jari terpisah ke atas.
const GripHand: React.FC<{ readonly x: number; readonly y: number; readonly dir: -1 | 1; readonly sq: number }> = ({ x, y, dir, sq }) => {
  const lens = [30, 36, 33, 24];
  const fingers = lens.map((L, i) => {
    const fy = y - 21 + i * 14;
    const x0 = x + dir * 8;
    const x1 = x + dir * (24 + L - sq * 4);
    return `M${x0},${fy} Q${x1},${fy - 4} ${x1 - dir * 4},${fy + 9}`;
  });
  // ibu jari miring menekan sisi keranjang (bukan jempol tegak / "thumbs up")
  const thumb = `M${x - dir * 16},${y - 14} Q${x - dir * 8},${y - 46} ${x + dir * (30 + sq * 3)},${y - 44}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none" transform={`translate(${x} ${y}) scale(1.45) translate(${-x} ${-y})`}>
      <ellipse cx={x} cy={y} rx={33} ry={30} fill={INK} stroke={INK} strokeWidth={9} />
      {fingers.map((d, i) => <path key={`o${i}`} d={d} stroke={INK} strokeWidth={i === 3 ? 22 : 25} />)}
      <path d={thumb} stroke={INK} strokeWidth={30} />
      <ellipse cx={x} cy={y} rx={33} ry={30} fill={SKIN} />
      {fingers.map((d, i) => <path key={`f${i}`} d={d} stroke={SKIN} strokeWidth={i === 3 ? 13 : 16} />)}
      <path d={thumb} stroke={SKIN} strokeWidth={20} />
      <ellipse cx={x + dir * (26 + sq * 3)} cy={y - 44} rx={6.5} ry={5} fill="#fff" opacity={0.75} />
      <path d={`M${x - dir * 30},${y - 30} Q${x - dir * 22},${y - 24} ${x - dir * 20},${y - 14}`} stroke={INK} strokeWidth={3.5} opacity={0.55} />
      {fingers.slice(1).map((_, i) => <path key={`g${i}`} d={`M${x + dir * 12},${y - 14 + i * 14} L${x + dir * 34},${y - 15 + i * 14}`} stroke={INK} strokeWidth={4.5} opacity={0.75} />)}
      <ellipse cx={x - dir * 10} cy={y + 12} rx={12} ry={6} fill={SKIN_D} opacity={0.55} />
    </g>
  );
};

export const NLHug: React.FC<{ readonly t: number; readonly lt: number; readonly closed?: boolean }> = ({ t, lt, closed = false }) => {
  const hug = closed ? 1 : slide(lt, 0.1, 0.7);
  const press = hug * (0.5 + 0.5 * Math.sin(t * 2.4));
  const bb = bob(t, 6, 2.3);
  const sway = 1.2 * Math.sin(t * 2.1);
  const deck = 612;
  const btop = 612; // bibir keranjang (dasar ~762, lambung bawah ~784)
  const mix = (a: Pt, b: Pt): Pt => [a[0] + (b[0] - a[0]) * hug, a[1] + (b[1] - a[1]) * hug];
  const sq = 4 * press;
  // draf 3b (Kim: dua lengan menyilang datar = terbaca "menahan"). Sekarang pelukan asimetris:
  // - lengan KANAN (d=1) di DEPAN: siku rendah di luar sisi kanan keranjang, lengan bawah naik miring melintang di
  //   depan badan keranjang, tangan mencengkeram sisi kiri;
  // - lengan KIRI (d=-1) MENGGAPAI ke BELAKANG: siku menekuk ke atas-kiri di luar sisi kiri, lengan bawah lewat di
  //   BELAKANG tumpukan pala, tangan muncul di sisi JAUH (kanan) keranjang memegang bibirnya dari belakang.
  const pose = (d: -1 | 1) => {
    const X = (dx: number) => SX + d * dx;
    if (d === 1) {
      return {
        sh: [X(204), 650] as Pt,
        el: mix([X(300), 610], [X(196), 742]),
        c1: mix([X(330), 560], [X(40), 744]),
        hd: mix([X(330), 500], [X(-132 + sq), 676]),
      };
    }
    return {
      sh: [X(204), 650] as Pt,
      // lengan bawah lewat SETINGGI tumpukan pala (y ~570) supaya biji pala menutupinya -> terbaca di belakang
      el: mix([X(300), 610], [X(286), 548]),
      c1: mix([X(330), 560], [X(60), 566]),
      hd: mix([X(330), 500], [X(-172 + sq), 600]),
    };
  };
  type Pose = ReturnType<typeof pose>;
  const upper = (q: Pose) => `M${q.sh[0]},${q.sh[1]} L${q.el[0]},${q.el[1]}`;
  const fore = (q: Pose) => `M${q.el[0]},${q.el[1]} Q${q.c1[0]},${q.c1[1]} ${q.hd[0]},${q.hd[1]}`;
  const L = pose(-1);
  const R = pose(1);
  const sleeve = (q: Pose) => (
    <>
      <path d={upper(q)} fill="none" stroke={INK} strokeWidth={70} strokeLinecap="round" />
      <path d={upper(q)} fill="none" stroke={toon.blueDark} strokeWidth={54} strokeLinecap="round" />
      <path d={upper(q)} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.35} transform="translate(-10 -4)" />
    </>
  );
  const forearm = (q: Pose, d: -1 | 1) => (
    <>
      <path d={fore(q)} fill="none" stroke={INK} strokeWidth={66} strokeLinecap="round" />
      <path d={fore(q)} fill="none" stroke={SKIN} strokeWidth={50} strokeLinecap="round" />
      <path d={fore(q)} fill="none" stroke={SKIN_D} strokeWidth={10} strokeLinecap="round" opacity={0.5} transform="translate(0 14)" />
      <circle cx={q.el[0]} cy={q.el[1]} r={26} fill={SKIN} />
      <GripHand x={q.hd[0]} y={q.hd[1]} dir={(-d) as -1 | 1} sq={press} />
    </>
  );
  return (
    <>
      <Glow cx={SX} cy={640} r={460} op={0.55} id="hug" />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", transform: `translateY(${bb}px) rotate(${sway}deg)`, transformOrigin: "960px 760px" }}>
        <HugShip cx={SX} deck={deck} t={t} />
        {/* lengan kiri: seluruhnya di BELAKANG keranjang (tumpukan pala menutupi lengan bawah); tangan di sisi jauh */}
        {sleeve(L)}
        {forearm(L, 1)}
        <HugBasket cx={SX} top={btop} />
        {/* lengan kanan: di DEPAN keranjang */}
        {sleeve(R)}
        {forearm(R, 1)}
      </svg>
      {/* air laut di depan dasar lambung: kapal terapung (bukan bak mandi) */}
      <WaterL x0={300} x1={1620} y0={808} y1={866} t={t} seed="pr-l09hug" />
    </>
  );
};
// L-09 (draf 2): potongan bersih (CutShot, tanpa silang-pudar 0,3 dtk yang di draf 1 memunculkan judul ganda dan
// kapal bayangan). Kapal-peluk SATU elemen persisten dari 2,5 dtk sampai akhir; hanya judul + pil yang berganti di 8,4.
const L09: React.FC<V> = ({ t }) => (
  <>
    <CutShot t={t} to={2.5}>
      {(lt) => (
        <>
          <Big text="BELANDA DATANG" t={lt} y={BIG_Y} size={114} color={toon.blue} />
          <In x={1190} y={455} t={lt}><Island kind="run" w={520} t={t} /></In>
          <ShipAt kind="nl" cx={540 + 170 * slide(lt, 0, 1.3)} wl={720} w={420} t={t} />
          <WaterL x0={90} x1={1830} y0={720} y1={860} t={t} seed="pr-l09" />
          <ChipAt cx={960} y={772} t={lt}><LChip text="VOC" color={toon.blueDark} size={45} flag="nl" /></ChipAt>
        </>
      )}
    </CutShot>
    <CutShot t={t} from={2.5} to={8.4}>
      {(lt) => (
        <>
          <Big text="PALANYA" t={lt} y={BIG_Y} size={133} color={toon.blue} />
          <Sub text="ingin dipegang sendiri" t={lt} at={0.7} y={310} size={40} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={8.4}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y} size={137} color={toon.blue} />
          <Sub text="hanya satu yang boleh jual" t={lt} y={310} size={40} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={2.5}>
      {(lt) => <NLHug t={t} lt={lt} />}
    </CutShot>
  </>
);

// L-10 (draf 2): toko es krim SATU elemen yang tetap ada sepanjang adegan dan bergeser halus antar-shot
// (draf 1: tiap shot punya toko sendiri sehingga saat silang-pudar muncul bayangan toko kedua, judul ganda dan wajah samar).
// Elemen lain berganti dengan potongan bersih: shot lama habis TEPAT saat shot baru mulai (tanpa tumpang tindih).
const L10_CUTS = [3.3, 6.9] as const;
const CutShot: React.FC<{ readonly t: number; readonly from?: number; readonly to?: number; readonly children: (lt: number) => React.ReactNode }> = ({ t, from = 0, to = 9999, children }) => {
  // potongan keras: frame terakhir shot lama tepat sebelum `to`, shot baru penuh 1 frame setelah `from` (tanpa frame kosong)
  const inn = from <= 0 ? 1 : interpolate(t, [from, from + 1 / 30], [0, 1], clamp01);
  const out = interpolate(t, [to, to + 1 / 30], [1, 0], clamp01);
  const o = Math.min(inn, out);
  if (o <= 0) {
    return null;
  }
  return <div style={{ position: "absolute", inset: 0, opacity: o }}>{children(t - Math.max(0, from))}</div>;
};
const L10Shop: React.FC<{ readonly t: number }> = ({ t }) => {
  // [pusat x, atas y, lebar] per shot; bergeser 0,45 dtk mulai tepat di titik potong
  const A = [1395, 350, 370];
  const B = [1205, 340, 390];
  const C = [960, 340, 400];
  const p1 = interpolate(t, [L10_CUTS[0] - 0.05, L10_CUTS[0] + 0.4], [0, 1], { ...clamp01, easing: Easing.inOut(Easing.cubic) });
  const p2 = interpolate(t, [L10_CUTS[1] - 0.05, L10_CUTS[1] + 0.4], [0, 1], { ...clamp01, easing: Easing.inOut(Easing.cubic) });
  const v = A.map((a, i) => a + (B[i] - a) * p1 + (C[i] - B[i]) * p2);
  const w = v[2];
  const s = 0.92 + 0.08 * interpolate(t, [0, 0.45], [0, 1], { ...clamp01, easing: Easing.out(Easing.back(1.8)) });
  return (
    <div style={{ position: "absolute", left: v[0] - w / 2, top: v[1] + bob(t, 4, 2, 2), transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
      <IceShop w={w} t={t} />
    </div>
  );
};
const L10: React.FC<V> = ({ t }) => (
  <>
    <Label text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
    <CutShot t={t} to={L10_CUTS[0]}>
      {(lt) => (
        <>
          <Big text="TOKO ES KRIM" t={lt} y={BIG_Y + 46} size={117} color={toon.orange} />
          {[0, 1, 2].map((i) => <In key={i} x={215 + i * 310} y={520 + bob(t, 4, 2, i)} t={lt} at={i * 0.22}><div style={{ fontSize: 180, lineHeight: 1 }}>⌂</div></In>)}
          <Sub text="di kompleks rumah" t={lt} at={0.5} y={778} size={45} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={L10_CUTS[0]} to={L10_CUTS[1]}>
      {(lt) => (
        <>
          <Big text="HANYA KAMI" t={lt} y={BIG_Y + 46} size={133} color={toon.orange} />
          {[0, 1, 2].map((i) => <In key={i} x={200 + i * 230} y={605 + bob(t, 3, 2, i)} t={lt} at={0.25 + i * 0.2}><div style={{ width: 130, height: 130, borderRadius: 80, background: i % 2 ? toon.blue : toon.orange, border: `9px solid ${INK}`, boxShadow: `0 8px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#fff" }}>☺</div></In>)}
          <Sub text="satu penjual saja" t={lt} at={0.5} y={786} size={46} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={L10_CUTS[1]}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y + 46} size={137} color={toon.blue} />
          <Sub text="hanya satu penjual" t={lt} y={786} size={45} />
        </>
      )}
    </CutShot>
    <L10Shop t={t} />
  </>
);

const L11: React.FC<V> = ({ t }) => (
  <>
    <Big text="DIPEREBUTKAN" t={t} y={BIG_Y} size={126} color={toon.orange} />
    <In x={710} y={410 + bob(t, 5, 2)} t={t}><Island kind="run" w={500} t={t} /></In>
    <ShipAt kind="en" cx={430} wl={705} w={370} t={t} />
    <ShipAt kind="nl" cx={1490} wl={705} w={370} t={t} flip phase={1} />
    <WaterL x0={90} x1={1830} y0={702} y1={838} t={t} seed="pr-l11" />
    <ChipAt cx={960} y={772} t={t}><LChip text="RUN · PALA" color={toon.orangeDark} size={44} /></ChipAt>
  </>
);

const L12: React.FC<V> = ({ t }) => (
  <>
    <Big text="CATATAN" t={t} y={RECAP_TITLE_Y} size={96} color={toon.blue} />
    <RecapBoard t={t} items={[
      { x: 300, y: 100, at: 0, node: <PhotoCard w={290} h={210} label="INGGRIS" tint="#FFDCB8"><Ship kind="en" w={190} t={t} sails={["#F0A443", "#86AEE6"]} /></PhotoCard>, rot: -3 },
      { x: 635, y: 130, at: 0.6, node: <PhotoCard w={290} h={210} label="RUN"><Island kind="run" w={220} t={t} /></PhotoCard> },
      { x: 965, y: 100, at: 1.2, node: <PhotoCard w={290} h={210} label="BELANDA" tint="#D7EAFE"><Ship kind="nl" w={190} t={t} sails={["#F0A443", "#86AEE6"]} /></PhotoCard>, rot: 3 },
    ]} strings={[[0,1,1.6],[1,2,2.1]]} stamp={{ text: "PALA DICARI", at: 4.0, color: toon.orangeDark, size: 65 }} />
    <BoardDetective t={t} x={130} y={470} size={240} />
  </>
);

const L13: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Shot t={t} to={3.6}>
      {(lt) => (
        <>
          <Big text="MANHATTAN" t={lt} y={BIG_Y} size={131} color={toon.blue} />
          <In x={605} y={268 + bob(t, 6, 2)} t={lt}><Island kind="manhattan" w={710} t={t} /></In>
          <ChipAt cx={960} y={660} t={lt}><LChip text="MANHATTAN" color={toon.blueDark} size={46} /></ChipAt>
        </>
      )}
    </Shot>
    <Shot t={t} from={3.5}>
      {(lt) => (
        <>
          <Big text="NEW AMSTERDAM" t={lt} y={BIG_Y} size={113} color={toon.blue} />
          <In x={605} y={268 + bob(t, 6, 2)} t={lt}><Island kind="manhattan" w={710} t={t} /></In>
          <FlagPole kind="nl" x={912} y={552} h={160} w={104} t={t} />
          <ChipAt cx={960} y={660} t={lt}><LChip text="BELANDA" color={toon.blueDark} size={46} flag="nl" /></ChipAt>
        </>
      )}
    </Shot>
  </>
);

const L14: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Big text="NEW YORK" t={t} y={BIG_Y} size={139} color={toon.orange} />
    {/* draf 3b: pulau 700 lebar, dasar bayangan <= ~832 (draf 3: bayangan masuk ke bawah caption) */}
    <In x={610} y={300 + bob(t, 5, 2)} t={t}><Island kind="manhattan-en" w={700} t={t} /></In>
    <FlagPole kind="en" x={914} y={587} h={184} w={124} t={t} />
    <ChipAt cx={960} y={641} t={t} at={0.5}><LChip text="INGGRIS" color={toon.orangeDark} size={45} flag="en" /></ChipAt>
  </>
);

const TwoIslands: React.FC<{ readonly t: number; readonly which?: "en" | "both" }> = ({ t, which = "en" }) => (
  <>
    <In x={250} y={390 + bob(t, 5, 2)} t={t}><Island kind="manhattan-en" w={610} t={t} /></In>
    <FlagPole kind="en" x={520} y={635} h={155} w={110} t={t} />
    <In x={1110} y={390 + bob(t, 5, 2, 1)} t={t}><Island kind="run" w={610} t={t} /></In>
    {which === "both" ? <FlagPole kind="nl" x={1350} y={635} h={155} w={110} t={t} phase={2} /> : null}
    <ChipAt cx={560} y={763} t={t}><LChip text="MANHATTAN" color={toon.orangeDark} size={41} flag="en" /></ChipAt>
    <ChipAt cx={1380} y={763} t={t}><LChip text="RUN" color={toon.blueDark} size={41} /></ChipAt>
  </>
);
const L15: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Shot t={t} to={4.6}>
      {(lt) => <><Big text="DUA PULAU" t={lt} y={BIG_Y} size={132} color={toon.orange} /><TwoIslands t={t} /></>}
    </Shot>
    <Shot t={t} from={4.5}>
      {(lt) => <><Big text="BERSAMAAN?" t={lt} y={BIG_Y} size={126} color={toon.blue} /><TwoIslands t={t} /><In x={850} y={490 + bob(t, 6, 2)} t={lt}><QBadge size={220} /></In></>}
    </Shot>
  </>
);

const L16: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Big text="CATATAN" t={t} y={RECAP_TITLE_Y} size={96} color={toon.blue} />
    <RecapBoard t={t} items={[
      { x: 315, y: 100, at: 0, node: <PhotoCard w={390} h={230} label="MANHATTAN"><Island kind="manhattan-en" w={315} t={t} /></PhotoCard>, rot: -3 },
      { x: 905, y: 100, at: 0.8, node: <PhotoCard w={390} h={230} label="RUN"><Island kind="run" w={315} t={t} /></PhotoCard>, rot: 3 },
    ]} strings={[[0,1,1.5]]} stamp={{ text: "INGGRIS: MANHATTAN", at: 3.1, color: toon.orangeDark, size: 58 }} />
    <BoardDetective t={t} x={130} y={470} size={240} />
  </>
);

export const BAB3_4: Record<string, React.FC<V>> = { l07:L07,l08:L08,l09:L09,l10:L10,l11:L11,l12:L12,l13:L13,l14:L14,l15:L15,l16:L16 };
export const SFX3_4: Record<string, readonly Cue[]> = {
  l07:[[0.2,"flip",0.35],[4.8,"waves",0.3]], l08:[[0.2,"page",0.4],[3.1,"stamp",0.5]],
  l09:[[0.2,"waves",0.3],[3.1,"pop",0.5],[8.5,"ding",0.45]],
  l10:[[0.2,"pop",0.4],[3.3,"ding",0.45]], l11:[[0.2,"waves",0.3]], l12:[[1.6,"pencil",0.4],[4.0,"stamp",0.5]],
  l13:[[0.2,"pop",0.4],[3.5,"ding",0.4]], l14:[[0.2,"flip",0.4]], l15:[[0.2,"pop",0.4],[4.5,"hmm",0.35]], l16:[[1.5,"pencil",0.4],[3.1,"stamp",0.5]],
};
