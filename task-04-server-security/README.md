# Task 04 — Server-Side Security and Data Integrity

This directory contains the documentation, architectural justifications, and verifiable evidence for **Task 04 (Server-Side Security and Data Integrity)** of the Swash subscription laundry platform.

---

## Directory Structure

```text
task-04-server-security/
├── README.md
├── docs/
│   ├── schema.md                  # Relational schema design, indexes, and snapshot justifications
│   ├── migrations.md              # Migration strategy, baseline, and drift recovery
│   ├── hashing.md                 # Argon2id vs SHA-256 benchmark and mathematical analysis
│   ├── validation-placement.md    # Zod schema placement, request boundary, and timing impact
│   ├── rate-limiting.md           # Sliding-window rate limiter, IP rotation flaws, and CGNAT impact
│   ├── breach-check.md            # Privacy-preserving k-Anonymity HIBP password verification
│   ├── verification-design.md     # 6-digit CSPRNG verification, expiry, single-use, and EmailJob queue
│   ├── email-copy.md              # Swash brand design tokens, email copy review, and pre-production checks
│   ├── not-implemented.md         # Four deliberately omitted security controls with justifications
│   ├── defects.md                 # Real defects encountered, root cause analysis, and fixes
│   └── interview-answers.md       # 19 interview preparation answers (<= 200 words each)
└── evidence/
    ├── 01-schema-drawing.jpg                 # Hand-sketched pencil relational schema diagram
    ├── 02-database-state-before.png          # Prisma Studio database inspection before Task 04 migrations
    ├── 02b-database-state-after.png          # Prisma Studio database inspection after core migrations
    ├── 03-initial-migration.txt              # Task 04 initial migration output and schema baseline
    ├── 04-required-column-failure.txt        # Single-step required column migration failure (Postgres 23502)
    ├── 05-required-column-three-steps.txt    # 3-step Expand -> Backfill -> Contract resolution
    ├── 06-drift-error.txt                    # Deliberate schema drift reproduction (P2022) and resolution
    ├── 07-hash-twice-different.txt           # Argon2id hashing same password twice with different salts
    ├── 08-timing-argon-vs-sha.txt            # Argon2id (~23 ms) vs SHA-256 (~1.1 us) on host machine
    ├── 09-email-case-normalised.png          # Database inspection showing lowercase email normalisation
    ├── 10-password-trim-working.png          # Successful login with leading/trailing password whitespace
    ├── 10b-password-case-still-enforced.png  # Rejection when password letter casing is modified
    ├── 11-validation-timing.txt              # Latency comparison before and after server-side Zod validation
    ├── 12-direct-request-before-and-after.txt# Replaying Task 03 curl bypass request (201 -> 422 rejection)
    ├── 13-rate-limit-triggered.png           # UI error banner after exceeding 5-attempt rate limit (HTTP 429)
    ├── 14-rate-limit-defeated.txt            # Defeating IP-only rate limit via X-Forwarded-For rotation
    ├── 15-breach-check-rejection.png         # UI rejection banner for breached password (Password123!)
    ├── 16-smtp-failure.txt                   # Unconfigured/unreachable SMTP connection failure output
    ├── 17-smtp-success.txt                   # Verified SMTP transport and test email delivery (Ethereal)
    ├── 18-registration-timing-sync-vs-job.txt# Registration timing: Sync SMTP (2,839 ms) vs EmailJob (551 ms)
    ├── 19-verification-row.png               # Prisma Studio showing VerificationCode and EmailJob records
    ├── 20-verification-expired.png           # UI rejection banner for expired 6-digit verification code
    ├── 21-verification-wrong-code.png        # UI rejection banner for incorrect 6-digit verification code
    ├── 22-verification-code-reused.png       # UI rejection banner for already-consumed verification code
    └── 23-rendered-email.png                 # Browser capture of Swash-branded HTML verification email
```

---

## Key Technical Achievements

1. **Relational Data Integrity:**
   - 9 models implemented in PostgreSQL via Prisma (`User`, `Session`, `VerificationCode`, `Subscription`, `LaundryOrder`, `Payment`, `PaymentAttempt`, `KnowledgeChunk`, `EmailJob`).
   - `PaymentAttempt` and `Payment` separated to preserve immutable financial ledgers while capturing interrupted payment gateway attempts.
2. **Controlled Zero-Downtime Migrations:**
   - Baselined existing Task 02 `ServiceEnquiry` records without data loss.
   - Demonstrated and documented the Expand -> Backfill -> Contract migration pattern to prevent table locks and null-value constraint violations on populated tables.
3. **Argon2id Password Security:**
   - Implemented RFC 9106 Argon2id (`m=19456, t=2, p=1`), verified unique salting per hash, and proved a **20,459x** attacker cost increase over fast hashes like SHA-256.
4. **Defense in Depth & Request Boundary Validation:**
   - Re-implemented all client-side rules on the server via Zod (`src/lib/validation.ts`).
   - Verified that direct CLI `curl` requests bypassing the UI are strictly rejected with HTTP 422.
   - Normalised emails to lowercase while preserving password case and trimming edge whitespace.
5. **Sliding-Window Rate Limiting & Breach Prevention:**
   - Throttled auth endpoints to 5 attempts per 15 minutes, returning HTTP 429 with `Retry-After`.
   - Demonstrated the vulnerability of IP-only rate limiting to proxy rotation (`14-rate-limit-defeated.txt`).
   - Integrated privacy-preserving $k$-Anonymity checks via HaveIBeenPwned range API.
6. **Asynchronous Background Email Delivery:**
   - Proved that queuing verification emails in `EmailJob` is **5.2x faster** than blocking user registration requests on external SMTP TLS handshakes.

