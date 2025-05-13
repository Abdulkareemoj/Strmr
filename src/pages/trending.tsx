import { GetServerSideProps } from "next";
import VideoList from "~/components/videoList";
import { requireAuth } from "~/lib/auth";

export default function Trending() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4">Trending</div>
      <main className="flex-1 px-6 py-8 md:px-8">
        <VideoList />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context);
};
