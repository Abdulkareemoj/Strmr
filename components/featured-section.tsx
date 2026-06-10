"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  FEATURED_CONTENT,
  categoryColor,
} from "~/lib/data/content";
import { cn } from "~/lib/utils";

export function FeaturedSection() {
  const [active, setActive] = useState(0);
  const featured = FEATURED_CONTENT[active];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-6 text-2xl font-bold">Featured Content</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex aspect-video items-center justify-center bg-muted">
            <ImageIcon className="size-12 text-muted-foreground" />
          </div>
          <div className="p-6">
            <div className="mb-3 flex gap-2">
              <Badge
                className={cn(
                  categoryColor[featured.category],
                  "border",
                )}
              >
                {featured.category}
              </Badge>
              <Badge variant="secondary">{featured.durationLabel}</Badge>
            </div>
            <h3 className="text-xl font-semibold">{featured.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {featured.description}
            </p>
            <Button variant="outline" className="mt-5">
              Watch Now
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {FEATURED_CONTENT.map((item, i) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                i === active
                  ? "border-border bg-card ring-1 ring-ring"
                  : "border-border bg-card/40 hover:bg-card",
              )}
            >
              <Badge
                className={cn(categoryColor[item.category], "mb-2 border")}
              >
                {item.category}
              </Badge>
              <p className="font-medium text-sm">{item.title}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
