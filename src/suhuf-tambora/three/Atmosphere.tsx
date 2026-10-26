import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import * as THREE from "three";
import { colors } from "../theme";

// Penampang atmosfer 3D SKEMATIS untuk S3 (bukan data). Kamera ortografis: 1 unit = 1 px,
// jadi koordinat piksel layout 1080x1920 dipakai langsung (px -> world: x-540, 960-y).
// Semua gerak dari prop t (detik) → deterministik, tanpa useFrame.

// Layout portrait 1080x1920 (Shorts). Layout "wide" 1920x1080 (video panjang) memakai skema yang sama,
// hanya koordinat pikselnya berbeda; keduanya dihitung dari satu tabel supaya tampilannya identik.
export const STRATO_Y = 760;
export const GROUND_Y = 1330;
export const SUN = { x: 930, y: 250 } as const;

type Layout = {
  readonly strato: number; // batas troposfer/stratosfer
  readonly stratoTop: number; // tepi atas pita stratosfer
  readonly ground: number;
  readonly sun: { readonly x: number; readonly y: number };
  readonly hit: number; // lapisan aerosol (tempat sinar dipantulkan)
  readonly colMin: number; // puncak kolom letusan
  readonly aerosolY: readonly [number, number];
  readonly aerosolX: readonly [number, number];
  readonly aerosolK: number;
  readonly center: number; // x pusat gunung
  readonly rayXs: readonly number[];
  readonly rayOut: readonly [number, number];
  readonly dimTo: number; // x titik sinar redup di tanah
  readonly span: number; // lebar bidang atmosfer/tanah
  readonly offset: readonly [number, number, number]; // geser agar pusat layout = pusat layar
};

const PORTRAIT: Layout = {
  strato: STRATO_Y,
  stratoTop: 420,
  ground: GROUND_Y,
  sun: SUN,
  hit: 600,
  colMin: 500,
  aerosolY: [500, 700],
  aerosolX: [70, 1010],
  aerosolK: 1.5,
  center: 540,
  rayXs: [260, 380, 700],
  rayOut: [-120, -200],
  dimTo: 1030,
  span: 1700,
  offset: [0, 0, 0],
};

export const WIDE: Layout = {
  strato: 470,
  stratoTop: 140,
  ground: 760,
  sun: { x: 1640, y: 175 },
  hit: 330,
  colMin: 260,
  aerosolY: [240, 400],
  aerosolX: [140, 1780],
  aerosolK: 2.4,
  center: 960,
  rayXs: [1180, 1330, 1480],
  rayOut: [-150, -150],
  dimTo: 1700,
  span: 2600,
  offset: [-420, -420, 0],
};

const wx = (px: number) => px - 540;
const wy = (py: number) => 960 - py;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type Vec = readonly [number, number, number]; // piksel layout + kedalaman z

const Beam: React.FC<{
  readonly a: Vec;
  readonly b: Vec;
  readonly color: string;
  readonly radius?: number;
  readonly opacity?: number;
}> = ({ a, b, color, radius = 3, opacity = 1 }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(wx(a[0]), wy(a[1]), a[2]);
    const vb = new THREE.Vector3(wx(b[0]), wy(b[1]), b[2]);
    const dir = vb.clone().sub(va);
    const l = dir.length();
    return {
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.normalize(),
      ),
      len: l,
    };
  }, [a, b]);
  if (len < 1 || opacity <= 0) return null;
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, len, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  );
};

// Garis putus-putus: N potongan pendek dari a menuju b sesuai progress.
const DashedBeam: React.FC<{
  readonly a: Vec;
  readonly b: Vec;
  readonly progress: number;
  readonly color: string;
  readonly opacity: number;
  readonly radius?: number;
}> = ({ a, b, progress, color, opacity, radius = 3.5 }) => {
  const n = 9;
  return (
    <>
      {Array.from({ length: n }, (_, k) => {
        const u0 = k / n;
        const u1 = u0 + 0.6 / n;
        if (u0 >= progress) return null;
        const lerp = (u: number): Vec => [
          a[0] + (b[0] - a[0]) * u,
          a[1] + (b[1] - a[1]) * u,
          a[2] + (b[2] - a[2]) * u,
        ];
        return (
          <Beam
            key={k}
            a={lerp(u0)}
            b={lerp(Math.min(u1, progress))}
            color={color}
            radius={radius}
            opacity={opacity}
          />
        );
      })}
    </>
  );
};

type Props = {
  readonly t: number;
  readonly col: number; // 0..1 kolom naik
  readonly spread: number; // 0..1 aerosol menyebar
  readonly rays: number; // 0..1 sinar muncul
  readonly sunDim: number; // 1 → ~0.45
  readonly dim: number; // 0..1 sinar redup ke tanah (langkah 4)
  readonly wide?: boolean; // layout 1920x1080
};

export const AtmosphereLayer: React.FC<Props> = ({
  t,
  col,
  spread,
  rays,
  sunDim,
  dim,
  wide = false,
}) => {
  const { width, height } = useVideoConfig();
  const L = wide ? WIDE : PORTRAIT;
  const { strato, ground, sun: SUNP, hit: HIT_Y } = L;
  const sway = 0.14 * Math.sin(t * 0.55); // putar halus ±8° (sumbu Y saja, garis tetap horizontal)
  const colTop = ground - (ground - L.colMin) * col;
  const colH = Math.max(0, ground - 190 - colTop);
  const appear = interpolate(t, [0, 0.5], [0, 1], clamp);

  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => {
        const rad = (((i * 137.5) % 360) * Math.PI) / 180;
        const dist = 60 + ((i * 53) % 440);
        return { rad, dist, z: ((i * 97) % 320) - 160, r: 4 + (i % 4) * 1.4 };
      }),
    [],
  );

  const billows = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => ({
        py: ground - 200 - (i / 10) * (ground - 200 - L.colMin),
        dx: Math.sin(i * 2.3) * 22,
        dz: Math.cos(i * 1.7) * 22,
        r: 46 + (i % 3) * 8,
      })),
    [ground, L.colMin],
  );

  const rayXs = L.rayXs;
  const p = ease(rays);

  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <ThreeCanvas
        orthographic
        width={width}
        height={height}
        camera={{ position: [0, 0, 1200], near: 10, far: 4000, zoom: 1 }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[-300, 500, 700]} intensity={2.4} />
        <directionalLight
          position={[400, 100, -300]}
          intensity={0.8}
          color="#7CC4FF"
        />

        <group rotation={[0, sway, 0]}>
          <group position={L.offset as unknown as [number, number, number]}>
            {/* Lapisan atmosfer: plane di belakang objek (tanpa depthWrite, tidak menutupi kolom) */}
            <mesh
              position={[wx(L.center), wy((L.stratoTop + strato) / 2), -300]}
              renderOrder={-2}
            >
              <planeGeometry args={[L.span, strato - L.stratoTop]} />
              <meshBasicMaterial
                color="#1B3A6B"
                transparent
                opacity={0.3}
                depthWrite={false}
              />
            </mesh>
            <mesh
              position={[wx(L.center), wy((strato + ground) / 2), -300]}
              renderOrder={-2}
            >
              <planeGeometry args={[L.span, ground - strato]} />
              <meshBasicMaterial
                color="#14284A"
                transparent
                opacity={0.4}
                depthWrite={false}
              />
            </mesh>
            {/* Batas stratosfer (tepat di tepi pita) */}
            <Beam
              a={[L.center - L.span / 2, strato, -290]}
              b={[L.center + L.span / 2, strato, -290]}
              color={colors.landLine}
              radius={2.5}
              opacity={0.9}
            />

            {/* Tanah */}
            <mesh position={[wx(L.center), wy(ground + 8), 0]}>
              <boxGeometry args={[L.span, 16, 560]} />
              <meshStandardMaterial color="#2E4170" roughness={0.9} />
            </mesh>

            {/* Gunung (kerucut terpotong) + kawah */}
            <mesh position={[wx(L.center), wy(ground - 95), 0]}>
              <cylinderGeometry args={[72, 290, 190, 48]} />
              <meshStandardMaterial
                color="#9A7860"
                emissive="#3A2418"
                emissiveIntensity={0.6}
                roughness={0.95}
                flatShading
              />
            </mesh>
            <mesh position={[wx(L.center), wy(ground - 190), 0]}>
              <cylinderGeometry args={[72, 72, 6, 40]} />
              <meshBasicMaterial
                color={colors.warm}
                transparent
                opacity={col}
                toneMapped={false}
              />
            </mesh>

            {/* Kolom letusan */}
            {colH > 1 ? (
              <mesh position={[wx(L.center), wy(colTop + colH / 2), 0]}>
                <cylinderGeometry args={[46, 32, colH, 28]} />
                <meshStandardMaterial
                  color="#FF7A1F"
                  emissive="#FF6A10"
                  emissiveIntensity={0.9}
                  roughness={0.7}
                />
              </mesh>
            ) : null}
            {billows.map((b, i) =>
              b.py >= colTop + 20 ? (
                <mesh key={i} position={[wx(L.center) + b.dx, wy(b.py), b.dz]}>
                  <sphereGeometry args={[b.r, 16, 12]} />
                  <meshStandardMaterial
                    color="#FF8A3D"
                    emissive="#FF6A10"
                    emissiveIntensity={0.8}
                    roughness={0.8}
                  />
                </mesh>
              ) : null,
            )}
            {/* Payung awan di puncak kolom (sedikit di atas kolom supaya tidak tertembus) */}
            {col > 0.02 ? (
              <mesh
                position={[wx(L.center), wy(colTop - 14), 0]}
                scale={[100 + 180 * spread, 50, 100 + 120 * spread]}
              >
                <sphereGeometry args={[1, 32, 16]} />
                <meshStandardMaterial
                  color={colors.warm}
                  emissive={colors.warm}
                  emissiveIntensity={0.9}
                  transparent
                  opacity={0.85 - 0.8 * spread}
                />
              </mesh>
            ) : null}

            {/* Aerosol sulfat: menyebar ke kiri dan kanan di lapisan stratosfer */}
            {particles.map((pt, i) => {
              const x = Math.min(
                L.aerosolX[1],
                Math.max(
                  L.aerosolX[0],
                  L.center + Math.cos(pt.rad) * pt.dist * spread * L.aerosolK,
                ),
              );
              const y = Math.min(
                L.aerosolY[1],
                Math.max(
                  L.aerosolY[0],
                  HIT_Y + Math.sin(pt.rad) * pt.dist * 0.2 * spread,
                ),
              );
              return (
                <mesh key={i} position={[wx(x), wy(y), pt.z * spread]}>
                  <sphereGeometry args={[pt.r * 1.3, 10, 8]} />
                  <meshBasicMaterial
                    color={colors.sun}
                    transparent
                    opacity={0.85 * spread}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}

            {/* Matahari + halo */}
            <mesh position={[wx(SUNP.x), wy(SUNP.y), -120]}>
              <sphereGeometry args={[52, 32, 24]} />
              <meshBasicMaterial
                color={colors.sun}
                transparent
                opacity={sunDim}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[wx(SUNP.x), wy(SUNP.y), -120]}>
              <sphereGeometry args={[88, 32, 24]} />
              <meshBasicMaterial
                color={colors.sun}
                transparent
                opacity={0.14 * sunDim}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>

            {/* Sinar dari matahari ke lapisan aerosol (sama tinggi), lalu dipantulkan balik ke atas */}
            {rayXs.map((tx) => {
              const z = 300;
              const sun: Vec = [SUNP.x - 30, SUNP.y + 40, z];
              const hit: Vec = [tx, HIT_Y, z];
              const out: Vec = [tx + L.rayOut[0], HIT_Y + L.rayOut[1], z];
              return (
                <React.Fragment key={tx}>
                  <Beam
                    a={sun}
                    b={hit}
                    color={colors.sun}
                    radius={3.5}
                    opacity={0.9 * rays}
                  />
                  <DashedBeam
                    a={hit}
                    b={out}
                    progress={p}
                    color={colors.sun}
                    opacity={rays}
                  />
                </React.Fragment>
              );
            })}
            {/* Langkah 4: sinar yang sampai ke tanah redup */}
            <DashedBeam
              a={[SUNP.x + 25, SUNP.y + 90, 260]}
              b={[L.dimTo, ground - 8, 260]}
              progress={dim}
              color={colors.sun}
              opacity={0.35 * dim}
              radius={3}
            />
          </group>
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
