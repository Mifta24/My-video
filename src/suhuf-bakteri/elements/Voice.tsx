import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { clipDuration, clipStart, getScene } from "../timing";
import { Subtitle } from "./Subtitle";

// Narasi satu adegan: satu <Audio> + subtitle per kalimat, diposisikan dari timing.ts.
export const Voice: React.FC<{ readonly sceneId: string; readonly toonStyle?: boolean }> = ({
  sceneId,
  toonStyle = false,
}) => {
  const { fps, width } = useVideoConfig();
  const wide = width > 1500;
  const folder = sceneId.startsWith("s") ? "vo" : "vo-long";
  const scene = getScene(sceneId);
  return (
    <>
      {scene.clips.map((clip) => (
        <Sequence
          key={clip.id}
          from={Math.round(clipStart(sceneId, clip.id) * fps)}
          durationInFrames={Math.max(1, Math.round(clipDuration(clip.id) * fps))}
          layout="none"
          name={`VO · ${clip.id}`}
        >
          <Audio src={staticFile(`suhuf-bakteri/${folder}/${clip.id}.mp3`)} />
          <Subtitle
            text={clip.text}
            durationSec={clipDuration(clip.id)}
            bottom={wide ? 64 : 330}
            fontSize={wide ? 40 : toonStyle ? 56 : 52}
            maxWidth={wide ? 1500 : 920}
            maxChars={wide ? 60 : toonStyle ? 28 : 30}
            toonStyle={toonStyle}
          />
        </Sequence>
      ))}
    </>
  );
};
