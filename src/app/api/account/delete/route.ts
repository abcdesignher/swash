import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSessionTokenFromRequest,
  validateSession,
  revokeAllUserSessions,
  clearSessionCookie,
} from "@/lib/session";
import { DEFAULT_GRACE_PERIOD_DAYS } from "@/lib/deletion-job";

export async function POST(request: Request) {
  try {
    const rawToken = getSessionTokenFromRequest(request);
    if (!rawToken) {
      return NextResponse.json(
        { error: "Authentication required to request account deletion." },
        { status: 401 }
      );
    }

    const sessionData = await validateSession(rawToken);
    if (!sessionData) {
      return NextResponse.json(
        { error: "Session invalid or expired. Please sign in again." },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // 1. Soft delete: Mark the user account with deletedAt timestamp
    const now = new Date();
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: now },
    });

    // 2. Immediately lock the account and revoke all active sessions across all devices
    const revokedCount = await revokeAllUserSessions(userId);

    console.info("[POST /api/account/delete] Account locked and scheduled for deletion", {
      userId,
      deletedAt: now.toISOString(),
      revokedSessions: revokedCount,
    });

    const scheduledHardDeleteDate = new Date(
      now.getTime() + DEFAULT_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
    );

    const response = NextResponse.json(
      {
        message:
          `Your account has been locked and scheduled for permanent deletion. You have a ${DEFAULT_GRACE_PERIOD_DAYS}-day grace period before data purge. All active sessions have been terminated.`,
        deletedAt: now.toISOString(),
        gracePeriodDays: DEFAULT_GRACE_PERIOD_DAYS,
        scheduledHardDeleteDate: scheduledHardDeleteDate.toISOString(),
      },
      { status: 200 }
    );

    // 3. Clear cookie from the user's browser
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[POST /api/account/delete] Error processing deletion request", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your deletion request." },
      { status: 500 }
    );
  }
}

