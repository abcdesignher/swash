# Swash Authentication Form Field Justification

Every field in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx) is mapped directly to an approved Swash operational requirement from [`business-brief.md`](../../task-01-design-system/docs/business-brief.md) and [`business-operations.md`](../../.agent/rules/business-operations.md). Fields and decorative elements that do not serve a concrete laundry, payment, or account-security workflow have been excluded.

---

## 1. Registration Mode (`/auth?mode=register`) — 6 Justified Fields

| Field (`name` / `id`) | Why It Is Needed | What Swash Does With the Information | What Happens If It Is Incorrect | Necessary for Workflow? |
| --- | --- | --- | --- | --- |
| **1. Full name** (`fullName` / `#auth-full-name`) | Identifies the customer on laundry bags, collection manifests, delivery handoffs, and payment records. | Stored on the customer record and printed on collection/delivery tags so riders and facility staff match garments to the right household. | Riders cannot ask estate security or reception for the right resident at pickup/drop-off, increasing missed collections or garment mix-ups. | **Yes (Mandatory)** — Required for physical collection and delivery handoffs. |
| **2. Email address** (`email` / `#auth-email`) | Primary unique account identifier, channel for email verification (Task 04), payment receipts, and subscription allowance alerts. | Normalised and stored as the customer's login identifier; used to send verification links, order confirmations, and password-reset tokens. | Customer cannot verify their account, receive payment receipts, or recover access if they forget their password. | **Yes (Mandatory)** — Core account and billing communication channel. |
| **3. Nigerian mobile number** (`phone` / `#auth-phone`) | Lagos residential estates and office complexes require dispatch riders to call the customer or send a gate-access code upon arrival. | Stored with the customer's collection profile so operations staff and riders can coordinate pickup/delivery windows in real time. | Riders are turned back at estate gates when they cannot reach the customer by phone, causing failed pickups and wasted logistics trips. | **Yes (Mandatory)** — Essential for physical door-to-door logistics in Nigeria. |
| **4. Preferred laundry subscription** (`servicePlan` / `#auth-service-plan`) | Connects the customer's registration to their intended monthly item allowance tier (`Individual`, `Family Household`, or `Small Business`). | Initializes the customer's subscription preference so their allowance quote and onboarding workflow match their laundry volume. | Customer is quoted or onboarded into the wrong item allowance tier, causing confusion over monthly garment limits. | **Yes (Mandatory — Defaulted)** — Pre-selected to `Individual (1–2 people)` to minimise friction. |
| **5. Create password** (`password` / `#auth-password`) | Authenticates the customer on return visits so only the authorised account owner can view orders, payments, and AI assistant records. | Hashed on the server (Task 04 Argon2id/bcrypt) and verified during sign-in before issuing a server session (Task 05). | Weak or compromised passwords expose private customer addresses, order history, and subscription allowances to unauthorised access. | **Yes (Mandatory)** — Required by [`data-and-security.md`](../../.agent/rules/data-and-security.md). |
| **6. Terms & Privacy acceptance** (`acceptTerms` / `#auth-accept-terms`) | Records explicit customer consent to Swash's garment-care liability limits, collection window rules, and Nigeria Data Protection Act (NDPA) data processing terms. | Verified before enabling registration submission and recorded with the registration event. | Swash lacks auditable proof of consent for processing personal data (name, phone, email) and enforcing special-item/garment-care terms. | **Yes (Mandatory)** — Required for regulatory compliance and service contract validity. |

---

## 2. Sign-In Mode (`/auth?mode=login`) — 2 Justified Fields

| Field (`name` / `id`) | Why It Is Needed | What Swash Does With the Information | What Happens If It Is Incorrect | Necessary for Workflow? |
| --- | --- | --- | --- | --- |
| **1. Email address** (`email` / `#auth-email`) | Identifies which customer account is attempting to sign in. | Looked up (case-insensitively) against registered customer records. | Sign-in fails with a generic non-enumerating credential error. | **Yes (Mandatory)** |
| **2. Password** (`password` / `#auth-password`) | Proves ownership of the customer account. | Verified against the stored password hash before creating a session. | Sign-in is rejected and recorded against rate-limiting counters (Task 04). | **Yes (Mandatory)** |

---

## 3. Fields and Decorative Elements Deliberately Removed

1. **Separate "First Name" / "Middle Name" / "Last Name" Split Fields:** Consolidated into a single `Full name` field (`fullName`) so Nigerian customers with compound names, mononyms, or varying name-order conventions are not forced into rigid Western first/last boxes.
2. **Date of Birth, Gender, and National ID (BVN/NIN):** Removed—laundry pickup and subscription billing do not require demographic or identity-document collection, adhering to [`data-and-security.md`](../../.agent/rules/data-and-security.md) Section 3 (*"Collect only information required for the service"*).
3. **Confirm Email & Confirm Password Duplicate Inputs:** Removed in favour of real-time email format feedback + post-signup email verification and an accessible **Show / Hide Password** toggle, cutting typing effort on slow connections.
4. **Decorative Marketing Illustrations and Redundant Callout Boxes:** Removed non-functional decorative badges and repetitive marketing banners from the authentication card so the form stays lightweight and focused on task completion.
