# SPA Form Consolidation Rationale (`/auth?mode=register` & `/auth?mode=login`)

This document explains why Swash's registration and sign-in forms were consolidated into a single `/auth` route (`src/app/auth/page.tsx` and `src/components/AuthForm.tsx`) controlled by the `?mode=` URL query parameter, what the experience was before consolidation, and when separate pages would be preferable.

---

## 1. Experience Before Consolidation (`evidence/01-page-count-before.txt`)

Before consolidation, registration and sign-in lived in two separate App Router page files (`src/app/register/page.tsx` and `src/app/login/page.tsx`, resulting in 4 total `page.tsx` routes across `src/app`).

- **Duplicated Layout & Shared State:** Both pages rendered the same header, card shell, email input, password input with visibility toggle, and error/status banners, duplicating markup and validation wiring.
- **Slower Transitions on Unreliable Connections:** When a returning Nigerian customer landed on `/register` and clicked "Sign In" (or a new customer landed on `/login` and clicked "Create Account"), the browser had to fetch a separate route bundle. On high-latency 3G/4G connections in Lagos, this caused visible layout flicker and lost any email address the user had already typed.

---

## 2. Why the Query-Parameter Consolidation Approach Was Chosen (`evidence/02-page-count-after.txt` & `03-url-states.png`)

By consolidating both states into `src/app/auth/page.tsx` (`Total page.tsx route files: 3`) and reading `useSearchParams().get("mode")` (`?mode=register` vs. `?mode=login`):

1. **Instant Client-Side Switching Without Full Page Reload (`evidence/04-form-switch-logs.txt`):**
   - Toggling between **Create Account** (`/auth?mode=register`) and **Sign In** (`/auth?mode=login`) via `router.replace("/auth?mode=...", { scroll: false })` swaps the rendered fields in memory in `< 5 ms` with zero full document reloads.
   - If a user begins typing their email address on `Create Account` and realises they already have an account, switching to `Sign In` preserves the typed `email` state in the shared component.
2. **Deep-Linkable and Shareable URL States (`evidence/03-url-states.png`):**
   - Unlike purely internal React state (`useState("login")`) that resets on refresh, storing the mode in the URL query parameter (`?mode=login` vs. `?mode=register`) ensures that refreshing the browser, using the Back/Forward buttons, or bookmarking the sign-in screen lands on the exact intended form state.
3. **Zero Unnecessary Session Creation on Mode Switch (`evidence/04-form-switch-logs.txt`):**
   - Switching between `?mode=register` and `?mode=login` only updates the client URL and conditionally renders fields; it triggers zero `POST /api/auth` requests and creates zero database rows or server sessions until the user explicitly submits valid credentials.

---

## 3. One Situation Where Separate Pages Would Be Preferable

Separate routes (`/register` and `/login`, or a multi-step `/onboarding/*` route tree) would be preferable **when registration is a heavy, multi-step commercial onboarding flow**—for example, if Swash later adds a **Corporate / Hotel Linen Account Registration** requiring business CAC registration document uploads, multi-branch pickup address mapping, and billing contract approval.

In that scenario:
- Bundling heavy file-upload and map-picker JavaScript into the `/login` page would penalise returning customers who only need a fast two-field sign-in over a slow mobile connection.
- Separate routes also allow strict server-level middleware, distinct Content-Security-Policy (CSP) headers, or independent analytics conversion funnels per path without query-string parsing.

