import type React from "react";
import { interpolate } from "remotion";
import { clamp, easeOut } from "../elements/common";
import { colors, fonts } from "../theme";

const grow = (lt: number, from: number, dur = 1.2) =>
  interpolate(lt, [from, from + dur], [0, 1], { ...clamp, easing: easeOut });

const outline = {
  stroke: colors.bg,
  strokeWidth: 9,
  paintOrder: "stroke" as const,
};

// Profil gunung SKEMATIS: sebelum 1815 (~4.300 m, perkiraan) dan sesudahnya (2.850 m).
export const Profile: React.FC<{
  readonly lt: number;
  readonly showNow: boolean;
}> = ({ lt, showNow }) => {
  const pre = grow(lt, 0.2);
  const now = showNow ? grow(lt, 1.4) : 0;
  const X1 = showNow ? 140 : 580;
  const X2 = 1000;
  const B = 700;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <line x1={80} x2={1840} y1={B} y2={B} stroke="#1F2A44" strokeWidth={10} />
      <path
        d={`M ${X1} ${B} L ${X1 + 380} ${B - 360 * pre} L ${X1 + 760} ${B} Z`}
        fill="#4A362B"
        opacity={showNow ? 0.55 : 1}
        stroke={showNow ? colors.landLine : "none"}
        strokeDasharray="14 12"
        strokeWidth={3}
      />
      <Label2 x={X1 + 380} y={B + 70} text="SEBELUM 1815" color={colors.text} />
      <Label2
        x={X1 + 380}
        y={B + 130}
        text="± 4.300 m (perkiraan)"
        color={colors.warm}
        big
      />
      {showNow ? (
        <g opacity={now}>
          <path
            d={`M ${X2} ${B} L ${X2 + 251} 462 L ${X2 + 310} 490 L ${X2 + 450} 490 L ${X2 + 509} 462 L ${X2 + 760} ${B} Z`}
            fill="#4A362B"
          />
          <line
            x1={X1 + 380}
            x2={X2 + 600}
            y1={B - 360}
            y2={B - 360}
            stroke={colors.sun}
            strokeWidth={3}
            strokeDasharray="10 10"
          />
          <line
            x1={X2 + 380}
            x2={X2 + 380}
            y1={B - 356}
            y2={452}
            stroke={colors.sun}
            strokeWidth={4}
          />
          <path
            d={`M ${X2 + 370} 440 L ${X2 + 380} 458 L ${X2 + 390} 440 Z`}
            fill={colors.sun}
          />
          <text
            x={X2 + 410}
            y={400}
            fill={colors.sun}
            fontFamily={fonts.heading}
            fontWeight={700}
            fontSize={44}
            {...outline}
          >
            hilang ± 1.450 m
          </text>
          <Label2
            x={X2 + 380}
            y={B + 70}
            text="SESUDAH · KALDERA"
            color={colors.text}
          />
          <Label2
            x={X2 + 380}
            y={B + 130}
            text="± 2.850 m"
            color={colors.cold}
            big
          />
        </g>
      ) : null}
      <text
        x={64}
        y={118}
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
      >
        SKEMA · SKALA TIDAK PRESISI
      </text>
    </svg>
  );
};

const Label2: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly color: string;
  readonly big?: boolean;
}> = ({ x, y, text, color, big }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily={big ? fonts.heading : fonts.mono}
    fontWeight={big ? 700 : 500}
    fontSize={big ? 52 : 28}
    {...outline}
  >
    {text}
  </text>
);

// Kolom abu 43 km (terverifikasi Oppenheimer 2003 di script).
export const Column43: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const r = grow(lt, 0.3, 2.6);
  const km = Math.round(43 * r);
  const GROUND = 840;
  const TOP = 180;
  const top = GROUND - (GROUND - TOP) * r;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect x={0} y={GROUND} width={1920} height={14} fill="#1F2A44" />
      <path
        d={`M 560 ${GROUND} L 800 ${GROUND - 150} L 1000 ${GROUND - 150} L 1240 ${GROUND} Z`}
        fill="#4A362B"
      />
      <rect
        x={870}
        y={top}
        width={60}
        height={GROUND - 150 - top}
        rx={28}
        fill={colors.warm}
      />
      <ellipse
        cx={900}
        cy={top}
        rx={70 + 190 * r}
        ry={40}
        fill={colors.warm}
        opacity={0.6}
      />
      <line
        x1={1480}
        x2={1480}
        y1={top}
        y2={GROUND}
        stroke={colors.text}
        strokeWidth={4}
        strokeDasharray="10 10"
      />
      <line
        x1={1450}
        x2={1510}
        y1={top}
        y2={top}
        stroke={colors.text}
        strokeWidth={5}
      />
      <line
        x1={1450}
        x2={1510}
        y1={GROUND}
        y2={GROUND}
        stroke={colors.text}
        strokeWidth={5}
      />
      <text
        x={1540}
        y={(top + GROUND) / 2 + 40}
        fill={colors.sun}
        fontFamily={fonts.heading}
        fontWeight={700}
        fontSize={170}
        {...outline}
      >
        {km} km
      </text>
      <text
        x={1540}
        y={(top + GROUND) / 2 + 100}
        fill={colors.text}
        fontFamily={fonts.mono}
        fontSize={30}
        {...outline}
      >
        tinggi kolom abu
      </text>
      <text
        x={64}
        y={118}
        textAnchor="start"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
      >
        SKEMA
      </text>
    </svg>
  );
};

// Inti es: lapisan sulfat yang melonjak (SKEMATIS, bukan data presisi).
export const IceCore: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const p = grow(lt, 0.2, 1.4);
  const mark1 = grow(lt, 2.2, 0.8);
  const mark2 = grow(lt, 3.6, 0.8);
  const X = 260;
  const W = 1400;
  const Y = 440;
  const H = 150;
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <g opacity={p}>
        <rect
          x={X}
          y={Y}
          width={W * p}
          height={H}
          rx={24}
          fill="#C9E6FF"
          opacity={0.85}
        />
        {Array.from({ length: 42 }, (_, i) => (
          <rect
            key={i}
            x={X + 20 + i * 32}
            y={Y + 8}
            width={i % 3 === 0 ? 3 : 1.5}
            height={H - 16}
            fill="#7CB8E8"
            opacity={0.7}
          />
        ))}
        <rect
          x={X + 0.28 * W}
          y={Y}
          width={26}
          height={H}
          fill={colors.warm}
          opacity={mark1}
        />
        <rect
          x={X + 0.7 * W}
          y={Y}
          width={40}
          height={H}
          fill={colors.warm}
          opacity={mark2}
        />
      </g>
      <g opacity={mark1}>
        <line
          x1={X + 0.28 * W + 13}
          x2={X + 0.28 * W + 13}
          y1={Y - 20}
          y2={Y - 90}
          stroke={colors.text}
          strokeWidth={4}
        />
        <text
          x={X + 0.28 * W + 13}
          y={Y - 110}
          textAnchor="middle"
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={56}
          {...outline}
        >
          ± 1809
        </text>
        <text
          x={X + 0.28 * W + 13}
          y={Y + H + 56}
          textAnchor="middle"
          fill={colors.muted}
          fontFamily={fonts.mono}
          fontSize={28}
          {...outline}
        >
          letusan lain
        </text>
      </g>
      <g opacity={mark2}>
        <line
          x1={X + 0.7 * W + 20}
          x2={X + 0.7 * W + 20}
          y1={Y - 20}
          y2={Y - 90}
          stroke={colors.warm}
          strokeWidth={4}
        />
        <text
          x={X + 0.7 * W + 20}
          y={Y - 110}
          textAnchor="middle"
          fill={colors.warm}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={64}
          {...outline}
        >
          1815
        </text>
        <text
          x={X + 0.7 * W + 20}
          y={Y + H + 56}
          textAnchor="middle"
          fill={colors.warm}
          fontFamily={fonts.mono}
          fontSize={28}
          {...outline}
        >
          Tambora
        </text>
      </g>
      <text
        x={X}
        y={Y + H + 130}
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={26}
        opacity={p}
      >
        ← lebih tua
      </text>
      <text
        x={X + W}
        y={Y + H + 130}
        textAnchor="end"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={26}
        opacity={p}
      >
        lebih baru →
      </text>
      <text
        x={960}
        y={Y - 220}
        textAnchor="middle"
        fill={colors.cold}
        fontFamily={fonts.mono}
        fontSize={32}
        letterSpacing={3}
        opacity={p}
      >
        INTI ES · GREENLAND & ANTARTIKA
      </text>
      <text
        x={64}
        y={118}
        textAnchor="start"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
        opacity={p}
      >
        SKEMA · BUKAN DATA PRESISI
      </text>
    </svg>
  );
};

// Skala VEI 0–8 dengan Tambora di tingkat 7.
export const VeiScale: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const x0 = 360;
  const step = 150;
  const p = grow(lt, 0.3, 1.2);
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <text
        x={960}
        y={330}
        textAnchor="middle"
        fill={colors.cold}
        fontFamily={fonts.mono}
        fontSize={32}
        letterSpacing={4}
      >
        SKALA EKSPLOSIVITAS GUNUNG API · VEI
      </text>
      <line
        x1={x0}
        x2={x0 + step * 8}
        y1={520}
        y2={520}
        stroke={colors.landLine}
        strokeWidth={8}
        strokeLinecap="round"
      />
      {Array.from({ length: 9 }, (_, i) => {
        const hot = i === 7;
        return (
          <g key={i}>
            <circle
              cx={x0 + step * i}
              cy={520}
              r={hot ? 34 * p : 16}
              fill={hot ? colors.warm : colors.landLine}
            />
            <text
              x={x0 + step * i}
              y={620}
              textAnchor="middle"
              fill={hot ? colors.warm : colors.muted}
              fontFamily={fonts.heading}
              fontWeight={700}
              fontSize={hot ? 72 : 44}
            >
              {i}
            </text>
          </g>
        );
      })}
      <text
        x={x0 + step * 7}
        y={430}
        textAnchor="middle"
        fill={colors.warm}
        fontFamily={fonts.heading}
        fontWeight={700}
        fontSize={64}
        opacity={p}
        {...outline}
      >
        TAMBORA
      </text>
      <text
        x={960}
        y={730}
        textAnchor="middle"
        fill={colors.text}
        fontFamily={fonts.heading}
        fontWeight={600}
        fontSize={40}
        opacity={p}
      >
        Tiap tingkat kira-kira 10× lebih besar
      </text>
      <text
        x={64}
        y={118}
        textAnchor="start"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
      >
        SKEMA
      </text>
    </svg>
  );
};

const ERUPTIONS = [
  { name: "Tambora", year: "1815", km3: 50, label: "50 km³", main: true },
  { name: "Krakatau", year: "1883", km3: 10, label: "10 km³", main: false },
  { name: "Pinatubo", year: "1991", km3: 4.8, label: "4,8 km³", main: false },
  { name: "St. Helens", year: "1980", km3: 0.4, label: "0,4 km³", main: false },
];

// Perbandingan volume letusan (bola ∝ volume; angka dari USGS).
export const VolumeBalls: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const DMAX = 340;
  const GAP = 110;
  const BASE = 700;
  const sizes = ERUPTIONS.map((e) => DMAX * Math.cbrt(e.km3 / 50));
  const row = sizes.reduce((a, b) => a + b, 0) + GAP * (sizes.length - 1);
  let cursor = (1920 - row) / 2;
  const xs = sizes.map((d) => {
    const c = cursor + d / 2;
    cursor += d + GAP;
    return c;
  });
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <radialGradient id="lb-warm" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor={colors.sun} />
          <stop offset="45%" stopColor={colors.warm} />
          <stop offset="100%" stopColor="#B8481A" />
        </radialGradient>
        <radialGradient id="lb-cold" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#CBE8FF" />
          <stop offset="55%" stopColor={colors.cold} />
          <stop offset="100%" stopColor={colors.coldDeep} />
        </radialGradient>
      </defs>
      <text
        x={960}
        y={230}
        textAnchor="middle"
        fill={colors.text}
        fontFamily={fonts.heading}
        fontWeight={700}
        fontSize={70}
      >
        Seberapa besar?
      </text>
      <text
        x={960}
        y={290}
        textAnchor="middle"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={28}
      >
        Volume material yang dilontarkan · luas bola mengikuti volume
      </text>
      <line
        x1={200}
        x2={1720}
        y1={BASE}
        y2={BASE}
        stroke={colors.landLine}
        strokeWidth={3}
      />
      {ERUPTIONS.map((e, i) => {
        const g = grow(lt, 0.4 + i * 0.7, 0.9);
        const d = sizes[i];
        return (
          <g key={e.name}>
            <circle
              cx={xs[i]}
              cy={BASE - d / 2}
              r={(d / 2) * g}
              fill={e.main ? "url(#lb-warm)" : "url(#lb-cold)"}
            />
            <g opacity={g}>
              <text
                x={xs[i]}
                y={BASE + 50}
                textAnchor="middle"
                fill={e.main ? colors.warm : colors.text}
                fontFamily={fonts.mono}
                fontWeight={700}
                fontSize={e.main ? 38 : 30}
              >
                {e.name}
              </text>
              <text
                x={xs[i]}
                y={BASE + 88}
                textAnchor="middle"
                fill={colors.muted}
                fontFamily={fonts.mono}
                fontSize={28}
              >
                {e.year}
              </text>
              <text
                x={xs[i]}
                y={BASE + 140}
                textAnchor="middle"
                fill={colors.text}
                fontFamily={fonts.heading}
                fontWeight={700}
                fontSize={e.main ? 56 : 40}
              >
                {e.label}
              </text>
            </g>
          </g>
        );
      })}
      <text
        x={64}
        y={118}
        textAnchor="start"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
      >
        SKEMA · DATA USGS
      </text>
    </svg>
  );
};

// Termometer skematis: air raksa turun melewati 0 °C (titik beku).
export const Thermometer: React.FC<{ readonly lt: number }> = ({ lt }) => {
  const ZERO = 470;
  const fall = interpolate(lt, [0.8, 3.6], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const level = 220 + fall * (560 - 220);
  const frozen = level > ZERO;
  const hg = frozen ? colors.cold : colors.warm;
  const note = interpolate(lt, [2.6, 3.4], [0, 1], clamp);
  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <rect
        x={430}
        y={170}
        width={70}
        height={500}
        rx={35}
        fill="#0B1730"
        stroke={colors.landLine}
        strokeWidth={4}
      />
      <circle
        cx={465}
        cy={720}
        r={72}
        fill="#0B1730"
        stroke={colors.landLine}
        strokeWidth={4}
      />
      <rect x={447} y={level} width={36} height={720 - level} fill={hg} />
      <circle cx={465} cy={720} r={54} fill={hg} />
      {[220, 300, 380, 560, 640].map((y) => (
        <line
          key={y}
          x1={395}
          x2={420}
          y1={y}
          y2={y}
          stroke={colors.muted}
          strokeWidth={3}
        />
      ))}
      <line
        x1={360}
        x2={1500}
        y1={ZERO}
        y2={ZERO}
        stroke={colors.sun}
        strokeWidth={4}
        strokeDasharray="12 10"
      />
      <text
        x={560}
        y={ZERO - 24}
        fill={colors.sun}
        fontFamily={fonts.heading}
        fontWeight={700}
        fontSize={92}
        {...outline}
      >
        0 °C
      </text>
      <text
        x={560}
        y={ZERO + 52}
        fill={colors.text}
        fontFamily={fonts.mono}
        fontSize={34}
        {...outline}
      >
        titik beku air
      </text>
      <g opacity={note}>
        <text
          x={560}
          y={620}
          fill={colors.cold}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={78}
          {...outline}
        >
          Embun beku di bulan Juni
        </text>
      </g>
      <text
        x={64}
        y={118}
        textAnchor="start"
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={24}
      >
        SKEMA
      </text>
    </svg>
  );
};
