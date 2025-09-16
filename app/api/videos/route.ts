import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/utils/supabase/client";

const supabaseAdmin = createClient();

// POST /api/videos
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      public: isPublic,
      url,
      video_id,
      thumbnail_url,
      duration,
      user_id,
    } = body;

    if (!title || !description || !url || !video_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("videos")
      .insert([
        {
          title,
          description,
          public: isPublic,
          url,
          video_id,
          thumbnail_url,
          duration,
          user_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ video: data });
  } catch (error: any) {
    console.error("POST /api/videos error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/videos?videoId=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const video_id = searchParams.get("_i");

  if (!video_id) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("videos")
      .delete()
      .eq("videoId", video_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/videos error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/videos
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("videos")
      .select("*")
      .eq("public", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/videos error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
