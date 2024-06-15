import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function ForgotPassword() {
  return (
    <main className="flex h-screen items-center justify-center overflow-hidden">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Enter your email below to reset your password.
          </CardDescription>
        </CardHeader>{" "}
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Return to{" "}
              <Link href="/" className="underline" prefetch={false}>
                Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
