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
import { EnVo } from "../elements/EnVo";
import { useL, useLang } from "../i18n";
import { IncomingBubble, NightClock } from "../elements/NightChat";
import { sfx } from "../theme";

// Scene 1 (0–5 dtk): jam 02:00, pesan calon penyewa masuk.
const ProblemSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";

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
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <IncomingBubble
        name="Bubble chat"
        status=""
        style={{
          position: "absolute",
          top: 760,
          left: 100,
          right: 100,
          opacity: interpolate(frame, [1 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [1 * fps, 1.5 * fps],
            ["0px 60px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {L("Sewa bulanan berapa?", "How much is the monthly rent?")}
      </IncomingBubble>
      <Audio
        name="Ping notifikasi"
        from={1 * fps}
        src={sfx.ding}
        volume={0.35}
      />
      {en ? (
        <EnVo scene="p1" layout="vertical" />
      ) : (
        <>
      <Audio
        name="VO jam dua pagi"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo/s1a.wav")}
      />
      <Audio
        name="VO siapa yang jawab"
        from={4 * fps}
        src={staticFile("ai-apartment/vo/s1b.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 1"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Jam dua pagi, calon penyewa tanya sewa bulanan.",
            startMs: 200,
            endMs: 3900,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Siapa yang jawab?",
            startMs: 3900,
            endMs: 5590,
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

export const ProblemScene = Interactive.create({
  Component: ProblemSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
