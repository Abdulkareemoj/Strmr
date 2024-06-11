import { CommandMenu } from "~/components/CommandMenu";
import { MainNav } from "~/components/MainNav";
import { MobileNav } from "~/components/MobileNav";
import { ModeToggle } from "~/components/ModeToggle";
import LoginBtn from "./LoginBtn";

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center space-x-6">
            <LoginBtn />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
