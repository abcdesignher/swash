# Task 1 Defects Log

Every defect documented below is an actual issue identified in this task's deliverables, cited by file and line number, with its impact in a production environment.

---

### Defect 1: Duplicate Hash on Token Exports (Omission Not Captured Initially)
* **File & Line:** `task-01-design-system/evidence/05-tokens-incomplete.json` (lines 610–3582) vs `task-01-design-system/evidence/06-tokens-complete.json`.
* **Description:** When the initial Figma tokens export was conducted, `05-tokens-incomplete.json` and `06-tokens-complete.json` were saved with identical contents (sharing SHA256 hash `7C29FF5A0B11...`). The incomplete export was supposed to capture the omission of Figma colour variables, but the complete file had been copied over it.
* **Production Cost:** In an automated design token sync pipeline, failing to catch that variable collections were missing would allow silent failures. If an export pipeline drops variable collections, the frontend build either breaks completely or falls back to browser defaults, rendering the UI unstyled for end users.
* **Status:** Resolved. The colour collections (`primitive colour collection` and `reference color collection`) were stripped from `05-tokens-incomplete.json`, leaving only `font`, `effect`, and `typography` to properly record the omission.

---

### Defect 2: Font-Family Anomaly in Typography Collection
* **File & Line:** `task-01-design-system/docs/type-scale.md` (line 32) and `task-01-design-system/evidence/06-tokens-complete.json` (`typography.open sans.headline.headline small`).
* **Description:** In the Open Sans typography group, the `headline small` token exported with `fontFamily: "Inter"` instead of `"Open Sans"`.
* **Production Cost:** Visual inconsistency and network degradation. An interface element styled with `headline small` unexpectedly renders in Inter rather than the brand's primary UI typeface (Open Sans). Furthermore, browser clients are forced to download an extra font asset (Inter) for a single heading size, degrading Largest Contentful Paint (LCP) and first load performance on slow Nigerian mobile connections.
* **Status:** Documented in `docs/tokens-css-mapping.md` (line 84). Preserved as exported to maintain fidelity with Figma as the source of truth, with font fallback applied in interface styling.

---

### Defect 3: Discrepancy Between Shadow Documentation and JSON Token Export
* **File & Line:** `task-01-design-system/docs/shadows.md` (line 23) vs `task-01-design-system/evidence/06-tokens-complete.json` (`effect.shadow.medium primary.radius`).
* **Description:** `docs/shadows.md` documented the Medium Primary Shadow blur radius as `28`, whereas the exported JSON source of truth defined `radius: 25`.
* **Production Cost:** Divergence between documentation and runtime assets. Developers handcrafting components to match written documentation produce cards with `28px` blur, while token-driven components produce `25px`, introducing subtle visual inconsistencies and visual regression bugs during QA reviews.
* **Status:** Documented in `docs/tokens-css-mapping.md` (line 88). `global.css` strictly used the JSON value (`25px`).

---

### Defect 4: Premature False-Clean Raw-Value Search
* **File & Line:** `task-01-design-system/evidence/07-raw-value-search.txt` (lines 19–21).
* **Description:** The raw colour value search script was initially executed and logged before any HTML/CSS/JS interface files were built, recording `(no matches)` because 0 interface files were scanned.
* **Production Cost:** False positive in continuous integration. A CI pipeline reporting that 0 raw hex colours exist simply because the search glob matched no interface files allows hardcoded styles to merge undetected once screens are added.
* **Status:** Resolved. Created the Swash signup screen (`task-01-design-system/signup/`) and re-executed the search across `app.js`, `index.html`, and `style.css`, confirming 0 matches across active interface files.