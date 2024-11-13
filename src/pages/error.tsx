import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-black">404</h1>
      <p className="text-4xl font-extrabold">Page not found</p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Go home
      </Link>
    </div>
  );
}
