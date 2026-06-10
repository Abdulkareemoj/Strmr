"use client";
import * as React from "react";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getPublicShorts } from "~/lib/actions";

interface Short {
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

export default function ShortsList() {
  const [shorts, setShorts] = React.useState<Short[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getPublicShorts()
      .then(setShorts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ShortsListSkeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load shorts. Please try again.
          {error && (
            <span className="mt-1 block text-sm">Error: {error}</span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!shorts.length) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold">No shorts found</h3>
        <p className="text-muted-foreground">
          Shorts you upload will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {shorts.map((short) => (
        <ShortCard key={short.id} short={short} />
      ))}
    </div>
  );
}

function ShortCard({ short }: { short: Short }) {
  return (
    <Link
      href={`/shorts/${short.id}`}
      className="group overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        {short.thumbnail ? (
          <img
            src={short.thumbnail || "/placeholder.svg"}
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
        <div className="absolute right-2 bottom-2 rounded-md bg-black/50 px-2 py-1 text-sm text-white">
          {formatDuration(short.duration)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold group-hover:underline">
          {short.title}
        </h3>
        {short.description && (
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
            {short.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function ShortsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg shadow-md">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
