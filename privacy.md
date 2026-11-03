# Swash Privacy Notice

**Last Updated:** November 2026  
**Applicable Jurisdiction:** Federal Republic of Nigeria  
**Governing Law:** Nigeria Data Protection Act (NDPA) 2023  

---

## 1. Introduction and Scope

Swash Laundry Technologies Ltd ("Swash", "we", "us", or "our") operates a subscription-led laundry and dry-cleaning web application connecting residential customers, families, and businesses across Lagos with reliable laundry operations.

We respect your personal privacy and are committed to handling your personal data transparently, securely, and in strict compliance with the **Nigeria Data Protection Act (NDPA) 2023** and other applicable Nigerian laws.

This Privacy Notice explains:
- What information we collect about you.
- Why we collect it and our legal basis for doing so.
- How your data is used across our customer portal, rider dispatch systems, and customer support.
- How long your records are kept.
- What happens when you request account deletion.
- How you can exercise your statutory data privacy rights.

---

## 2. Information We Collect

We collect only the minimum personal data required to deliver reliable laundry subscriptions and dispatch services across Lagos:

1. **Identity & Contact Details:** Your full name, email address, and Nigerian mobile telephone number (e.g. `0803...`).
2. **Operational & Location Information:** Your preferred pickup neighborhood (e.g. Lagos Island, Victoria Island, Ikeja, Lekki Phase 1), physical pickup/delivery addresses, and specific garment care instructions.
3. **Authentication & Security Data:** A cryptographically salted Argon2id password hash, session identifiers, and verification records. We never store or view your plaintext password.
4. **Subscription & Transaction Records:** Selected subscription plan tier, monthly item usage quotas, payment attempt references, payment gateway transaction identifiers (from Paystack or Flutterwave), and VAT-inclusive sales receipts. We do not store raw credit/debit card numbers or CVV security codes on our servers.
5. **Technical & Device Telemetry:** IP address, browser user-agent header, and essential security cookies (`swash_session`) used strictly to maintain your authenticated session and mitigate brute-force attacks.

---

## 3. Why We Collect Your Information and Our Lawful Basis

Under Section 25 of the NDPA 2023, Swash processes personal data under the following lawful bases:

| Purpose of Processing | Category of Data Used | Lawful Basis (NDPA 2023) |
|---|---|---|
| **Account Creation & Authentication:** Establishing your login credentials, verifying mailbox ownership, and managing active sessions. | Name, email address, password hash, session cookies. | **Contractual Necessity (s. 25(1)(b)):** Required to maintain your Swash account. |
| **Laundry Collection & Delivery:** Dispatching Swash logistics riders to your address, scheduling pickup windows, and providing garment care. | Phone number, residential address, garment care notes. | **Contractual Necessity (s. 25(1)(b)):** Required to fulfill laundry pickup and return. |
| **Subscription Billing & Invoicing:** Processing recurring subscription allowances and issuing official receipts. | Payment gateway references, transaction amounts, plan details. | **Contractual Necessity (s. 25(1)(b))** and **Legal Obligation (s. 25(1)(c)).** |
| **Operational & Account Security:** Rate limiting login attempts, preventing automated scrapers, and detecting hijacked sessions. | IP address, session timestamps, user-agent. | **Legitimate Interests (s. 25(1)(e)):** Protecting customer accounts and infrastructure. |
| **Statutory Tax & Accounting Compliance:** Maintaining audited sales ledgers for tax authorities (FIRS and LIRS). | Official receipts, transaction amounts in kobo, confirmed dates. | **Legal Obligation (s. 25(1)(c)):** Compliance with CAMA 2020 (s. 375). |

---

## 4. How Information Is Shared

Swash does not sell, lease, or rent customer personal information to third-party advertisers. Information is disclosed strictly to trusted operational partners necessary to provide the service:

- **Swash Dispatch Riders:** Provided with your first name, collection address, and phone number exclusively during active pickup and delivery windows.
- **Licensed Payment Processors:** Payments are processed through CBN-licensed gateways (such as Paystack or Flutterwave) using bank-grade TLS encryption.
- **Transactional Email Infrastructure:** Encrypted transactional SMTP services used to deliver your unique email verification codes and order updates.
- **Law Enforcement & Statutory Bodies:** Disclosed only where formally compelled by an enforceable Nigerian court order or statutory requirement.

---

## 5. Data Retention Periods

Swash enforces strict storage limitation rules under Section 24(1)(d) of the NDPA 2023:

- **Active Sessions:** Expire automatically after seven (7) days or immediately upon server-side logout.
- **Verification Codes:** Single-use codes expire automatically after fifteen (15) minutes and are permanently purged post-use.
- **Operational Garment Notes & Pickup Addresses:** Retained during your active subscription to streamline repeat pickups, and purged upon account deletion.
- **Financial Transaction Ledgers:** Retained for six (6) years from transaction date in accordance with Section 375 of Nigeria's Companies and Allied Matters Act (CAMA 2020).

---

## 6. Account Deletion, Grace Period, and Retention

You have the statutory right under Section 34 of the NDPA 2023 to request the closure of your account and erasure of your personal data.

### How Account Deletion Works in Practice
1. **Immediate Account Locking:** When you submit a deletion request via your account dashboard or by writing to support, your account is immediately locked. All active browser sessions and mobile logins are terminated instantly.
2. **14-Day Grace Period:** Your account is retained in a locked state for fourteen (14) days. This grace period guarantees that in-flight laundry collections currently at our processing facility or with dispatch riders can be safely delivered, and provides a recovery window if you initiated deletion by accident.
3. **Automated Scheduled Purge:** After 14 days, our automated deletion job executes:
   - Your name, mobile number, physical address, and password hash are permanently wiped.
   - Your email address is replaced with a non-routable synthetic identifier (`deleted_[id]@deleted.swash.ng`) so you will never receive further marketing or operational emails.
4. **Statutory Financial Retention Conflict (Anonymisation):**
   - Nigerian tax and corporate laws (CAMA 2020) legally prohibit companies from deleting audited financial transaction books.
   - To respect both your privacy and Nigerian tax law, Swash preserves the immutable payment figures, order numbers, and receipt identifiers, but **permanently removes all personally identifiable links**. The record is permanently anonymized to `Deleted Customer [UUID]`.
5. **Backup Lifecycle:** Encrypted disaster recovery database backups rotate out and are permanently overwritten on an automated thirty (30) day cycle.

---

## 7. How to Exercise Your Rights

Under the NDPA 2023, you have the right to:
- Access the personal information Swash holds about you.
- Request rectification of inaccurate or outdated information (e.g. updating a new Lagos phone number).
- Object to or restrict specific processing activities.
- Request account closure and erasure (as detailed above).

To exercise any of these rights, contact our Data Protection Officer:

**Swash Laundry Technologies Ltd**  
Attn: Data Protection Officer  
Email: privacy@swash.ng  
Physical Office: Lagos, Nigeria  

We respond to all verified statutory data requests within thirty (30) days without charge.

