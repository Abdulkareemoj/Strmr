export const siteConfig = {
  name: "strmr",
  url: "https://www.example.com",
  ogImage: "https://www.example.com/image.jpg",
  description: "A video streaming site.",
  links: {
    twitter: "https://twitter.com/abdulkareemoj",
    github: "https://github.com/abdulkareemoj/strmr",
  },
};

export type SiteConfig = typeof siteConfig;

import { type Icons } from "~/components/ui/icons";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export type MainNavItem = NavItem;

export type SidebarNavItem = NavItemWithChildren;

// import { type MainNavItem, type SidebarNavItem } from "types/nav"

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Search",
      href: "/search",
    },
    {
      title: "Videos",
      href: "videoslist",
    },
    {
      title: "Shorts",
      href: "/shorts",
    },
    {
      title: "Music",
      href: "/music",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Upload",
          href: "/upload",
          items: [],
        },
      ],
    },
  ],
};
export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
