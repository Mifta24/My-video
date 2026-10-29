import type React from "react";
import { BodySilhouette } from "./characters";
import { appear, bob, BigWord, Place, Sh, Sparkle, Tag, toonFont } from "../elements/ToonKit";
import { toon } from "../theme";
import { cue } from "../timing";
import { hopMotion, mvToy, Stage3D, sway, Toy } from "./toy3d";

// Shorts V3 draf 2: adegan dengan tokoh 3D (Three.js). Tata letak mengikuti draf 1 (px kanvas 1080x1920).
// Teks, label, subtitle tetap 2D di atas lapisan 3D. Zona aman: 150 px atas, 250 px bawah.
type V = { readonly t: number };
const INK = toon.ink;

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
                <Toy key={i} kind="bact" size={118} t={t} phase={i} mood={i % 4 === 0 ? "laugh" : "happy"} yaw={-14} {...mvToy(t, [500, 730], [b.x, b.y], 0.3 + i * 0.13, 0.75, 36)} {...(t > 1.6 + i * 0.13 ? hopMotion(t, 5, 3.2, i) : {})} />
              ))}
              <Toy kind="cell" size={130} t={t} mood="worry" yaw={12} {...mvToy(t, [560, 760], [800, 760], 1.9, 0.8, 20)} />
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
              <Toy kind="bact" size={230} left={90} top={950} t={t} at={4.6} mood="think" look={[0.8, -0.4]} yaw={-16} rot={sway(t, 2.5, 2.2)} {...hopMotion(t, 8, 2.4)} />
              <Toy kind="cell" size={200} left={760} top={930} t={t} at={4.8} mood="oh" look={[-0.8, -0.4]} yaw={16} rot={sway(t, 2.5, 2.2, 1.5)} {...hopMotion(t, 8, 2.4, 2)} />
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

export const SHORTS_VISUALS_3D: Record<string, React.FC<{ readonly t: number }>> = {
  s01: S01,
};
