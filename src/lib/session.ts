import crypto from "node:crypto";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "swash_session";
export const SESSION_LIFETIME_DAYS = 7;
export const SESSION_LIFETIME_MS = SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000;

/**
 * Computes a deterministic SHA-256 digest of the raw session token.
 * Only the hash is stored in PostgreSQL. If the database is compromised,
 * the attacker holds token hashes, not bearer tokens that can be replayed in cookies.
 */
export function hashSessionToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Creates a fresh session for an authenticated user.
 * Generates 32 bytes of cryptographic randomness (256 bits of entropy),
 * hashes the token with SHA-256, and stores the session record in PostgreSQL.
 */
export async function createSession(params: {
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);

  const session = await prisma.session.create({
    data: {
      userId: params.userId,
      tokenHash,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      expiresAt,
    },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    rawToken,
    session,
  };
}

/**
 * Validates a raw bearer session token from the browser cookie.
 * Ensures the session exists, has not expired, has not been revoked,
 * and that the owning user account is active (not soft-deleted).
 */
export async function validateSession(rawToken: string) {
  if (!rawToken || typeof rawToken !== "string") {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          preferredPlan: true,
          defaultPickupZone: true,
          emailVerifiedAt: true,
          deletedAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Check if session has been revoked
  if (session.revokedAt !== null) {
    return null;
  }

  // Check if session has expired
  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  // Check if user is soft-deleted
  if (session.user.deletedAt !== null) {
    return null;
  }

  return {
    session: {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    },
    user: session.user,
  };
}

/**
 * Revokes a single session by its raw bearer token.
 * Sets revokedAt timestamp rather than physically deleting immediately,
 * preserving security telemetry and audit trails.
 */
export async function revokeSession(rawToken: string): Promise<boolean> {
  if (!rawToken) return false;
  const tokenHash = hashSessionToken(rawToken);

  const result = await prisma.session.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return result.count > 0;
}

/**
 * Revokes all active sessions for a user (e.g. after password reset or account deletion).
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return result.count;
}

/**
 * Configures and attaches the session cookie with defensive HTTP flags.
 */
export function attachSessionCookie(response: NextResponse, rawToken: string): void {
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: rawToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_LIFETIME_DAYS * 24 * 60 * 60,
  });
}

/**
 * Clears the session cookie by expiring it immediately.
 */
export function clearSessionCookie(response: NextResponse): void {
  const isProd = process.env.NODE_ENV === "production";

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Extracts the raw session token from the standard Request Cookie header.
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return cookie.substring(SESSION_COOKIE_NAME.length + 1);
    }
  }

  return null;
}

