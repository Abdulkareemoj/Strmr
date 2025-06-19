import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import { createClient } from "~/utils/supabase/client";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Set proper headers
  res.setHeader("Content-Type", "application/json");

  try {
    const supabase = createClient();

    switch (req.method) {
      case "POST":
        return handleUpload(req, res, supabase);
      case "DELETE":
        return handleDelete(req, res, supabase);
      case "GET":
        return handleGet(req, res, supabase);
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("API route error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
      details: env.NODE_ENV === "development" ? error : undefined,
    });
  }
}

async function handleUpload(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>,
) {
  try {
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { file, title, description, public: isPublic, thumbnail } = req.body;

    if (!file || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert base64 to buffer
    const base64Data = file.split(",")[1];
    if (!base64Data) {
      return res.status(400).json({ error: "Invalid file format" });
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
      return res.status(500).json({ error: uploadError.message });
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
        return res.status(500).json({ error: thumbnailError.message });
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
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json({ video });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to upload video",
    });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>,
) {
  try {
    const { videoId } = req.query;

    if (!videoId || typeof videoId !== "string") {
      return res.status(400).json({ error: "No video ID provided" });
    }

    // First, get the video record
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select()
      .eq("videoId", videoId)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("strmrvids")
      .remove([`videos/${video.videoId}`]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return res.status(500).json({ error: storageError.message });
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("videoId", videoId);

    if (deleteError) {
      console.error("Database delete error:", deleteError);
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to delete video",
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>,
) {
  try {
    const { videoId } = req.query;

    if (videoId && typeof videoId === "string") {
      // Get specific video
      const { data: video, error } = await supabase
        .from("videos")
        .select()
        .eq("videoId", videoId)
        .single();

      if (error) {
        return res.status(404).json({ error: "Video not found" });
      }

      // Check if the video is public or if the user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!video.public && !session?.user) {
        return res
          .status(403)
          .json({ error: "Forbidden: This video is private" });
      }

      // Create a signed URL if needed
      const { data: signedUrl } = await supabase.storage
        .from("strmrvids")
        .createSignedUrl(`videos/${video.videoId}`, 3600);

      return res.status(200).json({
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
        return res.status(500).json({ error: "Failed to fetch videos" });
      }

      return res.status(200).json(videos);
    }
  } catch (error) {
    console.error("Get error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch videos",
    });
  }
}
