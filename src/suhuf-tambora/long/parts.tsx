import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { clamp, easeOut } from "../elements/common";
import { PhotoBackdrop } from "../elements/PhotoBackdrop";
import { colors, fonts } from "../theme";
import { FPS, clipDuration, clipStartInScene, scenes } from "./timing";

// Waktu (detik, relatif awal scene) tiap klip narasi: dasar sinkronisasi visual dengan suara.
export const clipStart = (sceneId: string, clipId: string): number => {
  const scene = scenes.find((s) => s.id === sceneId);
  const i = scene?.clips.findIndex((c) => c.id === clipId) ?? -1;
  if (!scene || i < 0) {
    throw new Error(`Klip ${clipId} tidak ada di scene ${sceneId}`);
  }
  return clipStartInScene(scene.clips, i) / FPS;
};
export const clipEnd = (sceneId: string, clipId: string): number =>
  clipStart(sceneId, clipId) + clipDuration(clipId);
export const END = 9999;

// Satu "shot": tampil dari `from` sampai `to` detik, fade halus, children menerima waktu lokal.
export const Shot: React.FC<{
  readonly t: number;
  readonly from: number;
  readonly to?: number;
  readonly children: (lt: number) => React.ReactNode;
}> = ({ t, from, to = END, children }) => {
  const o = Math.min(
    interpolate(t, [from, from + 0.7], [0, 1], clamp),
    interpolate(t, [to - 0.1, to + 0.5], [1, 0], clamp),
  );
  if (o <= 0) {
    return null;
  }
  return (
    <AbsoluteFill style={{ opacity: o }}>{children(t - from)}</AbsoluteFill>
  );
};

export const Backdrop: React.FC<{
  readonly src: string;
  readonly lt: number;
  readonly brightness?: number;
  readonly zoomTo?: number;
  readonly position?: string;
}> = ({ src, lt, brightness = 0.4, zoomTo = 1.12, position }) => (
  <PhotoBackdrop
    src={`suhuf-tambora/photos/${src}`}
    t={lt}
    brightness={brightness}
    zoomFrom={1.0}
    zoomTo={zoomTo}
    duration={30}
    position={position}
  />
);

const rise = (lt: number, delay: number) =>
  interpolate(lt, [delay, delay + 0.8], [0, 1], { ...clamp, easing: easeOut });

// Blok teks: kicker (mono), judul besar, isi.
export const TextBlock: React.FC<{
  readonly lt: number;
  readonly kicker?: string;
  readonly title: string;
  readonly body?: string;
  readonly x?: number;
  readonly y?: number;
  readonly w?: number;
  readonly color?: string;
  readonly titleSize?: number;
  readonly align?: "left" | "center";
  readonly delay?: number;
}> = ({
  lt,
  kicker,
  title,
  body,
  x = 120,
  y = 250,
  w = 820,
  color = colors.text,
  titleSize = 96,
  align = "left",
  delay = 0,
}) => {
  const p = rise(lt, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        textAlign: align,
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
        textShadow: `0 3px 22px ${colors.bg}, 0 0 8px ${colors.bg}`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 30,
            letterSpacing: 4,
            color: colors.muted,
            marginBottom: 14,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: titleSize,
          lineHeight: 1.04,
          color,
        }}
      >
        {title}
      </div>
      {body ? (
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 500,
            fontSize: 42,
            lineHeight: 1.3,
            color: colors.text,
            marginTop: 24,
          }}
        >
          {body}
        </div>
      ) : null}
    </div>
  );
};

// Kartu gambar berbingkai dengan Ken Burns pelan dan caption deskriptif di bawah.
export const Card: React.FC<{
  readonly src: string;
  readonly lt: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly caption?: string;
  readonly delay?: number;
  readonly zoomTo?: number;
  readonly grade?: boolean;
  readonly position?: string;
  readonly fit?: "cover" | "contain";
}> = ({
  src,
  lt,
  x,
  y,
  w,
  h,
  caption,
  delay = 0,
  zoomTo = 1.08,
  grade = true,
  position = "50% 50%",
  fit = "cover",
}) => {
  const p = rise(lt, delay);
  const scale = interpolate(lt, [delay, delay + 14], [1, zoomTo], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: 18,
          border: `3px solid ${colors.landLine}`,
          boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
          background: "#0B1220",
        }}
      >
        <Img
          src={staticFile(`suhuf-tambora/photos/${src}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            objectPosition: position,
            scale: String(scale),
            filter: grade
              ? "saturate(0.75) contrast(1.05) brightness(0.92)"
              : "none",
          }}
        />
        {grade ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(20,45,100,0.16)",
              boxShadow: "inset 0 0 90px rgba(7,11,20,0.5)",
            }}
          />
        ) : null}
      </div>
      {caption ? (
        <div
          style={{
            marginTop: 12,
            fontFamily: fonts.mono,
            fontSize: 26,
            color: colors.text,
            textAlign: "center",
            textShadow: `0 0 8px ${colors.bg}, 0 0 8px ${colors.bg}`,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

// Poin kunci per klip: kalimat pendek yang ikut berganti mengikuti narasi (membantu penonton membaca).
export const Keyline: React.FC<{
  readonly sceneId: string;
  readonly t: number;
  readonly lines: Record<string, string>;
  readonly top?: number;
  readonly from?: number;
  readonly to?: number;
  readonly x?: number; // kalau diisi: rata kiri pada x (lebar w), bukan di tengah layar
  readonly w?: number;
  readonly size?: number;
}> = ({
  sceneId,
  t,
  lines,
  top = 770,
  from = 0,
  to = END,
  x,
  w,
  size = 52,
}) => {
  if (t < from || t > to) {
    return null;
  }
  const entries = Object.entries(lines)
    .map(([id, text]) => ({ text, start: clipStart(sceneId, id) }))
    .sort((a, b) => a.start - b.start);
  let cur: (typeof entries)[number] | null = null;
  for (const e of entries) {
    if (t >= e.start) {
      cur = e;
    }
  }
  if (!cur) {
    return null;
  }
  const p = interpolate(t, [cur.start, cur.start + 0.6], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  return (
    <div
      key={cur.start}
      style={{
        position: "absolute",
        left: x ?? 0,
        ...(x === undefined ? { right: 0 } : { width: w }),
        top,
        display: "flex",
        justifyContent: x === undefined ? "center" : "flex-start",
        opacity: p * interpolate(t, [to - 0.4, to], [1, 0], clamp),
        translate: `0px ${(1 - p) * 20}px`,
      }}
    >
      <div
        style={{
          padding: "14px 40px",
          borderRadius: 16,
          background: "rgba(7,11,20,0.7)",
          border: `2px solid ${colors.landLine}`,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: size,
          color: colors.text,
          maxWidth: w ?? 1560,
          textAlign: x === undefined ? "center" : "left",
        }}
      >
        {cur.text}
      </div>
    </div>
  );
};

export const Label: React.FC<{
  readonly children: React.ReactNode;
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly color?: string;
  readonly mono?: boolean;
  readonly align?: "left" | "center" | "right";
  readonly opacity?: number;
}> = ({
  children,
  x,
  y,
  size = 34,
  color = colors.text,
  mono = false,
  align = "left",
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: align === "center" ? x - 600 : align === "right" ? x - 1200 : x,
      width: align === "left" ? undefined : align === "center" ? 1200 : 1200,
      top: y,
      textAlign: align,
      fontFamily: mono ? fonts.mono : fonts.heading,
      fontWeight: mono ? 500 : 700,
      fontSize: size,
      color,
      opacity,
      textShadow: `0 2px 14px ${colors.bg}, 0 0 6px ${colors.bg}`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
