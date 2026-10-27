# Task 1: Design System

## Overview
Created a design system for **Swash**, an African-first laundry service, and tested whether a coding agent used it to build a consistent interface.

## Key Decisions
- **Colour:** Built a tonal palette around Swash’s brand colour and defined semantic roles for consistent UI colours.
- **Typography:** Defined 15 styles across Display, Headline, Title, Body, and Label, with three sizes per role.
- **Shadows:** Defined soft, medium, and hard shadows using the brand colour rather than black.
- **Token pipeline:** Exported design tokens and converted them into CSS variables, with semantic roles used in the interface.

Detailed values and rationale are documented in the supporting files.

## Evidence
The `evidence/` directory contains:
- Palette screenshots before and after pinning the brand colour.
- Default and chosen Display Large letter spacing.
- Incomplete and complete JSON token exports.
- Raw-colour search command and full output.
- The coding agent’s answer about its typography choice.
- Screenshots comparing interfaces with and without the design system.
- A broken-token screenshot and Git log from the unmerged regression branch.

## Documentation
- `docs/business-brief.md` — Business, user, and interface requirements.
- `docs/type-scale.md` — Typography values and rationale.
- `docs/colour-roles.md` — Semantic colour roles and contrast ratios.
- `docs/shadows.md` — Shadow values and rationale.
- `docs/divergences.md` — Deliberate deviations and trade-offs.
- `docs/prompts.md` — Agent prompts, failed attempts, and revisions.
- `docs/defects.md` — Defects, impact, and resolution status.
- `docs/interview-answers.md` — Answers to the 12 assessment questions.

## Findings and Defects
**Key finding:** 

**Defect and regression:** 

## Scope
This task focused on creating, documenting, and validating the design system and testing whether the coding agent used it. It did not establish that the full application was production-ready.