import { redirect } from "next/navigation";

import { getUser } from "~/app/supabase-server";
import Header from "~/components/Header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen">
      <Header />
      {children}
    </div>
  );
}
