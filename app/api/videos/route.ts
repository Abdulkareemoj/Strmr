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

// POST /api/videos
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
      .upload(`videos/${fileName}`, fileData, {
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
    } = supabase.storage.from("strmrvids").getPublicUrl(`videos/${fileName}`);

    // Handle thumbnail
    let thumbnailUrl = null;

    if (thumbnail) {
      // Process the thumbnail from the client
      const thumbnailName = `thumbnail_${fileName.replace(".mp4", ".jpg")}`;

      // Convert base64 thumbnail to buffer
      const thumbnailData = Buffer.from(thumbnail.split(",")[1], "base64");

      // Upload the thumbnail
      const { error: thumbnailError } = await supabase.storage
        .from("strmrvids")
        .upload(`thumbnails/${thumbnailName}`, thumbnailData, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });

      if (thumbnailError) {
        console.error("Thumbnail upload error:", thumbnailError);
        // Continue without a thumbnail - we'll create a fallback
      } else {
        // Get the public URL for the thumbnail
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
      // Generate a thumbnail name
      const thumbnailName = `thumbnail_${fileName.replace(".mp4", ".jpg")}`;
      // Create a simple placeholder thumbnail (1x1 pixel transparent image)
      const placeholderThumbnail = Buffer.from(
        "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==",
        "base64",
      );

      // Upload the placeholder thumbnail
      const { error: thumbnailError } = await supabase.storage
        .from("strmrvids")
        .upload(`thumbnails/${thumbnailName}`, placeholderThumbnail, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });

      if (thumbnailError) {
        console.error("Thumbnail upload error:", thumbnailError);
        // Clean up the video file since we couldn't upload the thumbnail
        await supabase.storage.from("strmrvids").remove([`videos/${fileName}`]);
        return NextResponse.json(
          { error: thumbnailError.message },
          { status: 500 },
        );
      }

      // Get the public URL for the thumbnail
      const {
        data: { publicUrl: thumbUrl },
      } = supabase.storage
        .from("strmrvids")
        .getPublicUrl(`thumbnails/${thumbnailName}`);

      thumbnailUrl = thumbUrl;
    }

    // Create video record in Supabase database
    const { data: video, error: insertError } = await supabase
      .from("videos")
      .insert({
        title,
        description,
        videoId: fileName,
        url: publicUrl,
        public: isPublic,
        thumbnailUrl: thumbnailUrl,
        duration: 0,
        userId: session.user.id, // Use the actual user ID
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      await supabase.storage.from("strmrvids").remove([`videos/${fileName}`]);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to upload video",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/videos?videoId=...
export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json(
      { error: "No video ID provided" },
      { status: 400 },
    );
  }
  try {
    // Get the video record
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select()
      .eq("videoId", videoId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("strmrvids")
      .remove([`videos/${video.videoId}`]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 },
      );
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("videoId", videoId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete video",
      },
      { status: 500 },
    );
  }
}

// GET /api/videos or /api/videos?videoId=...
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  try {
    if (videoId) {
      // Get specific video
      const { data: video, error } = await supabase
        .from("videos")
        .select()
        .eq("videoId", videoId)
        .single();

      if (error) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }

      // Check if the video is public or if the user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!video.public && !session?.user) {
        return NextResponse.json(
          { error: "Forbidden: This video is private" },
          { status: 403 },
        );
      }

      // Create a signed URL if needed
      const { data: signedUrl } = await supabase.storage
        .from("strmrvids")
        .createSignedUrl(`videos/${video.videoId}`, 3600);

      return NextResponse.json({
        ...video,
        url: signedUrl?.signedUrl || video.url,
      });
    } else {
      // Get all public videos
      const { data: videos, error } = await supabase
        .from("videos")
        .select()
        .eq("public", true)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch videos" },
          { status: 500 },
        );
      }

      return NextResponse.json(videos);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch videos",
      },
      { status: 500 },
    );
  }
}
