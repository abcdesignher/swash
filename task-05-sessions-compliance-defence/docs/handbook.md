# The Swash Engineering Handbook: Lessons from Building a Resilient Web Platform

This handbook serves as a comprehensive technical guide for software engineers, systems designers, and product developers learning from the engineering trajectory of **Swash**, an African-first subscription laundry service in Lagos, Nigeria.

Every section follows a strict six-part pedagogical structure:
1. **Concept:** Plain-language definition.
2. **Purpose:** The concrete failure it prevents.
3. **Scenario:** A realistic business situation in Nigerian e-commerce.
4. **Implementation:** Architectural and programmatic mechanics.
5. **Failure:** What goes wrong when ignored, and the operational fallout.
6. **Personal Mistake:** A real, verifiable mistake encountered during the Swash build.

---

## Section 1: Typography, Shadows, and Design-System Export

### 1. Concept
A design token is an unambiguous, named key-value pair that represents an atomic visual decision—such as a brand hex color role, a typographic scale step, or a shadow coordinate. Tokens separate design decisions from CSS implementation and serve as the single source of truth across design tools and codebases.

### 2. Purpose
Prevents **visual divergence, primitive color leakage, and unmaintainable hardcoded CSS values**. Without tokens, multiple developers independently invent arbitrary hex codes (`#350078`, `#36007a`), creating fragmented, unbranded user interfaces.

### 3. Scenario
Swash's brand identity blends rich Ankara-inspired gold with deep regal purple. When marketing requests a seasonal campaign or accessibility audit, hardcoded styles across dozens of components require weeks of manual search-and-replace. With tokens, updating `:root` custom properties instantly restyles the entire platform.

### 4. Implementation
Design variables exported from Figma into structured JSON (`06-tokens-complete.json`) are converted into native CSS custom properties in `task-01-design-system/styles/global.css`:
```css
:root {
  --colour-primary-role: #e81313ff;
  --colour-inverse-primary-role: #e9ddffff;
  --typography-headline-large-font-size: 2rem;
  --shadow-medium: 0px 4px 25px 0px rgba(53, 0, 120, 0.15);
}
```
Application components strictly reference `var(--colour-*)` and `var(--typography-*)` without declaring raw hex values.

### 5. Failure
When tokens are bypassed, developers accidentally pick low-contrast combinations (e.g., `#e81313` on `#fcf8ff` yielding `4.41:1`, below WCAG AA `4.5:1` for normal text). On low-grade Android phone screens under bright Lagos sunlight, text becomes illegible, causing customers to abandon checkout.

### 6. Personal Mistake
In Task 01, `05-tokens-incomplete.json` initially duplicated `06-tokens-complete.json` because Figma collections were not properly excluded during the first raw export. Furthermore, `open sans.headline.headline small` exported with `fontFamily: "Inter"` instead of `"Open Sans"` (`type-scale.md`, line 32), requiring documented isolation in `defects.md` to avoid silent divergence from the JSON source of truth.

---

## Section 2: Scaffolding, Development Server, and Database Diagnostics

### 1. Concept
Scaffolding establishes the directory topology, compiler configuration (`tsconfig.json`), package manager bindings, and database ORM layer at the canonical project root before application features are written.

### 2. Purpose
Prevents **deployment pipeline failures, split repository states, and port conflict crashes** across developer environments.

### 3. Scenario
Multiple team members collaborate on Swash. One developer starts the server on port 3000, leaving a background zombie node process running when their editor crashes. The next developer clones the repo and gets immediate socket collision errors, unable to start the app.

### 4. Implementation
The root `package.json` configures Next.js App Router, strict TypeScript, and Prisma ORM. Controlled diagnostics scripts detect port conflicts using `netstat -ano | findstr :3000` and terminate lingering server processes using exact PIDs (`taskkill /PID <PID> /F`).

### 5. Failure
If scaffolding is nested in a task folder, CI/CD platforms (Vercel, Railway, GitHub Actions) fail to locate `package.json` at root, resulting in build timeouts. In production, unmonitored database connection pools exhaust PostgreSQL socket limits (`Error: P2024 - Timed out fetching a connection from the pool`).

### 6. Personal Mistake
In Task 02, the Next.js scaffold was initially created inside `task-02-repository-and-scaffold/` rather than the repository root. Running `npm run dev` from the project root failed immediately with `ENOENT: no such file or directory, open '.../package.json'`. The entire application had to be relocated to the repository root (`evidence/05-nested-folder-error.txt` and `06-nested-folder-fixed.txt`).

---

## Section 3: Information Design, Browser Metadata, and Responsive Typography

### 1. Concept
Information design structures interface content into clear visual hierarchies, using responsive typographic formulas (`clamp()`), bounded reading line-lengths (`ch` units), and standardized browser metadata (`<title>`, `<meta name="description">`, OpenGraph).

### 2. Purpose
Prevents **layout overflow on small mobile screens, typographic orphans, and broken social sharing previews**.

### 3. Scenario
A busy professional in Lagos views Swash on a compact 375px wide smartphone over mobile data. If headings use fixed pixel sizes, text wraps awkwardly, pushing call-to-action buttons below the viewport fold.

### 4. Implementation
Fluid responsive typography scales dynamically using CSS `clamp()` without requiring bloated media query breakpoints:
```css
font-size: clamp(1.75rem, 4vw + 1rem, 2.5rem);
max-width: 22ch;
text-wrap: balance;
```
Every route exports structured Next.js `Metadata` with localized OpenGraph tags (`locale: "en_NG"`).

### 5. Failure
Without `text-wrap: balance` and character-width constraints, headings break after single short prepositions ("in", "to"), producing visually jarring "widow" words that undermine customer trust in a premium laundry brand.

### 6. Personal Mistake
In Task 02, the home screen hero heading originally had no `max-width` limit. On desktop displays, it spanned an unreadable 1200px width; on mobile screens, it broke into awkward 4-line fragments (`evidence/18-heading-wrap-bad.png`). This was resolved in PR #1 (`feat/information-design`) by applying `max-width: 22ch` and fluid `clamp()` typography (`evidence/19-heading-wrap-good.png`).

---

## Section 4: Git Workflow, Branching, and Client-Side Validation

### 1. Concept
A disciplined Git workflow enforces forward-only version control, feature branches, and commit-SHA reversibility. Client-side validation uses accessible form controls (`<input type="tel" inputMode="numeric">`, `aria-invalid`, `role="alert"`) to provide immediate feedback before network submission.

### 2. Purpose
Prevents **codebase regressions, data loss, and client-side data corruption** (such as stripping leading zeros from Nigerian telephone numbers).

### 3. Scenario
A customer enters their Lagos mobile phone number `08031234567`. If the form uses `<input type="number">`, the browser treats it as a mathematical integer and strips the leading zero, sending `8031234567` to the server. The dispatch rider cannot call the customer, causing a missed laundry pickup.

### 4. Implementation
The form uses `<input type="tel" inputMode="numeric" autoComplete="tel">`, strictly preserving the leading zero. Non-color visual cues (`⚠` caution icons) paired with dynamic `aria-describedby` attributes ensure screen-reader accessibility (WCAG 1.4.1). Faulty features are reverted by exact commit SHA (`git revert <sha>`) rather than error-prone manual edits.

### 5. Failure
Relying on natural-language rollback instructions ("undo that last change") frequently leaves orphaned variables or removes unrelated bug fixes. In validation, hiding the submit button with `display: none` leaves keyboard users trapped with no indication of why the form cannot be submitted.

### 6. Personal Mistake
In Task 03, `<input type="number">` was initially used for Nigerian phone numbers, causing `08031234567` to be stripped into `8031234567` (`evidence/09-original-input-behaviour.png`). Additionally, hiding the submit button when inputs were invalid left users confused (`evidence/13-button-hidden-version.png`), requiring a redesign where the button remains visible by default and disabled with helper text.

---

## Section 5: Migrations, Schema Design, and Email Delivery

### 1. Concept
Database schema evolution requires controlled, forward-only migrations that expand tables safely. Asynchronous job queues (`EmailJob`) decouple user registration HTTP requests from blocking third-party network calls.

### 2. Purpose
Prevents **database downtime, table locks, and request timeouts caused by slow external SMTP connections**.

### 3. Scenario
During peak registration hours in Lagos, external SMTP servers (e.g. Google or AWS SES) experience TLS handshake latency (2–4 seconds). If the registration endpoint awaits the email send synchronously, the user's browser hangs on a loading spinner, triggering duplicate clicks and dropped connections.

### 4. Implementation
1. **Expand -> Backfill -> Contract:** Adding a non-nullable column to a populated table is performed across three safe steps: add column as nullable $\rightarrow$ backfill existing rows $\rightarrow$ apply non-null constraint.
2. **Background Job Queuing:** The user and verification code are created in a single database transaction, an `EmailJob` row is queued, and the HTTP 201 response returns immediately (551 ms vs. 2,839 ms sync SMTP):
   ```typescript
   await queueEmailJob({ userId, toEmail, subject, templateType, payloadJson });
   setImmediate(() => processPendingEmailJobs(transporter));
   ```

### 5. Failure
Running `ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL;` on a populated database instantly triggers PostgreSQL Error 23502 (null value in column violates not-null constraint), failing the deployment and locking the table.

### 6. Personal Mistake
In Task 04, adding a required column in a single migration step on an active database caused immediate failure (`evidence/04-required-column-failure.txt`). Furthermore, background Prisma Studio held an open file lock on `query_engine-windows.dll.node`, causing `EPERM: operation not permitted, rename` during `prisma generate` until the background process was cleanly halted.

---

## Section 6: Server-Side Validation, Password Hashing, Rate Limiting, and Verification

### 1. Concept
The server is an adversarial request boundary. All inputs must be re-validated with Zod, passwords hashed with RFC 9106 Argon2id, endpoints throttled via sliding-window rate limiting, and verification codes generated using cryptographically secure pseudorandom number generators (CSPRNG).

### 2. Purpose
Prevents **bypasses via direct CLI curl attacks, credential stuffing, rainbow table attacks, and brute-force OTP guessing**.

### 3. Scenario
An attacker discovers Swash's `POST /api/auth` endpoint and uses an automated script to submit 10,000 requests per minute with compromised credentials from an external data breach.

### 4. Implementation
1. **Argon2id:** Uses memory-hard parameters (`m=19456 KiB, t=2, p=1`), resulting in ~23.25 ms host execution time, increasing attacker cracking costs **20,459x** over SHA-256.
2. **Zod Validation:** Blocks invalid payloads at the network boundary with HTTP 422.
3. **HaveIBeenPwned Range API:** Uses $k$-anonymity (5-character SHA-1 prefix) to reject breached passwords without exposing customer credentials to third parties.
4. **Rate Limiting:** Sliding-window limiter allows max 5 requests per 15 minutes, returning HTTP 429 with `Retry-After`.
5. **CSPRNG Verification:** Codes generated with `crypto.randomInt(100000, 1000000)`, stored as SHA-256 hashes, with 15-minute expiry and max 5 attempts.

### 5. Failure
Using fast hashes like MD5 or SHA-256 allows modern GPUs to compute billions of guesses per second. In verification codes, failing to enforce single-use atomic consumption (`usedAt`) allows intercepted codes to be replayed indefinitely.

### 6. Personal Mistake
In Task 04, an early verification logic check evaluated code hash equality *before* checking code expiry. An expired code that was mistyped returned "Wrong code" instead of "Code expired", confusing the user. Additionally, exposing "6-digit" length hints in UI placeholders leaked keyspace boundaries, requiring complete removal of length constraints from user-facing copy.

---

## Section 7: Sessions, Logout, Account Deletion, and Compliance

### 1. Concept
Session management requires generating 256-bit cryptographic bearer tokens, storing only their SHA-256 digests in PostgreSQL, transmitting them via `HttpOnly`, `SameSite=Lax` cookies, and implementing NDPA-compliant account deletion as an idempotent, multi-stage process (soft delete $\rightarrow$ grace period $\rightarrow$ hard purge/anonymization).

### 2. Purpose
Prevents **session hijacking via XSS/database leaks, zombie sessions surviving logout, and criminal violations of Nigerian tax record-keeping laws**.

### 3. Scenario
A customer uses Swash at a cybercafe or shared workstation in Lagos, clicks "Log Out" on an unreliable connection, and leaves. If the application only clears the cookie locally without server-side invalidation, an attacker can restore the cookie from browser cache and hijack the customer's account.

### 4. Implementation
1. **Hashed Sessions:** `createSession()` generates a 32-byte hex token. The browser receives the token in a cookie; PostgreSQL stores only `tokenHash = SHA256(rawToken)`. Even a total database leak yields zero replayable session cookies.
2. **Server-Side Invalidation:** `POST /api/auth/logout` sets `revokedAt = new Date()` in PostgreSQL and clears the cookie.
3. **Password Reset Revocation:** Resetting a password invokes `revokeAllUserSessions(userId)`, killing all sessions across all devices.
4. **14-Day Deletion Grace Period:** Account is immediately locked. The scheduled deletion job purges PII while preserving anonymized sales receipts for 6 years (CAMA 2020 s. 375).

### 5. Failure
Promising "instant, total destruction of all database rows within 10 seconds" violates Nigerian financial law. A registered business that erases sales receipts and payment references cannot defend against tax evasion audits or card chargebacks.

### 6. Personal Mistake
In Task 05, draft privacy documentation promised "all records across live databases and all backups are destroyed within 10 seconds," which contradicted the 14-day operational grace period, backup rotation mechanics, and CAMA 2020 statutory obligations. This was captured in `docs/privacy-draft-with-broken-promise.md` and corrected in root `privacy.md`. Furthermore, standalone Node ESM scripts failed when resolving Next.js path aliases (`@/lib/prisma`), requiring an adaptive runtime resolver in `src/lib/deletion-job.ts`.

