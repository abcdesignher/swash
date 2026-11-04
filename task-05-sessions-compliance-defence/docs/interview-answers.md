  # Task 05 Interview Preparation Answers

This document provides concise, rigorous answers to all 22 viva examination questions for Task 05, with each answer strictly under 200 words.

---

### Sessions

#### 1. What should a secure browser session look like?
A secure browser session consists of an ambient, high-entropy bearer token (at least 128 to 256 bits of cryptographic randomness) generated via a CSPRNG (`crypto.randomBytes(32)`). The server stores only a one-way cryptographic digest of the token (e.g. SHA-256 `tokenHash`) alongside expiration timestamps, user linkage, and revocation flags. The browser receives the token exclusively via an HTTP response `Set-Cookie` header configured with `HttpOnly` (blocking JavaScript XSS theft), `Secure` (forcing TLS/HTTPS transmission), and `SameSite=Lax` or `Strict` (preventing CSRF). The session identifier must be rotated upon privilege changes (e.g. login) and feature a bounded lifetime (e.g. 7 days).

#### 2. What is session fixation?
Session fixation is an attack where an adversary forces or tricks a victim into using a known, pre-allocated session identifier. Once the victim authenticates using that identifier, the attacker uses their copy of the token to hijack the authenticated session. Defending against session fixation requires generating a completely fresh session identifier upon successful credential verification (`POST /api/auth`) and immediately invalidating any pre-authentication guest sessions. In Swash, every login invokes `createSession()`, issuing a newly generated 32-byte CSPRNG token and storing a new hash row in PostgreSQL.

#### 3. Are tokens better than server-side sessions?
Neither is universally superior; each entails distinct trade-offs. Stateless JWT tokens store claims client-side, eliminating database lookups on every request, which simplifies horizontal microservice scaling. However, stateless tokens cannot be revoked instantly without maintaining a server-side revocation blocklist, effectively reintroducing state. In contrast, database-backed server sessions (like Swash's `Session` model) require a fast database or cache lookup on protected routes, but provide absolute server authority: sessions can be revoked instantly upon logout, password reset, or account compromise. For high-integrity transactional laundry services, server-authoritative sessions provide superior security control.

#### 4. How would you implement logout from all devices?
Logout from all devices requires server-side session invalidation. In Swash's data model, the `Session` table links multiple active session rows to a single `userId`. To terminate all devices, the server executes:
```prisma
await prisma.session.updateMany({
  where: { userId, revokedAt: null },
  data: { revokedAt: new Date() }
});
```
Any subsequent request from any device presenting an existing session cookie will find `revokedAt !== null` during `validateSession()` and be rejected with HTTP 401 Unauthorized, requiring a fresh login across all clients.

#### 5. How do you invalidate sessions after a password change?
When a password is changed or reset (`POST /api/account/password-reset`), the server verifies the new password, updates `User.passwordHash` via Argon2id, and immediately invokes `revokeAllUserSessions(user.id)`. This sets `revokedAt = new Date()` across every active session row for that user in PostgreSQL. The response clears the current client's session cookie via `Max-Age=0`. If an adversary had intercepted a session token on another device, that token becomes permanently dead the instant the legitimate user resets their password.

#### 6. What do HttpOnly, Secure, and SameSite cookie flags protect against?
- **`HttpOnly`:** Prohibits client-side scripts from accessing the cookie via `document.cookie`, mitigating credential theft via Cross-Site Scripting (XSS).
- **`Secure`:** Restricts cookie transmission exclusively to encrypted HTTPS connections, preventing plaintext interception by network eavesdroppers on public or unencrypted Wi-Fi networks.
- **`SameSite=Lax`:** Instructs browsers not to attach the cookie on cross-site sub-requests (such as embedded `<img>`, `<iframe>`, or third-party `POST` forms), mitigating Cross-Site Request Forgery (CSRF) while supporting normal top-level link navigation.

#### 7. What is the difference between HTTP 401 and 403?
- **HTTP 401 Unauthorized:** Indicates a lack of valid authentication credentials. The user is unauthenticated or their session has expired/revoked. The client can retry the request by providing valid credentials (e.g. logging in).
- **HTTP 403 Forbidden:** Indicates an authorization failure. The server recognizes the user's authenticated identity, but the account lacks sufficient permissions to access the requested resource. For example, an ordinary Swash customer accessing `/admin` or executing `POST /api/admin/run-deletion-job` is authenticated, but refused access with HTTP 403.

---

### Your Session Implementation

#### 8. Why must logout be handled on the server?
If logout is handled solely by the client (e.g. deleting a cookie via JavaScript or discarding client state), the session record remains completely active and valid in the database. Any attacker who previously intercepted the token (via network sniffing, malware, or server access logs) can continue to impersonate the user until natural expiration. Server-side logout guarantees that the server permanently invalidates the token in PostgreSQL (`revokedAt = new Date()`), rendering the bearer token useless even if retained by an adversary.

#### 9. What is the difference between authentication and authorisation?
- **Authentication ("Who are you?"):** The process of verifying a claimed identity using credentials, such as verifying an email and Argon2id password hash, checking a verification code, or validating a session cookie.
- **Authorisation ("What are you allowed to do?"):** The process of determining whether an authenticated user has permission to perform a specific action or access a specific route. In Swash, checking `User.role === "ADMIN"` before permitting access to `/admin` is an authorization check.

---

### Compliance

#### 10. Walk through an account deletion request.
1. The authenticated customer submits a deletion request via `POST /api/account/delete`.
2. The server records `User.deletedAt = new Date()`, immediately locking the account.
3. The server calls `revokeAllUserSessions()`, instantly terminating all active sessions across all devices.
4. The client's session cookie is cleared (`Max-Age=0`).
5. A **14-day grace period** begins. During this window, the customer cannot log in, preventing accidental usage while allowing customer support recovery.
6. The automated scheduled deletion job executes after 14 days, permanently purging personal identifiers and anonymizing financial records.

#### 11. Which records would Swash retain after deletion, and why?
Under Section 375 of Nigeria's Companies and Allied Matters Act (CAMA 2020) and Federal Inland Revenue Service (FIRS) rules, Swash is legally mandated to preserve books of account and sales receipts for **at least six (6) years**. Swash retains `Payment.amountKobo`, `Payment.receiptNumber`, `Payment.confirmedAt`, and `LaundryOrder.orderNumber`. However, all Personally Identifiable Information (PII) is irreversibly anonymized: customer names become `Deleted Customer [UUID]`, emails become `deleted_[id]@deleted.swash.ng`, phone numbers become `00000000000`, and delivery addresses are purged.

#### 12. What happens to backups after a deletion request?
Encrypted database snapshots and WAL archives are immutable binary files that cannot be selectively modified without corrupting snapshot integrity. Backups are retained on an automated **30-day lifecycle rotation**, after which they are permanently overwritten and destroyed. If a disaster recovery restoration occurs within that 30-day window, Swash's post-restore protocol runs `runAccountDeletionJob()`, referencing an append-only deletion registry to immediately re-lock and re-purge restored accounts before routing public traffic.

#### 13. What is the difference between anonymisation and deletion?
- **Deletion (Hard Purge):** The physical removal of a database row from disk (e.g. `DELETE FROM "Session" WHERE "userId" = ...`). Once deleted, the data ceases to exist in any form.
- **Anonymisation:** Permanently altering personal data such that the individual can no longer be identified directly or indirectly by any means reasonably likely to be used, while preserving non-personal statistical or accounting attributes (e.g. keeping order totals and timestamps for tax audits while overwriting names and phone numbers with synthetic strings).

---

### Product and Engineering Role

#### 14. Why build operational software rather than only conventional software features?
Conventional software focuses narrowly on customer-facing screens (product catalogs, landing pages). Operational software connects digital interfaces to physical business reality: inventory tracking, dispatch rider logistics, garment care liabilities, payment reconciliations, and tax compliance. Building operational software ensures that when a customer clicks "Order Laundry", physical operations in Lagos (drivers, sorting tags, wash cycles, VAT receipts) execute reliably without human miscommunication or financial leakage.

#### 15. How would you respond to a business owner asking to add AI to their operations?
I would begin by asking what specific operational bottleneck or cost driver they are trying to solve. If the problem is garment tagging errors or missed driver pickups, adding a conversational LLM does not solve the root cause—reliable barcode tracking and driver routing software does. If the problem is high customer support volume answering repetitive questions about fabric care or subscription pricing, a grounded RAG assistant with strict business knowledge boundaries provides measurable ROI. Technology must serve operational outcomes, not hype.

#### 16. What is the difference between RAG and fine-tuning?
- **RAG (Retrieval-Augmented Generation):** Keeps the foundational model frozen and dynamically retrieves verified business documents from a database (`KnowledgeChunk`) at query time, injecting them into the model's prompt context. It allows real-time updates to business rules, provides verifiable source citations, and costs significantly less.
- **Fine-Tuning:** Retrains the underlying neural network weights on a specialized dataset to adapt tone, style, or specific syntax. Fine-tuning does not reliably teach new dynamic facts and is prone to confident hallucinations when business policies change.

#### 17. How do you evaluate an AI agent in production?
AI evaluation requires automated, deterministic benchmarking across three distinct dimensions:
1. **Retrieval Quality (RAG):** Measured via Context Recall and Context Precision (did the vector/keyword search retrieve the exact approved business chunk?).
2. **Generation Quality:** Measured via Groundedness/Faithfulness (is every claim in the response supported by the retrieved context?) and Answer Relevance (does it directly answer the user's query?).
3. **Guardrail Compliance:** Automated regression suites testing whether the agent refuses unauthorized actions, prevents prompt injections, and respects privacy rules without leaking customer records.

---

### State Management

#### 18. How do you choose between local state, context, and an external state manager?
- **Local Component State (`useState`):** Chosen for isolated UI concerns that no other component cares about (e.g. password visibility toggle, modal open/close, inline input typing).
- **React Context (`AuthContext`):** Chosen for low-frequency, globally broadcasted state that affects multiple distinct visual branches (e.g. current user authentication, theme, localized strings).
- **External State Manager (Zustand, Redux):** Chosen only when high-frequency state updates occur across deeply nested components with complex client-side caching, optimistic mutations, or complex state machines. Swash avoided external libraries because Server Components and lightweight Context fully solved all application requirements.

#### 19. How do you handle server state separately from client state?
Server state represents data stored in PostgreSQL (user profiles, orders, allowances). In Next.js App Router, server state is fetched at request time inside React Server Components or Route Handlers via Prisma, benefiting from automatic request deduplication and remaining strictly on the server. Client state represents transient browser UI conditions (form input drafts, tab selections, dropdown toggles) managed in Client Components via `useState` or URL search params. We never duplicate large database records into client state caches.

---

### Your Implementation and Decisions

#### 20. Cite three actual values from Tasks 1–4: one typography value, one password-hashing timing figure, and one rate-limit configuration. Explain each.
1. **Typography Value:** `clamp(1.75rem, 4vw + 1rem, 2.5rem)` with `max-width: 22ch` and `text-wrap: balance` for the main hero heading (`src/app/page.module.css`). It guarantees fluid scaling between 375px mobile screens and desktop monitors without typographic orphans.
2. **Password-Hashing Timing Figure:** **23.25 ms** for RFC 9106 Argon2id (`m=19456 KiB, t=2, p=1`) versus **1.137 µs** for SHA-256 on the host machine (`task-04-server-security/evidence/08-timing-argon-vs-sha.txt`). This proves a **20,459x** attacker cracking cost increase.
3. **Rate-Limit Configuration:** **5 requests per 15 minutes** per client IP sliding window (`AUTH_RATE_LIMITS` in `src/lib/rate-limit.ts`). Exceeding this limit returns HTTP 429 with a calculated `Retry-After` header in seconds.

#### 21. Which decision across the five tasks are you least confident about, and how would you resolve the uncertainty?
I am least confident about relying on an **in-memory sliding-window rate limiter** (`Map<string, number[]>`) in `src/lib/rate-limit.ts`. While it verified successfully on our single Next.js development server, in a production serverless environment (e.g. Vercel Edge or AWS Lambda), requests are distributed across multiple ephemeral worker instances, allowing an attacker to bypass the 5-attempt limit by spreading requests across instances. I would resolve this by migrating the sliding-window storage to an external Upstash Redis instance with atomic Lua scripts.

#### 22. Analyse this claim: "Adding a delete-account button that immediately removes a user row makes the application fully compliant. Backups can be kept for a year in case the data is needed."
This claim is **critically flawed and legally non-compliant** on two major counts:
1. **Immediate User Deletion Violates Nigerian Company Law (CAMA 2020 s. 375):** Removing the user row immediately breaks relational foreign keys on completed orders and payments, or deletes the financial transaction ledger entirely, which violates the statutory mandate to preserve accounting records for 6 years.
2. **One-Year Backup Retention Violates NDPA 2023 Storage Limitation:** Holding identifiable customer data in backup archives for a full year without rotation after an erasure request violates Section 24(1)(d). Compliance requires anonymizing financial records, instituting a 14-day operational grace period, and rotating backup archives within 30 days.

