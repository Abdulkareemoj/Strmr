import { useState, useEffect } from "react";

export default function VideoList() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch(`/api/videos?page=${page}&limit=10`);
      const data = await res.json();
      setVideos(data);
    };

    fetchVideos();
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
