"use client";
import React from "react";
import { cn } from "~/lib/utils";
import { Logo } from "~/components/logo";
import { useScroll } from "~/hooks/use-scroll";
import { Button } from "~/components/ui/button";
import { Portal, PortalBackdrop } from "~/components/ui/portal";
import { X, Menu } from "lucide-react";
import Link from "next/link";
import LoginBtn from "./LoginBtn";
import { ModeToggle } from "./ModeToggle";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/trending" },
  { label: "Shorts", href: "/shorts" },
  { label: "Music", href: "/music" },
];

export default function Header() {
  const scrolled = useScroll(10);
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent",
        scrolled &&
          "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link
          className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
          href="/"
        >
          <Logo className="h-4" aria-label="Strmr" />
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Button asChild key={link.label} size="sm" variant="ghost">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <ModeToggle />
          <LoginBtn />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            size="icon"
            variant="outline"
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </Button>
          {open && (
            <Portal className="top-14" id="mobile-menu">
              <PortalBackdrop onClick={() => setOpen(false)} />
              <div
                className={cn(
                  "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
                  "size-full p-4",
                )}
                data-slot={open ? "open" : "closed"}
              >
                <div className="grid gap-y-2">
                  {navLinks.map((link) => (
                    <Button
                      asChild
                      className="justify-start"
                      key={link.label}
                      variant="ghost"
                      onClick={() => setOpen(false)}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </div>
                <div className="mt-12 flex flex-col gap-2">
                  <LoginBtn />
                </div>
              </div>
            </Portal>
          )}
        </div>
      </nav>
    </header>
  );
}
