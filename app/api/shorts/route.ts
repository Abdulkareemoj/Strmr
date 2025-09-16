import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/utils/supabase/client";

const supabaseAdmin = createClient();

// POST /api/shorts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Short upload body:", body);

    const {
      title,
      description,
      public: isPublic,
      url,
      short_id,
      thumbnail_url,
      duration,
      user_id,
    } = body;

    if (!title || !description || !url || !short_id || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("shorts")
      .insert([
        {
          title,
          description,
          public: isPublic,
          url,
          short_id,
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

    return NextResponse.json({ short: data });
  } catch (error: any) {
    console.error("POST /api/shorts error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/shorts?shortId=...
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const short_id = searchParams.get("shortId");

  if (!short_id) {
    return NextResponse.json({ error: "Missing shortId" }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from("shorts")
      .delete()
      .eq("shortId", short_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Short deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/shorts error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/shorts
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("shorts")
      .select("*")
      .eq("public", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET /api/shorts error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
