import VideoPlayer from "@/components/VideoPlayer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query as { videoId: string };

  return <VideoPlayer id={videoId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query },
  };
};

export default VideoPage;
