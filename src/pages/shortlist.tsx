import { useEffect, useState } from "react";

export default function VideoList() {
  const [shorts, setShorts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchVideos() {
      const response = await fetch(`/api/videos?page=${page}&pageSize=10`);
      const data = await response.json();
      setShorts(data);
    }

    fetchVideos();
  }, [page]);

  return (
    <div>
      {shorts.map((short) => (
        <video key={shorts.id} src={shorts.url} controls />
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
