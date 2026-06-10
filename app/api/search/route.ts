import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { video } from "~/server/db/schema/video-schema";
import { short } from "~/server/db/schema/short-schema";
import { music } from "~/server/db/schema/music-schema";
import { and, ilike, or, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category") ?? "all";

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ videos: [], shorts: [], music: [] });
    }

    const searchTerm = `%${query.trim()}%`;

    const results: {
      videos?: typeof video.$inferSelect[];
      shorts?: typeof short.$inferSelect[];
      music?: typeof music.$inferSelect[];
    } = {};

    if (category === "all" || category === "videos") {
      results.videos = await db
        .select()
        .from(video)
        .where(
          and(
            eq(video.isPublic, true),
            or(ilike(video.title, searchTerm), ilike(video.description ?? '', searchTerm)),
          ),
        )
        .limit(20);
    }

    if (category === "all" || category === "shorts") {
      results.shorts = await db
        .select()
        .from(short)
        .where(
          and(
            eq(short.isPublic, true),
            or(ilike(short.title, searchTerm), ilike(short.description ?? '', searchTerm)),
          ),
        )
        .limit(20);
    }

    if (category === "all" || category === "music") {
      results.music = await db
        .select()
        .from(music)
        .where(
          and(
            eq(music.isPublic, true),
            or(
              ilike(music.title, searchTerm),
              ilike(music.artist ?? '', searchTerm),
              ilike(music.album ?? '', searchTerm),
            ),
          ),
        )
        .limit(20);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
