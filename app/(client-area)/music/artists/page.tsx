"use client";

import { Card } from "~/components/ui/card";
import { sampleArtists } from "~/lib/sample-music-data";
import Link from "next/link";

export default function ArtistsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Artists</h1>
        <p className="text-muted-foreground mt-1">Your favorite artists</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {sampleArtists.map((artist) => (
          <Link key={artist.id} href={`/music/artists/${artist.id}`}>
            <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={artist.imageUrl || "/placeholder.svg"}
                  alt={artist.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="line-clamp-1 font-semibold">{artist.name}</h3>
                <p className="text-muted-foreground text-sm">Artist</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
