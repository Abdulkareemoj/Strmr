/* eslint-disable  @typescript-eslint/no-unsafe-argument */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "~/utils/supabase/component";

const supabase = createClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "No file key provided" });
  }

  try {
    const { error } = await supabase.storage.from("strmrvids").remove([key]);

    if (error) throw error;

    res.status(200).json({ message: "Short deleted successfully" });
  } catch (error) {
    console.error("Error deleting short:", error);
    res.status(500).json({ error: "Failed to delete short" });
  }
}
