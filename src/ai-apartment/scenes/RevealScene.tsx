import { Audio } from "@remotion/media";
import {
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BasicCaptions } from "../basic-captions";
import { EnVo } from "../elements/EnVo";
import { useL, useLang } from "../i18n";
import { LimeFlash } from "../elements/LimeFlash";
import { Wordmark } from "../elements/Wordmark";
import { colors, fonts, sfx } from "../theme";

// Scene 3 (9–14 dtk): produk muncul. Navy, flash lime, logo, concierge.
const RevealSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";

  return (
    <>
      <Img
        name="Concierge"
        src={staticFile("ai-apartment/concierge-welcoming.png")}
        style={{
          position: "absolute",
          top: 560,
          left: 173,
          width: 734,
          height: 1100,
          objectFit: "contain",
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0.4 * fps, 8.4 * fps], [1.06, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Gradasi bawah"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          background: `linear-gradient(to bottom, rgba(13,18,28,0) 0%, ${colors.ink} 45%)`,
        }}
      />
      <Wordmark
        name="Logo"
        size={64}
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          justifyContent: "center",
          opacity: interpolate(frame, [0.1 * fps, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0.1 * fps, 0.6 * fps],
            ["0px 30px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      />
      <Interactive.Div
        name="Headline lobi virtual"
        style={{
          position: "absolute",
          top: 360,
          left: 80,
          right: 80,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: colors.white,
          opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {en ? (
          <>
            Your <span style={{ color: colors.signal }}>virtual</span> lobby.
          </>
        ) : (
          <>
            Lobi <span style={{ color: colors.signal }}>virtual</span> Anda.
          </>
        )}
      </Interactive.Div>
      <Interactive.Div
        name="Chip concierge 24 jam"
        style={{
          position: "absolute",
          top: 1250,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [5.5 * fps, 5.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [5.5 * fps, 6 * fps],
            ["0px 30px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "22px 38px",
            borderRadius: 999,
            backgroundColor: colors.signal,
            color: colors.signalInk,
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 40,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.signalInk,
              opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.4,
            }}
          />
          {L("AI Concierge siaga 24 jam", "AI Concierge on duty 24/7")}
        </div>
      </Interactive.Div>
      <LimeFlash name="Flash lime" />
      <Audio name="Ding lift" src={sfx.ding} volume={0.5} />
      {en ? (
        <EnVo scene="p3" layout="vertical" />
      ) : (
        <>
      <Audio
        name="VO kenalkan"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo/s3a.wav")}
      />
      <Audio
        name="VO website apartemen"
        from={3.6 * fps}
        src={staticFile("ai-apartment/vo/s3b.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 3"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Kenalkan FTS Apartment AI.",
            startMs: 200,
            endMs: 3600,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Website apartemen dengan AI Concierge 24 jam.",
            startMs: 3600,
            endMs: 8390,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
        </>
      )}
    </>
  );
};

export const RevealScene = Interactive.create({
  Component: RevealSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
