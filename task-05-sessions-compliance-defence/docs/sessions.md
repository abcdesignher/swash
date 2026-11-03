# Cryptographic Session Architecture and Defense in Depth

This document explains the session management design for Swash, how session identifiers are created, stored, and defended, and how Swash protects customers against session hijacking and unauthorized replay attacks.

---

## 1. What Session Hijacking Is

**Session hijacking** occurs when an adversary steals, intercepts, or predicts a customer's active session token and presents it to the Swash application server to impersonate the customer without possessing their password or undergoing multi-factor verification.

In HTTP web applications, authentication is typically established once during credential submission (e.g. `POST /api/auth`). Because HTTP is a stateless protocol, subsequent requests rely on an ambient bearer credential—most commonly a session identifier transmitted in an HTTP `Cookie` header.

Common session hijacking vectors include:
1. **Cross-Site Scripting (XSS):** Malicious client-side JavaScript executing in the user's browser reads `document.cookie` and transmits active tokens to an attacker-controlled endpoint.
2. **Network Interception (Man-in-the-Middle):** Eavesdroppers on unencrypted networks (e.g., public Wi-Fi in Lagos cafes) intercept plain HTTP headers containing cleartext cookies.
3. **Cross-Site Request Forgery (CSRF):** A malicious third-party site tricks the user's browser into submitting state-changing requests to Swash while ambient session cookies are automatically attached.
4. **Session Fixation:** An attacker tricks a victim into authenticating using a pre-allocated session identifier known to the attacker.
5. **Database Leakage:** An adversary compromises a database snapshot or SQL backup containing cleartext session tokens, allowing them to forge active sessions without compromising individual user passwords.

---

## 2. How a Stolen Session Identifier Could Be Abused in Swash

If an attacker captures an active Swash session token, they inherit the customer's authenticated context. In the Swash laundry subscription service, an abused session would enable an attacker to:

1. **Expose Sensitive Personal Data (NDPA 2023 Violation):** View the customer's full name, registered Nigerian mobile telephone number, Lagos pickup and delivery addresses, subscription plan allowance, and past transaction records.
2. **Manipulate Laundry Operations:** Place fraudulent pickup orders, redirect clean laundry delivery to an unverified address, or cancel valid scheduled collections, directly disrupting dispatch riders and physical laundry processing.
3. **Exhaust Subscription Allowances:** Deplete monthly item quotas (e.g., booking items against an Individual or Family subscription plan allowance) without the account owner's consent.
4. **Initiate Fraudulent Payment Attempts:** Authorize pay-as-you-go laundry runs or alter delivery instructions.
5. **Account Takeover Pivot:** Request account profile alterations or initiate password reset and deletion workflows.

---

## 3. What Logout Actually Does

In insecure applications, "logout" frequently consists only of client-side operations: deleting a cookie in the user's browser or clearing a token from `localStorage`. In such implementations, the session identifier remains completely valid on the server, allowing an attacker who previously intercepted the token to continue using it until it naturally expires.

In Swash, logout is strictly a **two-phase, server-authoritative invalidation process**:

1. **Server-Side Session Revocation:**
   - The browser issues an authenticated `POST /api/auth/logout` request.
   - The server extracts the raw token from the incoming `swash_session` cookie, computes its SHA-256 digest (`tokenHash`), and updates PostgreSQL:
     ```prisma
     await prisma.session.updateMany({
       where: { tokenHash, revokedAt: null },
       data: { revokedAt: new Date() }
     });
     ```
   - The session row is permanently revoked on the server. Any subsequent request presenting this token is immediately rejected with HTTP `401 Unauthorized`.

2. **Client-Side Cookie Destruction:**
   - The server attaches an expired `Set-Cookie` header in its HTTP response:
     ```http
     Set-Cookie: swash_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax; Secure
     ```
   - The browser purges the cookie from its local jar, ensuring that neither the client nor subsequent users of a shared computer can access the prior session.

---

## 4. How Swash Limits the Impact of a Stolen Session

Swash implements defense-in-depth across the cryptographic, storage, transport, and operational layers:

### A. Cryptographically Secure Token Generation
- Tokens are generated using Node.js `node:crypto.randomBytes(32)` providing 256 bits of entropy.
- The token space ($2^{256} \approx 1.15 \times 10^{77}$) is astronomically large, making brute-force guessing or prediction computationally impossible.

### B. Hashed Representation in PostgreSQL (`tokenHash`)
- Swash **never stores plain bearer tokens in PostgreSQL**.
- When `createSession()` runs, the plain 32-byte hex string is passed to the browser in the cookie, while only its deterministic SHA-256 digest (`tokenHash`) is saved in the database:
  $$\text{tokenHash} = \text{SHA-256}(\text{rawToken})$$
- If Swash's database or read-replica is breached, the attacker only acquires one-way SHA-256 digests. Because SHA-256 is non-invertible, the attacker cannot reverse the hashes into valid session cookies to hijack customer accounts.

### C. Defensive Cookie Security Flags
The session cookie is configured with four mandatory defensive attributes:
- **`HttpOnly`:** Prohibits client-side scripts from reading the cookie via `document.cookie`. Even if an XSS vulnerability exists on the client, the attacker's script cannot extract the session cookie.
- **`Secure`:** Enforces transmission exclusively over TLS/HTTPS in production, preventing interception over unencrypted networks.
- **`SameSite=Lax`:** Instructs the browser not to attach the cookie on cross-site sub-requests (such as `<img>`, `<iframe>`, or cross-site `POST` forms), mitigating Cross-Site Request Forgery (CSRF).
- **`Path=/`:** Restricts cookie scope to the root application hierarchy.
- **`Max-Age=604800` (7 Days):** Enforces finite session lifetimes. Abandoned sessions expire automatically after 7 days without requiring manual cleanup.

### D. Global Invalidation on Credential & State Changes
- **Password Reset:** Changing or resetting an account password triggers `revokeAllUserSessions(userId)`, revoking every active session across all devices. An attacker possessing a previously intercepted token is instantly severed.
- **Account Deletion / Soft Delete:** When a customer requests account deletion (`deletedAt !== null`), all sessions are revoked immediately, preventing any further requests under that account.

### E. Telemetry and IP/User-Agent Binding
- Every session records `ipAddress` and `userAgent` at creation.
- Security auditing routines compare request metadata against session origins, enabling anomaly detection and prompt revocation when an active session suddenly appears from an unfamiliar subnet.

