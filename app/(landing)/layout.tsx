"use client";
import { SiteFooter } from "~/components/site-footer";

import { getUser } from "../supabase-server";
import Header from "~/components/Header";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default async function LandingLayout({ children }: LandingLayoutProps) {
  // const user = await getUser();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 sm:pt-20">{children}</main>
      <SiteFooter />
    </div>
  );
}
