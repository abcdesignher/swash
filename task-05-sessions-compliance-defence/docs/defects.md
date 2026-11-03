# Task 05 Defects Log

Every defect documented below is a real issue encountered, diagnosed, and resolved during **Task 05 (Sessions, Account Deletion, Compliance and Defence)**, cited by file and line number with root cause analysis and production risk assessment.

---

### Defect 1: Standalone Node ESM Module Path Alias Resolution Failure (`@/lib/prisma`)
* **File & Line:** `src/lib/deletion-job.ts` (lines 1–5) and `scratch/test-deletion-flow.mjs` (line 140).
* **Description:** When `runAccountDeletionJob()` was invoked by a standalone Node.js maintenance script, the native Node ESM loader failed with `ERR_MODULE_NOT_FOUND: Cannot find package '@/lib' imported from .../deletion-job.ts`. Node's native module resolver does not parse Next.js `tsconfig.json` path aliases (`@/`) outside the Next.js compiler environment.
* **Production & Operational Risk:** In production, scheduled cron jobs and queue workers often run as dedicated background processes or Docker worker containers separate from the main web server. If library modules rely exclusively on framework bundler aliases, background workers crash upon startup.
* **Resolution:** Refactored `src/lib/deletion-job.ts` to accept an optional `prismaClient` dependency injection parameter and implemented an adaptive runtime resolver `resolvePrisma(customClient)` that attempts framework import under Next.js and falls back to dynamic `@prisma/client` instantiation in standalone Node runtimes.

---

### Defect 2: Malformed Object Literal Syntax in Deletion Filter
* **File & Line:** `src/lib/deletion-job.ts` (line 48).
* **Description:** Inside the `prisma.user.findMany` where clause, the query filter for excluding already-anonymized records was written as `endsWith("@deleted.swash.ng")` with parentheses instead of object property syntax `endsWith: "@deleted.swash.ng"`. This triggered a TypeScript compiler parsing error: `Unexpected token string literal... Expected yield, an identifier, [ or {`, causing `POST /api/account/delete` to fail with HTTP 500.
* **Production & Operational Risk:** Customer deletion requests crash with internal server errors, trapping users in an unclosable account state in direct violation of NDPA 2023 statutory response timelines.
* **Resolution:** Corrected the object property syntax to `endsWith: "@deleted.swash.ng"` and verified successful JSON compilation.

---

### Defect 3: Invalid Type for Prisma Filter Argument (`in` on DateTime Column)
* **File & Line:** `src/lib/deletion-job.ts` (lines 47–56).
* **Description:** When implementing targeted job execution for testing, `targetUserIds` strings (e.g. `["cmw0vv...", "cmw0vv..."]`) were erroneously placed inside `deletedAt: { in: options.targetUserIds }` rather than `id: { in: options.targetUserIds }`. Prisma threw `PrismaClientValidationError: Invalid value for argument in: input contains invalid characters. Expected ISO-8601 DateTime`.
* **Production & Operational Risk:** The scheduled deletion job crashed immediately upon execution without processing any eligible accounts, causing soft-deleted customer data to accumulate indefinitely past the 14-day statutory grace period.
* **Resolution:** Moved the ID array filter to its proper property: `...(options?.targetUserIds ? { id: { in: options.targetUserIds } } : {})` and verified clean execution across both job runs.

---

### Defect 4: PowerShell Output Redirection UTF-16LE Encoding
* **File & Line:** `scratch/test-two-sessions.mjs` and `evidence/01-two-session-ids.txt`.
* **Description:** Executing `node script.mjs > evidence/01-two-session-ids.txt` inside Windows PowerShell default-formatted the output file as `UTF-16LE` with a byte-order mark (BOM). File readers and text tools rejected the file with: `file appears to be a binary file (text/plain; charset=utf-16le) and cannot be read as text`.
* **Production & Operational Risk:** Automated log aggregation tools, SIEM pipelines, and CI/CD audit runners fail to parse UTF-16LE logs, blinding security operations centers to session telemetry.
* **Resolution:** Updated diagnostic scripts to use `node:fs` with explicit `fs.writeFileSync(destPath, content, 'utf8')`, guaranteeing clean UTF-8 encoding across all text evidence.

