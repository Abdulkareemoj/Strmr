import { type NextRequest } from "next/server";
import { createClient } from "~/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (data?.session && !error) {
      const { access_token, refresh_token } = data.session;
      const headers = await setAuthCookies(access_token, refresh_token);
      const redirectUrl = new URL(next, request.url);

      return new Response(null, {
        status: 302,
        headers: {
          ...headers,
          Location: redirectUrl.toString(),
        },
      });
    }
  }

  // Redirect the user to an error page if tokens are not present
  return redirect("/error");
}

// Example function to set authentication cookies
async function setAuthCookies(accessToken: string, refreshToken: string) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `access_token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`, // Set Max-Age as needed
  );
  headers.append(
    "Set-Cookie",
    `refresh_token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`, // Set Max-Age as needed
  );
  return headers;
}
