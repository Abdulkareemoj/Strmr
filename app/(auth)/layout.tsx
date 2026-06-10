import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "~/server/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/trending");
  }

  return <div className="min-h-screen">{children}</div>;
}
