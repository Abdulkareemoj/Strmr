import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";
import { createClient } from "~/utils/supabase/component";

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (id && typeof id === "string") {
      // Fetch a specific short
      try {
        const { data, error } = await supabase.storage
          .from(env.FOLDER_NAME)
          .createSignedUrl(`shorts/${id}`, 3600); // 1 hour expiration

        if (error) throw error;

        if (!data) {
          return res.status(404).json({ error: "short not found" });
        }

        res.status(200).json({ name: id, url: data.signedUrl });
      } catch (error) {
        console.error("Error fetching short:", error);
        res.status(500).json({ error: "Failed to fetch short" });
      }
    } else {
      // Fetch all shorts (existing functionality)
      try {
        const { data, error } = await supabase.storage
          .from(env.FOLDER_NAME)
          .list("shorts", {
            sortBy: { column: "name", order: "asc" },
          });

        if (error) throw error;

        const shortFiles = data.filter((item) =>
          /\.(mp4|webm|ogg)$/i.test(item.name),
        );

        const shortsWithUrls = await Promise.all(
          shortFiles.map(async (file) => {
            const { data } = await supabase.storage
              .from("strmrvids")
              .createSignedUrl(`shorts/${file.name}`, 3600); // 1 hour expiration

            return {
              name: file.name,
              url: data?.signedUrl,
            };
          }),
        );

        res.status(200).json(shortsWithUrls);
      } catch (error) {
        console.error("Error fetching shorts:", error);
        res.status(500).json({ error: "Failed to fetch shorts" });
      }
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
