import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "~/utils/supabase/component";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, next = "/dashboard" } = req.query;

  console.log("Incoming request query:", req.query);

  if (typeof code !== "string") {
    console.error("Invalid code: Code is not a string", code);
    return res.redirect(
      `/signin?error=${encodeURIComponent("Invalid code: Not a string")}`
    );
  }

  try {
    const supabase = createClient();
    console.log("Supabase client created");

    console.log("Attempting to exchange code for session:", code);

    // Exchange the authorization code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      return res.redirect(
        `/signin?error=${encodeURIComponent("Failed to confirm email or login")}`
      );
    }

    console.log("Session exchange successful:", data);

    // Redirect to the next URL or dashboard
    return res.redirect(next as string);
  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect(
      `/signin?error=${encodeURIComponent("An unexpected error occurred")}`
    );
  }
}