"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Clock,
  ArrowRight,
  ChevronDown,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  CATEGORIES,
  categoryColor,
} from "~/lib/data/content";
import { cn } from "~/lib/utils";
import { useFilterStore, NAV_TABS } from "~/stores/filter-store";

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

const PAGE_SIZE = 12;

function ContentCard({ content }: { content: ContentItem }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-ring">
      <div className="flex aspect-video items-center justify-center bg-muted">
        <ImageIcon className="size-8 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{content.title}</h3>
          <Badge
            className={cn("shrink-0 border", categoryColor[content.category])}
          >
            {content.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content.description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {content.duration} min
          </span>
          <Badge variant="secondary">{content.durationLabel}</Badge>
          <Badge variant="outline">{content.contentType}</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">By {content.author}</span>
          <Button variant="ghost" size="sm" className="gap-1">
            View Details <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border py-4">
      <details className="group" open>
        <summary className="flex cursor-pointer items-center justify-between text-sm font-medium list-none">
          {title}
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-0 -rotate-90" />
        </summary>
        <div className="mt-3 space-y-2">{children}</div>
      </details>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-3.5 rounded border-border accent-primary"
      />
      {label}
    </label>
  );
}

function FilterSidebar() {
  const {
    selectedCategories,
    maxDuration,
    toggleCategory,
    setMaxDuration,
    applyDuration,
    reset,
  } = useFilterStore();

  return (
    <aside className="sticky top-20 h-fit rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold">Filters</h3>
      <FilterSection title="Categories">
        {CATEGORIES.map((c) => (
          <Checkbox
            key={c}
            label={c}
            checked={selectedCategories.includes(c)}
            onChange={() => toggleCategory(c)}
          />
        ))}
      </FilterSection>
      <div className="py-4">
        <p className="mb-3 text-sm font-medium">Max Duration</p>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={maxDuration}
          onChange={(e) => setMaxDuration(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>5 min</span>
          <span>{maxDuration} min</span>
          <span>60+ min</span>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={reset}>
          Reset
        </Button>
        <Button size="sm" className="flex-1" onClick={applyDuration}>
          Apply
        </Button>
      </div>
    </aside>
  );
}

function Pagination({
  current,
  totalPages,
  onChange,
}: {
  current: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        ‹
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === current ? "default" : "outline"}
          size="sm"
          className="size-8"
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={current === totalPages}
        onClick={() => onChange(current + 1)}
      >
        ›
      </Button>
    </div>
  );
}

export function BrowseSection() {
  const {
    search,
    activeTab,
    selectedCategories,
    appliedDuration,
    page,
    setSearch,
    setActiveTab,
    setPage,
  } = useFilterStore();

  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setAllContent(data.content);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allContent.filter((item) => {
      const q = search.trim().toLowerCase();
      if (q && !item.title.toLowerCase().includes(q)) return false;
      if (activeTab !== "All" && item.category !== activeTab) return false;
      if (
        selectedCategories.length &&
        !selectedCategories.includes(item.category)
      )
        return false;
      if (item.duration > appliedDuration) return false;
      return true;
    });
  }, [search, activeTab, selectedCategories, appliedDuration, allContent]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  if (loading) {
    return (
      <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Browse Content</h2>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="pl-9 pr-9"
          />
          <SlidersHorizontal className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <FilterSidebar />

        <div>
          <div className="mb-5 flex flex-wrap gap-2 border-b border-border pb-3">
            {NAV_TABS.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  activeTab === tab
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {paged.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No content matches your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paged.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <span>
              Showing {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1}{" "}
              to {Math.min(current * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} results
            </span>
            <Pagination
              current={current}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
