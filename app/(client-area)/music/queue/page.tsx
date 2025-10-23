"use client";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Play, X, GripVertical } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import { cn } from "~/lib/utils";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function QueuePage() {
  const {
    currentTrack,
    queue,
    isPlaying,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useMusicPlayer();

  if (queue.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Queue is empty</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Add some tracks to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Queue</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {queue.length} tracks
            </p>
          </div>
          <Button variant="outline" onClick={clearQueue}>
            Clear Queue
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-121px)]">
        <div className="divide-y">
          {queue.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className={cn(
                "group hover:bg-muted/50 flex items-center gap-4 p-4 transition-colors",
                currentTrack?.id === track.id && "bg-muted",
              )}
            >
              <button
                onClick={() => playTrack(track)}
                className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded text-sm font-medium transition-colors"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <div className="flex gap-1">
                    <div className="h-4 w-1 animate-pulse bg-current" />
                    <div className="h-4 w-1 animate-pulse bg-current delay-75" />
                    <div className="h-4 w-1 animate-pulse bg-current delay-150" />
                  </div>
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </button>
              <img
                src={track.coverUrl || "/placeholder.svg"}
                alt={track.title}
                className="h-12 w-12 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{track.title}</p>
                <p className="text-muted-foreground truncate text-sm">
                  {track.artist}
                </p>
              </div>
              <span className="text-muted-foreground text-sm">
                {formatTime(track.duration)}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFromQueue(index)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
