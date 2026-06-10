"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ContentCard } from "~/components/content-card";
import { SearchIcon, Film, Music, Play } from "lucide-react";

type SearchItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  url: string;
  duration?: number | null;
  type: "video" | "short" | "music";
  artist?: string | null;
};

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string, cat: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&category=${cat}`,
      );
      const data = await res.json();
      const items: SearchItem[] = [];
      (data.videos || []).forEach((v: any) =>
        items.push({ ...v, type: "video" }),
      );
      (data.shorts || []).forEach((s: any) =>
        items.push({ ...s, type: "short" }),
      );
      (data.music || []).forEach((m: any) =>
        items.push({ ...m, type: "music" }),
      );
      setResults(items);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) search(initialQuery, initialCategory);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query);
    if (category !== "all") params.set("category", category);
    router.push(`/search?${params.toString()}`);
    search(query, category);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex gap-3">
        <Input
          placeholder="Search videos, shorts, music..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="h-12 text-base"
        />
        <Button onClick={handleSearch} size="lg" className="px-6">
          <SearchIcon className="mr-2 size-4" />
          Search
        </Button>
      </div>

      <Tabs
        value={category}
        onValueChange={(v) => {
          setCategory(v);
          search(query, v);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="videos">
            <Film className="mr-1.5 size-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="shorts">
            <Play className="mr-1.5 size-4" /> Shorts
          </TabsTrigger>
          <TabsTrigger value="music">
            <Music className="mr-1.5 size-4" /> Music
          </TabsTrigger>
        </TabsList>

        {["all", "videos", "shorts", "music"].map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {query.trim()
                  ? `No ${cat === "all" ? "results" : cat} found for "${query}"`
                  : "Enter a search term to find content"}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    thumbnail={item.thumbnail || undefined}
                    href={`/${item.type === "music" ? "music" : item.type}/${item.id}`}
                    type={item.type === "music" ? "audio" : item.type}
                    badge={{
                      text:
                        item.type.charAt(0).toUpperCase() + item.type.slice(1),
                      variant:
                        item.type === "video"
                          ? "default"
                          : item.type === "short"
                            ? "secondary"
                            : "outline",
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
