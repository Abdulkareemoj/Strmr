"use client";

import { useState } from "react";
import {
  MediaPlayer,
  MediaProvider,
  useMediaRemote,
  useMediaState,
} from "@vidstack/react";
import "@vidstack/react/player/styles/base.css";
import { usePlayerStore } from "~/stores/player-store";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const nextTrack = usePlayerStore((s) => s.nextTrack);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <MediaPlayer
        src={currentTrack.audioUrl}
        autoPlay
        crossOrigin="anonymous"
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full"
      >
        <MediaProvider />
        <PlayerBarContent />
      </MediaPlayer>
    </div>
  );
}

function PlayerBarContent() {
  const remote = useMediaRemote();
  const paused = useMediaState("paused");
  const currentTime = useMediaState("currentTime");
  const duration = useMediaState("duration");
  const volume = useMediaState("volume");
  const muted = useMediaState("muted");

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const previousTrack = usePlayerStore((s) => s.previousTrack);

  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverX, setHoverX] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayTime = isDragging ? hoverX : currentTime;

  const seekFromClientX = (clientX: number, rect: DOMRect) => {
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    remote.seek(percent * duration);
  };

  const seekFromPercent = (percent: number) => {
    remote.seek(Math.max(0, Math.min(1, percent)) * duration);
  };

  return (
    <div className="w-full bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur-sm">
      {/* Progress bar - full width */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        className={cn("group relative w-full cursor-pointer transition-all duration-75", isDragging && "h-1.5")}
        style={{ height: isDragging ? 6 : 3 }}
        onMouseDown={(e) => {
          setIsDragging(true);
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setHoverX(percent * duration);
        }}
        onMouseMove={(e) => {
          setIsHovering(true);
          const rect = e.currentTarget.getBoundingClientRect();
          setHoverX(Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration)));
        }}
        onMouseUp={(e) => {
          if (isDragging) {
            seekFromClientX(e.clientX, e.currentTarget.getBoundingClientRect());
            setIsDragging(false);
          }
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          if (isDragging) {
            setIsDragging(false);
          }
        }}
        onKeyDown={(e) => {
          const step = duration / 100;
          if (e.key === "ArrowRight") { seekFromPercent(progress / 100 + 0.01); e.preventDefault(); }
          if (e.key === "ArrowLeft") { seekFromPercent(progress / 100 - 0.01); e.preventDefault(); }
        }}
      >
        <div className="absolute inset-0 bg-muted/40" />
        <div
          className="absolute inset-y-0 left-0 bg-primary/20"
          style={{ width: `${isDragging || isHovering ? Math.max(progress, (hoverX / duration) * 100) : progress}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/30",
            "transition-opacity duration-150",
            isDragging || isHovering ? "opacity-100" : "opacity-0",
          )}
          style={{ left: `calc(${progress}% - 7px)` }}
        />
      </div>

      {/* Main bar */}
      <div className="flex h-[72px] items-center gap-4 px-4">
        {/* Left: Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded shadow-sm">
            <img
              src={currentTrack?.coverUrl || "/placeholder.svg"}
              alt={currentTrack?.title || ""}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">
              {currentTrack?.title}
            </p>
            <p className="text-muted-foreground truncate text-xs leading-tight">
              {currentTrack?.artist}
            </p>
          </div>
        </div>

        {/* Center: Playback controls */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={previousTrack}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => remote.togglePaused()}
            >
              {paused ? (
                <Play className="h-4 w-4 fill-current pl-0.5" />
              ) : (
                <Pause className="h-4 w-4 fill-current" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextTrack}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] tabular-nums leading-none">
            <span className="min-w-[28px] text-right">{formatTime(displayTime)}</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="min-w-[28px]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume + Actions */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <div className="hidden items-center gap-1 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => remote.toggleMuted()}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div
              role="slider"
              tabIndex={0}
              aria-label="Volume"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((muted ? 0 : volume) * 100)}
              className="relative h-1 w-20 cursor-pointer rounded-full bg-muted"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                remote.changeVolume(percent);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { remote.changeVolume(Math.min(1, volume + 0.05)); e.preventDefault(); }
                if (e.key === "ArrowLeft") { remote.changeVolume(Math.max(0, volume - 0.05)); e.preventDefault(); }
              }}
              onMouseMove={(e) => { e.stopPropagation(); }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${(muted ? 0 : volume) * 100}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `calc(${(muted ? 0 : volume) * 100}% - 6px)` }}
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/music/queue">
              <ListMusic className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href="/music/now-playing">
              <Maximize2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
