import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { PhotoCard } from "../elements/PhotoCard";
import { Particles } from "../elements/Particles";
import { Frost } from "../elements/Frost";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S4 · Kartu teks mengikuti narasi (waktu relatif terhadap awal scene, VO mulai di LEAD):
//   "Hasilnya, 1816 dijuluki Tahun Tanpa Musim Panas."  → kartu 1816 + embun beku & salju
//   "Di banyak wilayah Eropa ..."                        → kartu Eropa + peta anomali suhu (data NOAA)
//   "... panen gagal, dan harga pangan melonjak."        → kartu panen gagal + gambar kelaparan 1817
// Tidak ada grafik harga: belum ada data harga yang diverifikasi (aturan script).
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
    at: 6.8,
    color: colors.warm,
  },
];

export const SceneS4: React.FC = () => {
  const total = sceneFrames("s4");
  const { t, opacity } = useSceneTime(total);
  const frost = interpolate(t, [0.6, 4.5], [0, 0.9], {
    ...clamp,
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 28%, #14305A 0%, ${colors.bg} 72%)`,
        }}
      />
      <Particles kind="snow" t={t} count={70} opacity={0.9} />
      <Frost intensity={frost} />

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
        return (
          <div
            key={c.head}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: i === 0 ? 560 : 350,
              opacity: o,
              translate: `0px ${(1 - inP) * 40}px`,
              textAlign: "center",
              fontFamily: fonts.heading,
              fontWeight: 700,
              textShadow: `0 3px 18px ${colors.bg}`,
            }}
          >
            <div
              style={{
                fontSize: i === 0 ? 240 : 112,
                lineHeight: 1.05,
                color: c.color,
              }}
            >
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

      {/* Peta anomali suhu musim panas 1816 (rekonstruksi NOAA) + cara membacanya */}
      <PhotoCard
        src="suhuf-tambora/photos/anomali-1816.png"
        caption="Suhu musim panas 1816 (°C)"
        t={t}
        inAt={4.45}
        outAt={6.8}
        top={705}
        width={704}
        height={560}
        zoomFrom={1.0}
        zoomTo={1.05}
        grade={false}
        captionSize={25}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1322,
          opacity:
            interpolate(t, [5.2, 5.8], [0, 1], clamp) *
            interpolate(t, [6.5, 6.8], [1, 0], clamp),
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 27,
          lineHeight: 1.3,
          color: colors.text,
          textShadow: `0 0 8px ${colors.bg}, 0 0 8px ${colors.bg}`,
        }}
      >
        Biru = lebih dingin dari rata-rata 1971–2000
      </div>

      <PhotoCard
        src="suhuf-tambora/photos/hunger-1817.jpg"
        caption="Kelaparan 1817 · gambar sezaman, Swiss"
        t={t}
        inAt={6.8}
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
