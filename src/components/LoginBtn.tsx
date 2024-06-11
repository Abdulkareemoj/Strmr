import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "~/utils/supabase/component";
import { AvatarIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function LoginBtn() {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Failed to fetch session:", error);
        // Handle the error appropriately
      }
    };

    void fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        return setSession(session);
      },
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    void router.push("/"); // Navigate to the home page after sign out
  };

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <AvatarIcon className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/support")}>
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      Not signed in <br />
      <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
    </>
  );
}
