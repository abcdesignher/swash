import { NextResponse } from "next/server";
import { getSessionTokenFromRequest, validateSession } from "@/lib/session";

export async function GET(request: Request) {
  const rawToken = getSessionTokenFromRequest(request);

  if (!rawToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const sessionData = await validateSession(rawToken);
  if (!sessionData) {
    return NextResponse.json(
      { authenticated: false, error: "Session invalid or expired" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      sessionId: sessionData.session.id,
      user: sessionData.user,
    },
    { status: 200 }
  );
}

