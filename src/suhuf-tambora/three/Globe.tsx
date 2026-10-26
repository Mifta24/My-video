import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import * as THREE from "three";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import { NEW_ENGLAND, TAMBORA } from "../geo";
import { colors } from "../theme";

// Globe 3D untuk S1 (dan nanti B1). Data darat: Natural Earth (domain publik) via `world-atlas`.
// Semua gerak dihitung dari useCurrentFrame() (tanpa useFrame) supaya render deterministik.

const R = 1;
const TEX_W = 2048;
const TEX_H = 1024;

let cachedTexture: THREE.CanvasTexture | null = null;
const getTexture = (): THREE.CanvasTexture => {
  if (cachedTexture) return cachedTexture;
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas tidak tersedia");
  const projection = geoEquirectangular().fitSize([TEX_W, TEX_H], {
    type: "Sphere",
  } as GeoPermissibleObjects);
  const path = geoPath(projection, ctx);
  const topo = land110 as unknown as Topology;
  ctx.fillStyle = "#0F1C38";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = "rgba(124,196,255,0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  path(feature(topo, topo.objects.land) as unknown as GeoPermissibleObjects);
  ctx.fillStyle = "#3A5C9A";
  ctx.fill();
  ctx.strokeStyle = "#8FB4F0";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cachedTexture = tex;
  return tex;
};

const DEG = Math.PI / 180;
// lon/lat → posisi pada bola (sesuai UV SphereGeometry: lon 0 di +x, lon 90E di -z).
const toVec = (lon: number, lat: number, r = R): THREE.Vector3 =>
  new THREE.Vector3(
    Math.cos(lon * DEG) * Math.cos(lat * DEG),
    Math.sin(lat * DEG),
    -Math.sin(lon * DEG) * Math.cos(lat * DEG),
  ).multiplyScalar(r);

const arcCurve = (
  a: { lon: number; lat: number },
  b: { lon: number; lat: number },
  lift: number,
): THREE.CatmullRomCurve3 => {
  const va = toVec(a.lon, a.lat).normalize();
  const vb = toVec(b.lon, b.lat).normalize();
  const angle = va.angleTo(vb);
  const pts: THREE.Vector3[] = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const p = new THREE.Vector3()
      .copy(va)
      .multiplyScalar(Math.sin((1 - u) * angle) / Math.sin(angle))
      .add(vb.clone().multiplyScalar(Math.sin(u * angle) / Math.sin(angle)));
    p.normalize().multiplyScalar(R + 0.004 + Math.sin(Math.PI * u) * lift);
    pts.push(p);
  }
  return new THREE.CatmullRomCurve3(pts);
};

const Arc: React.FC<{
  from: { lon: number; lat: number };
  to: { lon: number; lat: number };
  lift: number;
  color: string;
  progress: number;
}> = ({ from, to, lift, color, progress }) => {
  const geo = useMemo(
    () => new THREE.TubeGeometry(arcCurve(from, to, lift), 96, 0.01, 8, false),
    [from, to, lift],
  );
  const total = geo.index ? geo.index.count : 0;
  const count = Math.floor((total / 3) * progress) * 3;
  geo.setDrawRange(0, count);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

const Marker: React.FC<{
  at: { lon: number; lat: number };
  color: string;
  scale: number;
  pulse?: number;
}> = ({ at, color, scale, pulse = 0 }) => {
  const pos = useMemo(() => toVec(at.lon, at.lat, R + 0.008), [at]);
  const quat = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        pos.clone().normalize(),
      ),
    [pos],
  );
  return (
    <group position={pos} quaternion={quat} scale={scale}>
      <mesh>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh scale={1 + ((pulse + 0.5) % 1) * 2.4}>
        <ringGeometry args={[0.075, 0.09, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={
            0.7 * (1 - ((pulse + 0.5) % 1)) * (pulse > 0 || scale > 0 ? 1 : 0)
          }
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1 + pulse * 2.4}>
        <ringGeometry args={[0.075, 0.092, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={1 - pulse}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// t = detik sejak scene mulai; sw = detik saat narasi "Setahun kemudian" (globe berputar ke Amerika Utara).
export const GlobeLayer: React.FC<{ t: number; sw: number }> = ({ t, sw }) => {
  const { width, height } = useVideoConfig();
  const spin = interpolate(t, [sw, sw + 3.2], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const lon = interpolate(spin, [0, 1], [TAMBORA.lon, -68]);
  const lat = interpolate(spin, [0, 1], [TAMBORA.lat, 36]);
  const rotY = (-90 - lon) * DEG;
  const rotX = lat * DEG;
  const drift = interpolate(t, [0, sw], [0, 6], clamp) * DEG; // gerak halus sebelum berputar
  const zoom = interpolate(t, [0, sw, sw + 3.2], [11.3, 11.0, 10.8], {
    ...clamp,
    easing: ease,
  });
  const appear = interpolate(t, [0, 0.8], [0, 1], clamp);
  const dot = interpolate(t, [0.6, 1.2], [0, 1], clamp);
  const pulse = (t * 0.9) % 1;
  const arc = interpolate(t, [sw + 0.4, sw + 3.4], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const tex = getTexture();

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 32, position: [0, 0, zoom] }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[-3, 2, 4]}
          intensity={2.2}
          color="#DCE8FF"
        />
        <group rotation={[rotX, rotY + drift, 0]}>
          <mesh>
            <sphereGeometry args={[R, 96, 64]} />
            <meshStandardMaterial
              map={tex}
              emissiveMap={tex}
              emissive="#ffffff"
              emissiveIntensity={0.55}
              roughness={0.9}
              metalness={0}
            />
          </mesh>
          <Marker
            at={TAMBORA}
            color={colors.warm}
            scale={dot * 1.7}
            pulse={pulse}
          />
          <Marker at={NEW_ENGLAND} color="#D6F0FF" scale={arc > 0.98 ? 1 : 0} />
          <Arc
            from={TAMBORA}
            to={NEW_ENGLAND}
            lift={0.03}
            color={colors.cold}
            progress={arc}
          />
        </group>
        <mesh>
          <sphereGeometry args={[R * 1.05, 64, 48]} />
          <meshBasicMaterial
            color="#4C93E0"
            transparent
            opacity={0.42}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

type LonLat = { readonly lon: number; readonly lat: number };

export type GlobeMarker = {
  readonly at: LonLat;
  readonly color: string;
  readonly appearAt: number; // detik
  readonly pulse?: boolean;
};
export type GlobeArc = {
  readonly from: LonLat;
  readonly to: LonLat;
  readonly color: string;
  readonly startAt: number; // detik
  readonly duration: number;
  readonly lift?: number;
};

// Globe serbaguna untuk video panjang (16:9). Kamera menghadap `focus`; kalau `focusTo` diisi,
// globe berputar dari `focus` ke `focusTo` antara turnAt..turnAt+turnDur. Posisi globe digeser
// `shiftX` (unit dunia) supaya teks punya ruang di sisi lain.
export const GlobeView: React.FC<{
  readonly t: number;
  readonly focus: LonLat;
  readonly focusTo?: LonLat;
  readonly turnAt?: number;
  readonly turnDur?: number;
  readonly markers: readonly GlobeMarker[];
  readonly arcs?: readonly GlobeArc[];
  readonly distance?: number;
  readonly shiftX?: number;
}> = ({
  t,
  focus,
  focusTo,
  turnAt = 0,
  turnDur = 3,
  markers,
  arcs = [],
  distance = 5.6,
  shiftX = 0,
}) => {
  const { width, height } = useVideoConfig();
  const spin = focusTo
    ? interpolate(t, [turnAt, turnAt + turnDur], [0, 1], {
        ...clamp,
        easing: ease,
      })
    : 0;
  const lon = focus.lon + ((focusTo?.lon ?? focus.lon) - focus.lon) * spin;
  const lat = focus.lat + ((focusTo?.lat ?? focus.lat) - focus.lat) * spin;
  const drift = interpolate(t, [0, 12], [0, 8], clamp) * DEG;
  const appear = interpolate(t, [0, 0.8], [0, 1], clamp);
  const pulse = (t * 0.9) % 1;
  const tex = getTexture();

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 32, position: [0, 0, distance] }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[-3, 2, 4]}
          intensity={2.2}
          color="#DCE8FF"
        />
        <group position={[shiftX, 0, 0]}>
          <group rotation={[lat * DEG, (-90 - lon) * DEG + drift, 0]}>
            <mesh>
              <sphereGeometry args={[R, 96, 64]} />
              <meshStandardMaterial
                map={tex}
                emissiveMap={tex}
                emissive="#ffffff"
                emissiveIntensity={0.55}
                roughness={0.9}
                metalness={0}
              />
            </mesh>
            {markers.map((m) => {
              const s = interpolate(
                t,
                [m.appearAt, m.appearAt + 0.6],
                [0, 1],
                clamp,
              );
              return (
                <Marker
                  key={`${m.at.lon}-${m.at.lat}`}
                  at={m.at}
                  color={m.color}
                  scale={s * (m.pulse ? 1.5 : 0.9)}
                  pulse={m.pulse ? pulse : 0}
                />
              );
            })}
            {arcs.map((a) => (
              <Arc
                key={`${a.from.lon}-${a.to.lon}`}
                from={a.from}
                to={a.to}
                lift={a.lift ?? 0.1}
                color={a.color}
                progress={interpolate(
                  t,
                  [a.startAt, a.startAt + a.duration],
                  [0, 1],
                  {
                    ...clamp,
                    easing: ease,
                  },
                )}
              />
            ))}
          </group>
          <mesh>
            <sphereGeometry args={[R * 1.05, 64, 48]} />
            <meshBasicMaterial
              color="#4C93E0"
              transparent
              opacity={0.42}
              side={THREE.BackSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
