import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { WorldMap } from "../elements/WorldMap";
import { Subtitle } from "../elements/Subtitle";
import { clamp, easeOut, useSceneTime } from "../elements/common";
import { NEW_ENGLAND, SWISS, TAMBORA, WORLD_VIEW } from "../geo";
import { LEAD, clipText, sceneFrames, voSeconds } from "../timing";
import { colors, fonts } from "../theme";

// S1 · Hook. "APRIL 1815" geser ke "JUNI 1816"; garis putus-putus Sumbawa → Eropa & Amerika Utara.
export const SceneS1: React.FC = () => {
  const total = sceneFrames("s1");
  const { t, opacity } = useSceneTime(total);
  const swap = interpolate(t, [4.4, 5.0], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const dotPulse = 0.6 + 0.4 * Math.sin(t * 6);
  const line1 = interpolate(t, [4.8, 6.4], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const line2 = interpolate(t, [5.2, 7.0], [0, 1], {
    ...clamp,
    easing: easeOut,
  });
  const dotOn = interpolate(t, [1.0, 1.4], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: colors.bg }}>
      <WorldMap
        view={WORLD_VIEW}
        landOpacity={interpolate(t, [0.2, 1.4], [0, 1], clamp)}
      >
        {(s) => {
          const [ax, ay] = s(TAMBORA.lon, TAMBORA.lat);
          const [bx, by] = s(SWISS.lon, SWISS.lat);
          const [cx, cy] = s(NEW_ENGLAND.lon, NEW_ENGLAND.lat);
          const arc = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            lift: number,
          ) => {
            const mx = (x1 + x2) / 2;
            const my = Math.min(y1, y2) - lift;
            return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
          };
          return (
            <>
              <path
                d={arc(ax, ay, bx, by, 110)}
                fill="none"
                stroke={colors.cold}
                strokeWidth={4}
                strokeDasharray="14 12"
                opacity={line1}
                style={{ clipPath: `inset(0 ${100 - line1 * 100}% 0 0)` }}
              />
              <path
                d={arc(ax, ay, cx, cy, 400)}
                fill="none"
                stroke={colors.cold}
                strokeWidth={4}
                strokeDasharray="14 12"
                opacity={line2}
                style={{ clipPath: `inset(0 0 0 ${100 - line2 * 100}%)` }}
              />
              <circle
                cx={ax}
                cy={ay}
                r={26 * dotPulse}
                fill={colors.warm}
                opacity={0.25 * dotOn}
              />
              <circle
                cx={ax}
                cy={ay}
                r={11}
                fill={colors.warm}
                opacity={dotOn}
              />
              <circle
                cx={bx}
                cy={by}
                r={9}
                fill={colors.cold}
                opacity={line1}
              />
              <circle
                cx={cx}
                cy={cy}
                r={9}
                fill={colors.cold}
                opacity={line2}
              />
            </>
          );
        }}
      </WorldMap>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 420,
          height: 160,
          overflow: "hidden",
          fontFamily: fonts.heading,
          fontWeight: 700,
          fontSize: 130,
          textAlign: "center",
          color: colors.text,
        }}
      >
        <div
          style={{
            translate: `0px ${-160 * swap}px`,
            height: 160,
            lineHeight: "160px",
            color: colors.warm,
          }}
        >
          APRIL 1815
        </div>
        <div
          style={{
            translate: `0px ${-160 * swap}px`,
            height: 160,
            lineHeight: "160px",
            color: colors.cold,
          }}
        >
          JUNI 1816
        </div>
      </div>

      <Audio
        name="VO s1"
        from={Math.round(LEAD * 30)}
        src={staticFile("suhuf-tambora/vo/s1.mp3")}
      />
      <Subtitle
        text={clipText("s1")}
        startSec={LEAD}
        durationSec={voSeconds("s1")}
      />
    </AbsoluteFill>
  );
};
