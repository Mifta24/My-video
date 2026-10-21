import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { useL } from "../i18n";
import { colors, fonts } from "../theme";

type Floor = {
  readonly code: string;
  readonly label: string;
};

type FloorIndicatorProps = {
  // Detik (relatif ke awal elemen) saat lift tiba di lantai berikutnya.
  readonly arrivals: number[];
  readonly floors: Floor[];
  readonly style?: React.CSSProperties;
};

// Display lift: kode lantai besar + nama lantai, bergulir naik saat pindah lantai.
const FloorIndicatorInner: React.FC<FloorIndicatorProps> = ({
  arrivals,
  floors,
  style,
}) => {
  const L = useL();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let index = 0;
  arrivals.forEach((arrival, i) => {
    if (t >= arrival) index = i + 1;
  });
  const current = floors[Math.min(index, floors.length - 1)];
  const lastArrival = index === 0 ? -10 : arrivals[index - 1];
  const nextArrival = arrivals[index] ?? Infinity;
  const moving = nextArrival - t < 0.35;

  const enter = interpolate(t, [lastArrival, lastArrival + 0.3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        ...style,
      }}
    >
      <div
        style={{
          width: 280,
          height: 240,
          borderRadius: 28,
          backgroundColor: colors.ink2,
          border: `2px solid ${colors.inkLine}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 56,
            color: colors.signal,
            opacity: moving || enter > 0 ? 1 : 0.35,
          }}
        >
          ▲
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 150,
            lineHeight: 1,
            color: colors.signal,
            translate: `0px ${enter * 120}px`,
            opacity: 1 - enter,
          }}
        >
          {current.code}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 30,
            letterSpacing: "0.16em",
            color: colors.muted,
          }}
        >
          {L("LANTAI", "FLOOR")}
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.05,
            color: colors.white,
            maxWidth: 560,
            opacity: 1 - enter,
          }}
        >
          {current.label}
        </div>
      </div>
    </div>
  );
};

const floorIndicatorSchema = {
  arrivals: {
    type: "array",
    item: { type: "number", min: 0, step: 0.1 },
    default: [0.6, 2.4],
    newItemDefault: 0,
    description: "Waktu tiba di tiap lantai berikutnya (detik)",
  },
} as const satisfies InteractivitySchema;

export const FloorIndicator = Interactive.create({
  Component: FloorIndicatorInner,
  layout: "none",
  schema: floorIndicatorSchema,
});
