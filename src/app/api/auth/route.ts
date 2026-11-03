import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AuthRequestBody {
  mode?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  servicePlan?: string;
  password?: string;
  acceptTerms?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthRequestBody;
    const mode = body.mode ?? "register";

    if (mode === "login") {
      console.info("[POST /api/auth] Login attempt received:", {
        email: body.email ?? "(empty)",
      });
      return NextResponse.json(
        {
          message:
            "Sign-in credentials received. Server-side session issuance is scheduled for Task 04 and Task 05.",
          mode: "login",
        },
        { status: 200 }
      );
    }

    // Task 03 Step 8 Note:
    // At the Task 03 stage, strict validation lives on the client.
    // The endpoint records the incoming registration payload to PostgreSQL so that
    // Step 8 can demonstrate what happens when a client bypasses browser validation
    // via a direct CLI request (motivating Task 04 server-side schema validation).
    const record = await prisma.serviceEnquiry.create({
      data: {
        fullName: String(body.fullName ?? ""),
        email: String(body.email ?? ""),
        serviceType: String(body.servicePlan ?? "Individual Subscription"),
        notes: `Phone: ${String(body.phone ?? "")} | AcceptedTerms: ${String(
          Boolean(body.acceptTerms)
        )} | PasswordLength: ${String((body.password ?? "").length)}`,
      },
    });

    console.info("[POST /api/auth] 201 Registration record created:", {
      id: record.id,
      fullName: record.fullName,
      email: record.email,
      serviceType: record.serviceType,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    });

    return NextResponse.json(
      {
        message: "Registration recorded in PostgreSQL.",
        record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth] 500 Database Error:", error);
    return NextResponse.json(
      {
        error:
          "We could not complete your request right now. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}

