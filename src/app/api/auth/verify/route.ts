import { NextResponse } from "next/server";
import { verifyUserCode } from "@/lib/verification";
import { normaliseEmail } from "@/lib/normalise";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normaliseEmail(String(body.email || ""));
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email address and unique verification code are required." },
        { status: 400 },
      );
    }

    const result = await verifyUserCode(email, code);

    if (!result.success) {
      const statusMap: Record<string, number> = {
        EXPIRED: 410, // Gone
        INVALID_CODE: 422, // Unprocessable Entity
        ALREADY_USED: 409, // Conflict
        MAX_ATTEMPTS_EXCEEDED: 429, // Too Many Requests
        NOT_FOUND: 404, // Not Found
      };
      const statusCode = statusMap[result.status] || 400;

      return NextResponse.json(
        { error: result.message, status: result.status },
        { status: statusCode },
      );
    }

    return NextResponse.json(
      { message: result.message, status: result.status },
      { status: 200 },
    );
  } catch (err) {
    console.error("[POST /api/auth/verify] Error:", err);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 },
    );
  }
}
