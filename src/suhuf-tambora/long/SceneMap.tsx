import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { LAND_D, project, SPHERE_D, REGION } from "./geo";
import { colors, fonts } from "../theme";

export type MapKind = "world" | "tambora" | "europe" | "north-america" | "asia";

const POINTS = {
  world: [REGION.tambora],
  tambora: [REGION.tambora],
  europe: [REGION.europe],
  "north-america": [REGION.newEngland],
  asia: [REGION.india, REGION.sumbawa],
} as const;

const FOCUS = {
  world: REGION.tambora,
  tambora: REGION.tambora,
  europe: REGION.europe,
  "north-america": REGION.newEngland,
  asia: REGION.india,
} as const;

export const SceneMap: React.FC<{ kind: MapKind; progress?: number }> = ({
  kind,
  progress = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const center = project(FOCUS[kind].lon, FOCUS[kind].lat);
  const zoom = kind === "world" ? 1 : kind === "tambora" ? 3.0 : 2.05;
  const k = interpolate(progress, [0, 1], [1, zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tx = 960 - k * center[0];
  const ty = 540 - k * center[1];
  const pulse = 0.6 + 0.4 * Math.sin((frame / fps) * 3);

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <g transform={`translate(${tx} ${ty}) scale(${k})`}>
        <path d={SPHERE_D} fill={colors.ocean} />
        <path
          d={LAND_D}
          fill={colors.land}
          stroke={colors.landLine}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </g>
      {POINTS[kind].map((p, i) => {
        const [x0, y0] = project(p.lon, p.lat);
        const x = tx + k * x0;
        const y = ty + k * y0;
        const color =
          p === REGION.tambora || (kind === "asia" && i === 1)
            ? colors.warm
            : colors.cold;
        return (
          <g key={`${p.lon}-${p.lat}`}>
            <circle
              cx={x}
              cy={y}
              r={22 + pulse * 14}
              fill={color}
              opacity={0.16}
            />
            <circle cx={x} cy={y} r={10} fill={color} />
          </g>
        );
      })}
      <text
        x={90}
        y={975}
        fill={colors.muted}
        fontFamily={fonts.mono}
        fontSize={22}
        letterSpacing={2}
      >
        Peta: Natural Earth (domain publik)
      </text>
    </svg>
  );
};
