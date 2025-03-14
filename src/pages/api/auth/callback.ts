import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "~/utils/supabase/component"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, next = "/dashboard" } = req.query

  if (typeof code !== "string") {
    return res.redirect(`/signin?error=${encodeURIComponent("Invalid code")}`)
  }

  try {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Error exchanging code for session:", error)
      return res.redirect(`/signin?error=${encodeURIComponent("Failed to confirm email or login")}`)
    }

    // URL to redirect to after sign in process completes
    return res.redirect(next as string)
  } catch (error) {
    console.error("Callback error:", error)
    return res.redirect(`/signin?error=${encodeURIComponent("An unexpected error occurred")}`)
  }
}

