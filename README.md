# Swash

## 1. What Swash Is and Who It Serves

**Swash** is an African-first, subscription-led laundry service in Nigeria serving individuals, families, and small businesses.

Its primary audience is busy Nigerian professionals aged 25–40 who primarily use laptops and desktop computers and may experience slow or unreliable internet connections. Swash connects laundry orders, payments, subscription allowances, and collection or delivery arrangements into one reliable web experience, supported by an AI assistant grounded in approved business information and authorised customer records.

---

## 2. Current Project Status

| Component / Task | Status | Summary |
| --- | --- | --- |
| **Task 01: Design System** (`task-01-design-system/`) | **Complete** | Exported 462 Figma design tokens (`06-tokens-complete.json`), generated `:root` CSS custom properties (`styles/global.css`), verified WCAG 2.1 contrast ratios, and documented typography, shadows, divergences, and defects. |
| **Task 02: Repository & Scaffold** (`task-02-repository-and-scaffold/` & Root App) | **In Progress / Active** | Next.js App Router + TypeScript + Prisma + PostgreSQL scaffold running at the repository root with the Swash home screen (`/`), `ServiceEnquiry` PostgreSQL persistence (`POST /api/enquiries`), and diagnostic evidence. |
| **Task 03: Client Validation** (`task-03-client-validation/`) | **Not Started** | Consolidated authentication forms, client-side validation rules, and screen-reader accessibility audit scheduled for Task 03. |
| **Task 04: Server Security** (`task-04-server-security/`) | **Not Started** | Full relational schema (users, sessions, orders, payments, payment attempts), Argon2id/bcrypt hashing, Zod validation, rate limiting, and email verification scheduled for Task 04. |
| **Task 05: Sessions & Compliance** (`task-05-sessions-compliance-defence/`) | **Not Started** | Server-side sessions, middleware, repeat-safe account deletion job, retention matrix, and admin authorisation scheduled for Task 05. |

**What Currently Works:**
- Design token pipeline (`task-01-design-system/styles/global.css`) consumed by the Next.js application (`src/app/globals.css`, `src/app/page.module.css`) with zero raw hex values or primitive token leaks.
- Minimal Swash home screen rendered at `/` (`src/app/page.tsx`).
- Service enquiry form (`src/components/EnquiryForm.tsx`) and API Route Handler (`POST /api/enquiries` in `src/app/api/enquiries/route.ts`) that validates required fields, writes `ServiceEnquiry` rows to PostgreSQL via Prisma, returns HTTP `201 Created`, and surfaces explicit error states (`500` / `400`) without false success when the database is unavailable.

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

---

## 6. What the Application Deliberately Does Not Do Yet

To respect the phased engineering scope across Tasks 1–5, the application currently **does not** implement:
- Customer registration, login, password hashing, or session cookies (scheduled for Tasks 03–05).
- Subscription plan checkout, allowance deductions, or rollover calculations.
- Laundry order scheduling, pickup/delivery tracking, or payment gateway webhooks.
- Staff administrative dashboards or role-based access middleware (scheduled for Task 05).
- The RAG-powered AI customer assistant.

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
