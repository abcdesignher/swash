# Task 03 — Client-Side Validation and Accessibility

## 1. What This Task Covers

Task 03 consolidates customer authentication into a single, accessible, client-validated `/auth` route (`?mode=register` and `?mode=login`) for Swash's subscription laundry platform in Lagos, Nigeria. It covers:

- **Single-Page Form State Consolidation (Step 1):** Replacing separate registration and sign-in routes with a single `/auth` route that switches between `?mode=register` and `?mode=login` without full document reloads or premature database/session requests.
- **Field Minimisation & Terms Provenance (Step 2):** Auditing and justifying every field on the registration and sign-in forms against Swash's operational requirements, and documenting the origin and NDPA 2023 alignment of the terms-acceptance wording.
- **Four-Category Client-Side Validation (Step 3):** Implementing and verifying:
  1. Empty required field checks on blur and submit.
  2. Minimum/maximum character length and whitespace-only rejection.
  3. Real-time email format validation during registration versus on-submit validation during login, plus explicit separation of email format validity from mailbox ownership verification.
  4. Accessible inline error association (`aria-invalid`, `aria-describedby`, `role="alert"`).
- **Mobile Input Type & Virtual Keyboard Selection (Step 4):** Replacing `<input type="number">` (which strips the leading `0` from 11-digit Nigerian mobile numbers like `08031234567`) with `<input type="tel" inputMode="numeric">`.
- **Sensitive Hint & Enumeration Protection (Step 5):** Suppressing registration password policy rules on the login form and standardising authentication failure messaging to prevent account enumeration.
- **Manual Accessibility Audit & Remediation (Step 6):** Auditing the authentication flow across five accessibility criteria, fixing five concrete accessibility defects (including adding non-colour `⚠` caution icons, ARIA error bindings, WAI-ARIA tablist roles, and screen-reader state announcements), and capturing before/after screen-reader transcripts.
- **Progressive Password Guidance, Visibility Toggle & Submit Button State (Step 7):** Providing real-time passphrase feedback on registration, an accessible `Show`/`Hide` password toggle (`aria-label` + `aria-pressed`), and a submit button that remains visible by default and disabled until all client-side rules pass.
- **Adversarial Form Testing & Direct Endpoint Bypass (Step 8):** Attacking the form in the browser and bypassing the browser completely with `curl.exe` against `POST /api/auth` to prove that client-side validation is a UX helper, not a security boundary.
- **Commit-ID Rollback (Step 9):** Making a deliberate change that was subsequently rejected, rolling it back by exact commit SHA (`git revert <sha>`), and documenting why commit-SHA rollback is safer than natural-language rollback instructions.

---

## 2. What Was Implemented

| Area | Files Created / Updated |
|---|---|
| Consolidated `/auth` Route & Metadata | [`src/app/auth/page.tsx`](../src/app/auth/page.tsx) |
| Client-Side Validation & Accessible Form Component | [`src/components/AuthForm.tsx`](../src/components/AuthForm.tsx) |
| Endpoint Used for Step 8 Direct Request Bypass | [`src/app/api/auth/route.ts`](../src/app/api/auth/route.ts) |
| Navigation Integration (`Account` link) | [`src/components/SiteHeader.tsx`](../src/components/SiteHeader.tsx) |
| Semantic Token Styles for Form, Tabs, Alerts & Toggle | [`src/app/page.module.css`](../src/app/page.module.css) |
| Task Documentation (10 files) | [`docs/spa-rationale.md`](docs/spa-rationale.md), [`docs/field-justification.md`](docs/field-justification.md), [`docs/terms-note.md`](docs/terms-note.md), [`docs/validation-rules.md`](docs/validation-rules.md), [`docs/enumeration.md`](docs/enumeration.md), [`docs/accessibility-audit.md`](docs/accessibility-audit.md), [`docs/client-side-is-not-security.md`](docs/client-side-is-not-security.md), [`docs/rollback.md`](docs/rollback.md), [`docs/defects.md`](docs/defects.md), [`docs/interview-answers.md`](docs/interview-answers.md) |
| Verification Evidence (17 files) | [`evidence/`](evidence/) (`01-page-count-before.txt` through `17-commit-list-and-rollback.txt`) |

---

## 3. Important Decisions

1. **Single `/auth` Route with URL-Addressable Query State (`?mode=register` / `?mode=login`):**
   - Consolidating registration and login into [`src/app/auth/page.tsx`](../src/app/auth/page.tsx) and [`src/components/AuthForm.tsx`](../src/components/AuthForm.tsx) keeps the route footprint small (`3` pages total: `/`, `/plans`, `/auth`) while preserving bookmarkable URLs and instant in-memory switching on unreliable Nigerian mobile networks.
2. **`<input type="tel" inputMode="numeric">` Over `<input type="number">`:**
   - Nigerian mobile numbers start with a leading zero (`0803...`, `0814...`, `0901...`, `0706...`). `<input type="number">` treats the input as an arithmetic integer and strips the leading `0` (`8031234567`), breaking 11-digit validation and corrupting rider dispatch records. `<input type="tel" inputMode="numeric" autoComplete="tel">` preserves the exact string while still presenting a numeric keypad on mobile devices.
3. **Asymmetric Validation Between Registration and Sign-In:**
   - Registration (`?mode=register`) validates email format and passphrase progress in real time (`onChange`) to help new customers complete onboarding accurately.
   - Sign-In (`?mode=login`) suppresses password policy hints and validates email format only on submit (`onSubmit`), avoiding premature error banners while typing and preventing password-policy disclosure to attackers.
4. **Visible-by-Default Disabled Submit Button Over Hidden Submit Button:**
   - Hiding the submit button until valid (`display: none`) leaves keyboard and sighted users unsure how to submit the form or which field is still blocking completion. Keeping the submit button visible by default (`disabled={!isFormValid}`) paired with `#auth-submit-helper` (`aria-describedby="auth-submit-helper"`) communicates both the target action and the remaining requirement.

---

## 4. What Went Wrong and What Was Fixed

1. **Leading Zero Loss with `<input type="number">` on Nigerian Mobile Numbers:**
   - **Issue:** In the initial prototype (`09-original-input-behaviour.png`), `<input type="number">` stripped the leading `0` from `08031234567` into `8031234567`, causing 11-digit Nigerian mobile validation to fail and exposing scroll-wheel increment/decrement spinners.
   - **Fix:** Switched to `<input type="tel" inputMode="numeric" autoComplete="tel">` (`10-improved-input-behaviour.png`), preserving all 11 digits (`08031234567`) and `+234` prefixes while still triggering the numeric keypad on mobile devices.
2. **Colour-Only Error Indication & Missing Screen-Reader Associations:**
   - **Issue:** Early form error states relied only on a red border and unlinked `<p>` text (`11-screenreader-before.txt`), failing WCAG 1.4.1 (Use of Color) and leaving screen-reader users unaware of validation errors when tabbing into an invalid field.
   - **Fix:** Added a visible `⚠` caution icon inside every inline error banner, bound `aria-invalid` and `aria-describedby` dynamically to each control, and marked error containers with `role="alert"` (`12-screenreader-after.txt`).
3. **Hidden Submit Button (`13-button-hidden-version.png`):**
   - **Issue:** Hiding the submit button when the form was incomplete prevented users from discovering the primary action at the bottom of the form.
   - **Fix:** Kept `#auth-submit-button` visible at all times with `disabled={!isFormValid}` and added explicit helper text (`#auth-submit-helper`) explaining when the button becomes active (`14-button-disabled-version.png`).
4. **Unrequested WhatsApp Marketing Opt-In Checkbox (Step 9 Rollback):**
   - **Issue:** An experimental WhatsApp promotional opt-in checkbox was committed during Step 9, violating the field-minimisation principle established in Step 2.
   - **Fix:** Identified the exact commit SHA via `git log --oneline` and reverted it cleanly using `git revert <sha> --no-edit` (`17-commit-list-and-rollback.txt`, [`docs/rollback.md`](docs/rollback.md)).

---

## 5. Completion Status

**Status:** Complete (All 9 steps, 10 documentation files in `docs/`, and 17 evidence files in `evidence/` verified).

---

## 6. Known Defects

Three honest boundary limitations remain at the close of Task 03 and are documented in [`docs/defects.md`](docs/defects.md):

1. **D-01 — Full-Name Regex Rejects Periods (`.`) in Honorifics or Initials:** `NAME_REGEX` (`/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,80}$/`) rejects names containing a period such as `"Dr. Chukwu"` or `"Chinedu A. Okafor"` (`15-form-attack-results.txt`, Test Case 3).
2. **D-02 — `POST /api/auth` Lacks Server-Side Schema Validation (Intentional Task 03 Scope Boundary for Step 8):** Bypassing the browser with `curl.exe` (`16-direct-request-command-and-response.txt`) inserts invalid records (`fullName: "A"`, `email: "not-an-email"`, `acceptTerms: false`) with HTTP `201 Created`. Server-side validation and HTTP `400`/`422` enforcement are deferred to Task 04.
3. **D-03 — Submit Button Disabled State Blocks Click-Triggered Summary of Untouched Fields:** Because `#auth-submit-button` uses native `disabled={!isRegisterValid}` on registration, clicking the disabled button does not fire `onSubmit` to highlight untouched fields simultaneously; users are guided instead by `#auth-submit-helper` and per-field `onBlur` validation.

