import * as React from "react";
import { createClient } from "~/utils/supabase/component";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

const supabase = createClient();

interface Video {
  id: string;
  title: string;
  description: string;
  public_url: string;
}
export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        await fetchVideos();
      } catch (err) {
        console.error("Error during fetchVideos execution:", err);
      }
    })().catch((err) => console.error("Unhandled error:", err));
  }, []);

  async function fetchVideos() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("video_metadata")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
      setError("Failed to load videos. Please try again.");
    } else {
      setVideos(data);
    }
    setLoading(false);
  }

  if (loading) {
    return <div>Loading videos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <MediaPlayer title={video.title}>
            <MediaProvider>
              <source src={video.public_url} type="video/mp4" />
            </MediaProvider>
          </MediaPlayer>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{video.title}</h3>
            <p className="text-sm text-gray-500">{video.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
