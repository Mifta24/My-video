import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SuhufLogo } from "../../brand/SuhufLogo";
import { colors, fonts } from "../theme";
import { clamp } from "./common";

// Watermark kecil sepanjang video. Shorts: di luar zona UI (150 px atas, 250 px bawah).
// Lencana atom resmi di samping wordmark; handle di kanan-bawah (16:9).
export const Watermark: React.FC<{
  readonly wide?: boolean;
  readonly hideAfter?: number;
  readonly ink?: string;
  readonly halo?: string;
}> = ({ wide = false, hideAfter, ink = colors.text, halo = colors.bg }) => {
  const frame = useCurrentFrame();
  const o =
    interpolate(frame, [0, 15], [0, 1], clamp) *
    (hideAfter === undefined ? 1 : interpolate(frame, [hideAfter, hideAfter + 15], [1, 0], clamp));
  const base: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    color: ink,
    textShadow: `0 0 8px ${halo}`,
    whiteSpace: "nowrap",
  };
  if (wide) {
    return (
      <>
        <div
          style={{
            ...base,
            left: 64,
            top: 28,
            opacity: o,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 6,
          }}
        >
          <SuhufLogo size={52} style={{ filter: "drop-shadow(0 2px 4px rgba(43,45,66,0.35))" }} />
          <span style={{ opacity: 0.6 }}>SUHUF PENGETAHUAN</span>
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
        top: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: o,
        fontFamily: fonts.toon,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 7,
      }}
    >
      <SuhufLogo size={52} style={{ filter: "drop-shadow(0 2px 4px rgba(43,45,66,0.35))" }} />
      <span style={{ opacity: 0.75 }}>SUHUF PENGETAHUAN</span>
    </div>
  );
};
