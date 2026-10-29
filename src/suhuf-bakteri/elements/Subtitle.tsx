import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, toon } from "../theme";

// Pecah teks jadi potongan pendek (satu-dua baris), waktu dibagi sebanding jumlah karakter.
export const splitChunks = (text: string, maxChars: number): string[] => {
  const phrases = text.match(/[^.,:?!]+[.,:?!]?/g) ?? [text];
  const chunks: string[] = [];
  for (const raw of phrases) {
    const phrase = raw.trim();
    if (!phrase) {
      continue;
    }
    let line = "";
    for (const w of phrase.split(/\s+/)) {
      if (line && (line + " " + w).length > maxChars) {
        chunks.push(line);
        line = w;
      } else {
        line = line ? line + " " + w : w;
      }
    }
    if (line) {
      // Gabungkan potongan sangat pendek ke potongan sebelumnya supaya tidak berkedip.
      const prev = chunks[chunks.length - 1];
      if (prev && line.length < 9 && (prev + " " + line).length <= maxChars + 8) {
        chunks[chunks.length - 1] = prev + " " + line;
      } else {
        chunks.push(line);
      }
    }
  }
  return chunks.map((c) => c.replace(/[.,:]+$/, ""));
};

// Angka dan satuannya diberi warna oranye.
const UNIT = /^(triliun|miliar|persen|kilogram|liter|banding)$/i;
const Words: React.FC<{ readonly text: string; readonly hotColor: string }> = ({
  text,
  hotColor,
}) => (
  <>
    {text.split(" ").map((w, i) => {
      const bare = w.replace(/[.,:?!]/g, "");
      const hot = /\d/.test(bare) || UNIT.test(bare);
      return (
        <span key={i} style={{ color: hot ? hotColor : undefined }}>
          {i > 0 ? " " : ""}
          {w}
        </span>
      );
    })}
  </>
);

export const Subtitle: React.FC<{
  readonly text: string;
  readonly durationSec: number;
  readonly bottom: number;
  readonly fontSize: number;
  readonly maxWidth: number;
  readonly maxChars: number;
  readonly toonStyle?: boolean;
}> = ({ text, durationSec, bottom, fontSize, maxWidth, maxChars, toonStyle = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = splitChunks(text, maxChars);
  const total = chunks.reduce((a, c) => a + c.length, 0);

  let acc = 0;
  let current: { text: string; from: number } | null = null;
  for (const c of chunks) {
    const from = (acc / total) * durationSec;
    acc += c.length;
    const to = (acc / total) * durationSec;
    if (t >= from && t < to + (acc === total ? 0.25 : 0)) {
      current = { text: c, from };
      break;
    }
  }
  if (!current) {
    return null;
  }
  const p = interpolate(t, [current.from, current.from + 0.14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        translate: `0px ${(1 - p) * 8}px`,
      }}
    >
      <div
        style={{
          fontFamily: toonStyle ? fonts.toon : fonts.heading,
          fontWeight: toonStyle ? 600 : 700,
          fontSize,
          lineHeight: 1.18,
          color: toonStyle ? toon.ink : colors.text,
          background: toonStyle ? "rgba(255,255,255,0.96)" : "rgba(5,10,23,0.8)",
          border: toonStyle ? `5px solid ${toon.orange}` : `1.5px solid ${colors.lineSoft}`,
          boxShadow: toonStyle ? `0 6px 0 ${toon.ink}` : undefined,
          padding: toonStyle ? "12px 30px 14px" : "12px 28px",
          borderRadius: toonStyle ? 28 : 18,
          maxWidth,
          textAlign: "center",
        }}
      >
        <Words text={current.text} hotColor={toonStyle ? toon.orangeDark : colors.orangeSoft} />
      </div>
    </div>
  );
};
