import { Audio } from "@remotion/media";
import { Sfx } from "../elements/Sfx";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { GlobeLayer } from "../three/Globe";
import { Subtitle } from "../elements/Subtitle";
import { Particles } from "../elements/Particles";
import { Frost } from "../elements/Frost";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// Pita y yang bebas partikel: brand, judul + label, subtitle, handle.
const TEXT_BANDS = [
  [140, 215],
  [410, 700],
  [1370, 1500],
  [1550, 1630],
] as const;

// S1 · Hook. Globe 3D: Tambora (April 1815) lalu berputar ke Amerika Utara (embun beku, Juni 1816).
export const SceneS1: React.FC = () => {
  const total = sceneFrames("s1");
  const { t, opacity } = useSceneTime(total);
  // Semua isyarat mengikuti narasi: ganti tahun saat "Setahun kemudian".
  const sw = cue("s1", "Setahun kemudian", 0.5);
  const qAt = cue("s1", "Bagaimana", 0.2);
  const slAt = cue("s1", "Satu lembar", 0);
  const slogan = interpolate(t, [slAt, slAt + 0.7], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const qFade = interpolate(t, [slAt - 0.3, slAt], [1, 0], clamp);
  const swap = interpolate(t, [sw, sw + 1.0], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  // Fase 1815: abu naik + layar bergetar (mereda). Fase 1816: salju turun + embun beku merambat.
  const quake = interpolate(t, [0.6, sw], [1, 0], clamp);
  const shakeX = Math.sin(t * 47) * 7 * quake;
  const shakeY = Math.cos(t * 39) * 5 * quake;
  const ashOp = interpolate(
    t,
    [0.3, 1.2, sw - 0.2, sw + 0.8],
    [0, 1, 1, 0],
    clamp,
  );
  const snowOp = interpolate(t, [sw + 0.4, sw + 1.4], [0, 1], clamp);
  const frost = interpolate(t, [sw + 0.6, sw + 4.6], [0, 0.85], {
    ...clamp,
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <div style={{ position: "absolute", inset: 0, translate: "0px 72px" }}>
        <GlobeLayer t={t} sw={sw} />
      </div>

      <Particles
        kind="ash"
        t={t}
        count={40}
        size={0.7}
        exclude={TEXT_BANDS}
        opacity={ashOp}
      />
      <Particles
        kind="snow"
        t={t}
        count={45}
        size={0.65}
        exclude={TEXT_BANDS}
        opacity={snowOp}
      />
      <Frost intensity={frost} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          translate: `${shakeX}px ${shakeY}px`,
          top: 420,
          height: 160,
          overflow: "hidden",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 130,
          letterSpacing: "0.03em",
          textAlign: "center",
          color: colors.text,
        }}
      >
        <div
          style={{
            translate: `0px ${-160 * swap}px`,
            height: 160,
            lineHeight: "160px",
            color: colors.warm,
          }}
        >
          APRIL 1815
        </div>
        <div
          style={{
            translate: `0px ${-160 * swap}px`,
            height: 160,
            lineHeight: "160px",
            color: colors.cold,
          }}
        >
          JUNI 1816
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 605,
          left: 70,
          right: 70,
          textAlign: "center",
          opacity: swap,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 48,
          color: colors.text,
          textShadow: `0 3px 14px ${colors.bg}`,
        }}
      >
        EMBUN BEKU · TIMUR LAUT AS
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1250,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 76,
          color: colors.text,
          opacity: interpolate(t, [qAt, qAt + 0.6], [0, 1], clamp) * qFade,
          translate: `0px ${(1 - interpolate(t, [qAt, qAt + 0.6], [0, 1], clamp)) * 24}px`,
          textShadow: `0 4px 20px ${colors.bg}`,
        }}
      >
        Bagaimana mungkin?
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 275,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 62,
          color: colors.sun,
          opacity: slogan,
          translate: `0px ${(1 - slogan) * 24}px`,
          textShadow: `0 4px 20px ${colors.bg}`,
        }}
      >
        Satu lembar, satu cerita.
      </div>
      <Sfx name="rumble" at={0.3} volume={0.5} />
      <Sfx name="boom" at={0.55} volume={0.7} />
      <Sfx name="whoosh" at={sw} volume={0.35} />
      <Sfx name="wind" at={sw + 0.3} volume={0.3} />
      <Sfx name="shimmer" at={sw + 0.7} volume={0.3} />
      <Sfx name="pop" at={qAt} volume={0.35} />
      <Sfx name="ding" at={slAt + 0.1} volume={0.25} />
      <Audio
        name="VO s1"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s1.mp3")}
      />
      <Subtitle
        text={clipText("s1")}
        startSec={LEAD}
        durationSec={voSeconds("s1")}
      />
    </AbsoluteFill>
  );
};
