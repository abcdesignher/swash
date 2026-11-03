# Transactional Email Design & Copy Review (Task 04, Step 11)

## 1. Design System Alignment & Token Mapping

The Swash transactional email template implemented in [`src/lib/email.ts`](../../src/lib/email.ts) adheres to the approved Swash design tokens ([`task-01-design-system/evidence/06-tokens-complete.json`](../../task-01-design-system/evidence/06-tokens-complete.json)):

| Design Role | Token / Value | Application in Email |
|---|---|---|
| **Primary Brand Accent** | `--primitive-colour-palette-primary-10` (`#1d064a`) | Header gradient start, main title, primary body headings |
| **Secondary Brand Tone** | `--primitive-colour-palette-primary-20` (`#350078`) | Header gradient finish, code container text |
| **Surface Accent** | `--primitive-colour-palette-primary-95` (`#f5eeff`) | Verification code callout box background |
| **Border Highlight** | `--primitive-colour-palette-primary-50` (`#7044c0`) | Verification code container dashed border |
| **Neutral Background** | `--primitive-colour-palette-neutral-98` (`#faf8fd`) | Email outer canvas background, footer background |
| **Surface Card** | `--primitive-colour-palette-neutral-100` (`#ffffff`) | Centered content container (max-width: 560px) |
| **Typography** | `Open Sans`, system fallback stack | Clean, accessible reading across all desktop and mobile email clients |
| **Code Display** | Monospace (`Courier New`), 36px, `letter-spacing: 8px` | Maximum visual clarity for reading and copy-pasting 6 digits |

---

## 2. Copywriting Critique & Security Guidance

### Strengths of the Current Copy
1. **Personalised & Direct:** Greets the customer by their registered `fullName`, reassuring the customer that the email originates from their recent signup action.
2. **Action-Oriented Code Placement:** The 6-digit code is placed prominently in a centered highlight box above the fold so users on mobile notifications can view it without excessive scrolling.
3. **Explicit Fraud Prevention:** Explicitly warns customers: *"Never share this code. Swash dispatch riders and staff will never ask for your verification code."* This directly mitigates phone-call impersonation scams where malicious actors pose as dispatch riders requesting OTPs.
4. **Time & Attempt Clarity:** Clearly states the 15-minute expiration window and 5-attempt limit, setting accurate customer expectations.

---

## 3. Pre-Production Review Checklist (Before Sending to Real Customers)

Before pointing outbound SMTP to real Nigerian customer mailboxes, the following items must be verified:

1. **Email Authentication (SPF, DKIM, DMARC):**
   - Ensure the sending domain (`@swash.com.ng`) has strict SPF (`v=spf1 ... -all`), 2048-bit DKIM signatures, and a DMARC policy (`p=quarantine` or `p=reject`) configured to prevent domain spoofing and spam-folder delivery in Gmail and Yahoo.
2. **Physical Address in Footer (CAN-SPAM & NDPA):**
   - Replace the generic *"Lagos, Nigeria"* placeholder with Swash's registered operational headquarters address (e.g. *Plot 12, Admiralty Way, Lekki Phase 1, Lagos*).
3. **Dedicated Unsubscribe & Support Links:**
   - Add a direct link to Swash Customer Support (`support@swash.com.ng` or WhatsApp business hotline) for users experiencing sign-in issues.
4. **Dark Mode Client Testing:**
   - Test rendering in Apple Mail, Outlook for Windows, and Gmail Android dark modes to ensure inverted contrast maintains the required 4.5:1 WCAG AA readability.

