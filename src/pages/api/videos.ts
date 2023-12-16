// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import fs from "fs";
import fileType from "file-type";
import { pipeline } from "stream";
import util from "util";
import cloudinary from "cloudinary";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Upload to cloudinary

// const pipelinePromise = util.promisify(pipeline);

async function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth.getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }

  if (session.user.role !== "admin") {
    res.status(403).json({ message: "Not authorized" });
    return;
  }
  const bb = busboy({ headers: req.headers });

  bb.on("file", async (_, file, info) => {
    const fileName = info.filename;
    const filePath = `./videos/${fileName}`;
    const stream = fs.createWriteStream(filePath);
    file.pipe(stream);
    // In your upload function, after uploading to Cloudinary
    cloudinary.v2.uploader.upload(
      filePath,
      { resource_type: "video" },
      async (error, result) => {
        if (error) {
          console.error("Upload to Cloudinary failed:", error);
        } else {
          console.log(
            "Upload to Cloudinary successful. Video URL:",
            result.url,
          );

          // Create a new video record and save it to the database
          const video = await prisma.video.create({
            data: {
              title: "My Video",
              description: "A great video",
              videoId: result.public_id,
              public: true, // Set this based on the user's input
              // Add any other fields you need
            },
          });

          console.log("Video saved to database successfully:", video);
        }
      },
    );
  });

  bb.on("close", () => {
    res.writeHead(200, { Connection: "close" });
    res.end(`That's all folks`);
  });
  req.pipe(bb);
  return;
}

// const CHUNK_SIZE_IN_BYTES = 1000000; //1mb?
// function getVideoStream(req: NextApiRequest, res: NextApiResponse) {
//   const range = req.headers.range;

//   if (!range) {
//     return res.status(400).send("No range");
//   }

//   const videoId = req.query.videoId;
//   const videoPath = `./videos/${videoId}.mp4`;
//   const videoSizeInBytes = fs.statSync(videoPath).size;
//   const chunkStart = Number(range.replace(/\D/g, ""));
//   const chunkEnd = Math.min(
//     chunkStart + CHUNK_SIZE_IN_BYTES,
//     videoSizeInBytes - 1,
//   );

//   const contentLength = chunkEnd - chunkStart + 1;

//   const headers = {
//     "Content-Range": `bytes ${chunkStart}- ${chunkEnd}/${videoSizeInBytes}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };
//   res.writeHead(206, headers);
//   const videoStream = fs.createReadStream(videoPath, {
//     start: chunkStart,
//     end: chunkEnd,
//   });
//   videoStream.pipe(res);
// }
// do some error checking to make sure a video exists and if not return a 404

// Modify your getVideos API route:

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method;

  // if (method === "GET") {
  //   return getVideoStream(req, res);
  // }

  // if (req.method !== "GET") {
  //   return res.status(405).json({ message: "Method not allowed" });
  // }

  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 10;

  // const videos = await prisma.video.findMany({
  //   skip: (page - 1) * limit,
  //   take: limit,
  // });

  // res.status(200).json(videos);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Missing video ID" });
  }

  const video = await prisma.video.findUnique({
    where: { id: Number(id) },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const videoUrl =
    `https://res.cloudinary.com/your-cloud-name/video/upload/${video.videoId}.mp4`;

  const videoStream = await fetch(videoUrl);

  res.setHeader("Content-Type", "video/mp4");
  videoStream.body.pipe(res);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const videos = await prisma.video.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  res.status(200).json(videos);

  if (method === "POST") {
    return uploadVideoStream(req, res);
  }
  return res.status(405).json({ error: `Method ${method} not allowed` });
}
