import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home Page",
};

export default function Home() {
  return (
    <>
      {/* import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex items-center h-16">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <YoutubeIcon className="w-6 h-6 text-red-500" />
            <span className="font-bold text-lg">YouTube</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative w-full max-w-md">
              <Input
                type="search"
                placeholder="Search"
                className="w-full bg-gray-100 dark:bg-gray-800 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UploadIcon className="w-6 h-6" />
              <span className="sr-only">Upload</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <AppWindowIcon className="w-6 h-6" />
              <span className="sr-only">Apps</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img src="/placeholder.svg" width={32} height={32} alt="User Avatar" className="rounded-full" />
              <span className="sr-only">User Menu</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <nav className="bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 hidden md:block">
          <div className="px-4 py-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Categories</h3>
            <div className="grid gap-2">
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                prefetch={false}
              >
                <HomeIcon className="w-5 h-5" />
                Home
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                prefetch={false}
              >
                <TrendingUpIcon className="w-5 h-5" />
                Trending
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                prefetch={false}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                Subscriptions
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                prefetch={false}
              >
                <LibraryIcon className="w-5 h-5" />
                Library
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                prefetch={false}
              >
                <CalendarIcon className="w-5 h-5" />
                History
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Recommended Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, index) => (
              <Link
                key={index}
                href="#"
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                prefetch={false}
              >
                <img
                  src="/placeholder.svg"
                  width={320}
                  height={180}
                  alt="Video Thumbnail"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                    Video Title {index + 1}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      Channel Name {index + 1}
                    </div>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      {Math.floor(Math.random() * 1000000)} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

function AppWindowIcon(props) {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M10 4v4" />
      <path d="M2 8h20" />
      <path d="M6 4v4" />
    </svg>
  )
}


function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function EyeIcon(props) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function LibraryIcon(props) {
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
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  )
}


function SearchIcon(props) {
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
  )
}


function ShoppingCartIcon(props) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


function TrendingUpIcon(props) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}


function UploadIcon(props) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}


function UserIcon(props) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}


function YoutubeIcon(props) {
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
  )
} */}
      <main className="flex min-h-screen flex-col items-center justify-center">
        <section className="body-font text-gray-600">
          <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
            <div className="mb-10 border-b border-gray-200 pb-10 md:mb-0 md:w-1/2 md:border-b-0 md:border-r md:py-8 md:pr-12">
              <h1 className="title-font mb-2 text-2xl font-medium text-gray-900 sm:text-3xl">
                Pitchfork Kickstarter Taxidermy
              </h1>
              <p className="text-base leading-relaxed">
                Locavore cardigan small batch roof party blue bottle blog
                meggings sartorial jean shorts kickstarter migas sriracha
                church-key synth succulents. Actually taiyaki neutra, distillery
                gastropub pok pok ugh.
              </p>
              <a className="mt-4 inline-flex items-center text-indigo-500">
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <div className="flex flex-col md:w-1/2 md:pl-12">
              <h2 className="title-font mb-3 text-sm font-semibold tracking-wider text-gray-800">
                CATEGORIES
              </h2>
              <nav className="-mb-1 flex list-none flex-wrap">
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Fifth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Sixth Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Seventh Link
                  </a>
                </li>
                <li className="mb-1 w-1/2 lg:w-1/3">
                  <a className="text-gray-600 hover:text-gray-800">
                    Eighth Link
                  </a>
                </li>
              </nav>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
