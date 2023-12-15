// auth/lucia.ts
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

// expect error (see next section)
export const auth = lucia({
  env: "DEV", // "PROD" if deployed to HTTPS
  middleware: nextjs_future(), // NOT nextjs()
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
});

export type Auth = typeof auth;
