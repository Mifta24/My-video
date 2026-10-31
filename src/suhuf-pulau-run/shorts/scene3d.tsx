import type React from "react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Easing, interpolate } from "remotion";
import { toon } from "../../suhuf-bakteri/theme";
import { pop } from "../../suhuf-bakteri/elements/ToonKit";
import { Scale3D, scalePose, panSpot } from "../../suhuf-bakteri/shorts/scale3d";
import { Ball, Cyl, Hullmat, SoftShadow, Stage3D, ToyMat, wx, wy } from "../../suhuf-bakteri/shorts/toy3d";
import { GRASS, GRASS_DARK, SAND_DARK, WOOD_DARK } from "./kit2d";

// 3D hanya untuk momen "wow" (S-01, S-08): timbangan dengan dua pulau mainan di piringnya,
// lalu timbangan menyusut dan berubah jadi tanda tanya 3D besar.
// Semua dari primitif Three.js (tanpa aset unduhan). Gerak murni fungsi t.

const Box3D: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly d: number;
  readonly color: string;
  readonly position: readonly [number, number, number];
  readonly ow?: number;
}> = ({ w, h, d, color, position, ow = 3 }) => (
  <group position={position as [number, number, number]}>
    <mesh>
      <boxGeometry args={[w, h, d]} />
      <ToyMat color={color} />
    </mesh>
    <mesh>
      <boxGeometry args={[w + ow * 2, h + ow * 2, d + ow * 2]} />
      <Hullmat />
    </mesh>
  </group>
);

const Win: React.FC<{ readonly x: number; readonly y: number; readonly z: number }> = ({ x, y, z }) => (
  <mesh position={[x, y, z]}>
    <boxGeometry args={[9, 10, 2]} />
    <meshBasicMaterial color={toon.blueLight} toneMapped={false} />
  </mesh>
);

const Building: React.FC<{ readonly x: number; readonly z: number; readonly w: number; readonly h: number; readonly color: string }> = ({ x, z, w, h, color }) => {
  const cols = w > 36 ? 2 : 1;
  const rows = Math.max(1, Math.floor((h - 18) / 24));
  const wins: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wxl = cols === 1 ? 0 : (c - 0.5) * (w * 0.46);
      wins.push(<Win key={`${r}-${c}`} x={wxl} y={-h / 2 + 22 + r * 24} z={w / 2 + 1.5} />);
    }
  }
  return (
    <group position={[x, 0, z]}>
      <Box3D w={w} h={h} d={w} color={color} position={[0, h / 2, 0]} />
      <group position={[0, h / 2, 0]}>{wins}</group>
      <Box3D w={w + 8} h={7} d={w + 8} color={toon.red} position={[0, h + 3, 0]} ow={2.5} />
    </group>
  );
};

const NutTree: React.FC<{ readonly x: number; readonly z: number; readonly s: number }> = ({ x, z, s }) => (
  <group position={[x, 0, z]} scale={[s, s, s]}>
    <Cyl r={8} h={60} color={WOOD_DARK} ow={3} position={[0, 30, 0]} />
    <Ball r={30} color={GRASS_DARK} ow={3} position={[0, 78, 0]} />
    <Ball r={23} color={GRASS_DARK} ow={3} position={[-26, 62, 6]} />
    <Ball r={24} color={GRASS_DARK} ow={3} position={[26, 64, 4]} />
    <Ball r={7.5} color={toon.orange} ow={2.4} position={[-8, 66, 28]} />
    <Ball r={7.5} color={toon.orange} ow={2.4} position={[20, 86, 20]} />
    <Ball r={7.5} color={toon.orange} ow={2.4} position={[-30, 52, 26]} />
  </group>
);

// Pulau mainan: alas pasir + rumput + isi (kota kecil / pohon pala). Pusat alas di (0,0,0), y ke atas.
export const Island3D: React.FC<{ readonly kind: "manhattan" | "run" }> = ({ kind }) => (
  <group>
    <Cyl r={112} h={34} color={SAND_DARK} ow={4} position={[0, 17, 0]} />
    <Cyl r={98} h={14} color={GRASS} ow={3.5} position={[0, 41, 0]} />
    <group position={[0, 48, 0]}>
      {kind === "manhattan" ? (
        <>
          <Building x={-58} z={-4} w={38} h={58} color="#FFF4DE" />
          <Building x={-12} z={14} w={42} h={92} color={toon.blueLight} />
          <Building x={36} z={-10} w={36} h={72} color={toon.orangeLight} />
          <Building x={64} z={26} w={26} h={40} color="#FFE29A" />
        </>
      ) : (
        <>
          <NutTree x={-38} z={4} s={1} />
          <NutTree x={40} z={-12} s={1.2} />
          <Ball r={9} color={toon.orange} ow={2.4} position={[-4, 9, 40]} />
          <Ball r={9} color={toon.orange} ow={2.4} position={[24, 9, 44]} />
          <Ball r={9} color={toon.orange} ow={2.4} position={[-52, 9, 38]} />
        </>
      )}
    </group>
  </group>
);

// Tanda tanya 3D (tabung oranye bergaris tepi + titik bulat).
const QCURVE = (() => {
  const pts: THREE.Vector3[] = [];
  for (let a = 200; a >= -32; a -= 14) {
    const r = (a * Math.PI) / 180;
    pts.push(new THREE.Vector3(Math.cos(r) * 60, 70 + Math.sin(r) * 60, 0));
  }
  pts.push(new THREE.Vector3(30, 8, 0), new THREE.Vector3(3, -14, 0), new THREE.Vector3(0, -40, 0));
  return new THREE.CatmullRomCurve3(pts);
})();

export const Question3D: React.FC<{ readonly r?: number }> = ({ r = 24 }) => {
  const { geo, hull } = useMemo(
    () => ({
      geo: new THREE.TubeGeometry(QCURVE, 140, r, 16, false),
      hull: new THREE.TubeGeometry(QCURVE, 140, r + 7, 16, false),
    }),
    [r],
  );
  useEffect(
    () => () => {
      geo.dispose();
      hull.dispose();
    },
    [geo, hull],
  );
  const end = QCURVE.getPoint(0);
  const bottom = QCURVE.getPoint(1);
  return (
    <group>
      <mesh geometry={geo}>
        <ToyMat color={toon.orange} />
      </mesh>
      <mesh geometry={hull}>
        <Hullmat />
      </mesh>
      <Ball r={r} color={toon.orange} ow={7} position={[end.x, end.y, 0]} />
      <Ball r={r} color={toon.orange} ow={7} position={[bottom.x, bottom.y, 0]} />
      <Ball r={r * 1.32} color={toon.orange} ow={7} position={[0, -100, 0]} />
    </group>
  );
};

// ---------------- Adegan timbangan: dua pulau, lalu berubah jadi tanda tanya ----------------
export const SCALE_PIVOT: readonly [number, number] = [540, 800];
export const SCALE_FLOOR = 1300;

export type ScaleShotState = {
  readonly pose: ReturnType<typeof scalePose>;
  readonly vis: number; // 1 -> 0 saat menyusut
  readonly q: number; // 0 -> 1 skala tanda tanya
};

// angle (derajat; negatif = kiri turun) -> pose timbangan.
export const scaleState = (t: number, angle: number, morphAt: number): ScaleShotState => {
  const pose = scalePose(angle, SCALE_PIVOT, 318, 236, 142);
  const vis = interpolate(t, [morphAt, morphAt + 0.5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const appear = pop(t, 0.05, 0.55);
  const q = pop(t, morphAt + 0.32, 0.7);
  return { pose, vis: vis * appear, q };
};

export const ScaleIslands3D: React.FC<{ readonly t: number; readonly st: ScaleShotState; readonly morphAt: number }> = ({ t, st, morphAt }) => {
  const { pose, vis, q } = st;
  const spin = interpolate(t, [morphAt, morphAt + 0.5], [0, Math.PI * 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pivotX = wx(SCALE_PIVOT[0]);
  const floorY = wy(SCALE_FLOOR);
  const landOn = (center: readonly [number, number], kind: "manhattan" | "run", key: string, bobPh: number) => {
    const sp = panSpot(center, 0, 0);
    const bobY = Math.sin(t * 3 + bobPh) * 1.8;
    return (
      <group key={key} position={[wx(sp.x), wy(sp.y) + bobY, sp.z]} rotation={[0.3, 0, 0]} scale={[0.92, 0.92, 0.92]}>
        <group rotation={[0, kind === "run" ? -0.3 : 0.3, 0]}>
          <Island3D kind={kind} />
        </group>
      </group>
    );
  };
  return (
    <Stage3D>
      <group position={[pivotX, floorY, 0]} rotation={[0, spin, 0]} scale={[vis, vis, vis]}>
        <group position={[-pivotX, -floorY, 0]}>
          <Scale3D pose={pose} vis={1} floorY={SCALE_FLOOR} />
          {landOn(pose.left, "manhattan", "L", 0)}
          {landOn(pose.right, "run", "R", 1.7)}
        </group>
      </group>
      {q > 0.001 ? (
        <group position={[wx(540), wy(930), 0]}>
          <SoftShadow x={0} y={-330 * q} w={440 * q} op={0.9} z={-120} />
          <group
            rotation={[0.04, 0.4 * Math.sin((t - morphAt) * 2.1), 0.1 * Math.sin((t - morphAt) * 2.9)]}
            scale={[2.35 * q, 2.35 * q, 2.35 * q]}
          >
            <Question3D />
          </group>
        </group>
      ) : null}
    </Stage3D>
  );
};
