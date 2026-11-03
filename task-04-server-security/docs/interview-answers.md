# Task 04 Interview Preparation Answers

Answers to all nineteen questions from the build guide. Each response is under 200 words.

---

### Password Hashing

#### 1. Why should passwords be hashed?
Passwords must be hashed using a one-way cryptographic function so that the original plaintext secret cannot be recovered if the database is breached, backed up, or intercepted. Hashing protects users who reuse passwords across multiple services from credential-stuffing attacks and fulfills legal data protection duties (e.g. NDPA 2023).

#### 2. Why use bcrypt or Argon2id instead of SHA-256?
SHA-256 is a general-purpose cryptographic hash designed for high-throughput data integrity, allowing modern GPUs to compute billions of guesses per second. Argon2id and bcrypt are adaptive, memory-hard password-hashing functions designed to be computationally expensive and resistant to parallel hardware acceleration (ASICs/GPUs), drastically driving up attacker costs.

#### 3. What is a salt?
A salt is a cryptographically random byte sequence generated uniquely for each password before hashing and stored alongside the resulting hash. It ensures that two users with identical passwords have completely different hashes, neutralizing precomputed rainbow-table lookups and forcing attackers to crack each password individually.

#### 4. What work factor did you choose and why?
Following RULES.md, we configured Argon2id with `memoryCost: 19456 KiB` (19 MiB), `timeCost: 2`, and `parallelism: 1`. On our machine, this produces a ~23 ms hash duration. This satisfies the sweet spot: sufficiently slow to throttle offline brute force while remaining imperceptible to interactive customer logins.

#### 5. Why are plaintext storage, SHA-256, and reversible encryption unsuitable for password storage?
Plaintext exposes secrets immediately upon any breach or SQL injection. SHA-256 is computed in nanoseconds on commodity GPUs, rendering leaked hashes trivial to invert. Reversible encryption relies on a decryption key; once an attacker compromises the server or environment secrets, all customer passwords can be decrypted simultaneously.

---

### Validation

#### 6. Why is client-side validation insufficient?
The client environment is entirely under user control. Attackers can bypass HTML5 form constraints and JavaScript checks by using curl, Postman, custom scripts, or browser developer tools. Client validation provides user convenience and immediate UI feedback, but only server-side validation guarantees security boundaries.

#### 7. What security checks belong in the frontend and backend?
The frontend handles immediate format feedback, input masking, and field guidance to assist user completion. The backend must enforce all validation rules: input type safety, string length caps, regex pattern matching, business policy adherence, permission authorization, duplicate prevention, and cryptographic password checks.

#### 8. Is hiding an administrative action enough to secure it?
No. Security through obscurity violates foundational engineering principles. An attacker can discover hidden routes, API endpoints, or UI buttons through reverse-engineering, network inspection, or directory brute-forcing. Every endpoint must independently authenticate identity and verify server-side authorization roles before executing actions.

#### 9. What is the difference between validation, encoding, and sanitisation?
Validation verifies that input strictly complies with expected rules, rejecting non-conforming data. Encoding transforms characters into an alternate safe representation for a target context (e.g. HTML entity encoding `&lt;` to prevent XSS). Sanitisation alters or strips unsafe tokens (e.g. removing `<script>` tags from rich-text HTML).

#### 10. Why use parsed and validated request data?
Using raw unvalidated request payloads exposes applications to mass assignment vulnerabilities, SQL injection, prototype pollution, and type confusion. Using Zod-parsed output (`parsed.data`) guarantees that only explicitly defined, type-safe, normalised fields reach sensitive downstream database queries and business logic.

#### 11. Why validate route parameters and query strings?
Route parameters (e.g. `/orders/[id]`) and query parameters originate directly from untrusted HTTP URLs. Failing to validate them exposes systems to path traversal, parameter tampering, unauthorized object access (IDOR), SQL/NoSQL injection, and unhandled server runtime exceptions.

---

### Rate Limiting

#### 12. How do you rate-limit unauthenticated requests?
Unauthenticated endpoints (registration, login, password reset) are rate-limited by tracking client IP addresses (`x-forwarded-for` / socket address) and compound keys (`IP + email`). Counters track attempt frequency over sliding time windows (e.g. 5 requests per 15 minutes), returning HTTP 429 when breached.

#### 13. What is the boundary burst problem?
In fixed-window rate limiters, time is divided into static buckets (e.g. 12:00–12:01). An attacker can send the maximum allowed requests at 12:00:59 and another burst at 12:01:01, achieving double the intended limit across a two-second window. Sliding-window logs eliminate this vulnerability.

#### 14. Why use shared storage for rate-limit counters?
In-memory counters reside solely in a single process. In multi-instance or serverless cloud environments, requests are load-balanced across multiple nodes, allowing attackers to multiply their attempt budget by the number of instances. Shared stores (e.g. Redis) provide atomic, synchronized tracking across all instances.

#### 15. What status code should a rate limiter return?
HTTP 429 Too Many Requests. It should be accompanied by a `Retry-After` response header specifying the number of seconds the client must wait before making another request, enabling clients and browsers to handle backoff gracefully.

#### 16. Should the application fail open or closed when the rate-limit store is unavailable?
For public customer-facing applications like Swash, the standard recommendation is to fail open while alerting ops. Failing closed causes a total denial-of-service outage for all legitimate users whenever Redis or the rate-limit service experiences transient downtime.

---

### Your Implementation

#### 17. What do your actual password-hashing measurements mean?
On our development machine (Intel i5-1345U), Argon2id took an average of 23.25 ms per hash (~43 guesses/second on one core), whereas SHA-256 took 1,137 ns (~879,825 guesses/second). SHA-256 is approximately 20,459× faster to guess against. Exhausting a 6-character space takes 41 minutes with SHA-256 versus ~586 days with Argon2id.

#### 18. How does the breached-password check avoid transmitting the password?
We use $k$-Anonymity. The server computes the SHA-1 hash of the password locally, extracts the first 5 hexadecimal characters, and sends only this 5-character prefix to Have I Been Pwned. The remote API returns a list of matching hash suffixes; Swash performs the comparison locally. The complete password never leaves the server.

#### 19. Why is salted SHA-256 with IP-only rate limiting still insufficient?
Salted SHA-256 remains vulnerable to ultra-fast offline GPU cracking (billions of hashes/sec per card) if the database is exfiltrated. Furthermore, as demonstrated in our evidence (`14-rate-limit-defeated.txt`), IP-only rate limiting is easily bypassed by rotating proxy IPs, botnets, or mobile carrier IP pools.

