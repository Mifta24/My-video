import { Audio } from "@remotion/media";
import { Sfx } from "../elements/Sfx";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { Tag, clamp, easeOut, useSceneTime } from "../elements/common";
import { AtmosphereLayer, GROUND_Y, STRATO_Y } from "../three/Atmosphere";
import { LEAD, clipText, cue, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S3 · Penampang atmosfer SKEMATIS (3D, label tetap SVG): kolom naik, stratosfer, aerosol menyebar, sinar memantul.

const Step: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly n: string;
  readonly lines: string[];
  readonly o: number;
  readonly anchor?: "start" | "end";
}> = ({ x, y, n, lines, o, anchor = "start" }) => (
  <g opacity={o}>
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={colors.warm}
      fontFamily={fonts.heading}
      fontWeight={700}
      fontSize={38}
    >
      {n}
    </text>
    {lines.map((l, i) => (
      <text
        key={l}
        x={anchor === "start" ? x + 50 : x}
        y={y + i * 38}
        textAnchor={anchor}
        fill={colors.text}
        fontFamily={fonts.mono}
        fontWeight={500}
        fontSize={30}
        stroke={colors.bg}
        strokeWidth={8}
        paintOrder="stroke"
      >
        {l}
      </text>
    ))}
  </g>
);

export const SceneS3: React.FC = () => {
  const total = sceneFrames("s3");
  const { t, opacity } = useSceneTime(total);
  // Setiap langkah muncul saat frasanya diucapkan.
  const c1 = cue("s3", "Gas belerang", -0.3);
  const c2 = cue("s3", "jadi kabut", -0.2);
  const c3 = cue("s3", "memantulkan", -0.4);
  const c4 = cue("s3", "sehingga", -0.2);
  const col = interpolate(t, [c1, c1 + 2.6], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const spread = interpolate(t, [c2, c2 + 3.4], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const rays = interpolate(t, [c3, c3 + 1.2], [0, 1], clamp);
  const s1 = interpolate(t, [c1 + 0.4, c1 + 1.0], [0, 1], clamp);
  const s2 = interpolate(t, [c2 + 0.4, c2 + 1.0], [0, 1], clamp);
  const s4 = interpolate(t, [c4, c4 + 0.6], [0, 1], clamp);
  const sunDim = 1 - 0.55 * interpolate(t, [c3, c4 + 2.0], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <AtmosphereLayer
        t={t}
        col={col}
        spread={spread}
        rays={rays}
        sunDim={sunDim}
        dim={s4}
      />
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <text
          x={70}
          y={STRATO_Y + 60}
          fill={colors.text}
          fontFamily={fonts.mono}
          fontSize={38}
        >
          TROPOSFER (cuaca)
        </text>
        <text
          x={70}
          y={STRATO_Y - 24}
          fill={colors.cold}
          fontFamily={fonts.mono}
          fontSize={36}
        >
          STRATOSFER
        </text>

        <text
          x={60}
          y={GROUND_Y - 30}
          fill={colors.text}
          fontFamily={fonts.heading}
          fontWeight={700}
          fontSize={44}
        >
          Tambora
        </text>
        <Step
          x={630}
          y={1030}
          n="1"
          lines={["Letusan", "melontarkan gas", "belerang ke atas"]}
          o={s1}
        />
        <Step
          x={630}
          y={860}
          n="2"
          lines={["Gas jadi kabut", "partikel halus", "di stratosfer"]}
          o={s2}
        />
        <Step
          x={70}
          y={925}
          n="4"
          lines={["Sinar ke tanah", "berkurang: Bumi", "mendingin"]}
          o={s4}
        />
        <text
          x={80}
          y={340}
          textAnchor="start"
          fill={colors.sun}
          fontFamily={fonts.mono}
          fontSize={34}
          opacity={rays}
        >
          3 Matahari dipantulkan kembali
        </text>
      </svg>
      <Tag text="Skema" />
      <Sfx name="rumble" at={c1} volume={0.45} />
      <Sfx name="sweep-up" at={c1} volume={0.35} />
      <Sfx name="tick" at={c1 + 0.4} volume={0.35} />
      <Sfx name="shimmer" at={c2} volume={0.35} />
      <Sfx name="tick" at={c2 + 0.4} volume={0.35} />
      <Sfx name="whoosh" at={c3} volume={0.3} />
      <Sfx name="ding" at={c3 + 0.2} volume={0.3} />
      <Sfx name="dim-down" at={c4} volume={0.4} />
      <Sfx name="tick" at={c4} volume={0.35} />
      <Audio
        name="VO s3"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s3.mp3")}
      />
      <Subtitle
        text={clipText("s3")}
        startSec={LEAD}
        durationSec={voSeconds("s3")}
      />
    </AbsoluteFill>
  );
};
