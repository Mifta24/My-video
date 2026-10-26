import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { PhotoCard } from "../elements/PhotoCard";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { SUMBAWA_VIEW, TAMBORA, WORLD_VIEW, mixView } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S2 · Zoom ke Sumbawa, Tambora ditandai, lingkaran suara melebar. Tanpa gambar letusan.
export const SceneS2: React.FC = () => {
  const total = sceneFrames("s2");
  const { t, opacity } = useSceneTime(total);
  const z = interpolate(t, [0, 1.6], [0, 1], { ...clamp, easing: easeOut });
  const view = mixView(WORLD_VIEW, SUMBAWA_VIEW, z);
  const labelIn = interpolate(t, [1.4, 1.9], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <WorldMap
        view={view}
        landFill="#2C4372"
        landStroke="#9DBBEE"
        strokeWidth={2}
      >
        {(s) => {
          const [x, y] = s(TAMBORA.lon, TAMBORA.lat);
          const rings = [0, 1, 2].map((i) => {
            const p = ((t - 1.2 - i * 0.55) % 1.65) / 1.65;
            const on = t > 1.2 + i * 0.55 ? 1 : 0;
            return {
              r: 20 + Math.max(0, p) * 560,
              a: (1 - Math.max(0, p)) * 0.55 * on,
            };
          });
          return (
            <>
              {rings.map((r, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={r.r}
                  fill="none"
                  stroke={colors.warm}
                  strokeWidth={4}
                  opacity={r.a}
                />
              ))}
              <path
                d={`M ${x} ${y - 34} L ${x + 30} ${y + 14} L ${x - 30} ${y + 14} Z`}
                fill={colors.warm}
                opacity={labelIn}
              />
              <text
                x={x + 50}
                y={y - 6}
                fill={colors.text}
                fontFamily={fonts.heading}
                fontWeight={700}
                fontSize={64}
                opacity={labelIn}
                stroke={colors.bg}
                strokeWidth={12}
                paintOrder="stroke"
              >
                Tambora
              </text>
              <text
                x={x + 50}
                y={y + 40}
                fill={colors.text}
                fontFamily={fonts.mono}
                fontSize={38}
                opacity={labelIn}
                stroke={colors.bg}
                strokeWidth={10}
                paintOrder="stroke"
              >
                Sumbawa, 1815
              </text>
            </>
          );
        }}
      </WorldMap>
      <PhotoCard
        src="suhuf-tambora/photos/tambora-nasa-iss.jpg"
        caption="Kaldera Tambora hari ini · Foto: NASA (domain publik)"
        t={t}
        inAt={1.9}
        top={190}
        height={560}
        zoomFrom={1.0}
        zoomTo={1.1}
      />
      <Audio
        name="VO s2"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s2.mp3")}
      />
      <Subtitle
        text={clipText("s2")}
        startSec={LEAD}
        durationSec={voSeconds("s2")}
      />
    </AbsoluteFill>
  );
};
