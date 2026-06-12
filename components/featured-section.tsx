"use client";
import { useState, useEffect } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { categoryColor } from "~/lib/data/content";
import { cn } from "~/lib/utils";

type ContentItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
  category: keyof typeof categoryColor;
  duration: number;
  durationLabel: string;
  contentType: string;
  author: string;
  views: number;
};

export function FeaturedSection() {
  const [featured, setFeatured] = useState<ContentItem[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.featured) {
          setFeatured(data.featured);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (featured.length === 0) return null;

  const activeItem = featured[active];

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
                  categoryColor[activeItem.category],
                  "border",
                )}
              >
                {activeItem.category}
              </Badge>
              <Badge variant="secondary">{activeItem.durationLabel}</Badge>
            </div>
            <h3 className="text-xl font-semibold">{activeItem.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeItem.description}
            </p>
            <Button variant="outline" className="mt-5">
              Watch Now
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {featured.map((item, i) => (
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
