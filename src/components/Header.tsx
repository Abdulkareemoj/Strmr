// import {
//   HamburgerMenuIcon,
//   BoxIcon,
//   MagnifyingGlassIcon,
// } from "@radix-ui/react-icons";
// import Link from "next/link";

// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
// import { ModeToggle } from "./ModeToggle";
// import LoginBtn from "./LoginBtn";
// import { siteConfig } from "~/lib/config";
// import { CommandMenu } from "./CommandMenu";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/70 px-4 backdrop-blur md:px-6">
//       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//         <Link
//           href="/"
//           className="flex items-center gap-2 text-lg font-semibold md:text-base"
//         >
//           <BoxIcon className="h-6 w-6" />
//           <span className="hidden font-bold sm:inline-block">
//             {siteConfig.name}
//           </span>
//         </Link>
//         <Link
//           href="/"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           Home
//         </Link>
//         <Link
//           href="/trending"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           Trending
//         </Link>
//         <Link
//           href="/shorts"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           Shorts
//         </Link>
//         <Link
//           href="/music"
//           className="text-muted-foreground transition-colors hover:text-foreground"
//         >
//           Music
//         </Link>
//       </nav>
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//             <HamburgerMenuIcon className="h-5 w-5" />
//             <span className="sr-only">Toggle navigation menu</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left">
//           <nav className="grid gap-6 text-lg font-medium">
//             <Link
//               href="/"
//               className="flex items-center gap-2 text-lg font-semibold"
//             >
//               <BoxIcon className="h-6 w-6" />
//               <span className="hidden font-bold sm:inline-block">
//                 {siteConfig.name}
//               </span>
//             </Link>
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Strmr
//             </Link>
//             <Link
//               href="/trending"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Trending
//             </Link>
//             <Link
//               href="/shorts"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Shorts
//             </Link>
//             <Link
//               href="/music"
//               className="text-muted-foreground hover:text-foreground"
//             >
//               Music
//             </Link>
//             <Link href="settings" className="hover:text-foreground">
//               Settings
//             </Link>
//           </nav>
//         </SheetContent>
//       </Sheet>
//       <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
//         <form className="ml-auto flex-1 sm:flex-initial">
//           <div className="relative">
//             <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search products..."
//               className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
//             />
//           </div>
//         </form>
//         <CommandMenu />
//         <LoginBtn /> <ModeToggle />
//       </div>
//     </header>
//   );
// }

// import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "~/components/ui/accordion";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import LoginBtn from "./LoginBtn";
import { siteConfig } from "~/lib/config";
import { CommandMenu } from "./CommandMenu";
import { cn } from "~/lib/utils";
import Link from "next/link";

// const subMenuItemsOne = [
//   {
//     title: "Blog",
//     description: "The latest industry news, updates, and info",
//     icon: <Book className="size-5 shrink-0" />,
//   },
//   {
//     title: "Compnay",
//     description: "Our mission is to innovate and empower the world",
//     icon: <Trees className="size-5 shrink-0" />,
//   },
//   {
//     title: "Careers",
//     description: "Browse job listing and discover our workspace",
//     icon: <Sunset className="size-5 shrink-0" />,
//   },
//   {
//     title: "Support",
//     description:
//       "Get in touch with our support team or visit our community forums",
//     icon: <Zap className="size-5 shrink-0" />,
//   },
// ];

// const subMenuItemsTwo = [
//   {
//     title: "Help Center",
//     description: "Get all the answers you need right here",
//     icon: <Zap className="size-5 shrink-0" />,
//   },
//   {
//     title: "Contact Us",
//     description: "We are here to help you with any questions you have",
//     icon: <Sunset className="size-5 shrink-0" />,
//   },
//   {
//     title: "Status",
//     description: "Check the current status of our services and APIs",
//     icon: <Trees className="size-5 shrink-0" />,
//   },
//   {
//     title: "Terms of Service",
//     description: "Our terms and conditions for using our services",
//     icon: <Book className="size-5 shrink-0" />,
//   },
// ];

export default function Header() {
  return (
    <section className="py-32">
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold">Shadcn Blocks</span>
            </div>
            <div className="flex items-center">
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  }),
                )}
                href="/"
              >
                Home
              </Link>
              {/* <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>
                      <span>Products</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-80 p-3">
                        <NavigationMenuLink>
                          {subMenuItemsOne.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                className={cn(
                                  "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                                href="#"
                              >
                                {item.icon}
                                <div>
                                  <div className="text-sm font-semibold">
                                    {item.title}
                                  </div>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </NavigationMenuLink>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="text-muted-foreground">
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-80 p-3">
                        <NavigationMenuLink>
                          {subMenuItemsTwo.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                className={cn(
                                  "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                )}
                                href="#"
                              >
                                {item.icon}
                                <div>
                                  <div className="text-sm font-semibold">
                                    {item.title}
                                  </div>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </NavigationMenuLink>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> */}

              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  }),
                )}
                href="/trending"
              >
                Trending
              </Link>
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  }),
                )}
                href="/shorts"
              >
                Shorts
              </Link>
              <Link
                className={cn(
                  "text-muted-foreground",
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: "ghost",
                  }),
                )}
                href="/music"
              >
                Music
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <CommandMenu />
            <LoginBtn /> <ModeToggle />
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="https://www.shadcnblocks.com/images/block/block-1.svg"
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold">Shadcn Blocks</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                  <HamburgerMenuIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <img
                        src="https://www.shadcnblocks.com/images/block/block-1.svg"
                        className="w-8"
                        alt="logo"
                      />
                      <span className="text-xl font-bold">Shadcn Blocks</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-8 flex flex-col gap-4">
                  <Link href="/" className="font-semibold">
                    Home
                  </Link>
                  {/* <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="products" className="border-b-0">
                      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                        Products
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {subMenuItemsOne.map((item, idx) => (
                          <Link
                            key={idx}
                            className={cn(
                              "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            )}
                            href="#"
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-semibold">
                                {item.title}
                              </div>
                              <p className="text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="resources" className="border-b-0">
                      <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                        Resources
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {subMenuItemsTwo.map((item, idx) => (
                          <Link
                            key={idx}
                            className={cn(
                              "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            )}
                            href="#"
                          >
                            {item.icon}
                            <div>
                              <div className="text-sm font-semibold">
                                {item.title}
                              </div>
                              <p className="text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion> */}
                  <Link href="/trending" className="font-semibold">
                    Trending
                  </Link>
                  <Link href="/shorts" className="font-semibold">
                    Shorts
                  </Link>
                  <Link href="/music" className="font-semibold">
                    Music
                  </Link>
                </div>
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 justify-start">
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Press
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Contact
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Imprint
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Sitemap
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Legal
                    </Link>
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                        }),
                        "justify-start text-muted-foreground",
                      )}
                      href="#"
                    >
                      Cookie Settings
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-col gap-3">
                    <CommandMenu />
                    <LoginBtn /> <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
