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
import { ChatPair } from "../elements/ChatPair";
import { colors, fonts, sfx } from "../theme";

// Detik saat pasangan chat EN dan JA mulai (badge bahasa ikut berganti).
const enStart = 7.3;
const jaStart = 9.3;
const topicTimes = [11.6, 12.3, 13.3];

// YouTube Scene 5: chat AI Concierge dalam ID, EN, JA.
const YtChatSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const activeLang = t >= jaStart ? "JA" : t >= enStart ? "EN" : "ID";

  return (
    <>
      <Interactive.Div
        name="Headline tanya apa saja"
        style={{
          position: "absolute",
          top: 110,
          left: 96,
          width: 700,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 110,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: colors.white,
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Tanya <span style={{ color: colors.signal }}>apa saja.</span>
      </Interactive.Div>
      <Interactive.Div
        name="Badge bahasa"
        style={{
          position: "absolute",
          top: 370,
          left: 96,
          display: "flex",
          gap: 16,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 40,
        }}
      >
        {["ID", "EN", "JA"].map((lang) => (
          <div
            key={lang}
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              border: `2px solid ${lang === activeLang ? colors.signal : colors.inkLine}`,
              backgroundColor: lang === activeLang ? colors.signal : "transparent",
              color: lang === activeLang ? colors.signalInk : colors.muted,
            }}
          >
            {lang}
          </div>
        ))}
      </Interactive.Div>
      <Interactive.Div
        name="Topik"
        style={{
          position: "absolute",
          top: 500,
          left: 96,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {["Tarif", "Aturan gedung", "Jam check-in"].map((topic, i) => (
          <div
            key={topic}
            style={{
              alignSelf: "flex-start",
              padding: "16px 30px",
              borderRadius: 999,
              border: `2px solid ${colors.inkLine}`,
              color: colors.white,
              fontFamily: fonts.heading,
              fontWeight: 500,
              fontSize: 38,
              opacity: interpolate(t, [topicTimes[i], topicTimes[i] + 0.3], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(
                t,
                [topicTimes[i], topicTimes[i] + 0.4],
                ["-30px 0px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            ✓ {topic}
          </div>
        ))}
      </Interactive.Div>
      <Interactive.Div
        name="Kartu chat"
        style={{
          position: "absolute",
          top: 70,
          left: 840,
          width: 984,
          height: 830,
          borderRadius: 40,
          backgroundColor: "#111826",
          border: `2px solid ${colors.inkLine}`,
          opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "30px 40px",
            borderBottom: `2px solid ${colors.inkLine}`,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.signal,
            }}
          />
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: 40,
              color: colors.white,
            }}
          >
            AI Concierge
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: fonts.mono,
              fontSize: 24,
              color: colors.muted,
            }}
          >
            Online · 24 jam
          </div>
        </div>
      </Interactive.Div>
      {/* Jawaban sementara disusun dari data website demo.
          Ganti dengan jawaban ASLI hasil rekaman AI Concierge. */}
      <ChatPair
        name="Chat ID"
        from={3.2 * fps}
        question="Gym buka jam berapa?"
        answer="Gym di lantai 5 buka 24 jam dengan kartu akses penghuni."
        answerAt={0.7}
        fontSize={34}
        style={{ position: "absolute", top: 200, left: 880, width: 904 }}
      />
      <ChatPair
        name="Chat EN"
        from={enStart * fps}
        question="How much is the monthly rent?"
        answer="Monthly rent starts from IDR 13,500,000."
        answerAt={0.7}
        fontSize={34}
        style={{ position: "absolute", top: 430, left: 880, width: 904 }}
      />
      <ChatPair
        name="Chat JA"
        from={jaStart * fps}
        question="空港送迎はありますか？"
        answer="はい。スカルノ・ハッタ空港から片道Rp450.000です。"
        answerAt={0.7}
        fontSize={34}
        style={{ position: "absolute", top: 650, left: 880, width: 904 }}
      />
      <Audio name="Tik jawaban ID" from={3.9 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Tik jawaban EN" from={8 * fps} src={sfx.click} volume={0.5} />
      <Audio name="Tik jawaban JA" from={10 * fps} src={sfx.click} volume={0.5} />
      <Audio
        name="VO s5a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s5a.mp3")}
      />
      <Audio
        name="VO s5b"
        from={3.1 * fps}
        src={staticFile("ai-apartment/vo-yt/s5b.mp3")}
      />
      <Audio
        name="VO s5c"
        from={7.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s5c.mp3")}
      />
      <Audio
        name="VO s5d"
        from={11.5 * fps}
        src={staticFile("ai-apartment/vo-yt/s5d.mp3")}
      />
      <BasicCaptions
        name="Subtitle s5"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Tanya apa saja ke AI Concierge.",
            startMs: 300,
            endMs: 3200,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Gym buka jam berapa?",
            startMs: 3200,
            endMs: 5282,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Ada antar-jemput bandara?",
            startMs: 5282,
            endMs: 7300,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Tanya dalam English atau Jepang pun",
            startMs: 7300,
            endMs: 9253,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " dijawab dalam bahasa yang sama.",
            startMs: 9253,
            endMs: 11600,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Tarif, aturan gedung, jam check-in, semuanya.",
            startMs: 11600,
            endMs: 16180,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const YtChatScene = Interactive.create({
  Component: YtChatSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
