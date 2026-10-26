import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { PhotoBackdrop } from "../elements/PhotoBackdrop";
import { Particles } from "../elements/Particles";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S5 · Janji + CTA. Narasi: "Tapi korban terberatnya bukan di Eropa. Ceritanya bersambung. Follow Suhuf Pengetahuan."
// Latar: foto kaldera (NASA) digelapkan + abu. Logo asli belum ada: wordmark teks sebagai placeholder.
// Semua teks di area tengah (aman dari 250 px atas/bawah). Atribusi di akhir mencakup semua sumber di Shorts.
export const SceneS5: React.FC = () => {
  const total = sceneFrames("s5");
  const { t } = useSceneTime(total);
  const qIn = cue("s5", "Tapi korban", 0.1);
  const endAt = cue("s5", "Ceritanya", 0);
  const pulse = 0.7 + 0.3 * Math.sin(t * 4);
  const q = interpolate(t, [qIn, qIn + 0.8], [0, 1], clamp);
  const qOut = interpolate(t, [endAt - 0.5, endAt - 0.1], [1, 0], clamp);
  const end = interpolate(t, [endAt, endAt + 1.2], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const endHold = interpolate(t, [endAt + 0.6, endAt + 1.2], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const fadeIn = interpolate(t, [0, 0.5], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: fadeIn }}>
      <PhotoBackdrop
        src="suhuf-tambora/photos/tambora-nasa-iss.jpg"
        t={t}
        brightness={0.55 - 0.2 * end}
        zoomFrom={1.08}
        zoomTo={1.18}
        duration={9}
      />
      <Particles kind="ash" t={t} count={40} opacity={0.55} />

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
          textShadow: `0 4px 24px ${colors.bg}`,
          opacity: Math.min(q, qOut),
        }}
      >
        Siapa yang
        <br />
        <span style={{ color: colors.warm, opacity: 0.8 + 0.2 * pulse }}>
          paling parah?
        </span>
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
          textShadow: `0 4px 24px ${colors.bg}`,
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
          Ceritanya bersambung
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
            textShadow: "none",
          }}
        >
          Follow @suhufpengetahuan
        </div>
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
