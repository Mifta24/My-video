import { Composition, Folder } from "remotion";
import { LeadsVideo30, leadsTotalSeconds } from "./ai-apartment/LeadsVideo30";
import { ChatPair } from "./ai-apartment/elements/ChatPair";
import { FloorIndicator } from "./ai-apartment/elements/FloorIndicator";
import { IncomingBubble, NightClock } from "./ai-apartment/elements/NightChat";
import { RequestForm } from "./ai-apartment/elements/RequestForm";
import { Wordmark } from "./ai-apartment/elements/Wordmark";
import { AnswersScene } from "./ai-apartment/scenes/AnswersScene";
import { CtaScene } from "./ai-apartment/scenes/CtaScene";
import { LiftRequestScene } from "./ai-apartment/scenes/LiftRequestScene";
import { ProblemScene } from "./ai-apartment/scenes/ProblemScene";
import { RevealScene } from "./ai-apartment/scenes/RevealScene";
import { UnansweredScene } from "./ai-apartment/scenes/UnansweredScene";
import {
  YoutubeVideo,
  youtubeTotalSeconds,
} from "./ai-apartment/youtube/YoutubeVideo";
import { YtBrochureScene } from "./ai-apartment/youtube/YtBrochureScene";
import { YtChatScene } from "./ai-apartment/youtube/YtChatScene";
import { YtCtaScene } from "./ai-apartment/youtube/YtCtaScene";
import { YtCustomScene } from "./ai-apartment/youtube/YtCustomScene";
import { YtFormScene } from "./ai-apartment/youtube/YtFormScene";
import { YtLiftTourScene } from "./ai-apartment/youtube/YtLiftTourScene";
import { YtProblemScene } from "./ai-apartment/youtube/YtProblemScene";
import { YtRevealScene } from "./ai-apartment/youtube/YtRevealScene";
import { ShortsTeaser } from "./suhuf-tambora/ShortsTeaser";
import { shortsTotalFrames } from "./suhuf-tambora/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Suhuf-Pengetahuan-01-Tambora">
        <Composition
          id="Tambora-Shorts-Teaser"
          component={ShortsTeaser}
          durationInFrames={shortsTotalFrames()}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
      <Folder name="FTS-Apartment-AI">
        <Composition
          id="Leads30-Vertical"
          component={LeadsVideo30}
          durationInFrames={1170}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="YouTube-16x9"
          component={YoutubeVideo}
          durationInFrames={3447}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Leads30-Vertical-EN"
          component={LeadsVideo30}
          durationInFrames={Math.round(leadsTotalSeconds("en") * 30)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ lang: "en" as const }}
        />
        <Composition
          id="YouTube-16x9-EN"
          component={YoutubeVideo}
          durationInFrames={Math.round(youtubeTotalSeconds("en") * 30)}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ lang: "en" as const }}
        />
        <Folder name="Scenes-YouTube">
          <Composition
            id="YT1-Jam0200"
            component={YtProblemScene}
            durationInFrames={378}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#16171a" } }}
          />
          <Composition
            id="YT2-BrosurOnline"
            component={YtBrochureScene}
            durationInFrames={489}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#16171a" } }}
          />
          <Composition
            id="YT3-ProdukMuncul"
            component={YtRevealScene}
            durationInFrames={453}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="YT4-NaikLift"
            component={YtLiftTourScene}
            durationInFrames={432}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="YT5-TanyaAI"
            component={YtChatScene}
            durationInFrames={486}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="YT6-PermintaanSewa"
            component={YtFormScene}
            durationInFrames={642}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="YT7-GedungAnda"
            component={YtCustomScene}
            durationInFrames={291}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="YT8-CTA"
            component={YtCtaScene}
            durationInFrames={276}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
        </Folder>
        <Folder name="Scenes-30s">
          <Composition
            id="Scene1-Masalah"
            component={ProblemScene}
            durationInFrames={168}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#16171a" } }}
          />
          <Composition
            id="Scene2-TidakDibalas"
            component={UnansweredScene}
            durationInFrames={171}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#16171a" } }}
          />
          <Composition
            id="Scene3-ProdukMuncul"
            component={RevealScene}
            durationInFrames={252}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="Scene4-AIMenjawab"
            component={AnswersScene}
            durationInFrames={237}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="Scene5-LiftPermintaan"
            component={LiftRequestScene}
            durationInFrames={207}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
          <Composition
            id="Scene6-CTA"
            component={CtaScene}
            durationInFrames={135}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{ style: { backgroundColor: "#0d121c" } }}
          />
        </Folder>
        <Folder name="Elements">
          <Composition
            id="Wordmark"
            component={Wordmark}
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              size: 72,
              style: {
                position: "absolute",
                top: 900,
                left: 0,
                right: 0,
                justifyContent: "center",
              },
            }}
          />
          <Composition
            id="NightClock"
            component={NightClock}
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              fromMinutes: 120,
              toMinutes: 540,
              runStart: 0.3,
              runEnd: 2.2,
              style: {
                position: "absolute",
                top: 300,
                left: 0,
                right: 0,
                textAlign: "center",
              },
            }}
          />
          <Composition
            id="IncomingBubble"
            component={IncomingBubble}
            durationInFrames={60}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              children: "Sewa bulanan berapa?",
              status: "✓ Belum dibalas",
              style: { position: "absolute", top: 760, left: 100, right: 100 },
            }}
          />
          <Composition
            id="ChatPair"
            component={ChatPair}
            durationInFrames={72}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              question: "Ada gym 24 jam?",
              answer:
                "Ada. Gym di lantai 5 buka 24 jam, pakai kartu akses penghuni.",
              answerAt: 0.55,
              style: {
                position: "absolute",
                top: 780,
                left: 110,
                right: 110,
                width: "auto",
              },
            }}
          />
          <Composition
            id="FloorIndicator"
            component={FloorIndicator}
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              arrivals: [0.6, 2.4],
              floors: [
                { code: "L", label: "Lobi" },
                { code: "02", label: "Unit Hunian" },
                { code: "05", label: "Rencanakan menginap" },
              ],
              style: { position: "absolute", top: 170, left: 80, right: 80 },
            }}
          />
          <Composition
            id="RequestForm"
            component={RequestForm}
            durationInFrames={120}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              stepTimes: [0.4, 0.8, 1.2, 1.6],
              sentAt: 2.6,
              style: { position: "absolute", top: 600, left: 80, right: 80 },
            }}
          />
        </Folder>
      </Folder>
    </>
  );
};
