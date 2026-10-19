import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { staticFile } from "remotion";

const { fontFamily: spaceGrotesk } = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

const { fontFamily: ibmPlexMono } = loadIBMPlexMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

// Subset Noto Sans JP yang hanya berisi karakter chat JA (font penuh terlalu
// banyak file dan membuat render timeout). Kalau teks Jepang diubah, unduh
// ulang subset lewat Google Fonts dengan parameter `text=`.
const notoSansJP = "Noto Sans JP Subset";
loadLocalFont({
  family: notoSansJP,
  url: staticFile("ai-apartment/fonts/noto-sans-jp-subset-400.woff2"),
  weight: "400",
});
loadLocalFont({
  family: notoSansJP,
  url: staticFile("ai-apartment/fonts/noto-sans-jp-subset-500.woff2"),
  weight: "500",
});

// Nilai warna diambil dari CSS website demo (apartment-ai.fts-tech.co.id).
export const colors = {
  ink: "#0d121c",
  ink2: "#151c29",
  inkLine: "#232c3d",
  signal: "#d7f75b",
  signalInk: "#1a2300",
  white: "#f8f9f6",
  muted: "#8a93a3",
  // Adegan "masalah": abu-abu netral, tanpa lime.
  gray: "#16171a",
  grayCard: "#26282d",
  grayText: "#9a9ca3",
};

export const fonts = {
  heading: `${spaceGrotesk}, ${notoSansJP}, sans-serif`,
  mono: `${ibmPlexMono}, ${notoSansJP}, monospace`,
};

export const sfx = {
  ding: "https://remotion.media/ding.wav",
  click: "https://remotion.media/mouse-click.wav",
  whoosh: "https://remotion.media/whoosh.wav",
};
