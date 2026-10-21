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
import { colors, fonts } from "../theme";

// Scene 2 (5–9 dtk): pesan tidak dibalas, jam berjalan cepat sampai pagi.
const UnansweredSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";

  return (
    <>
      <Interactive.Div
        name="Label ilustrasi"
        style={{
          position: "absolute",
          top: 170,
          right: 90,
          fontFamily: fonts.mono,
          fontSize: 28,
          letterSpacing: "0.14em",
          color: colors.grayText,
          opacity: 0.7,
        }}
        hidden
      >
        {L("ILUSTRASI", "ILLUSTRATION")}
      </Interactive.Div>
      <NightClock
        name="Jam berjalan"
        fromMinutes={120}
        toMinutes={540}
        runStart={0.3}
        runEnd={3}
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      />
      <IncomingBubble
        name="Bubble belum dibalas"
        status={L("✓ Belum dibalas", "✓ Unanswered")}
        style={{
          position: "absolute",
          top: 760,
          left: 100,
          right: 100,
          opacity: interpolate(frame, [3.6 * fps, 4.2 * fps], [1, 0.12], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {L("Sewa bulanan berapa?", "How much is the monthly rent?")}
      </IncomingBubble>
      <Interactive.Div
        name="Teks dibalas besok"
        style={{
          position: "absolute",
          top: 1150,
          left: 100,
          right: 100,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 80,
          lineHeight: 1.1,
          color: "#eceef1",
          opacity: interpolate(frame, [2 * fps, 2.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [2 * fps, 2.4 * fps],
            ["0px 30px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {L("Dibalas besok.", "Answered tomorrow.")}
      </Interactive.Div>
      <Interactive.Div
        name="Teks penyewa pergi"
        style={{
          position: "absolute",
          top: 1260,
          left: 100,
          right: 100,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 80,
          lineHeight: 1.1,
          color: colors.grayText,
          opacity: interpolate(frame, [3.9 * fps, 4.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [3.9 * fps, 4.3 * fps],
            ["0px 30px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {L("Penyewa sudah pergi.", "The tenant is gone.")}
      </Interactive.Div>
      {en ? (
        <EnVo scene="p2" layout="vertical" />
      ) : (
        <>
      <Audio
        name="VO biasanya"
        src={staticFile("ai-apartment/vo/s2a.wav")}
      />
      <Audio
        name="VO penyewa pindah"
        from={3.9 * fps}
        src={staticFile("ai-apartment/vo/s2b.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 2"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Biasanya? Pesan menggantung sampai pagi.",
            startMs: 0,
            endMs: 3850,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Penyewa sudah pindah.",
            startMs: 3850,
            endMs: 5690,
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

export const UnansweredScene = Interactive.create({
  Component: UnansweredSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
