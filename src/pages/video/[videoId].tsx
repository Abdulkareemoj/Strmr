import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import VideoPlayer from "~/components/VideoPlayer";
import { env } from "~/env";

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query;
  const [videoData, setVideoData] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideoData() {
      if (typeof videoId !== "string") return;

      try {
        const response = await fetch(
          `/api/videos?id=${encodeURIComponent(videoId)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch video data");
        }
        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video. Please try again later.");
      }
    }

    fetchVideoData();
  }, [videoId]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  if (!videoData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{videoData.name}</h1>
      <VideoPlayer src={videoData.url} />
    </div>
  );
}
