import { Menu, Package2, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ModeToggle } from "./ModeToggle";
import LoginBtn from "./LoginBtn";
import { siteConfig } from "~/lib/config";
import { CommandMenu } from "./CommandMenu";

export default function Header() {
  return (
    <header className="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
        <Link
          href="/trending"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Trending
        </Link>
        <Link
          href="/shorts"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Shorts
        </Link>
        <Link
          href="/music"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Music
        </Link>
        {/* <Link
          href="#"
          className="text-foreground hover:text-foreground transition-colors"
        >
          Settings
        </Link> */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Strmr
            </Link>
            <Link
              href="/trending"
              className="text-muted-foreground hover:text-foreground"
            >
              Trending
            </Link>
            <Link
              href="/shorts"
              className="text-muted-foreground hover:text-foreground"
            >
              Shorts
            </Link>
            <Link
              href="/music"
              className="text-muted-foreground hover:text-foreground"
            >
              Music
            </Link>
            <Link href="settings" className="hover:text-foreground">
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <CommandMenu />
        <LoginBtn /> <ModeToggle />
      </div>
    </header>
  );
}
