"use client";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import {
  sampleTracks,
  sampleAlbums,
  samplePlaylists,
} from "~/lib/sample-music-data";
import Link from "next/link";

export default function MusicHomePage() {
  const { playTrack, playAlbum, playPlaylist } = useMusicPlayer();

  return (
    <div className="p-4 lg:p-6">
      {/* Recently Played */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Recently Played</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sampleTracks.slice(0, 4).map((track) => (
            <Card
              key={track.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => playTrack(track)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={track.coverUrl || "/placeholder.svg"}
                  alt={track.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" className="h-14 w-14 rounded-full">
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <h3 className="mb-1 line-clamp-1 font-semibold">
                  {track.title}
                </h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {track.artist}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommended Albums */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recommended Albums</h2>
          <Button variant="ghost" asChild>
            <Link href="/music/albums">See all</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sampleAlbums.map((album) => (
            <Card
              key={album.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => playAlbum(album)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={album.coverUrl || "/placeholder.svg"}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" className="h-14 w-14 rounded-full">
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 font-semibold">
                  {album.title}
                </h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {album.artist}
                </p>
                <p className="text-muted-foreground text-xs">{album.year}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Your Playlists */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Playlists</h2>
          <Button variant="ghost" asChild>
            <Link href="/music/playlists">See all</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {samplePlaylists.map((playlist) => (
            <Card
              key={playlist.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() => playPlaylist(playlist)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={playlist.coverUrl || "/placeholder.svg"}
                  alt={playlist.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" className="h-14 w-14 rounded-full">
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
          ))}
        </div>
      </section>
    </div>
  );
}
