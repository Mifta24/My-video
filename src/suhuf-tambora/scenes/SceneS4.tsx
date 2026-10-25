import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { NEW_ENGLAND, SWISS, WORLD_VIEW } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S4 · Tiga kartu teks cepat di atas peta yang menggelap-dingin.
// Tidak ada grafik suhu/harga: belum ada data rekonstruksi yang diverifikasi (aturan script).
const CARDS = [
  { head: "BANYAK WILAYAH EROPA", body: "hujan & dingin", at: 0.5 },
  { head: "AMERIKA UTARA", body: "embun beku", at: 2.9 },
  { head: "PANEN GAGAL", body: "harga pangan naik", at: 5.3 },
];

export const SceneS4: React.FC = () => {
  const total = sceneFrames("s4");
  const { t, opacity } = useSceneTime(total);
  const cold = interpolate(t, [0, 4], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <WorldMap view={WORLD_VIEW}>
        {(s) => {
          const [bx, by] = s(SWISS.lon, SWISS.lat);
          const [cx, cy] = s(NEW_ENGLAND.lon, NEW_ENGLAND.lat);
          return (
            <>
              <circle
                cx={bx}
                cy={by}
                r={30 + 150 * cold}
                fill={colors.coldDeep}
                opacity={0.35 * cold}
              />
              <circle
                cx={cx}
                cy={cy}
                r={30 + 170 * cold}
                fill={colors.coldDeep}
                opacity={0.35 * cold}
              />
              <circle cx={bx} cy={by} r={9} fill={colors.cold} />
              <circle cx={cx} cy={cy} r={9} fill={colors.cold} />
            </>
          );
        }}
      </WorldMap>
      <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: 0.45 }} />

      {CARDS.map((c, i) => {
        const next = CARDS[i + 1]?.at ?? 99;
        const inP = interpolate(t, [c.at, c.at + 0.4], [0, 1], {
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
              top: 620,
              opacity: o,
              translate: `0px ${(1 - inP) * 40}px`,
              textAlign: "center",
              fontFamily: fonts.heading,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                fontSize: c.head.length > 14 ? 78 : 104,
                lineHeight: 1.05,
                color: i === 2 ? colors.warm : colors.cold,
              }}
            >
              {c.head}
            </div>
            <div style={{ fontSize: 76, color: colors.text, marginTop: 12 }}>
              {c.body}
            </div>
          </div>
        );
      })}

      <Tag text="Skema" />
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
