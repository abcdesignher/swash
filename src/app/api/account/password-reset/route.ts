import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { checkPasswordBreached } from "@/lib/breach-check";
import {
  getSessionTokenFromRequest,
  validateSession,
  revokeAllUserSessions,
  clearSessionCookie,
} from "@/lib/session";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password."),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters long.")
      .max(128, "New password must not exceed 128 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match. Please verify your confirmation password.",
    path: ["confirmPassword"],
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
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 422 }
      );
    }

    const currentPassword = parsed.data.currentPassword.trim();
    const newPassword = parsed.data.newPassword.trim();

    // Verify current password against stored Argon2id hash
    const user = await prisma.user.findUnique({
      where: { id: sessionData.user.id },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    const isCurrentValid = await verifyPassword(user.passwordHash, currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect. Please re-enter your existing password." },
        { status: 422 }
      );
    }

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
