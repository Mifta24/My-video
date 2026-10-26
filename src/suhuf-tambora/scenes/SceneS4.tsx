import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { PhotoCard } from "../elements/PhotoCard";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { WORLD_VIEW } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S4 · Kartu teks mengikuti narasi (waktu relatif terhadap awal scene, VO mulai di LEAD):
//   "Hasilnya, 1816 dijuluki Tahun Tanpa Musim Panas."  → kartu 1816
//   "Di banyak wilayah Eropa ..."                        → kartu Eropa
//   "... panen gagal, dan harga pangan melonjak."        → kartu panen gagal
// Tidak ada grafik suhu/harga: belum ada data rekonstruksi yang diverifikasi (aturan script).
const CARDS = [
  {
    head: "1816",
    body: "Tahun Tanpa Musim Panas",
    at: 0.4,
    color: colors.cold,
  },
  {
    head: "BANYAK WILAYAH EROPA",
    body: "hujan & dingin",
    at: 4.45,
    color: colors.cold,
  },
  {
    head: "HARGA PANGAN NAIK",
    body: "panen gagal",
    at: 6.5,
    color: colors.warm,
  },
];

export const SceneS4: React.FC = () => {
  const total = sceneFrames("s4");
  const { t, opacity } = useSceneTime(total);
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <WorldMap view={WORLD_VIEW} />
      <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: 0.4 }} />

      {CARDS.map((c, i) => {
        const next = CARDS[i + 1]?.at ?? 99;
        const inP = interpolate(t, [c.at, c.at + 0.7], [0, 1], {
          ...clamp,
          easing: easeOut,
        });
        const outP = interpolate(t, [next - 0.25, next], [1, 0], clamp);
        const o = Math.min(inP, outP);
        if (o <= 0) {
          return null;
        }
        // Kartu di atas peta (peta mulai y≈735), jauh dari titik dan subtitle.
        return (
          <div
            key={c.head}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 380,
              opacity: o,
              translate: `0px ${(1 - inP) * 40}px`,
              textAlign: "center",
              fontFamily: fonts.heading,
              fontWeight: 700,
            }}
          >
            <div style={{ fontSize: 112, lineHeight: 1.05, color: c.color }}>
              {c.head}
            </div>
            <div
              style={{
                fontSize: c.body.length > 20 ? 62 : 76,
                color: colors.text,
                marginTop: 12,
              }}
            >
              {c.body}
            </div>
          </div>
        );
      })}

      <PhotoCard
        src="suhuf-tambora/photos/hunger-1817.jpg"
        caption="Kelaparan 1817 · Giezendanner (domain publik)"
        t={t}
        inAt={4.8}
        top={760}
        width={900}
        height={540}
        zoomFrom={1.0}
        zoomTo={1.06}
      />
      <Audio
        name="VO s4"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s4.mp3")}
      />
      <Subtitle
        text={clipText("s4")}
        startSec={LEAD}
        durationSec={voSeconds("s4")}
      />
    </AbsoluteFill>
  );
};
