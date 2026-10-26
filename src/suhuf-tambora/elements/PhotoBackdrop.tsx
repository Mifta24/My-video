import type React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { clamp } from "./common";
import { colors } from "../theme";

type PhotoBackdropProps = {
  readonly src: string;
  readonly t: number;
  readonly brightness?: number;
  readonly zoomFrom?: number;
  readonly zoomTo?: number;
  readonly duration?: number;
  readonly position?: string;
};

// Foto layar penuh: grading dingin, push-in pelan, gradasi atas-bawah supaya teks terbaca.
export const PhotoBackdrop: React.FC<PhotoBackdropProps> = ({
  src,
  t,
  brightness = 0.85,
  zoomFrom = 1.0,
  zoomTo = 1.12,
  duration = 8,
  position = "50% 50%",
}) => {
  const scale = interpolate(t, [0, duration], [zoomFrom, zoomTo], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          scale: String(scale),
          filter: `saturate(0.7) contrast(1.05) brightness(${brightness})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(20,45,100,0.2)",
          background: `linear-gradient(180deg, ${colors.bg}EE 0%, rgba(7,11,20,0.15) 30%, rgba(7,11,20,0.15) 62%, ${colors.bg}F2 100%)`,
        }}
      />
    </div>
  );
};
