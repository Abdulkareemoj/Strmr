import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Icons } from "../components/ui/icons";

export default function Shorts() {
  return (
    <div className="flex min-h-screen flex-col">
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
    </div>
  );
}
