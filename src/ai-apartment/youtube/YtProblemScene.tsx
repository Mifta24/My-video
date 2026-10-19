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
import { Cursor } from "../elements/Cursor";
import { NightClock } from "../elements/NightChat";
import { SiteMockup } from "../elements/SiteMockup";
import { fonts } from "../theme";

const chipStyle = {
  position: "absolute",
  padding: "18px 30px",
  borderRadius: 999,
  backgroundColor: "#2c2e33",
  border: "2px solid #3d4046",
  color: "#eceef1",
  fontFamily: fonts.heading,
  fontWeight: 500,
  fontSize: 38,
} as const;

// YouTube Scene 1: jam 02:00, calon penyewa membuka website biasa dan bingung.
const YtProblemSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Pertanyaan meredup saat VO "Tapi tidak ada yang bisa ditanya."
  const dimAfter = interpolate(frame, [10 * fps, 10.6 * fps], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <NightClock
        name="Jam 02:00"
        fromMinutes={120}
        toMinutes={120}
        runStart={0}
        runEnd={1}
        style={{
          position: "absolute",
          top: 330,
          left: 96,
          fontSize: 230,
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <SiteMockup
        name="Website biasa"
        highlightTimes={[-1, -1, -1]}
        style={{
          position: "absolute",
          top: 150,
          left: 820,
          width: 1000,
          opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [2 * fps, 2.8 * fps],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      />
      <Interactive.Div
        name="Tanya sewa bulanan"
        style={{
          ...chipStyle,
          top: 740,
          left: 820,
          opacity:
            interpolate(frame, [5.6 * fps, 5.9 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * dimAfter,
        }}
      >
        Sewa bulanan?
      </Interactive.Div>
      <Interactive.Div
        name="Tanya deposit"
        style={{
          ...chipStyle,
          top: 740,
          left: 1170,
          opacity:
            interpolate(frame, [7.4 * fps, 7.7 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * dimAfter,
        }}
      >
        Deposit?
      </Interactive.Div>
      <Interactive.Div
        name="Tanya fasilitas"
        style={{
          ...chipStyle,
          top: 740,
          left: 1410,
          opacity:
            interpolate(frame, [8.6 * fps, 8.9 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * dimAfter,
        }}
      >
        Fasilitas?
      </Interactive.Div>
      <Cursor
        name="Kursor bingung"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: interpolate(frame, [2.6 * fps, 2.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [2.6 * fps, 4 * fps, 5.6 * fps, 7.2 * fps, 8.5 * fps, 10 * fps],
            [
              "1300px 640px",
              "1150px 380px",
              "1450px 330px",
              "1530px 470px",
              "1430px 610px",
              "1280px 560px",
            ],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.55, 1),
            },
          ),
        }}
      />
      <Audio
        name="VO s1a"
        from={0.5 * fps}
        src={staticFile("ai-apartment/vo-yt/s1a.mp3")}
      />
      <Audio
        name="VO s1b"
        from={4.9 * fps}
        src={staticFile("ai-apartment/vo-yt/s1b.mp3")}
      />
      <Audio
        name="VO s1c"
        from={9.9 * fps}
        src={staticFile("ai-apartment/vo-yt/s1c.mp3")}
      />
      <BasicCaptions
        name="Subtitle s1"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Jam dua pagi, calon penyewa",
            startMs: 600,
            endMs: 2709,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " membuka website apartemen Anda.",
            startMs: 2709,
            endMs: 5000,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Dia ingin tahu harga sewa bulanan,",
            startMs: 5000,
            endMs: 7500,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " deposit, dan fasilitas.",
            startMs: 7500,
            endMs: 10000,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Tapi tidak ada yang bisa ditanya.",
            startMs: 10000,
            endMs: 12580,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const YtProblemScene = Interactive.create({
  Component: YtProblemSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
