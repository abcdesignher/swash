# Rate Limiting Architecture & Evaluation (Task 04, Step 8)

## 1. Scope & Applied Endpoints

Rate limiting is applied at the application boundary in [`src/app/api/auth/route.ts`](../../src/app/api/auth/route.ts) using the sliding-window limiter in [`src/lib/rate-limit.ts`](../../src/lib/rate-limit.ts):

| Operation | Window | Threshold | Key Composition | Action on Exceeded |
|---|---|---|---|---|
| **Registration (`register`)** | 15 minutes (900 s) | 5 requests | `ip:register` | HTTP 429 + `Retry-After` header |
| **Login (`login`)** | 15 minutes (900 s) | 5 attempts | `ip:login` | HTTP 429 + `Retry-After` header |
| **Password Reset (`passwordReset`)** | 15 minutes (900 s) | 3 requests | `ip:passwordReset` | HTTP 429 + `Retry-After` header |

---

## 2. Threshold & Window Justification

- **Registration (5 / 15 min):** A legitimate Nigerian professional creates an account once. Five attempts within 15 minutes comfortably accommodate typos, connection retries on unstable mobile networks, or registering a colleague, while throttling automated bot account creation and email-flooding attacks.
- **Login (5 / 15 min):** Password guessing via brute-force or credential stuffing is constrained to 5 attempts per window. Because Argon2id costs ~23 ms of CPU per verification, limiting sustained request rates prevents resource exhaustion denial-of-service (DoS) against the Node.js event loop.
- **Password Reset (3 / 15 min):** Prevents abuse of outbound SMTP transactional quotas and protects users from mailbox harassment.

---

## 3. Storage Mechanism & Trade-offs

- **Selected Mechanism:** In-memory sliding-window log (`Map<string, RateLimitRecord>`) inside the Node.js runtime process, with automatic eviction intervals (every 5 minutes) to prune timestamps older than 1 hour.
- **Where counters are stored:** In the heap memory of the active Node.js server process.
- **What happens after a restart:** Because counters reside solely in process memory, restarting the server or deploying a new build completely resets all rate-limit counters to zero.
- **Distributed & Multi-instance Limitations:** In a multi-replica or serverless deployment (e.g. AWS ECS across multiple availability zones or Vercel serverless functions), each instance maintains an isolated memory space. An attacker whose requests are load-balanced across $N$ instances effectively receives $N \times 5$ attempts before being blocked.
- **Trade-off Justification:** In-memory tracking introduces **zero external latency** (< 0.1 ms check time), requires **zero external infrastructure** (no external Redis cluster or paid Redis subscription), and avoids database write-amplification on failed attacks. For production scale across multiple server instances, migrating the backing store to Redis via Upstash or Valkey using an atomic sliding-window Lua script or Redis Cell would provide cross-instance persistence.

---

## 4. Why IP-Only Limits Are Insufficient

Relying solely on client IP addresses suffers from two fundamental flaws demonstrated empirically in [`14-rate-limit-defeated.txt`](../evidence/14-rate-limit-defeated.txt):

1. **Spoofing and IP Rotation:**
   - Attackers using botnets, residential proxy pools, mobile 4G/5G reconnects (which rotate carrier dynamic IPs), or spoofed upstream headers can rotate their source IP on every request.
   - As demonstrated in our test, sending requests with rotated `X-Forwarded-For` IPs completely bypassed the 5-attempt limit, achieving 100% throughput without triggering HTTP 429.
2. **Reverse Proxy Trust Boundaries:**
   - If an application server blindly trusts `X-Forwarded-For` without validating that the connection came from an authenticated, trusted reverse proxy (e.g. Cloudflare, AWS ALB), an attacker can inject arbitrary IP strings directly into HTTP request headers.

---

## 5. What Happens to Legitimate Users Sharing a Connection (CGNAT & Campus Wi-Fi)

In Nigeria, mobile telecom operators (MTN, Airtel, Glo, 9mobile) and office/campus networks extensively employ **Carrier-Grade NAT (CGNAT)**:
- Thousands of distinct mobile subscribers or co-working office desks in Lagos share a tiny pool of public IPv4 addresses.
- If rate limiting is strictly IP-only, **one abusive user or bot running on an office Wi-Fi network can trigger the 5-attempt threshold, immediately locking out every other legitimate Swash customer in that entire office building or university campus for 15 minutes.**

---

## 6. Recommended Multi-Identifier Strategy

To protect against automated attacks without punishing shared-IP legitimate customers, production rate limiting must combine:

1. **Compound Keys:** Limit by `IP + target_email` for credential stuffing, so an attack on `userA` does not lock out `userB` from the same office IP.
2. **Global Velocity vs. Per-Account Velocity:** Allow higher aggregate IP limits (e.g. 100 requests/min per IP across all accounts) paired with tight per-target-account limits (5 attempts/15 min per email address).
3. **Progressive Challenges:** After 3 failed attempts, require CAPTCHA (e.g. Cloudflare Turnstile) or proof-of-work before accepting further attempts, rather than abruptly returning hard HTTP 429 blocks to potential office mates.
4. **Proxy Header Hardening:** Configure the cloud edge / web server (Nginx/Cloudflare) to strip untrusted `X-Forwarded-For` headers and set a verified `CF-Connecting-IP` or strictly append the real TCP socket address.

