"use client";

import { use } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import { sampleArtists } from "~/lib/sample-music-data";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { playAlbum } = useMusicPlayer();

  const artist = sampleArtists.find((a) => a.id === id);

  if (!artist) {
    notFound();
  }

  return (
    <div className="h-full overflow-auto">
      {/* Artist Header */}
      <div className="from-muted/50 to-background border-b bg-gradient-to-b p-6 lg:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <img
            src={artist.imageUrl || "/placeholder.svg"}
            alt={artist.name}
            className="h-48 w-48 rounded-full object-cover shadow-2xl"
          />
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium uppercase">Artist</p>
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
              {artist.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {artist.albums.length} albums
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button
            size="lg"
            className="rounded-full"
            onClick={() => playAlbum(artist.albums[0])}
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

      {/* Albums */}
      <div className="p-6 lg:p-8">
        <h2 className="mb-4 text-2xl font-bold">Albums</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artist.albums.map((album) => (
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
                  <h3 className="mb-1 line-clamp-1 font-semibold">
                    {album.title}
                  </h3>
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
