"use client";

import { use } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Play, Heart, MoreHorizontal, Clock } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import { samplePlaylists } from "~/lib/sample-music-data";
import { notFound } from "next/navigation";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { playPlaylist, playTrack } = useMusicPlayer();

  const playlist = samplePlaylists.find((p) => p.id === id);

  if (!playlist) {
    notFound();
  }

  const totalDuration = playlist.tracks.reduce(
    (acc, track) => acc + track.duration,
    0,
  );

  return (
    <div className="h-full">
      {/* Playlist Header */}
      <div className="from-muted/50 to-background border-b bg-gradient-to-b p-6 lg:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <img
            src={playlist.coverUrl || "/placeholder.svg"}
            alt={playlist.title}
            className="h-48 w-48 rounded-lg object-cover shadow-2xl"
          />
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium uppercase">Playlist</p>
            <h1 className="mb-4 text-4xl font-bold text-balance lg:text-5xl">
              {playlist.title}
            </h1>
            <p className="text-muted-foreground mb-4">{playlist.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {playlist.tracks.length} songs
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {formatTime(totalDuration)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full"
            onClick={() => playPlaylist(playlist)}
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-transparent"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-transparent"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Track List */}
      <ScrollArea className="h-[calc(100%-320px)]">
        <div className="p-6 lg:p-8">
          <div className="text-muted-foreground mb-4 grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b pb-2 text-sm">
            <div className="w-8 text-center">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            {playlist.tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="hover:bg-muted/50 grid w-full grid-cols-[auto_1fr_auto_auto] gap-4 rounded-md p-2 text-left transition-colors"
              >
                <div className="text-muted-foreground flex w-8 items-center justify-center text-sm">
                  {index + 1}
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={track.coverUrl || "/placeholder.svg"}
                    alt={track.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{track.title}</p>
                    <p className="text-muted-foreground truncate text-sm">
                      {track.artist}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  {track.album}
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  {formatTime(track.duration)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
