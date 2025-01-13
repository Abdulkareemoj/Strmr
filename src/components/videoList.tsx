"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "~/utils/supabase/component";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, Play } from "lucide-react";

interface Video {
  name: string;
  url: string;
}

const supabase = createClient();

export default function VideoList() {
  const {
    data: videos,
    error,
    isValidating,
  } = useQuery(
    supabase
      .from("videos")
      .select("name, url")
      .order("name", { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (isValidating) {
    return <VideoListSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load videos. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos?.map((video) => <VideoCard key={video.name} video={video} />)}
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative aspect-video">
        <Link href={`/video/${encodeURIComponent(video.name)}`}>
          <video
            src={video.url}
            className="h-full w-full object-cover"
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Play className="h-12 w-12 text-white" />
          </div>
        </Link>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{video.name}</h3>
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
          className="overflow-hidden rounded-lg border bg-card shadow-sm"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
