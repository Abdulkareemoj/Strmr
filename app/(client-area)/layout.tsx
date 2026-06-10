"use client";
import { usePathname } from "next/navigation";
import Header from "~/components/shared/header";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  const pathname = usePathname();
  const isMusicPage = pathname.startsWith("/music");
  // const user = await getUser();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
