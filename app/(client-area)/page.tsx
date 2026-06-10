import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strmr — Stream Videos, Music & More",
  description:
    "Discover, watch, and share videos, music, podcasts and more from creators around the world.",
};

import { Hero } from "../../components/hero";
import { FeaturedSection } from "../../components/featured-section";
import { BrowseSection } from "../../components/browse-section";
import { SiteFooter } from "../../components/shared/site-footer";

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <FeaturedSection />
      <BrowseSection />
      <SiteFooter />
    </div>
  );
}
