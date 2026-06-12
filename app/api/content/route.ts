import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { video } from "~/server/db/schema/video-schema";
import { short } from "~/server/db/schema/short-schema";
import { music } from "~/server/db/schema/music-schema";
import { user } from "~/server/db/schema/auth-schema";
import { eq, inArray } from "drizzle-orm";

const CATEGORIES = [
  "Videos", "Shorts", "Music", "Podcasts", "Tutorials", "Livestreams",
] as const;

type Category = (typeof CATEGORIES)[number];
type ContentType = "Video" | "Audio" | "Short";

type DbRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  url: string;
  duration: number | null;
  views: number;
  likes: number;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
};

type UnifiedContent = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
  category: Category;
  duration: number;
  durationLabel: string;
  contentType: ContentType;
  author: string;
  views: number;
};

function durationLabel(minutes: number): string {
  if (minutes < 5) return "<5 min";
  if (minutes <= 15) return "5-15 min";
  if (minutes <= 30) return "15-30 min";
  if (minutes <= 60) return "30-60 min";
  return "60+ min";
}

function toContent(
  row: DbRow,
  category: Category,
  contentType: ContentType,
  authorName: string,
): UnifiedContent {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    thumbnail: row.thumbnail,
    url: row.url,
    category,
    duration: row.duration ?? 0,
    durationLabel: durationLabel(row.duration ?? 0),
    contentType,
    author: authorName,
    views: row.views,
  };
}

export async function GET() {
  try {
    const [videos, shorts, musicRows] = await Promise.all([
      db.select().from(video).where(eq(video.isPublic, true)).orderBy(video.createdAt),
      db.select().from(short).where(eq(short.isPublic, true)).orderBy(short.createdAt),
      db.select().from(music).where(eq(music.isPublic, true)).orderBy(music.createdAt),
    ]);

    const allUserIds = [...new Set([
      ...videos.map((v) => v.userId),
      ...shorts.map((s) => s.userId),
      ...musicRows.map((m) => m.userId),
    ])];

    const users = allUserIds.length > 0
      ? await db.select().from(user).where(inArray(user.id, allUserIds))
      : [];

    const userMap = new Map(users.map((u) => [u.id, u.name || u.username || "Unknown"]));

    const resolveAuthor = (userId: string) => userMap.get(userId) ?? "Unknown";

    const allContent: UnifiedContent[] = [
      ...videos.map((v) => toContent(v as unknown as DbRow, "Videos", "Video", resolveAuthor(v.userId))),
      ...shorts.map((s) => toContent(s as unknown as DbRow, "Shorts", "Short", resolveAuthor(s.userId))),
      ...musicRows.map((m) => toContent(
        m as unknown as DbRow,
        m.type === "podcast" ? "Podcasts" : "Music",
        "Audio",
        resolveAuthor(m.userId),
      )),
    ];

    allContent.sort((a, b) => b.views - a.views);

    const featured = allContent.slice(0, 5);

    return NextResponse.json({ content: allContent, featured });
  } catch (error) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
