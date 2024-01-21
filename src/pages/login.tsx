/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { cn } from "~/lib/utils";
import { Icons } from "~/components/ui/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";

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

    const response = await fetch("/api/auth/callback/credentials", {
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
    <main className=" ">
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name~example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
              <Label className="sr-only" htmlFor="email">
                Password
              </Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
              />
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() => setLoadingState({ isLoadingEmail: true })}
              disabled={isAnyLoading()}
            >
              {loadingStates.isLoadingEmail ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => setLoadingState({ isLoadingDiscord: true })}
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
            onClick={() => setLoadingState({ isLoadingGoogle: true })}
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
    </main>
  );
}
