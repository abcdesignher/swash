# Task 3: Defects Log

This document records real defects discovered during the implementation and testing of **Task 03 — Client-Side Validation and Accessibility**, with exact file and line references.

---

## Defect 1: Server Endpoint (`POST /api/auth`) Accepts Unvalidated Payloads When Browser Is Bypassed

- **Location:** [`src/app/api/auth/route.ts`](../../src/app/api/auth/route.ts) (lines 36–46) and [`evidence/16-direct-request-command-and-response.txt`](../evidence/16-direct-request-command-and-response.txt).
- **Description:** While [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) (lines 20–85) blocks single-character names, invalid email addresses, invalid Nigerian phone numbers, whitespace-only passwords, and unaccepted terms in the browser, `POST /api/auth` does not yet validate these constraints on the server. Sending a direct `curl.exe` request with `"fullName": "A"`, `"email": "not-an-email"`, `"phone": "123"`, `"password": "          "`, and `"acceptTerms": false` succeeded with `HTTP 201 Created` and wrote a corrupted row to PostgreSQL.
- **Impact & Resolution Plan:** Demonstrates why client-side validation is not security (`docs/client-side-is-not-security.md`). Scheduled to be resolved in **Task 04 Step 6** by enforcing server-side Zod schema validation before any database write.

---

## Defect 2: Full-Name Regex Rejects Honorifics With Periods (e.g., `"Dr. Chukwu"`) and Combining Yoruba Sub-Dots

- **Location:** [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) (line 16: `NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,79}$/`) and [`evidence/15-form-attack-results.txt`](../evidence/15-form-attack-results.txt).
- **Description:** The character class `[A-Za-zÀ-ÖØ-öø-ÿ\s'-]` allows standard Latin letters, spaces, hyphens (`Ade-Ojo`), and apostrophes (`O'Tega`), but rejects periods (`.` in `"Dr. Chukwu"` or `"Engr. Balogun"`) as well as Extended Latin-B / combining diacritical marks used in Yorùbá orthography (`ẹ`, `ọ`, `ṣ`).
- **Impact:** Legitimate Nigerian customers who include professional titles with periods or type indigenous tonal/sub-dot characters are blocked with `"Use letters, spaces, hyphens, or apostrophes only"`. Documented in `docs/validation-rules.md`; Task 04's server-side schema should use Unicode property escapes (`\p{L}\p{M}`) to support all African indigenous characters.

---

## Defect 3: Nigerian Phone Validation Blocks International Roaming Numbers (`+44`, `+1`)

- **Location:** [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) (line 18: `NIGERIAN_PHONE_PATTERN = /^(?:0[789][01]\d{8}|\+234[789][01]\d{8})$/`).
- **Description:** The phone number rule strictly requires an 11-digit Nigerian mobile number (`070/080/081/090/091...`) or its `+234` equivalent so Lagos dispatch riders can place local mobile calls.
- **Impact:** Diaspora visitors, diplomats, or expatriate professionals staying in Lagos who only have an international WhatsApp/roaming number cannot complete registration without a local Nigerian SIM number.

---

## Defect 4: Initial Accessibility Draft Omitted `aria-describedby` and Non-Colour Error Indicators

- **Location:** [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) (fixed at lines 273–292, 316–341, 366–384, 422–468) and [`evidence/11-screenreader-before.txt`](../evidence/11-screenreader-before.txt).
- **Description:** In the initial form implementation prior to the Step 6 accessibility audit, invalid inputs only changed border colour and did not link to their error message IDs via `aria-describedby` or set `aria-invalid="true"`. Screen readers tabbing back to an invalid field did not announce the error message (`evidence/11-screenreader-before.txt`).
- **Resolution:** Fixed by adding `aria-invalid`, `aria-describedby`, `role="alert"`, and a visible `⚠` caution icon (`evidence/12-screenreader-after.txt`).

