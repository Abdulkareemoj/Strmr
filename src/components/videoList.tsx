import * as React from "react"
import Link from "next/link"
import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
import { createClient } from "~/utils/supabase/component"
import { Skeleton } from "~/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle, Play } from 'lucide-react'

interface Video {
  id: number // Changed to number as per schema
  title: string
  description: string
  url: string
  thumbnailUrl: string | null
  duration: number
  videoId: string
  userId: string
  public: boolean
}

const supabase = createClient()

export default function VideoList() {
  const {
    data: videos,
    error,
    isValidating,
  } = useQuery<Video[]>(
    supabase
      .from("Video") // Matches exact table name from schema
      .select()
      .eq("public", true)
      .order("id", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  if (isValidating && !videos) {
    return <VideoListSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load videos. Please try again.
          {error.message && (
            <span className="block mt-1 text-sm">
              Error: {error.message}
            </span>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (!videos?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No videos found</h3>
        <p className="text-muted-foreground">Videos you upload will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs">
      <div className="relative aspect-video">
        <Link href={`/video/${video.videoId}`}>
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
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
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {video.description}
          </p>
        )}
      </div>
    </div>
  )
}

function VideoListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border bg-card shadow-xs"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}