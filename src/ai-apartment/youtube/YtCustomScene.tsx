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
import { Wordmark } from "../elements/Wordmark";
import { colors, fonts } from "../theme";

const rowTimes = [6.3, 6.9, 7.6];

// YouTube Scene 7: demo di kiri, "gedung Anda" di kanan.
// Kartu kanan sengaja generik. Ganti dengan logo/data gedung klien bila sudah ada.
const YtCustomSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";
  const t = frame / fps;

  return (
    <>
      <Interactive.Div
        name="Headline disesuaikan"
        style={{
          position: "absolute",
          top: 70,
          left: 96,
          right: 96,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: "-0.02em",
          color: colors.white,
          opacity: interpolate(frame, [2.9 * fps, 3.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {en ? (
          <>
            Tailored for{" "}
            <span style={{ color: colors.signal }}>your building.</span>
          </>
        ) : (
          <>
            Disesuaikan untuk{" "}
            <span style={{ color: colors.signal }}>gedung Anda.</span>
          </>
        )}
      </Interactive.Div>
      <Interactive.Div
        name="Kartu demo"
        style={{
          position: "absolute",
          top: 220,
          left: 96,
          width: 780,
          height: 640,
          borderRadius: 32,
          overflow: "hidden",
          backgroundColor: colors.ink2,
          border: `2px solid ${colors.inkLine}`,
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Img
          src={staticFile("ai-apartment/lobby.jpg")}
          style={{ width: "100%", height: 400, objectFit: "cover", opacity: 0.8 }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: colors.signal,
            color: colors.signalInk,
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 26,
          }}
        >
          DEMO
        </div>
        <Wordmark name="Logo demo" size={52} style={{ padding: "60px 44px" }} />
      </Interactive.Div>
      <Interactive.Div
        name="Panah"
        style={{
          position: "absolute",
          top: 480,
          left: 905,
          fontFamily: fonts.heading,
          fontSize: 90,
          color: colors.signal,
          opacity: interpolate(frame, [2.9 * fps, 3.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        →
      </Interactive.Div>
      <Interactive.Div
        name="Kartu gedung Anda"
        style={{
          position: "absolute",
          top: 220,
          left: 1044,
          width: 780,
          height: 640,
          borderRadius: 32,
          border: `3px dashed ${colors.signal}`,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          padding: 52,
          opacity: interpolate(frame, [3 * fps, 3.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [3 * fps, 3.6 * fps], ["40px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              border: `3px dashed ${colors.muted}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.muted,
            }}
          >
            LOGO
          </div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 56,
              color: colors.white,
            }}
          >
            {L("Gedung Anda", "Your building")}
          </div>
        </div>
        {L(
          ["Unit", "Tarif", "Aturan gedung"],
          ["Units", "Rates", "House rules"],
        ).map((row, i) => {
          const on = t >= rowTimes[i];
          return (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "26px 32px",
                borderRadius: 22,
                backgroundColor: on ? colors.ink2 : "transparent",
                border: `2px solid ${on ? colors.signal : colors.inkLine}`,
                fontFamily: fonts.heading,
                fontWeight: 500,
                fontSize: 44,
                color: on ? colors.white : colors.muted,
              }}
            >
              <span style={{ color: on ? colors.signal : colors.inkLine }}>✓</span>
              {row}
            </div>
          );
        })}
      </Interactive.Div>
      {en ? (
        <EnVo scene="y7" layout="horizontal" />
      ) : (
        <>
      <Audio
        name="VO s7a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s7a.mp3")}
      />
      <Audio
        name="VO s7b"
        from={2.8 * fps}
        src={staticFile("ai-apartment/vo-yt/s7b.mp3")}
      />
      <BasicCaptions
        name="Subtitle s7"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Yang Anda lihat tadi adalah demo.",
            startMs: 300,
            endMs: 2900,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Untuk gedung Anda, isinya kami sesuaikan:",
            startMs: 2900,
            endMs: 6259,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " unit, tarif, dan aturan gedung.",
            startMs: 6259,
            endMs: 9680,
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

export const YtCustomScene = Interactive.create({
  Component: YtCustomSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
