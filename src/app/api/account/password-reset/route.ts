import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { checkPasswordBreached } from "@/lib/breach-check";
import {
  getSessionTokenFromRequest,
  validateSession,
  revokeAllUserSessions,
  clearSessionCookie,
} from "@/lib/session";
import { z } from "zod";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(10, "Password must be at least 10 characters long.")
    .max(128, "Password must not exceed 128 characters."),
});

export async function POST(request: Request) {
  try {
    const rawToken = getSessionTokenFromRequest(request);
    if (!rawToken) {
      return NextResponse.json(
        { error: "Authentication required to reset password." },
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

    const body = await request.json().catch(() => null);
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid password." },
        { status: 422 }
      );
    }

    const newPassword = parsed.data.newPassword.trim();

    // Check breach status
    const breachCheck = await checkPasswordBreached(newPassword);
    if (breachCheck.isBreached) {
      return NextResponse.json(
        {
          error:
            "This password has appeared in a known data breach. For your security, choose a different password.",
        },
        { status: 422 }
      );
    }

    // Hash new password using Argon2id
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in PostgreSQL
    await prisma.user.update({
      where: { id: sessionData.user.id },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate ALL sessions across all devices for this user
    const revokedCount = await revokeAllUserSessions(sessionData.user.id);

    console.info("[POST /api/account/password-reset] Password reset complete, revoked all sessions", {
      userId: sessionData.user.id,
      revokedCount,
    });

    const response = NextResponse.json(
      {
        message:
          "Your password has been reset successfully. All active sessions have been terminated. Please sign in with your new password.",
        revokedSessionsCount: revokedCount,
      },
      { status: 200 }
    );

    // Clear session cookie on the resetting device
    clearSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[POST /api/account/password-reset] Error resetting password", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting your password." },
      { status: 500 }
    );
  }
}

