// import { type NextApiRequest, type NextApiResponse } from "next";
// import Busboy from "busboy";
// import uploadVideo from "./uploadVideo"; // Your video upload function

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method === "POST") {
//     const busboy = Busboy({ headers: req.headers });
//     let type = "";

//     // Listen for form data fields
//     busboy.on("field", (fieldname, value) => {
//       if (fieldname === "type") {
//         type = value;
//       }
//     });

//     // Listen for file upload
//     busboy.on("file", (fieldname, file, filename) => {
//       const chunks: Buffer[] = [];
//       file.on("data", (chunk: Buffer) => {
//         chunks.push(chunk);
//       });

//       file.on("end", () => {
//         const fileBuffer = Buffer.concat(chunks);

//         try {
//           uploadVideo({ type, fileBuffer })
//             .then((result) => {
//               res.status(200).json(result);
//             })
//             .catch((error) => {
//               console.error("Error uploading video:", error);
//               res.status(500).json({ error: "Internal Server Error" });
//             });
//         } catch (error) {
//           console.error("Error uploading video:", error);
//           res.status(500).json({ error: "Internal Server Error" });
//         }
//       });
//     });

//     req.pipe(busboy);
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }
