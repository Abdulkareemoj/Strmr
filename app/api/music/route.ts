import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { music } from "~/server/db/schema/music-schema";
import { eq, and } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const conditions = [eq(music.isPublic, true)];
    if (type) {
      conditions.push(eq(music.type, type));
    }

    const tracks = await db
      .select()
      .from(music)
      .where(and(...conditions))
      .orderBy(music.createdAt);
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("GET /api/music error:", error);
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
    const { title, artist, album, coverUrl, url, duration, isPublic } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [newTrack] = await db
      .insert(music)
      .values({
        id: uuid(),
        title,
        artist: artist ?? null,
        album: album ?? null,
        coverUrl: coverUrl ?? null,
        url,
        duration: duration ?? null,
        isPublic: isPublic ?? false,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ track: newTrack });
  } catch (error) {
    console.error("POST /api/music error:", error);
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
      return NextResponse.json({ error: "Missing music id" }, { status: 400 });
    }

    await db.delete(music).where(eq(music.id, id));
    return NextResponse.json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
