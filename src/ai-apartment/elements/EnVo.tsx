import { Audio } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import { BasicCaptions } from "../basic-captions";
import durations from "../vo-en/durations.json";
import spec from "../vo-en/spec.json";

type Clip = { id: string; text: string; at: number };

const durationOf = durations as Record<string, number>;
const sceneClips = spec.scenes as Record<string, Clip[]>;

type EnVoProps = {
  readonly scene: string;
  readonly layout: "vertical" | "horizontal";
};

// VO dan subtitle versi Inggris. Teks dan waktu mulai ada di vo-en/spec.json,
// audio dibuat oleh scripts/gen-vo-en.py.
export const EnVo: React.FC<EnVoProps> = ({ scene, layout }) => {
  const { fps } = useVideoConfig();
  const clips = sceneClips[scene];
  const vertical = layout === "vertical";

  return (
    <>
      {clips.map((clip) => (
        <Audio
          key={clip.id}
          name={`VO ${clip.id}`}
          from={clip.at * fps}
          src={staticFile(`ai-apartment/vo-en/${clip.id}.mp3`)}
        />
      ))}
      <BasicCaptions
        name={`Subtitle ${scene}`}
        width={vertical ? 960 : 1600}
        combineTokensWithinMilliseconds={0}
        style={
          vertical
            ? { position: "absolute", bottom: 290, translate: "60px 0px" }
            : { position: "absolute", bottom: 60, translate: "160px 0px" }
        }
        captions={clips.map((clip, i) => {
          const end = clip.at + durationOf[clip.id] + 0.25;
          const next = clips[i + 1]?.at ?? Infinity;
          return {
            text: ` ${clip.text}`,
            startMs: clip.at * 1000,
            endMs: Math.min(end, next) * 1000,
            timestampMs: null,
            confidence: null,
            pageBreakAfter: true,
          };
        })}
      />
    </>
  );
};
