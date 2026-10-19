import type React from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { colors, fonts } from "../theme";

// Lantai sesuai "Direktori gedung" di website demo, dari bawah (L) ke atas (06).
const floors = [
  { code: "L", label: "Lobi" },
  { code: "02", label: "Unit Hunian" },
  { code: "03", label: "Fasilitas bersama" },
  { code: "04", label: "Informasi gedung" },
  { code: "05", label: "Rencanakan menginap" },
  { code: "06", label: "Bicara dengan tim" },
];

type FloorDirectoryProps = {
  // Detik saat lift naik satu lantai (L → 02 → 03 …).
  readonly floorTimes: number[];
  readonly style?: React.CSSProperties;
};

// Panel "Direktori gedung" ala website: tombol lantai menyala sesuai lantai aktif.
const FloorDirectoryInner: React.FC<FloorDirectoryProps> = ({
  floorTimes,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let active = 0;
  floorTimes.forEach((time, i) => {
    if (t >= time) active = i + 1;
  });
  active = Math.min(active, floors.length - 1);
  const lastChange = active === 0 ? -10 : floorTimes[active - 1];
  const pulse = interpolate(t, [lastChange, lastChange + 0.3], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 32,
        borderRadius: 32,
        backgroundColor: colors.ink2,
        border: `2px solid ${colors.inkLine}`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 22,
          letterSpacing: "0.16em",
          color: colors.muted,
          marginBottom: 6,
        }}
      >
        DIREKTORI GEDUNG
      </div>
      {[...floors].reverse().map((floor) => {
        const isActive = floor.code === floors[active].code;
        return (
          <div
            key={floor.code}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "16px 22px",
              borderRadius: 18,
              backgroundColor: isActive ? colors.signal : "transparent",
              border: `2px solid ${isActive ? colors.signal : colors.inkLine}`,
              color: isActive ? colors.signalInk : colors.white,
              scale: isActive ? pulse : 1,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 30,
                width: 48,
                color: isActive ? colors.signalInk : colors.signal,
              }}
            >
              {floor.code}
            </div>
            <div style={{ fontFamily: fonts.heading, fontWeight: 500, fontSize: 28 }}>
              {floor.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const floorDirectorySchema = {
  floorTimes: {
    type: "array",
    item: { type: "number", min: 0, step: 0.1 },
    default: [1, 2],
    newItemDefault: 0,
    description: "Waktu naik ke lantai berikutnya (detik)",
  },
} as const satisfies InteractivitySchema;

export const FloorDirectory = Interactive.create({
  Component: FloorDirectoryInner,
  layout: "none",
  schema: floorDirectorySchema,
});
