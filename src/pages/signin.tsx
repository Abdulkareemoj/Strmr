

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "~/utils/supabase/component"
import { AlertCircle } from "lucide-react"
import type { GetServerSideProps } from "next"
import { requireNoAuth } from "~/lib/auth"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Icons } from "~/components/ui/icons"
import { SignInFormValues, signInSchema } from "~/lib/schemas"



type LoadingStates = {
  isLoadingEmail?: boolean
  isLoadingGoogle?: boolean
  isLoadingDiscord?: boolean
}

export default function SignIn() {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    isLoadingEmail: false,
    isLoadingGoogle: false,
    isLoadingDiscord: false,
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Get the next URL from query params
  const next = (router.query.next as string) || "/dashboard"

  // Get error from query params
  const queryError = router.query.error as string | undefined

  // Initialize React Hook Form
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function setLoadingState(obj: Partial<LoadingStates>) {
    setLoadingStates((prev) => ({
      ...prev,
      ...obj,
    }))
  }

  function isAnyLoading(): boolean {
    return (
      Boolean(loadingStates.isLoadingDiscord) ||
      Boolean(loadingStates.isLoadingGoogle) ||
      Boolean(loadingStates.isLoadingEmail)
    )
  }

  async function onSubmit(values: SignInFormValues) {
    setLoadingState({ isLoadingEmail: true })
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data.session) {
        throw new Error("Failed to sign in")
      }

      // Redirect to the next URL or dashboard
      router.push(next)
    } catch (err) {
      console.error("Sign in failed:", err)
      if (err instanceof Error) {
        // Format error message to be more user-friendly
        let message = err.message
        if (message.includes("Invalid login")) {
          message = "Invalid email or password"
        }
        setError(message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoadingState({ isLoadingEmail: false })
    }
  }

  async function signInWithGoogle() {
    setLoadingState({ isLoadingGoogle: true })
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) {
        throw error
      }

      // The redirect will happen automatically by Supabase
    } catch (err) {
      console.error("Google login failed:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to sign in with Google")
      }
      setLoadingState({ isLoadingGoogle: false })
    }
  }

  async function signInWithDiscord() {
    setLoadingState({ isLoadingDiscord: true })
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })

      if (error) {
        throw error
      }

      // The redirect will happen automatically by Supabase
    } catch (err) {
      console.error("Discord login failed:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to sign in with Discord")
      }
      setLoadingState({ isLoadingDiscord: false })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {(error || queryError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || queryError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
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
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isAnyLoading()}>
                {loadingStates.isLoadingEmail ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={signInWithGoogle}
              disabled={isAnyLoading()}
              className="w-full"
            >
              {loadingStates.isLoadingGoogle ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={signInWithDiscord}
              disabled={isAnyLoading()}
              className="w-full"
            >
              {loadingStates.isLoadingDiscord ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.discord className="mr-2 h-4 w-4" />
              )}
              Discord
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireNoAuth(context)
}

