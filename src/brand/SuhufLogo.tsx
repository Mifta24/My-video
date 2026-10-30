import type React from "react";

// Logo resmi Suhuf Pengetahuan: lencana krem dengan atom (tiga orbit, tiga elektron, inti oranye).
// Sumber vektor: public/brand/suhuf-logo.svg. Warna tetap, tidak ikut tema video.
export const SuhufLogo: React.FC<{
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ size, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="158 158 708 708"
    style={{ display: "block", ...style }}
  >
    <circle cx={512} cy={512} r={350} fill="#F5ECD7" stroke="#C9A35B" strokeWidth={7} />
    <g fill="none" stroke="#0B1B2E" strokeWidth={24} strokeLinecap="round">
      <ellipse cx={512} cy={512} rx={155} ry={260} />
      <ellipse cx={512} cy={512} rx={155} ry={260} transform="rotate(60 512 512)" />
      <ellipse cx={512} cy={512} rx={155} ry={260} transform="rotate(120 512 512)" />
    </g>
    <g fill="#C8553D" stroke="#F5ECD7" strokeWidth={6}>
      <circle cx={400} cy={323} r={30} />
      <circle cx={748} cy={448} r={30} />
      <circle cx={425} cy={696} r={30} />
    </g>
    <circle cx={512} cy={512} r={68} fill="#F5A623" stroke="#F5ECD7" strokeWidth={13} />
    <circle cx={497} cy={493} r={14} fill="#FFD477" opacity={0.85} />
  </svg>
);
