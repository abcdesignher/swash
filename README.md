# Swash

Swash is a subscription-led laundry service for Nigeria. This repository contains the design system and the task folders for the customer-facing web application.

## Repository structure

| Folder | Purpose |
| --- | --- |
| `task-01-design-system/` | Design system documentation, exported tokens, CSS variables, and evidence. |
| `task-02-repository-and-scaffold/` | Repository and application scaffold. |
| `task-03-client-validation/` | Client-side validation. |
| `task-04-server-security/` | Server security. |
| `task-05-sessions-compliance-defence/` | Sessions, compliance, and defence. |

## Design system

Start with `task-01-design-system/README.md`.

- `task-01-design-system/docs/business-brief.md` - business, user, and interface requirements.
- `task-01-design-system/docs/colour-roles.md` - semantic colour roles, values, and contrast ratios.
- `task-01-design-system/docs/type-scale.md` - typography scale and CSS variable names.
- `task-01-design-system/docs/shadows.md` - shadow values and CSS variable names.
- `task-01-design-system/docs/tokens-css-mapping.md` - token-to-CSS mapping and unresolved issues.
- `task-01-design-system/evidence/06-tokens-complete.json` - source of truth for exported tokens.
- `task-01-design-system/styles/global.css` - CSS custom properties generated from the token export.

## Using the design system

Import the token stylesheet and use the reference role variables for interface styling:

```css
@import "./task-01-design-system/styles/global.css";

.button-primary {
  background: var(--colour-primary-role);
  color: var(--colour-on-primary-role);
}
```

Do not use primitive colour variables directly when an assigned reference role exists. Changes to primitive colours should flow through the reference roles.

## Status

`task-01-design-system` is complete. `task-02` through `task-05` are placeholders and do not yet contain application code.
