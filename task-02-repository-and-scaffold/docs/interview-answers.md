# Task 2: Interview Defence

Answers to all 15 repository, Git, engineering workflow, and application diagnostics assessment questions (each capped at 200 words), plus the secret-leak incident response protocol.

---

### 1. What is the difference between Git Flow and trunk-based development?

**Git Flow** uses multiple long-lived branches (`main`, `develop`, `release/*`, `hotfix/*`, and `feature/*`). Features merge into `develop`, wait for scheduled release branches, and only reach `main` on formal releases. It suits software with scheduled versioned releases and strict QA sign-off cycles, but introduces long-lived branch divergence and complex merge conflicts.

**Trunk-based development** uses a single shared trunk (`main`) where developers create short-lived feature branches (lasting hours or a couple of days) and merge frequently via pull requests backed by automated tests and feature flags. It enables continuous integration and rapid deployment while minimising merge drift, though it requires disciplined automated testing so broken code does not destabilise `main`.

---

### 2. What does `git push --force` do, and why is `--force-with-lease` safer?

`git push --force` unconditionally overwrites the remote branch pointer with your local branch history, permanently discarding any commits that teammates pushed to the remote branch since you last fetched.

`git push --force-with-lease` performs a conditional check first: it verifies that the remote branch's current `HEAD` still matches the exact commit hash your local remote-tracking branch (`origin/<branch>`) expects. If another developer has pushed new commits in the meantime, `--force-with-lease` aborts the push rather than silently erasing their work.

---

### 3. Why is rewriting shared Git history dangerous?

Rewriting shared history (via `git rebase`, `git commit --amend`, or `git reset` followed by a force-push on a shared branch) changes the SHA-1 commit hashes of existing commits.

When teammates who already pulled the original commits pull again or push their work, Git sees two diverging histories containing duplicate changes under different hashes. If they merge rather than resetting, duplicate commits and already-reverted bugs get re-introduced into the codebase, corrupting the audit trail and breaking bisect/rollback workflows.

---

### 4. What is the difference between Git merge and rebase?

`git merge` combines two branches by creating a new merge commit with two parent pointers, preserving the exact chronological history and branch topology of when and where every commit was authored.

`git rebase` moves a branch's commits onto the tip of another branch by replaying each commit one by one and generating brand-new commit hashes. Rebase produces a clean, linear commit history without merge commits, but rewrites history and must never be used on commits already shared with others on a public branch.

---

### 5. What causes a merge conflict?

A merge conflict occurs when Git cannot automatically reconcile competing changes between two branches being merged or rebased. Specifically, it happens when:
1. Two branches modify the **exact same lines** of the same file differently since their common ancestor commit (`merge-base`), or
2. One branch deletes or renames a file while the other branch modifies that same file.

Git pauses the merge and marks the conflicting blocks (`<<<<<<<`, `=======`, `>>>>>>>`) so a human can decide which logic preserves the intended application behaviour.

---

### 6. What is the difference between the working directory, staging area, and repository?

1. **Working Directory (Working Tree):** The actual files and folders currently checked out on your disk (`src/`, `package.json`). Edits here are untracked or unstaged working drafts.
2. **Staging Area (Index):** A draft zone (`.git/index`) populated via `git add`. It holds the exact snapshot of changes that will go into the *next* commit, allowing you to group related edits into focused commits while leaving unrelated edits unstaged.
3. **Repository (`.git/objects`):** The permanent database of committed snapshots, branches, and tags created via `git commit`.

---

### 7. What is branch protection?

Branch protection is a set of repository-enforced rules (configured on GitHub for critical branches like `main`) that prevent direct, unreviewed, or destructive changes. Typical rules include:
- Blocking direct pushes to `main` and requiring all changes to go through a Pull Request.
- Requiring at least one reviewer approval and passing CI checks (`next build`, lint, tests) before merging.
- Blocking `git push --force` and branch deletion so shared production history cannot be overwritten or destroyed.

---

### 8. Walk through a technical project you built end to end.

For **Swash**, I established the design system and application foundation end to end:
1. **Design Tokens to CSS Contract (Task 1):** Exported 462 primitive, semantic reference, typography, and brand-tinted shadow variables from Figma into `06-tokens-complete.json` and converted them into `:root` custom properties in `styles/global.css`, auditing all role pairs against WCAG 2.1 contrast thresholds.
2. **Application Scaffold (Task 2):** Set up a Next.js App Router + TypeScript + Prisma + PostgreSQL project at the repository root consuming `styles/global.css` with zero raw hex values or primitive token leaks.
3. **Database Persistence & Diagnostics:** Added the `ServiceEnquiry` model and `POST /api/enquiries` Route Handler, verified real row creation in PostgreSQL (`201 Created`), and tested controlled failure states (nested directory, port conflict, 404 route mismatch, and broken database connections) so the UI never displays false success.

---

### 9. Tell me about a time something you built broke.

During Task 02, the Next.js scaffold was initially created inside the nested `task-02-repository-and-scaffold/` folder instead of the repository root. When running `npm.cmd run dev` from `C:\Users\23470\OneDrive\Desktop\swash>`, npm failed with `ENOENT: no such file or directory, open '...\swash\package.json'`.

Additionally, during the first scaffold attempt, invoking `npx create-next-app` over a slower connection spawned a hung background process. I terminated the hung process, authored the minimal Next.js + Prisma files directly, moved the application scaffold to the repository root so `task-0X-*` folders remain dedicated to documentation and evidence, and updated the relative `@import` path in `src/app/globals.css`.

---

### 10. How do you learn an unfamiliar codebase?

1. **Read the Architecture & Rules First:** Inspect `README.md`, `AGENTS.md`, `RULES.md`, and `package.json` to understand the business domain, mandatory stack, scripts, and constraints.
2. **Inspect the Data Model:** Read `prisma/schema.prisma` (or database migrations) to see the core entities, relationships, and invariants.
3. **Trace Entry Points:** Follow the routing tree (`src/app/layout.tsx`, `src/app/page.tsx`, and API routes) to see how requests flow from UI components to server handlers and the database.
4. **Run and Observe:** Start the dev server, trigger a real request, and watch server logs and database changes before modifying code.

---

### 11. What is the difference between correct code and complete code?

**Correct code** works for the happy path—for example, a form submission handler that inserts a row when given valid inputs on a fast local connection with a running database.

**Complete code** handles real-world failure modes, edge cases, security boundaries, and accessibility requirements: validating untrusted input on the server, preventing duplicate submissions while a request is in flight, preserving user input when the network or database fails, returning accurate HTTP status codes (`400`, `500`, `201`), associating errors with fields via ARIA for screen readers, and never displaying success before persistence is confirmed.

---

### 12. How do you build software another developer can maintain?

1. **Single Source of Truth:** Keep design tokens in `06-tokens-complete.json` / `global.css` and data models in `prisma/schema.prisma` rather than scattering magic values across components.
2. **Clear Separation of Concerns:** Keep presentation in Server/Client components, styling in CSS Modules consuming semantic tokens, and database access in server route handlers/services.
3. **Honest Documentation & Setup Guides:** Maintain an accurate `README.md`, `.env.example`, decision logs, and defect logs citing exact files and line numbers so new developers know both how to run the project and what limitations exist.

---

### 13. Where did your first page-load time go?

On this machine, the first request to `GET /` took **11,920 ms**, whereas the second request took **209 ms** (a **11,711 ms** difference).

As recorded in `evidence/04-first-load.txt` (`✓ Compiled / in 11.4s (564 modules)`), **95.6% of the first-load time (11,400 ms)** was spent by Next.js's development bundler performing on-demand TypeScript compilation, CSS module resolution, and dependency graph bundling for 564 modules from disk. Once compiled and cached in memory, actual server rendering and local HTTP transfer took ~209 ms.

---

### 14. How did your application report success when no database record was created?

A false-success state occurs when either:
1. The frontend `submit` handler calls `await fetch('/api/enquiries', ...)` and immediately displays a success message without checking `response.status === 201` (since `fetch()` does not throw on HTTP `500`), or
2. The server catches a database error and still returns HTTP `200 OK`.

In our Step 6 database-outage test (`docs/false-success.md`), when PostgreSQL is unreachable, Prisma throws `PrismaClientInitializationError`. Our route handler returns HTTP `500` and `EnquiryForm.tsx` checks `response.status !== 201`, displaying an error alert (`Enquiry not saved`) and preserving the user's input while Prisma Studio confirms 0 rows were inserted.

---

### 15. Why is navigating to a dashboard after signup not sufficient proof that the backend works?

Client-side navigation (`router.push('/dashboard')`) only proves that browser JavaScript executed a route transition. It does **not** prove that:
1. Any network request reached the server or passed validation.
2. A customer record was actually inserted into PostgreSQL with a valid primary key and timestamp.
3. The password was securely hashed rather than stored in plaintext or dropped.
4. A server-side session was created and bound to an `HttpOnly` cookie.

Without inspecting the HTTP status code (`201 Created`), server logs, and actual database rows, a prototype can redirect to `/dashboard` while storing nothing at all.

---

### Bonus: Incident Response if Sensitive Information Is Committed to a Public Repository

1. **Assume Immediate Compromise & Revoke/Rotate First:** Automated bots scrape public GitHub commits within seconds. Immediately revoke and rotate the leaked database password, API key, or session secret in the provider dashboard.
2. **Never Rely on a Follow-Up Commit:** Deleting `.env` in a new commit leaves the secret readable in Git history (`git log -p`).
3. **Purge Git History:** Use `git filter-repo` or BFG Repo-Cleaner to purge the secret from all commits, tags, and branches, force-push cleaned history, and ask collaborators to re-clone.
4. **Prevent Recurrence:** Add the file pattern to `.gitignore` and enable pre-commit secret scanning.

