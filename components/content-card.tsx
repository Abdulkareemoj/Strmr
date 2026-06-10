"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge, type badgeVariants } from "~/components/ui/badge";
import { Play, Music, Zap } from "lucide-react";
import { cn } from "~/lib/utils";

interface ContentCardProps {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  views?: number;
  creator?: string;
  badge?: {
    text: string;
    variant: NonNullable<Parameters<typeof badgeVariants>[0]>["variant"];
  };
  type?: "video" | "short" | "audio";
  href: string;
  className?: string;
}

export function ContentCard({
  id,
  title,
  thumbnail,
  duration,
  views,
  creator,
  badge,
  type = "video",
  href,
  className,
}: ContentCardProps) {
  const getIcon = () => {
    if (type === "short") return <Play className="h-4 w-4" />;
    if (type === "audio") return <Music className="h-4 w-4" />;
    return <Play className="h-4 w-4" />;
  };

  return (
    <Link href={href}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-lg border border-neutral-800/50 bg-neutral-900/50 hover:bg-neutral-900 transition-all duration-300 hover:border-neutral-700 hover:shadow-lg dark:bg-neutral-800/30 dark:hover:bg-neutral-800",
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950/50">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-800 to-neutral-900">
              {getIcon()}
            </div>
          )}

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-semibold">
              {duration}
            </div>
          )}

          {/* Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
            <div className="rounded-full bg-white/20 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {getIcon()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Badge */}
          {badge && (
            <Badge variant={badge.variant} className="text-xs">
              {badge.text}
            </Badge>
          )}

          {/* Title */}
          <h3 className="font-semibold line-clamp-2 text-sm leading-snug text-neutral-100 group-hover:text-white transition-colors">
            {title}
          </h3>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-neutral-400">
            {creator && <span>{creator}</span>}
            {views && (
              <span className="text-neutral-500">
                {views > 1000000
                  ? `${(views / 1000000).toFixed(1)}M`
                  : views > 1000
                  ? `${(views / 1000).toFixed(1)}K`
                  : views}{" "}
                views
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
