# Task 1: Design System

## Overview
Created the design system for **Swash**, an African-first subscription laundry service in Nigeria. The task defines brand colour roles, a typography scale, and elevation shadows, exports them from Figma as JSON, converts them into CSS custom properties, and documents the decisions, prompt history, and defects behind the result.

## Deliverables
- `evidence/06-tokens-complete.json` — the exported design tokens and remaining source of truth.
- `styles/global.css` — all design tokens as CSS custom properties in `:root`: primitive colour palettes, semantic colour roles, typography, and shadows.
- `evidence/05-tokens-incomplete.json` — the incomplete export, retained to show what is lost when Figma colour collections are omitted.
- `docs/` — the written rationale, mapping, verification, and defect record for the system.

## Key Decisions
- **Colour:** Built a tonal palette around Swash's Ankara-inspired rich gold and deep purple, with a deliberately updated red primary role (`#e81313`) for primary actions.
- **Typography:** Defined 24 styles across Display, Headline, Title, Body, and Label, pairing Playfair Display for expressive headings with Open Sans for readable body copy.
- **Shadows:** Defined soft, medium, and hard shadows using primary brand tinting rather than harsh black, creating an atmospheric, grounded elevation feel.
- **Token pipeline:** Exported Figma variables into structured JSON (`06-tokens-complete.json`) and converted them into CSS variables, preserving the distinction between primitive colours and the semantic roles that reference them.

## Evidence
- `evidence/05-tokens-incomplete.json` vs `evidence/06-tokens-complete.json` — comparison showing the omission of colour collections when Figma variables are exported incompletely.
- `evidence/07-raw-value-search.txt` — raw colour and primitive-token search across the interface source, recording zero hardcoded colours and one documented `#219421` exception. The interface source it scanned is not present in the current tree, so the audit cannot be re-run from this checkout.
- `evidence/08-agent-typography-answer.txt` — written audit of the coding agent's exact typography token usage for the brand heading and submit button.
- `evidence/00-brand-colour-origin.png`, `01-palette-before-pin.png`, `02-palette-after-pin.png` — brand colour and palette evidence.
- `evidence/03-spacing-default.png`, `04-spacing-chosen.png` — spacing scale comparison.
- `evidence/09-screen-without-system.png`, `10-screen-with-system.png` — interface comparison before and after applying the system.
- `evidence/11-broken-referencing.png` — evidence of broken token referencing.
- `evidence/12-git-log-branch-unmerged.png` — branch and commit evidence.
- `evidence/13-walkthrough.mp4.mp4` — walkthrough recording.

## Documentation
- `docs/business-brief.md` — business definition, user profile, and core interface requirements.
- `docs/type-scale.md` — complete 24-style typography scale, weights, and CSS variable mappings.
- `docs/colour-roles.md` — semantic colour roles, primitive targets, and verified WCAG contrast ratios.
- `docs/shadows.md` — brand-tinted shadow coordinates, opacity, and optics rationale.
- `docs/divergences.md` — intentional typographic deviations (Display Large 1.3x line height and Playfair pairing) with failure scenario analysis.
- `docs/tokens-css-mapping.md` — JSON token to CSS variable naming rules, counts, and unsupported or ambiguous tokens.
- `docs/prompts.md` — full prompt log, initial prompt failures, and the refined final prompt used to convert tokens.
- `docs/prompt.md` — the verbatim conversion prompt and its outcome.
- `docs/defects.md` — real defects cited by file and line number with production risk analysis.
- `docs/interview-answers.md` — comprehensive answers to all 12 design engineering and accessibility viva questions.

## Findings and Defects
- **Key finding:** AI models produce generic, uninspired styling when given unconstrained prompts. Providing a machine-readable token contract (`global.css`) paired with strict negative constraints is required to ensure consistent, distinctive brand execution.
- **Duplicate export:** `05-tokens-incomplete.json` initially duplicated `06-tokens-complete.json`; the colour collections were later stripped so the incomplete export records the omission.
- **Font anomaly:** `open sans.headline.headline small` exported with `Inter` instead of `Open Sans` (`type-scale.md`, line 32); preserved as exported and reported in `tokens-css-mapping.md`.
- **Shadow discrepancy:** `shadows.md` originally documented a 28px medium shadow blur while the JSON token exported `radius: 25`; `global.css` uses the JSON value.
- **Premature audit:** the first raw-value search ran before any interface files existed and reported a false clean result; it was later re-run against the interface source.

## Repository Status
The signup interface files referenced by earlier revisions of this README (`signup/index.html`, `signup/style.css`, `signup/app.js`) are not present in the current tree. The evidence captured from that interface remains in `evidence/`, but there is no interface source to re-audit.

## Scope
This task established the design system foundation, token pipeline, and verification evidence. Backend database integration and routing scaffold follow in subsequent tasks.
