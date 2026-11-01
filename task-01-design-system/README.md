# Task 1: Design System

## Overview
Created a design system for **Swash**, an African-first subscription laundry service in Nigeria, and proved that a coding agent reliably consumed it to build an interface with one documented colour exception and no primitive token leaks.

## Key Decisions
- **Colour:** Built a tonal palette around Swash’s Ankara-inspired rich gold and deep purple, with a deliberately updated red primary role (`#e81313`) for primary actions.
- **Typography:** Defined 15 styles across Display, Headline, Title, Body, and Label, pairing Playfair Display for expressive headings with Open Sans for readable body copy.
- **Shadows:** Defined soft, medium, and hard shadows using primary brand tinting rather than harsh black, creating an atmospheric, grounded elevation feel.
- **Token pipeline:** Exported Figma variables into structured JSON (`06-tokens-complete.json`), converted them into CSS variables (`styles/global.css`), and enforced semantic role consumption across all interface styling.

## Interface Evidence & Verification
- `signup/index.html` — Accessible signup interface built for Swash using purely semantic HTML5, CSS tokens, and vanilla JavaScript.
- `signup/style.css` — Interface stylesheet consuming CSS custom properties from `styles/global.css`, with a documented `#219421` primary exception on the signup screen.
- `signup/app.js` — Client-side interaction logic with accessible validation and status feedback.
- `evidence/07-raw-value-search.txt` — Automated terminal search command and output confirming **0 primitive token leaks** in the interface code; the deliberate signup `#219421` exception is documented in `signup/style.css`.
- `evidence/08-agent-typography-answer.txt` — Written audit questioning the coding agent on exact typography token usage for the brand heading and submit button.
- `evidence/05-tokens-incomplete.json` vs `evidence/06-tokens-complete.json` — Verification of token variable inclusion, capturing the omission of colour collections when Figma variables are omitted.

## Documentation
- `docs/business-brief.md` — Business definition, user profile, and core interface requirements.
- `docs/type-scale.md` — Complete 15-style typography scale, weights, and CSS variable mappings.
- `docs/colour-roles.md` — Semantic colour roles, primitive targets, and verified WCAG contrast ratios.
- `docs/shadows.md` — Brand-tinted shadow coordinates, opacity, and optics rationale.
- `docs/divergences.md` — Intentional typographic deviations (Display Large 1.3x line height and Playfair pairing) with failure scenario analysis.
- `docs/prompts.md` — Full prompt log, initial prompt failures, and the refined final prompt used to convert tokens.
- `docs/defects.md` — Real defects cited by file and line number with production risk analysis.
- `docs/interview-answers.md` — Comprehensive answers to all 12 design engineering and accessibility viva questions.

## Findings and Defects
* **Key finding:** AI models produce generic, uninspired styling when given unconstrained prompts. Providing a machine-readable token contract (`global.css`) paired with strict negative constraints in `RULES.md` is required to ensure consistent, distinctive brand execution.
* **Defect and regression:** Identified that the incomplete token export initially duplicated the complete file, an Inter font family anomaly in `open sans.headline.headline small` (`type-scale.md`, line 32), and a shadow blur documentation discrepancy (`shadows.md`, line 23 vs. JSON token `radius: 25`).

## Scope
This task established the design system foundation, token pipeline, and verification mechanisms proving agent consumption on a standalone interface. Backend database integration and routing scaffold follow in subsequent tasks.