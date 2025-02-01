import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Play, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Play,
    title: "High-Quality Content",
    description: "Curated videos from expert instructors in various fields.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Engage with a community of learners and share your insights.",
  },
  {
    icon: Zap,
    title: "Learn at Your Pace",
    description:
      "Access content anytime, anywhere, and learn at your own speed.",
  },
];
const testimonials = [
  {
    quote:
      "Strmr has transformed the way I learn. The quality of content is outstanding!",
    author: "Sarah J.",
  },
  {
    quote:
      "I've gained so much knowledge through Strmr. It's an invaluable resource.",
    author: "Mike T.",
  },
  {
    quote:
      "The variety of topics covered is impressive. There's always something new to learn!",
    author: "Emily R.",
  },
];
export const metadata: Metadata = {
  title: "Strmr - Learn Anything, Anytime",
  description:
    "Discover a world of knowledge with our curated educational videos.",
};
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Strmr
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Your gateway to endless learning possibilities. Stream
                  expert-led courses and expand your knowledge.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-x-4"
              >
                <Link href="/trending">
                  <Button>Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Why Choose Strmr?
            </motion.h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <feature.icon className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <p className="mb-4 text-lg">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="text-sm font-medium">
                    - {testimonial.author}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Strmr. All rights reserved.
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
    </main>
  );
}
