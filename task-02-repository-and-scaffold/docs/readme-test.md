# README Usability Test Log

This document records the usability test of the main repository `README.md` with someone unfamiliar with the Swash project, the exact difficulties encountered when attempting to set up and run the project from scratch, and the fixes applied to `README.md`.

---

## 1. Test Setup

- **Tester Profile:** Peer developer unfamiliar with the Swash repository and folder structure.
- **Task Given:** Clone/open the `Swash` repository, read only the root `README.md`, install dependencies, configure the environment, and start the development server at `http://localhost:3000`.
- **Initial `README.md` State Before Test:** A 24-line overview file that listed the five `task-0X-*` directories and referenced `task-01-design-system/signup/index.html`, with no `npm install`, `.env`, Prisma client generation, or `npm run dev` instructions.

---

## 2. Tester's Difficulties (Recorded Verbatim)

1. *"The README tells me to open `task-01-design-system/signup/index.html` directly in a browser, but that `signup` folder doesn't exist anymore—and it doesn't say how to start the Next.js app."*
2. *"When I opened PowerShell in VS Code and ran `npm run dev`, Windows PowerShell blocked `npm.ps1` with an `UnauthorizedAccess` ExecutionPolicy error (`running scripts is disabled on this system`). I had to figure out whether to use `npm.cmd` or Command Prompt."*
3. *"I saw `prisma/schema.prisma` in the repo, so I knew it needed a `.env` file, but the old README didn't mention `.env.example`, what `DATABASE_URL` format to use, or whether I needed to run `npx prisma generate` / `npx prisma db push` before submitting the form."*

---

## 3. Fixes Applied to the Main `README.md`

Based on the test above, the root [`README.md`](file:///c:/Users/23470/OneDrive/Desktop/Swash/README.md) was rewritten with all seven required sections in order:

1. **Removed Stale Reference:** Replaced the obsolete `task-01-design-system/signup/index.html` instruction with the current Next.js App Router setup at the repository root.
2. **Added Exact Step-by-Step Setup Commands (Section 4):**
   - Documented copying `.env.example` to `.env`.
   - Documented running `npm.cmd install`, `npx.cmd prisma generate`, `npx.cmd prisma db push`, and `npm.cmd run dev` (including the `.cmd` suffix note for Windows PowerShell users with restricted script execution policies).
3. **Documented Environment Variables (Section 5):** Added a table explaining `DATABASE_URL`, its purpose, and where it is consumed (`prisma/schema.prisma`), without exposing any real credentials.
4. **Added Scope Boundaries & Known Defects (Sections 6 & 7):** Explicitly listed what the application currently implements vs. what it deliberately does not do yet, along with file-referenced defects.

