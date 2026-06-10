"use client";
import React from "react";
import { cn } from "~/lib/utils";
import { Logo } from "~/components/logo";
import { useScroll } from "~/hooks/use-scroll";
import { Button } from "~/components/ui/button";
import { Portal, PortalBackdrop } from "~/components/ui/portal";
import { Search, X, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginBtn from "./LoginBtn";
import { ModeToggle } from "./ModeToggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trending", href: "/trending" },
  { label: "Shorts", href: "/shorts" },
  { label: "Music", href: "/music" },
];

export default function Header() {
  const scrolled = useScroll(10);
  const [open, setOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button asChild key={link.label} size="sm" variant="ghost">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <ModeToggle />
          <LoginBtn />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCommandOpen(true)}
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>
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

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Search"
      >
        <CommandInput
          placeholder="Search content or navigate to..."
          onValueChange={(value) => {
            if (value.startsWith("/")) {
              const path = value.slice(1);
              setCommandOpen(false);
              router.push(`/search?q=${path}`);
            }
          }}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Links">
            {navLinks.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  setCommandOpen(false);
                  router.push(link.href);
                }}
              >
                <Search className="mr-2 size-4" />
                <span>{link.label}</span>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                router.push("/upload");
              }}
            >
              <span>Upload</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                router.push("/settings");
              }}
            >
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
