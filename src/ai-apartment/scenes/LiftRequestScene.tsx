import { Audio } from "@remotion/media";
import {
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BasicCaptions } from "../basic-captions";
import { FloorIndicator } from "../elements/FloorIndicator";
import { RequestForm } from "../elements/RequestForm";
import { colors, fonts, sfx } from "../theme";

// Scene 5 (19,5–26 dtk): naik lift L → 02 → 05, pilih unit, kirim permintaan.
const LiftRequestSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <FloorIndicator
        name="Indikator lantai"
        arrivals={[0.6, 2.9]}
        floors={[
          { code: "L", label: "Lobi" },
          { code: "02", label: "Unit Hunian" },
          { code: "05", label: "Rencanakan menginap" },
        ]}
        style={{ position: "absolute", top: 170, left: 80, right: 80 }}
      />
      <Interactive.Div
        name="Teks pilih unit"
        style={{
          position: "absolute",
          top: 470,
          left: 80,
          right: 80,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 54,
          color: colors.white,
          opacity: interpolate(
            frame,
            [0.6 * fps, 0.9 * fps, 4.4 * fps, 4.6 * fps],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        Pilih unit <span style={{ color: colors.signal }}>→</span> Kirim
        permintaan
      </Interactive.Div>
      <Interactive.Div
        name="Teks tim leasing"
        style={{
          position: "absolute",
          top: 470,
          left: 80,
          right: 80,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 54,
          color: colors.signal,
          opacity: interpolate(frame, [4.6 * fps, 4.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Tim leasing follow up
      </Interactive.Div>
      <Interactive.Div
        name="Kartu unit"
        from={0.6 * fps}
        durationInFrames={2.3 * fps}
        style={{
          position: "absolute",
          top: 620,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 26,
          padding: 52,
          borderRadius: 40,
          backgroundColor: colors.ink2,
          border: `2px solid ${colors.inkLine}`,
          fontFamily: fonts.heading,
          color: colors.white,
          opacity: interpolate(frame, [0.6 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [0.6 * fps, 1 * fps],
            ["0px 60px", "0px 0px"],
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
            fontSize: 30,
            letterSpacing: "0.12em",
            color: colors.muted,
          }}
        >
          02 · TIPE UNIT
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          1 Bedroom Executive
        </div>
        <div style={{ fontSize: 40, color: colors.muted }}>
          48 m² · 1 kamar tidur · 1 kamar mandi
        </div>
        <div style={{ fontSize: 48, fontWeight: 500 }}>
          mulai IDR 1.050.000{" "}
          <span style={{ color: colors.muted }}>/ malam</span>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "28px 0",
            borderRadius: 999,
            textAlign: "center",
            fontSize: 42,
            fontWeight: 700,
            backgroundColor: frame >= 2.2 * fps ? colors.signal : "transparent",
            border: `2px solid ${colors.signal}`,
            color: frame >= 2.2 * fps ? colors.signalInk : colors.signal,
            scale: interpolate(
              frame,
              [2.15 * fps, 2.2 * fps, 2.3 * fps],
              [1, 0.94, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        >
          Pilih unit ini →
        </div>
      </Interactive.Div>
      <RequestForm
        name="Form permintaan sewa"
        from={2.9 * fps}
        stepTimes={[0.4, 0.8, 1.2, 1.6]}
        sentAt={2.6}
        style={{
          position: "absolute",
          top: 600,
          left: 80,
          right: 80,
          opacity: interpolate(frame, [2.9 * fps, 3.1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [2.9 * fps, 3.3 * fps],
            ["0px 60px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      />
      <Audio
        name="Ding lantai 02"
        from={0.6 * fps}
        src={sfx.ding}
        volume={0.5}
      />
      <Audio
        name="Klik pilih unit"
        from={2.2 * fps}
        src={sfx.click}
        volume={0.6}
      />
      <Audio
        name="Ding lantai 05"
        from={2.9 * fps}
        src={sfx.ding}
        volume={0.5}
      />
      <Audio name="Klik kirim" from={5.5 * fps} src={sfx.click} volume={0.7} />
      <Audio
        name="VO tamu naik lift"
        from={0.1 * fps}
        src={staticFile("ai-apartment/vo/s5a.wav")}
      />
      <Audio
        name="VO kirim permintaan"
        from={2.9 * fps}
        src={staticFile("ai-apartment/vo/s5b.wav")}
      />
      <Audio
        name="VO tim leasing"
        from={4.6 * fps}
        src={staticFile("ai-apartment/vo/s5c.wav")}
      />
      <BasicCaptions
        name="Subtitle scene 5"
        width={960}
        style={{ position: "absolute", bottom: 290, translate: "60px 0px" }}
        captions={[
          {
            text: " Tamu naik lift virtual, pilih unit,",
            startMs: 100,
            endMs: 2900,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " kirim permintaan sewa.",
            startMs: 2900,
            endMs: 4600,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Tim leasing tinggal follow up.",
            startMs: 4600,
            endMs: 6890,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const LiftRequestScene = Interactive.create({
  Component: LiftRequestSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
