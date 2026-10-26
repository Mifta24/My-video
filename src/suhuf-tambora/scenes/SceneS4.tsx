import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { PhotoCard } from "../elements/PhotoCard";
import { Particles } from "../elements/Particles";
import { Frost } from "../elements/Frost";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { Tag } from "../elements/common";
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
    at: cue("s4", "Hasilnya", 0.1),
    color: colors.cold,
  },
  {
    head: "BANYAK WILAYAH EROPA",
    body: "hujan & dingin",
    at: cue("s4", "Di banyak wilayah", 0.4),
    color: colors.cold,
  },
  {
    head: "AMERIKA UTARA",
    body: "embun beku, Juni 1816",
    at: cue("s4", "Di Amerika Utara", 0.4),
    color: colors.cold,
  },
  {
    head: "HARGA PANGAN NAIK",
    body: "panen gagal",
    at: cue("s4", "Panen gagal", 0.3),
    color: colors.warm,
  },
];

// Termometer skematis: air raksa turun melewati 0 °C (titik beku) => embun beku di bulan Juni.
const ZERO_Y = 1040;
const Thermometer: React.FC<{
  readonly t: number;
  readonly inAt: number;
  readonly outAt: number;
}> = ({ t, inAt, outAt }) => {
  const i = interpolate(t, [inAt, inAt + 0.7], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const o = Math.min(i, interpolate(t, [outAt - 0.3, outAt], [1, 0], clamp));
  if (o <= 0) {
    return null;
  }
  const fall = interpolate(t, [inAt + 0.8, inAt + 3.4], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const level = 800 + fall * (1110 - 800);
  const frozen = level > ZERO_Y;
  const hg = frozen ? colors.cold : colors.warm;
  const note = interpolate(t, [inAt + 2.4, inAt + 3.2], [0, 1], clamp);
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, opacity: o }}
    >
      <rect
        x={330}
        y={760}
        width={60}
        height={450}
        rx={30}
        fill="#0B1730"
        stroke={colors.landLine}
        strokeWidth={4}
      />
      <circle
        cx={360}
        cy={1250}
        r={62}
        fill="#0B1730"
        stroke={colors.landLine}
        strokeWidth={4}
      />
      <rect x={345} y={level} width={30} height={1250 - level} fill={hg} />
      <circle cx={360} cy={1250} r={46} fill={hg} />
      {[800, 870, 940, 1110, 1180].map((y) => (
        <line
          key={y}
          x1={300}
          x2={322}
          y1={y}
          y2={y}
          stroke={colors.muted}
          strokeWidth={3}
        />
      ))}
      <line
        x1={270}
        x2={1000}
        y1={ZERO_Y}
        y2={ZERO_Y}
        stroke={colors.sun}
        strokeWidth={4}
        strokeDasharray="12 10"
      />
      <text
        x={440}
        y={ZERO_Y - 18}
        fill={colors.sun}
        fontFamily={fonts.heading}
        fontWeight={700}
        fontSize={64}
        stroke={colors.bg}
        strokeWidth={10}
        paintOrder="stroke"
      >
        0 °C
      </text>
      <text
        x={440}
        y={ZERO_Y + 50}
        fill={colors.text}
        fontFamily={fonts.mono}
        fontSize={30}
        stroke={colors.bg}
        strokeWidth={8}
        paintOrder="stroke"
      >
        titik beku air
      </text>
      <g opacity={note}>
        <text
          x={440}
          y={1160}
          fill={colors.cold}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={56}
          stroke={colors.bg}
          strokeWidth={10}
          paintOrder="stroke"
        >
          Embun beku
        </text>
        <text
          x={440}
          y={1210}
          fill={colors.text}
          fontFamily={fonts.mono}
          fontSize={28}
          stroke={colors.bg}
          strokeWidth={8}
          paintOrder="stroke"
        >
          timur laut AS, Juni 1816
        </text>
      </g>
    </svg>
  );
};

export const SceneS4: React.FC = () => {
  const total = sceneFrames("s4");
  const { t, opacity } = useSceneTime(total);
  const frost = interpolate(t, [0.6, CARDS[1].at + 1], [0, 0.9], {
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
        inAt={CARDS[1].at}
        outAt={CARDS[2].at}
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
            interpolate(
              t,
              [CARDS[1].at + 0.9, CARDS[1].at + 1.5],
              [0, 1],
              clamp,
            ) * interpolate(t, [CARDS[2].at - 0.3, CARDS[2].at], [1, 0], clamp),
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

      <Thermometer t={t} inAt={CARDS[2].at} outAt={CARDS[3].at} />
      {t >= CARDS[2].at && t < CARDS[3].at ? <Tag text="Skema" /> : null}

      <PhotoCard
        src="suhuf-tambora/photos/hunger-1817.jpg"
        caption="Kelaparan 1817 · gambar sezaman, Swiss"
        t={t}
        inAt={CARDS[3].at}
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
