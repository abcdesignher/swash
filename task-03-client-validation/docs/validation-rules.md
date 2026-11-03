# Client-Side Validation Rules & Trade-Off Analysis

This document specifies the four validation categories implemented in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx), the operational reason for each rule, the legitimate users each rule could inadvertently block, and the password/button UX decisions from Step 7.

---

## Category 1: Empty Fields (`onBlur` Inline Feedback — `evidence/05-empty-field-error.png`)

When a user focuses a required input and leaves it empty (`onBlur`), [`AuthForm.tsx`](../../src/components/AuthForm.tsx) sets `touched[field] = true` and renders a Swash-specific inline error message:

| Field | Empty-Field Error Message |
| --- | --- |
| `fullName` | *"Enter your full name so Swash riders can identify your collection."* |
| `email` (Register) | *"Enter your email address to receive order and payment updates."* |
| `email` (Login) | *"Enter the email address for your Swash account."* |
| `phone` | *"Enter a Nigerian mobile number so our rider can coordinate pickup."* |
| `password` (Register) | *"Create a password to protect your Swash subscription account."* |
| `password` (Login) | *"Enter your account password to sign in."* |

---

## Category 2: Length and Structure Rules (`evidence/06-length-rule-blocking.png`)

Every structural rule is derived from Swash's operational needs in Nigeria rather than copied generically:

| Field | Exact Rule | What Goes Wrong Without It | Legitimate Users It May Wrongly Block |
| --- | --- | --- | --- |
| **Full name** (`fullName`) | Trimmed length `2–80` characters; pattern `/^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,79}$/` (letters, spaces, hyphens `-`, apostrophes `'`, and accented Latin letters). | Single-character test strings (`"A"`), whitespace-only strings (`"   "`), or numeric strings (`"12345"`) get printed onto physical laundry bag tags, making it impossible for dispatch riders to ask estate security or reception for the customer. | 1. Rare individuals who legally use a **single-character mononym** or initial as their sole name.<br>2. Customers whose legal names include **periods** (e.g., `"Dr. Chukwu"`, `"St. Matthew-Daniel"`), **slashes**, or **indigenous tonal diacritics** with combining Unicode marks outside the Latin-1 supplement range (e.g., Yorùbá sub-dots `ẹ`, `ọ`, `ṣ`). |
| **Nigerian mobile number** (`phone`) | Matches `/^(?:0[789][01]\d{8}\|\+234[789][01]\d{8})$/` (`11` digits starting with `070`, `080`, `081`, `090`, `091` or `14`-character `+234` international equivalent). | Customers accidentally omit a digit (`10` digits) or type landlines/random numbers; when the Swash rider arrives at the customer's gate in Lagos traffic, the call fails and the collection is missed. | **Expatriates, diaspora returnees, or international business travellers** staying in Lagos hotels/serviced apartments who use a foreign WhatsApp/roaming number (e.g., `+44...` or `+1...`) and do not yet have a local Nigerian SIM card. |
| **Password** (`password` — Register) | Length `10–128` characters; must not be whitespace-only (`value.trim().length > 0`). No arbitrary symbol/uppercase composition rules forced. | Short passwords (`< 10` characters) or whitespace-only passwords (`"          "`) are vulnerable to offline credential-stuffing and brute-force attacks, risking exposure of customer home addresses and laundry pickup schedules. | Users whose corporate password manager generates a `> 128`-character passphrase, or users accustomed to legacy `8`-character passwords who must create a slightly longer `10+`-character password for Swash. |

---

## Category 3: Format Validation & Email Ownership Distinction (`evidence/07-email-realtime-signup.png` & `08-email-on-submit-login.png`)

1. **Registration (`/auth?mode=register` — Real-Time Validation):**
   - Validates `email` (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`), `phone`, `fullName`, and `password` in real time once the user types or blurs the field (`evidence/07-email-realtime-signup.png`).
   - **Email Format vs. Email Ownership:** Checking that `adaeze@example.com` matches an email regex only proves the string is **syntactically formatted like an email address**; it does **not** prove the mailbox exists or that the person typing it owns that mailbox. When the format is valid on registration, the form explicitly displays:
     > *"Email format is valid. We will send a verification link after signup to confirm you own this address."*
   - Actual ownership is only proven in Task 04 when the user clicks a cryptographic token sent to that inbox.
2. **Sign-In (`/auth?mode=login` — Validate on Submit Only):**
   - While typing in the Login form, format validation does **not** interrupt the user (`evidence/08-email-on-submit-login.png`). Format errors on `/auth?mode=login` are evaluated and displayed only when the user clicks **Sign In to Swash** (or leaves a required field completely blank on blur).

---

## Category 4: Accessible Errors (`evidence/11-screenreader-before.txt` & `12-screenreader-after.txt`)

- Every input has an explicit `<label htmlFor="...">`.
- Invalid inputs set `aria-invalid="true"` and bind `aria-describedby` to the ID of their inline error paragraph (`#auth-full-name-error`, `#auth-email-error`, `#auth-phone-error`, `#auth-password-error`, `#auth-accept-terms-error`).
- Every inline error renders `role="alert"` and includes a non-colour caution icon (`<span aria-hidden="true">⚠</span>`) alongside high-contrast error tokens (`--colour-on-inverse-error-role` on `--colour-inverse-error-role`, `14.13:1` AAA).

---

## Step 4 & Step 7 Design Decisions

1. **Input Type for Phone (`type="tel"` vs `type="number"` — `evidence/09` & `10`):**
   - `<input type="number">` treats the phone number as a mathematical integer: it strips the mandatory leading `0` from Nigerian mobile numbers (`08031234567` becomes `8031234567`), rejects `+` in `+2348031234567`, renders up/down increment arrows, and allows scientific notation (`e`).
   - `<input type="tel" inputMode="numeric" autoComplete="tel">` preserves leading zeros and `+234`, removes spinner arrows, and presents a numeric keypad on mobile devices. `<input type="number">` is only appropriate for true quantities (such as garment counts or bag quantities).
2. **Password Visibility Toggle vs. Password Confirmation Field:**
   - **Chosen:** Accessible **Show / Hide** toggle button (`aria-label`, `aria-pressed`). It allows busy users on unstable connections to inspect their typed password directly without doubling typing effort or vertical form height.
   - **When Confirmation Field Is Preferable:** High-ceremony, irreversible credential setup where screen-shoulder-surfing is a high risk (e.g., setting a hardware encryption master key in a public space where unmasking the password on screen is unsafe).
3. **Disabled Submit Button vs. Hidden Submit Button (`evidence/13` & `14`):**
   - When the submit button is completely hidden until the form is valid (`evidence/13-button-hidden-version.png`), users—especially keyboard and screen-reader users—cannot tell how to submit the form or why the primary action is missing.
   - Keeping the submit button **visible by default and `disabled` until the form is valid** (`evidence/14-button-disabled-version.png`), paired with an explicit message when all fields are filled except the Terms checkbox, gives users a predictable landmark and clear completion guidance.
