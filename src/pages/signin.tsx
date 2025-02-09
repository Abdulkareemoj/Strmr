/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { createClient } from "~/utils/supabase/component";
import { useRouter } from "next/router";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

type LoadingStates = {
  isLoadingEmail?: boolean;
  isLoadingGoogle?: boolean;
  isLoadingDiscord?: boolean;
};

export default function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [loadingStates, setLoading] = useState<LoadingStates>({
    isLoadingGoogle: false,
    isLoadingDiscord: false,
    isLoadingEmail: false,
  });
  const router = useRouter();
  const supabase = createClient();

  function setLoadingState(obj: typeof loadingStates) {
    setLoading((prev) => ({
      ...prev,
      ...obj,
    }));
  }

function isAnyLoading(): boolean {
  return (
    Boolean(loadingStates.isLoadingDiscord) ||
    Boolean(loadingStates.isLoadingGoogle) ||
    Boolean(loadingStates.isLoadingEmail)
  );
}


 async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const target = event.target as typeof event.target & {
    email: { value: string };
    password: { value: string };
  };
  const email = target.email.value;
  const password = target.password.value;

  setLoadingState({ isLoadingEmail: true });

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Login failed:", error.message);
    // Redirect to the error page with the error message
    void router.push(`/error?message=${encodeURIComponent(error.message)}`);
  } else {
    console.log("Login successful");
    void router.push("/trending");
  }

  setLoadingState({ isLoadingEmail: false });
}

async function signInWithGoogle() {
  setLoadingState({ isLoadingGoogle: true });
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) {
    console.error("Google login failed:", error.message);
    void router.push(`/error?message=${encodeURIComponent(error.message)}`);
  } else {
    void router.push("/trending");
  }
  setLoadingState({ isLoadingGoogle: false });
}

async function signInWithDiscord() {
  setLoadingState({ isLoadingDiscord: true });
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
  });
  if (error) {
    console.error("Discord login failed:", error.message);
    void router.push(`/error?message=${encodeURIComponent(error.message)}`);
  } else {
    void router.push("/trending");
  }
  setLoadingState({ isLoadingDiscord: false });
}


  return (
    <main className="flex h-screen items-center justify-center overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button
              type="submit"
              disabled={isAnyLoading()}
              className="w-full"
            >
              {loadingStates.isLoadingEmail ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>

            <div className="flex justify-center">Or</div>
            <div className="grid grid-cols-2 gap-6">
              <Button
                variant="outline"
                type="button"
                onClick={signInWithGoogle}
                disabled={isAnyLoading()}
              >
                {loadingStates.isLoadingGoogle ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={signInWithDiscord}
                disabled={isAnyLoading()}
              >
                {loadingStates.isLoadingDiscord ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.discord className="mr-2 h-4 w-4" />
                )}{" "}
                Discord
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
