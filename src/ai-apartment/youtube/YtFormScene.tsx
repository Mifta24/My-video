import { Audio } from "@remotion/media";
import {
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BasicCaptions } from "../basic-captions";
import { RequestForm } from "../elements/RequestForm";
import { colors, fonts, sfx } from "../theme";

const bannerStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: 20,
  padding: "24px 34px",
  borderRadius: 24,
  border: `2px solid ${colors.signal}`,
  fontFamily: fonts.heading,
  color: colors.white,
} as const;

// YouTube Scene 6: form permintaan sewa 5 langkah + diskon menginap panjang.
const YtFormSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Interactive.Div
        name="Headline permintaan sewa"
        style={{
          position: "absolute",
          top: 90,
          left: 96,
          width: 820,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
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
          LANTAI 05 · RENCANAKAN MENGINAP
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: colors.white,
          }}
        >
          Permintaan sewa,{" "}
          <span style={{ color: colors.signal }}>5 langkah.</span>
        </div>
      </Interactive.Div>
      <Interactive.Div
        name="Banner diskon 7 malam"
        style={{
          ...bannerStyle,
          position: "absolute",
          top: 430,
          left: 96,
          opacity: interpolate(frame, [12.9 * fps, 13.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [12.9 * fps, 13.4 * fps],
            ["-30px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 64, color: colors.signal }}>
          Hemat 10%
        </span>
        <span style={{ fontSize: 38 }}>mulai 7 malam</span>
      </Interactive.Div>
      <Interactive.Div
        name="Banner diskon 28 malam"
        style={{
          ...bannerStyle,
          position: "absolute",
          top: 580,
          left: 96,
          opacity: interpolate(frame, [15 * fps, 15.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [15 * fps, 15.5 * fps],
            ["-30px 0px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 64, color: colors.signal }}>
          Hemat 25%
        </span>
        <span style={{ fontSize: 38 }}>mulai 28 malam</span>
      </Interactive.Div>
      <Interactive.Div
        name="Catatan bukan kontrak"
        style={{
          position: "absolute",
          top: 750,
          left: 96,
          width: 800,
          fontFamily: fonts.heading,
          fontSize: 36,
          lineHeight: 1.35,
          color: colors.muted,
          opacity: interpolate(frame, [18.1 * fps, 18.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Ini permintaan sewa, bukan kontrak.{" "}
        <span style={{ color: colors.white }}>Tim leasing yang mengonfirmasi.</span>
      </Interactive.Div>
      <RequestForm
        name="Form permintaan sewa"
        from={2.6 * fps}
        stepTimes={[3.9, 4.8, 5.7, 6.6]}
        sentAt={15.5}
        style={{
          position: "absolute",
          top: 70,
          left: 1000,
          width: 920,
          scale: 0.86,
          transformOrigin: "top left",
          opacity: interpolate(frame, [2.6 * fps, 2.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Audio name="Klik langkah 2" from={6.5 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Klik langkah 3" from={7.4 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Klik langkah 4" from={8.3 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Klik langkah 5" from={9.2 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Ding terkirim" from={18.1 * fps} src={sfx.ding} volume={0.4} />
      <Audio
        name="VO s6a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s6a.mp3")}
      />
      <Audio
        name="VO s6b"
        from={4.3 * fps}
        src={staticFile("ai-apartment/vo-yt/s6b.mp3")}
      />
      <Audio
        name="VO s6c"
        from={10.4 * fps}
        src={staticFile("ai-apartment/vo-yt/s6c.mp3")}
      />
      <Audio
        name="VO s6d"
        from={18 * fps}
        src={staticFile("ai-apartment/vo-yt/s6d.mp3")}
      />
      <BasicCaptions
        name="Subtitle s6"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Kalau tertarik, tamu bisa langsung",
            startMs: 300,
            endMs: 2577,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " mengisi permintaan sewa.",
            startMs: 2577,
            endMs: 4400,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Lima langkah: tanggal, penghuni, unit,",
            startMs: 4400,
            endMs: 8273,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " data diri, ringkasan.",
            startMs: 8273,
            endMs: 10500,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Diskon menginap panjang sudah tertera:",
            startMs: 10500,
            endMs: 12866,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " 10% mulai 7 malam,",
            startMs: 12866,
            endMs: 15009,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " 25% mulai 28 malam.",
            startMs: 15009,
            endMs: 18100,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Tim leasing yang mengonfirmasi",
            startMs: 18100,
            endMs: 19596,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " dan menghubungi tamu.",
            startMs: 19596,
            endMs: 21380,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const YtFormScene = Interactive.create({
  Component: YtFormSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
