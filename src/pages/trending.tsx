import VideoList from "~/components/videoList";

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
