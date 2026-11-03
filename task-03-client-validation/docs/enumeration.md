# Protecting Sensitive Field Information & Preventing Enumeration

This document explains which sensitive field hints were removed in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx), what an attacker could learn if they remained, and how the trade-off affects legitimate Swash customers.

---

## 1. Which Field Is Involved

The **Password field (`#auth-password`)**—specifically in **Sign-In mode (`/auth?mode=login`)**—along with the relationship between the **Email (`#auth-email`)** and **Password (`#auth-password`)** fields during authentication.

---

## 2. Why Its Format and Policy Hints Are Sensitive on Sign-In

During **Account Registration (`/auth?mode=register`)**, a new customer needs to know Swash's password rules (`10–128` characters, no whitespace-only strings) once they begin typing so they can choose a compliant password.

However, during **Sign-In (`/auth?mode=login`)**:
- Displaying password composition rules (*"Password must be between 10 and 128 characters"* or *"Password is too short — minimum 10 characters"*) on the login screen reveals the exact search-space boundaries of valid Swash passwords.
- Similarly, returning field-specific login errors such as *"No Swash account found for this email"* vs. *"Email found, but password is incorrect"* discloses which email addresses are registered with Swash (**user enumeration**).

---

## 3. What an Attacker Could Learn From the Hint

1. **Keyspace Reduction in Credential Stuffing & Brute Force:**
   - If the login form rejects `< 10`-character passwords client-side or displays *"Passwords at Swash are at least 10 characters"*, an attacker running a credential-stuffing list of leaked passwords immediately prunes all `1–9` character passwords before sending a single network packet to the server, reducing wasted requests and evading rate limits longer.
2. **Account Enumeration (Privacy & Spear-Phishing Risk):**
   - If the form hints whether an email address exists, an attacker can test a list of Nigerian corporate or personal emails to discover who uses Swash, and then send targeted fake laundry-delivery or payment-failure phishing messages to confirmed customers.

---

## 4. How Removing the Hint Affects Legitimate Users

- On `/auth?mode=login`, the password field (`#auth-password`) only checks that the field is **not empty** (`password.length > 0`). It does **not** display *"Minimum 10 characters"* or validate password structure on the sign-in screen.
- On `/auth?mode=register`, password guidance is also hidden by default and only revealed progressively once the user begins typing (`password.length > 0`).
- **Impact on legitimate users:** A returning user who accidentally types an 8-character password from another site on `/auth?mode=login` will not be stopped before clicking **Sign In**; instead, they submit the form and receive a standard generic invalid-credentials response.

---

## 5. Why the Trade-Off Is Justified

The trade-off is strongly justified:
- Legitimate returning users on `/auth?mode=login` are trying to recall an existing password, not invent a new one—telling them *"must be at least 10 characters"* rarely helps them remember their password, while withholding policy hints on login deprives attackers of free reconnaissance.
- Meanwhile, ordinary customer fields on Registration (`fullName`, `email`, `phone`) keep clear, helpful placeholders and format hints because their formats (`0803...`, `name@domain.com`) are public conventions rather than secret security boundaries.

