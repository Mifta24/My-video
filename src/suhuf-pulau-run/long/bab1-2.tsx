import type React from "react";
import { Easing, interpolate } from "remotion";
import { bob, slide } from "../../suhuf-bakteri/elements/ToonKit";
import { toon } from "../../suhuf-bakteri/theme";
import type { Cue } from "../elements/Sound";
import { Basket, Island, MapIsland, Nutmeg, Ruler, SeaPanel, TreatySheet } from "../shorts/kit2d";
import { LogoSheet } from "../shorts/visuals";
import { BoardDetective, BigGlass, Glow, PhotoCard, RecapBoard, RECAP_TITLE_Y } from "./props";
import { Big, BIG_Y, ChipAt, In, Label, LChip, ScaleLong3D, Shot, Sub, W, H, clamp01 } from "./kitLong";
import { cue } from "./timing"; 

export type V = { readonly t: number };

// L-01: timbangan 3D (satu-satunya 3D di bab ini). Pulau kiri Manhattan, kanan Run; belum ada klaim 'pertukaran tertulis'.
const L01: React.FC<V> = ({ t }) => {
  const morph = cue("l01", "Ditukar") + 0.55;
  const angle = 7.5 * Math.sin(t * 2.6) * interpolate(t, [morph - 0.6, morph], [1, 0.35], clamp01);
  const before = interpolate(t, [morph - 0.1, morph + 0.3], [1, 0], clamp01);
  return (
    <>
      <Label text="SKEMA" t={t} />
      <ScaleLong3D t={t} angle={angle} morphAt={morph} />
      <div style={{ position: "absolute", inset: 0, opacity: before }}>
        <Big text="DITUKAR?" t={t} y={BIG_Y} size={135} color={toon.orange} />
        <ChipAt cx={640} y={650} t={t}><LChip text="MANHATTAN" color={toon.orangeDark} size={38} /></ChipAt>
        <ChipAt cx={1280} y={650} t={t}><LChip text="RUN" color={toon.blueDark} size={38} /></ChipAt>
      </div>
      {t >= morph + 0.35 ? <Sub text="DITUKAR, ATAU TIDAK?" t={t} at={morph + 0.35} y={760} size={53} /> : null}
    </>
  );
};

const L02: React.FC<V> = ({ t }) => (
  <>
    <Shot t={t} to={3.8}>
      {(lt) => (
        <>
          <div style={{ position: "absolute", left: 755, top: 300 + bob(lt, 7, 2.5), transform: `perspective(1600px) rotateX(${-20 * (1 - slide(lt, 0, 0.8))}deg)` }}>
            {/* draf 3b: dokumen 410 lebar, dasar <= ~832 (>= 30 px di atas caption y 895) */}
            <TreatySheet w={410} />
          </div>
          <In x={895} y={378} t={lt} at={0.3}>
            <LogoSheet w={145} />
          </In>
          <Big text="SATU LEMBAR" t={lt} y={160} size={123} color={toon.orange} />
          <Sub text="satu cerita" t={lt} at={0.6} y={700} size={50} />
        </>
      )}
    </Shot>
    <Shot t={t} from={3.7}>
      {(lt) => (
        <>
          <In x={470} y={260 + bob(lt, 7, 2)} t={lt}><LogoSheet w={260} /></In>
          <BoardDetective t={lt} x={1160} y={300} size={330} />
          <Big text="SUHUF PENGETAHUAN" t={lt} y={160} size={100} color={toon.blue} />
          <Sub text="DETEKTIF SEJARAH" t={lt} at={1.0} y={742} size={51} />
        </>
      )}
    </Shot>
  </>
);

const L03: React.FC<V> = ({ t }) => (
  <>
    <Label text="SKEMA" t={t} />
    <Shot t={t} to={3.4}>
      {(lt) => (
        <>
          <Big text="PULAU RUN" t={lt} y={BIG_Y} size={126} color={toon.orange} />
          <SeaPanel x={310} y={315} w={1300} h={510} t={lt} seed="pr-l03a" />
          <In x={830} y={505 + bob(lt, 5, 2)} t={lt}><MapIsland w={260} /></In>
          <BigGlass x={1110 + Math.sin(lt * 2.1) * 22} y={570 + Math.cos(lt * 2.1) * 12} r={140} />
          <ChipAt cx={960} y={712} t={lt} at={0.7}><LChip text="RUN" color={toon.orangeDark} size={41} /></ChipAt>
        </>
      )}
    </Shot>
    <Shot t={t} from={3.3} to={6.5}>
      {(lt) => (
        <>
          <Big text="3 x 1 km" t={lt} y={BIG_Y} size={125} color={toon.orange} />
          <SeaPanel x={310} y={315} w={1300} h={510} t={t} seed="pr-l03b" grid={false} />
          <In x={410} y={490 + bob(t, 5, 2)} t={lt}><MapIsland w={1100} /></In>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <Ruler x1={430} y1={710} x2={1500} y2={710} p={slide(lt, 0.3, 0.7)} />
            <Ruler x1={385} y1={500} x2={385} y2={625} p={slide(lt, 0.6, 0.5)} color={toon.blueDark} />
          </svg>
        </>
      )}
    </Shot>
    <Shot t={t} from={6.4}>
      {(lt) => (
        <>
          <Big text="KECIL SEKALI" t={lt} y={BIG_Y} size={120} color={toon.blue} />
          <SeaPanel x={310} y={315} w={1300} h={510} t={t} seed="pr-l03c" />
          <In x={870} y={535 + bob(lt, 4, 2)} t={lt}><MapIsland w={170} /></In>
          <BigGlass x={1070 + 30 * Math.sin(lt * 1.9)} y={560} r={130} />
          <ChipAt cx={960} y={716} t={lt}><LChip text="RUN" color={toon.orangeDark} size={38} /></ChipAt>
        </>
      )}
    </Shot>
  </>
);

// Letak Run: peta skema tanpa batas negara. Titik barat dipisahkan jelas dari gugusan Banda.
const L04: React.FC<V> = ({ t }) => {
  const isles: readonly [number, number, number, number][] = [[740, 510, 165, -12], [930, 468, 250, 13], [1190, 560, 195, -7], [1400, 480, 115, 18], [560, 590, 185, -3]];
  return (
    <>
      <Label text="SKEMA" t={t} />
      <Shot t={t} to={3.2}>
        {(lt) => (
          <>
            <Big text="MALUKU" t={lt} y={BIG_Y} size={135} color={toon.blue} />
            <SeaPanel x={235} y={315} w={1450} h={525} t={t} seed="pr-l04" grid={false} />
            {isles.map(([x, y, w, rot], i) => (
              <In key={i} x={x} y={y + bob(lt, 4, 2.1, i)} t={lt} at={i * 0.17} rot={rot}>
                <MapIsland w={w} />
              </In>
            ))}
            <ChipAt cx={960} y={755} t={lt}><LChip text="KEPULAUAN BANDA" color={toon.blueDark} size={41} /></ChipAt>
          </>
        )}
      </Shot>
      <Shot t={t} from={3.1}>
        {(lt) => (
          <>
            <Big text="PALING BARAT" t={lt} y={BIG_Y} size={125} color={toon.orange} />
            <SeaPanel x={235} y={315} w={1450} h={525} t={t} seed="pr-l04b" grid={false} />
            {isles.map(([x, y, w, rot], i) => (
              <div key={i} style={{ position: "absolute", left: x, top: y + bob(t, 4, 2, i), transform: `rotate(${rot}deg) scale(${i === 4 ? 1 + 0.06 * Math.sin(t * 4) : 1})` }}>
                <MapIsland w={w} />
              </div>
            ))}
            <Glow cx={655} cy={615} r={180} op={0.6} id="run-west" />
            <ChipAt cx={650} y={723} t={lt} at={0.1}><LChip text="RUN" color={toon.orangeDark} size={55} /></ChipAt>
          </>
        )}
      </Shot>
    </>
  );
};

const L05: React.FC<V> = ({ t }) => (
  <>
    <Shot t={t} to={3.4}>
      {(lt) => (
        <>
          <Big text="PALA & FULI" t={lt} y={BIG_Y} size={132} color={toon.orange} />
          <Glow cx={960} cy={545} r={470} op={0.75} id="pala-a" />
          {/* draf 3b: dasar bayangan = y + 0,753 w <= ~832 (>= 30 px dari caption, termasuk bob + goyang kamera) */}
          <In x={580} y={252 + bob(t, 5, 2.1)} t={lt}><Island kind="run" w={760} t={t} /></In>
          <ChipAt cx={960} y={696} t={lt}><LChip text="RUN" color={toon.orangeDark} size={42} /></ChipAt>
        </>
      )}
    </Shot>
    <Shot t={t} from={3.3}>
      {(lt) => (
        <>
          <Big text="DICARI" t={lt} y={BIG_Y} size={135} color={toon.orange} />
          <Glow cx={960} cy={570} r={390} op={0.8} id="pala-b" />
          <In x={770} y={535} t={lt}><Basket w={380} /></In>
          {[0, 1, 2].map((i) => {
            const fall = interpolate(lt, [0.2 + i * 0.3, 1.1 + i * 0.3], [-150, 0], { ...clamp01, easing: Easing.in(Easing.quad) });
            const bounce = lt > 1.1 + i * 0.3 ? Math.abs(Math.sin((lt - 1.1 - i * 0.3) * 7)) * 22 * Math.exp(-(lt - 1.1 - i * 0.3) * 3) : 0;
            return (
              <In key={i} x={715 + i * 170} y={350 + fall - bounce} t={lt} at={0.2 + i * 0.3} rot={-15 + i * 15}>
                <Nutmeg size={140} />
              </In>
            );
          })}
          <Sub text="hasil kebun dari Run" t={lt} at={1.5} y={787} size={43} />
        </>
      )}
    </Shot>
  </>
);

const L06: React.FC<V> = ({ t }) => (
  <>
    <Big text="CATATAN" t={t} y={RECAP_TITLE_Y} size={96} color={toon.blue} />
    <RecapBoard
      t={t}
      items={[
        { x: 300, y: 100, at: 0, node: <PhotoCard w={340} h={220} label="RUN" tint="#CFE6FD"><MapIsland w={275} /></PhotoCard>, rot: -3 },
        { x: 910, y: 100, at: 0.7, node: <PhotoCard w={340} h={220} label="PALA & FULI"><Nutmeg size={195} /></PhotoCard>, rot: 3 },
      ]}
      strings={[[0, 1, 1.4]]}
      stamp={{ text: "RUN = PALA", at: 2.65, color: toon.orangeDark, size: 67 }}
    />
    <BoardDetective t={t} x={130} y={470} size={240} />
  </>
);

export const BAB1_2: Record<string, React.FC<V>> = { l01: L01, l02: L02, l03: L03, l04: L04, l05: L05, l06: L06 };
export const SFX1_2: Record<string, readonly Cue[]> = {
  l01: [[0.3, "scale", 0.4], [cue("l01", "Ditukar"), "hmm", 0.35]],
  l02: [[0.1, "page", 0.5], [3.75, "pop", 0.4]],
  l03: [[0.15, "waves", 0.35], [3.3, "pencil", 0.3], [6.4, "pop", 0.4]],
  l04: [[0.1, "waves", 0.3], [3.1, "ding", 0.4]],
  l05: [[0.2, "shimmer", 0.35], [4.1, "plop", 0.5], [4.4, "plop", 0.4], [4.7, "plop", 0.35]],
  l06: [[0.7, "pop", 0.45], [1.4, "pencil", 0.45], [2.65, "stamp", 0.65]],
};
