import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { short } from "~/server/db/schema/short-schema";
import { eq } from "drizzle-orm";
import { auth } from "~/server/auth";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";

export async function GET() {
  try {
    const shorts = await db
      .select()
      .from(short)
      .where(eq(short.isPublic, true))
      .orderBy(short.createdAt);
    return NextResponse.json(shorts);
  } catch (error) {
    console.error("GET /api/shorts error:", error);
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

    const [newShort] = await db
      .insert(short)
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

    return NextResponse.json({ short: newShort });
  } catch (error) {
    console.error("POST /api/shorts error:", error);
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
      return NextResponse.json({ error: "Missing short id" }, { status: 400 });
    }

    await db.delete(short).where(eq(short.id, id));
    return NextResponse.json({ message: "Short deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/shorts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
