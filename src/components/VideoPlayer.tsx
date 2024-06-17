import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";

export default function VideoPlayer() {
  return (
    <>
      <main>
        <MediaPlayer title="help" src="/An Overview of Agile Development.mp4  ">
          <MediaProvider />
          <PlyrLayout
            thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
            icons={plyrLayoutIcons}
          />
        </MediaPlayer>
      </main>
    </>
  );
}

{
  /* <video
        src={`/api/videos/?videoID=${id}`}
        width="auto"
        height="auto"
        controls
        id="video-player"
      /> */
  // }
  // import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
  // import Link from "next/link"
  // export default function Component() {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 max-w-6xl mx-auto py-8">
  //       <div className="grid gap-6">
  //         <div className="rounded-lg overflow-hidden">
  //           <video
  //             className="w-full aspect-video"
  //             src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  //             controls
  //           />
  //         </div>
  //         <div className="grid gap-4">
  //           <h1 className="text-2xl font-bold">Big Buck Bunny</h1>
  //           <div className="flex items-center gap-4">
  //             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
  //               <EyeIcon className="w-4 h-4" />
  //               <span>2.3M views</span>
  //             </div>
  //             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
  //               <ThumbsUpIcon className="w-4 h-4" />
  //               <span>120K likes</span>
  //             </div>
  //             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
  //               <ThumbsDownIcon className="w-4 h-4" />
  //               <span>2.3K dislikes</span>
  //             </div>
  //           </div>
  //           <div className="prose prose-stone dark:prose-invert">
  //             <p>
  //               Big Buck Bunny tells the story of a giant rabbit with a heart of gold. When one sunny day three rodents
  //               rudely harass him, he decides to teach them a lesson.
  //             </p>
  //           </div>
  //         </div>
  //         <div className="grid gap-6">
  //           <h2 className="text-xl font-bold">Comments</h2>
  //           <div className="grid gap-4">
  //             <div className="flex items-start gap-4">
  //               <Avatar className="w-10 h-10 border">
  //                 <AvatarImage src="/placeholder-user.jpg" />
  //                 <AvatarFallback>AC</AvatarFallback>
  //               </Avatar>
  //               <div className="grid gap-1.5">
  //                 <div className="flex items-center gap-2">
  //                   <div className="font-semibold">@iamwillpursell</div>
  //                   <div className="text-gray-500 text-xs dark:text-gray-400">5 months ago</div>
  //                 </div>
  //                 <div>
  //                   This is such a classic! I remember watching it for the first time and being completely captivated.
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="flex items-start gap-4">
  //               <Avatar className="w-10 h-10 border">
  //                 <AvatarImage src="/placeholder-user.jpg" />
  //                 <AvatarFallback>AC</AvatarFallback>
  //               </Avatar>
  //               <div className="grid gap-1.5">
  //                 <div className="flex items-center gap-2">
  //                   <div className="font-semibold">@HackSoft</div>
  //                   <div className="text-gray-500 text-xs dark:text-gray-400">2 months ago</div>
  //                 </div>
  //                 <div>The animation is just stunning. I could watch this over and over again.</div>
  //               </div>
  //             </div>
  //             <div className="flex items-start gap-4">
  //               <Avatar className="w-10 h-10 border">
  //                 <AvatarImage src="/placeholder-user.jpg" />
  //                 <AvatarFallback>AC</AvatarFallback>
  //               </Avatar>
  //               <div className="grid gap-1.5">
  //                 <div className="flex items-center gap-2">
  //                   <div className="font-semibold">@greed7513</div>
  //                   <div className="text-gray-500 text-xs dark:text-gray-400">6 days ago</div>
  //                 </div>
  //                 <div>The story is so heartwarming and the characters are so lovable. This is a true classic.</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="grid gap-6">
  //         <h2 className="text-xl font-bold">Related Videos</h2>
  //         <div className="grid gap-4">
  //           <div className="flex items-start gap-4 relative">
  //             <Link href="#" className="absolute inset-0" prefetch={false}>
  //               <span className="sr-only">View</span>
  //             </Link>
  //             <img
  //               src="/placeholder.svg"
  //               alt="Thumbnail"
  //               width={168}
  //               height={94}
  //               className="aspect-video rounded-lg object-cover"
  //             />
  //             <div className="text-sm">
  //               <div className="font-medium line-clamp-2">Sintel - Blender Open Movie</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">Blender Foundation</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
  //                 5.2M views &middot; 8 years ago
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-4 relative">
  //             <Link href="#" className="absolute inset-0" prefetch={false}>
  //               <span className="sr-only">View</span>
  //             </Link>
  //             <img
  //               src="/placeholder.svg"
  //               alt="Thumbnail"
  //               width={168}
  //               height={94}
  //               className="aspect-video rounded-lg object-cover"
  //             />
  //             <div className="text-sm">
  //               <div className="font-medium line-clamp-2">Tears of Steel - Blender Open Movie</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">Blender Foundation</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
  //                 3.1M views &middot; 6 years ago
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-4 relative">
  //             <Link href="#" className="absolute inset-0" prefetch={false}>
  //               <span className="sr-only">View</span>
  //             </Link>
  //             <img
  //               src="/placeholder.svg"
  //               alt="Thumbnail"
  //               width={168}
  //               height={94}
  //               className="aspect-video rounded-lg object-cover"
  //             />
  //             <div className="text-sm">
  //               <div className="font-medium line-clamp-2">Cosmos Laundromat - Blender Open Movie</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">Blender Foundation</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
  //                 1.8M views &middot; 4 years ago
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-4 relative">
  //             <Link href="#" className="absolute inset-0" prefetch={false}>
  //               <span className="sr-only">View</span>
  //             </Link>
  //             <img
  //               src="/placeholder.svg"
  //               alt="Thumbnail"
  //               width={168}
  //               height={94}
  //               className="aspect-video rounded-lg object-cover"
  //             />
  //             <div className="text-sm">
  //               <div className="font-medium line-clamp-2">Agent 327: Operation Barbershop</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">Blender Foundation</div>
  //               <div className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
  //                 1.2M views &middot; 2 years ago
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  // function EyeIcon(props) {
  //   return (
  //     <svg
  //       {...props}
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
  //       <circle cx="12" cy="12" r="3" />
  //     </svg>
  //   )
  // }
  // function ThumbsDownIcon(props) {
  //   return (
  //     <svg
  //       {...props}
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M17 14V2" />
  //       <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  //     </svg>
  //   )
  // }
  // function ThumbsUpIcon(props) {
  //   return (
  //     <svg
  //       {...props}
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M7 10v12" />
  //       <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  //     </svg>
  //   )
}
