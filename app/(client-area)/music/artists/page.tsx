"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import Link from "next/link";

type DerivedArtist = {
  id: string;
  name: string;
  imageUrl: string;
  albums: number;
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<DerivedArtist[]>([]);

  useEffect(() => {
    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const map = new Map<string, { count: number; cover: string }>();
        data.forEach((t: any) => {
          const name = t.artist || "Unknown";
          if (!map.has(name)) map.set(name, { count: 0, cover: t.coverUrl || "" });
          map.get(name)!.count++;
        });
        const derived: DerivedArtist[] = Array.from(map.entries()).map(([name, info]) => ({
          id: `artist-${name.replace(/\s+/g, "-").toLowerCase()}`,
          name,
          imageUrl: info.cover,
          albums: info.count,
        }));
        setArtists(derived);
      })
      .catch(() => setArtists([]));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Artists</h1>
        <p className="text-muted-foreground mt-1">Your favorite artists</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {artists.map((artist) => (
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
                <p className="text-muted-foreground text-sm">{artist.albums} tracks</p>
              </div>
            </Card>
          </Link>
        ))}
        {artists.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">No artists found</div>
        )}
      </div>
    </div>
  );
}
