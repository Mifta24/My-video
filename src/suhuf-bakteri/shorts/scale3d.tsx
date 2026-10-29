import type React from "react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Easing, interpolate } from "remotion";
import { toon } from "../theme";
import { Ball, Cyl, Hullmat, Limb, SoftShadow, ToyMat, wx, wy } from "./toy3d";

let shadowTex2: THREE.CanvasTexture | null = null;
const getShadow = () => {
  if (shadowTex2) {
    return shadowTex2;
  }
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(120,80,20,0.5)");
  g.addColorStop(0.6, "rgba(120,80,20,0.25)");
  g.addColorStop(1, "rgba(120,80,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex2 = new THREE.CanvasTexture(c);
  shadowTex2.colorSpace = THREE.SRGBColorSpace;
  return shadowTex2;
};

// Benda 3D pendukung S-08: timbangan dua piring dan tali tarik tambang. Semua dari primitif.
const INK = toon.ink;
const WOOD = "#E8A35E";
const WOOD_DARK = "#B9774A";
export const TILT = 0.38;

// ---------- Gerak timbangan ----------
// Sudut (derajat; negatif = sisi kiri turun). Mulai miring ke kiri (seolah 10 : 1), berayun teredam,
// lalu dikunci tepat seimbang (0) di `settleAt`..`settleAt + 0.3` dan DIAM sesudahnya. Deterministik dari t.
export const scaleAngle = (
  t: number,
  startDeg = -14,
  settleAt = 0.85,
  lockDur = 0.4,
): number => {
  const tt = Math.max(0, t);
  const decay = Math.exp(-2.0 * tt);
  const swing = startDeg * Math.cos(2 * Math.PI * 1.7 * tt) * decay;
  const lock = interpolate(tt, [settleAt, settleAt + lockDur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return swing * lock;
};

export type ScalePose = {
  readonly angle: number;
  readonly pivot: readonly [number, number];
  readonly half: number;
  readonly drop: number;
  readonly panR: number;
  readonly left: readonly [number, number]; // pusat permukaan piring kiri (px halaman)
  readonly right: readonly [number, number];
};

export const scalePose = (
  angle: number,
  pivot: readonly [number, number] = [540, 720],
  half = 340,
  drop = 235,
  panR = 150,
): ScalePose => {
  const a = (angle * Math.PI) / 180;
  const lx = pivot[0] - Math.cos(a) * half;
  const ly = pivot[1] - Math.sin(a) * half; // angle negatif -> kiri turun (y px membesar)
  const rx = pivot[0] + Math.cos(a) * half;
  const ry = pivot[1] + Math.sin(a) * half;
  return {
    angle,
    pivot,
    half,
    drop,
    panR,
    left: [lx, ly + drop - 14],
    right: [rx, ry + drop - 14],
  };
};

export const Scale3D: React.FC<{
  readonly pose: ScalePose;
  readonly vis?: number;
  readonly floorY?: number;
  readonly shadowsL?: readonly (readonly [number, number])[];
  readonly shadowsR?: readonly (readonly [number, number])[];
  readonly shadowW?: number;
}> = ({
  pose,
  vis = 1,
  floorY = 1250,
  shadowsL = [],
  shadowsR = [],
  shadowW = 120,
}) => {
  const { pivot, half, drop, panR } = pose;
  const a = (pose.angle * Math.PI) / 180;
  const P = (x: number, y: number, z = 0): [number, number, number] => [
    wx(x),
    wy(y),
    z,
  ];
  const lx = pivot[0] - Math.cos(a) * half;
  const ly = pivot[1] - Math.sin(a) * half;
  const rx = pivot[0] + Math.cos(a) * half;
  const ry = pivot[1] + Math.sin(a) * half;
  const pan = (
    x: number,
    y: number,
    key: string,
    sh: readonly (readonly [number, number])[],
  ) => {
    const py = y + drop;
    return (
      <group key={key}>
        <Limb
          a={P(x, y)}
          b={P(x - panR * 0.88, py - 13 * Math.cos(TILT), 8)}
          r={4.5}
          color={INK}
          ow={0}
          caps={false}
        />
        <Limb
          a={P(x, y)}
          b={P(x + panR * 0.88, py - 13 * Math.cos(TILT), 8)}
          r={4.5}
          color={INK}
          ow={0}
          caps={false}
        />
        <Limb
          a={P(x, y)}
          b={P(x, py - (13 * Math.cos(TILT) + panR * 0.7 * Math.sin(TILT)), -panR * 0.7 * Math.cos(TILT))}
          r={4.5}
          color={INK}
          ow={0}
          caps={false}
        />
        <Ball r={13} color={toon.yellow} ow={3.5} position={P(x, y)} />
        <Cyl
          r={panR}
          h={26}
          color={toon.yellow}
          ow={4}
          position={P(x, py)}
          rotation={[TILT, 0, 0]}
        />
        <group position={P(x, py)} rotation={[TILT, 0, 0]}>
          {sh.map(([ox, oz], i) => (
            <mesh
              key={i}
              position={[ox, 13.6, oz]}
              rotation={[-Math.PI / 2, 0, 0]}
              renderOrder={3}
            >
              <planeGeometry args={[shadowW, shadowW * 0.5]} />
              <meshBasicMaterial
                map={getShadow()}
                transparent
                depthWrite={false}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={-3}
              />
            </mesh>
          ))}
        </group>
      </group>
    );
  };
  return (
    <group position={[wx(pivot[0]), wy(floorY), 0]} scale={[vis, vis, vis]}>
      <group position={[-wx(pivot[0]), -wy(floorY), 0]}>
        <SoftShadow
          x={wx(pivot[0])}
          y={wy(floorY + 8)}
          w={560}
          op={0.9}
          z={-120}
        />
        <Cyl
          r={150}
          h={34}
          color={WOOD_DARK}
          ow={4.5}
          position={P(pivot[0], floorY - 10)}
        />
        <Limb
          a={P(pivot[0], pivot[1])}
          b={P(pivot[0], floorY - 30)}
          r={20}
          color={WOOD_DARK}
          ow={4.5}
          caps={false}
        />
        <Limb a={P(lx, ly)} b={P(rx, ry)} r={15} color={WOOD} ow={4} />
        <Ball
          r={30}
          color={toon.yellow}
          ow={4.5}
          position={P(pivot[0], pivot[1], 6)}
        />
        {pan(lx, ly, "L", shadowsL)}
        {pan(rx, ry, "R", shadowsR)}
      </group>
    </group>
  );
};

// ---------- Tali tarik tambang ----------
let ropeTex: THREE.CanvasTexture | null = null;
const getRopeTex = () => {
  if (ropeTex) {
    return ropeTex;
  }
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  ctx.fillStyle = "#E3B073";
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "#B77D45";
  ctx.lineWidth = 9;
  for (let k = -1; k <= 2; k++) {
    ctx.beginPath();
    ctx.moveTo(k * 32, 64);
    ctx.lineTo(k * 32 + 64, 0);
    ctx.stroke();
  }
  ropeTex = new THREE.CanvasTexture(c);
  ropeTex.colorSpace = THREE.SRGBColorSpace;
  ropeTex.wrapS = THREE.RepeatWrapping;
  ropeTex.wrapT = THREE.RepeatWrapping;
  ropeTex.repeat.set(46, 1);
  return ropeTex;
};

export const Rope3D: React.FC<{
  readonly y: (x: number) => number;
  readonly x0: number;
  readonly x1: number;
  readonly z: (x: number) => number;
  readonly r?: number;
  readonly sig: string;
}> = ({ y, x0, x1, z, r = 9, sig }) => {
  const { geo, hull } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const n = 54;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      pts.push(new THREE.Vector3(wx(x), wy(y(x)), z(x)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return {
      geo: new THREE.TubeGeometry(curve, 108, r, 12, false),
      hull: new THREE.TubeGeometry(curve, 108, r + 3.5, 12, false),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, x0, x1, r]);
  useEffect(
    () => () => {
      geo.dispose();
      hull.dispose();
    },
    [geo, hull],
  );
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial map={getRopeTex()} roughness={0.8} />
      </mesh>
      <mesh geometry={hull}>
        <Hullmat />
      </mesh>
    </group>
  );
};

// Bendera merah kecil di tengah tali.
export const Flag3D: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly lift?: number;
}> = ({ x, y, z, lift = 74 }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(58, -20);
    s.lineTo(0, -40);
    s.closePath();
    return s;
  }, []);
  return (
    <group position={[wx(x), wy(y), z]}>
      <Limb
        a={[0, 0, 0]}
        b={[0, lift, 0]}
        r={3.6}
        color={INK}
        ow={0}
        caps={false}
      />
      <group position={[0, lift, 0]}>
        <mesh position={[0, 0, -1.5]} scale={[1.18, 1.18, 1]}>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={INK}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial
            color={toon.red}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
      <Ball r={11} color={toon.red} ow={3.5} position={[0, 0, 0]} />
    </group>
  );
};

export { ToyMat };

// Titik berdiri (px halaman + z dunia) di permukaan piring. (ox, oz) = offset lokal pada piringan miring.
export const panSpot = (
  center: readonly [number, number],
  ox: number,
  oz: number,
) => {
  const py = center[1] + 14; // pusat piringan
  return {
    x: center[0] + ox,
    y: py - (13 * Math.cos(TILT) - oz * Math.sin(TILT)),
    z: 13 * Math.sin(TILT) + oz * Math.cos(TILT),
  };
};
