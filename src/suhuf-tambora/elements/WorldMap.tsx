import type React from "react";
import { LAND_D, SPHERE_D, project, toScreen, type MapView } from "../geo";
import { colors } from "../theme";

type WorldMapProps = {
  readonly view: MapView;
  readonly landOpacity?: number;
  readonly children?: (
    screen: (lon: number, lat: number) => [number, number],
  ) => React.ReactNode;
};

// Peta dunia vektor. Daratan ikut di-zoom lewat transform, overlay (titik, garis, label)
// digambar di koordinat layar lewat fungsi `screen` supaya ukurannya tidak ikut membesar.
export const WorldMap: React.FC<WorldMapProps> = ({
  view,
  landOpacity = 1,
  children,
}) => {
  const [fx, fy] = project(view.lon, view.lat);
  const tx = view.sx - view.k * fx;
  const ty = view.sy - view.k * fy;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0 }}
    >
      <g
        transform={`translate(${tx} ${ty}) scale(${view.k})`}
        opacity={landOpacity}
      >
        <path d={SPHERE_D} fill={colors.ocean} />
        <path
          d={LAND_D}
          fill={colors.land}
          stroke={colors.landLine}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
        />
      </g>
      {children ? children((lon, lat) => toScreen(view, lon, lat)) : null}
    </svg>
  );
};
