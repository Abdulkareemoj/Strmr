import { useRouter } from "next/router";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "~/utils/supabase/component";
import VideoPlayer from "~/components/VideoPlayer";
import { GetServerSideProps } from "next";
import { requireAuth } from "~/lib/auth";

const supabase = createClient();

interface ShortData {
  title: string;
  url: string;
  description: string;
}

export default function ShortPage() {
  const router = useRouter();
  const { shortId } = router.query;

  const {
    data: shortData,
    error,
    isValidating,
  } = useQuery<ShortData>(
    shortId
      ? supabase
          .from("Short")
          .select("title, url, description")
          .eq("shortId", shortId)
          .single()
      : null
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        Failed to load short. Please try again later.
      </div>
    );
  }

  if (isValidating || !shortData) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{shortData.title}</h1>
      <div className="mx-auto max-w-sm">
        <div className="aspect-[9/16] overflow-hidden rounded-lg">
          <VideoPlayer
            src={shortData.url}
            // autoPlay
            // loop
            // controls
            // className="h-full w-full object-cover"
          />
        </div>
        {shortData.description && (
          <p className="mt-4 text-muted-foreground">{shortData.description}</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};
