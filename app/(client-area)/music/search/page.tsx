"use client";

import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search, Play } from "lucide-react";
import { usePlayerStore, type Track } from "~/stores/player-store";
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
    type: dbTrack.type === "podcast" ? "podcast" : "song",
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const playAlbum = usePlayerStore((s) => s.playAlbum);

  useEffect(() => {
    fetch("/api/music")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTracks(data.map(dbTrackToTrack));
        else setTracks([]);
      })
      .catch(() => setTracks([]))
      .finally(() => setLoading(false));
  }, []);

  const q = query.toLowerCase();
  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q),
  );

  const albumMap = new Map<string, { id: string; title: string; artist: string; coverUrl: string }>();
  tracks.forEach((t) => {
    if (t.album && !albumMap.has(t.album) && (t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q))) {
      albumMap.set(t.album, {
        id: `album-${t.album}`,
        title: t.album,
        artist: t.artist,
        coverUrl: t.coverUrl,
      });
    }
  });
  const filteredAlbums = Array.from(albumMap.values());

  const artistMap = new Map<string, { id: string; name: string; imageUrl: string }>();
  tracks.forEach((t) => {
    if (t.artist && !artistMap.has(t.artist) && (t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q))) {
      artistMap.set(t.artist, {
        id: `artist-${t.artist}`,
        name: t.artist,
        imageUrl: t.coverUrl,
      });
    }
  });
  const filteredArtists = Array.from(artistMap.values());

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold">Search</h1>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Search for songs, albums, artists, or playlists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
      ) : query ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredTracks.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Tracks</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTracks.slice(0, 4).map((track) => (
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
                      <div className="p-4">
                        <h3 className="mb-1 line-clamp-1 font-semibold">{track.title}</h3>
                        <p className="text-muted-foreground line-clamp-1 text-sm">{track.artist}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredAlbums.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Albums</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAlbums.slice(0, 4).map((album) => (
                    <Link key={album.id} href={`/music/albums/${encodeURIComponent(album.title)}`}>
                      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={album.coverUrl || "/placeholder.svg"}
                            alt={album.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="mb-1 line-clamp-1 font-semibold">{album.title}</h3>
                          <p className="text-muted-foreground line-clamp-1 text-sm">{album.artist}</p>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredArtists.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Artists</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredArtists.slice(0, 4).map((artist) => (
                    <Link key={artist.id} href={`/music/artists/${encodeURIComponent(artist.name)}`}>
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
            )}
          </TabsContent>

          <TabsContent value="tracks">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTracks.map((track) => (
                <Card
                  key={track.id}
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                  onClick={() => playTrack(track)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={track.coverUrl || "/placeholder.svg"} alt={track.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="icon" className="h-14 w-14 rounded-full">
                        <Play className="h-6 w-6 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 font-semibold">{track.title}</h3>
                    <p className="text-muted-foreground line-clamp-1 text-sm">{track.artist}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="albums">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAlbums.map((album) => (
                <Link key={album.id} href={`/music/albums/${encodeURIComponent(album.title)}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img src={album.coverUrl || "/placeholder.svg"} alt={album.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 line-clamp-1 font-semibold">{album.title}</h3>
                      <p className="text-muted-foreground line-clamp-1 text-sm">{album.artist}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((artist) => (
                <Link key={artist.id} href={`/music/artists/${encodeURIComponent(artist.name)}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img src={artist.imageUrl || "/placeholder.svg"} alt={artist.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="line-clamp-1 font-semibold">{artist.name}</h3>
                      <p className="text-muted-foreground text-sm">Artist</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Start typing to search for music</p>
        </div>
      )}
    </div>
  );
}
