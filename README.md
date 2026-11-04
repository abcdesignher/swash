# Swash

## 1. What Swash Is and Who It Serves

**Swash** is an African-first, subscription-led laundry service in Nigeria serving individuals, families, and small businesses.

Its primary audience is busy Nigerian professionals aged 25–40 who primarily use laptops and desktop computers and may experience slow or unreliable internet connections. Swash connects laundry orders, payments, subscription allowances, and collection or delivery arrangements into one reliable web experience, supported by an AI assistant grounded in approved business information and authorised customer records.

---

## 2. Current Project Status

| Component / Task | Status | Summary |
| --- | --- | --- |
| **Task 01: Design System** (`task-01-design-system/`) | **Complete** | Exported 462 Figma design tokens (`06-tokens-complete.json`), generated `:root` CSS custom properties (`styles/global.css`), verified WCAG 2.1 contrast ratios, and documented typography, shadows, divergences, and defects. |
| **Task 02: Repository & Scaffold** (`task-02-repository-and-scaffold/` & Root App) | **Complete** | Next.js App Router + TypeScript + Prisma + PostgreSQL scaffold running at the repository root with `/` and `/plans` routes, `ServiceEnquiry` PostgreSQL persistence (`POST /api/enquiries`), information-design and `clamp()` responsive typography merged from [`feat/information-design`](https://github.com/abcdesignher/swash/pull/1) ([diff](https://github.com/abcdesignher/swash/compare/72a160a...feat/information-design)), and complete diagnostic evidence (`01`–`20`). |
| **Task 03: Client Validation** (`task-03-client-validation/` & Root App) | **Complete** | Consolidated `/auth` route (`?mode=register` and `?mode=login`) with client-side validation across 4 categories, `<input type="tel" inputMode="numeric">` for Nigerian mobile numbers, enumeration-resistant login, WCAG accessibility fixes (`⚠` icons, `aria-invalid`, `aria-describedby`, `role="alert"`, `role="tablist"`), progressive passphrase guidance, password visibility toggle, adversarial browser + `curl` bypass tests, and commit-SHA rollback (`01`–`17`). |
| **Task 04: Server Security** (`task-04-server-security/` & Root App) | **Complete** | Full relational PostgreSQL schema (9 models), forward-only migrations, Argon2id password hashing (`m=19456, t=2, p=1`), server-side Zod request boundary validation on `POST /api/auth`, sliding-window rate limiting (5 attempts/15 mins), privacy-preserving breached password checking (HIBP $k$-anonymity), CSPRNG email verification code lifecycle with atomic tracking, background `EmailJob` delivery queue, and verified evidence (`01`–`23`). |
| **Task 05: Sessions & Compliance** (`task-05-sessions-compliance-defence/` & Root App) | **Complete** | Cryptographic 256-bit CSPRNG bearer sessions with SHA-256 database token hashes and defensive cookie flags (`HttpOnly`, `SameSite=Lax`), soft/hard registration gating with dynamic 2-minute resend countdown timer, identical generic error defense against credential probing, multi-session revocation on password reset, idempotent 14-day scheduled account deletion job compliant with CAMA 2020 (s. 375) and NDPA 2023 (s. 34), Next.js RBAC route protection (`/admin` 403 Forbidden), zero-dependency reactive state management (`AuthContext`), root `privacy.md`, and complete verified evidence (`01`–`16`). |

**What Currently Works:**
- Design token pipeline (`task-01-design-system/styles/global.css`) consumed by the Next.js application (`src/app/globals.css`, `src/app/page.module.css`) with zero raw hex values or primitive token leaks.
- Minimal Swash home screen rendered at `/` (`src/app/page.tsx`), subscription plans at `/plans` (`src/app/plans/page.tsx`), and staff console at `/admin` (`src/app/admin/page.tsx`).
- Service enquiry form (`src/components/EnquiryForm.tsx`) and API Route Handler (`POST /api/enquiries` in `src/app/api/enquiries/route.ts`) with PostgreSQL persistence and explicit error handling.
- Consolidated customer authentication route at `/auth` (`?mode=register` and `?mode=login`) with accessible client-side validation, Nigerian mobile number support, WCAG-compliant error icons, password visibility toggle, and instant error clearing on input change.
- Server-side data integrity & security: PostgreSQL relational database models (`prisma/schema.prisma`), RFC 9106 Argon2id password hashing, Zod validation preventing direct API bypass, sliding-window rate limiting with HTTP 429 and `Retry-After`, HIBP breached password detection, CSPRNG verification code issuing and redemption with single-use atomic consumption, background asynchronous `EmailJob` processing, and `/auth/verify` email verification interface.
- Cryptographic session management (`src/lib/session.ts`): 256-bit CSPRNG bearer tokens with SHA-256 database hashing, server-authoritative logout, and concurrent session termination on password reset.
- Gated subscriber dashboard at `/account` (`src/app/account/page.tsx`): soft gating notice for unverified accounts, password change form (verifying current password, new password, and confirmation), and NDPA 2023 Danger Zone for account deletion with a 14-day grace period.
- Idempotent scheduled account deletion background job (`src/lib/deletion-job.ts`): immediately locks deleted customer profiles, revokes all sessions, and anonymises statutory sales receipts under CAMA 2020 s. 375 while purging non-essential PII.
- Role-Based Access Control (RBAC): `/admin` strictly refuses ordinary customers with HTTP 403 Forbidden.
- Zero-dependency client-side session reactivity: `AuthContext` (`src/context/AuthContext.tsx`) seamlessly synchronises navigation state (Sign In vs Account/Sign Out) across all pages without layout shift.

---

## 3. Technology Stack and Reasons for Each Choice

| Technology | Role | Why Chosen for Swash |
| --- | --- | --- |
| **Next.js 15 (App Router)** | Full-stack web framework | Server Components minimise client-side JavaScript bundles for Nigerian users on slower mobile data or Wi-Fi connections, while Route Handlers keep database and security logic strictly on the server. |
| **TypeScript** | Language & static type checker | Enforces compile-time contracts across UI props, API payloads, and generated Prisma database types, preventing runtime property mismatches across customer and staff workflows. |
| **Prisma ORM** | Database client & schema toolkit | Provides a single declarative schema (`prisma/schema.prisma`), type-safe queries, and controlled forward-only migrations to keep orders, payments, and subscriptions consistent. |
| **PostgreSQL** | Primary relational database | ACID transactions, foreign-key constraints, and relational integrity guarantee that orders, payment attempts, confirmed payments, and subscription allowances never fall out of sync. |
| **CSS Modules + CSS Custom Properties** | Styling architecture | Consumes the exported Figma token variables (`task-01-design-system/styles/global.css`) natively in the browser with zero runtime CSS-in-JS overhead. |

---

## 4. Exact Setup Instructions

### Prerequisites
- **Node.js** `v20+` (tested on `v24.19.0`)
- **PostgreSQL** database (local PostgreSQL instance or free-tier hosted PostgreSQL such as Neon, Supabase, or Prisma Postgres)

### Step-by-Step Local Setup

1. **Clone the repository and open the root directory:**
   ```cmd
   git clone <repository-url>
   cd swash
   ```

2. **Install dependencies:**
   *(Note: On Windows PowerShell where `.ps1` script execution is restricted, use `npm.cmd` and `npx.cmd` instead of `npm` and `npx`.)*
   ```cmd
   npm.cmd install
   ```

3. **Create your local `.env` file from the template:**
   ```cmd
   copy .env.example .env
   ```
   Open `.env` and set `DATABASE_URL` to your PostgreSQL connection string.

4. **Generate the Prisma Client and sync the database schema:**
   ```cmd
   npx.cmd prisma generate
   npx.cmd prisma db push
   ```

5. **Start the Next.js development server:**
   ```cmd
   npm.cmd run dev
   ```
   Open **http://localhost:3000** in your browser.

6. **Inspect database records (optional):**
   ```cmd
   npx.cmd prisma studio
   ```

---

## 5. Environment Variables

| Variable Name | Required | Consumed By | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `prisma/schema.prisma`, `src/lib/prisma.ts` | PostgreSQL connection URI used by Prisma ORM to read and write application records (`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`). Never commit actual credentials. |
| `SMTP_HOST` | No (dev fallback) | `src/lib/email.ts` | Outbound SMTP server hostname (e.g., `smtp.gmail.com` or Ethereal test server). |
| `SMTP_PORT` | No | `src/lib/email.ts` | Outbound SMTP server port (e.g., `587` for STARTTLS or `465` for SSL). Defaults to `587`. |
| `SMTP_USER` | No | `src/lib/email.ts` | Outbound SMTP username or authenticated sender email address. |
| `SMTP_PASS` | No | `src/lib/email.ts` | Outbound SMTP password or Google App Password. |
| `EMAIL_FROM` | No | `src/lib/email.ts` | Friendly sender header (e.g., `"Swash Laundry" <noreply@swash.ng>`). |
| `NODE_ENV` | Optional | Application runtime | Runtime environment identifier (`development`, `production`, `test`). |

---

## 6. What the Application Deliberately Does Not Do Yet

To respect the phased engineering scope across Tasks 1–5, the application currently **does not** implement:
- Subscription plan checkout, allowance deductions, or rollover calculations (scheduled for operational billing phase).
- Laundry order scheduling, pickup/delivery tracking, or payment gateway webhooks (scheduled for operations phase).
- The RAG-powered AI customer assistant (scheduled for subsequent AI assistant task).

---

## 7. Known Defects (With File References)

1. **Font-Family Export Anomaly (`Inter` in Open Sans Group):**
   - **Reference:** `task-01-design-system/evidence/06-tokens-complete.json` (`typography.open sans.headline.headline small`), `task-01-design-system/styles/global.css` (line 267), and `task-01-design-system/docs/defects.md` (lines 15–20).
   - **Detail:** `open sans.headline.headline small` exported from Figma with `fontFamily: "Inter"` instead of `"Open Sans"`. Preserved as exported to maintain fidelity with the JSON source of truth.
2. **Primary Role Contrast Ratio (`4.41:1`) Below WCAG AA for Normal Text:**
   - **Reference:** `task-01-design-system/styles/global.css` (lines 146, 158–159), `task-01-design-system/docs/colour-roles.md` (line 147), and `task-02-repository-and-scaffold/docs/defects.md` (lines 38–45).
   - **Detail:** `--colour-primary-role` (`#e81313ff`) vs. `--colour-on-primary-role` (`#fcf8ffff`) yields `4.41:1` (passing WCAG AA `3:1` for large text, but below `4.5:1` for normal text). Normal-sized interactive buttons in `src/app/page.module.css` (lines 221–222) use `--colour-on-inverse-primary-role` (`#350078ff`) on `--colour-inverse-primary-role` (`#e9ddffff`, `11.42:1` AAA) to guarantee accessible contrast.
3. **Absence of Spacing, Layout Width, and Border-Radius Tokens in Export:**
   - **Reference:** `task-01-design-system/evidence/06-tokens-complete.json`, `src/app/page.module.css` (lines 7, 14, 77, 81), and `task-02-repository-and-scaffold/docs/defects.md` (lines 28–35).
   - **Detail:** The Figma token export includes colour, typography, and shadow tokens, but no spacing or border-radius tokens. Layout containers use structural `rem` values without inventing unauthorized CSS variables.
4. **Shadow Blur Documentation Discrepancy (Historical):**
   - **Reference:** `task-01-design-system/docs/shadows.md` (line 28) and `task-01-design-system/docs/defects.md` (lines 23–27).
   - **Detail:** Earlier documentation noted a `28px` blur for the medium shadow whereas `06-tokens-complete.json` exports `radius: 25`. `styles/global.css` (line 521) strictly uses `25px` from the JSON export.
