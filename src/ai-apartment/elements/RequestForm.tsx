import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { useL } from "../i18n";
import { colors, fonts } from "../theme";

type RequestFormProps = {
  // Detik (relatif ke awal elemen) saat tiap langkah berikutnya aktif.
  readonly stepTimes: number[];
  // Detik saat tombol "Kirim permintaan sewa" ditekan.
  readonly sentAt: number;
  readonly style?: React.CSSProperties;
};

// Label dan isi mengikuti form reservasi asli di website demo.
const stepsId = ["Tanggal", "Penghuni", "Unit", "Data Anda", "Ringkasan"];
const stepsEn = ["Dates", "Guests", "Unit", "Your details", "Summary"];
const rowsId = [
  { label: "Tanggal", value: "1 Nov – 1 Des · Bulanan" },
  { label: "Penghuni", value: "2 Dewasa" },
  { label: "Unit", value: "1 Bedroom Executive" },
  { label: "Data Anda", value: "Rina · WhatsApp" },
];
const rowsEn = [
  { label: "Dates", value: "1 Nov – 1 Dec · Monthly" },
  { label: "Guests", value: "2 Adults" },
  { label: "Unit", value: "1 Bedroom Executive" },
  { label: "Your details", value: "Rina · WhatsApp" },
];

const RequestFormInner: React.FC<RequestFormProps> = ({
  stepTimes,
  sentAt,
  style,
}) => {
  const L = useL();
  const steps = L(stepsId, stepsEn);
  const rows = L(rowsId, rowsEn);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let active = 0;
  stepTimes.forEach((time, i) => {
    if (t >= time) active = i + 1;
  });
  active = Math.min(active, steps.length - 1);
  const onSummary = active === steps.length - 1;
  const sent = t >= sentAt;
  const press = interpolate(
    t,
    [sentAt - 0.05, sentAt, sentAt + 0.12],
    [1, 0.94, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        padding: 48,
        borderRadius: 40,
        backgroundColor: colors.ink2,
        border: `2px solid ${colors.inkLine}`,
        fontFamily: fonts.heading,
        color: colors.white,
        ...style,
      }}
    >
      <div style={{ display: "flex", gap: 10 }}>
        {steps.map((step, i) => (
          <div
            key={step}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: i <= active ? colors.signal : colors.inkLine,
              }}
            />
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                color: i === active ? colors.signal : colors.muted,
                whiteSpace: "nowrap",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
        {steps[active]}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((row, i) => {
          const visibleAt = i === 0 ? 0.1 : stepTimes[i - 1];
          return (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 24,
                paddingBottom: 18,
                borderBottom: `2px solid ${colors.inkLine}`,
                opacity: interpolate(t, [visibleAt, visibleAt + 0.15], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(
                  t,
                  [visibleAt, visibleAt + 0.25],
                  ["24px 0px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                  },
                ),
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 28,
                  color: colors.muted,
                }}
              >
                {row.label}
              </div>
              <div style={{ fontSize: 40, fontWeight: 500 }}>{row.value}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          opacity: onSummary ? 1 : 0,
        }}
      >
        <div style={{ fontSize: 34, color: colors.signal }}>
          {L("Hemat 25% mulai 28 malam", "Save 25% from 28 nights")}
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.35, color: colors.muted }}>
          {L(
            "Ini adalah permintaan sewa, bukan kontrak.",
            "This is a rental request, not a contract.",
          )}
        </div>
        <div
          style={{
            alignSelf: "stretch",
            padding: "28px 0",
            borderRadius: 999,
            textAlign: "center",
            fontSize: 42,
            fontWeight: 700,
            backgroundColor: sent ? colors.white : colors.signal,
            color: colors.signalInk,
            scale: press,
          }}
        >
          {sent
            ? L("✓ Permintaan diterima", "✓ Request received")
            : L("Kirim permintaan sewa →", "Send rental request →")}
        </div>
      </div>
    </div>
  );
};

const requestFormSchema = {
  stepTimes: {
    type: "array",
    item: { type: "number", min: 0, step: 0.05 },
    default: [0.4, 0.8, 1.2, 1.6],
    newItemDefault: 0,
    description: "Waktu pindah ke langkah berikutnya (detik)",
  },
  sentAt: {
    type: "number",
    min: 0,
    step: 0.05,
    default: 2.6,
    description: "Tombol kirim ditekan (detik)",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const RequestForm = Interactive.create({
  Component: RequestFormInner,
  layout: "none",
  schema: requestFormSchema,
});
