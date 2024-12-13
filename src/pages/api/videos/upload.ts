/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-unsafe-argument */
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "~/utils/supabase/component";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb", // Set the maximum file size
    },
  },
};

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file, fileName } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Decode base64 file data
    const fileData = Buffer.from(file.split(",")[1], "base64");

    const { data, error } = await supabase.storage
      .from("strmrvids")
      .upload(`videos/${fileName}`, fileData, {
        contentType: "video/mp4", // Adjust this based on the actual file type
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("strmrvids").getPublicUrl(`videos/${fileName}`);

    res.status(200).json({ path: data.path, publicUrl });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
}
