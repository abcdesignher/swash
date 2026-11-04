import { randomInt, createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const CODE_EXPIRY_MINUTES = 15;
export const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit verification code.
 * Uses crypto.randomInt which is backed by the operating system CSPRNG
 * (CryptGenRandom on Windows, /dev/urandom or getrandom on Linux).
 * Range is [100000, 999999], guaranteeing exactly 6 numeric digits.
 */
export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

/**
 * Hash a verification code for storage.
 * Verification codes are short-lived (15 minutes), single-use secrets.
 * We store an HMAC/SHA-256 digest in PostgreSQL so plaintext codes are never exposed
 * in database backups or connection pool logs.
 */
export function hashVerificationCode(code: string): string {
  return createHash("sha256")
    .update(`swash_code_pepper_${code}`)
    .digest("hex");
}

export function verifyCodeHash(providedCode: string, storedHash: string): boolean {
  const computed = hashVerificationCode(providedCode);
  return computed === storedHash;
}

export interface VerificationResult {
  success: boolean;
  status:
    | "SUCCESS"
    | "EXPIRED"
    | "INVALID_CODE"
    | "MAX_ATTEMPTS_EXCEEDED"
    | "ALREADY_USED"
    | "NOT_FOUND";
  message: string;
  user?: any;
}

/**
 * Verify a 6-digit code against the user's latest active verification record.
 */
export async function verifyUserCode(
  email: string,
  providedCode: string,
): Promise<VerificationResult> {
  const normalisedEmail = email.trim().toLowerCase();
  const cleanCode = providedCode.trim();

  // Find the most recent verification record for this email
  const record = await prisma.verificationCode.findFirst({
    where: {
      email: normalisedEmail,
      purpose: "EMAIL_VERIFICATION",
    },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  if (!record) {
    return {
      success: false,
      status: "NOT_FOUND",
      message: "No verification request found for this email address.",
    };
  }

  // 1. Check if already used
  if (record.usedAt !== null) {
    return {
      success: false,
      status: "ALREADY_USED",
      message: "This verification code has already been used. Please request a new code.",
    };
  }

  // 2. Check if expired
  const now = new Date();
  if (now > record.expiresAt) {
    return {
      success: false,
      status: "EXPIRED",
      message: "This verification code has expired. Verification codes are valid for 15 minutes.",
    };
  }

  // 3. Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    return {
      success: false,
      status: "MAX_ATTEMPTS_EXCEEDED",
      message: "Maximum verification attempts exceeded. Please request a new code.",
    };
  }

  // 4. Verify code match
  const isMatch = verifyCodeHash(cleanCode, record.codeHash);
  if (!isMatch) {
    // Increment attempt counter atomically
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    const remaining = record.maxAttempts - (record.attempts + 1);
    return {
      success: false,
      status: "INVALID_CODE",
      message: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // 5. Success: mark code as used and set user.emailVerifiedAt
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: record.id },
      data: { usedAt: now },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerifiedAt: now },
    }),
  ]);

  return {
    success: true,
    status: "SUCCESS",
    message: "Email address verified successfully. Your Swash account is now active.",
    user: record.user,
  };
}

