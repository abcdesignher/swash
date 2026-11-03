# Task 2 Defects Log

Every defect documented below is a real issue encountered and verified during Task 02, cited by file and line number, with its production impact and current resolution status.

---

### Defect 1: Nested Scaffold Directory Causing `ENOENT` on Startup
* **File & Line:** `task-02-repository-and-scaffold/evidence/05-nested-folder-error.txt` (lines 11–18) and `src/app/globals.css` (line 1).
* **Description:** The Next.js scaffold (`package.json`, `src/`, `prisma/`, `tsconfig.json`) was initially created inside `task-02-repository-and-scaffold/` instead of the repository root. Running `npm.cmd run dev` from the repository root (`C:\Users\23470\OneDrive\Desktop\swash`) failed with `ENOENT: no such file or directory, open 'C:\Users\23470\OneDrive\Desktop\swash\package.json'`.
* **Production & Operational Cost:** In automated CI/CD pipelines (such as Vercel, Railway, or GitHub Actions) that default to the repository root, a nested `package.json` causes immediate build failures unless every service and developer manually overrides the root directory. Furthermore, having separate app scaffolds per task folder would duplicate `node_modules/` and split application state across Tasks 2–5.
* **Status:** **Resolved.** Moved the application scaffold to the repository root (`C:\Users\23470\OneDrive\Desktop\swash\`), updated the relative CSS token import in `src/app/globals.css` (line 1) from `../../../task-01-design-system/styles/global.css` to `../../task-01-design-system/styles/global.css`, and verified startup in `evidence/06-nested-folder-fixed.txt`.

---

### Defect 2: Incomplete Port-Conflict Termination in Initial Recovery Attempt
* **File & Line:** `task-02-repository-and-scaffold/evidence/08-port-conflict-resolved.txt` (lines 7–9 and 93).
* **Description:** When resolving the port `3000` conflict, the first `taskkill` command was entered as `taskkill /PID 38368 /F :3000` (targeting the browser's `ESTABLISHED` client socket PID `38368` rather than the server's `LISTENING` PID `42648`, and appending an invalid `:3000` argument). Because `taskkill` rejected the syntax, process `42648` remained bound to port `3000`, causing the subsequent `npm run dev` to fall back to port `3001`/`3002`.
* **Production & Operational Cost:** Misidentifying an `ESTABLISHED` client PID for the `LISTENING` server PID or ignoring a failed `taskkill` exit code leaves orphaned server processes running old code on the primary port while new instances bind to unexpected ports, leading to stale responses during local debugging or self-hosted deployments.
* **Status:** **Documented.** Recorded the exact syntax error and PID distinction (`LISTENING` PID `42648` vs. `ESTABLISHED` PID `38368`) so the recovery procedure explicitly targets the `LISTENING` process without trailing port arguments.

---

### Defect 3: Missing Spacing, Layout Dimension, and Border-Radius Tokens in Exported Design System
* **File & Line:** `src/app/page.module.css` (lines 7, 14, 18, 26, 41–42, 77, 81, 83, 86, 118, 138, 141, 146, 152, 169–171) vs. `task-01-design-system/styles/global.css` (lines 1–523).
* **Description:** While `task-01-design-system/evidence/06-tokens-complete.json` and `global.css` export 462 variables covering primitive colours, semantic colour roles, typography, and shadows, the Figma export contains zero spacing (`padding`, `gap`, `margin`), container dimension (`max-width`), or `border-radius` tokens. Consequently, `src/app/page.module.css` uses structural `rem` values for layout spacing and radii.
* **Production Cost:** Without tokenized spacing and border-radius scales, individual engineers and AI agents choose slightly different `rem` padding and radius values across screens (`0.5rem` vs `0.375rem` vs `1rem`), gradually introducing visual rhythm drift across the customer application.
* **Status:** **Open / Documented Limitation.** No unauthorized `--spacing-*` or `--radius-*` tokens were invented in CSS (preserving `06-tokens-complete.json` as the sole token source of truth). Must be resolved by exporting spacing and radius collections from Figma in a future design-system iteration.

---

### Defect 4: Primary Colour Role Contrast Ratio (`4.41:1`) Below WCAG AA for Normal Text
* **File & Line:** `task-01-design-system/styles/global.css` (lines 146, 158–159) and `task-01-design-system/docs/colour-roles.md` (line 147).
* **Description:** The exported `--colour-primary-role` (`#e81313ff`) paired with `--colour-on-primary-role` (`#fcf8ffff`) yields a `4.41:1` contrast ratio, which passes WCAG AA for large text ($\ge 24\text{px}$ or bold $\ge 18.67\text{px}$) but falls slightly below the `4.5:1` threshold for normal-sized text (such as `14px` button labels).
* **Production Cost:** Using `--colour-primary-role` as the background for standard `14px` (`label large`) buttons fails automated WCAG AA contrast checks (`axe-core` / Lighthouse), reducing legibility for low-vision users.
* **Status:** **Mitigated in `src/app/page.module.css` (lines 221–222).** The primary submit button on the home screen uses `--colour-on-inverse-primary-role` (`#350078ff`) with `--colour-inverse-primary-role` (`#e9ddffff`), achieving an `11.42:1` (WCAG AAA) contrast ratio while retaining the brand's primary purple identity.

