import type React from "react";
import { toon } from "../../suhuf-bakteri/theme";
import { FlagG, GRASP_FLAG_TOP, GRASP_H, GRASP_W, GRASP_X0, GRASP_Y0, INK, Island } from "../shorts/kit2d";

// Tangan menggenggam pulau KHUSUS Long (draf 3). Shorts tetap memakai GraspedIsland di kit2d (tidak diubah).
// Draf 2 terbaca "sarung tangan": telapak bulat besar menelan dasar pulau + empat jari gemuk rapat. Draf 3 = GENGGAMAN
// SAMPING seperti memegang tepi piring: lengan masuk dari luar layar, punggung tangan di tepi luar pulau,
// IBU JARI di ATAS (rebah di rumput, menekan) dan EMPAT JARI di DEPAN/BAWAH tepi pulau (berlawanan dengan ibu jari),
// panjang jari berbeda (tengah terpanjang, kelingking terpendek), celah tinta tiap jari, kuku + buku jari.
// Dasar pulau (pasir) terlihat di sebagian besar lebar; hanya tepi luar yang tertutup tangan.
// Koordinat unit sama dengan GraspedIsland (pulau 400 lebar di x 0..400; tangan dari kiri; mirror = dari kanan).
export const GRASP_BOTTOM = 376; // unit: tepi bawah terendah (kelingking/lengan) termasuk tinta
const ISL_TOP = 60;

type F = { readonly bx: number; readonly by: number; readonly cx: number; readonly cy: number; readonly tx: number; readonly ty: number; readonly w: number };

export const GraspIslandL: React.FC<{
  readonly kind: "manhattan-en" | "run";
  readonly color: string;
  readonly dark: string;
  readonly k: number;
  readonly t: number;
  readonly squeeze?: number;
  readonly flag?: "en" | "nl";
  readonly mirror?: boolean;
  readonly lift?: number;
  readonly reach?: number;
  readonly thumbColor?: string; // draf 3b: warna ibu jari sedikit lebih terang (tangan biru: jempol menyatu dengan jari)
}> = ({ kind, color, dark, k, t, squeeze = 0, flag, mirror = false, lift = 0, reach = 0, thumbColor }) => {
  const sq = squeeze;
  // tiang di luar rumah (draf 2: tiang Inggris membelah rumah kecil)
  const poleX = 232;
  const poleBase = 236;
  const poleH = poleBase - GRASP_FLAG_TOP + lift;
  const a0 = -420 - reach;
  const a1 = -400 - reach;
  const wristY = 292;
  const d = 3 * sq; // ujung jari menekan saat meremas
  // empat jari di depan tepi pulau (dari punggung tangan ke kanan), berlapis: kelingking paling belakang
  const fingers: readonly F[] = [
    { bx: 40, by: 340, cx: 82, cy: 344, tx: 104 - sq * 3, ty: 356 + d, w: 25 }, // kelingking (terpendek)
    { bx: 46, by: 316, cx: 104, cy: 316, tx: 136 - sq * 3, ty: 330 + d, w: 29 }, // manis
    { bx: 50, by: 290, cx: 118, cy: 288, tx: 154 - sq * 4, ty: 302 + d, w: 31 }, // tengah (terpanjang)
    { bx: 50, by: 264, cx: 106, cy: 260, tx: 138 - sq * 3, ty: 274 + d, w: 29 }, // telunjuk
  ];
  const fd = (f: F) => `M${f.bx},${f.by} Q${f.cx},${f.cy} ${f.tx},${f.ty}`;
  // ibu jari di atas pulau: keluar dari atas punggung tangan, rebah di rumput, ujung menekan
  // draf 3b: ibu jari diangkat 12 unit -> celah nyata ke telunjuk (draf 3: tepi tinta ibu jari & telunjuk bersentuhan)
  const thumb = `M8,238 Q28,182 ${112 + sq * 3},${202 + sq * 4}`;
  const ang = (f: F) => Math.atan2(f.ty - f.cy, f.tx - f.cx);
  return (
    <svg width={GRASP_W * k} height={GRASP_H * k} viewBox={`${GRASP_X0} ${GRASP_Y0} ${GRASP_W} ${GRASP_H}`} style={{ overflow: "visible", display: "block" }}>
      <g transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
        {/* bayangan jatuh di bawah pulau */}
        <ellipse cx={210} cy={360} rx={180} ry={12} fill="#0C3140" opacity={0.22} />
        <g transform={`translate(0 ${ISL_TOP})`}>
          <Island kind={kind} w={400} t={t} bare detail={1.12} detailDy={(-lift * 300) / 400} longLayout />
        </g>
        {flag ? (
          <g transform={`translate(${poleX} ${poleBase})`}>
            <line x1={0} y1={0} x2={0} y2={-poleH} stroke={INK} strokeWidth={14} strokeLinecap="round" />
            <line x1={0} y1={0} x2={0} y2={-poleH} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <ellipse cx={0} cy={2} rx={12} ry={5} fill="#0C3140" opacity={0.3} />
            <circle cx={0} cy={-poleH - 2} r={9.5} fill={toon.yellow} stroke={INK} strokeWidth={4.5} />
            {/* draf 3b: bendera Belanda (mirror) berkibar ke TENGAH layar, menjauh dari rumah (draf 3: menutupi atap).
                Belang horizontal simetris, jadi ikut dicerminkan tanpa salah gambar. */}
            <g transform={`translate(${mirror && flag !== "nl" ? -7 : 7} ${-poleH + 5}) scale(${mirror && flag !== "nl" ? -1 : 1} 1) skewY(${5 * Math.sin(t * 5)}) scale(1.4)`}>
              <FlagG kind={flag} />
            </g>
          </g>
        ) : null}
        {/* lengan (masuk dari luar layar) */}
        <path d={`M${a0},${wristY + 10} L-20,${wristY + 10}`} stroke={INK} strokeWidth={122} fill="none" />
        <path d={`M${a0},${wristY + 10} L-16,${wristY + 10}`} stroke={color} strokeWidth={108} fill="none" />
        <path d={`M${a1},${wristY - 26} L-90,${wristY - 26}`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.45} />
        <path d={`M${a1},${wristY + 44} L-90,${wristY + 44}`} fill="none" stroke={dark} strokeWidth={11} strokeLinecap="round" opacity={0.4} />
        {/* bayangan kontak jari di tepi pulau */}
        {fingers.map((f, i) => (
          <path key={`s${i}`} d={fd(f)} transform="translate(6 7)" fill="none" stroke="#0C3140" strokeWidth={f.w + 8} strokeLinecap="round" opacity={0.2} />
        ))}
        <path d={thumb} transform="translate(5 8)" fill="none" stroke="#0C3140" strokeWidth={40} strokeLinecap="round" opacity={0.22} />
        {/* punggung tangan */}
        <ellipse cx={14} cy={298} rx={56} ry={70} fill={color} stroke={INK} strokeWidth={13} />
        <path d="M-18,262 Q-4,240 22,236" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.4} />
        {/* jari (kelingking dulu, telunjuk paling depan) */}
        {fingers.map((f, i) => {
          const a = ang(f);
          const nx = f.tx - Math.cos(a) * f.w * 0.16;
          const ny = f.ty - Math.sin(a) * f.w * 0.16;
          return (
            <g key={`f${i}`}>
              <path d={fd(f)} fill="none" stroke={INK} strokeWidth={f.w + 13} strokeLinecap="round" />
              <path d={fd(f)} fill="none" stroke={color} strokeWidth={f.w} strokeLinecap="round" />
              <path d={`M${f.bx + 18},${f.by - f.w * 0.26} Q${f.cx},${f.cy - f.w * 0.3} ${f.tx - 12},${f.ty - f.w * 0.3}`} fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" opacity={0.35} />
              {/* buku jari di pangkal + ruas tengah */}
              <path d={`M${f.bx + 14},${f.by - f.w * 0.42} Q${f.bx + 8},${f.by} ${f.bx + 14},${f.by + f.w * 0.42}`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.5} />
              <path d={`M${f.cx - 4},${f.cy - f.w * 0.4} Q${f.cx - 10},${f.cy} ${f.cx - 4},${f.cy + f.w * 0.4}`} fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" opacity={0.45} />
              {/* kuku */}
              <ellipse cx={nx} cy={ny} rx={f.w * 0.3} ry={f.w * 0.24} transform={`rotate(${(a * 180) / Math.PI} ${nx} ${ny})`} fill="#fff" opacity={0.6} stroke={INK} strokeWidth={3} strokeOpacity={0.45} />
            </g>
          );
        })}
        {/* ibu jari di atas pulau. draf 3b: celah terang (krem) di antara ibu jari dan telunjuk + bayangan gelap di
            bawah ibu jari supaya ibu jari terbaca sebagai digit TERPISAH (bukan jari kelima), juga pada warna biru */}
        <path d="M34,240 Q66,228 108,232" fill="none" stroke="#FFF4DE" strokeWidth={12} strokeLinecap="round" />
        <path d={thumb} transform="translate(0 6)" fill="none" stroke={INK} strokeWidth={58} strokeLinecap="round" />
        <path d={thumb} fill="none" stroke={INK} strokeWidth={52} strokeLinecap="round" />
        <path d={thumb} fill="none" stroke={thumbColor ?? color} strokeWidth={38} strokeLinecap="round" />
        <path d={`M22,242 Q44,212 ${100 + sq * 3},${214 + sq * 4}`} fill="none" stroke={dark} strokeWidth={8} strokeLinecap="round" opacity={0.55} />
        <path d="M18,224 Q38,194 80,192" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.4} />
        <ellipse cx={104 + sq * 3} cy={201 + sq * 4} rx={12} ry={9} transform={`rotate(8 ${104 + sq * 3} ${201 + sq * 4})`} fill="#fff" opacity={0.65} stroke={INK} strokeWidth={3} strokeOpacity={0.45} />
        <path d="M52,194 Q58,206 54,218" fill="none" stroke={INK} strokeWidth={3.6} strokeLinecap="round" opacity={0.5} />
        {/* manset putih di pergelangan */}
        <rect x={-74} y={wristY + 10 - 70} width={44} height={140} rx={18} fill="#fff" stroke={INK} strokeWidth={8} />
        <path d={`M-58,${wristY + 10 - 50} L-58,${wristY + 10 + 50}`} stroke={dark} strokeWidth={5} strokeLinecap="round" opacity={0.35} />
      </g>
    </svg>
  );
};
