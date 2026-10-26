import type React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { clamp, easeOut } from "./common";
import { colors, fonts } from "../theme";

type PhotoCardProps = {
  readonly src: string;
  readonly caption: string;
  readonly t: number;
  readonly inAt: number;
  readonly outAt?: number;
  readonly top: number;
  readonly width?: number;
  readonly height: number;
  readonly zoomFrom?: number;
  readonly zoomTo?: number;
  readonly position?: string;
};

// Foto asli dalam kartu: grading dingin biru gelap supaya menyatu dengan palet,
// Ken Burns pelan, dan caption sumber di bawah foto (aturan script: label asal gambar).
export const PhotoCard: React.FC<PhotoCardProps> = ({
  src,
  caption,
  t,
  inAt,
  outAt = 999,
  top,
  width = 920,
  height,
  zoomFrom = 1.0,
  zoomTo = 1.12,
  position = "50% 50%",
}) => {
  const inP = interpolate(t, [inAt, inAt + 0.45], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const outP = interpolate(t, [outAt - 0.3, outAt], [1, 0], clamp);
  const o = Math.min(inP, outP);
  if (o <= 0) {
    return null;
  }
  const scale = interpolate(t, [inAt, inAt + 6], [zoomFrom, zoomTo], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - width) / 2,
        top,
        width,
        opacity: o,
        translate: `0px ${(1 - inP) * 30}px`,
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height,
          overflow: "hidden",
          borderRadius: 18,
          border: `3px solid ${colors.landLine}`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: position,
            scale: String(scale),
            filter: "saturate(0.7) contrast(1.05) brightness(0.9)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,11,20,0.0) 55%, rgba(7,11,20,0.55) 100%)",
            boxShadow: "inset 0 0 120px rgba(7,11,20,0.55)",
            backgroundColor: "rgba(20,45,100,0.18)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 28,
          lineHeight: 1.25,
          color: colors.text,
          textAlign: "center",
          textShadow: `0 0 8px ${colors.bg}, 0 0 8px ${colors.bg}`,
        }}
      >
        {caption}
      </div>
    </div>
  );
};
