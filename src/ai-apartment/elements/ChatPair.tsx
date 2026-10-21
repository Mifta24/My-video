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
  // Terjemahan kecil di bawah pertanyaan (untuk video versi Inggris).
  readonly gloss?: string;
  readonly answer: string;
  // Detik (relatif ke awal elemen) saat jawaban AI muncul.
  readonly answerAt: number;
  // Ukuran teks pertanyaan; jawaban, padding, dan sudut ikut menyesuaikan.
  readonly fontSize?: number;
  readonly style?: React.CSSProperties;
};

// Satu pasang tanya-jawab: bubble tamu, indikator mengetik, lalu jawaban AI.
const ChatPairInner: React.FC<ChatPairProps> = ({
  question,
  gloss,
  answer,
  answerAt,
  fontSize = 50,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const k = fontSize / 50;
  const typing = t > 0.2 && t < answerAt;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28 * k,
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "82%",
          padding: `${26 * k}px ${34 * k}px`,
          borderRadius: `${36 * k}px ${36 * k}px ${8 * k}px ${36 * k}px`,
          backgroundColor: colors.signal,
          color: colors.signalInk,
          fontFamily: fonts.heading,
          fontWeight: 500,
          fontSize,
          lineHeight: 1.2,
          opacity: interpolate(t, [0, 0.2], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(t, [0, 0.3], [`0px ${40 * k}px`, "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {question}
        {gloss ? (
          <div
            style={{
              marginTop: 8 * k,
              fontSize: fontSize * 0.7,
              fontWeight: 400,
              opacity: 0.7,
            }}
          >
            {gloss}
          </div>
        ) : null}
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          maxWidth: "88%",
          padding: `${26 * k}px ${34 * k}px`,
          borderRadius: `${36 * k}px ${36 * k}px ${36 * k}px ${8 * k}px`,
          backgroundColor: colors.ink2,
          border: `2px solid ${colors.inkLine}`,
          color: colors.white,
          fontFamily: fonts.heading,
          fontSize: fontSize * 0.92,
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
  gloss: {
    type: "string",
    default: "",
    description: "Terjemahan kecil di bawah pertanyaan",
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
  fontSize: {
    type: "number",
    min: 20,
    step: 1,
    default: 50,
    description: "Ukuran teks",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const ChatPair = Interactive.create({
  Component: ChatPairInner,
  layout: "none",
  schema: chatPairSchema,
});
