import * as React from "react";
import Link from "next/link";

import { siteConfig } from "~/lib/config";
import { Icons } from "~/components/ui/icons";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/trending">Trending</Link>
        <Link href="/shorts">Shorts</Link>
        {/* <Link href="/upload">Upload</Link> */}
        <Link href="/music">Music</Link>
      </nav>
    </div>
  );
}
