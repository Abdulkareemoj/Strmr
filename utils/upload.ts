// ~/lib/uploadVideo.ts
import { createClient } from "~/utils/supabase/client";
const supabase = createClient();
type Category = "videos" | "shorts";

// Upload video or thumbnail to Supabase Storage
export async function uploadToSupabase(
  file: File,
  path: string,
): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("strmrvids")
    .upload(`${path}/${fileName}`, file);

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: publicUrlData } = supabase.storage
    .from("strmrvids")
    .getPublicUrl(`${path}/${fileName}`);
  return publicUrlData.publicUrl;
}

interface UploadResult {
  videoUrl: string;
  thumbnailUrl?: string;
}

function startProgressTicker(onProgress?: (p: number) => void) {
  if (!onProgress) {
    return {
      finish() {},
      stopAt(_n: number) {},
    };
  }

  let pct = 10;
  onProgress(Math.round(pct));
  const id = setInterval(() => {
    // increase by small random increments up to 90%
    pct = Math.min(90, pct + Math.floor(Math.random() * 7) + 1);
    onProgress(Math.round(pct));
  }, 250);

  return {
    finish() {
      clearInterval(id);
      onProgress(100);
      // small delay then reset to 0 so UI can clear
      setTimeout(() => onProgress(0), 450);
    },
    stopAt(n: number) {
      clearInterval(id);
      onProgress(n);
    },
  };
}

export async function uploadVideo(
  file: File,
  folder: "videos" | "shorts",
  onProgress?: (p: number) => void,
) {
  try {
    if (onProgress) onProgress(10);

    const duration = await getVideoDuration(file);
    if (onProgress) onProgress(20);

    // Generate thumbnail
    const thumbnailBlob = await generateThumbnail(file);
    if (onProgress) onProgress(30);

    const timestamp = Date.now();
    const videoPath = `${folder}/${timestamp}-${file.name}`;
    const thumbPath = `${folder}/thumbnails/${timestamp}-thumb.png`;

    // Upload video
    const { error: videoError } = await supabase.storage
      .from("strmrvids")
      .upload(videoPath, file);
    if (videoError) throw videoError;
    if (onProgress) onProgress(70);

    // Upload thumbnail
    const { error: thumbError } = await supabase.storage
      .from("strmrvids")
      .upload(thumbPath, thumbnailBlob);
    if (thumbError) throw thumbError;
    if (onProgress) onProgress(90);

    const { data: videoUrlData } = supabase.storage
      .from("strmrvids")
      .getPublicUrl(videoPath);
    const { data: thumbUrlData } = supabase.storage
      .from("strmrvids")
      .getPublicUrl(thumbPath);

    if (onProgress) onProgress(100);

    return {
      videoUrl: videoUrlData.publicUrl,
      thumbnail_url: thumbUrlData.publicUrl,
      duration,
      fileName: `${timestamp}-${file.name}`,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
}

export async function generateThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(1, video.duration / 2);
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject("Thumbnail generation failed");
      }, "image/png");
    });

    video.onerror = (e) => reject(e);
  });
}

export default function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve(video.duration);
    video.onerror = (err) => reject(err);
  });
}
