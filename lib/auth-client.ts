import {
  adminClient,
  oneTapClient,
  usernameClient,
} from "better-auth/client/plugins";

import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient(),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    usernameClient(),
  ],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  getSession,
  resetPassword,
  isUsernameAvailable,
  sendVerificationEmail,
  requestPasswordReset,
} = authClient;
