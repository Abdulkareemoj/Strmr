"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Separator } from "~/components/ui/separator";
import { Icons } from "~/components/ui/icons";
import { Spinner } from "~/components/ui/spinner";
import { signIn } from "~/lib/auth-client";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
        return;
      }

      router.push("/trending");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/trending",
      });
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setIsGoogleLoading(false);
    }
  }
  async function handleDiscordSignIn() {
    setIsDiscordLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "discord",
        callbackURL: "/trending",
      });
    } catch (err) {
      setError("Discord sign-in failed. Please try again.");
      setIsDiscordLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-medium underline underline-offset-4"
              >
                Sign up
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign-in Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-muted-foreground text-sm underline underline-offset-4 hover:text-primary"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spinner data-icon="inline-start" />}
                  Login
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading || isGoogleLoading}
                onClick={handleGoogleSignIn}
              >
                {isGoogleLoading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Icons.google data-icon="inline-start" />
                )}
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isLoading || isDiscordLoading}
                onClick={handleDiscordSignIn}
              >
                {isDiscordLoading ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Icons.discord data-icon="inline-start" />
                )}
                Continue with Discord
              </Button>
            </div>

            <p className="text-muted-foreground px-6 text-center text-xs">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="text-primary underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
