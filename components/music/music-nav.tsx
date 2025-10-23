"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Home,
  Search,
  Library,
  Heart,
  ListMusic,
  Disc,
  Mic2,
  Radio,
} from "lucide-react";

const navItems = [
  { href: "/music", label: "Home", icon: Home },
  { href: "/music/search", label: "Search", icon: Search },
  { href: "/music/library", label: "Your Library", icon: Library },
];

const libraryItems = [
  { href: "/music/playlists", label: "Playlists", icon: ListMusic },
  { href: "/music/albums", label: "Albums", icon: Disc },
  { href: "/music/artists", label: "Artists", icon: Mic2 },
  { href: "/music/podcasts", label: "Podcasts", icon: Radio },
  { href: "/music/liked", label: "Liked Songs", icon: Heart },
];

export function MusicNav() {
  const pathname = usePathname();

  return (
    <aside className="bg-muted/30 hidden w-64 border-r lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold">Music</h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
            <div className="my-4 border-t pt-4">
              <p className="text-muted-foreground mb-2 px-3 text-xs font-semibold uppercase">
                Library
              </p>
              {libraryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
