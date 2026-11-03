import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normaliseEmail } from "@/lib/normalise";
import {
  generateVerificationCode,
  hashVerificationCode,
  CODE_EXPIRY_MINUTES,
} from "@/lib/verification";
import { queueEmailJob, getMailTransport, processPendingEmailJobs } from "@/lib/email";
import { rateLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normaliseEmail(String(body.email || ""));

    if (!email) {
      return NextResponse.json(
        { error: "Registered email address is required." },
        { status: 400 },
      );
    }

    // Rate limit resend attempts: 1 request every 2 minutes per IP + email
    const clientIp = getClientIp(request);
    const rateKey = `${clientIp}:resend:${email}`;
    const rateCheck = rateLimiter.check(rateKey, { maxRequests: 1, windowSeconds: 120 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${rateCheck.retryAfterSeconds} seconds before requesting another code.`,
        },
        { status: 429 },
      );
    }

    // Find the user
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
      select: { id: true, fullName: true, email: true, emailVerifiedAt: true },
    });

    if (!user) {
      // Security: return generic success message to prevent user enumeration
      return NextResponse.json(
        { message: "If an account exists with this email, a new unique verification code has been sent." },
        { status: 200 },
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { message: "This email address is already verified. You may sign in." },
        { status: 200 },
      );
    }

    // Generate fresh code and store
    const code = generateVerificationCode();
    const codeHash = hashVerificationCode(code);
    const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        email: user.email,
        codeHash,
        purpose: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // Queue email job
    await queueEmailJob({
      userId: user.id,
      toEmail: user.email,
      subject: "Your new Swash verification code",
      templateType: "EMAIL_VERIFICATION",
      payloadJson: JSON.stringify({
        fullName: user.fullName,
        code,
      }),
    });

    // Asynchronous background dispatch
    const transporter = getMailTransport();
    setImmediate(() => {
      processPendingEmailJobs(transporter).catch((err) =>
        console.warn("[background-email-worker] Notice:", err?.message || err)
      );
    });

    console.info("[POST /api/auth/resend-code] New verification code issued for", user.email);

    return NextResponse.json(
      { message: "A new unique verification code has been sent to your email." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[POST /api/auth/resend-code] Error:", err);
    return NextResponse.json(
      { error: "Failed to resend verification code. Please try again." },
      { status: 500 },
    );
  }
}
