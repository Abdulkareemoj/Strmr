import type React from "react";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { MusicNav } from "~/components/music/music-nav";
import { PlayerBar } from "~/components/music/player-bar";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider className="min-h-[calc(100svh-3.5rem)]">
        <MusicNav className="top-14 h-[calc(100svh-3.5rem)]" />
        <SidebarInset className="flex flex-col">
          <div className="flex items-center gap-2 border-b px-4 py-2">
            <SidebarTrigger className="size-8" />
          </div>
          <div className="flex-1 overflow-auto pb-20">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <PlayerBar />
    </>
  );
}
