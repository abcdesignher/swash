import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  loginSchema,
  registerSchema,
  toFieldErrors,
} from "@/lib/validation";
import {
  rateLimiter,
  AUTH_RATE_LIMITS,
  getClientIp,
} from "@/lib/rate-limit";
import { checkPasswordBreached } from "@/lib/breach-check";
import {
  generateVerificationCode,
  hashVerificationCode,
  CODE_EXPIRY_MINUTES,
} from "@/lib/verification";
import { queueEmailJob, getMailTransport, processPendingEmailJobs } from "@/lib/email";

const MAX_BODY_BYTES = 10_000;

// Verified against when no account exists, so "unknown email" and "wrong
// password" take comparable time and return the same response.
const dummyHashPromise = hashPassword("swash-timing-equaliser-not-a-real-password");

const GENERIC_LOGIN_ERROR = "The email or password is incorrect.";

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers });
}

export async function POST(request: Request) {
  // 1. Read and parse the body. Nothing below this line uses data that has not
  //    been through a schema.
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ error: "The request is too large." }, 413);
    }
    raw = JSON.parse(text);
  } catch {
    return json({ error: "The request could not be read." }, 400);
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return json({ error: "The request could not be read." }, 400);
  }
  const mode = (raw as { mode?: unknown }).mode ?? "register";

  if (mode !== "login" && mode !== "register") {
    return json({ error: "The request could not be read." }, 400);
  }

  // 2. Rate limit check by client IP and action mode
  const clientIp = getClientIp(request);
  const rateLimitKey = `${clientIp}:${mode}`;
  const rateConfig =
    mode === "login" ? AUTH_RATE_LIMITS.login : AUTH_RATE_LIMITS.register;

  const rateCheck = rateLimiter.check(rateLimitKey, rateConfig);
  if (!rateCheck.allowed) {
    return json(
      {
        error: `Too many attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        retryAfter: rateCheck.retryAfterSeconds,
      },
      429,
      {
        "Retry-After": String(rateCheck.retryAfterSeconds),
      },
    );
  }

  try {
    if (mode === "login") {
      // 3. Validate (request boundary).
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) {
        return json(
          { error: "Please check your details and try again.", fieldErrors: toFieldErrors(parsed.error) },
          422,
        );
      }

      // 4. Only now touch the database.
      const user = await prisma.user.findFirst({
        where: { email: parsed.data.email, deletedAt: null },
        select: { id: true, passwordHash: true },
      });
      const hash = user?.passwordHash ?? (await dummyHashPromise);
      const passwordOk = await verifyPassword(hash, parsed.data.password);

      if (!user || !passwordOk) {
        return json({ error: GENERIC_LOGIN_ERROR }, 401);
      }
      return json(
        {
          message:
            "Your credentials are correct. Sessions are not issued yet, so you are not signed in.",
          mode: "login",
        },
        200,
      );
    }

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return json(
        { error: "Some details need correcting.", fieldErrors: toFieldErrors(parsed.error) },
        422,
      );
    }
    const input = parsed.data;

    // 5. Breached password check (privacy-preserving k-Anonymity)
    const breachResult = await checkPasswordBreached(input.password);
    if (breachResult.isBreached) {
      return json(
        {
          error:
            "This password has appeared in a known data breach. For your security, choose a different password.",
          fieldErrors: {
            password:
              "This password has appeared in a known data breach. For your security, choose a different password.",
          },
        },
        422,
      );
    }

    const passwordHash = await hashPassword(input.password);
    try {
      // Create user, 6-digit verification code, and background EmailJob atomically
      const code = generateVerificationCode();
      const codeHash = hashVerificationCode(code);
      const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000);

      const user = await prisma.user.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          passwordHash,
          preferredPlan: input.servicePlan,
          verificationCodes: {
            create: {
              email: input.email,
              codeHash,
              purpose: "EMAIL_VERIFICATION",
              expiresAt,
            },
          },
        },
        select: { id: true, email: true, createdAt: true },
      });

      // Queue background email job
      await queueEmailJob({
        userId: user.id,
        toEmail: user.email,
        subject: "Verify your Swash email address",
        templateType: "EMAIL_VERIFICATION",
        payloadJson: JSON.stringify({
          fullName: input.fullName,
          code,
        }),
      });

      // Asynchronous background dispatch without awaiting (does not delay HTTP response!)
      const transporter = getMailTransport();
      setImmediate(() => {
        processPendingEmailJobs(transporter).catch((err) =>
          console.warn("[background-email-worker] Notice:", err?.message || err)
        );
      });

      console.info("[POST /api/auth] 201 account created & verification queued", {
        userId: user.id,
      });

      return json(
        {
          message:
            "Your account has been created. We sent a unique verification code to your email.",
          record: { id: user.id, email: user.email },
        },
        201,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return json(
          {
            error:
              "We could not create an account with those details. If you already have an account, sign in instead.",
          },
          409,
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("[POST /api/auth] 500 unexpected error", error);
    return json(
      {
        error:
          "We could not complete your request right now. Please check your connection and try again.",
      },
      500,
    );
  }
}
