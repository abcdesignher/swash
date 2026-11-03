import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface EnquiryRequestBody {
  fullName?: unknown;
  email?: unknown;
  serviceType?: unknown;
  notes?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EnquiryRequestBody;

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const serviceType =
      typeof body.serviceType === "string" ? body.serviceType.trim() : "";
    const notes =
      typeof body.notes === "string" && body.notes.trim().length > 0
        ? body.notes.trim()
        : null;

    if (!fullName || !email || !serviceType) {
      console.warn("[POST /api/enquiries] 400 Bad Request: Missing required fields", {
        hasFullName: Boolean(fullName),
        hasEmail: Boolean(email),
        hasServiceType: Boolean(serviceType),
      });
      return NextResponse.json(
        {
          error: "Please provide your full name, email address, and service type.",
        },
        { status: 400 }
      );
    }

    const record = await prisma.serviceEnquiry.create({
      data: {
        fullName,
        email,
        serviceType,
        notes,
      },
    });

    console.info("[POST /api/enquiries] 201 Created:", {
      id: record.id,
      email: record.email,
      serviceType: record.serviceType,
      createdAt: record.createdAt.toISOString(),
    });

    return NextResponse.json(
      {
        message: "Enquiry saved to Swash records.",
        enquiry: {
          id: record.id,
          fullName: record.fullName,
          email: record.email,
          serviceType: record.serviceType,
          notes: record.notes,
          createdAt: record.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/enquiries] 500 Database Write Failed:", error);
    return NextResponse.json(
      {
        error:
          "We could not save your enquiry right now. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}

