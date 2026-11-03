# Working Tree & Branching Pipeline

*Companion explanation to `evidence/14-working-tree-drawing.jpg`.*

---

## 1. Pipeline Stages Illustrated in the Drawing

1. **Developer Computer (Working Directory & Staging Area):** Files edited locally in VS Code / Antigravity (`src/`, `prisma/`, `task-02-repository-and-scaffold/`). Mistakes here are completely private and reversible via `git checkout -- <file>` or `git restore` before anyone else sees them.
2. **Local Git Repository (`.git`):** Committed snapshots on local feature branches (`feat/information-design`, `experiment/rejected-layout`) and local `main`. Mistakes here are still local to the developer's laptop.
3. **GitHub Remote (`origin`):** Where code becomes **visible to collaborators and reviewers** as soon as `git push` runs. Once pushed to a shared branch, rewriting history (`git push --force`) becomes dangerous because other developers may have pulled those commits.
4. **Pull Request & Merge Gate (`feat/*` $\rightarrow$ `main`):** The review boundary where automated builds, token checks, and human code review inspect changes before they reach `main`. Unsuitable experiments (`experiment/rejected-layout`) are deleted here without ever touching `main`.
5. **Production Deployment:** Triggered from `main`. This is where code becomes **visible to real Swash customers** and where mistakes (such as broken database migrations, exposed secrets, or corrupted order records) become **hardest to reverse quietly**.

---

## 2. What Breaks When a Project Uses Only One Branch (`main`)

When every change is committed and pushed directly to a single `main` branch:

1. **Unfinished Work Blocks Urgent Fixes:** If a developer is halfway through refactoring the subscription form on `main` and an urgent production bug is discovered in payment confirmation, there is no clean, stable baseline from which to ship a hotfix without deploying half-built, broken code alongside it.
2. **No Safe Experimentation or Rejection Boundary:** In Task 02 Step 9, we tested a change on a separate branch and rejected it by deleting the branch cleanly. On a single branch, backing out an interleaved experiment requires manual `git revert` commits or destructive history resets (`git reset --hard`) that risk wiping out valid commits made in between.
3. **No Peer Review or CI Gate Before Integration:** Code reaches the canonical branch before anyone has verified whether `next build` passes, whether design system tokens were bypassed, or whether a Prisma schema change matches the database.

---

## 3. Why This Becomes Critical After Deployment

Before launch, a broken commit on `main` only inconveniences the developer on `localhost:3000`. After deployment, continuous deployment pipelines automatically build and publish `main` to live users, and application code interacts with **live PostgreSQL customer records**:

- **Live Customer Impact:** Pushing an unreviewed layout regression or broken API route directly to `main` immediately takes down laundry booking and order tracking for paying subscribers.
- **Irreversible Data Corruption:** If an unreviewed commit on `main` runs a flawed database write or destructive schema change against the production PostgreSQL database, reverting the Git commit does **not** restore overwritten customer balances, subscription allowances, or payment records. Feature branches isolate untested code until both application logic and database safety are verified.

