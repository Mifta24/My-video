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

// YouTube Scene 8: CTA. Logo kiri, URL dan tombol, foto concierge di latar.
const YtCtaSceneInner = () => {
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
          opacity: 0.22,
        }}
      />
      <Img
        name="Concierge"
        src={staticFile("ai-apartment/concierge-welcoming.png")}
        style={{
          position: "absolute",
          right: 140,
          top: 60,
          height: 1150,
          opacity: 0.9,
          scale: interpolate(frame, [0, 9 * fps], [1.04, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Overlay navy"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, ${colors.ink} 40%, rgba(13,18,28,0.35) 100%)`,
        }}
      />
      <Wordmark
        name="Logo CTA"
        size={96}
        style={{
          position: "absolute",
          top: 200,
          left: 96,
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="URL demo"
        style={{
          position: "absolute",
          top: 430,
          left: 96,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: interpolate(frame, [0.7 * fps, 1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ fontFamily: fonts.heading, fontSize: 40, color: colors.muted }}>
          {L("Coba demo:", "Try the demo:")}
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 60,
            color: colors.white,
          }}
        >
          apartment-ai.fts-tech.co.id
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Tombol coba demo"
        style={{
          position: "absolute",
          top: 650,
          left: 96,
          padding: "30px 56px",
          borderRadius: 999,
          backgroundColor: colors.signal,
          color: colors.signalInk,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 48,
          opacity: interpolate(frame, [1.1 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(
            frame,
            [1.1 * fps, 1.6 * fps, 6 * fps, 6.4 * fps, 6.8 * fps],
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
      {/* TODO: ganti dengan kontak Miftah (WhatsApp/email) dari script. */}
      <Interactive.Div
        name="Tombol hubungi kami"
        style={{
          position: "absolute",
          top: 650,
          left: 680,
          padding: "28px 50px",
          borderRadius: 999,
          border: `3px solid ${colors.white}`,
          color: colors.white,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 48,
          opacity: interpolate(frame, [4.6 * fps, 4.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {L("Hubungi kami", "Get in touch")}
      </Interactive.Div>
      <LimeFlash name="Flash lime CTA" />
      {en ? (
        <EnVo scene="y8" layout="horizontal" />
      ) : (
        <>
      <Audio
        name="VO s8a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s8a.mp3")}
      />
      <Audio
        name="VO s8b"
        from={3.5 * fps}
        src={staticFile("ai-apartment/vo-yt/s8b.mp3")}
      />
      <BasicCaptions
        name="Subtitle s8"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Coba demonya sekarang, link di deskripsi.",
            startMs: 300,
            endMs: 3600,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Mau untuk gedung Anda? Hubungi kami.",
            startMs: 3600,
            endMs: 9180,
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

export const YtCtaScene = Interactive.create({
  Component: YtCtaSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
