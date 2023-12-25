// i have 2 categories of videos to upload, shorts and regular videos
// i want to Upload the regular video or short with details to cloudinary from upload form
//upload videos to separate folders depending on whether it is a short or a regular videos
//then get the{
// id
// description
// videoId
// public
// url
// thumbnailUrl
// duration
//}
// send them to db based on whether it is a short or regular video
// my database already has separate models for short and video
// they collect the same details
// its just for the backend to upload it to the correct place
// is it fine to do it from one backend api or create 2 separate apis on and upload to handle the upload function to cloudinary because the two categories will have different folders to upload to
import { type NextApiRequest, type NextApiResponse } from "next";
import Busboy from "busboy";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  type Prisma,
  PrismaClient,
  type Short,
  type Video,
} from "@prisma/client";

const prisma = new PrismaClient();

interface VideoRequestBody {
  type: "short" | "video";
}

interface MyApiRequest extends NextApiRequest {
  body: VideoRequestBody;
}

export default async function handler(req: MyApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const videoType = req.body.type;
  const folder = videoType === "short" ? "shorts" : "videos";

  const busboy = Busboy({ headers: req.headers });

  busboy.on(
    "file",
    (fieldname: string, file: NodeJS.ReadableStream, filename: string) => {
      const filepath = `/tmp/${filename}`;
      const writeStream = fs.createWriteStream(filepath);

      file.pipe(writeStream);

      writeStream.on("finish", () => {
        cloudinary.uploader.upload(
          filepath,
          { resource_type: "video", folder },
          async (error, result) => {
            if (error || !result) {
              return res.status(500).json({ error: error?.message });
            }

            const createData: Prisma.Video = {
              id: result.public_id,
              description: "A great video", // Replace with the actual description
              videoId: result.public_id,
              public: true, // Replace with the actual value
              url: result.url,
              thumbnailUrl: result.secure_url.replace(".mp4", ".jpg"),
              duration: parseFloat(result.duration), // Convert the duration to a number
              // Add any other fields you need
            };

            let video;
            if (videoType === "short") {
              video = await prisma.Short.create({
                data: createData as Prisma.Short,
              }).catch((error) => console.error(error)); // Replace 'shortVideo' with the actual model name for short videos
            } else {
              video = await prisma.video.create({ data: createData }).catch((
                error,
              ) => console.error(error));
            }

            res.status(200).json(video);
          },
        );
      });
    },
  );

  req.pipe(busboy);
}
