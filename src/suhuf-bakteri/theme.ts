import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: heading } = loadSpaceGrotesk("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

const { fontFamily: mono } = loadIBMPlexMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

const { fontFamily: fredoka } = loadFredoka("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

export const fonts = { heading, mono, toon: fredoka };

// Palet script #02 (Bagian 3): navy gelap latar, oranye = bakteri / data utama,
// krem = sel manusia. Biru-abu hanya untuk garis dan teks sekunder.
export const colors = {
  bg: "#081022",
  bgDeep: "#050A17",
  panel: "#0F1B38",
  line: "#2B3D6B",
  lineSoft: "#1C2A4F",
  text: "#F3F5FB",
  muted: "#8E9CC0",
  orange: "#FF8A3D",
  orangeSoft: "#FFB37D",
  orangeDim: "#7A4526",
  cream: "#F4E9D4",
  creamDim: "#8D8676",
  body: "#16244A",
  bodyLine: "#3A5088",
};

// Palet kartun cerah (Shorts V3 ramah pemula): latar krem hangat, aksen oranye dan biru.
// Sengaja terpisah dari `colors` supaya video panjang (versi lama) tidak berubah.
export const toon = {
  bg: "#FFF4DE",
  bgWarm: "#FFE7BE",
  ink: "#2B2D42",
  inkSoft: "#5C5F7A",
  white: "#FFFFFF",
  orange: "#FF8A3D",
  orangeDark: "#E4601A",
  orangeLight: "#FFC38F",
  blue: "#4C9BEA",
  blueDark: "#2C6DBE",
  blueLight: "#BFDDFB",
  yellow: "#FFD166",
  green: "#8FD18A",
  red: "#EF4B4B",
  skin: "#FFD3B0",
  seat: "#F3E3C0",
  concourse: "#CDB78F",
};
