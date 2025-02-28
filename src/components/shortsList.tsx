import * as React from "react"
import Link from "next/link"
import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
import { createClient } from "~/utils/supabase/component"
import { Skeleton } from "~/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface Short {
  id: number
  title: string
  description: string
  url: string
  thumbnailUrl: string | null
  duration: number
  shortId: string
  userId: string
  public: boolean
}

const supabase = createClient()

export default function ShortsList() {
  const {
    data: shorts,
    error,
    isValidating,
  } = useQuery<Short[]>(
    supabase
      .from("Short")
      .select()
      .eq("public", true)
      .order("id", { ascending: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  if (isValidating && !shorts) {
    return <ShortsListSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load shorts. Please try again.
          {error.message && (
            <span className="block mt-1 text-sm">
              Error: {error.message}
            </span>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  if (!shorts?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No shorts found</h3>
        <p className="text-muted-foreground">Shorts you upload will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {shorts.map((short) => (
        <ShortCard key={short.id} short={short} />
      ))}
    </div>
  )
}

function ShortCard({ short }: { short: Short }) {
  return (
    <Link
      href={`/short/${short.shortId}`}
      className="group overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        {short.thumbnailUrl ? (
          <img
            src={short.thumbnailUrl || "/placeholder.svg"}
            alt={short.title}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <video
            src={short.url}
            className="aspect-square w-full object-cover"
            preload="metadata"
          />
        )}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-1 text-sm text-white">
          {formatDuration(short.duration)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold group-hover:underline">
          {short.title}
        </h3>
        {short.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {short.description}
          </p>
        )}
      </div>
    </Link>
  )
}

function ShortsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg shadow-md"
        >
          <Skeleton className="aspect-square w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}