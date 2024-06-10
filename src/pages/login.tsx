/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { cn } from "~/lib/utils";
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
import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
//chnaged to interface from type

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
      loadingStates.isLoadingDiscord ||
      loadingStates.isLoadingGoogle ||
      loadingStates.isLoadingEmail ||
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

    const response = await fetch("/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // The login was successful
      console.log("Login successful");
    } else {
      // The login failed
      console.log("Login failed");
    }
  }

  return (
    <Card className="mx-auto mt-20 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
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
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="grid grid-cols-2 gap-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setLoadingState({ isLoadingDiscord: true });
                window.location.href = "/api/auth/signin/discord";
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
                window.location.href = "/api/auth/signin/google";
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
          ;
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
