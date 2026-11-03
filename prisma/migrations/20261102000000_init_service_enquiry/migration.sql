CREATE TABLE "ServiceEnquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceEnquiry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceEnquiry_email_idx" ON "ServiceEnquiry"("email");
CREATE INDEX "ServiceEnquiry_createdAt_idx" ON "ServiceEnquiry"("createdAt");
