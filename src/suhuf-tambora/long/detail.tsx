import type React from "react";
import { interpolate } from "remotion";
import { clamp, easeOut } from "../elements/common";
import { colors, fonts } from "../theme";

// Diagram SKEMATIS untuk adegan detail (B4-B7 versi panjang). Semua gerak dari `lt` (detik lokal shot).
const grow = (lt: number, from: number, dur = 1.0) =>
  interpolate(lt, [from, from + dur], [0, 1], { ...clamp, easing: easeOut });

const svgStyle = { position: "absolute", inset: 0 } as const;
const outline = {
  stroke: colors.bg,
  strokeWidth: 8,
  paintOrder: "stroke" as const,
};

export type TimelineItem = {
  readonly label: string;
  readonly note: string;
  readonly at: number; // detik lokal saat item muncul
  readonly color?: string;
};

// Garis waktu horizontal: titik muncul satu per satu mengikuti narasi.
export const SeasonTimeline: React.FC<{
  readonly lt: number;
  readonly items: readonly TimelineItem[];
  readonly y: number;
}> = ({ lt, items, y }) => {
  const x0 = 380;
  const x1 = 1540;
  const step = (x1 - x0) / (items.length - 1);
  const upTo = items.reduce(
    (m, it, i) => (lt >= it.at ? Math.max(m, i) : m),
    0,
  );
  const lineEnd =
    upTo === 0
      ? x0
      : x0 + step * (upTo - 1) + step * grow(lt, items[upTo].at, 0.9);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={svgStyle}>
      <line
        x1={x0}
        x2={x1}
        y1={y}
        y2={y}
        stroke={colors.landLine}
        strokeWidth={4}
        opacity={0.5}
      />
      <line
        x1={x0}
        x2={lineEnd}
        y1={y}
        y2={y}
        stroke={colors.cold}
        strokeWidth={6}
      />
      {items.map((it, i) => {
        const p = grow(lt, it.at, 0.9);
        const x = x0 + step * i;
        const c = it.color ?? colors.cold;
        return (
          <g key={it.label} opacity={p}>
            <circle cx={x} cy={y} r={26} fill={c} opacity={0.22} />
            <circle cx={x} cy={y} r={14} fill={c} />
            <text
              x={x}
              y={y - 58}
              textAnchor="middle"
              fill={colors.text}
              fontFamily={fonts.heading}
              fontWeight={700}
              fontSize={52}
              {...outline}
            >
              {it.label}
            </text>
            <text
              x={x}
              y={y + 78}
              textAnchor="middle"
              fill={colors.muted}
              fontFamily={fonts.mono}
              fontWeight={500}
              fontSize={30}
              {...outline}
            >
              {it.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Panel: React.FC<{
  readonly x: number;
  readonly p: number;
  readonly title: string;
  readonly children: React.ReactNode;
}> = ({ x, p, title, children }) => (
  <g opacity={p} transform={`translate(${x} ${(1 - p) * 30})`}>
    <rect
      x={0}
      y={250}
      width={520}
      height={470}
      rx={24}
      fill="#0D1830"
      stroke={colors.landLine}
      strokeWidth={3}
    />
    <text
      x={260}
      y={310}
      textAnchor="middle"
      fill={colors.cold}
      fontFamily={fonts.mono}
      fontWeight={500}
      fontSize={32}
      letterSpacing={3}
    >
      {title}
    </text>
    {children}
  </g>
);

// Tiga jenis petunjuk iklim lampau: inti es, cincin pohon, catatan cuaca (skema, bukan data).
export const Proxies: React.FC<{
  readonly lt: number;
  readonly cues: { tree: number; weather: number; all: number };
}> = ({ lt, cues }) => {
  const tree = grow(lt, cues.tree);
  const weather = grow(lt, cues.weather);
  const all = grow(lt, cues.all, 0.8);
  const hl = (a: number) => interpolate(a, [0, 1], [0.35, 1], clamp);
  const warm = colors.warm;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={svgStyle}>
      <Panel x={130} p={grow(lt, 0.2)} title="INTI ES">
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={110}
            y={360 + i * 32}
            width={300}
            height={i === 4 ? 30 : 22}
            rx={6}
            fill={i === 4 ? warm : "#C9E6FF"}
            opacity={i === 4 ? hl(all) : 0.55}
          />
        ))}
        <text
          x={260}
          y={690}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.mono}
          fontWeight={500}
          fontSize={28}
        >
          lapisan sulfat
        </text>
      </Panel>
      <Panel x={700} p={tree} title="CINCIN POHON">
        {Array.from({ length: 9 }, (_, i) => {
          const r = 16 + i * 18;
          const thin = i === 5;
          return (
            <circle
              key={i}
              cx={260}
              cy={500}
              r={r}
              fill="none"
              stroke={thin ? colors.cold : "#B08A5C"}
              strokeWidth={thin ? 3 : 8}
              opacity={thin ? hl(all) : 0.8}
            />
          );
        })}
        <text
          x={260}
          y={690}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.mono}
          fontWeight={500}
          fontSize={28}
        >
          cincin tipis = 1816
        </text>
      </Panel>
      <Panel x={1270} p={weather} title="CATATAN CUACA">
        <polyline
          points="90,470 140,455 190,480 240,450 290,470 330,590 380,500 430,465"
          fill="none"
          stroke={colors.cold}
          strokeWidth={6}
          strokeLinejoin="round"
          opacity={0.9}
        />
        <circle cx={330} cy={590} r={13} fill={warm} opacity={hl(all)} />
        <text
          x={260}
          y={690}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.mono}
          fontWeight={500}
          fontSize={28}
        >
          musim panas dingin
        </text>
      </Panel>
      <text
        x={960}
        y={800}
        textAnchor="middle"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={26}
      >
        SKEMA · BUKAN DATA PRESISI
      </text>
    </svg>
  );
};

// Senja merah SKEMATIS: kabut aerosol membuat langit senja berwarna merah menyala.
export const RedSunset: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const p = grow(lt, 0.1, 1.6);
  const sink = interpolate(lt, [0.2, 9], [0, 40], clamp);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={svgStyle}>
      <defs>
        <linearGradient id="sunset-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1430" />
          <stop offset="0.45" stopColor="#3B2350" />
          <stop offset="0.75" stopColor="#B8432B" />
          <stop offset="1" stopColor="#FF8A3D" />
        </linearGradient>
        <radialGradient id="sunset-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FF8A3D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g opacity={p}>
        <rect x={0} y={0} width={1920} height={760} fill="url(#sunset-sky)" />
        <circle cx={960} cy={650 + sink} r={300} fill="url(#sunset-glow)" />
        <circle cx={960} cy={660 + sink} r={70} fill={colors.sun} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={0}
            y={560 + i * 42}
            width={1920}
            height={10}
            fill="#FF8A3D"
            opacity={0.1 + i * 0.04}
          />
        ))}
        <path
          d="M0 760 L0 700 Q300 650 560 700 T1100 690 T1700 700 L1920 690 L1920 1080 L0 1080 Z"
          fill={colors.bg}
        />
        <text
          x={960}
          y={250}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={96}
          {...outline}
        >
          Senja merah menyala
        </text>
        <text
          x={960}
          y={320}
          textAnchor="middle"
          fill={colors.sun}
          fontFamily={fonts.mono}
          fontWeight={500}
          fontSize={32}
          letterSpacing={4}
          {...outline}
        >
          EROPA · 1815–1816 · ILUSTRASI SKEMATIS
        </text>
      </g>
    </svg>
  );
};

// Sepeda tanpa pedal (Laufmaschine) Karl Drais, 1817: gambar garis skematis.
export const Draisine: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const p = grow(lt, 0.2, 1.2);
  const roll = interpolate(lt, [0, 12], [0, 720], clamp);
  const wheel = (cx: number) => (
    <g transform={`translate(${cx} 640) rotate(${roll})`}>
      <circle r={120} fill="none" stroke={colors.text} strokeWidth={9} />
      <circle r={12} fill={colors.text} />
      {Array.from({ length: 8 }, (_, i) => (
        <line
          key={i}
          x1={0}
          y1={0}
          x2={0}
          y2={-116}
          stroke={colors.muted}
          strokeWidth={4}
          transform={`rotate(${i * 45})`}
        />
      ))}
    </g>
  );
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={svgStyle}>
      <g opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
        <line
          x1={120}
          x2={1000}
          y1={762}
          y2={762}
          stroke={colors.landLine}
          strokeWidth={4}
          strokeDasharray="14 16"
        />
        {wheel(300)}
        {wheel(760)}
        <path
          d="M300 640 L420 470 L690 470 L760 640"
          fill="none"
          stroke={colors.warm}
          strokeWidth={14}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M690 470 L720 380 M680 380 L790 380"
          fill="none"
          stroke={colors.warm}
          strokeWidth={14}
          strokeLinecap="round"
        />
        <rect x={400} y={440} width={150} height={34} rx={14} fill="#B08A5C" />
        <text
          x={540}
          y={870}
          textAnchor="middle"
          fill={colors.muted}
          fontFamily={fonts.mono}
          fontWeight={500}
          fontSize={28}
        >
          SKEMA · BUKAN GAMBAR TEKNIS
        </text>
      </g>
    </svg>
  );
};
