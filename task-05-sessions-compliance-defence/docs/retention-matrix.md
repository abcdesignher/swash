# Swash Data Retention Matrix and Compliance Architecture

This document defines the comprehensive data retention and erasure matrix for Swash (operating in Lagos, Nigeria), grounded in the **Nigeria Data Protection Act (NDPA) 2023**, the **Companies and Allied Matters Act (CAMA) 2020**, and Nigerian commercial and tax regulations.

---

## 1. Statutory and Legal Foundation in Nigeria

Swash processes customer personal data under the lawful bases defined in Section 25 of the NDPA 2023. When evaluating data retention, account deletion, and post-service record preservation, Swash balances two primary Nigerian statutory obligations:

1. **NDPA 2023 (Storage Limitation & Right to Erasure):**
   - **Section 24(1)(d):** Personal data must not be stored longer than is necessary to achieve the specific purposes for which it was collected.
   - **Section 34:** Grants data subjects the right to request erasure of their personal data without undue delay.
   - **Section 34(3)(a):** Explicitly restricts the right to erasure where retention is necessary for *compliance with a legal obligation* to which the data controller is subject, or for the establishment, exercise, or defense of legal claims.

2. **CAMA 2020 & Companies Income Tax Act (CITA / FIRS):**
   - **Section 375 of CAMA 2020:** Companies must maintain accounting records and transactional documentation for **at least six (6) years** from the date they were made.
   - **Federal Inland Revenue Service (FIRS) Audit Rules:** Value Added Tax (VAT) and corporate revenue audits require verifiable receipt ledgers matching electronic payment settlements.

---

## 2. Comprehensive Database Retention Matrix

| Model / Table | Column / Attribute Group | Retention Status Upon Deletion | Justification & Legal / Business Basis | Retention Period | Anonymisation Strategy |
|---|---|---|---|---|---|
| **`User`** | `fullName`, `phone`, `defaultPickupZone` | Purged / Anonymised | PII not required post-service. NDPA 2023 Section 24(1)(d). | Active until grace period (14 days) expires. | Overwritten with `Deleted Customer [UUID]`, phone replaced with `00000000000`. |
| **`User`** | `email` | Purged / Anonymised | Unique index identifier. Replaced with non-routable synthetic string to prevent re-contact. | 14 days grace period. | Overwritten with `deleted_[cuid]@deleted.swash.ng`. |
| **`User`** | `passwordHash` | Purged | Security risk to retain obsolete credentials. | Deleted immediately or set to `DELETED_ACCOUNT_DISABLED_HASH`. | Replaced with disabled token string. |
| **`User`** | `role`, `acceptedTermsAt`, `createdAt` | Retained (anonymised record) | Compliance audit trail proving historical legal consent prior to account termination. | 6 years (CAMA 2020). | Retained alongside anonymised user ID. |
| **`Session`** | All columns (`id`, `tokenHash`, `ipAddress`, `userAgent`, `expiresAt`, `revokedAt`) | **Purged (Hard Delete)** | Authentication bearer records present zero ongoing utility once an account is closed. | Purged immediately upon deletion request execution. | Not applicable (physical row deletion). |
| **`VerificationCode`**| All columns (`codeHash`, `email`, `purpose`, `usedAt`, `expiresAt`) | **Purged (Hard Delete)** | Transient single-use OTPs; security liability if preserved. | Purged immediately upon account deletion or 15 minutes post-expiry. | Not applicable (physical row deletion). |
| **`LaundryOrder`** | `pickupAddress`, `specialItemsNotes` | **Purged (Hard Delete or Nullified)** | Customer physical residence and garment care instructions are sensitive PII with zero ongoing post-delivery tax relevance. | Retained during active delivery; nullified upon account hard deletion. | Set to `[ADDRESS PURGED]`, notes cleared to `NULL`. |
| **`LaundryOrder`** | `orderNumber`, `itemCount`, `serviceTier`, `status`, `scheduledPickupAt`, `deliveredAt` | **Retained (Anonymised)** | Operational fulfillment evidence. Required to reconcile operational dispatch logs against payment receipts for tax and carrier insurance audits. | 6 years from order completion (CAMA 2020 s. 375). | Retained linked to anonymised customer ID. |
| **`PaymentAttempt`** | `providerReference`, `amountKobo`, `channel`, `status`, `failureCode` | **Retained** | Payment gateway transaction history. Required to investigate dispute chargebacks, fraud investigations, and reconciliation with Paystack/Flutterwave. | 6 years (CBN Consumer Protection & CAMA). | Linked to anonymised user record; IP address cleared. |
| **`Payment`** | `receiptNumber`, `providerReference`, `amountKobo`, `currency`, `confirmedAt` | **Retained** | Primary financial accounting ledger. Immutable statutory tax record for FIRS and Lagos State Internal Revenue Service (LIRS). | 6 years minimum from transaction date. | Immutable accounting row preserved; customer name anonymised on master user table. |
| **`Payment`** | `customerEmailSnapshot` | **Retained (Hashed/Masked)** | Payment gateway receipt verification. | 6 years. | Truncated/masked to `d***@deleted.swash.ng`. |
| **`Subscription`** | `planTier`, `itemAllowance`, `priceKobo`, `currentPeriodStart`, `currentPeriodEnd` | **Retained (Anonymised)** | Recurring revenue accounting; proves contracted allowance vs. utilized allowance. | 6 years. | Linked to anonymised user ID. |
| **`EmailJob`** | `toEmail`, `subject`, `payloadJson`, `sentAt` | **Purged (Hard Delete)** | Transient outbound communication queue. Retaining emails post-account closure violates NDPA data minimisation. | Purged after 30 days of completion or immediately upon deletion job execution. | Physical deletion from database. |
| **`KnowledgeChunk`** | All columns (`documentSlug`, `sectionTitle`, `content`) | **Retained** | Ground truth operational business policies for AI assistant; contains zero customer personal data. | Indefinite (maintained with business documentation). | Not applicable (contains no PII). |
| **Application Logs** | HTTP request logs, server error traces, IP addresses | **Retained with Rotation** | Security incident response, brute-force mitigation, and server performance monitoring. | 90 days rotation window. | IP addresses aggregated/rotated after 90 days. |

---

## 3. Database Backups and the Deletion Lifecycle

In a resilient production PostgreSQL architecture (e.g. daily WAL archives and pg_dump snapshots):

### Where Backups Are Stored
- Primary snapshots and Write-Ahead Log (WAL) streams are stored in encrypted, immutable cloud object storage (e.g., AWS S3 or GCP Cloud Storage with SSE-KMS encryption) in a compliant regional bucket with strict access controls.

### Backup Cadence
- Continuous WAL archiving with Point-in-Time Recovery (PITR) up to 14 days.
- Full daily encrypted snapshots taken at 02:00 WAT (West Africa Time).

### How Deletion Requests Are Reflected in Backup Retention
- **Physical impossibility of selective backup alteration:** Database backups are linear block-level or compressed binary archives. It is computationally infeasible and corrupts cryptographic backup integrity to mount an encrypted historical archive, locate an individual user's record, and rewrite the snapshot.
- **Natural Cycle Purge:** Swash establishes an automated backup retention lifecycle: daily snapshots are automatically expired and permanently deleted after **30 days**.
- Therefore, within 30 days of the scheduled deletion job executing in PostgreSQL, all historical backup archives containing the old un-anonymized records naturally rotate out and are destroyed.

### What Happens When a Backup Is Restored (Disaster Recovery Protocol)
If a catastrophic primary database outage forces Swash to restore a 7-day-old backup snapshot:
1. The restored database will temporarily contain records of accounts that requested deletion during that 7-day window.
2. **Immediate Remediation via Deletion Ledger:** Swash maintains an append-only cryptographic `DeletionLog` recording `userId`, `deletedAt`, and `status`.
3. As part of the standard post-restore checklist, the system automatically runs:
   ```cmd
   npm run job:account-deletion
   ```
4. The deletion job immediately scans the restored database against the deletion registry, re-locking restored accounts and re-executing hard deletes and anonymizations before customer traffic is routed back to the cluster.

---

## 4. The Genuine Retention Conflict: Right to Erasure vs. Statutory Tax Ledgers

### The Conflict Scenario
A customer registers with Swash, purchases a 3-month Family Laundry Subscription (₦135,000 NGN paid via Paystack), completes 4 weekly laundry collections across Lagos, and subsequently submits an account deletion request under NDPA 2023 Section 34 demanding:
> *"I revoke consent. You must permanently delete every single record, payment history, and database row that contains or refers to my transactions."*

### Why Immediate Total Erasure Cannot Be Granted
1. **Statutory Tax Obligation:** Section 375 of Nigeria's Companies and Allied Matters Act (CAMA 2020) and FIRS tax enforcement regulations make it a criminal financial offense for a registered company to delete sales receipts, VAT accounting entries, or payment settlement ledgers prior to the statutory **6-year limitation period**.
2. **Payment Gateway Disputability:** Under CBN consumer protection rules, cardholders can initiate chargeback disputes through their issuing banks up to 120 days post-transaction. If Swash destroyed all payment attempt records and order numbers, Swash could not defend against fraudulent chargebacks.
3. **Statutory Exemption under NDPA:** Section 34(3)(a) of the NDPA 2023 explicitly provides that a data controller is **exempt** from total erasure obligations where data processing is required by another applicable statute.

### Resolution: Anonymisation Over Total Destruction
Swash resolves the statutory conflict by strictly separating **Personally Identifiable Information (PII)** from **Immutable Financial Records**:
- **What is Purged:** Full name, mobile phone number, physical residential pickup address, delivery notes, session tokens, and verification codes are completely and irreversibly purged from PostgreSQL.
- **What is Retained:** The financial ledger entries (`Payment.amountKobo`, `Payment.receiptNumber`, `LaundryOrder.orderNumber`, `LaundryOrder.status = "COMPLETED"`) are preserved, but stripped of personal identifiers and linked to an anonymized placeholder (`Deleted Customer [UUID]`).
- **Legal Compliance:** FIRS auditors can inspect legitimate company books, while the former customer is completely protected against re-identification, marketing contact, or data breach leakage.

