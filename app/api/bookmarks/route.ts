import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { bookmark } from "~/server/db/schema/bookmark-schema";
import { video } from "~/server/db/schema/video-schema";
import { short } from "~/server/db/schema/short-schema";
import { music } from "~/server/db/schema/music-schema";
import { user } from "~/server/db/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

type BookmarkRow = {
  id: string;
  userId: string;
  contentId: string;
  contentType: "video" | "short" | "music";
  createdAt: Date;
};

type BookmarkResponse = {
  id: string;
  title: string;
  creator: string;
  savedAt: string;
};

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = (await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, session.user.id))
      .orderBy(bookmark.createdAt)) as unknown as BookmarkRow[];

    if (rows.length === 0) {
      return NextResponse.json({ bookmarks: [] });
    }

    const userMap = new Map<string, string>();
    const getUser = async (userId: string) => {
      if (!userMap.has(userId)) {
        const [u] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
        userMap.set(userId, u?.name || u?.username || "Unknown");
      }
      return userMap.get(userId)!;
    };

    const results: BookmarkResponse[] = [];

    for (const row of rows) {
      let title = "";
      let creatorName = "";

      if (row.contentType === "video") {
        const [v] = await db.select().from(video).where(eq(video.id, row.contentId)).limit(1);
        if (v) {
          title = v.title;
          creatorName = await getUser(v.userId);
        }
      } else if (row.contentType === "short") {
        const [s] = await db.select().from(short).where(eq(short.id, row.contentId)).limit(1);
        if (s) {
          title = s.title;
          creatorName = await getUser(s.userId);
        }
      } else if (row.contentType === "music") {
        const [m] = await db.select().from(music).where(eq(music.id, row.contentId)).limit(1);
        if (m) {
          title = m.title;
          creatorName = m.artist || (await getUser(m.userId));
        }
      }

      if (title) {
        results.push({
          id: row.id,
          title,
          creator: creatorName,
          savedAt: row.createdAt.toISOString(),
        });
      }
    }

    return NextResponse.json({ bookmarks: results });
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contentId, contentType } = body;

    if (!contentId || !contentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["video", "short", "music"].includes(contentType)) {
      return NextResponse.json({ error: "Invalid contentType" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(bookmark)
      .where(
        eq(bookmark.userId, session.user.id) &&
        eq(bookmark.contentId, contentId),
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({ message: "Already bookmarked" });
    }

    const [newBookmark] = await db
      .insert(bookmark)
      .values({
        id: uuid(),
        userId: session.user.id,
        contentId,
        contentType,
      })
      .returning();

    return NextResponse.json({ bookmark: newBookmark });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");

    if (!contentId) {
      return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
    }

    await db
      .delete(bookmark)
      .where(
        eq(bookmark.userId, session.user.id) &&
        eq(bookmark.contentId, contentId),
      );

    return NextResponse.json({ message: "Bookmark removed" });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
