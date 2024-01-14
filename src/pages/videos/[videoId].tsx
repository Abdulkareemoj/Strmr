import VideoPlayer from "~/components/VideoPlayer";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query as { videoId: string };

  return <VideoPlayer id={videoId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query },
  };
};
