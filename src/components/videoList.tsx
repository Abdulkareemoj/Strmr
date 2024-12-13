/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import * as React from "react";
import Link from "next/link";

interface Video {
  name: string;
  publicUrl: string;
}

export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.name}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="relative aspect-video">
            <Link href={`/video/${encodeURIComponent(video.name)}`}>
              <video
                src={video.publicUrl}
                className="h-full w-full rounded-t-lg object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <span className="text-lg font-semibold text-white">Play</span>
              </div>
            </Link>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{video.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
