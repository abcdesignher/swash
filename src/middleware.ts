import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "swash_session";

// Routes that require an authenticated session
const PROTECTED_PREFIXES = ["/account", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    // If no session cookie exists, redirect immediately to login
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("mode", "login");
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};

