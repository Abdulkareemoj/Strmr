import type React from "react";
import { MusicPlayerProvider } from "~/lib/music-player-context";
import { MusicNav } from "~/components/music/music-nav";
import { MusicPlayerBar } from "~/components/music/music-player-bar";
import { VidstackAudioPlayer } from "~/components/music/vidstack-audio-player";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicPlayerProvider>
      <div className="bg-background flex h-screen flex-col">
        <div className="flex flex-1 overflow-hidden">
          <MusicNav />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
        <MusicPlayerBar />
        <VidstackAudioPlayer />
      </div>
    </MusicPlayerProvider>
  );
}
