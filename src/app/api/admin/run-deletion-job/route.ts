import { NextResponse } from "next/server";
import { getSessionTokenFromRequest, validateSession } from "@/lib/session";
import { runAccountDeletionJob } from "@/lib/deletion-job";

export async function POST(request: Request) {
  const rawToken = getSessionTokenFromRequest(request);
  if (!rawToken) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const sessionData = await validateSession(rawToken);
  if (!sessionData) {
    return NextResponse.json(
      { error: "Session invalid or expired." },
      { status: 401 }
    );
  }

  // Strict Authorisation Check: Role must be ADMIN
  if (sessionData.user.role !== "ADMIN") {
    console.warn("[POST /api/admin/run-deletion-job] 403 Forbidden: Customer attempted admin action", {
      userId: sessionData.user.id,
      role: sessionData.user.role,
    });
    return NextResponse.json(
      {
        error: "Access Refused: Administrator authorization required. Your customer account does not have permission to execute operational jobs.",
      },
      { status: 403 }
    );
  }

  // Execute admin action
  const result = await runAccountDeletionJob();
  return NextResponse.json(
    {
      message: "Scheduled deletion job triggered successfully by administrator.",
      result,
    },
    { status: 200 }
  );
}

