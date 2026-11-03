# Model Selection & Comparison Log

This document records the AI models used inside Google Antigravity during Task 02, why each model was selected, the behavioural differences observed on this codebase, and a real instance where an initial model choice proved unsuitable and was switched.

---

## 1. Models Used by Sub-Task

| Sub-Task | Model Used | Why It Was Selected |
| --- | --- | --- |
| **Initial Repository Inspection** | **Gemini 3.8 Flash (High)** | Selected for fast multi-file context ingestion across `AGENTS.md`, `RULES.md`, and the Task 01 design system documentation. |
| **First Scaffold Attempt (Aborted)** | **Default Model (Unpinned)** | Selected to run the initial `scaffold-prompt.md` workflow and execute `create-next-app`. |
| **Task Cancellation & Workspace Cleanup** | **Gemini 3.8 Flash (Low)** | Selected for low-latency operational cleanup (`undo changes`): killing the hung background process and removing partial scaffold files without deep reasoning overhead. |
| **Final Scaffold Plan, Conflict Analysis & Implementation** | **Gemini 4 Argon (High)** | Selected for high-precision instruction following, cross-file conflict detection (`01-agent-plan.txt`), and deterministic file creation (`02-files-created.txt`). |

---

## 2. Observed Differences Between Models

1. **Conflict Detection and Token Auditing:**
   - The **Default / Flash** run identified that spacing and border-radius tokens were missing from `06-tokens-complete.json`, but did not surface the deeper cross-file discrepancies (such as the `4.41:1` WCAG AA normal-text contrast failure on `--colour-primary-role` vs. `--colour-on-primary-role` documented in `colour-roles.md`, or the unquoted `Playfair` vs. `Playfair Display` font-family mismatch between `global.css` and `design-system.md`).
   - **Gemini 4 Argon (High)** inspected the JSON keys programmatically and cross-referenced `colour-roles.md`, `type-scale.md`, and `defects.md`, flagging all five architectural and design-token conflicts before writing a single line of code.

2. **Execution Strategy (CLI Generator vs. Direct File Authoring):**
   - The first model attempted to scaffold the project by invoking `npx create-next-app@latest` as a shell command. On Windows with a slower network connection, `create-next-app` spawned a long-running background task that repeatedly polled while downloading default template bloat.
   - **Gemini 4 Argon (High)** authored the exact required files (`package.json`, `tsconfig.json`, `next.config.ts`, `prisma/schema.prisma`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/page.module.css`) directly and then ran `npm install --prefer-offline`, avoiding template boilerplate that would have violated the design system rules.

3. **Speed vs. Reasoning Depth:**
   - **Gemini 3.8 Flash (Low)** responded in ~4 seconds when cancelling tasks and cleaning untracked directories, whereas **Gemini 4 Argon (High)** took longer per turn due to deeper reasoning, which was appropriate for multi-constraint verification but unnecessary for simple file cleanup.

---

## 3. When the Initial Model Choice Was Wrong and Switched

### The Failure
During the first execution of `scaffold-prompt.md`, the model was changed from **Gemini 3.8 Flash (High)** to the unpinned default model. After approval (`continue`), that model invoked:

```cmd
cmd /c "cd task-02-repository-and-scaffold && npx create-next-app@latest . --typescript --no-tailwind --eslint --app --src-dir --no-turbopack --import-alias @/* --use-npm"
```

Because `create-next-app@16.4.4` was not cached locally, the command hung in the background installing generator dependencies and default Next.js template files (which include hardcoded default styles and SVGs that violate Swash's zero-hardcoded-colour rule). The model entered a repetitive status-polling loop without completing the setup.

### The Switch and Recovery
1. Switched to **Gemini 3.8 Flash (Low)** and issued `undo changes` to immediately terminate the background task (`task-120`) and remove the partially generated files.
2. Switched to **Gemini 4 Argon (High)** and re-ran `scaffold-prompt.md`. Instead of delegating to `create-next-app`, Gemini 4 Argon wrote only the minimal, token-compliant files directly, imported `task-01-design-system/styles/global.css` without duplicating `:root` hex values, and verified the build with `tsc --noEmit` and `next build`.

