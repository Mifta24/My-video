import type React from "react";
import { useMemo } from "react";
import * as THREE from "three";
import { toon } from "../theme";
import { Hullmat, ToyMat } from "../shorts/toy3d";

// Stadion 3D untuk perumpamaan (L-11, L-12, L-19). Papan tebal dari primitif Three.js, permukaan atas
// digambar ulang tiap frame di kanvas 2D (kursi, penonton oranye) lalu ditempel sebagai tekstur.
// Kamera "pelan" = pose grup (kemiringan, skala, geser) yang dihitung dari t. Tanpa aset unduhan.
const INK = toon.ink;
export const SW = 600; // lebar gambar stadion (satuan SVG draf 1)
export const SH = 520;
const K = 1.5; // satuan gambar -> px dunia
const D = 1080 / 2 / Math.tan((30 * Math.PI) / 360); // jarak kamera (FOV 30, tinggi 1080)
const THICK = 46;

const STANDS =
  "M170,20 L430,20 A150,150 0 0 1 580,170 L580,350 A150,150 0 0 1 430,500 L170,500 A150,150 0 0 1 20,350 L20,170 A150,150 0 0 1 170,20 Z M210,120 L390,120 A90,90 0 0 1 480,210 L480,310 A90,90 0 0 1 390,400 L210,400 A90,90 0 0 1 120,310 L120,210 A90,90 0 0 1 210,120 Z";

export type StadiumState = {
  readonly fill: number; // 0..1 penonton oranye menjalar dari tengah
  readonly mode?: "all" | "one"; // "one": hanya satu tribun (kanan) terisi
  readonly emptyCorner?: number; // 0..1 lingkaran kursi kosong di pojok kanan-atas
  readonly rows?: number; // 0..1 hanya satu deret kursi penuh (L-11)
};

export type StadiumPose = {
  readonly tilt: number; // rad, negatif = dilihat dari atas
  readonly scale: number;
  readonly x: number; // posisi pusat (px layar)
  readonly y: number;
  readonly yaw?: number; // rad, putar di bidang layar (rotasi z)
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

let seatPat: CanvasPattern | null = null;
let crowdPat: CanvasPattern | null = null;
const makePatterns = (ctx: CanvasRenderingContext2D) => {
  if (seatPat && crowdPat) {
    return;
  }
  const mk = (draw: (c: CanvasRenderingContext2D) => void) => {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    const g = c.getContext("2d");
    if (!g) {
      throw new Error("2D canvas tidak tersedia");
    }
    draw(g);
    const p = ctx.createPattern(c, "repeat");
    if (!p) {
      throw new Error("pattern gagal");
    }
    return p;
  };
  seatPat = mk((g) => {
    g.fillStyle = toon.seat;
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = "#E4CFA3";
    g.beginPath();
    g.roundRect(4, 8, 24, 16, 6);
    g.fill();
  });
  crowdPat = mk((g) => {
    g.fillStyle = toon.orangeLight;
    g.fillRect(0, 0, 32, 32);
    g.fillStyle = toon.orange;
    g.beginPath();
    g.arc(16, 14, 10, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = toon.orangeDark;
    g.beginPath();
    g.roundRect(6, 22, 20, 10, 5);
    g.fill();
  });
};

export const drawStadium = (canvas: HTMLCanvasElement, s: StadiumState) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas tidak tersedia");
  }
  makePatterns(ctx);
  const sc = canvas.width / SW;
  ctx.setTransform(sc, 0, 0, sc, 0, 0);
  ctx.clearRect(0, 0, SW, SH);
  ctx.lineJoin = "round";
  roundRect(ctx, 4, 4, 592, 512, 160);
  ctx.fillStyle = toon.concourse;
  ctx.fill();
  const stands = new Path2D(STANDS);
  ctx.fillStyle = seatPat as CanvasPattern;
  ctx.fill(stands, "evenodd");
  ctx.save();
  ctx.clip(stands, "evenodd");
  // penonton
  ctx.save();
  ctx.beginPath();
  if (s.mode === "one") {
    ctx.rect(430, 0, 200, SH);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(560, 260, s.fill * 330, 0, Math.PI * 2);
    ctx.clip();
  } else if (s.rows !== undefined && s.rows > 0 && s.fill < 0.02) {
    // satu deret kursi penuh (di sisi atas)
    ctx.rect(150, 22, 300 * s.rows, 22);
    ctx.clip();
  } else {
    ctx.arc(300, 260, s.fill * 520, 0, Math.PI * 2);
    ctx.clip();
  }
  ctx.fillStyle = crowdPat as CanvasPattern;
  ctx.fillRect(0, 0, SW, SH);
  ctx.restore();
  if (s.emptyCorner && s.emptyCorner > 0) {
    ctx.globalAlpha = s.emptyCorner;
    ctx.beginPath();
    ctx.arc(478, 92, 64, 0, Math.PI * 2);
    ctx.fillStyle = seatPat as CanvasPattern;
    ctx.fill();
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = toon.concourse;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.stroke(stands);
  ctx.lineWidth = 5;
  roundRect(ctx, 4, 4, 592, 512, 160);
  ctx.stroke();
  // lapangan
  roundRect(ctx, 120, 120, 360, 280, 90);
  ctx.fillStyle = "#8FD18A";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  roundRect(ctx, 150, 150, 300, 220, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(300, 150);
  ctx.lineTo(300, 370);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(300, 260, 36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
};

// Titik gambar (u, v) di stadion -> posisi layar (px) dan faktor skala perspektif, untuk menaruh overlay 2D.
export const stadiumProject = (pose: StadiumPose, u: number, v: number, W = 1920, H = 1080) => {
  const X = (u - SW / 2) * K;
  const Y = (SH / 2 - v) * K;
  const c = Math.cos(pose.tilt);
  const sn = Math.sin(pose.tilt);
  // rotasi x (tilt), lalu z (yaw), lalu skala dan geser
  let x = X;
  let y = Y * c;
  const z = Y * sn + THICK / 2;
  if (pose.yaw) {
    const cy = Math.cos(pose.yaw);
    const sy = Math.sin(pose.yaw);
    const nx = x * cy - y * sy;
    y = x * sy + y * cy;
    x = nx;
  }
  const wx = (pose.x - W / 2) + x * pose.scale;
  const wy = (H / 2 - pose.y) + y * pose.scale;
  const wz = z * pose.scale;
  const f = D / (D - wz);
  return { x: W / 2 + wx * f, y: H / 2 - wy * f, f: f * pose.scale * K };
};

export const Stadium3D: React.FC<{ readonly state: StadiumState; readonly pose: StadiumPose }> = ({ state, pose }) => {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 1040;
    return c;
  }, []);
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [canvas]);
  drawStadium(canvas, state);
  tex.needsUpdate = true;
  const slab = useMemo(() => {
    const w = SW * K - 10;
    const h = SH * K - 10;
    const r = 160 * K;
    const sh = new THREE.Shape();
    sh.moveTo(-w / 2 + r, -h / 2);
    sh.lineTo(w / 2 - r, -h / 2);
    sh.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false);
    sh.lineTo(w / 2, h / 2 - r);
    sh.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false);
    sh.lineTo(-w / 2 + r, h / 2);
    sh.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false);
    sh.lineTo(-w / 2, -h / 2 + r);
    sh.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false);
    return new THREE.ExtrudeGeometry(sh, { depth: THICK, bevelEnabled: false, curveSegments: 24 });
  }, []);
  return (
    <group position={[pose.x - 960, 540 - pose.y, 0]} rotation={[pose.tilt, 0, pose.yaw ?? 0]} scale={[pose.scale, pose.scale, pose.scale]}>
      <group position={[0, 0, -THICK / 2]}>
        <mesh geometry={slab}>
          <ToyMat color="#D9C39B" />
        </mesh>
        <mesh geometry={slab} scale={[1.012, 1.012, 1.04]} position={[0, 0, -1]}>
          <Hullmat />
        </mesh>
      </group>
      <mesh position={[0, 0, THICK / 2 + 0.6]}>
        <planeGeometry args={[SW * K, SH * K]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
};
