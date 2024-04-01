import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

export default function VideoPlayer() {
  return (
    <>
      <main>
        <MediaPlayer title="help" src="/An Overview of Agile Development.mp4  ">
          <MediaProvider />
          <PlyrLayout
            thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
            icons={plyrLayoutIcons}
          />
        </MediaPlayer>
      </main>
    </>
  );
}

{
  /* <video
        src={`/api/videos/?videoID=${id}`}
        width="auto"
        height="auto"
        controls
        id="video-player"
      /> */
}
