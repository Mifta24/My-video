import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import { clamp } from "./common";

// Watermark kecil sepanjang video. Shorts: di luar zona UI (150 px atas, 250 px bawah).
// Logo resmi belum ada (menunggu Dex): wordmark teks sebagai pengganti.
export const Watermark: React.FC<{ readonly wide?: boolean; readonly hideAfter?: number }> = ({
  wide = false,
  hideAfter,
}) => {
  const frame = useCurrentFrame();
  const o =
    interpolate(frame, [0, 15], [0, 1], clamp) *
    (hideAfter === undefined ? 1 : interpolate(frame, [hideAfter, hideAfter + 15], [1, 0], clamp));
  const base: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    color: colors.text,
    textShadow: `0 0 8px ${colors.bg}`,
    whiteSpace: "nowrap",
  };
  if (wide) {
    return (
      <>
        <div
          style={{
            ...base,
            left: 64,
            top: 40,
            opacity: 0.5 * o,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 6,
          }}
        >
          SUHUF PENGETAHUAN
        </div>
        <div
          style={{
            ...base,
            right: 64,
            top: 1024,
            opacity: 0.38 * o,
            fontFamily: fonts.mono,
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          @suhufpengetahuan
        </div>
      </>
    );
  }
  return (
    <div
      style={{
        ...base,
        left: 0,
        right: 0,
        top: 168,
        textAlign: "center",
        opacity: 0.6 * o,
        fontFamily: fonts.heading,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 7,
      }}
    >
      SUHUF PENGETAHUAN
    </div>
  );
};
