"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { usePlayerStore, type Track, type Album } from "~/stores/player-store";
import Link from "next/link";

function dbTrackToTrack(dbTrack: any): Track {
  return {
    id: dbTrack.id,
    title: dbTrack.title,
    artist: dbTrack.artist || "Unknown",
    album: dbTrack.album || "Unknown",
    duration: dbTrack.duration || 0,
    coverUrl: dbTrack.coverUrl || "",
    audioUrl: dbTrack.url,
    type: "song",
  };
}

export default function AlbumsPage() {
  const playAlbum = usePlayerStore((s) => s.playAlbum);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const tracks = data.map(dbTrackToTrack);
        const map = new Map<string, Track[]>();
        tracks.forEach((t) => {
          const key = t.album;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(t);
        });
        const derived: Album[] = Array.from(map.entries()).map(([albumName, albumTracks]) => ({
          id: `album-${albumName.replace(/\s+/g, "-").toLowerCase()}`,
          title: albumName,
          artist: albumTracks[0].artist,
          coverUrl: albumTracks[0].coverUrl,
          year: new Date().getFullYear(),
          tracks: albumTracks,
        }));
        setAlbums(derived);
      })
      .catch(() => setAlbums([]));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Albums</h1>
        <p className="text-muted-foreground mt-1">Your album collection</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {albums.map((album) => (
          <Link key={album.id} href={`/music/albums/${album.id}`}>
            <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={album.coverUrl || "/placeholder.svg"}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      playAlbum(album);
                    }}
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 font-semibold">{album.title}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">{album.artist}</p>
                <p className="text-muted-foreground text-xs">{album.year}</p>
              </div>
            </Card>
          </Link>
        ))}
        {albums.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">No albums found</div>
        )}
      </div>
    </div>
  );
}
