"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

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
import { Spinner } from "~/components/ui/spinner";
import {
  sendVerificationEmail,
  verifyEmail,
} from "~/lib/auth-client";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (!token) return;

    async function verify() {
      try {
        const result = await verifyEmail({ query: { token: token! } });

        if (result.error) {
          setStatus("error");
          setErrorMessage(result.error.message || "Email verification failed.");
        } else {
          setStatus("success");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred.");
      }
    }

    verify();
  }, [token]);

  async function onResend(values: EmailFormValues) {
    setIsSending(true);
    setSendSuccess(false);
    setErrorMessage("");

    try {
      const result = await sendVerificationEmail({
        email: values.email,
        callbackURL: `${window.location.origin}/verify-email`,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to send verification email.");
        return;
      }

      setSendSuccess(true);
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              {status === "verifying" && (
                <Spinner className="h-8 w-8" />
              )}
              {status === "success" && (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              )}
              {status === "error" && (
                <AlertCircle className="h-8 w-8 text-destructive" />
              )}
              {status === "idle" && (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === "verifying" && "Verifying your email..."}
              {status === "success" && "Email verified!"}
              {status === "error" && "Verification failed"}
              {status === "idle" && "Verify your email"}
            </CardTitle>
            <CardDescription>
              {status === "verifying" && "Please wait while we verify your email address..."}
              {status === "success" &&
                "Your email has been successfully verified. You can now sign in."}
              {status === "error" && errorMessage}
              {status === "idle" &&
                "Enter your email to receive a verification link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "success" && (
              <Button asChild className="w-full">
                <Link href="/signin">Sign in</Link>
              </Button>
            )}

            {status === "error" && (
              <Button asChild className="w-full">
                <Link href="/signin">Back to sign in</Link>
              </Button>
            )}

            {status === "idle" && !sendSuccess && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onResend)}
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSending}
                  >
                    {isSending && <Spinner data-icon="inline-start" />}
                    Send verification email
                  </Button>
                </form>
              </Form>
            )}

            {status === "idle" && sendSuccess && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Email sent</AlertTitle>
                <AlertDescription>
                  Check your inbox for the verification link.
                </AlertDescription>
              </Alert>
            )}

            {(status === "idle" || status === "error") && (
              <Link
                href="/signin"
                className="text-muted-foreground inline-flex w-full items-center justify-center gap-2 text-sm underline underline-offset-4 hover:text-primary"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to sign in
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
