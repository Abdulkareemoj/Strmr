import { GetServerSideProps, type Metadata } from "next";
import { requireAuth } from "~/lib/auth";
// import { useState } from "react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Page",
};

export default function HomePage() {
  //   const [query, setQuery] = useState("");
  //   const [videos, setVideos] = useState([]);

  //   const searchVideos = async () => {
  //     const res = await fetch(`/api/videos/search?query=${query}`);
  //     const data = await res.json();
  //     setVideos(data);
  //   };

  return (
    <div>Search</div>
    // <div>
    //   <input
    //     type="text"
    //     value={query}
    //     onChange={(e) => setQuery(e.target.value)}
    //   />
    //   <button onClick={searchVideos}>Search</button>
    //   {videos.map((video) => (
    //     <div key={video.id}>
    //       <h2>{video.title}</h2>
    //       <p>{video.description}</p>
    //       {/* Add a video player here */}
    //     </div>
    //   ))}
    // </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};
