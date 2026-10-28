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

export const fonts = { heading, mono };

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
