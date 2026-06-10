import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { short } from "~/server/db/schema/short-schema";
import { eq } from "drizzle-orm";
import VideoPlayer from "~/components/VideoPlayer";

interface PageProps {
  params: Promise<{ shortId: string }>;
}

export default async function ShortPage({ params }: PageProps) {
  const { shortId } = await params;

  const [shortData] = await db
    .select()
    .from(short)
    .where(eq(short.id, shortId));

  if (!shortData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{shortData.title}</h1>
      <div className="mx-auto max-w-sm">
        <div className="aspect-9/16 overflow-hidden rounded-lg">
          <VideoPlayer src={shortData.url} />
        </div>
        {shortData.description && (
          <p className="text-muted-foreground mt-4">{shortData.description}</p>
        )}
      </div>
    </div>
  );
}
