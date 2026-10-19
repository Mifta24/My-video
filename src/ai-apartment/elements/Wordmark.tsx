import type React from "react";
import { Interactive, type InteractivitySchema } from "remotion";
import { colors, fonts } from "../theme";

type WordmarkProps = {
  readonly size: number;
  readonly style?: React.CSSProperties;
};

// Wordmark teks sementara. Ganti dengan file logo resmi bila sudah ada.
const WordmarkInner: React.FC<WordmarkProps> = ({ size, style }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.32,
        fontFamily: fonts.heading,
        color: colors.white,
        ...style,
      }}
    >
      <div
        style={{
          width: size * 1.1,
          height: size * 1.1,
          borderRadius: size * 0.22,
          backgroundColor: colors.signal,
          color: colors.signalInk,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: size * 0.62,
        }}
      >
        L
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: size,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          FTS Apartment AI
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: size * 0.34,
            letterSpacing: "0.18em",
            color: colors.muted,
            marginTop: size * 0.18,
          }}
        >
          AI CONCIERGE · 24/7
        </div>
      </div>
    </div>
  );
};

const wordmarkSchema = {
  size: {
    type: "number",
    min: 20,
    step: 1,
    default: 72,
    description: "Ukuran wordmark",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const Wordmark = Interactive.create({
  Component: WordmarkInner,
  layout: "none",
  schema: wordmarkSchema,
});
