# Why Client-Side Validation Is Not Security (`evidence/15` & `16`)

This document analyses the results of attacking the Swash registration form in the browser (`evidence/15-form-attack-results.txt`) versus bypassing the browser entirely with a direct HTTP request (`evidence/16-direct-request-command-and-response.txt`), and defines what **Task 04 (Server-Side Security and Data Integrity)** must enforce on the server.

---

## 1. Browser Form Attack Summary (`evidence/15-form-attack-results.txt`)

When testing inside the browser UI (`/auth?mode=register`), [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) blocked every invalid test vector before `fetch("/api/auth")` could be called:

| Test Vector | Input Tested | Browser UI Outcome |
| --- | --- | --- |
| **1. Single-character name** | `fullName = "A"` | **Blocked** (`"Full name must be at least 2 characters long."`) |
| **2. Title with period in name** | `fullName = "Dr. Chukwu"` | **Blocked** (`"Use letters, spaces, hyphens, or apostrophes only (2–80 characters)."`) — *legitimate edge case documented in `docs/validation-rules.md`.* |
| **3. Whitespace-only password** | `password = "          "` (10 spaces) | **Blocked** (`"Password cannot consist solely of spaces."`) |
| **4. Invalid email formats** | `email = "adaeze@gmail"` / `"adaeze@@example..com"` | **Blocked** (`"Enter a valid email format such as name@domain.com."`) |
| **5. Leading/trailing whitespace** | `fullName = "  Adaeze Okafor  "`, `email = "  adaeze@example.com  "` | **Trimmed & Accepted** (`.trim()` applied prior to validation and submission) |
| **6. Maximum length boundary (`80` vs `81` chars)** | `80`-char name vs `81`-char name | `80` chars **Accepted**; `81` chars **Blocked** (`"Full name must not exceed 80 characters."`) |
| **7. Unchecked Terms of Service** | `acceptTerms = false` | **Blocked** (`#auth-submit-button` remains `disabled`) |

---

## 2. Direct Endpoint Bypass (`curl.exe` — `evidence/16-direct-request-command-and-response.txt`)

To prove that client-side validation only runs inside a cooperative browser, we bypassed React and the DOM entirely by sending a direct `POST` request to `http://127.0.0.1:3007/api/auth` using `curl.exe` with deliberately invalid values that the browser UI had blocked:

```json
{
  "mode": "register",
  "fullName": "A",
  "email": "not-an-email",
  "phone": "123",
  "servicePlan": "InvalidPlan",
  "password": "          ",
  "acceptTerms": false
}
```

### What Happened on the Server and in PostgreSQL
1. **HTTP Status Returned:** `HTTP/1.1 201 Created`
2. **Server Behaviour:** Because [`src/app/api/auth/route.ts`](../../src/app/api/auth/route.ts) at the Task 03 stage did not enforce server-side schema validation, it accepted the raw JSON payload directly from `request.json()`.
3. **Database Outcome:** Prisma executed `INSERT INTO "public"."ServiceEnquiry"` and created a real PostgreSQL record containing `fullName: "A"`, `email: "not-an-email"`, `serviceType: "InvalidPlan"`, and `notes: "Phone: 123 | AcceptedTerms: false | PasswordLength: 10"`.

---

## 3. What This Proves About Client-Side Validation

1. **Client-Side Code Is Under the User's Complete Control:** Any attacker or automated script can bypass HTML attributes (`required`, `type="email"`), React state checks, and `disabled` buttons using `curl`, Postman, browser DevTools (`fetch()` in the console), or an intercepting proxy.
2. **Client-Side Validation Is UX, Not Security:** Its purpose is to give honest Swash customers immediate, accessible feedback without waiting for a network round-trip over slow connections. It provides **zero** protection against malicious or malformed requests hitting `/api/*` directly.

---

## 4. What Task 04 Must Enforce on the Server

To make the server the true authority for Swash data, **Task 04** must implement:
1. **Strict Server-Side Schema Validation (Zod):** Validate every field (`fullName`, `email`, `phone`, `servicePlan`, `password`, `acceptTerms === true`) on the server before touching Prisma, returning `400 Bad Request` with structured field errors when any constraint fails.
2. **Consistent Normalisation & Trimming:** Trim and lowercase `email` on the server while preserving intentional password characters.
3. **Adaptive Password Hashing:** Hash passwords with Argon2id or bcrypt (never storing or logging plaintext passwords).
4. **Rate Limiting & Email Verification:** Rate-limit authentication endpoints (`429 Too Many Requests` with `Retry-After`) and require cryptographic email verification tokens to prove mailbox ownership.
