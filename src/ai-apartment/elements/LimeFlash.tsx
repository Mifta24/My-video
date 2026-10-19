import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";

type LimeFlashProps = {
  readonly style?: React.CSSProperties;
};

// Flash lime singkat saat produk muncul.
const LimeFlashInner: React.FC<LimeFlashProps> = ({ style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: colors.signal,
        pointerEvents: "none",
        opacity: interpolate(frame, [0, 0.08 * fps, 0.45 * fps], [0, 0.9, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        ...style,
      }}
    />
  );
};

export const LimeFlash = Interactive.create({
  Component: LimeFlashInner,
  layout: "none",
});
