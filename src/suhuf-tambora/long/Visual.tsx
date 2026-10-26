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

// Label di atas penampang atmosfer 3D (AtmosphereLayer wide); posisi mengikuti layout WIDE.
export const AtmosphereLabels: React.FC = () => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0 }}
  >
    <text
      x={140}
      y={440}
      fill={colors.cold}
      fontSize={34}
      fontFamily={fonts.mono}
      stroke={colors.bg}
      strokeWidth={8}
      paintOrder="stroke"
    >
      STRATOSFER
    </text>
    <text
      x={140}
      y={525}
      fill={colors.text}
      fontSize={32}
      fontFamily={fonts.mono}
      stroke={colors.bg}
      strokeWidth={8}
      paintOrder="stroke"
    >
      TROPOSFER · LAPISAN CUACA
    </text>
    <text
      x={1800}
      y={72}
      textAnchor="end"
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
