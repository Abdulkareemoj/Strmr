import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { playlist, playlistTrack } from "~/server/db/schema/playlist-schema";
import { music } from "~/server/db/schema/music-schema";
import { eq, asc, inArray } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const playlists = await db
      .select()
      .from(playlist)
      .where(eq(playlist.isPublic, true))
      .orderBy(playlist.createdAt);

    const result = await Promise.all(
      playlists.map(async (p) => {
        const playlistTracks = await db
          .select()
          .from(playlistTrack)
          .where(eq(playlistTrack.playlistId, p.id))
          .orderBy(asc(playlistTrack.position));

        const trackIds = playlistTracks.map((pt) => pt.trackId);
        const tracks = trackIds.length > 0
          ? await db.select().from(music).where(inArray(music.id, trackIds))
          : [];

        return { ...p, trackEntries: playlistTracks, tracks };
      }),
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/playlists error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, coverUrl, trackIds, isPublic } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const id = uuid();
    await db.insert(playlist).values({
      id,
      title,
      description: description ?? null,
      coverUrl: coverUrl ?? null,
      isPublic: isPublic ?? false,
      userId: session.user.id,
    });

    if (trackIds && Array.isArray(trackIds)) {
      await db.insert(playlistTrack).values(
        trackIds.map((trackId: string, index: number) => ({
          id: uuid(),
          playlistId: id,
          trackId,
          position: index,
        })),
      );
    }

    return NextResponse.json({ playlist: { id, title } });
  } catch (error) {
    console.error("POST /api/playlists error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing playlist id" },
        { status: 400 },
      );
    }

    await db.delete(playlist).where(eq(playlist.id, id));
    return NextResponse.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/playlists error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
