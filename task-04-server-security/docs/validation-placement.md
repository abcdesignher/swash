# Server-Side Validation Placement (Task 04, Steps 5–7)

## Library choice: Zod

| Question | Answer |
|---|---|
| Library | `zod` (MIT licence, free, no service or account) |
| Why | TypeScript-first. The same schema validates the data and gives its type (`z.infer`), so the route's types cannot drift from its checks. Parsing, trimming and lowercasing happen in one declared pipeline instead of scattered `if` statements. Already common in Next.js projects. |
| Cost | Adds one dependency. No other validation library is installed. |
| Alternatives not chosen | Hand-written checks (scattered, easy to forget a field); a form library (client-side only, cannot protect the API). |

Schemas live in [`src/lib/validation.ts`](../../src/lib/validation.ts): `registerSchema`, `loginSchema`, `passwordResetRequestSchema`. Normalisation functions live in [`src/lib/normalise.ts`](../../src/lib/normalise.ts) and are shared with the browser form.

## Where validation occurs

At the request boundary of `POST /api/auth` ([`route.ts`](../../src/app/api/auth/route.ts)), before any database call or password hashing:

1. Read the body as text. Reject bodies over 10,000 characters with **413**.
2. `JSON.parse`. Malformed JSON, arrays and non-objects get **400**.
3. Read `mode` (only `register` or `login` are accepted; anything else is **400**).
4. `schema.safeParse(body)`. Failure returns **422** with `fieldErrors` and stops.
5. Only the parsed, normalised output (`parsed.data`) is used from here on. The raw body is never read again.

## What runs before validation

- Reading the body and size check.
- JSON parsing.
- Choosing which schema to apply.
- Later (Step 8) the rate limiter will also run here, because it needs no body and is cheaper than parsing.

## What must not run before validation

- Any Prisma query (`findFirst`, `create`).
- Argon2id hashing or verification (about 23 ms of CPU per call; an unvalidated 10 MB "password" would be a denial-of-service lever).
- Logging of request fields.
- Sending email or creating verification codes.
- Reading raw fields such as `role` or `id` into a database write. The route builds the insert from named fields in `parsed.data`, and Zod strips unknown keys, so a caller cannot set `role` or `emailVerifiedAt`.

## Rules enforced on the server (same as Task 03, re-implemented)

| Field | Rule |
|---|---|
| `fullName` | trimmed; 2–80 characters; letters, spaces, hyphens, apostrophes |
| `email` | edge whitespace removed, lowercased; ≤ 254 characters; email pattern |
| `phone` | trimmed; Nigerian mobile format (`0[789][01]xxxxxxxx` or `+234…`) |
| `servicePlan` | one of `Individual`, `Family`, `Small Business` Subscription |
| `password` | edge whitespace removed; 10–128 characters; not whitespace-only |
| `acceptTerms` | must be exactly `true` |
| login `password` | no policy rules (kept consistent with Task 03 `enumeration.md`), only non-empty |

Every field must also be a string (or `true` for terms) before anything else runs; arrays and objects fail immediately. A 1,024-character cap is applied to each string before normalisation.

## Email and password are different decisions

- **Email** is an identifier. `Adaeze@Gmail.com` and `adaeze@gmail.com` must be the same account, so we remove edge whitespace and lowercase. (Strictly, the part before `@` is case-sensitive in the standard, but real mail providers treat it as case-insensitive and treating it as case-sensitive would create duplicate or lock-out accounts.)
- **Password** is a secret. Lowercasing or otherwise rewriting it would shrink the set of possible passwords and could stop a user logging in with a password they chose. Only edge whitespace is removed, because the realistic error is a stray space or line break picked up when pasting (non-breaking spaces and zero-width characters count as whitespace). Interior spaces are kept so passphrases work. Policy approved by the product owner: trim leading and trailing spaces before hashing.

## Why one schema beats scattered checks

- One definition per request shape, so a new field cannot be added without deciding its rule.
- Validation and normalisation cannot be skipped by one code path: the route can only reach `parsed.data` after success.
- Output is typed, so TypeScript flags misuse.
- The error format is built in one place (`toFieldErrors`).

## Known limits

- Client and server rules are written twice (the guide asks for this). They can drift; a shared test would reduce that and is not yet written.
- `passwordResetRequestSchema` exists but there is no password-reset route yet, so reset is **not** protected because it is **not implemented** (recorded in `not-implemented.md` when that file is written).
- A registration with an already-used email returns 409 with a message that confirms an account may exist. A fully enumeration-safe design needs the email verification flow (Step 10) and is recorded as a limitation.
- Measurements: see [`11-validation-timing.txt`](../evidence/11-validation-timing.txt) and [`12-direct-request-before-and-after.txt`](../evidence/12-direct-request-before-and-after.txt).

