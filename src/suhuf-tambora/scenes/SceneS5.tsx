import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { SUMBAWA_VIEW, TAMBORA, WORLD_VIEW, mixView } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S5 · Janji + CTA. Peta zoom balik ke Sumbawa, "Siapa yang paling parah?", lalu penutup.
// Logo asli Suhuf Pengetahuan belum ada: pakai wordmark teks sebagai placeholder.
export const SceneS5: React.FC = () => {
  const total = sceneFrames("s5");
  const { t, opacity } = useSceneTime(total);
  const z = interpolate(t, [0, 2.2], [0, 1], { ...clamp, easing: easeOut });
  const view = mixView(WORLD_VIEW, SUMBAWA_VIEW, z);
  const pulse = 0.7 + 0.3 * Math.sin(t * 4);
  const q = interpolate(t, [1.6, 2.2], [0, 1], clamp);
  const qOut = interpolate(t, [6.2, 6.8], [1, 0], clamp);
  const end = interpolate(t, [6.6, 7.4], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <WorldMap view={view} landOpacity={1 - 0.6 * end}>
        {(s) => {
          const [x, y] = s(TAMBORA.lon, TAMBORA.lat);
          return (
            <>
              <circle
                cx={x}
                cy={y}
                r={90 * pulse}
                fill={colors.warm}
                opacity={0.22 * (1 - end)}
              />
              <circle
                cx={x}
                cy={y}
                r={14}
                fill={colors.warm}
                opacity={1 - end}
              />
            </>
          );
        }}
      </WorldMap>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 560,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 100,
          lineHeight: 1.1,
          color: colors.text,
          opacity: Math.min(q, qOut),
        }}
      >
        Siapa yang
        <br />
        <span style={{ color: colors.warm }}>paling parah?</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 720,
          textAlign: "center",
          opacity: end,
          translate: `0px ${(1 - end) * 30}px`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 36,
            letterSpacing: 6,
            color: colors.cold,
          }}
        >
          SUHUF
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1.05,
            color: colors.text,
          }}
        >
          Pengetahuan
        </div>
        <div
          style={{
            marginTop: 48,
            fontFamily: fonts.heading,
            fontWeight: 500,
            fontSize: 56,
            color: colors.text,
          }}
        >
          Ceritanya bersambung
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 245,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.muted,
          opacity: end * 0.9,
        }}
      >
        Peta: Natural Earth (domain publik)
      </div>

      <Tag text="Skema" />
      <Audio
        name="VO s5"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s5.mp3")}
      />
      <Subtitle
        text={clipText("s5")}
        startSec={LEAD}
        durationSec={voSeconds("s5")}
      />
    </AbsoluteFill>
  );
};
