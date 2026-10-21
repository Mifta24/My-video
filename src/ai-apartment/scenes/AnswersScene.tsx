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
import { ChatPair } from "../elements/ChatPair";
import { colors, fonts, sfx } from "../theme";

// Detik saat pasangan chat EN dan JA mulai (badge bahasa ikut berganti).
const enStart = 2.7;
const jaStart = 5.2;

// Scene 4 (14–19,5 dtk): AI menjawab dalam ID, EN, JA.
const AnswersSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useL();
  const en = useLang() === "en";
  const t = frame / fps;
  const activeLang = t >= jaStart ? "JA" : t >= enStart ? "EN" : "ID";

  return (
    <>
      <Interactive.Div
        name="Headline unit tarif aturan"
        style={{
          position: "absolute",
          top: 180,
          left: 80,
          right: 80,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: colors.white,
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {L("Unit. Tarif.", "Units. Rates.")}
        <br />
        <span style={{ color: colors.signal }}>
          {L("Aturan gedung.", "House rules.")}
        </span>
      </Interactive.Div>
      <Interactive.Div
        name="Badge bahasa"
        style={{
          position: "absolute",
          top: 430,
          left: 80,
          display: "flex",
          gap: 18,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 44,
        }}
      >
        {["ID", "EN", "JA"].map((lang) => (
          <div
            key={lang}
            style={{
              padding: "14px 30px",
              borderRadius: 999,
              border: `2px solid ${lang === activeLang ? colors.signal : colors.inkLine}`,
              backgroundColor:
                lang === activeLang ? colors.signal : "transparent",
              color: lang === activeLang ? colors.signalInk : colors.muted,
            }}
          >
            {lang}
          </div>
        ))}
      </Interactive.Div>
      <Interactive.Div
        name="Kartu chat"
        style={{
          position: "absolute",
          top: 580,
          left: 60,
          right: 60,
          height: 800,
          borderRadius: 48,
          backgroundColor: "#111826",
          border: `2px solid ${colors.inkLine}`,
          overflow: "hidden",
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0, 0.5 * fps],
            ["0px 60px", "0px 0px"],
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
            gap: 20,
            padding: "36px 44px",
            borderBottom: `2px solid ${colors.inkLine}`,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.signal,
            }}
          />
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 46,
              color: colors.white,
            }}
          >
            AI Concierge
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: fonts.mono,
              fontSize: 28,
              color: colors.muted,
            }}
          >
            {L("Online · 24 jam", "Online · 24/7")}
          </div>
        </div>
      </Interactive.Div>
      {/* Jawaban sementara disusun dari data website demo.
          Ganti dengan jawaban ASLI hasil rekaman AI Concierge. */}
      <ChatPair
        name="Chat ID"
        from={0.3 * fps}
        durationInFrames={2.4 * fps}
        question="Ada gym 24 jam?"
        gloss={en ? "Is there a 24-hour gym?" : ""}
        answer="Ada. Gym di lantai 5 buka 24 jam, pakai kartu akses penghuni."
        answerAt={0.55}
        style={{
          position: "absolute",
          top: 780,
          left: 110,
          right: 110,
          width: "auto",
        }}
      />
      <ChatPair
        name="Chat EN"
        from={enStart * fps}
        durationInFrames={2.5 * fps}
        question="How much is the monthly rent?"
        answer="Monthly rent starts from IDR 13,500,000."
        answerAt={0.55}
        style={{
          position: "absolute",
          top: 780,
          left: 110,
          right: 110,
          width: "auto",
        }}
      />
      <ChatPair
        name="Chat JA"
        from={jaStart * fps}
        durationInFrames={2.7 * fps}
        question="空港送迎はありますか？"
        gloss={en ? "Is there an airport shuttle?" : ""}
        answer="はい。スカルノ・ハッタ空港から片道Rp450.000です。"
        answerAt={0.55}
        style={{
          position: "absolute",
          top: 780,
          left: 110,
          right: 110,
          width: "auto",
        }}
      />
      <Audio
        name="Tik jawaban ID"
        from={0.9 * fps}
        src={sfx.click}
        volume={0.5}
      />
      <Audio
        name="Tik jawaban EN"
        from={3.3 * fps}
        src={sfx.click}
        volume={0.5}
      />
      <Audio
        name="Tik jawaban JA"
        from={5.8 * fps}
        src={sfx.click}
        volume={0.5}
      />
      {en ? (
        <EnVo scene="p4" layout="vertical" />
      ) : (
        <>
      <Audio
        name="VO ia hafal unit"
        from={0.1 * fps}
        src={staticFile("ai-apartment/vo/s4a.wav")}
      />
      <Audio
        name="VO dijawab dalam"
        from={3.8 * fps}
        src={staticFile("ai-apartment/vo/s4b.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 4"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Ia hafal unit, tarif, dan aturan gedung.",
            startMs: 100,
            endMs: 3800,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Dijawab dalam Indonesia, English, atau Jepang.",
            startMs: 3800,
            endMs: 7890,
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

export const AnswersScene = Interactive.create({
  Component: AnswersSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
