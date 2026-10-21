import type React from "react";
import {
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { useL } from "../i18n";
import { fonts } from "../theme";

type SiteMockupProps = {
  // Detik saat foto, daftar harga, dan nomor telepon disorot berurutan. -1 = tidak disorot.
  readonly highlightTimes: number[];
  readonly style?: React.CSSProperties;
};

// Website apartemen generik ("brosur online"): abu-abu datar, tanpa lime.
const SiteMockupInner: React.FC<SiteMockupProps> = ({
  highlightTimes,
  style,
}) => {
  const L = useL();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ring = (i: number): React.CSSProperties => {
    const at = highlightTimes[i] ?? -1;
    const on = at >= 0 && t >= at;
    return {
      outline: `4px solid rgba(236, 238, 241, ${on ? interpolate(t, [at, at + 0.25], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0})`,
      outlineOffset: 8,
      borderRadius: 12,
    };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#d9dadd",
        boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#3a3c41",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 20px",
          backgroundColor: "#bfc1c5",
        }}
      >
        {["#9a9ca1", "#9a9ca1", "#9a9ca1"].map((c, i) => (
          <div
            key={i}
            style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            padding: "8px 18px",
            borderRadius: 8,
            backgroundColor: "#e6e7e9",
            fontFamily: fonts.mono,
            fontSize: 20,
            color: "#6d7076",
          }}
        >
          {L("www.apartemen-kota.com", "www.city-apartments.com")}
        </div>
      </div>
      <div style={{ display: "flex", gap: 36, padding: 40 }}>
        <div style={{ flex: 1.2, ...ring(0) }}>
          <Img
            src={staticFile("ai-apartment/lobby.jpg")}
            style={{
              width: "100%",
              height: 330,
              objectFit: "cover",
              borderRadius: 12,
              filter: "grayscale(1) brightness(0.9)",
            }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>
            {L("Apartemen Kota", "City Apartments")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 6, ...ring(1) }}>
            {[
              ["Studio", L("Rp 650.000 / malam", "IDR 650,000 / night")],
              ["1 Bedroom", L("Rp 1.050.000 / malam", "IDR 1,050,000 / night")],
              ["2 Bedroom", L("Rp 1.750.000 / malam", "IDR 1,750,000 / night")],
            ].map(([unit, price]) => (
              <div
                key={unit}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  whiteSpace: "nowrap",
                  fontSize: 24,
                  paddingBottom: 10,
                  borderBottom: "2px solid #c4c6ca",
                }}
              >
                <span>{unit}</span>
                <span>{price}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 26, padding: 6, ...ring(2) }}>
            {L("☎ Hubungi: (021) 555-0100", "☎ Call: (021) 555-0100")}
          </div>
        </div>
      </div>
    </div>
  );
};

const siteMockupSchema = {
  highlightTimes: {
    type: "array",
    item: { type: "number", min: -1, step: 0.1 },
    default: [-1, -1, -1],
    newItemDefault: -1,
    description: "Waktu sorot foto, harga, telepon (detik)",
  },
} as const satisfies InteractivitySchema;

export const SiteMockup = Interactive.create({
  Component: SiteMockupInner,
  layout: "none",
  schema: siteMockupSchema,
});
