import { useState, useEffect } from "react";

export const metadata: Metadata = {
  title: "Videos",
  description: "Videos Page",
};
export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch(`/api/videoURLs?page=${page}&limit=10`);
      const data = await res.json();
      setVideos(data);
    };

    void fetchVideos();
  }, [page]);

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id}>
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          {/* Add a video player here */}
        </div>
      ))}
      <button
        onClick={() => setPage((prevPage) => prevPage - 1)}
        disabled={page === 1}
      >
        Previous
      </button>
      <button onClick={() => setPage((prevPage) => prevPage + 1)}>Next</button>
    </div>
  );
}
export async function getServerSideProps() {}

// import { useEffect, useState } from "react";

// export default function VideoList() {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     async function fetchVideos() {
//       const response = await fetch("/api/videoURLs");
//       const data = await response.json();
//       setVideos(data);
//     }

//     fetchVideos();
//   }, []);

//   return (
//     <div>
//       {videos.map((video) => (
//         <video key={video.id} src={video.url} controls />
//       ))}
//     </div>
//   );
// }

/////infinite scroll

// import { useEffect, useState, useRef } from 'react';

// export default function VideoList() {
//   const [videos, setVideos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const loader = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, { root: null, rootMargin: '20px', threshold: 1.0 });

//     if (loader.current) {
//       observer.observe(loader.current)
//     }
//   }, []);

//   useEffect(() => {
//     async function fetchVideos() {
//       const response = await fetch(`/api/videos?page=${page}&pageSize=10`);
//       const data = await response.json();
//       setVideos((prevVideos) => [...prevVideos, ...data.videos]);
//       setTotal(data.total);
//     }

//     fetchVideos();
//   }, [page]);

//   function handleObserver(entities: IntersectionObserverEntry[], observer: IntersectionObserver) {
//     const target = entities[0];
//     if (target.isIntersecting) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   }

//   return (
//     <div>
//       {videos.map((video) => (
//         <video key={video.id} src={video.url} controls />
//       ))}
//       {videos.length < total && <div ref={loader}>Loading...</div>}
//     </div>
//   );
// }
