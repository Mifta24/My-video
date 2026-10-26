import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { SUMBAWA_VIEW, TAMBORA, WORLD_VIEW, mixView } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S5 · Janji + CTA. Narasi: "Tapi korban terberatnya bukan di Eropa. Ceritanya bersambung. Follow Suhuf Pengetahuan."
// Logo asli belum ada: wordmark teks sebagai placeholder. Semua teks di area tengah (aman dari 250 px atas/bawah).
export const SceneS5: React.FC = () => {
  const total = sceneFrames("s5");
  const { t } = useSceneTime(total);
  const z = interpolate(t, [0, 2.8], [0, 1], { ...clamp, easing: easeOut });
  const view = mixView(WORLD_VIEW, SUMBAWA_VIEW, z);
  const pulse = 0.7 + 0.3 * Math.sin(t * 4);
  const q = interpolate(t, [1.0, 1.8], [0, 1], clamp);
  const qOut = interpolate(t, [4.6, 5.1], [1, 0], clamp);
  const end = interpolate(t, [5.3, 6.5], [0, 1], { ...clamp, easing: easeOut });
  const endHold = interpolate(t, [5.9, 6.5], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <WorldMap
        view={view}
        landOpacity={1 - 0.65 * end}
        landFill="#2C4372"
        landStroke="#9DBBEE"
        strokeWidth={2}
      >
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
          top: 480,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 108,
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
          top: 560,
          textAlign: "center",
          opacity: endHold,
          translate: `0px ${(1 - end) * 30}px`,
          fontFamily: fonts.heading,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.05,
            color: colors.text,
          }}
        >
          Suhuf
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.05,
            color: colors.cold,
          }}
        >
          Pengetahuan
        </div>
        <div
          style={{
            marginTop: 56,
            fontWeight: 500,
            fontSize: 58,
            color: colors.text,
          }}
        >
          Video lengkap di YouTube
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 36,
            padding: "16px 40px",
            borderRadius: 999,
            background: colors.warm,
            color: colors.bg,
            fontWeight: 700,
            fontSize: 54,
          }}
        >
          Follow @suhufpengetahuan
        </div>
      </div>

      {/* Atribusi peta: di atas zona UI bawah (250 px), di bawah subtitle. */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 32,
          color: colors.text,
          backgroundColor: "rgba(7,11,20,0.82)",
          opacity: end,
        }}
      >
        Peta: Natural Earth (domain publik)
        <br />
        Foto: NASA; Giezendanner, 1817 (domain publik)
      </div>

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
