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
import { colors, fonts } from "../theme";

// Scene 6 (26–30 dtk): CTA. Logo, URL demo, tombol "Coba demonya".
const CtaSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";

  return (
    <>
      <Img
        name="Foto lobi"
        src={staticFile("ai-apartment/lobby.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.18,
          scale: interpolate(frame, [0, 4.5 * fps], [1.08, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Headline CTA"
        style={{
          position: "absolute",
          top: 360,
          left: 80,
          right: 80,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 100,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: colors.white,
          opacity: interpolate(frame, [0.15 * fps, 0.45 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {en ? (
          <>
            Want this for{" "}
            <span style={{ color: colors.signal }}>your building?</span>
          </>
        ) : (
          <>
            Mau gedung Anda{" "}
            <span style={{ color: colors.signal }}>punya ini?</span>
          </>
        )}
      </Interactive.Div>
      <Wordmark
        name="Logo CTA"
        size={78}
        style={{
          position: "absolute",
          top: 790,
          left: 0,
          right: 0,
          justifyContent: "center",
          opacity: interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0.5 * fps, 1.1 * fps], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="URL demo"
        style={{
          position: "absolute",
          top: 1030,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 46,
          color: colors.white,
          opacity: interpolate(frame, [0.9 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        apartment-ai.fts-tech.co.id
      </Interactive.Div>
      <Interactive.Div
        name="Tombol coba demo"
        style={{
          position: "absolute",
          top: 1200,
          left: 190,
          right: 190,
          padding: "36px 0",
          borderRadius: 999,
          textAlign: "center",
          backgroundColor: colors.signal,
          color: colors.signalInk,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 60,
          opacity: interpolate(frame, [1.3 * fps, 1.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [1.3 * fps, 1.8 * fps, 2.2 * fps, 2.6 * fps, 3 * fps],
            [0.85, 1, 1, 1.05, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            },
          ),
        }}
      >
        {L("Coba demonya →", "Try the demo →")}
      </Interactive.Div>
      <LimeFlash name="Flash lime CTA" />
      {en ? (
        <EnVo scene="p6" layout="vertical" />
      ) : (
        <>
      <Audio
        name="VO mau gedung Anda"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo/s6a.wav")}
      />
      <Audio
        name="VO coba demonya"
        from={2.2 * fps}
        src={staticFile("ai-apartment/vo/s6b.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 6"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Mau gedung Anda punya ini?",
            startMs: 200,
            endMs: 2200,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Coba demonya.",
            startMs: 2200,
            endMs: 4490,
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

export const CtaScene = Interactive.create({
  Component: CtaSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
