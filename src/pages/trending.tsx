import Image from "next/image";
import Link from "next/link";
import { type JSX, type SVGProps } from "react";

import { Button } from "~/components/ui/button";

export default function Trending() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <header className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white md:px-8">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <YoutubeIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Video Recommendations</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#" className="hover:underline" prefetch={false}>
            Home
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Trending
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Subscriptions
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Library
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <SearchIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <img
              src="/placeholder.svg"
              width={32}
              height={32}
              alt="User Avatar"
              className="rounded-full"
            />
          </Button>
        </div>
      </header> */}
      <div className="p-4">Trending</div>
      <main className="flex-1 px-6 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              id: 1,
              title: "How to Build a React App with Shadcn UI",
              thumbnail: "/placeholder.svg",
              channel: "Vercel",
              views: "1.2M",
              duration: "12:34",
            },
            {
              id: 2,
              title: "Mastering Tailwind CSS for Responsive Design",
              thumbnail: "/placeholder.svg",
              channel: "CSS Tricks",
              views: "850K",
              duration: "18:22",
            },
            {
              id: 3,
              title: "Exploring the Latest Features in React 18",
              thumbnail: "/placeholder.svg",
              channel: "React Docs",
              views: "560K",
              duration: "25:01",
            },
            {
              id: 4,
              title: "Building a Serverless API with Next.js",
              thumbnail: "/placeholder.svg",
              channel: "Vercel",
              views: "420K",
              duration: "16:48",
            },
            {
              id: 5,
              title: "Optimizing Web Performance with Vite",
              thumbnail: "/placeholder.svg",
              channel: "Vite Docs",
              views: "320K",
              duration: "14:29",
            },
            {
              id: 6,
              title: "Designing Accessible UI Components",
              thumbnail: "/placeholder.svg",
              channel: "Accessibility Experts",
              views: "280K",
              duration: "22:15",
            },
            {
              id: 7,
              title: "Deploying a Full-Stack App with Vercel",
              thumbnail: "/placeholder.svg",
              channel: "Vercel",
              views: "210K",
              duration: "19:42",
            },
            {
              id: 8,
              title: "Mastering State Management with Zustand",
              thumbnail: "/placeholder.svg",
              channel: "Zustand Docs",
              views: "180K",
              duration: "21:03",
            },
          ].map((video) => (
            <Link
              key={video.id}
              href="#"
              className="group overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
              prefetch={false}
            >
              <div className="relative">
                <Image
                  src="/placeholder.svg"
                  width={320}
                  height={180}
                  alt={video.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-1 text-sm text-white">
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-lg font-semibold group-hover:underline">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{video.channel}</span>
                  <span>•</span>
                  <span>{video.views} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      {/* <footer className="flex items-center justify-between bg-gray-900 px-6 py-6 text-white md:px-8">
        <div className="text-sm">
          &copy; 2024 Video Recommendations. All rights reserved.
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#" className="hover:underline" prefetch={false}>
            About
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Contact
          </Link>
        </nav>
      </footer> */}
    </div>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function YoutubeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}
