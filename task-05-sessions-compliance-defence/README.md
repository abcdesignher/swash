# Task 05 — Sessions, Account Deletion, Compliance and Defence

This directory contains the documentation, architectural justifications, compliance records, and verifiable evidence for **Task 05 (Sessions, Account Deletion, Compliance and Defence)** of the Swash subscription laundry platform.

---

## Directory Structure

```text
task-05-sessions-compliance-defence/
├── README.md
├── docs/
│   ├── sessions.md                           # Cryptographic session architecture, hashing, and hijacking defence
│   ├── gating.md                             # Soft gating vs hard gating evaluation and business trade-offs
│   ├── retention-matrix.md                   # Full database retention matrix, CAMA 2020 & NDPA 2023 compliance
│   ├── state-management.md                   # React Server Components + AuthContext evaluation & boundary thresholds
│   ├── interview-with-owner.md               # Real laundry operator primary research framework & brief analysis
│   ├── handbook.md                           # 7-section technical engineering handbook with verifiable mistakes
│   ├── what-i-do-not-know.md                 # 8 specific architectural knowledge gaps and investigation plan
│   ├── privacy-draft-with-broken-promise.md  # Unedited privacy draft, broken promise analysis, and correction
│   ├── defects.md                            # Real defects encountered in Task 05, root causes, and fixes
│   └── interview-answers.md                  # 22 viva examination answers (<= 200 words each)
└── evidence/
    ├── 01-two-session-ids.txt                # Cryptographic proof: two logins yield distinct IDs, tokens, and hashes
    ├── 02-cookie-flags.png                   # Browser DevTools inspection of HttpOnly, SameSite, and Max-Age flags
    ├── 03-soft-gating-flow.png               # Customer portal rendering non-blocking email verification banner
    ├── 04-hard-gating-flow.png               # Unverified customer hard-gating barrier / verification redirect
    ├── 05-generic-errors-both-cases.png      # Identical generic 401 error for unknown email vs incorrect password
    ├── 06-two-users-one-browser.txt          # Multi-user isolation proof: no identity cross-contamination
    ├── 07-session-row-present.png            # Prisma Studio database inspection showing active Session record
    ├── 08-session-row-deleted.png            # Prisma Studio database inspection showing revoked Session record
    ├── 09-logout-network-failure.txt         # Capturing flawed client-only logout vs active server session
    ├── 10-logout-edge-case-fixed.txt         # Server-authoritative confirmation and database revocation proof
    ├── 11-reset-kills-other-session.png      # Password reset invalidating concurrent session across devices
    ├── 12-deletion-request-locks-account.png # Account locking and 14-day grace period notice in dashboard
    ├── 13-scheduled-job-run-one.txt          # Scheduled deletion job execution: hard-delete and PII anonymization
    ├── 14-scheduled-job-run-two.txt          # Scheduled deletion job execution: zero re-execution (idempotence proof)
    ├── 15-state-management-working.png       # Reactive header state update (Sign Out / Account) via AuthContext
    └── 16-admin-route-refused.png            # Access Refused — 403 Forbidden for ordinary customer on /admin
```

---

## Key Technical Achievements

1. **Cryptographically Secure Server Sessions:**
   - 256-bit CSPRNG bearer tokens (`crypto.randomBytes(32)`).
   - Only SHA-256 digests (`tokenHash`) stored in PostgreSQL, guaranteeing zero token replay even during a database breach.
   - Defensive cookie flags enforced: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=604800` (7 days).
2. **Registration Gating Architecture:**
   - Evaluated and implemented **Soft Gating** to eliminate Nigerian cellular/SMTP latency drop-offs, while providing progressive security boundaries.
3. **Robust Server-Authoritative Logout:**
   - Formally reproduced the logout network failure vulnerability (`09-logout-network-failure.txt`).
   - Enforced server confirmation and database `revokedAt` tracking (`10-logout-edge-case-fixed.txt`).
4. **Global Session Revocation on Password Reset:**
   - Password reset immediately terminates all concurrent active sessions across all devices via `revokeAllUserSessions()`.
5. **Repeat-Safe (Idempotent) Account Deletion:**
   - Multi-stage lifecycle: Immediate account locking $\rightarrow$ 14-day grace period $\rightarrow$ automated scheduled purge.
   - Statutory compliance with Nigeria's **CAMA 2020 (s. 375)** and **NDPA 2023 (s. 34)**: Sales receipts preserved for 6-year tax audits while PII is irreversibly anonymized.
   - Proven mathematical idempotence across consecutive job runs (`13-scheduled-job-run-one.txt` and `14-scheduled-job-run-two.txt`).
6. **Server-Enforced Role-Based Access Control (RBAC):**
   - Ordinary customers navigating to `/admin` or calling admin APIs are strictly refused with **HTTP 403 Forbidden**.
7. **Zero-Dependency Reactive State Management:**
   - Implemented `AuthContext` with React primitives, providing instantaneous header synchronization without bloated external libraries.

