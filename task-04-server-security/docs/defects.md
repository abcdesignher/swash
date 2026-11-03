# Defects Encountered & Resolved (Task 04)

This document tracks all real defects, migration errors, and runtime failures encountered and resolved during Task 04 implementation.

---

## Defect 1: Required-Column Migration Failure on Populated Table (`P3018` / PostgreSQL `23502`)

- **Symptom:** Executing `npx prisma migrate deploy` for an `ALTER TABLE "User" ADD COLUMN "defaultPickupZone" TEXT NOT NULL;` migration failed immediately.
- **Root Cause:** PostgreSQL error `23502` (`column "defaultPickupZone" of relation "User" contains null values`). The `User` table already contained existing customer rows, and no default or pre-existing values existed for the newly added required column.
- **Resolution:** Rolled back the failed migration with `npx prisma migrate resolve --rolled-back` and executed the **Controlled Three-Step Pattern**:
  1. *Expand:* Added the column as nullable (`TEXT`).
  2. *Backfill:* Executed `UPDATE "User" SET "defaultPickupZone" = 'Lagos Mainland' WHERE "defaultPickupZone" IS NULL;`.
  3. *Contract:* Applied `ALTER TABLE "User" ALTER COLUMN "defaultPickupZone" SET NOT NULL;`.
- **Evidence:** Documented in [`04-required-column-failure.txt`](../evidence/04-required-column-failure.txt) and [`05-required-column-three-steps.txt`](../evidence/05-required-column-three-steps.txt).

---

## Defect 2: Schema Drift Runtime Query Crash (Prisma `P2022`)

- **Symptom:** `prisma.user.findFirst()` threw a runtime crash: `The column User.unmigratedLoyaltyTier does not exist in the current database`.
- **Root Cause:** The TypeScript Prisma Client was regenerated (`prisma generate`) after adding a field to `prisma/schema.prisma`, but the underlying PostgreSQL database had not been migrated. The client issued a `SELECT` statement querying a non-existent database column.
- **Resolution:** Ran `prisma migrate diff` to diagnose the exact column mismatch, removed the unmigrated field from `schema.prisma` to realign with applied migration history, and regenerated the Prisma Client.
- **Evidence:** Documented in [`06-drift-error.txt`](../evidence/06-drift-error.txt).

---

## Defect 3: Next.js React Client Manifest Stale Cache Error

- **Symptom:** The browser displayed a white error screen: `Could not find the module ".../src/components/AuthForm.tsx#default" in the React Client Manifest. This is probably a bug in the React Server Components bundler.`
- **Root Cause:** Next.js development server (`next dev`) maintains an in-memory and disk-based module manifest cache in `.next/`. Rapid programmatic edits to client component exports desynchronized the server-side manifest from the client chunks.
- **Resolution:** Stopped the Next.js process, executed `Remove-Item -Recurse -Force .next`, and restarted the dev server. Subsequent requests returned clean HTTP 200 responses.

---

## Defect 4: Single-Core Benchmark Measurement Bias on Sequential Runs

- **Symptom:** Initial sequential timing runs of `POST /api/auth` showed high maximum latency spikes (> 500 ms) on the first 1–2 requests.
- **Root Cause:** Cold-start overhead in Node.js, Next.js JIT compilation of route handlers, and initial database connection pool acquisition in PgBouncer mode.
- **Resolution:** Introduced a dedicated warm-up request prior to statistical measurement, and used **median latency** rather than mean to provide resilient, unskewed comparisons.
- **Evidence:** Documented in [`11-validation-timing.txt`](../evidence/11-validation-timing.txt).

