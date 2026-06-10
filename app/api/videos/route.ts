import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { video } from "~/server/db/schema/video-schema";
import { eq } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const videos = await db
      .select()
      .from(video)
      .where(eq(video.isPublic, true))
      .orderBy(video.createdAt);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/videos error:", error);
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
    const { title, description, url, thumbnail, duration, isPublic } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [newVideo] = await db
      .insert(video)
      .values({
        id: uuid(),
        title,
        description,
        url,
        thumbnail,
        duration: duration ?? null,
        isPublic: isPublic ?? false,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ video: newVideo });
  } catch (error) {
    console.error("POST /api/videos error:", error);
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
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }

    await db.delete(video).where(eq(video.id, id));
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
