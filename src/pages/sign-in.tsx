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
    // After 5 seconds, set all loading states back to false
    setTimeout(() => {
      setLoading({
        isLoadingGoogle: false,
        isLoadingDiscord: false,
        isLoadingEmail: false,
      });
    }, 5000);
  }

  function isAnyLoading(): boolean {
    return (
      loadingStates.isLoadingDiscord ??
      loadingStates.isLoadingGoogle ??
      loadingStates.isLoadingEmail ??
      false
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Login successful");
      void router.push("/trending");
    } else {
      console.log("Login failed");
    }
  }

  // Social login functions
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    void router.push("/trending");
    if (error) console.error("Google login failed", error.message);
  }

  async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
    void router.push("/trending");
    if (error) console.error("Discord login failed", error.message);
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
          <div className="grid gap-4">
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
            <Button type="submit" onClick={() => onSubmit} className="w-full">
              Login
            </Button>

            <div className="flex justify-center">Or</div>
            <div className="grid grid-cols-2 gap-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setLoadingState({ isLoadingDiscord: true });
                  signInWithDiscord;
                }}
                disabled={isAnyLoading()}
              >
                {loadingStates.isLoadingDiscord ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.discord className="mr-2 h-4 w-4" />
                )}{" "}
                Discord
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setLoadingState({ isLoadingGoogle: true });
                  signInWithGoogle;
                }}
                disabled={isAnyLoading()}
              >
                {loadingStates.isLoadingGoogle ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
