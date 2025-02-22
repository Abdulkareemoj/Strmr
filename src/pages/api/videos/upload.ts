// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable  @typescript-eslint/no-unsafe-argument */
// import type { NextApiRequest, NextApiResponse } from "next";
// import { createClient } from "~/utils/supabase/component";

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "100mb", // Set the maximum file size
//     },
//   },
// };

// const supabase = createClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { file, fileName } = req.body;

//     if (!file || !fileName) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Decode base64 file data
//     const fileData = Buffer.from(file.split(",")[1], "base64");

//     const { data, error } = await supabase.storage
//       .from("strmrvids")
//       .upload(`videos/${fileName}`, fileData, {
//         contentType: "video/mp4", // Adjust this based on the actual file type
//         cacheControl: "3600",
//         upsert: false,
//       });

//     if (error) throw error;

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("strmrvids").getPublicUrl(`videos/${fileName}`);

//     res.status(200).json({ path: data.path, publicUrl });
//   } catch (error) {
//     console.error("Error uploading video:", error);
//     res.status(500).json({ error: "Failed to upload video" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "~/utils/supabase/component"
import { db } from "~/server/db"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Create Supabase server client
  const supabase = createClient()

  // Get the user session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { file, title, description, public: isPublic } = req.body

    if (!file || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Convert base64 to buffer
    const fileData = Buffer.from(file.split(',')[1], 'base64')
    const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.mp4`

    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("strmrvids")
      .upload(`videos/${fileName}`, fileData, {
        contentType: 'video/mp4',
        cacheControl: "3600",
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("strmrvids")
      .getPublicUrl(`videos/${fileName}`)

    // Create video record in database
    const video = await db.video.create({
      data: {
        title,
        description,
        videoId: fileName,
        public: isPublic,
        url: publicUrl,
        thumbnailUrl: "", // TODO: Generate thumbnail
        duration: 0, // TODO: Get video duration
        userId: session.user.id,
      },
    })

    res.status(200).json({ video })
  } catch (error) {
    console.error("Error uploading video:", error)
    res.status(500).json({ error: "Failed to upload video" })
  }
}