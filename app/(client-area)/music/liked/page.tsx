"use client";

import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Play } from "lucide-react";
import { usePlayerStore, type Track } from "~/stores/player-store";

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

export default function LikedSongsPage() {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/liked-tracks")
      .then((res) => {
        if (res.status === 401) return [];
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const tracks = data.map((item: any) => dbTrackToTrack(item.track));
          setLikedTracks(tracks);
        } else {
          setLikedTracks([]);
        }
      })
      .catch(() => setLikedTracks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Liked Songs</h1>
        <p className="text-muted-foreground mt-1">{likedTracks.length} songs</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
      ) : likedTracks.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No liked songs yet</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Like songs to see them here
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {likedTracks.map((track) => (
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
    </div>
  );
}
