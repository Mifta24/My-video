import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";
import { NEW_ENGLAND, SWISS, TAMBORA } from "../geo";
import { colors, fonts } from "../theme";

// Spike 3D · Globe bumi untuk S1/B1. Data darat: Natural Earth (domain publik) via `world-atlas`.
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
  ctx.fillStyle = colors.ocean;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = "rgba(124,196,255,0.10)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  path(feature(topo, topo.objects.land) as unknown as GeoPermissibleObjects);
  ctx.fillStyle = "#2A4170";
  ctx.fill();
  ctx.strokeStyle = colors.landLine;
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
    () => new THREE.TubeGeometry(arcCurve(from, to, lift), 96, 0.006, 6, false),
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
        <circleGeometry args={[0.022, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh scale={1 + pulse * 2.4}>
        <ringGeometry args={[0.028, 0.034, 40]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9 * (1 - pulse)}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TamboraGlobe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Kamera menghadap Tambora, lalu globe berputar ke Atlantik Utara saat busur "menyebar".
  const spin = interpolate(t, [2.2, 7.0], [0, 1], { ...clamp, easing: ease });
  const lon = interpolate(spin, [0, 1], [TAMBORA.lon, -22]);
  const lat = interpolate(spin, [0, 1], [TAMBORA.lat, 28]);
  const rotY = (-90 - lon) * DEG;
  const rotX = lat * DEG;
  const zoom = interpolate(t, [0, 2.2, 7.0], [4.6, 4.6, 6.4], {
    ...clamp,
    easing: ease,
  });
  const appear = interpolate(t, [0, 0.8], [0, 1], clamp);
  const dot = interpolate(t, [0.6, 1.1], [0, 1], clamp);
  const pulse = (t * 0.9) % 1;
  const arc1 = interpolate(t, [2.6, 5.2], [0, 1], { ...clamp, easing: ease });
  const arc2 = interpolate(t, [3.2, 6.2], [0, 1], { ...clamp, easing: ease });
  const tex = getTexture();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill style={{ opacity: appear }}>
        <ThreeCanvas
          width={width}
          height={height}
          camera={{ fov: 32, position: [0, 0, zoom] }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[-3, 2, 4]} intensity={2.2} color="#DCE8FF" />
          <group rotation={[rotX, rotY, 0]}>
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
            <Marker at={TAMBORA} color={colors.warm} scale={dot} pulse={pulse} />
            <Marker at={SWISS} color={colors.cold} scale={arc1 > 0.98 ? 1 : 0} />
            <Marker
              at={NEW_ENGLAND}
              color={colors.cold}
              scale={arc2 > 0.98 ? 1 : 0}
            />
            <Arc
              from={TAMBORA}
              to={SWISS}
              lift={0.16}
              color={colors.cold}
              progress={arc1}
            />
            <Arc
              from={TAMBORA}
              to={NEW_ENGLAND}
              lift={0.3}
              color={colors.cold}
              progress={arc2}
            />
          </group>
          {/* Halo atmosfer (back-side sphere) */}
          <mesh>
            <sphereGeometry args={[R * 1.07, 64, 48]} />
            <meshBasicMaterial
              color={colors.coldDeep}
              transparent
              opacity={0.16}
              side={THREE.BackSide}
              toneMapped={false}
            />
          </mesh>
        </ThreeCanvas>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 54,
          color: colors.text,
          opacity: interpolate(t, [0.4, 1.0], [0, 1], clamp),
        }}
      >
        SPIKE 3D · globe
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.muted,
        }}
      >
        Peta: Natural Earth (domain publik)
      </div>
    </AbsoluteFill>
  );
};
