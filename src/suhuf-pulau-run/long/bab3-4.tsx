import type React from "react";
import { bob, pop, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { Basket, CalendarYear, FlagPole, Island, Ship, TreatySheet, WrapHand } from "../shorts/kit2d";
import { Big, BIG_Y, ChipAt, H, INK, In, IceShop, Label, LChip, Shot, Sub, ToyFigure, W } from "./kitLong";
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

// Pelukan L-09: keranjang DI DEPAN lambung. Lengan bawah dari siku bawah-luar MELENGKUNG di sisi keranjang;
// tangan terlihat DI SISI keranjang (tidak bertaut di depan). Keranjang tetap besar, pala jelas.
const NLHug: React.FC<{ readonly t: number; readonly lt: number }> = ({ t, lt }) => {
  const hug = slide(lt, 0.4, 1.0);
  const press = hug * (0.5 + 0.5 * Math.sin(t * 2.4));
  const sx = 960;
  const shipTop = 255 + bob(t, 6, 2.3);
  const yb = 545 + bob(t, 6, 2.3);
  const pose = (d: -1 | 1) => ({
    s: [sx + d * 210, shipTop + 240] as const,
    e: [sx + d * (365 - 10 * hug), yb + 120] as const,
    c: [sx + d * (400 - 20 * hug), yb + 220] as const,
    h: [sx + d * (218 - 18 * hug - 6 * press), yb + 226] as const,
  });
  const arm = (d: -1 | 1) => {
    const { s, e, c, h } = pose(d);
    return (
      <g key={d}>
        <path d={`M${s[0]},${s[1]} L${e[0]},${e[1]} Q${c[0]},${c[1]} ${h[0]},${h[1]}`} fill="none" stroke={INK} strokeWidth={69} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${s[0]},${s[1]} L${e[0]},${e[1]}`} fill="none" stroke={toon.blueDark} strokeWidth={52} strokeLinecap="round" />
        <path d={`M${e[0]},${e[1]} Q${c[0]},${c[1]} ${h[0]},${h[1]}`} fill="none" stroke={toon.skin} strokeWidth={52} strokeLinecap="round" />
        <circle cx={e[0]} cy={e[1]} r={25} fill={toon.skin} />
        <WrapHand x={h[0]} y={h[1]} r={36} rot={d === -1 ? 16 : -16} flip={d === 1} squeeze={press} />
      </g>
    );
  };
  return (
    <>
      <In x={660} y={shipTop} t={lt}><Ship kind="nl" w={600} t={t} sway={1} belly={30} faceDy={-10} sails={["#F0A443", "#86AEE6"]} /></In>
      <Glow cx={960} cy={680} r={450} op={0.55} id="hug" />
      <In x={710} y={yb} t={lt}><Basket w={500} /></In>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {arm(-1)}{arm(1)}
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
          <Sub text="ingin dipegang sendiri" t={lt} at={0.7} y={325} size={43} />
        </>
      )}
    </Shot>
    <Shot t={t} from={8.4}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y} size={137} color={toon.blue} />
          <NLHug t={t} lt={lt} />
          <Sub text="hanya satu yang boleh jual" t={lt} y={325} size={43} />
        </>
      )}
    </Shot>
  </>
);

const L10: React.FC<V> = ({ t }) => (
  <>
    <Label text="PERUMPAMAAN - bukan data" kind="analogi" t={t} />
    <Shot t={t} to={3.4}>
      {(lt) => (
        <>
          <Big text="TOKO ES KRIM" t={lt} y={BIG_Y} size={117} color={toon.orange} />
          {[0, 1, 2].map((i) => <In key={i} x={215 + i * 310} y={520 + bob(t, 4, 2, i)} t={lt} at={i * 0.22}><div style={{ fontSize: 180, lineHeight: 1 }}>⌂</div></In>)}
          <In x={1210} y={350 + bob(t, 4, 2, 2)} t={lt}><IceShop w={370} t={t} /></In>
          <Sub text="di kompleks rumah" t={lt} at={0.5} y={778} size={45} />
        </>
      )}
    </Shot>
    <Shot t={t} from={3.3} to={7.0}>
      {(lt) => (
        <>
          <Big text="HANYA KAMI" t={lt} y={BIG_Y} size={133} color={toon.orange} />
          <In x={1010} y={355 + bob(t, 4, 2)} t={lt}><IceShop w={390} t={t} /></In>
          {[0, 1, 2].map((i) => <In key={i} x={230 + i * 230} y={605 + bob(t, 3, 2, i)} t={lt} at={0.25 + i * 0.2}><div style={{ width: 130, height: 130, borderRadius: 80, background: i % 2 ? toon.blue : toon.orange, border: `9px solid ${INK}`, boxShadow: `0 8px 0 ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#fff" }}>☺</div></In>)}
          <Sub text="satu penjual saja" t={lt} at={0.5} y={792} size={46} />
        </>
      )}
    </Shot>
    <Shot t={t} from={6.9}>
      {(lt) => (
        <>
          <Big text="MONOPOLI" t={lt} y={BIG_Y} size={137} color={toon.blue} />
          <In x={750} y={355 + bob(t, 5, 2)} t={lt}><IceShop w={420} t={t} /></In>
          <Sub text="hanya satu penjual" t={lt} y={805} size={45} />
        </>
      )}
    </Shot>
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
