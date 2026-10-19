import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { colors, fonts } from "../theme";

type ChatPairProps = {
  readonly question: string;
  readonly answer: string;
  // Detik (relatif ke awal elemen) saat jawaban AI muncul.
  readonly answerAt: number;
  readonly style?: React.CSSProperties;
};

// Satu pasang tanya-jawab: bubble tamu, indikator mengetik, lalu jawaban AI.
const ChatPairInner: React.FC<ChatPairProps> = ({
  question,
  answer,
  answerAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const typing = t > 0.2 && t < answerAt;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "82%",
          padding: "26px 34px",
          borderRadius: "36px 36px 8px 36px",
          backgroundColor: colors.signal,
          color: colors.signalInk,
          fontFamily: fonts.heading,
          fontWeight: 500,
          fontSize: 50,
          lineHeight: 1.2,
          opacity: interpolate(t, [0, 0.2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(t, [0, 0.3], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {question}
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "88%",
          padding: "26px 34px",
          borderRadius: "36px 36px 36px 8px",
          backgroundColor: colors.ink2,
          border: `2px solid ${colors.inkLine}`,
          color: colors.white,
          fontFamily: fonts.heading,
          fontSize: 46,
          lineHeight: 1.3,
          opacity: interpolate(t, [0.2, 0.35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {typing ? (
          <span
            style={{
              fontFamily: fonts.mono,
              color: colors.muted,
              letterSpacing: "0.3em",
            }}
          >
            {"•••".slice(0, 1 + (Math.floor(frame / 4) % 3))}
          </span>
        ) : (
          <span
            style={{
              opacity: interpolate(t, [answerAt, answerAt + 0.15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {answer}
          </span>
        )}
      </div>
    </div>
  );
};

const chatPairSchema = {
  question: {
    type: "string",
    default: "Ada gym 24 jam?",
    description: "Pertanyaan tamu",
  },
  answer: {
    type: "string",
    default: "Ada. Gym di lantai 5 buka 24 jam dengan kartu akses penghuni.",
    description: "Jawaban AI (pakai jawaban asli hasil rekaman)",
  },
  answerAt: {
    type: "number",
    min: 0,
    step: 0.05,
    default: 0.55,
    description: "Jawaban muncul (detik)",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const ChatPair = Interactive.create({
  Component: ChatPairInner,
  layout: "none",
  schema: chatPairSchema,
});
