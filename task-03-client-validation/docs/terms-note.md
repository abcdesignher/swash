# Terms of Service and Privacy Notice Wording Origin

This note documents the origin, scope, and legal review status of the terms-acceptance wording used in [`src/components/AuthForm.tsx`](../../src/components/AuthForm.tsx).

---

## 1. Wording Used in the Interface

Checkbox label (`#auth-accept-terms`):
> **I agree to the Swash Laundry Subscription Terms of Service and Privacy Notice**

Associated summary helper (`#auth-terms-summary`):
> **Covers scheduled collection windows, garment care liability, and NDPA-compliant customer record handling.**

---

## 2. Origin of the Wording

- The checkbox consent pattern and summary clauses are adapted from standard **Nigeria Data Protection Act (NDPA) 2023** affirmative-consent templates (requiring an unticked-by-default checkbox with a clear statement of the processing purpose) combined with the operational scope defined in the approved Swash business brief (`task-01-design-system/docs/business-brief.md`: subscription allowances, scheduled collections/deliveries, and connected customer records).
- The checkbox is **unchecked by default** (`useState(false)`) so consent is never pre-ticked or assumed.

---

## 3. Legal Review Disclaimer

> **Important:** The terms-acceptance label and summary wording implemented in this engineering task are derived from standard NDPA consent conventions and the approved Swash product specification for educational and engineering verification purposes. **They do not constitute verified legal advice.** Before commercial launch in Nigeria, the full Terms of Service and Privacy Policy (including garment damage liability caps, unclaimed laundry retention periods, and NDPA data-controller disclosures) must be reviewed and approved by qualified Nigerian legal counsel and a certified Data Protection Compliance Organisation (DPCO).

