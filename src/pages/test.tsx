// import VideoPlayer from "~/components/VideoPlayer";
// import { type GetServerSideProps } from "next";
// import { useRouter } from "next/router";

// export default function VideoPage() {
//   const router = useRouter();
//   const { videoId } = router.query as { videoId: string };

//   return <VideoPlayer id={videoId} />;
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: { query: context.query },
//   };
// };

// import "@vidstack/react/player/styles/base.css";

// import { useEffect, useRef } from "react";

// import {
//   isHLSProvider,
//   MediaPlayer,
//   MediaProvider,
//   Poster,
//   Track,
//   type MediaCanPlayDetail,
//   type MediaCanPlayEvent,
//   type MediaPlayerInstance,
//   type MediaProviderAdapter,
//   type MediaProviderChangeEvent,
// } from "@vidstack/react";

// import { VideoLayout } from "~/components/ui/vidstack/layouts/video-layout";
// // import { textTracks } from "./tracks";

// export default function Player() {
//   let player = useRef<MediaPlayerInstance>(null);

//   useEffect(() => {
//     // Subscribe to state updates.
//     return player.current!.subscribe(({ paused, viewType }) => {
//       // console.log('is paused?', '->', state.paused);
//       // console.log('is audio view?', '->', state.viewType === 'audio');
//     });
//   }, []);

//   function onProviderChange(
//     provider: MediaProviderAdapter | null,
//     nativeEvent: MediaProviderChangeEvent,
//   ) {
//     // We can configure provider's here.
//     if (isHLSProvider(provider)) {
//       provider.config = {};
//     }
//   }

//   // We can listen for the `can-play` event to be notified when the player is ready.
//   function onCanPlay(
//     detail: MediaCanPlayDetail,
//     nativeEvent: MediaCanPlayEvent,
//   ) {
//     // ...
//   }

//   return (
//     <MediaPlayer
//       className="ring-media-focus aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white data-[focus]:ring-4"
//       title="Sprite Fight"
//       src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
//       crossorigin
//       playsinline
//       onProviderChange={onProviderChange}
//       onCanPlay={onCanPlay}
//       ref={player}
//     >
//       <MediaProvider>
//         <Poster
//           className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
//           src="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200"
//           alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
//         />
//         {/* {textTracks.map((track) => (
//           <Track {...track} key={track.src} />
//         ))} */}
//       </MediaProvider>

//       <VideoLayout thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt" />
//     </MediaPlayer>
//   );
// }

import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

export default function Test() {
  return (
    <>
      <main>
        <MediaPlayer
          title="Sprite Fight"
          src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
        >
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
