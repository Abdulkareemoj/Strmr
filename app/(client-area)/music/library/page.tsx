"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
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

export default function LibraryPage() {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const playAlbum = usePlayerStore((s) => s.playAlbum);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/music").then((r) => r.json()),
      fetch("/api/playlists").then((r) => r.json()),
    ])
      .then(([tracksData, playlistsData]) => {
        if (Array.isArray(tracksData)) setTracks(tracksData.map(dbTrackToTrack));
        if (Array.isArray(playlistsData)) setPlaylists(playlistsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const albumMap = new Map<string, { id: string; title: string; artist: string; coverUrl: string; year: number; tracks: Track[] }>();
  tracks.forEach((t) => {
    if (t.album) {
      if (!albumMap.has(t.album)) {
        albumMap.set(t.album, {
          id: `album-${t.album}`,
          title: t.album,
          artist: t.artist,
          coverUrl: t.coverUrl,
          year: new Date().getFullYear(),
          tracks: [],
        });
      }
      albumMap.get(t.album)!.tracks.push(t);
    }
  });
  const albums = Array.from(albumMap.values());

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-muted-foreground mt-1">All your music in one place</p>
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="mt-6">
          {playlists.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">No playlists yet</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {playlists.map((playlist) => (
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
                      <h3 className="mb-1 line-clamp-1 font-semibold">{playlist.title}</h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">{playlist.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
          {albums.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">No albums yet</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {albums.map((album) => (
                <Link key={album.id} href={`/music/albums/${encodeURIComponent(album.title)}`}>
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
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tracks" className="mt-6">
          {tracks.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">No tracks yet</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tracks.map((track) => (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
