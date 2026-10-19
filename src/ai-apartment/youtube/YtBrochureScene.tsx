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
import { Cursor } from "../elements/Cursor";
import { SiteMockup } from "../elements/SiteMockup";
import { fonts, sfx } from "../theme";

// YouTube Scene 2: website biasa hanya brosur online, dibalas jam kerja.
const YtBrochureSceneInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      <Interactive.Div
        name="Teks brosur online"
        style={{
          position: "absolute",
          top: 70,
          left: 96,
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 92,
          color: "#eceef1",
          opacity: interpolate(frame, [0.4 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Brosur online.
      </Interactive.Div>
      <SiteMockup
        name="Website brosur"
        highlightTimes={[3.8, 4.7, 5.9]}
        style={{
          position: "absolute",
          top: 240,
          left: 260,
          width: 1400,
          opacity: interpolate(frame, [13 * fps, 14 * fps], [1, 0.25], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Badge dibalas jam kerja"
        style={{
          position: "absolute",
          top: 190,
          right: 200,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "22px 38px",
          borderRadius: 999,
          backgroundColor: "#eceef1",
          color: "#26282d",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 44,
          rotate: "-3deg",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          opacity: interpolate(frame, [10.6 * fps, 10.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10.6 * fps, 11 * fps], [1.4, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        Dibalas jam kerja
        <span style={{ fontFamily: fonts.mono, fontWeight: 500, fontSize: 32 }}>
          09.00–17.00
        </span>
      </Interactive.Div>
      <Cursor
        name="Kursor"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: interpolate(frame, [0.6 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [
              0.6 * fps,
              1 * fps,
              3.8 * fps,
              4.7 * fps,
              5.9 * fps,
              13 * fps,
              14.5 * fps,
            ],
            [
              "1100px 820px",
              "1000px 700px",
              "700px 500px",
              "1300px 470px",
              "1150px 650px",
              "1150px 650px",
              "2000px 900px",
            ],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.45, 0, 0.55, 1),
            },
          ),
        }}
      />
      <Audio name="Klik kursor" from={1 * fps} src={sfx.click} volume={0.6} />
      <Audio
        name="VO s2a"
        from={0.2 * fps}
        src={staticFile("ai-apartment/vo-yt/s2a.mp3")}
      />
      <Audio
        name="VO s2b"
        from={3.6 * fps}
        src={staticFile("ai-apartment/vo-yt/s2b.mp3")}
      />
      <Audio
        name="VO s2c"
        from={7.5 * fps}
        src={staticFile("ai-apartment/vo-yt/s2c.mp3")}
      />
      <Audio
        name="VO s2d"
        from={12.9 * fps}
        src={staticFile("ai-apartment/vo-yt/s2d.mp3")}
      />
      <BasicCaptions
        name="Subtitle s2"
        width={1600}
        combineTokensWithinMilliseconds={0}
        style={{ position: "absolute", bottom: 60, translate: "160px 0px" }}
        captions={[
          {
            text: " Website apartemen biasanya",
            startMs: 300,
            endMs: 1985,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " hanya brosur online.",
            startMs: 1985,
            endMs: 3700,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Foto, daftar harga, dan nomor telepon.",
            startMs: 3700,
            endMs: 7600,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Kalau pertanyaannya tidak ada di halaman,",
            startMs: 7600,
            endMs: 10212,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " calon penyewa harus menunggu jam kerja.",
            startMs: 10212,
            endMs: 13000,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " Dan bisa jadi dia sudah pindah",
            startMs: 13000,
            endMs: 14752,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
          {
            text: " ke tempat lain.",
            startMs: 14752,
            endMs: 16280,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          },
        ]}
      />
    </>
  );
};

export const YtBrochureScene = Interactive.create({
  Component: YtBrochureSceneInner,
  layout: "absolute-fill",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
