# Registration Gating Strategy: Soft Gating vs. Hard Gating

This document evaluates the registration gating architecture for the Swash subscription laundry application in Lagos, Nigeria, justifies Swash's selection of **Soft Gating**, analyzes the business and conversion costs of **Hard Gating**, and outlines the specific triggers that would necessitate a policy shift.

---

## 1. The Gating Decision Overview

Registration gating dictates when a newly onboarded customer is permitted to enter the authenticated application relative to email address verification:

| Attribute | Soft Gating (Swash's Selected Model) | Hard Gating (Alternative Enforcement) |
|---|---|---|
| **Post-Registration Access** | Immediate session creation; customer enters the app upon submitting valid registration details. | Blocked at boundary; customer cannot access protected routes until email verification succeeds. |
| **Verification Prompt** | Persistent non-blocking banner: *"Email verification pending. Verify your address to confirm pickup notifications."* | Strict barrier: `HTTP 403 Forbidden` / redirection to `/auth/verify`. |
| **Operational Impact** | Customer explores plans, enters pickup preferences, and establishes initial account affinity. | Customer frequently abandons onboarding if cellular networks delay delivery of the verification code. |
| **High-Risk Actions** | Critical actions (e.g., rider dispatch, recurring direct debit) are gated individually. | All actions blocked universally. |

---

## 2. Why Swash Uses Soft Gating

Swash's primary market consists of busy Nigerian professionals in Lagos (aged 25–40) operating on laptop/desktop browsers and mobile smartphones over variable broadband and cellular data networks.

Swash adopted **Soft Gating** for three primary operational reasons:

### 1. Mitigating Nigerian Cellular & Network Latency
Mobile and internet latency in Lagos fluctuates unpredictably. External transactional email delivery through local ISPs or corporate filters occasionally incurs 2-to-15 minute delays due to greylisting, SMTP throttling, or international routing hops. Under a hard-gated model, a customer who does not receive their verification code within 60 seconds often assumes the system is broken and leaves. Under soft gating, the customer immediately lands in their account, sets up their laundry preferences, and enters the code once their email provider delivers the notification.

### 2. Time-to-Value and Onboarding Momentum
Customer acquisition for a recurring subscription laundry service requires minimizing initial friction. A customer willing to create an account is at peak intent. Forcing them to pause, navigate away to an email client, authenticate, copy a code, and return before viewing service plans interrupts user momentum. Soft gating preserves engagement while keeping the verification requirement prominent.

### 3. Progressive Security and Contextual Authorization
Security does not require binary all-or-nothing gating at the gatekeeper level. By issuing a session that carries `emailVerified: false`, Swash allows read-only and exploratory interactions while selectively enforcing hard gates at sensitive operational boundaries (such as dispatching a rider to a physical home address or finalizing a bank card tokenization).

---

## 3. What Hard Gating Costs in Completed Registrations

Industry telemetry and local e-commerce benchmarks indicate that strict hard gating imposes substantial conversion friction:

1. **Estimated 25% to 40% Drop-off Rate:** Forcing an immediate email loop prior to first app entry causes between a quarter and nearly half of new registrants to abandon the process permanently.
2. **Support Overhead:** Frustrated customers repeatedly click "Resend code," filling email queues, triggering anti-spam rate limits, and generating unnecessary customer support tickets.
3. **Loss of High-Intent Leads:** If an unverified user cannot browse their portal, Swash cannot collect secondary signals (such as preferred pickup frequency, laundry volume, or pickup neighborhood). If the user abandons during soft gating, Swash still retains the contact record to send a scheduled onboarding reminder.

---

## 4. What Would Justify Changing to Hard Gating?

Swash would transition to **Hard Gating** if any of the following operational, legal, or financial thresholds are met:

1. **High Volume of Malicious / Disposable Registrations:** If automated scrapers or spam bots begin registering bulk fictitious accounts to abuse trial promotions or exhaust backend storage, hard gating stops unverified user rows from entering active operational pipelines.
2. **Regulatory Mandate (NDPA / CBN Compliance):** If Nigerian Data Protection Commission (NDPC) enforcement rules or Central Bank of Nigeria (CBN) recurring payment guidelines mandate affirmative electronic mailbox confirmation before storing customer profile data.
3. **Severe Rider Dispatch Waste:** If dispatch riders are sent to fictitious pickup addresses submitted by uncontactable accounts, resulting in wasted fuel, wasted rider hours, and missed customer pickups across Lagos traffic.
4. **Integration with SMS/WhatsApp OTP:** If Swash integrates an instant Nigerian SMS / WhatsApp OTP gateway (e.g., Termii) with sub-second deliverability, eliminating email latency.

---

## 5. Architectural Implementation of Both Approaches

### Soft Gating Flow (Main Branch)
- User registers via `POST /api/auth` (mode: register).
- User record is created in PostgreSQL with `emailVerifiedAt: null`.
- Background `EmailJob` is queued with a CSPRNG verification code.
- Session is created immediately, `swash_session` cookie is attached, and the user is redirected to `/account`.
- `/account` renders an amber warning banner with a link to `/auth/verify`.

### Hard Gating Flow (`experiment/hard-gating` Branch)
- User registers via `POST /api/auth`.
- Verification code is queued, but **no session cookie is issued**.
- User is strictly redirected to `/auth/verify`.
- If user attempts `POST /api/auth` (mode: login) before verification:
  Server returns `HTTP 403 Forbidden`:
  ```json
  {
    "error": "Please verify your email address to activate your Swash account.",
    "requiresVerification": true,
    "email": "customer@swash.ng"
  }
  ```
- No session is issued until the code is validated at `POST /api/auth/verify`.

