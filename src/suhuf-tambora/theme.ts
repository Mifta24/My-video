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

// Palet sementara (belum ada palet resmi Suhuf Pengetahuan).
// Gelap kebiruan; dingin untuk 1816, hangat (oranye) HANYA untuk letusan.
export const colors = {
  bg: "#070B14",
  ocean: "#0A1222",
  land: "#1D2D50",
  landLine: "#4E6A9E",
  text: "#F2F6FF",
  muted: "#8FA0C0",
  cold: "#7CC4FF",
  coldDeep: "#2F7BD1",
  warm: "#FF8A3D",
  sun: "#FFE9A8",
};
