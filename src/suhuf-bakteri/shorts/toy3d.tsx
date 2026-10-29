import type React from "react";
import { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";
import * as THREE from "three";
import { Easing, interpolate } from "remotion";
import { pop } from "../elements/ToonKit";
import { toon } from "../theme";

// Tokoh 3D bergaya mainan/clay untuk Shorts V3 draf 2.
// - Semua dibuat dari primitif Three.js (CapsuleGeometry, SphereGeometry, CylinderGeometry), tanpa aset unduhan.
// - Kamera perspektif dikalibrasi: bidang z = 0 memetakan 1 unit dunia = 1 piksel kanvas 1080x1920,
//   jadi tata letak 2D lama (kiri-atas, ukuran px) bisa dipakai langsung.
// - Wajah = decal DATAR (tekstur kanvas) yang menempel mengikuti permukaan badan.
// - Semua gerak dihitung dari `t` (detik = frame / fps). Tidak ada useFrame, tidak ada waktu nyata.

const W = 1080;
const H = 1920;
const FOV = 30;
const CAM_Z = H / 2 / Math.tan((FOV * Math.PI) / 360);
const INK = toon.ink;

export type Mood = "happy" | "laugh" | "oh" | "worry" | "think";
export type Kind = "bact" | "cell";

// ---------- Stage ----------
// Satu kanvas transparan 1080x1920 dengan pencahayaan yang sama di semua adegan:
// satu cahaya hangat dari kiri-atas-depan + ambient lembut (langit krem, tanah peach).
export const Stage3D: React.FC<{ readonly children: React.ReactNode; readonly zoom?: number; readonly camX?: number; readonly camY?: number }> = ({
  children,
  zoom = 1,
  camX = 0,
  camY = 0,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <ThreeCanvas
        width={width}
        height={height}
        flat
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: FOV, near: 200, far: 9000, position: [camX, camY, CAM_Z / zoom] }}
      >
        <hemisphereLight args={["#FFF6E4", "#F2C9A0", 1.75]} />
        <directionalLight position={[-700, 1100, 1300]} intensity={2.3} color="#FFF0D4" />
        <directionalLight position={[900, -200, 800]} intensity={0.35} color="#CFE4FF" />
        {children}
      </ThreeCanvas>
    </div>
  );
};

// px kanvas (kiri-atas) -> dunia
export const wx = (px: number) => px - W / 2;
export const wy = (py: number) => H / 2 - py;

// ---------- Wajah (decal datar) ----------
const FACE = {
  cell: { eyeR: 9 / 42, gap: 15 / 42, cy: -3 / 42, halfW: 0.82 },
  bact: { eyeR: 9.5 / 32, gap: 17 / 32, cy: -4 / 32, halfW: 1.5 },
} as const;
const FACE_TOP = -0.62; // satuan R, sumbu y-bawah
const FACE_BOTTOM = 0.85;
const FS = 200; // px tekstur per R

const faceCache = new Map<string, THREE.CanvasTexture>();

const drawFace = (ctx: CanvasRenderingContext2D, kind: Kind, mood: Mood, open: number, look: readonly [number, number]) => {
  const f = FACE[kind];
  const x0 = f.halfW * FS;
  const y0 = -FACE_TOP * FS;
  const r = f.eyeR * FS;
  const gap = f.gap * FS;
  const cy = y0 + f.cy * FS;
  const m = r * 1.1;
  const my = cy + r * 1.75;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (kind === "bact") {
    ctx.fillStyle = "rgba(228,96,26,0.42)";
    for (const [sx, sy, sr] of [
      [1.0, 0.56, 0.1],
      [1.28, -0.28, 0.085],
      [-1.19, 0.37, 0.1],
      [-1.0, -0.38, 0.07],
    ]) {
      ctx.beginPath();
      ctx.arc(x0 + sx * FS, y0 + sy * FS, sr * FS, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // pipi
  ctx.fillStyle = "rgba(255,143,163,0.6)";
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x0 + s * gap * 1.45, cy + r * 1.2, r * 0.62, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // mata
  for (const s of [-1, 1]) {
    const ex = x0 + s * gap;
    ctx.beginPath();
    ctx.ellipse(ex, cy, r, Math.max(2.5, r * open), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = r * 0.28;
    ctx.strokeStyle = INK;
    ctx.stroke();
    if (open > 0.5) {
      ctx.beginPath();
      ctx.arc(ex + look[0] * r * 0.4, cy + look[1] * r * 0.4, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = INK;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + look[0] * r * 0.4 - r * 0.16, cy + look[1] * r * 0.4 - r * 0.18, r * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
  }
  // mulut
  ctx.strokeStyle = INK;
  ctx.lineWidth = r * 0.36;
  const cx = x0;
  if (mood === "happy") {
    ctx.beginPath();
    ctx.moveTo(cx - m, my);
    ctx.quadraticCurveTo(cx, my + m * 0.95, cx + m, my);
    ctx.stroke();
  } else if (mood === "laugh") {
    ctx.beginPath();
    ctx.moveTo(cx - m, my - 1);
    ctx.quadraticCurveTo(cx, my + m * 1.9, cx + m, my - 1);
    ctx.closePath();
    ctx.fillStyle = "#7A2E2E";
    ctx.fill();
    ctx.lineWidth = r * 0.3;
    ctx.stroke();
  } else if (mood === "oh") {
    ctx.beginPath();
    ctx.ellipse(cx, my + 2, m * 0.36, m * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#7A2E2E";
    ctx.fill();
    ctx.lineWidth = r * 0.26;
    ctx.stroke();
  } else if (mood === "worry") {
    ctx.beginPath();
    ctx.moveTo(cx - m * 0.85, my + m * 0.4);
    ctx.quadraticCurveTo(cx, my - m * 0.4, cx + m * 0.85, my + m * 0.4);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx - m * 0.6, my + 1);
    ctx.lineTo(cx + m * 0.6, my - 2);
    ctx.stroke();
  }
};

const faceTexture = (kind: Kind, mood: Mood, open: number, look: readonly [number, number]) => {
  const lk: [number, number] = [Math.round(look[0] * 2) / 2, Math.round(look[1] * 2) / 2];
  const key = `${kind}|${mood}|${open}|${lk.join(",")}`;
  const hit = faceCache.get(key);
  if (hit) {
    return hit;
  }
  const f = FACE[kind];
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(f.halfW * 2 * FS);
  canvas.height = Math.round((FACE_BOTTOM - FACE_TOP) * FS);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  drawFace(ctx, kind, mood, open, lk);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  faceCache.set(key, tex);
  return tex;
};

// Kedip: terbuka, setengah, tertutup. Deterministik dari t.
const blinkOpen = (t: number, phase: number) => {
  const u = (t * 0.8 + phase) % 3;
  if (u > 2.93) {
    return 0.1;
  }
  if (u > 2.88 || (u > 2.9 && u <= 2.93)) {
    return 0.45;
  }
  return 1;
};

let shadowTex: THREE.CanvasTexture | null = null;
const getShadowTex = () => {
  if (shadowTex) {
    return shadowTex;
  }
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(120,80,40,0.38)");
  g.addColorStop(0.55, "rgba(120,80,40,0.2)");
  g.addColorStop(1, "rgba(120,80,40,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(c);
  shadowTex.colorSpace = THREE.SRGBColorSpace;
  return shadowTex;
};

// Bayangan datar lembut di bawah tokoh. `w` lebar px, berpusat di (x, y) dunia.
export const SoftShadow: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly op?: number; readonly z?: number }> = ({
  x,
  y,
  w,
  op = 1,
  z = -40,
}) => (
  <mesh position={[x, y, z]} scale={[w, w * 0.22, 1]} renderOrder={-1}>
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial map={getShadowTex()} transparent opacity={op} depthWrite={false} toneMapped={false} />
  </mesh>
);

// ---------- Bentuk dasar bergaris tepi (inverted hull, warna tinta) ----------
export const Hullmat = () => <meshBasicMaterial color={INK} side={THREE.BackSide} toneMapped={false} />;

export const ToyMat: React.FC<{ readonly color: string }> = ({ color }) => (
  <meshPhysicalMaterial color={color} roughness={0.55} metalness={0} clearcoat={1} clearcoatRoughness={0.22} />
);

// Silinder bergaris tepi (sumbu y), dipakai untuk piring timbangan, tiang, dasar.
export const Cyl: React.FC<{
  readonly r: number;
  readonly h: number;
  readonly color: string;
  readonly ow?: number;
  readonly position?: readonly [number, number, number];
  readonly rotation?: readonly [number, number, number];
}> = ({ r, h, color, ow = 3.5, position = [0, 0, 0], rotation = [0, 0, 0] }) => (
  <group position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
    <mesh>
      <cylinderGeometry args={[r, r, h, 56]} />
      <ToyMat color={color} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[r + ow, r + ow, h + ow * 2, 56]} />
      <Hullmat />
    </mesh>
  </group>
);

export const Ball: React.FC<{ readonly r: number; readonly color: string; readonly ow?: number; readonly position?: readonly [number, number, number] }> = ({
  r,
  color,
  ow = 3,
  position = [0, 0, 0],
}) => (
  <group position={position as [number, number, number]}>
    <mesh>
      <sphereGeometry args={[r, 32, 24]} />
      <ToyMat color={color} />
    </mesh>
    <mesh>
      <sphereGeometry args={[r + ow, 32, 24]} />
      <Hullmat />
    </mesh>
  </group>
);

// Batang bulat dari titik a ke b (dunia/lokal), dengan ujung bulat. Dipakai untuk lengan, tali, tiang.
export const Limb: React.FC<{
  readonly a: readonly [number, number, number];
  readonly b: readonly [number, number, number];
  readonly r: number;
  readonly color: string;
  readonly ow?: number;
  readonly hand?: number; // radius bola tangan di b (0 = tanpa)
  readonly caps?: boolean;
  readonly handColor?: string;
}> = ({ a, b, r, color, ow = 3, hand = 0, caps = true, handColor }) => {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = Math.max(0.001, dir.length());
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  return (
    <group>
      <group position={mid.toArray()} quaternion={q}>
        <mesh scale={[1, len, 1]}>
          <cylinderGeometry args={[r, r, 1, 20]} />
          <ToyMat color={color} />
        </mesh>
        <mesh scale={[1, len, 1]}>
          <cylinderGeometry args={[r + ow, r + ow, 1, 20]} />
          <Hullmat />
        </mesh>
      </group>
      {caps ? <Ball r={r} color={color} ow={ow} position={a} /> : null}
      {caps && hand <= 0 ? <Ball r={r} color={color} ow={ow} position={b} /> : null}
      {hand > 0 ? <Ball r={hand} color={handColor ?? color} ow={ow} position={b} /> : null}
    </group>
  );
};

// ---------- Tokoh ----------
export type Dim = { R: number; seg: number; cxBox: number; cyBox: number };
// Ukuran badan setara kotak SVG 2D (size x size*2/3 untuk bakteri, size x size untuk sel).
export const dimOf = (kind: Kind, size: number): Dim =>
  kind === "bact"
    ? { R: (32 / 120) * size, seg: (40 / 120) * size, cxBox: size / 2, cyBox: size / 3 }
    : { R: 0.42 * size, seg: 0, cxBox: size / 2, cyBox: size / 2 };

// Decal: grid datar yang tiap titiknya diproyeksikan ke permukaan kapsul/bola (menempel seperti stiker).
// (cx, cy) = pusat tempelan (dunia, y atas, relatif pusat badan); w, h = ukuran.
const buildPatch = (R: number, seg: number, cx: number, cy: number, w: number, h: number) => {
  const geo = new THREE.PlaneGeometry(w, h, 36, 20);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + cx;
    const y = pos.getY(i) + cy;
    const dxo = Math.max(0, Math.abs(x) - seg / 2);
    const lim = (R * 0.985) ** 2;
    const r2 = y * y + dxo * dxo;
    const k = r2 > lim ? Math.sqrt(lim / r2) : 1;
    const yy = y * k;
    const dk = dxo * k;
    const xx = Math.abs(x) <= seg / 2 ? x : Math.sign(x) * (seg / 2 + dk);
    const zz = Math.sqrt(Math.max(0, R * R - yy * yy - dk * dk));
    pos.setXYZ(i, xx, yy, zz + 0.5);
  }
  geo.computeVertexNormals();
  return geo;
};

const patchCache = new Map<string, THREE.BufferGeometry>();
const cachedPatch = (key: string, make: () => THREE.BufferGeometry) => {
  const hit = patchCache.get(key);
  if (hit) {
    return hit;
  }
  const g = make();
  patchCache.set(key, g);
  return g;
};

const buildDecal = (kind: Kind, R: number, seg: number, up = 0) => {
  const f = FACE[kind];
  return buildPatch(R, seg, 0, (-((FACE_TOP + FACE_BOTTOM) / 2) + up) * R, f.halfW * 2 * R, (FACE_BOTTOM - FACE_TOP) * R);
};

let sheenTex: THREE.CanvasTexture | null = null;
const getSheenTex = () => {
  if (sheenTex) {
    return sheenTex;
  }
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  ctx.translate(128, 64);
  ctx.scale(1, 0.5);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 120);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.5, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fill();
  sheenTex = new THREE.CanvasTexture(c);
  sheenTex.colorSpace = THREE.SRGBColorSpace;
  return sheenTex;
};

export type ToyArms = { readonly l?: number; readonly r?: number };

// Sudut lengan gaya 2D: 0 = turun, 90 = ke samping, 180 = ke atas. Mengembalikan titik bahu/tangan lokal (dunia: y atas).
const armPoints = (kind: Kind, size: number, side: "l" | "r", angle: number) => {
  const d = dimOf(kind, size);
  const dir = side === "l" ? -1 : 1;
  const sh = kind === "bact" ? { x: 46 / 120, y: 6 / 120 } : { x: 41 / 100, y: 6 / 100 };
  const len = (kind === "bact" ? 30 / 120 : 27 / 100) * size;
  const a = (angle * Math.PI) / 180;
  const sx = dir * sh.x * size * 0.97;
  const sy = -sh.y * size;
  const sz = d.R * 0.12;
  const ex = sx + dir * Math.sin(a) * len;
  const ey = sy - Math.cos(a) * len;
  return { a: [sx, sy, sz] as [number, number, number], b: [ex, ey, sz + 4] as [number, number, number], len };
};

export type ToyProps = {
  readonly kind: Kind;
  readonly size: number;
  readonly left: number; // kiri-atas kotak 2D (px)
  readonly top: number;
  readonly t: number;
  readonly at?: number; // muncul memantul pada detik ini
  readonly mood?: Mood;
  readonly look?: readonly [number, number];
  readonly phase?: number;
  readonly arms?: ToyArms;
  readonly rot?: number; // derajat, putar di bidang layar (pivot kaki)
  readonly yaw?: number; // derajat, putar menghadap kiri/kanan
  readonly dy?: number; // geser vertikal px (bob)
  readonly dx?: number;
  readonly z?: number;
  readonly squash?: number; // -1..1, positif = gepeng
  readonly shadow?: boolean;
  readonly shadowW?: number; // pengali lebar bayangan
  readonly breathe?: boolean;
  readonly popDur?: number;
  readonly faceUp?: number; // geser wajah ke atas (satuan R), mis. 0.12 agar tali tidak menutupi mulut
  readonly vis?: number; // 0..1 pengali skala (untuk menghilang)
  readonly armTo?: { readonly l?: readonly [number, number]; readonly r?: readonly [number, number] }; // tangan menempel ke titik px halaman
  readonly armZ?: number;
  readonly grip?: { readonly ropeY: (x: number) => number; readonly z: number; readonly span?: number }; // kedua tangan menggenggam tali di depan bagian bawah badan
};

export const BODY_COLOR: Record<Kind, string> = { bact: toon.orange, cell: toon.blue };

export const Toy: React.FC<ToyProps> = ({
  kind,
  size,
  left,
  top,
  t,
  at = 0,
  mood = "happy",
  look = [0, 0],
  phase = 0,
  arms,
  rot = 0,
  yaw = 0,
  dy = 0,
  dx = 0,
  z = 0,
  squash = 0,
  shadow = true,
  shadowW = 1,
  breathe = true,
  popDur = 0.5,
  vis = 1,
  faceUp = 0,
  armTo,
  armZ = 0,
  grip,
}) => {
  const d = dimOf(kind, size);
  const key = `${kind}|${Math.round(d.R * 4)}`;
  const decal = useMemo(() => cachedPatch(`f|${key}|${faceUp}`, () => buildDecal(kind, d.R, d.seg, faceUp)), [kind, d.R, d.seg, key, faceUp]);
  const sheen = useMemo(
    () =>
      cachedPatch(`s|${key}`, () =>
        kind === "bact" ? buildPatch(d.R, d.seg, -d.seg * 0.35 - d.R * 0.1, d.R * 0.58, d.R * 1.15, d.R * 0.5) : buildPatch(d.R, 0, -d.R * 0.42, d.R * 0.56, d.R * 0.8, d.R * 0.4),
      ),
    [kind, d.R, d.seg, key],
  );
  if (t < at) {
    return null;
  }
  const p = pop(t, at, popDur) * vis;
  if (p <= 0.001) {
    return null;
  }
  const color = BODY_COLOR[kind];
  const ow = Math.min(8, Math.max(2.6, size * 0.034));
  // pusat badan (px) dan titik pivot (dasar badan)
  const cx = left + d.cxBox + dx;
  const cy = top + d.cyBox + dy;
  const baseY = cy + d.R;
  const br = breathe ? 0.035 * Math.sin(t * 3.1 + phase * 1.7) : 0;
  const sq = squash + br;
  const sx = (1 + sq * 0.7) * p;
  const sy = (1 - sq) * p;
  const pivot: [number, number, number] = [wx(cx), wy(baseY), z];
  const euler = new THREE.Euler(0, (yaw * Math.PI) / 180, (-rot * Math.PI) / 180, "ZYX");
  const quat = new THREE.Quaternion().setFromEuler(euler);
  const M = new THREE.Matrix4().compose(new THREE.Vector3(...pivot), quat, new THREE.Vector3(sx, sy, (sx + sy) / 2));
  const open = blinkOpen(t, phase);
  const tex = faceTexture(kind, mood, open, look);
  const armR = size * 0.045;
  const inv = M.clone().invert();
  const half = d.R + d.seg / 2;
  const surfZ = (x: number, y: number) => {
    const dxo = Math.max(0, Math.abs(x) - d.seg / 2);
    return Math.sqrt(Math.max(0, d.R * d.R - y * y - dxo * dxo));
  };
  const reach = (side: "l" | "r") => {
    const dir = side === "l" ? -1 : 1;
    if (grip) {
      const span = grip.span ?? 0.45;
      // bahu di sisi bawah-depan badan
      const sxl = dir * half * 0.62;
      const syl = -d.R * 0.2;
      const a: [number, number, number] = [sxl, syl, surfZ(sxl, syl) + armR * 0.9];
      // titik tangan: x mengikuti badan (setelah miring), y dan z dikunci ke tali
      const probe = new THREE.Vector3(dir * half * span, d.R * (1 - 0.78), 0).applyMatrix4(M);
      const px = probe.x + W / 2;
      const tgt = new THREE.Vector3(probe.x, wy(grip.ropeY(px)), grip.z).applyMatrix4(inv).sub(new THREE.Vector3(0, d.R, 0));
      return { a, b: [tgt.x, tgt.y, tgt.z] as [number, number, number] };
    }
    const tgt = armTo?.[side];
    if (tgt) {
      const base = armPoints(kind, size, side, 90);
      const loc = new THREE.Vector3(wx(tgt[0]), wy(tgt[1]), armZ).applyMatrix4(inv).sub(new THREE.Vector3(0, d.R, 0));
      return { a: base.a, b: [loc.x, loc.y, loc.z] as [number, number, number] };
    }
    const ang = arms?.[side];
    return ang !== undefined ? armPoints(kind, size, side, ang) : null;
  };
  const la = reach("l");
  const ra = reach("r");
  return (
    <>
      {shadow ? (
        <SoftShadow
          x={pivot[0]}
          y={wy(top + d.cyBox + d.R + dx * 0) - d.R * 0.12}
          w={d.R * (kind === "bact" ? 4.2 : 3.2) * shadowW * Math.min(1.1, p) * (1 + dy * 0.005)}
          op={Math.min(1, p) * (1 + dy * 0.01)}
          z={z - 60}
        />
      ) : null}
      <group position={pivot} quaternion={quat} scale={[sx, sy, (sx + sy) / 2]}>
        <group position={[0, d.R, 0]}>
          {kind === "bact" ? (
            <>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[d.R, d.seg, 10, 36]} />
                <meshPhysicalMaterial color={color} roughness={0.55} metalness={0} clearcoat={1} clearcoatRoughness={0.22} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[d.R + ow, d.seg, 10, 36]} />
                <Hullmat />
              </mesh>
            </>
          ) : (
            <>
              <mesh>
                <sphereGeometry args={[d.R, 48, 32]} />
                <meshPhysicalMaterial color={color} roughness={0.55} metalness={0} clearcoat={1} clearcoatRoughness={0.22} />
              </mesh>
              <mesh>
                <sphereGeometry args={[d.R + ow, 48, 32]} />
                <Hullmat />
              </mesh>
            </>
          )}
          <mesh geometry={sheen} renderOrder={3}>
            <meshBasicMaterial map={getSheenTex()} transparent depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-6} />
          </mesh>
          <mesh geometry={decal} renderOrder={2}>
            <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-4} />
          </mesh>
          {la ? <Limb a={la.a} b={la.b} r={armR} color={color} ow={ow * 0.8} hand={armR * (grip ? 1.9 : 1.6)} /> : null}
          {ra ? <Limb a={ra.a} b={ra.b} r={armR} color={color} ow={ow * 0.8} hand={armR * (grip ? 1.9 : 1.6)} /> : null}
        </group>
      </group>
    </>
  );
};

// ---------- Gerak bantu (semua murni fungsi t) ----------
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Memantul di tempat: dy negatif = naik. Gepeng halus saat mendarat, memanjang saat di udara.
export const hopMotion = (t: number, amp = 10, speed = 3, phase = 0, from = 0) => {
  const w = Math.min(1, Math.max(0, (t - from) / 0.4));
  const h = Math.abs(Math.sin(t * speed + phase));
  return { dy: -amp * h * w, squash: w * (0.07 * (1 - h) ** 6 - 0.035 * h) };
};

// Berayun pelan (rotasi derajat) dan menoleh (yaw).
export const sway = (t: number, deg = 4, speed = 2, phase = 0) => deg * Math.sin(t * speed + phase);

const slideP = (t: number, at: number, dur: number) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });

// Bergerak dari A ke B (kiri-atas px) dengan lompatan kecil; mengembalikan props untuk <Toy>.
export const mvToy = (t: number, from: readonly [number, number], to: readonly [number, number], at: number, dur = 0.8, hop = 0) => {
  const p = slideP(t, at, dur);
  const h = Math.abs(Math.sin(p * Math.PI * 3));
  const moving = p < 1 && t >= at;
  return {
    left: lerp(from[0], to[0], p),
    top: lerp(from[1], to[1], p) - (moving ? hop * h : 0),
    squash: moving ? 0.08 * (1 - h) ** 3 - 0.04 * h : 0,
    at,
  };
};

// Posisi kiri-atas (px) agar dasar badan berada di (bx, by). Untuk menaruh tokoh di atas benda.
export const standAt = (kind: Kind, size: number, bx: number, by: number) => {
  const d = dimOf(kind, size);
  return { left: bx - d.cxBox, top: by - d.cyBox - d.R };
};

// `top` agar titik 0,78 R di bawah pusat badan (bawah wajah) berada tepat di tinggi tali `ropeYc`.
export const topForRope = (kind: Kind, size: number, ropeYc: number) => {
  const d = dimOf(kind, size);
  return ropeYc - d.R * 0.78 - d.cyBox;
};

// Transparansi "shot" (mirip <Sh>) sebagai pengali skala 0..1 untuk tokoh 3D: muncul cepat, hilang cepat.
export const shotVis = (t: number, from = 0, to = 9999) =>
  Math.min(
    interpolate(t, [from, from + 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(t, [to - 0.05, to + 0.15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
