import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type UserRole } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      role: UserRole;
    };
  }

  interface User {
    // ...other properties
    role: UserRole;
  }
}

interface token {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    //     async session({ token, session }) {
    //       if (token) {
    //         session.user.id = token.id;
    //         session.user.name = token.name;
    //         session.user.email = token.email;
    //         session.user.image = token.image;
    //         session.user.role = token.role;
    //       }
    //       return session;
    //     },
    //    async jwt(token, user) {
    //   const dbUser = await db.user.findFirst({
    //     where: {
    //       email: token.email,
    //     },
    //   });
    //   if (!dbUser) {
    //     if (user) {
    //       token.id = user.id;
    //     }
    //     return token;
    //   }
    //   return {
    //     id: dbUser.id,
    //     name: dbUser.name,
    //     email: dbUser.email,
    //     picture: dbUser.image,
    //     role: dbUser.role,
    //   };
    // },
    async jwt(token, user) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session(session, token) {
      session.user.role = token.role;
      return session;
    },
  },

  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/login", // a custom sign-in page
    // signOut: "/auth/signout", // a custom sign-out page
    error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: null // If set, new users will be directed here on first sign in
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
