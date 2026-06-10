"use client";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play, Plus } from "lucide-react";
import { usePlayerStore } from "~/stores/player-store";
import { samplePlaylists } from "~/lib/sample-music-data";
import Link from "next/link";

export default function PlaylistsPage() {
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Playlists</h1>
          <p className="text-muted-foreground mt-1">Your curated collections</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {samplePlaylists.map((playlist) => (
          <Link key={playlist.id} href={`/music/playlists/${playlist.id}`}>
            <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={playlist.coverUrl || "/placeholder.svg"}
                  alt={playlist.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      playPlaylist(playlist);
                    }}
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 font-semibold">
                  {playlist.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {playlist.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
