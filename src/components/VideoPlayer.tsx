import "@vidstack/react/player/styles/base.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PlayIcon } from "@vidstack/react/icons";
function VideoPlayer({ id }: { id: string }) {
  return (
    <>
      <MediaPlayer
        title="Sprite Fight"
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
      >
        <MediaProvider />
      </MediaPlayer>
      <video
        src={`/api/videos/?videoID=${id}`}
        width="auto"
        height="auto"
        controls
        id="video-player"
      />
    </>
  );
}

export default VideoPlayer;
