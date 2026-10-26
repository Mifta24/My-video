import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./common";
import { colors, fonts } from "../theme";

// Watermark kecil dari frame pertama sampai akhir: dua titik (atas-tengah dan bawah-tengah)
// supaya sulit di-crop. Keduanya di luar zona UI Shorts (150 px atas, 250 px bawah).
// Logo asli belum ada: wordmark teks sebagai placeholder.
export const Watermark: React.FC<{ readonly wide?: boolean }> = ({
  wide = false,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 15], [0, 1], clamp);
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
    color: colors.text,
    textShadow: `0 0 6px ${colors.bg}, 0 0 10px ${colors.bg}`,
  };
  if (wide) {
    // 16:9: pojok kiri-atas dan kanan-bawah, kecil dan transparan.
    return (
      <>
        <div
          style={{
            ...base,
            left: 64,
            right: undefined,
            top: 40,
            textAlign: "left",
            opacity: 0.5 * o,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 6,
          }}
        >
          SUHUF PENGETAHUAN
        </div>
        <div
          style={{
            ...base,
            left: undefined,
            right: 64,
            top: 1022,
            textAlign: "right",
            opacity: 0.4 * o,
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          @suhufpengetahuan
        </div>
      </>
    );
  }
  return (
    <>
      <div
        style={{
          ...base,
          top: 162,
          opacity: 0.75 * o,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 6,
        }}
      >
        SUHUF PENGETAHUAN
      </div>
      <div
        style={{
          ...base,
          top: 1566,
          opacity: 0.7 * o,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: 2,
        }}
      >
        @suhufpengetahuan
      </div>
    </>
  );
};
