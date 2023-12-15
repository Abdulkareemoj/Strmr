// ./auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Add your custom sign in logic here
      if (user.email.endsWith("@example.com")) {
        return true;
      } else {
        return false; // This will prevent the sign in
      }
    },
    async signOut({ user, session, url }) {
      // Add your custom sign out logic here
      console.log("User signed out:", user);
    },
    async error({ error, token, user, account, profile, ctx }) {
      // Add your custom error handling logic here
      console.error("Authentication error:", error);
    },
  },
});
