import { NextRequest, NextResponse } from "next/server";
import { createClient } from "~/utils/supabase/client";

// Helper to parse JSON body in POST
async function parseJsonBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// POST /api/shorts
export async function POST(request: NextRequest) {
  const supabase = createClient();
  try {
    const body = await parseJsonBody(request);

    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { file, title, description, public: isPublic, thumbnail } = body;

    if (!file || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Convert base64 to buffer
    const base64Data = file.split(",")[1];
    if (!base64Data) {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 },
      );
    }
    const fileData = Buffer.from(base64Data, "base64");
    const fileName = `${Date.now()}_${title.replace(/\s+/g, "_")}.mp4`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("strmrvids")
      .upload(`shorts/${fileName}`, fileData, {
        contentType: "video/mp4",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("strmrvids").getPublicUrl(`shorts/${fileName}`);

    // Handle thumbnail
    let thumbnailUrl = null;

    if (thumbnail) {
      const thumbnailName = `thumbnail_${fileName.replace(".mp4", ".jpg")}`;
      const thumbnailData = Buffer.from(thumbnail.split(",")[1], "base64");
      const { error: thumbnailError } = await supabase.storage
        .from("strmrvids")
        .upload(`thumbnails/${thumbnailName}`, thumbnailData, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });
      if (!thumbnailError) {
        const {
          data: { publicUrl: thumbUrl },
        } = supabase.storage
          .from("strmrvids")
          .getPublicUrl(`thumbnails/${thumbnailName}`);
        thumbnailUrl = thumbUrl;
      }
    }

    // If we still don't have a thumbnail URL, create a fallback
    if (!thumbnailUrl) {
      const thumbnailName = `thumbnail_${fileName.replace(".mp4", ".jpg")}`;
      const placeholderThumbnail = Buffer.from(
        "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==",
        "base64",
      );
      const { error: thumbnailError } = await supabase.storage
        .from("strmrvids")
        .upload(`thumbnails/${thumbnailName}`, placeholderThumbnail, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });
      if (!thumbnailError) {
        const {
          data: { publicUrl: thumbUrl },
        } = supabase.storage
          .from("strmrvids")
          .getPublicUrl(`thumbnails/${thumbnailName}`);
        thumbnailUrl = thumbUrl;
      }
    }

    // Create short record in Supabase database
    const { data: short, error: insertError } = await supabase
      .from("shorts")
      .insert({
        title,
        description,
        shortId: fileName,
        url: publicUrl,
        public: isPublic,
        thumbnailUrl: thumbnailUrl,
        duration: 0,
        userId: session.user.id,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage
        .from("strmrvids")
        .remove([
          `shorts/${fileName}`,
          `thumbnails/thumbnail_${fileName.replace(".mp4", ".jpg")}`,
        ]);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ short });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload short",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/shorts?shortId=...
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const shortId = searchParams.get("shortId");
  if (!shortId) {
    return NextResponse.json(
      { error: "No short ID provided" },
      { status: 400 },
    );
  }
  try {
    // First, get the short record
    const { data: short, error: fetchError } = await supabase
      .from("shorts")
      .select()
      .eq("shortId", shortId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "Short not found" }, { status: 404 });
    }

    // Delete from storage - both video and thumbnail
    const thumbnailName = `thumbnail_${short.shortId.replace(".mp4", ".jpg")}`;
    const { error: storageError } = await supabase.storage
      .from("strmrvids")
      .remove([`shorts/${short.shortId}`, `thumbnails/${thumbnailName}`]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 },
      );
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("shorts")
      .delete()
      .eq("shortId", shortId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Short deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete short",
      },
      { status: 500 },
    );
  }
}

// GET /api/shorts or /api/shorts?shortId=...
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const shortId = searchParams.get("shortId");
  try {
    if (shortId) {
      // Get specific short
      const { data: short, error } = await supabase
        .from("shorts")
        .select()
        .eq("shortId", shortId)
        .single();

      if (error) {
        return NextResponse.json({ error: "Short not found" }, { status: 404 });
      }

      // Check if the short is public or if the user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!short.public && !session?.user) {
        return NextResponse.json(
          { error: "Forbidden: This short is private" },
          { status: 403 },
        );
      }

      // Create a signed URL if needed
      const { data: signedUrl } = await supabase.storage
        .from("strmrvids")
        .createSignedUrl(`shorts/${short.shortId}`, 3600);

      return NextResponse.json({
        ...short,
        url: signedUrl?.signedUrl || short.url,
      });
    } else {
      // Get all public shorts
      const { data: shorts, error } = await supabase
        .from("shorts")
        .select()
        .eq("public", true)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch shorts" },
          { status: 500 },
        );
      }

      return NextResponse.json(shorts);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch shorts",
      },
      { status: 500 },
    );
  }
}
