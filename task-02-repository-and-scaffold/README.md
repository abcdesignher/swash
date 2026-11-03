# Task 2: Repository, Scaffolding and Application Diagnostics

## Overview
Established the **Swash** Next.js (App Router) + TypeScript + Prisma + PostgreSQL application scaffold at the repository root, built the token-compliant home screen and service enquiry persistence flow (`POST /api/enquiries`), and executed controlled failure-and-recovery diagnostics across directory structure, network ports, routing, and database connectivity.

---

## What Was Implemented

1. **Application Scaffold & Design System Integration:**
   - Configured Next.js 15 (`App Router`), strict TypeScript (`tsconfig.json`), and Prisma ORM (`prisma/schema.prisma`) at the repository root (`package.json`, `next.config.ts`, `.env.example`, `.gitignore`).
   - Connected `src/app/globals.css` directly to `task-01-design-system/styles/global.css` via `@import`, preserving a single source of truth with zero raw hex values or direct primitive colour usages.
2. **Minimal Swash Home Screen & PostgreSQL Persistence:**
   - Built `src/app/page.tsx` and `src/app/page.module.css` consuming semantic colour roles (`var(--colour-*)`), typography tokens (`var(--typography-*)`), and brand-tinted shadows (`var(--shadow-*)`).
   - Added the `ServiceEnquiry` model in `prisma/schema.prisma`, Prisma singleton in `src/lib/prisma.ts`, API Route Handler in `src/app/api/enquiries/route.ts` (returning HTTP `201 Created` on insert and `400`/`500` on validation or database failure), and accessible client form in `src/components/EnquiryForm.tsx` that preserves user input on failure and never displays false success.
3. **Controlled Environment Failures & Recoveries:**
   - **Nested folder error (`ENOENT`):** Captured and recovered via manual directory change and root relocation (`evidence/05-nested-folder-error.txt`, `evidence/06-nested-folder-fixed.txt`).
   - **Port 3000 conflict:** Captured port collision (`PID 42648`), inspected sockets with `netstat -ano | findstr :3000`, and documented termination and restart (`evidence/07-port-conflict.txt`, `evidence/08-port-conflict-resolved.txt`).
   - **404 route failure:** Reproduced `GET / 404 in 3673ms` by renaming `page.tsx` to `home.tsx`, documented the ordered five-step diagnostic checklist, and verified `GET / 200 in 1674ms` upon recovery (`evidence/09-404-error.txt`, `evidence/10-404-resolved.txt`).

---

## Important Decisions

- **Root Application Placement vs. Task Subfolder:** Originally scaffolded inside `task-02-repository-and-scaffold/`, which caused `ENOENT` when running `npm run dev` from the repository root and would have required duplicating the app across Tasks 3–5. Relocated the app to the root while keeping `task-02-repository-and-scaffold/` strictly for Task 2 documentation and evidence.
- **Direct File Authoring Over `create-next-app` Boilerplate:** Avoided `create-next-app` default template CSS (which introduces hardcoded hex values and Geist fonts) by writing minimal, token-bound files directly.
- **Standard `<link>` Font Loading Over Build-Time `next/font/google`:** Loaded `Open Sans` and `Playfair Display` with `display=swap` so local builds (`next build`) succeed even under offline or unstable network conditions.

---

## Documentation (`docs/`)

- `docs/scaffold-prompt.md` — Initial prompt, explanation of changes, and final approved scaffolding prompt.
- `docs/model-choices.md` — AI models selected per sub-task, observed differences, and recovery from an unsuitable initial model choice.
- `docs/performance-note.md` — Analysis of the `11,920 ms` cold compilation load vs. `209 ms` warm load.
- `docs/false-success.md` — Analysis of UI, server, and database behaviour during a database outage and why naive UIs mislead reviewers.
- `docs/readme-test.md` — Verbatim difficulties from an unfamiliar developer testing the initial `README.md` and fixes applied.
- `docs/working-tree.md` — Explanation of the development pipeline and what breaks when using a single branch before and after deployment.
- `docs/information-design.md` — Browser `<head>`, interface content simplification, `max-width` line wrapping, `rem` button padding, and responsive `clamp()` decisions.
- `docs/defects.md` — Real defects encountered in Task 2 with file and line references.
- `docs/interview-answers.md` — Answers to all 15 Task 2 assessment questions ($\le 200$ words each) plus secret-leak response.

---

## Evidence (`evidence/`)

- `01-agent-plan.txt` — Captured pre-implementation plan, conflict report, and questions.
- `02-files-created.txt` — Complete list of created files and their purposes.
- `03-server-start.txt` — `next dev` startup output and port (`http://localhost:3000`).
- `04-first-load.txt` — First page-load compilation and timing (`GET / 200 in 11920ms`).
- `05-nested-folder-error.txt` & `06-nested-folder-fixed.txt` — Nested directory `ENOENT` failure and recovery.
- `07-port-conflict.txt` & `08-port-conflict-resolved.txt` — Port 3000 conflict (`PID 42648`) and recovery.
- `09-404-error.txt` & `10-404-resolved.txt` — `GET / 404 in 3673ms`, ordered diagnostic checks, and `GET / 200 in 1674ms` recovery.
- `11-write-succeeded-logs.txt` & `12-database-rows.png` — Verified PostgreSQL `ServiceEnquiry` inserts (`201 Created`) and Prisma Studio rows (`cmw00coua0001kzy4dcyzcibb`, `cmw00ftvp0002kzy4cf96afr5`).
- `13-write-failed-logs.txt` — Broken `DATABASE_URL` test returning `POST /api/enquiries 500` with zero false-success records.
- `14-working-tree-drawing.jpg` — Hand-drawn, hand-dated development pipeline diagram.
- `15-git-log-graph.txt` — Multi-day Git commit graph showing `feat/information-design` merge and deleted unmerged experimental branch `experiment/rejected-card-grid`.
- `16-head-route-one.png` & `17-head-route-two.png` — Rendered `<head>` metadata across `/` and `/plans`.
- `18-heading-wrap-bad.png` & `19-heading-wrap-good.png` — Main heading before and after `max-width: 22ch` and `text-wrap: balance`.
- `20-responsive-three-widths.png` — Responsive `clamp()` heading rendered across `375px`, `520px`, and `620px` viewports.

---

## Current Completion Status & Known Defects
- **Status:** Complete (all 9 `docs/` files and all 20 `evidence/` files produced and verified).
- **Known Defects:** See `docs/defects.md` for full defect records (including missing spacing/radius tokens in `06-tokens-complete.json`, the `4.41:1` normal-text contrast ratio on `--colour-primary-role`, and the initial `42P05` prepared-statement pool collision resolved via `&pgbouncer=true`).

