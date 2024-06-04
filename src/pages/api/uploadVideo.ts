import { createClient } from "@supabase/supabase-js";

const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function uploadVideo(type: string, fileBuffer: Buffer) {
  const folder = type === "short" ? "shorts" : "videos";

  try {
    // Upload the video to Supabase
    const { data, error } = await supabase.storage
      .from("my-bucket")
      .upload(`${folder}/my-video.mp4`, fileBuffer);
    if (error) throw error;

    // Get the video URL and metadata
    const url = supabase.storage
      .from("my-bucket")
      .getPublicUrl(`${folder}/my-video.mp4`);
    const { data: metadata, error: metadataError } = await supabase.storage
      .from("my-bucket")
      .get(`${folder}/my-video.mp4`);
    if (metadataError) throw metadataError;

    // Process the Supabase result, save to the database, etc.
    const videoDetails = {
      url,
      metadata,
      // Add any other fields you need
    };

    // Save to the database based on the type (short or regular)
    if (type === "short") {
      // Save to short video model
    } else {
      // Save to regular video model
    }

    return videoDetails;
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    throw new Error("Error uploading to Supabase");
  }
}

//   public_id: string;
//   version: number;
//   signature: string;
//   width: number;
//   height: number;
//   format: string;
//   resource_type: string;
//   created_at: string;
//   tags: string[];
//   bytes: number;
//   type: string;
//   etag: string;
//   placeholder: boolean;
//   url: string;
//   secure_url: string;
//   original_filename: string;
//   duration: number; // The duration is a number, not a string
