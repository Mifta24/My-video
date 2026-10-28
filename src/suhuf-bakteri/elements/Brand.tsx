import type React from "react";
import { interpolate } from "remotion";
import { colors, fonts } from "../theme";
import { clamp, easeOut, rise } from "./common";

// Tanda "lembar": kertas kecil dengan sudut terlipat dan tiga baris teks. Pengganti logo resmi.
export const SheetMark: React.FC<{ readonly size: number; readonly ink?: string }> = ({
  size,
  ink = colors.bg,
}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
    <path d="M10,6 L68,6 L90,28 L90,114 L10,114 Z" fill={colors.cream} />
    <path d="M68,6 L68,28 L90,28 Z" fill="#D9C9A8" />
    <rect x={22} y={44} width={56} height={7} rx={3.5} fill={colors.orange} />
    <rect x={22} y={62} width={48} height={6} rx={3} fill={ink} opacity={0.75} />
    <rect x={22} y={78} width={52} height={6} rx={3} fill={ink} opacity={0.75} />
    <rect x={22} y={94} width={34} height={6} rx={3} fill={ink} opacity={0.75} />
  </svg>
);

// Lembar kertas terbuka (lipatan atas berputar turun), lalu wordmark dan kalimat khas.
// `t` = detik lokal; `taglineAt` = detik kalimat "Satu lembar, satu cerita." diucapkan.
export const SheetOpen: React.FC<{
  readonly t: number;
  readonly cx: number;
  readonly cy: number;
  readonly w: number;
  readonly taglineAt?: number;
  readonly tagline?: string;
  readonly title?: string;
  readonly close?: number; // 0..1 lembar menutup lagi (penutup video)
}> = ({
  t,
  cx,
  cy,
  w,
  taglineAt = 0.6,
  tagline = "Satu lembar, satu cerita.",
  title,
  close = 0,
}) => {
  const h = w * 0.62;
  const open = interpolate(t, [0.05, 0.95], [0, 1], { ...clamp, easing: easeOut });
  const flap = interpolate(open, [0, 1], [-178, 0]) + close * -178;
  const lift = rise(t, 0, 0.7);
  const mark = rise(t, 0.55, 0.6);
  const tag = rise(t, taglineAt, 0.7);
  const ttl = title ? rise(t, taglineAt + 0.6, 0.7) : 0;
  const shine = interpolate(t, [0.6, 1.8], [-0.4, 1.4], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        perspective: w * 3,
        opacity: lift,
        scale: String(0.92 + 0.08 * lift - close * 0.1),
      }}
    >
      {/* bayangan */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          boxShadow: `0 ${w * 0.05}px ${w * 0.12}px rgba(0,0,0,0.55)`,
          opacity: open,
        }}
      />
      {/* separuh bawah (tetap) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h / 2,
          height: h / 2,
          background: colors.cream,
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: h * 0.03,
            textAlign: "center",
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: w * 0.034,
            letterSpacing: w * 0.012,
            color: colors.bg,
            opacity: mark * 0.75,
          }}
        >
          SATU LEMBAR · SATU CERITA
        </div>
        <div
          style={{
            position: "absolute",
            left: w * 0.12,
            right: w * 0.12,
            top: h * 0.2,
            display: "flex",
            flexDirection: "column",
            gap: h * 0.05,
            opacity: mark,
          }}
        >
          {[0.9, 0.7, 0.8].map((k, i) => (
            <div
              key={i}
              style={{
                height: h * 0.035,
                width: `${k * 100 * interpolate(t, [0.8 + i * 0.12, 1.4 + i * 0.12], [0, 1], clamp)}%`,
                borderRadius: 99,
                background: i === 0 ? colors.orange : "rgba(8,16,34,0.35)",
              }}
            />
          ))}
        </div>
      </div>
      {/* separuh atas: lipatan yang membuka */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: h / 2,
          transformOrigin: "50% 100%",
          rotate: `x ${flap}deg`,
          background: `linear-gradient(180deg, #FFF8EA, ${colors.cream})`,
          borderRadius: "16px 16px 0 0",
          backfaceVisibility: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: w * 0.035,
          overflow: "hidden",
          borderBottom: "2px solid rgba(8,16,34,0.12)",
        }}
      >
        <div style={{ opacity: mark, scale: String(0.8 + 0.2 * mark) }}>
          <SheetMark size={w * 0.1} />
        </div>
        <div
          style={{
            opacity: mark,
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: w * 0.068,
            lineHeight: 0.95,
            color: colors.bg,
            letterSpacing: w * 0.003,
          }}
        >
          SUHUF
          <br />
          <span style={{ color: colors.orange }}>PENGETAHUAN</span>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shine * 100 - 15}%, rgba(255,255,255,0.55) ${shine * 100}%, transparent ${shine * 100 + 15}%)`,
          }}
        />
      </div>
      {/* kalimat khas di bawah lembar */}
      <div
        style={{
          position: "absolute",
          left: -w,
          right: -w,
          top: h + w * 0.08,
          textAlign: "center",
          opacity: tag * (1 - close),
          translate: `0px ${(1 - tag) * 24}px`,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: w * 0.085,
          color: colors.text,
          textShadow: `0 0 30px ${colors.bg}`,
        }}
      >
        {tagline}
      </div>
      {title ? (
        <div
          style={{
            position: "absolute",
            left: -w,
            right: -w,
            top: h + w * 0.2,
            textAlign: "center",
            opacity: ttl * (1 - close),
            fontFamily: fonts.mono,
            fontSize: w * 0.045,
            letterSpacing: w * 0.008,
            color: colors.orangeSoft,
          }}
        >
          {title}
        </div>
      ) : null}
    </div>
  );
};
