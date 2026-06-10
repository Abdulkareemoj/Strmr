import { auth } from "~/server/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/upload",
  "/settings",
  "/music/library",
  "/music/liked",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
