import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import { Caption } from "./Caption";
import { clipDuration, clipStart, getScene } from "../timing";

// Narasi satu adegan: satu <Audio> + subtitle per kalimat. Posisi dari durasi audio nyata (timing.ts).
// Subtitle kartun: kotak putih, teks tinta, tepi oranye (kontras tinggi), tepi bawah y ~1360, jauh di atas area UI bawah.
export const Voice: React.FC<{ readonly sceneId: string }> = ({ sceneId }) => {
  const { fps } = useVideoConfig();
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
          <Audio src={staticFile(`suhuf-pulau-run/vo/${clip.id}.mp3`)} />
          <Caption text={clip.text} durationSec={clipDuration(clip.id)} />
        </Sequence>
      ))}
    </>
  );
};
