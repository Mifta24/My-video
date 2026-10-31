import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { splitChunks } from "../../suhuf-bakteri/elements/Subtitle";
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

export const Caption: React.FC<{ readonly text: string; readonly durationSec: number }> = ({ text, durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = splitChunks(text, 34);
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
          fontSize: 58,
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
