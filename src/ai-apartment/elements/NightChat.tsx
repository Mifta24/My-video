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

type NightClockProps = {
  // Jam dalam menit sejak 00:00. 120 = 02:00, 540 = 09:00.
  readonly fromMinutes: number;
  readonly toMinutes: number;
  readonly runStart: number;
  readonly runEnd: number;
  readonly style?: React.CSSProperties;
};

// Jam digital besar di adegan "masalah". Bisa berjalan cepat antar dua jam.
const NightClockInner: React.FC<NightClockProps> = ({
  fromMinutes,
  toMinutes,
  runStart,
  runEnd,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const minutes = Math.round(
    interpolate(frame / fps, [runStart, runEnd], [fromMinutes, toMinutes], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    }),
  );
  const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  const colonOn = Math.floor(frame / (fps / 2)) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 500,
        fontSize: 280,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: "#d9dade",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {hh}
      <span style={{ opacity: colonOn ? 1 : 0.25 }}>:</span>
      {mm}
    </div>
  );
};

const nightClockSchema = {
  fromMinutes: {
    type: "number",
    min: 0,
    max: 1439,
    step: 1,
    default: 120,
    description: "Jam awal (menit)",
    hiddenFromList: false,
  },
  toMinutes: {
    type: "number",
    min: 0,
    max: 1439,
    step: 1,
    default: 120,
    description: "Jam akhir (menit)",
    hiddenFromList: false,
  },
  runStart: {
    type: "number",
    min: 0,
    step: 0.1,
    default: 0,
    description: "Mulai berjalan (detik)",
    hiddenFromList: false,
  },
  runEnd: {
    type: "number",
    min: 0,
    step: 0.1,
    default: 1,
    description: "Selesai berjalan (detik)",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const NightClock = Interactive.create({
  Component: NightClockInner,
  layout: "none",
  schema: nightClockSchema,
});

type IncomingBubbleProps = {
  readonly children: React.ReactNode;
  readonly status: string;
  readonly style?: React.CSSProperties;
};

// Bubble chat masuk dari calon penyewa, tampilan netral tanpa lime.
const IncomingBubbleInner: React.FC<IncomingBubbleProps> = ({
  children,
  status,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 30,
          letterSpacing: "0.08em",
          color: colors.grayText,
        }}
      >
        Calon penyewa · 02:00
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          padding: "34px 44px",
          borderRadius: "44px 44px 44px 10px",
          backgroundColor: colors.grayCard,
          color: "#eceef1",
          fontFamily: fonts.heading,
          fontWeight: 500,
          fontSize: 72,
          lineHeight: 1.15,
        }}
      >
        {children}
      </div>
      {status ? (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 32,
            color: colors.grayText,
          }}
        >
          {status}
        </div>
      ) : null}
    </div>
  );
};

const incomingBubbleSchema = {
  ...Interactive.childrenSchema,
  status: { type: "string", default: "", description: "Status pesan" },
} as const satisfies InteractivitySchema;

export const IncomingBubble = Interactive.create({
  Component: IncomingBubbleInner,
  layout: "none",
  schema: incomingBubbleSchema,
});
