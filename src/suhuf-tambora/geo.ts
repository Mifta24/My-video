import { geoEqualEarth, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import land50 from "world-atlas/land-50m.json";

// Data peta: Natural Earth via paket `world-atlas` (domain publik).
// Cantumkan atribusi "Natural Earth" di credit akhir.
const topo = land50 as unknown as Topology;

const projection = geoEqualEarth().fitWidth(1080, { type: "Sphere" });
const pathGen = geoPath(projection);

export const LAND_D =
  pathGen(
    feature(topo, topo.objects.land) as unknown as GeoPermissibleObjects,
  ) ?? "";
export const SPHERE_D = pathGen({ type: "Sphere" }) ?? "";

export const project = (lon: number, lat: number): [number, number] => {
  const p = projection([lon, lat]);
  return p ? [p[0], p[1]] : [0, 0];
};

export const TAMBORA = { lon: 118.0, lat: -8.25 }; // Smithsonian GVP: 8.25°S, 118°E
export const SWISS = { lon: 8.2, lat: 46.8 };
export const NEW_ENGLAND = { lon: -72.0, lat: 43.5 };

// View peta: titik (lon, lat) ditaruh di layar (sx, sy) dengan skala k.
export type MapView = {
  lon: number;
  lat: number;
  sx: number;
  sy: number;
  k: number;
};

export const toScreen = (
  v: MapView,
  lon: number,
  lat: number,
): [number, number] => {
  const [fx, fy] = project(v.lon, v.lat);
  const [px, py] = project(lon, lat);
  return [v.sx + v.k * (px - fx), v.sy + v.k * (py - fy)];
};

// Interpolasi antar view; zoom pakai skala logaritmik supaya terasa halus.
export const mixView = (a: MapView, b: MapView, t: number): MapView => ({
  lon: a.lon + (b.lon - a.lon) * t,
  lat: a.lat + (b.lat - a.lat) * t,
  sx: a.sx + (b.sx - a.sx) * t,
  sy: a.sy + (b.sy - a.sy) * t,
  k: a.k * Math.pow(b.k / a.k, t),
});

export const WORLD_VIEW: MapView = {
  lon: 0,
  lat: 0,
  sx: 540,
  sy: 1000,
  k: 1.0,
};
export const SUMBAWA_VIEW: MapView = {
  lon: TAMBORA.lon,
  lat: TAMBORA.lat,
  sx: 540,
  sy: 900,
  k: 75,
};
