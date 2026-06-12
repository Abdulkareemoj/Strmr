"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { ScrollArea } from "~/components/ui/scroll-area";
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
  MoreHorizontal,
  ChevronDown,
  ListMusic,
} from "lucide-react";
import { usePlayerStore } from "~/stores/player-store";
import { cn } from "~/lib/utils";
import Link from "next/link";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function NowPlayingPage() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    nextTrack,
    previousTrack,
    queue,
    togglePlayback,
    seekTo,
    setVolume,
    toggleMuted,
  } = usePlayerStore();
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No track playing</p>
          <Button asChild className="mt-4">
            <Link href="/music">Browse Music</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="from-muted/50 to-background flex h-full flex-col bg-gradient-to-b">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/music">
            <ChevronDown className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-sm font-medium">Now Playing</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          {/* Album Art */}
          <div className="mb-8 w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-2xl">
              <img
                src={currentTrack.coverUrl || "/placeholder.svg"}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Track Info */}
          <div className="mb-8 w-full max-w-md text-center">
            <h2 className="mb-2 text-3xl font-bold text-balance">
              {currentTrack.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {currentTrack.artist}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {currentTrack.album}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 w-full max-w-md">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={(value) => seekTo(value[0])}
              className="mb-2"
            />
            <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex w-full max-w-md items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn(isShuffled && "text-primary")}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={previousTrack}
              className="h-12 w-12"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button size="icon" className="h-16 w-16" onClick={togglePlayback}>
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={nextTrack}
              className="h-12 w-12"
            >
              <SkipForward className="h-6 w-6" />
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
              className={cn(repeatMode !== "off" && "text-primary")}
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex w-full max-w-md items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(isLiked && "text-primary")}
            >
              <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            </Button>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={toggleMuted}>
                {muted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : Math.round(volume * 100)]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0] / 100)}
                className="w-24"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowQueue(!showQueue)}
            >
              <ListMusic className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Queue Sidebar */}
        {showQueue && (
          <div className="bg-muted/30 w-80 border-l">
            <div className="border-b p-4">
              <h3 className="font-semibold">Queue</h3>
              <p className="text-muted-foreground text-sm">
                {queue.length} tracks
              </p>
            </div>
            <ScrollArea className="h-[calc(100%-73px)]">
              <div className="divide-y">
                {queue.map((track, index) => (
                  <div
                    key={track.id}
                    className={cn(
                      "hover:bg-muted/50 flex items-center gap-3 p-3 transition-colors",
                      currentTrack.id === track.id && "bg-muted",
                    )}
                  >
                    <div className="text-muted-foreground flex h-8 w-8 items-center justify-center text-sm">
                      {currentTrack.id === track.id && isPlaying ? (
                        <div className="flex gap-0.5">
                          <div className="bg-primary h-3 w-0.5 animate-pulse" />
                          <div className="bg-primary h-3 w-0.5 animate-pulse delay-75" />
                          <div className="bg-primary h-3 w-0.5 animate-pulse delay-150" />
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <img
                      src={track.coverUrl || "/placeholder.svg"}
                      alt={track.title}
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {track.title}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
