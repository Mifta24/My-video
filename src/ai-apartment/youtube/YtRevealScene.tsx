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
import { FloorDirectory } from "../elements/FloorDirectory";
import { LimeFlash } from "../elements/LimeFlash";
import { Wordmark } from "../elements/Wordmark";
import { colors, fonts, sfx } from "../theme";

// YouTube Scene 3: flash lime, logo, lalu lobi virtual dan direktori gedung.
const YtRevealSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Wordmark
        name="Logo besar"
        from={0.3 * fps}
        durationInFrames={3.8 * fps}
        size={110}
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          justifyContent: "center",
          opacity: interpolate(
            frame,
            [0.4 * fps, 0.7 * fps, 3.7 * fps, 4.1 * fps],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          scale: interpolate(frame, [0.4 * fps, 4.1 * fps], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Foto lobi dan concierge"
        from={4 * fps}
        style={{
          position: "absolute",
          top: 90,
          left: 1000,
          width: 824,
          height: 800,
          borderRadius: 32,
          overflow: "hidden",
          opacity: interpolate(frame, [4 * fps, 4.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img
          src={staticFile("ai-apartment/lobby.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale: interpolate(frame, [4 * fps, 15 * fps], [1.1, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, ${colors.ink} 0%, rgba(13,18,28,0.2) 55%)`,
          }}
        />
        <Img
          src={staticFile("ai-apartment/concierge-welcoming.png")}
          style={{
            position: "absolute",
            bottom: -40,
            left: 180,
            height: 760,
          }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Headline lobi virtual"
        from={4 * fps}
        durationInFrames={5.3 * fps}
        style={{
          position: "absolute",
          top: 200,
          left: 96,
          width: 840,
          display: "flex",
          flexDirection: "column",
          gap: 36,
          opacity: interpolate(
            frame,
            [4.2 * fps, 4.6 * fps, 9 * fps, 9.3 * fps],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            letterSpacing: "0.14em",
            color: colors.muted,
          }}
        >
          FTS APARTMENT AI · JAKARTA SELATAN
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: colors.white,
          }}
        >
          Selamat datang di lobi{" "}
          <span style={{ color: colors.signal }}>virtual</span> Anda.
        </div>
        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 32px",
            borderRadius: 999,
            backgroundColor: colors.signal,
            color: colors.signalInk,
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 34,
            opacity: interpolate(frame, [7.2 * fps, 7.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          ● AI Concierge siaga 24 jam
        </div>
      </Interactive.Div>
      <FloorDirectory
        name="Direktori gedung"
        from={9.3 * fps}
        floorTimes={[2.6, 3.1, 3.6, 4.1, 4.6]}
        style={{
          position: "absolute",
          top: 90,
          left: 96,
          width: 820,
          opacity: interpolate(frame, [9.3 * fps, 9.7 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [9.3 * fps, 9.9 * fps],
            ["-40px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      />
      <LimeFlash name="Flash lime" from={0.3 * fps} />
      <Audio name="Ding produk" from={0.3 * fps} src={sfx.ding} volume={0.5} />
      <Audio name="Ding lift" from={11.9 * fps} src={sfx.ding} volume={0.4} />
      <Audio
        name="VO s3a"
        from={0.4 * fps}
        src={staticFile("ai-apartment/vo-yt/s3a.mp3")}
      />
      <Audio
        name="VO s3b"
        from={4 * fps}
        src={staticFile("ai-apartment/vo-yt/s3b.mp3")}
      />
      <Audio
        name="VO s3c"
        from={9.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s3c.mp3")}
      />
      <Audio
        name="VO s3d"
        from={11.6 * fps}
        src={staticFile("ai-apartment/vo-yt/s3d.mp3")}
      />
      <BasicCaptions
        name="Subtitle s3"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Kenalkan, FTS Apartment AI.",
            startMs: 500,
            endMs: 4100,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Website apartemen yang punya AI Concierge,",
            startMs: 4100,
            endMs: 7203,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " siaga 24 jam.",
            startMs: 7203,
            endMs: 9296,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Pengunjung tidak scroll halaman.",
            startMs: 9296,
            endMs: 11700,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Mereka naik lift, lantai demi lantai.",
            startMs: 11700,
            endMs: 15080,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const YtRevealScene = Interactive.create({
  Component: YtRevealSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
