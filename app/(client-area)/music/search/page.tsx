"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Search, Play } from "lucide-react";
import { usePlayerStore } from "~/stores/player-store";
import {
  sampleTracks,
  sampleAlbums,
  sampleArtists,
  samplePlaylists,
} from "~/lib/sample-music-data";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const playTrack = usePlayerStore((s) => s.playTrack);
  const playAlbum = usePlayerStore((s) => s.playAlbum);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);

  const filteredTracks = sampleTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredAlbums = sampleAlbums.filter(
    (album) =>
      album.title.toLowerCase().includes(query.toLowerCase()) ||
      album.artist.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredArtists = sampleArtists.filter((artist) =>
    artist.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredPlaylists = samplePlaylists.filter((playlist) =>
    playlist.title.toLowerCase().includes(query.toLowerCase()),
  );

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

      {query ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tracks">Tracks</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
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
                          <Button
                            size="icon"
                            className="h-14 w-14 rounded-full"
                          >
                            <Play className="h-6 w-6 fill-current" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
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
              </div>
            )}

            {filteredAlbums.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Albums</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredAlbums.slice(0, 4).map((album) => (
                    <Link key={album.id} href={`/music/albums/${album.id}`}>
                      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={album.coverUrl || "/placeholder.svg"}
                            alt={album.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="mb-1 line-clamp-1 font-semibold">
                            {album.title}
                          </h3>
                          <p className="text-muted-foreground line-clamp-1 text-sm">
                            {album.artist}
                          </p>
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
          </TabsContent>

          <TabsContent value="albums">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAlbums.map((album) => (
                <Link key={album.id} href={`/music/albums/${album.id}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={album.coverUrl || "/placeholder.svg"}
                        alt={album.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 line-clamp-1 font-semibold">
                        {album.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {album.artist}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((artist) => (
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
                      <h3 className="line-clamp-1 font-semibold">
                        {artist.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">Artist</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/music/playlists/${playlist.id}`}
                >
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
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
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">
            Start typing to search for music
          </p>
        </div>
      )}
    </div>
  );
}
