"use client";

import { useEffect } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { useMusicPlayer } from "~/lib/music-player-context";
import "@vidstack/react/player/styles/base.css";

export function VidstackAudioPlayer() {
  const { currentTrack, playerRef, nextTrack, isPlaying } = useMusicPlayer();

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleEnd = () => {
      nextTrack();
    };

    player.addEventListener("end", handleEnd);
    return () => player.removeEventListener("end", handleEnd);
  }, [nextTrack, playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !currentTrack) return;

    if (isPlaying) {
      player.play();
    }
  }, [currentTrack, isPlaying, playerRef]);

  if (!currentTrack) return null;

  return (
    <MediaPlayer
      ref={playerRef}
      src={currentTrack.audioUrl}
      className="hidden"
      autoPlay={isPlaying}
      crossOrigin="anonymous"
    >
      <MediaProvider />
    </MediaPlayer>
  );
}
