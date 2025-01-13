import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "~/utils/supabase/component";

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id && typeof id === "string") {
      // Fetch a specific video
      try {
        const { data, error } = await supabase.storage
          .from(process.env.FOLDER_NAME)
          .createSignedUrl(`videos/${id}`, 3600); // 1 hour expiration

        if (error) throw error;

        if (!data) {
          return res.status(404).json({ error: "Video not found" });
        }

        res.status(200).json({ name: id, url: data.signedUrl });
      } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({ error: "Failed to fetch video" });
      }
    } else {
      // Fetch all videos (existing functionality)
      try {
        const { data, error } = await supabase.storage
          .from(process.env.FOLDER_NAME)
          .list("videos", {
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        const videoFiles = data.filter((item) =>
          /\.(mp4|webm|ogg)$/i.test(item.name),
        );

        const videosWithUrls = await Promise.all(
          videoFiles.map(async (file) => {
            const { data } = await supabase.storage
              .from("strmrvids")
              .createSignedUrl(`videos/${file.name}`, 3600); // 1 hour expiration

            return {
              name: file.name,
              url: data?.signedUrl,
            };
          }),
        );

        res.status(200).json(videosWithUrls);
      } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
