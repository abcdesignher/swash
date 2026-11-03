# Email Verification & Background Delivery Architecture (Task 04, Step 10)

## 1. Security Architecture & Threat Model

Email verification confirms that a registering customer genuinely owns and controls their declared email address before their Swash subscription is activated.

Unverified email registration introduces critical operational and legal risks for Swash:
- **Misdirected Communications:** Invoices, payment receipts, and collection notices containing personal addresses and phone numbers could be delivered to an innocent third party (violating NDPA 2023).
- **Account Takeover & Impersonation:** An attacker could register using a competitor's or executive's email address.
- **Transactional Quota Flooding:** Automated bots could consume outbound email quotas by registering non-existent recipient domains.

---

## 2. Six-Digit Code Generation & Cryptographic Properties

- **Generation Method:** Generated via `node:crypto.randomInt(100000, 1000000)` in [`src/lib/verification.ts`](../../src/lib/verification.ts).
- **Entropy & Distribution:** Unlike pseudo-random generators (`Math.random()`), `crypto.randomInt` draws directly from operating system entropy pools (Windows `BCryptGenRandom` / Linux `getrandom`). Every integer in the $[100000, 999999]$ range has a uniform $\frac{1}{900,000}$ probability of selection ($\approx 19.8$ bits of cryptographic entropy).
- **Guaranteed Format:** Generates strictly numeric 6-digit codes. Numeric codes are significantly easier for Nigerian mobile users to read from a push notification and enter into mobile keypad inputs than alphanumeric strings.

---

## 3. Storage & Hashing Strategy

- **Table:** Stored in PostgreSQL `VerificationCode` table.
- **Hashed at Rest:** The plain-text code is **never stored in PostgreSQL**. Instead, Swash stores a salted cryptographic hash (`codeHash = sha256("swash_code_pepper_" + code)`).
- **Protection Rationale:** If a database backup, replication stream, or query log is compromised, the attacker cannot read valid verification codes.

---

## 4. Expiry Duration, Attempt Limits & Reuse Prevention

| Parameter | Value | Justification & Trade-off |
|---|---|---|
| **Expiry Duration** | 15 minutes (900 seconds) | Balances security against mobile network latency. In Lagos, cellular data congestion or email delivery delays can take 1–3 minutes; a 5-minute window causes excessive expiry frustrations, whereas 24 hours leaves codes vulnerable to mailbox snooping. |
| **Attempt Limit** | 5 attempts | An attacker guessing randomly has a $\frac{5}{900,000} \approx 0.00055\%$ probability of guessing correctly before the record locks. |
| **Reuse Prevention** | Single-use (`usedAt` timestamp) | Once successfully verified, `usedAt` is marked with the current timestamp in an atomic database transaction. Any subsequent attempt with the same code is immediately rejected with HTTP 409 (`ALREADY_USED`). |

---

## 5. Background Delivery vs Synchronous SMTP Benchmark

Outbound SMTP involves DNS MX lookups, TCP connection establishment, and TLS handshakes that take 1,500–3,500 ms per message.

### Empirical Measurements on this Machine ([`18-registration-timing-sync-vs-job.txt`](../evidence/18-registration-timing-sync-vs-job.txt))

| Delivery Mode | Mean HTTP Latency | User Experience Impact |
|---|---|---|
| **Synchronous SMTP** | **2,839.26 ms** (~2.84 s) | The user waits nearly 3 seconds with a spinning button; on jittery Nigerian 3G/4G connections, users frequently assume the page hung and click repeatedly. |
| **Background `EmailJob` Queue** | **551.25 ms** (sub-150ms after pool warmup) | **5.2× faster**. The HTTP request returns immediately after inserting the job into PostgreSQL. |

### Failure Isolation & Fault Tolerance ([`16-smtp-failure.txt`](../evidence/16-smtp-failure.txt))
When an SMTP server is unreachable or experiences temporary downtime, synchronous delivery crashes the registration endpoint with HTTP 500 or times out. In contrast, Swash's background `EmailJob` table persists the unsent email safely in PostgreSQL, allowing an automated worker to retry delivery with exponential backoff once SMTP connectivity recovers.

