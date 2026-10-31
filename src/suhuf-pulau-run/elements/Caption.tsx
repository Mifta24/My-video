import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { toon } from "../../suhuf-bakteri/theme";
import { toonFont } from "../../suhuf-bakteri/elements/ToonKit";

// Caption Shorts #03 (draf 4): kotak putih, teks tinta (kontras tinggi), tepi oranye.
// - Posisi: tepi bawah kotak di y ~1350 (1920 - 556), jauh di atas zona UI bawah (>= 280 px kosong di bawah).
// - Fade-in sangat singkat (2 frame) dan mulai dari opasitas 0,55: tidak ada frame "pucat" saat potongan baru muncul.
// - Potongan terakhir bertahan sampai klip selesai (tidak memudar sebelum selesai diucapkan).
const Words: React.FC<{ readonly text: string }> = ({ text }) => (
  <>
    {text.split(" ").map((w, i) => {
      const bare = w.replace(/[.,:?!]/g, "");
      const hot = /\d/.test(bare);
      return (
        <span key={i} style={{ color: hot ? toon.orangeDark : undefined }}>
          {i > 0 ? " " : ""}
          {w}
        </span>
      );
    })}
  </>
);

export const CAPTION_BOTTOM = 556;

// Pemotong teks dengan batas keras: tidak ada potongan > MAXC karakter (splitChunks lama menggabungkan sisa pendek hingga +8 karakter sehingga kotak meluap).
const MAXC = 30;
const splitCaption = (text: string): string[] => {
  const phrases = text.match(/[^.,:?!]+[.,:?!]?/g) ?? [text];
  const out: string[] = [];
  for (const raw of phrases) {
    const words = raw.trim().split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      if (line && (line + " " + w).length > MAXC) {
        out.push(line);
        line = w;
      } else {
        line = line ? line + " " + w : w;
      }
    }
    if (line) {
      const prev = out[out.length - 1];
      if (prev && line.length < 9 && (prev + " " + line).length <= MAXC) {
        out[out.length - 1] = prev + " " + line;
      } else {
        out.push(line);
      }
    }
  }
  return out;
};

export const Caption: React.FC<{ readonly text: string; readonly durationSec: number }> = ({ text, durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = splitCaption(text);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  let current: { text: string; from: number } | null = null;
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const from = (acc / total) * durationSec;
    acc += c.length;
    const to = i === chunks.length - 1 ? 9999 : (acc / total) * durationSec;
    if (t >= from && t < to) {
      current = { text: c, from };
      break;
    }
  }
  if (!current) {
    return null;
  }
  const p = interpolate(t, [current.from, current.from + 2 / fps], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: CAPTION_BOTTOM, display: "flex", justifyContent: "center", opacity: p }}>
      <div
        style={{
          fontFamily: toonFont(),
          fontWeight: 700,
          fontSize: Math.min(58, Math.floor(880 / (current.text.length * 0.56))),
          lineHeight: 1.16,
          color: toon.ink,
          background: "#fff",
          border: `6px solid ${toon.orange}`,
          boxShadow: `0 7px 0 ${toon.ink}`,
          padding: "10px 32px 14px",
          borderRadius: 30,
          maxWidth: 980,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <Words text={current.text} />
      </div>
    </div>
  );
};
