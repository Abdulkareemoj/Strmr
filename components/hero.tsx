"use client";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
        Discover your next{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          favorite content
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Stream videos, music, podcasts and more from creators around the world.
        Find what moves you.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/trending">
            <Play data-icon="inline-start" />
            Explore Now
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/upload">
            <ArrowRight data-icon="inline-start" />
            Start Creating
          </Link>
        </Button>
      </div>
    </section>
  );
}
