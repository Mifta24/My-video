import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Pecah teks jadi potongan pendek (satu baris di layar), lalu bagi waktunya
// sebanding dengan jumlah karakter. Teks sudah bersih dari penanda [VERIFIKASI].
export const splitChunks = (text: string, maxChars = 26): string[] => {
  const phrases = text.match(/[^.,!?]+[.,!?]?/g) ?? [text];
  const chunks: string[] = [];
  for (const raw of phrases) {
    const phrase = raw.trim();
    if (!phrase) {
      continue;
    }
    const words = phrase.split(/\s+/);
    let line = "";
    for (const w of words) {
      if (line && (line + " " + w).length > maxChars) {
        chunks.push(line);
        line = w;
      } else {
        line = line ? line + " " + w : w;
      }
    }
    if (line) {
      chunks.push(line);
    }
  }
  return chunks.map((c) => c.replace(/[.,]+$/, ""));
};

type SubtitleProps = {
  readonly text: string;
  readonly startSec: number;
  readonly durationSec: number;
  readonly bottom?: number;
  readonly fontSize?: number;
  readonly maxWidth?: number;
  readonly maxChars?: number;
};

// Supports horizontal compositions through bottom/fontSize/maxWidth overrides.

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  startSec,
  durationSec,
  bottom = 440,
  fontSize = 62,
  maxWidth = 940,
  maxChars = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - startSec;
  const chunks = splitChunks(text, maxChars);
  const total = chunks.reduce((a, c) => a + c.length, 0);

  let acc = 0;
  let current: { text: string; from: number; to: number } | null = null;
  for (const c of chunks) {
    const from = (acc / total) * durationSec;
    acc += c.length;
    const to = (acc / total) * durationSec;
    if (t >= from && t < to) {
      current = { text: c, from, to };
      break;
    }
  }
  if (!current) {
    return null;
  }

  const opacity = interpolate(t, [current.from, current.from + 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle tengah-bawah; sisakan >= 250 px dari bawah untuk UI Shorts.
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize,
          lineHeight: 1.15,
          color: colors.text,
          background: "rgba(7,11,20,0.78)",
          padding: "14px 30px",
          borderRadius: 20,
          maxWidth,
          textAlign: "center",
        }}
      >
        {current.text}
      </div>
    </div>
  );
};
