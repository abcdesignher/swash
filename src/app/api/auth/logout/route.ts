import { NextResponse } from "next/server";
import {
  getSessionTokenFromRequest,
  revokeSession,
  clearSessionCookie,
} from "@/lib/session";

export async function POST(request: Request) {
  try {
    const rawToken = getSessionTokenFromRequest(request);

    if (rawToken) {
      await revokeSession(rawToken);
      console.info("[POST /api/auth/logout] Session revoked on server");
    }

    const response = NextResponse.json(
      { message: "You have been logged out of Swash." },
      { status: 200 }
    );

    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[POST /api/auth/logout] Server error during logout", error);
    return NextResponse.json(
      { error: "An error occurred while logging out. Your session may still be active on the server." },
      { status: 500 }
    );
  }
}

