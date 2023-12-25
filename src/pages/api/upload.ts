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
import uploadVideo from "./uploadVideo"; // Your video upload function

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const busboy = Busboy({ headers: req.headers });
    let type = "";

    // Listen for form data fields
    busboy.on("field", (fieldname, value) => {
      if (fieldname === "type") {
        type = value;
      }
    });

    // Listen for file upload
    busboy.on("file", (fieldname, file, filename) => {
      const chunks: Buffer[] = [];
      file.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      file.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);

        try {
          uploadVideo({ type, fileBuffer })
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((error) => {
              console.error("Error uploading video:", error);
              res.status(500).json({ error: "Internal Server Error" });
            });
        } catch (error) {
          console.error("Error uploading video:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });

    req.pipe(busboy);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
