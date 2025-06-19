import { User } from "./main";
import type { Icon } from "lucide-react";

import { Icons } from "~/components/icons";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripe_price_id: string;
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripe_customer_id" | "stripe_subscription_id"> & {
    stripe_current_period_end: number;
    isPro: boolean;
  };

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  email_verified: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  language: string;
  theme: string;
  font: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  notification_type: "all" | "mentions" | "none";
  mobile_notifications: boolean;
  communication_emails: boolean;
  social_emails: boolean;
  marketing_emails: boolean;
  security_emails: boolean;
  sidebar_items: string[];
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  date_of_birth?: string;
  language?: string;
  theme?: string;
  font?: string;
}

export interface UpdatePreferencesData {
  notification_type?: "all" | "mentions" | "none";
  mobile_notifications?: boolean;
  communication_emails?: boolean;
  social_emails?: boolean;
  marketing_emails?: boolean;
  security_emails?: boolean;
  sidebar_items?: string[];
}
