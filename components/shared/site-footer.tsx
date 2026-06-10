import { Wind, X, Globe, CodeXml } from "lucide-react";
import Link from "next/link";

const footerCols = [
  {
    title: "Platform",
    links: ["Trending", "Shorts", "Music", "Upload"],
  },
  {
    title: "Resources",
    links: ["Help Center", "Community", "Blog", "Creator Guide"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Privacy", "Terms"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Wind className="size-5" />
              Strmr
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Stream videos, music, podcasts and more from creators around the
              world.
            </p>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-medium">{col.title}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-foreground">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 Strmr. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              <X className="size-4" />
            </Link>
            <Link href="#" className="hover:text-foreground">
              <Globe className="size-4" />
            </Link>
            <Link href="#" className="hover:text-foreground">
              <CodeXml className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
