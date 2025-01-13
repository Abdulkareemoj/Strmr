import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Play, Film, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Strmr - Learn Anything, Anytime",
  description:
    "Discover a world of knowledge with our curated educational videos.",
};
export default function Home() {
  return (
    <>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to VideoHub
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Discover, learn, and grow with our curated collection of
                  educational videos.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/trending">
                  <Button>
                    Browse Videos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose VideoHub?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Play className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">High-Quality Content</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Curated videos from expert instructors in various fields.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Community Learning</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Engage with a community of learners and share your insights.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Zap className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Learn at Your Pace</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Access content anytime, anywhere, and learn at your own speed.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <blockquote className="flex flex-col items-center text-center">
                <p className="mb-4 text-lg">
                  "VideoHub has transformed the way I learn. The quality of
                  content is outstanding!"
                </p>
                <footer className="text-sm font-medium">- Sarah J.</footer>
              </blockquote>
              <blockquote className="flex flex-col items-center text-center">
                <p className="mb-4 text-lg">
                  "I've gained so much knowledge through VideoHub. It's an
                  invaluable resource."
                </p>
                <footer className="text-sm font-medium">- Mike T.</footer>
              </blockquote>
              <blockquote className="flex flex-col items-center text-center">
                <p className="mb-4 text-lg">
                  "The variety of topics covered is impressive. There's always
                  something new to learn!"
                </p>
                <footer className="text-sm font-medium">- Emily R.</footer>
              </blockquote>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 VideoHub. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
}
