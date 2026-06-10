import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { video } from "~/server/db/schema/video-schema";
import { eq } from "drizzle-orm";
import VideoPlayer from "~/components/VideoPlayer";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { videoId } = await params;

  const [videoData] = await db
    .select()
    .from(video)
    .where(eq(video.id, videoId));

  if (!videoData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{videoData.title}</h1>
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <VideoPlayer src={videoData.url} />
      </div>
      {videoData.description && (
        <p className="text-muted-foreground mt-4">{videoData.description}</p>
      )}
    </div>
  );
}
