// import { type Metadata } from "next";
// import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Search",
//   description: "Search Page",
// };

// export default function HomePage() {
//   const [query, setQuery] = useState("");
//   const [videos, setVideos] = useState([]);

//   const searchVideos = async () => {
//     const res = await fetch(`/api/videos/search?query=${query}`);
//     const data = await res.json();
//     setVideos(data);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <button onClick={searchVideos}>Search</button>
//       {videos.map((video) => (
//         <div key={video.id}>
//           <h2>{video.title}</h2>
//           <p>{video.description}</p>
//           {/* Add a video player here */}
//         </div>
//       ))}
//     </div>
//   );
// }
