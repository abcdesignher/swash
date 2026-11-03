# Swash Privacy Notice — Draft with Unsupported Broken Promise

This document preserves an initial, unedited draft of the Swash Privacy Notice containing an unsupported, legally flawed promise regarding account deletion and backup erasure. It documents the exact broken wording, analyzes why the implementation cannot fulfill it, and records the necessary correction implemented in the repository root `privacy.md`.

---

## 1. The Verbatim Draft Text (With Unsupported Promise)

Below is Section 6 of the early privacy draft as originally proposed:

> ### 6. Your Rights and Account Deletion
> Under the Nigeria Data Protection Act (NDPA) 2023, you have the right to request the deletion of your personal data at any time. 
> 
> When you click "Request Account Deletion" in your Swash dashboard, **our system guarantees that all your personal information, contact numbers, order histories, laundry care records, and payment records are immediately, completely, and permanently erased across all live production databases and all cloud backup archives within ten seconds of your request. Once deleted, no trace of your relationship with Swash remains on any server or backup file.**

---

## 2. Why This Promise Was Broken (Root Cause Analysis)

The bolded commitment above violates both technical realities and Nigerian legal statutory obligations in three distinct ways:

### 1. Technical Impossibility of Immediate Backup Erasure
Database backups in modern cloud architectures (e.g. daily WAL archives, PostgreSQL snapshots) are immutable, compressed binary images. A web application cannot selectively alter or surgically extract a single customer's rows from a cold, encrypted backup tape or object storage snapshot within 10 seconds without corrupting snapshot cryptographic hashes and restoration integrity. Backups must rotate out naturally over their established retention cycle (30 days).

### 2. Contradiction with the 14-Day Grace Period
The Swash engineering specification implements a **14-day soft-delete grace period**. When a customer clicks delete, the account is immediately locked to prevent unauthorized access or accidental orders, but data is preserved for 14 days so that customers who accidentally trigger deletion or have active laundry pickups in Lagos transit can contact support to recover their garments. Promising "instant physical erasure within ten seconds" contradicts the actual system architecture.

### 3. Violation of Nigerian Tax and Company Law (CAMA 2020)
Section 375 of Nigeria's Companies and Allied Matters Act (CAMA 2020) and Federal Inland Revenue Service (FIRS) regulations legally compel Swash to preserve books of account, sales receipts, and payment logs for a minimum of **six (6) years**. If Swash physically destroyed all payment rows within 10 seconds, Swash would be guilty of unlawful financial record destruction during corporate tax audits.

Furthermore, under Section 34(3)(a) of the NDPA 2023, data erasure rights are explicitly overridden by statutory legal obligations. Swash complies by **anonymizing** financial ledgers, not erasing them completely.

---

## 3. The Corrected, Truthful Promise

In the official repository root [`privacy.md`](../../privacy.md), the broken promise was replaced with clear, truthful, and legally compliant language:

> ### 6. Account Deletion, Grace Period, and Retention
> You have the right to request account closure and data erasure under Section 34 of the Nigeria Data Protection Act (NDPA) 2023.
> 
> **How Deletion Works in Practice:**
> 1. **Immediate Account Locking:** Upon submitting your deletion request, your account is locked immediately and all active browser sessions are terminated.
> 2. **14-Day Grace Period:** Your data is retained in a locked state for fourteen (14) days to allow for the completion of in-flight laundry deliveries and to give you time to contact customer support if the request was made in error.
> 3. **Data Purge and Anonymisation:** Following the 14-day grace period, our scheduled automated deletion process permanently purges your personal contact details, residential pickup addresses, and credentials.
> 4. **Statutory Financial Records:** In compliance with Section 375 of Nigeria's Companies and Allied Matters Act (CAMA 2020), payment receipts and completed order numbers are retained for six (6) years for statutory tax audit purposes, but are permanently stripped of all personal names, phone numbers, and addresses (anonymised).
> 5. **Backup Lifecycle:** Encrypted disaster-recovery database backups rotate out and are destroyed automatically within thirty (30) days.

