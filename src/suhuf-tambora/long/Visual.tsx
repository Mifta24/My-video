import type React from "react";
import { interpolate } from "remotion";
import { colors, fonts } from "../theme";
import { SceneVisual } from "./Scenes";

const ROUTE = [
  "TAMBORA · 1815",
  "STRATOSFER",
  "EROPA & AMERIKA · 1816",
  "SUMBAWA",
];
const TAKEAWAYS = [
  "Dunia saling terhubung",
  "Pangan itu rapuh",
  "Mulai dari Sumbawa",
];

export const Atmosphere: React.FC<{ progress: number }> = ({ progress }) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0 }}
  >
    <rect x={0} y={190} width={1920} height={390} fill="#0A1426" />
    <rect x={0} y={580} width={1920} height={300} fill="#101D37" />
    <line
      x1={0}
      x2={1920}
      y1={580}
      y2={580}
      stroke={colors.landLine}
      strokeDasharray="12 14"
      strokeWidth={3}
    />
    <text
      x={140}
      y={270}
      fill={colors.cold}
      fontSize={38}
      fontFamily={fonts.mono}
    >
      STRATOSFER
    </text>
    <text
      x={140}
      y={650}
      fill={colors.text}
      fontSize={36}
      fontFamily={fonts.mono}
    >
      TROPOSFER · LAPISAN CUACA
    </text>
    <path d="M 850 885 L 950 760 L 1050 885 Z" fill="#4A362B" />
    <ellipse cx={950} cy={760} rx={48} ry={18} fill={colors.warm} />
    <rect
      x={930}
      y={410}
      width={40}
      height={350}
      rx={20}
      fill={colors.warm}
      opacity={0.8}
    />
    <ellipse
      cx={950}
      cy={410}
      rx={130 + progress * 170}
      ry={44}
      fill={colors.warm}
      opacity={0.55}
    />
    {Array.from({ length: 55 }, (_, i) => {
      const angle = i * 2.399;
      const radius = 70 + ((i * 89) % 600) * progress;
      const x = 950 + Math.cos(angle) * radius;
      const y = 410 + Math.sin(angle) * radius * 0.34;
      if (y > 565 || y < 230) return null;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={4 + (i % 3)}
          fill={colors.sun}
          opacity={0.6}
        />
      );
    })}
    <text
      x={950}
      y={955}
      textAnchor="middle"
      fill={colors.muted}
      fontSize={24}
      fontFamily={fonts.mono}
    >
      SKEMA · BUKAN DATA PRESISI
    </text>
  </svg>
);

export const Timeline: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 140,
      right: 140,
      top: 500,
      display: "flex",
      alignItems: "center",
    }}
  >
    {ROUTE.map((item, i) => {
      const active = progress >= i / (ROUTE.length - 1);
      return (
        <div
          key={item}
          style={{ flex: 1, position: "relative", textAlign: "center" }}
        >
          {i > 0 && (
            <div
              style={{
                position: "absolute",
                right: "50%",
                top: 20,
                width: "100%",
                height: 4,
                background: active ? colors.cold : colors.landLine,
              }}
            />
          )}
          <div
            style={{
              position: "relative",
              margin: "0 auto",
              width: 36,
              height: 36,
              borderRadius: 18,
              background: active
                ? i === 0
                  ? colors.warm
                  : colors.cold
                : colors.landLine,
              boxShadow: active
                ? `0 0 28px ${i === 0 ? colors.warm : colors.cold}`
                : "none",
            }}
          />
          <div
            style={{
              marginTop: 28,
              color: active ? colors.text : colors.muted,
              fontFamily: fonts.mono,
              fontSize: 27,
              letterSpacing: 1,
            }}
          >
            {item}
          </div>
        </div>
      );
    })}
  </div>
);

export const Takeaways: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      position: "absolute",
      left: 110,
      right: 110,
      top: 280,
      display: "flex",
      flexDirection: "column",
      gap: 30,
    }}
  >
    {TAKEAWAYS.map((item, i) => {
      const opacity = interpolate(
        progress,
        [i * 0.3, i * 0.3 + 0.22],
        [0.18, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return (
        <div
          key={item}
          style={{
            opacity,
            fontFamily: fonts.heading,
            fontSize: 72,
            fontWeight: 700,
            color: i === 2 ? colors.warm : colors.text,
            borderLeft: `8px solid ${i === 2 ? colors.warm : colors.cold}`,
            paddingLeft: 36,
          }}
        >
          {item}
        </div>
      );
    })}
  </div>
);

export const Visual: React.FC<{
  readonly sceneId: string;
  readonly progress: number;
  readonly t: number;
}> = ({ sceneId, progress, t }) => (
  <SceneVisual sceneId={sceneId} t={t} progress={progress} />
);
