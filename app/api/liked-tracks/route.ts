import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { likedTrack } from "~/server/db/schema/liked-track-schema";
import { music } from "~/server/db/schema/music-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: likedTrack.id,
        trackId: likedTrack.trackId,
        createdAt: likedTrack.createdAt,
        track: music,
      })
      .from(likedTrack)
      .innerJoin(music, eq(likedTrack.trackId, music.id))
      .where(eq(likedTrack.userId, session.user.id))
      .orderBy(likedTrack.createdAt);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/liked-tracks error:", error);
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

    const { trackId } = await req.json();
    if (!trackId) {
      return NextResponse.json(
        { error: "Missing trackId" },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(likedTrack)
      .where(
        and(
          eq(likedTrack.userId, session.user.id),
          eq(likedTrack.trackId, trackId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({
        message: "Track already liked",
        likedTrack: existing[0],
      });
    }

    const [newLikedTrack] = await db
      .insert(likedTrack)
      .values({
        id: uuid(),
        userId: session.user.id,
        trackId,
      })
      .returning();

    return NextResponse.json({ likedTrack: newLikedTrack }, { status: 201 });
  } catch (error) {
    console.error("POST /api/liked-tracks error:", error);
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
    const trackId = searchParams.get("trackId");

    if (!trackId) {
      return NextResponse.json(
        { error: "Missing trackId" },
        { status: 400 },
      );
    }

    await db
      .delete(likedTrack)
      .where(
        and(
          eq(likedTrack.userId, session.user.id),
          eq(likedTrack.trackId, trackId),
        ),
      );

    return NextResponse.json({ message: "Track unliked" });
  } catch (error) {
    console.error("DELETE /api/liked-tracks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
