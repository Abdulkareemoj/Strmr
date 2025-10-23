"use client";

import { Card } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { useMusicPlayer } from "~/lib/music-player-context";
import {
  sampleTracks,
  sampleAlbums,
  samplePlaylists,
} from "~/lib/sample-music-data";
import Link from "next/link";

export default function LibraryPage() {
  const { playTrack, playAlbum, playPlaylist } = useMusicPlayer();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-muted-foreground mt-1">
          All your music in one place
        </p>
      </div>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {samplePlaylists.map((playlist) => (
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

        <TabsContent value="albums" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tracks" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleTracks.map((track) => (
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
      </Tabs>
    </div>
  );
}
