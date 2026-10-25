import type React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Hook sekali: dipakai semua scene untuk fade in/out dan waktu lokal dalam detik.
export const useSceneTime = (totalFrames: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], clamp);
  const fadeOut = interpolate(
    frame,
    [totalFrames - 8, totalFrames],
    [1, 0],
    clamp,
  );
  return { frame, fps, t: frame / fps, opacity: Math.min(fadeIn, fadeOut) };
};

// Label wajib untuk animasi non-data / gambar AI (aturan script).
export const Tag: React.FC<{
  readonly text: string;
  readonly top?: number;
}> = ({ text, top = 170 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 80,
      fontFamily: fonts.mono,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: 2,
      color: colors.text,
      backgroundColor: "rgba(7,11,20,0.86)",
      border: `2px solid ${colors.landLine}`,
      borderRadius: 10,
      padding: "6px 16px",
      textTransform: "uppercase",
    }}
  >
    {text}
  </div>
);
