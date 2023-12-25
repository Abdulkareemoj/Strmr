//To retrieve and display the video URLs stored in your database, you can create a new API route to fetch the videos from the database, and then use fetch in your React component to get the data from this API route.

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const videos = await prisma.video.findMany();
    res.status(200).json(videos);
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

if (req.method === "GET") {
  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).json({ message: "Missing video ID or type" });
  }

  const video = await prisma.video.findUnique({
    where: { id: Number(id) },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const folder = type === "short" ? "shorts" : "videos"; // Set the folder based on the type
  const videoUrl =
    `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/video/upload/${folder}/${video.videoId}.mp4`;

  const videoStream = await fetch(videoUrl);

  res.setHeader("Content-Type", "video/mp4");
  videoStream.body.pipe(res);
}
