import { type UploadApiOptions, v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadVideoParams {
  type: string;
  fileBuffer: Buffer;
}

interface CloudinaryUploadApiResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  duration: number; // The duration is a number, not a string
}

export default async function uploadVideo(
  { type, fileBuffer }: UploadVideoParams,
) {
  const folder = type === "short" ? "shorts" : "videos";

  try {
    const result: CloudinaryUploadApiResponse =
      await (cloudinary.uploader.upload as unknown as (
        file: string | Buffer,
        options: UploadApiOptions,
      ) => Promise<CloudinaryUploadApiResponse>)(fileBuffer, {
        resource_type: "video",
        folder,
      });

    // Process the Cloudinary result, save to the database, etc.
    const videoDetails = {
      id: result.public_id,
      description: "A great video", // Replace with the actual description
      videoId: result.public_id,
      public: true, // Replace with the actual value
      url: result.url,
      thumbnailUrl: result.secure_url.replace(".mp4", ".jpg"),
      duration: result.duration,
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
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading to Cloudinary");
  }
}
