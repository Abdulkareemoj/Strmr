import ShortsList from "~/components/shortsList";

export default function Shorts() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-4">Shorts</div>
      <main className="flex-1 px-6 py-8 md:px-8">
        <ShortsList />
      </main>
    </div>
  );
}
