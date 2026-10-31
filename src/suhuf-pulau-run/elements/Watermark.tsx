import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { toon } from "../../suhuf-bakteri/theme";
import { toonFont } from "../../suhuf-bakteri/elements/ToonKit";

// Watermark teks Shorts #03 (draf 4): tinta gelap pekat (kontras tinggi di atas krem), lebih besar,
// diturunkan ke y ~256-296 (di bawah zona UI atas Shorts). Memudar di penutup seperti sebelumnya.
export const WM_TOP = 256;
export const Watermark: React.FC<{ readonly hideAfter: number }> = ({ hideAfter }) => {
  const frame = useCurrentFrame();
  const o =
    interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [hideAfter, hideAfter + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: WM_TOP,
        textAlign: "center",
        pointerEvents: "none",
        opacity: o,
        fontFamily: toonFont(),
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: 8,
        color: toon.ink,
        textShadow: "0 0 10px #FFF4DE, 0 0 4px #FFF4DE, 0 2px 0 #FFF4DE",
        whiteSpace: "nowrap",
      }}
    >
      SUHUF PENGETAHUAN
    </div>
  );
};
