import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "~/utils/supabase/component"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { GetServerSideProps } from "next"
import { requireNoAuth } from "~/lib/auth"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { Icons } from "~/components/ui/icons"
import { SignUpFormValues, signUpSchema } from "~/lib/schemas"

type LoadingStates = {
  isLoadingEmail?: boolean
  isLoadingGoogle?: boolean
  isLoadingDiscord?: boolean
}

export default function SignUp() {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    isLoadingEmail: false,
    isLoadingGoogle: false,
    isLoadingDiscord: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Initialize React Hook Form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
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

  async function onSubmit(values: SignUpFormValues) {
    setLoadingState({ isLoadingEmail: true })
    setError(null)
    setSuccess(null)

    try {
      console.log("Submitting sign up form with values:", values)

      // Sign up the user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // Store name as user metadata
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            name: `${values.firstName} ${values.lastName}`,
          },
          // You can enable email confirmation by setting this to true
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (signUpError) {
        console.error("Sign up error details:", signUpError)
        throw signUpError
      }

      console.log("Sign up response data:", data)

      // Check if email confirmation is required
      if (data.session) {
        // User is signed in immediately (email confirmation not required)
        setSuccess("Account created successfully!")
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else if (data.user) {
        // Email confirmation is required
        setSuccess("Please check your email to confirm your account")
      } else {
        throw new Error("Failed to create account")
      }
    } catch (err) {
      console.error("Sign up failed:", err)
      if (err instanceof Error) {
        // Format error message to be more user-friendly
        let message = err.message
        if (message.includes("duplicate key") || message.includes("already registered")) {
          message = "An account with this email already exists"
        } else if (message.includes("password")) {
          message = "Password is too weak. Please use a stronger password"
        }
        setError(message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoadingState({ isLoadingEmail: false })
    }
  }

  // async function signUpWithGoogle() {
  //   setLoadingState({ isLoadingGoogle: true })
  //   setError(null)

  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/api/auth/callback`,
  //       },
  //     })

  //     if (error) {
  //       throw error
  //     }

  //     // The redirect will happen automatically by Supabase
  //   } catch (err) {
  //     console.error("Google signup failed:", err)
  //     if (err instanceof Error) {
  //       setError(err.message)
  //     } else {
  //       setError("Failed to sign up with Google")
  //     }
  //     setLoadingState({ isLoadingGoogle: false })
  //   }
  // }

  // async function signUpWithDiscord() {
  //   setLoadingState({ isLoadingDiscord: true })
  //   setError(null)

  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "discord",
  //       options: {
  //         redirectTo: `${window.location.origin}/api/auth/callback`,
  //       },
  //     })

  //     if (error) {
  //       throw error
  //     }

  //     // The redirect will happen automatically by Supabase
  //   } catch (err) {
  //     console.error("Discord signup failed:", err)
  //     if (err instanceof Error) {
  //       setError(err.message)
  //     } else {
  //       setError("Failed to sign up with Discord")
  //     }
  //     setLoadingState({ isLoadingDiscord: false })
  //   }
  // }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 text-green-500">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters with uppercase, lowercase, and numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isAnyLoading()}>
                {loadingStates.isLoadingEmail ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </Form>

          {/* <div className="relative my-6">
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
              onClick={signUpWithGoogle}
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
              onClick={signUpWithDiscord}
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
          </div> */}

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
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