import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { expo } from "@better-auth/expo";
import { emailOTP, oneTap, username } from "better-auth/plugins";
import { db, schema } from "~/server/db";
import { Resend } from "resend";
import { EmailVerificationEmail } from "~/components/emails/email-verification-email";
import { ResetPasswordEmail } from "~/components/emails/reset-password-email";
import { PasswordConfirmEmail } from "~/components/emails/password-confirm-email";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  appName: "strmr",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    admin(),
    username({
      minUsernameLength: 5,
      maxUsernameLength: 25,
      usernameValidator: (username) => /^[a-z0-9_-]+$/.test(username),
      usernameNormalization: (username) => {
        return username
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9_-]/g, "");
      },
    }),
    oneTap(),
    expo(),
  ],
  trustedOrigins: [
    "http://localhost:8081",
    "strmr-mb://",
    ...(process.env.NODE_ENV !== "production"
      ? [
          "exp://*/*",
          "exp://10.0.0.*:*/*",
          "exp://192.168.*.*:*/*",
          "exp://172.*.*.*:*/*",
          "exp://localhost:*/*",
        ]
      : []),
  ],
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: user.email,
        subject: "Verify your email address",
        react: EmailVerificationEmail({
          username: user.email,
        }),
      });
      console.log(res, user.email);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
      console.log(res, `Password reset link sent to ${user.email}.`);
    },

    async onPasswordReset({ user }, request) {
      const res = await resend.emails.send({
        from,
        to: user.email,
        subject: "Password Reset Confirmation",
        react: PasswordConfirmEmail({
          username: user.email,
        }),
      });
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google", "discord", "demo-app"],
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: [
        process.env.GOOGLE_CLIENT_ID as string,
        process.env.GOOGLE_WEB_CLIENT_ID as string,
        process.env.GOOGLE_IOS_CLIENT_ID as string,
        process.env.GOOGLE_ANDROID_CLIENT_ID as string,
      ],
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
});
