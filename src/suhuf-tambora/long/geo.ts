import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeoPermissibleObjects } from "d3-geo";
import type { Topology } from "topojson-specification";
import land50 from "world-atlas/land-50m.json";

const topo = land50 as unknown as Topology;
const land = feature(
  topo,
  topo.objects.land,
) as unknown as GeoPermissibleObjects;
const projection = geoEqualEarth().fitSize([1920, 1080], { type: "Sphere" });
const pathGen = geoPath(projection);
export const LAND_D = pathGen(land) ?? "";
export const SPHERE_D = pathGen({ type: "Sphere" }) ?? "";
export const project = (lon: number, lat: number): [number, number] =>
  projection([lon, lat]) ?? [0, 0];

export const REGION = {
  tambora: { lon: 118, lat: -8.25 },
  europe: { lon: 10, lat: 48 },
  newEngland: { lon: -72, lat: 43 },
  india: { lon: 78, lat: 21 },
  sumbawa: { lon: 118, lat: -8 },
  lombok: { lon: 116, lat: -8.5 },
} as const;
