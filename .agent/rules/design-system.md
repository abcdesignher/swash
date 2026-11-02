---
trigger: glob
globs: **/*.tsx, **/*.css, **/*.scss
---

# SWASH — Design System Rules
Description: Apply when creating or modifying user interfaces, components, layouts, or styles.

## 1. Source of Truth

`06-tokens-complete.json` is the authoritative source for exported design tokens.

Read the relevant token definitions before implementing or modifying styles.

Do not recreate, rename, or independently redefine existing tokens.

## 2. Colours

- Use reference colour roles for interface styling.
- Do not use primitive colour variables directly when an assigned reference role exists.
- Preserve token names, values, assignments, and relationships.
- Do not invent colour roles or hardcode values already defined in the token file.
- Report missing roles instead of silently bypassing the design system.

**Primitive colours define the palette; reference colours define their intended use.**

## 3. Typography and Effects

- Use Open Sans for body text.
- Use Playfair Display for prominent headings.
- Use exported typography, shadow, and effect tokens where available.
- Preserve the exported token values.
- Justify deliberate deviations.

## 4. Interface Implementation

- Prioritise clarity, readability, and familiar interaction patterns.
- Maintain consistent spacing, hierarchy, and component behaviour.
- Build responsive interfaces for relevant screen sizes.
- Keep pages lightweight and avoid unnecessary visual complexity.
- Provide useful loading, empty, error, and retry states.
- Ensure interactive elements are accessible.

## 5. Existing Components

- Inspect and reuse existing components before creating new ones.
- Keep shared components consistent.
- Avoid duplicating components that already serve the required purpose.
- Do not introduce a new UI library without justification.

## 6. Verification

Before completing UI work:

- Check token usage.
- Check visual consistency with existing screens.
- Check responsive behaviour.
- Check keyboard accessibility and visible focus.
- Check loading and error states where applicable.

Do not claim visual consistency without inspecting the implemented interface.