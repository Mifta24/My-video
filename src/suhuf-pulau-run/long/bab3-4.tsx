import type React from "react";
import { Easing, interpolate } from "remotion";
import { bob, pop, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { Basket, CalendarYear, FlagPole, Island, Ship, TreatySheet, WrapHand } from "../shorts/kit2d";
import { Big, BIG_Y, ChipAt, clamp01, H, INK, In, IceShop, Label, LChip, Shot, Sub, ToyFigure, W } from "./kitLong";
import { BoardDetective, Glow, PhotoCard, QBadge, RecapBoard, ShipAt, WaterL } from "./props";
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
          <In x={755} y={292 + bob(t, 7, 2)} t={lt}><TreatySheet w={410} stampP={slide(lt, 1.4, 0.35)} /></In>
          <Sub text="ditandatangani penduduk" t={lt} at={0.45} y={779} size={43} />
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

// Pelukan L-09 (draf 2). Tata letak (px kanvas): judul y 150-268, pil subjudul y 296-~356, puncak bendera ~394
// (jarak >= 30 px dari pil), elemen terbawah <= ~862 (caption bawah mulai ~897, jarak >= 30 px).
// Kapal: lambung berhaluan dan berburitan naik (siluet kapal), tanpa lingkaran lambang di layar, tanpa wajah
// (wajah tertutup keranjang). Keranjang di depan lambung; haluan dan buritan terlihat di kiri-kanan keranjang.
// Pelukan: lengan atas keluar dari BALIK keranjang (dari badan kapal) ke siku di luar sisi bawah keranjang; lengan
// bawah TEBAL melengkung MELINGKARI sudut bawah ke DEPAN keranjang; dua tangan menempel di muka keranjang
// (sepertiga bawah), jari ke arah tengah, tidak bertaut. Siluet: keranjang dirangkul ke badan kapal.
const SX = 960;
type Pt = readonly [number, number];
const BW = 270;
export const NLHug: React.FC<{ readonly t: number; readonly lt: number; readonly closed?: boolean }> = ({ t, lt, closed = false }) => {
  const hug = closed ? 1 : slide(lt, 0.1, 0.7);
  const press = hug * (0.5 + 0.5 * Math.sin(t * 2.4));
  const bb = bob(t, 6, 2.3);
  const SW = 460;
  const shipTop = 404 + bb; // puncak bendera ~ shipTop - 4 (>= 30 px di bawah pil subjudul y <= 356)
  const yb = 536 + bb; // keranjang: tepi atas badan ~ yb+95 (lebar +-100), dasar ~ yb+221 (lebar +-81)
  const mix = (a: Pt, b: Pt): Pt => [a[0] + (b[0] - a[0]) * hug, a[1] + (b[1] - a[1]) * hug + bb];
  const sq = 5 * press;
  // Lengan rapat mengikuti kontur keranjang: bahu di sisi lambung (di balik keranjang), siku menempel di luar sisi
  // bawah keranjang, lengan bawah membungkus sudut bawah lalu naik di muka keranjang; tangan di sepertiga bawah.
  const pose = (d: -1 | 1) => {
    const X = (dx: number) => SX + d * dx;
    return {
      sh: mix([X(118), 660], [X(118), 660]),
      el: mix([X(225), 610], [X(136), 728]),
      c1: mix([X(262), 560], [X(140), 806]),
      c2: mix([X(262), 510], [X(104), 812]),
      wr: mix([X(250), 476], [X(70 + sq * 0.3), 786]),
      hd: mix([X(244), 446], [X(46 + sq), 754]),
    };
  };
  type Pose = ReturnType<typeof pose>;
  const upper = (q: Pose) => `M${q.sh[0]},${q.sh[1]} L${q.el[0]},${q.el[1]}`;
  const fore = (q: Pose) => `M${q.el[0]},${q.el[1]} C${q.c1[0]},${q.c1[1]} ${q.c2[0]},${q.c2[1]} ${q.wr[0]},${q.wr[1]}`;
  const L = pose(-1);
  const R = pose(1);
  const sleeve = (q: Pose) => (
    <>
      <path d={upper(q)} fill="none" stroke={INK} strokeWidth={76} strokeLinecap="round" />
      <path d={upper(q)} fill="none" stroke="#fff" strokeWidth={58} strokeLinecap="round" />
      <path d={upper(q)} fill="none" stroke={toon.blueDark} strokeWidth={58} strokeDasharray="9 20" />
    </>
  );
  const forearm = (q: Pose, d: -1 | 1) => (
    <>
      <path d={fore(q)} fill="none" stroke={INK} strokeWidth={74} strokeLinecap="round" />
      <path d={fore(q)} fill="none" stroke={toon.skin} strokeWidth={56} strokeLinecap="round" />
      <path d={fore(q)} fill="none" stroke="#EDA27A" strokeWidth={11} strokeLinecap="round" opacity={0.5} transform="translate(0 15)" />
      <circle cx={q.el[0]} cy={q.el[1]} r={28} fill={toon.skin} />
      <WrapHand x={q.hd[0]} y={q.hd[1]} r={44} rot={d === -1 ? -50 : 180 + 50} squeeze={press} />
    </>
  );
  return (
    <>
      <Glow cx={SX} cy={650} r={440} op={0.55} id="hug" />
      <In x={SX - SW / 2} y={shipTop} t={lt}><Ship kind="nl" w={SW} t={t} sway={0.6} hullShape="ship" emblem={false} face={false} sails={["#F0A443", "#86AEE6"]} /></In>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {sleeve(L)}{sleeve(R)}
      </svg>
      <div style={{ position: "absolute", left: SX - BW / 2, top: yb }}><Basket w={BW} /></div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {forearm(L, -1)}{forearm(R, 1)}
      </svg>
    </>
  );
};
const L09: React.FC<V> = ({ t }) => (
  <>
    <Shot t={t} to={2.6}>
      {(lt) => (
        <>
          <Big text="BELANDA DATANG" t={lt} y={BIG_Y} size={114} color={toon.blue} />
          <In x={1190} y={455} t={lt}><Island kind="run" w={520} t={t} /></In>
          <ShipAt kind="nl" cx={540 + 170 * slide(lt, 0, 1.3)} wl={720} w={420} t={t} />
          <WaterL x0={90} x1={1830} y0={720} y1={860} t={t} seed="pr-l09" />
          <ChipAt cx={960} y={772} t={lt}><LChip text="VOC" color={toon.blueDark} size={45} flag="nl" /></ChipAt>
        </>
      )}
    </Shot>
    <Shot t={t} from={2.5} to={8.5}>
      {(lt) => (
        <>
          <Big text="PALANYA" t={lt} y={BIG_Y} size={133} color={toon.blue} />
          <NLHug t={t} lt={lt} />
          <Sub text="ingin dipegang sendiri" t={lt} at={0.7} y={288} size={40} />
        </>
      )}
    </Shot>
    <Shot t={t} from={8.4}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y} size={137} color={toon.blue} />
          <NLHug t={t} lt={lt} closed />
          <Sub text="hanya satu yang boleh jual" t={lt} y={288} size={40} />
        </>
      )}
    </Shot>
  </>
);

// L-10 (draf 2): toko es krim SATU elemen yang tetap ada sepanjang adegan dan bergeser halus antar-shot
// (draf 1: tiap shot punya toko sendiri sehingga saat silang-pudar muncul bayangan toko kedua, judul ganda dan wajah samar).
// Elemen lain berganti dengan potongan bersih: shot lama habis TEPAT saat shot baru mulai (tanpa tumpang tindih).
const L10_CUTS = [3.3, 6.9] as const;
const CutShot: React.FC<{ readonly t: number; readonly from?: number; readonly to?: number; readonly children: (lt: number) => React.ReactNode }> = ({ t, from = 0, to = 9999, children }) => {
  const inn = from <= 0 ? 1 : interpolate(t, [from, from + 0.1], [0, 1], clamp01);
  const out = interpolate(t, [to - 0.1, to], [1, 0], clamp01);
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
          <Big text="TOKO ES KRIM" t={lt} y={BIG_Y} size={117} color={toon.orange} />
          {[0, 1, 2].map((i) => <In key={i} x={215 + i * 310} y={520 + bob(t, 4, 2, i)} t={lt} at={i * 0.22}><div style={{ fontSize: 180, lineHeight: 1 }}>⌂</div></In>)}
          <Sub text="di kompleks rumah" t={lt} at={0.5} y={778} size={45} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={L10_CUTS[0]} to={L10_CUTS[1]}>
      {(lt) => (
        <>
          <Big text="HANYA KAMI" t={lt} y={BIG_Y} size={133} color={toon.orange} />
          {[0, 1, 2].map((i) => <In key={i} x={200 + i * 230} y={605 + bob(t, 3, 2, i)} t={lt} at={0.25 + i * 0.2}><div style={{ width: 130, height: 130, borderRadius: 80, background: i % 2 ? toon.blue : toon.orange, border: `9px solid ${INK}`, boxShadow: `0 8px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#fff" }}>☺</div></In>)}
          <Sub text="satu penjual saja" t={lt} at={0.5} y={800} size={46} />
        </>
      )}
    </CutShot>
    <CutShot t={t} from={L10_CUTS[1]}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y} size={137} color={toon.blue} />
          <Sub text="hanya satu penjual" t={lt} y={805} size={45} />
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
    <Big text="CATATAN" t={t} y={BIG_Y} size={115} color={toon.blue} />
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
          <In x={585} y={375 + bob(t, 6, 2)} t={lt}><Island kind="manhattan" w={750} t={t} /></In>
          <ChipAt cx={960} y={764} t={lt}><LChip text="MANHATTAN" color={toon.blueDark} size={46} /></ChipAt>
        </>
      )}
    </Shot>
    <Shot t={t} from={3.5}>
      {(lt) => (
        <>
          <Big text="NEW AMSTERDAM" t={lt} y={BIG_Y} size={113} color={toon.blue} />
          <In x={585} y={390 + bob(t, 6, 2)} t={lt}><Island kind="manhattan" w={750} t={t} /></In>
          <FlagPole kind="nl" x={910} y={680} h={170} w={110} t={t} />
          <ChipAt cx={960} y={775} t={lt}><LChip text="BELANDA" color={toon.blueDark} size={46} flag="nl" /></ChipAt>
        </>
      )}
    </Shot>
  </>
);

const L14: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Big text="NEW YORK" t={t} y={BIG_Y} size={139} color={toon.orange} />
    <In x={570} y={425 + bob(t, 5, 2)} t={t}><Island kind="manhattan-en" w={780} t={t} /></In>
    <FlagPole kind="en" x={910} y={740} h={200} w={135} t={t} />
    <ChipAt cx={960} y={790} t={t} at={0.5}><LChip text="INGGRIS" color={toon.orangeDark} size={45} flag="en" /></ChipAt>
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
    <Big text="CATATAN" t={t} y={BIG_Y} size={115} color={toon.blue} />
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
