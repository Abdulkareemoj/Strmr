"use client";
import * as React from "react";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, Play } from "lucide-react";
import { getPublicVideos } from "~/lib/actions";

interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  duration: number | null;
  isPublic: boolean;
  userId: string;
  views: number;
}

export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getPublicVideos()
      .then(setVideos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <VideoListSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load videos. Please try again.
          <span className="mt-1 block text-sm">Error: {error}</span>
        </AlertDescription>
      </Alert>
    );
  }

  if (!videos.length) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold">No videos found</h3>
        <p className="text-muted-foreground">
          Videos you upload will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="bg-card text-card-foreground overflow-hidden rounded-lg border shadow-xs">
      <div className="relative aspect-video">
        <Link href={`/video/${video.id}`}>
          {video.thumbnail ? (
            <img
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              src={video.url}
              className="h-full w-full object-cover"
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Play className="h-12 w-12 text-white" />
          </div>
        </Link>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{video.title}</h3>
        {video.description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

function VideoListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-card overflow-hidden rounded-lg border shadow-xs"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
