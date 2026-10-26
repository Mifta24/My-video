import type React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Subtitle } from "../elements/Subtitle";
import { Watermark } from "../elements/Watermark";
import { colors } from "../theme";
import {
  GAP,
  clipDuration,
  clipStartInScene,
  sceneDurationFrames,
  sceneStarts,
  scenes,
  FPS,
} from "./timing";
import { SceneSfx } from "./sfx";
import { Visual } from "./Visual";

const LongScene: React.FC<{ scene: (typeof scenes)[number] }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const speech = scene.clips.reduce((n, c) => n + clipDuration(c.id) + GAP, 0);
  const progress = Math.min(1, frame / (speech * FPS));
  const clips = scene.clips;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Visual sceneId={scene.id} progress={progress} t={frame / FPS} />
      <SceneSfx sceneId={scene.id} />
      {clips.map((clip, i) => {
        const from = clipStartInScene(clips, i);
        const dur = Math.max(1, Math.round(clipDuration(clip.id) * FPS));
        return (
          <Sequence
            key={clip.id}
            from={from}
            durationInFrames={dur}
            layout="none"
            name={`VO · ${clip.id}`}
          >
            <Audio src={staticFile(`suhuf-tambora/vo-long/${clip.id}.mp3`)} />
            <Subtitle
              text={clip.text}
              startSec={0}
              durationSec={clipDuration(clip.id)}
              bottom={82}
              fontSize={40}
              maxWidth={1540}
              maxChars={58}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const LongVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    {scenes.map((scene, i) => (
      <Sequence
        key={scene.id}
        from={sceneStarts[i]}
        durationInFrames={sceneDurationFrames(scene)}
        layout="none"
        name={`${scene.id.toUpperCase()} · ${scene.title}`}
      >
        <LongScene scene={scene} />
      </Sequence>
    ))}
    <Watermark wide />
  </AbsoluteFill>
);
