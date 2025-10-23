"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Maximize2,
} from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import { cn } from "~/lib/utils";
import Link from "next/link";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MusicPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    playerRef,
    queue,
  } = useMusicPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const updateTime = () => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration);
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.volume = volume / 100;
      player.muted = isMuted;
    }
  }, [volume, isMuted, playerRef]);

  const handleSeek = (value: number[]) => {
    const player = playerRef.current;
    if (player) {
      player.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur sticky bottom-0 w-full">
      <div className="px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-muted-foreground text-xs tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <img
              src={currentTrack.coverUrl || "/placeholder.svg"}
              alt={currentTrack.title}
              className="h-14 w-14 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{currentTrack.title}</p>
              <p className="text-muted-foreground truncate text-sm">
                {currentTrack.artist}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(isLiked && "text-primary")}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            </Button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn("hidden sm:flex", isShuffled && "text-primary")}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={previousTrack}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="h-10 w-10" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>
            <Button size="icon" variant="ghost" onClick={nextTrack}>
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setRepeatMode(
                  repeatMode === "off"
                    ? "all"
                    : repeatMode === "all"
                      ? "one"
                      : "off",
                )
              }
              className={cn(
                "hidden sm:flex",
                repeatMode !== "off" && "text-primary",
              )}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume & Actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="hidden md:flex"
            >
              <Link href="/music/queue">
                <ListMusic className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="hidden md:flex"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setVolume(value[0]);
                setIsMuted(false);
              }}
              className="hidden w-24 lg:flex"
            />
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="hidden lg:flex"
            >
              <Link href="/music/now-playing">
                <Maximize2 className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
