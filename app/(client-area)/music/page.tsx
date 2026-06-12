"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { usePlayerStore, type Track } from "~/stores/player-store";
import type { Playlist } from "~/stores/player-store";
import Link from "next/link";
import { SectionHeader } from "~/components/section-header";
import * as motion from "motion/react-client";

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

export default function MusicHomePage() {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const playAlbum = usePlayerStore((s) => s.playAlbum);
  const playPlaylist = usePlayerStore((s) => s.playPlaylist);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
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

  if (loading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mx-auto max-w-7xl text-center text-muted-foreground py-12">Loading...</div>
      </div>
    );
  }

  const recentTracks = tracks.slice(0, 5);
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
  const derivedAlbums = Array.from(albumMap.values());

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {recentTracks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title="Recently Played"
              badge={{ text: "Music", variant: "orange" }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {recentTracks.map((track, idx) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all border-neutral-800/50 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-700"
                    onClick={() => playTrack(track)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-950">
                      <img
                        src={track.coverUrl || "/placeholder.svg"}
                        alt={track.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-white/90 text-black hover:bg-white">
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="mb-1 line-clamp-1 font-semibold text-sm text-white">
                        {track.title}
                      </h3>
                      <p className="text-neutral-400 line-clamp-1 text-xs">
                        {track.artist}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {derivedAlbums.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <SectionHeader
                title="Albums"
                badge={{ text: "Albums", variant: "purple" }}
              />
              <Button variant="ghost" asChild className="text-neutral-400 hover:text-white">
                <Link href="/music/albums">See all →</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {derivedAlbums.map((album, idx) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all border-neutral-800/50 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-700"
                    onClick={() => playAlbum(album)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-950">
                      <img
                        src={album.coverUrl || "/placeholder.svg"}
                        alt={album.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-white/90 text-black hover:bg-white">
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="mb-1 line-clamp-1 font-semibold text-sm text-white">
                        {album.title}
                      </h3>
                      <p className="text-neutral-400 line-clamp-1 text-xs">
                        {album.artist}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {tracks.length === 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="py-12 text-center">
              <h3 className="text-lg font-semibold">No music yet</h3>
              <p className="text-muted-foreground mt-2">
                Upload tracks or check back later.
              </p>
            </div>
          </motion.section>
        )}

        {playlists.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <SectionHeader
                title="Playlists"
                badge={{ text: "Playlists", variant: "pink" }}
              />
              <Button variant="ghost" asChild className="text-neutral-400 hover:text-white">
                <Link href="/music/playlists">See all →</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {playlists.map((playlist, idx) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer overflow-hidden transition-all border-neutral-800/50 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-700"
                    onClick={() => playPlaylist(playlist)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-950">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="icon" className="h-12 w-12 rounded-full bg-white/90 text-black hover:bg-white">
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="mb-1 line-clamp-1 font-semibold text-sm text-white">
                        {playlist.title}
                      </h3>
                      <p className="text-neutral-400 line-clamp-2 text-xs">
                        {playlist.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
