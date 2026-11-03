# State Management Architecture in Swash

This document reviews the state management strategy for Swash, explains why external state-management libraries (such as Redux, Zustand, or MobX) were deliberately omitted, details the centralized `AuthContext` improvement implemented in Task 05, and identifies the threshold where more extensive state management would become necessary.

---

## 1. What State-Management Approach Swash Currently Uses

Swash relies on a hybrid architecture combining **React Server Components (RSC)** with **Targeted React Context and URL-Driven Search Parameters**:

1. **Server State (Ground Truth):**
   - User identity, active subscription allocations, completed payments, and laundry order statuses reside strictly in PostgreSQL and are queried on the server via Prisma ORM inside Server Components and API Route Handlers.
   - The server maintains sole authority over data mutations, session validity, and RBAC permissions.
2. **URL-Driven State (Routing & Navigation):**
   - Ephemeral view states that benefit from shareability and browser back/forward history are encoded in the URL search parameters (e.g. `/auth?mode=register`, `/auth?mode=login`, `/auth/verify?email=...`).
   - This eliminates client-side routing sync bugs and preserves state across mobile browser refreshes.
3. **Local Component State (`useState`, `useTransition`):**
   - Form inputs, validation errors, field blur touches, and visibility toggles are encapsulated within focused client components (e.g., `AuthForm.tsx`, `EnquiryForm.tsx`).
4. **Shared Application Session State (`AuthContext`):**
   - Implemented via a lightweight React Context (`src/context/AuthContext.tsx`) wrapped around the root application tree in `src/app/layout.tsx`.

---

## 2. The Problem the State Management Improvement Solves

### The Problem Before the Improvement
Prior to Task 05, the application had no shared authentication state. Each interface component was isolated:
- When a customer logged in at `/auth?mode=login`, the navigation header (`SiteHeader.tsx`) had no awareness that an active session had been established. It continued to render generic links ("Account", "Sign In").
- To see their signed-in state or access the customer portal, the user had to perform a full document reload or manually navigate to `/account`.
- Similarly, upon logging out or resetting a password, child components had no way to notify the header or peer views to clear cached user details, leaving stale account information rendered on screen until an explicit reload occurred.

### The Improvement Implemented
In Task 05, Swash implemented `AuthProvider` and `useAuth()` in `src/context/AuthContext.tsx`:
1. **Immediate Reactive Header Synchronization:** When `POST /api/auth` returns HTTP 200, `login(user)` immediately propagates the authenticated user context to `SiteHeader.tsx`, seamlessly updating the UI to display "Account", "Staff Portal" (for administrators), and "Sign Out".
2. **Centralized Server-Verified Logout:** `logout()` invokes `POST /api/auth/logout`, waits for server confirmation, clears the user state, and routes to `/auth?mode=login` without desynchronizing client and server.
3. **Soft Gating Reactivity:** The customer's verification status (`emailVerified`) is exposed globally. If the user completes verification at `/auth/verify`, calling `refresh()` instantly clears the amber verification warning on the `/account` dashboard without page reloads.

---

## 3. Why a Dedicated State-Management Library Was Not Necessary

Installing external state-management libraries (such as Redux Toolkit, Zustand, Recoil, or Jotai) was evaluated and **deliberately rejected**:

1. **Unjustified Bundle Size Overhead:** In Nigeria, where mobile users frequently operate on capped cellular data plans and 3G/4G connections, adding 15KB–45KB of state library boilerplate increases Time to Interactive (TTI) without providing measurable benefits for a transactional service application.
2. **Next.js App Router Alignment:** In modern Next.js, Server Components fetch data at the page level with automatic request deduplication and caching. Most state that developers historically placed in Redux (such as fetched customer profiles or order lists) is handled naturally by React Server Components on the server.
3. **Zero Additional Dependency Risk:** `AuthContext` relies entirely on built-in React primitives (`createContext`, `useContext`, `useState`, `useCallback`). It introduces zero third-party supply-chain risks, zero version incompatibilities with React 19, and zero extra maintenance overhead.

---

## 4. At What Point Would Swash Genuinely Need More Extensive State Management?

Swash would only justify introducing an external state-management library or dedicated client cache (such as TanStack Query or Zustand) if the application evolves to include:

1. **Complex Interactive Laundry Item Builder:** If customers interactively customize complex laundry baskets with real-time fabric classifications, stain treatments, weight calculations, and live price adjustments across a multi-step interactive modal wizard without saving to the database on every click.
2. **Real-Time Rider GPS Dispatch Tracking:** If Swash implements live WebSocket/SSE streaming showing the dispatch rider's motorcycle moving on an interactive Lagos map with sub-second position updates shared across concurrent tracking widgets.
3. **Offline-First Laundry Intake for Facility Staff:** If Swash facility workers at physical wash plants use a Progressive Web App (PWA) with local IndexedDB queuing to scan garment barcodes offline during power or internet outages and synchronize bi-directionally when connectivity resumes.

