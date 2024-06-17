import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Icons } from "../components/ui/icons";

export default function Shorts() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white md:px-8">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Icons.YoutubeIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Shorts Recommendations</span>
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
            <Icons.MenuIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Icons.SearchIcon className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image
              src="/placeholder.svg"
              width={32}
              height={32}
              alt="User Avatar"
              className="rounded-full"
            />
          </Button>
        </div>
      </header>
      <main className="flex-1 px-6 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              id: 1,
              title: "Hilarious Shorts Compilation #1",
              thumbnail: "/placeholder.svg",
              channel: "Funny Shorts",
              views: "2.4M",
              duration: "0:45",
            },
            {
              id: 2,
              title: "DIY Life Hacks You Need to Try",
              thumbnail: "/placeholder.svg",
              channel: "DIY Guru",
              views: "1.7M",
              duration: "0:58",
            },
            {
              id: 3,
              title: "Cute Puppy Videos to Brighten Your Day",
              thumbnail: "/placeholder.svg",
              channel: "Puppy Lovers",
              views: "1.2M",
              duration: "0:32",
            },
            {
              id: 4,
              title: "Satisfying Slime ASMR Shorts",
              thumbnail: "/placeholder.svg",
              channel: "ASMR Tingles",
              views: "950K",
              duration: "0:41",
            },
            {
              id: 5,
              title: "Crazy Skateboard Tricks You Won't Believe",
              thumbnail: "/placeholder.svg",
              channel: "Skate Legends",
              views: "780K",
              duration: "0:53",
            },
            {
              id: 6,
              title: "Delicious Cooking Hacks in Under a Minute",
              thumbnail: "/placeholder.svg",
              channel: "Cooking Tips",
              views: "620K",
              duration: "0:47",
            },
            {
              id: 7,
              title: "Oddly Satisfying Compilation #3",
              thumbnail: "/placeholder.svg",
              channel: "Satisfying Vids",
              views: "480K",
              duration: "0:39",
            },
            {
              id: 8,
              title: "Viral Dance Challenges You Have to Try",
              thumbnail: "/placeholder.svg",
              channel: "Dance Trends",
              views: "390K",
              duration: "0:28",
            },
          ].map((shorts) => (
            <Link
              key={shorts.id}
              href="#"
              className="group overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
              prefetch={false}
            >
              <div className="relative">
                <Image
                  src="/placeholder.svg"
                  width={320}
                  height={320}
                  alt={shorts.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-1 text-sm text-white">
                  {shorts.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 text-lg font-semibold group-hover:underline">
                  {shorts.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{shorts.channel}</span>
                  <span>•</span>
                  <span>{shorts.views} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="flex items-center justify-between bg-gray-900 px-6 py-6 text-white md:px-8">
        <div className="text-sm">
          &copy; 2024 Shorts Recommendations. All rights reserved.
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
      </footer>
    </div>
  );
}
