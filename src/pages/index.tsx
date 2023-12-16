import Image from "next/image";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user, session, loading } = auth.useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        Not signed in. <br />
        <button onClick={() => auth.signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      Signed in as {user.email} <br />
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}
