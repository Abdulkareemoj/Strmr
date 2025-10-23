"use client";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import { sampleAlbums } from "~/lib/sample-music-data";
import Link from "next/link";

export default function AlbumsPage() {
  const { playAlbum } = useMusicPlayer();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Albums</h1>
        <p className="text-muted-foreground mt-1">Your album collection</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {sampleAlbums.map((album) => (
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
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {album.artist}
                </p>
                <p className="text-muted-foreground text-xs">{album.year}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
