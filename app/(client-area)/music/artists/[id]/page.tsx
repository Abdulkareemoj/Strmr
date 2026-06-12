"use client";

import { use, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { usePlayerStore, type Track, type Album } from "~/stores/player-store";
import { notFound } from "next/navigation";
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

export default function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const playAlbum = usePlayerStore((s) => s.playAlbum);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    const slug = id.replace(/^artist-/, "").replace(/-/g, " ");
    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const allTracks = data.map(dbTrackToTrack);
        const matching = allTracks.filter(
          (t) => t.artist.toLowerCase() === slug,
        );
        if (matching.length === 0) return;
        setArtistName(matching[0].artist);

        const albumMap = new Map<string, Track[]>();
        matching.forEach((t) => {
          if (!albumMap.has(t.album)) albumMap.set(t.album, []);
          albumMap.get(t.album)!.push(t);
        });
        const derived: Album[] = Array.from(albumMap.entries()).map(
          ([albumName, tracks]) => ({
            id: `album-${albumName.replace(/\s+/g, "-").toLowerCase()}`,
            title: albumName,
            artist: tracks[0].artist,
            coverUrl: tracks[0].coverUrl,
            year: new Date().getFullYear(),
            tracks,
          }),
        );
        setAlbums(derived);
      })
      .catch(() => {});
  }, [id]);

  if (!artistName) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="from-muted/50 to-background border-b bg-gradient-to-b p-6 lg:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div className="h-48 w-48 rounded-full bg-muted flex items-center justify-center text-5xl font-bold shadow-2xl">
            {artistName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium uppercase">Artist</p>
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{artistName}</h1>
            <p className="text-muted-foreground text-sm">{albums.length} albums</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          {albums.length > 0 && (
            <Button size="lg" className="rounded-full" onClick={() => playAlbum(albums[0])}>
              <Play className="mr-2 h-5 w-5 fill-current" /> Play
            </Button>
          )}
          <Button size="icon" variant="outline" className="rounded-full bg-transparent">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full bg-transparent">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <h2 className="mb-4 text-2xl font-bold">Albums</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      onClick={(e) => { e.preventDefault(); playAlbum(album); }}
                    >
                      <Play className="h-6 w-6 fill-current" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-1 font-semibold">{album.title}</h3>
                  <p className="text-muted-foreground text-xs">{album.year}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
