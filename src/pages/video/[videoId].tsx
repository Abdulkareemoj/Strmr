import { useRouter } from "next/router";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "~/utils/supabase/component";
import VideoPlayer from "~/components/VideoPlayer";
import { GetServerSideProps } from "next";
import { requireNoAuth } from "~/lib/auth";

const supabase = createClient();

interface VideoData {
  title: string;
  url: string;
  description: string;
  thumbnailUrl: string | null;
}

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query;

  const {
    data: videoData,
    error,
    isValidating,
  } = useQuery<VideoData>(
    videoId
      ? supabase
          .from("Video")
          .select("title, url, description, thumbnailUrl")
          .eq("videoId", videoId)
          .single()
      : null
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Failed to load video. Please try again later.
      </div>
    );
  }

  if (isValidating || !videoData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{videoData.title}</h1>
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <VideoPlayer
          src={videoData.url}
          // poster={videoData.thumbnailUrl || undefined}
          // controls
          // className="h-full w-full"
        />
      </div>
      {videoData.description && (
        <p className="mt-4 text-muted-foreground">{videoData.description}</p>
      )}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireNoAuth(context);
};
