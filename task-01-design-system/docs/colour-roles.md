# Colour Roles

Derived directly from the `reference color collection` in
`evidence/06-tokens-complete.json`. The matching CSS variables are in
`styles/global.css`. Primitive colours define the palette; these roles define
how the palette is used. Interface styling should use the role variables, not
primitive variables directly.

All resolved values are opaque 8-digit hex (`ff` alpha). The primitive
reference column shows the exact token path in the export. The Contrast
column in the brand/status tables shows the explicit base/on or
inverse/on-inverse pair ratio; `—` means the export defines no direct pair
for that role.

## Brand and status roles

### Primary

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| primary role | `--colour-primary-role` | `key colours.primary` | `#4517a7ff` | Main brand colour for primary actions | 10.35:1 vs on primary role |
| on primary role | `--colour-on-primary-role` | `colour palettes.primary.primary98` | `#fcf8ffff` | Text and icons on primary | 10.35:1 vs primary role |
| inverse primary role | `--colour-inverse-primary-role` | `colour palettes.primary.primary90` | `#e9ddffff` | Primary colour on inverse surfaces | 11.42:1 vs on inverse primary role |
| on inverse primary role | `--colour-on-inverse-primary-role` | `colour palettes.primary.primary20` | `#350078ff` | Text and icons on inverse primary | 11.42:1 vs inverse primary role |
| dark primary role | `--colour-dark-primary-role` | `colour palettes.primary.primary10` | `#1d064aff` | Darker primary for pressed/dark states | — |

### Secondary

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| secondary role | `--colour-secondary-role` | `colour palettes.secondary.secondary40` | `#e3b76eff` | Supporting colour for secondary actions | 6.76:1 vs on secondary role |
| on secondary role | `--colour-on-secondary-role` | `colour palettes.secondary.secondary10` | `#423016ff` | Text and icons on secondary | 6.76:1 vs secondary role |
| inverse secondary role | `--colour-inverse-secondary-role` | `colour palettes.secondary.secondary80` | `#f4e8d0ff` | Secondary colour on inverse surfaces | 3.69:1 vs on inverse secondary role |
| on inverse secondary role | `--colour-on-inverse-secondary-role` | `colour palettes.secondary.secondary28` | `#a46b0dff` | Text and icons on inverse secondary | 3.69:1 vs inverse secondary role |
| dark secondary role | `--colour-dark-secondary-role` | `colour palettes.secondary.secondary20` | `#7b500aff` | Darker secondary for pressed/dark states | — |

### Tertiary

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| tertiary role | `--colour-tertiary-role` | `colour palettes.tertiary.tertiary40` | `#053594ff` | Additional supporting colour for visual variety | 10.24:1 vs on tertiary role |
| on tertiary role | `--colour-on-tertiary-role` | `colour palettes.tertiary.tertiary98` | `#f9f8ffff` | Text and icons on tertiary | 10.24:1 vs tertiary role |
| inverse tertiary role | `--colour-inverse-tertiary-role` | `colour palettes.tertiary.tertiary90` | `#d9e2ffff` | Tertiary colour on inverse surfaces | 12.51:1 vs on inverse tertiary role |
| on inverse tertiary role | `--colour-on-inverse-tertiary-role` | `colour palettes.tertiary.tertiary20` | `#001b59ff` | Text and icons on inverse tertiary | 12.51:1 vs inverse tertiary role |
| dark tertiary role | `--colour-dark-tertiary-role` | `colour palettes.tertiary.tertiary10` | `#001044ff` | Darker tertiary for pressed/dark states | — |

### Accent

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| accent role | `--colour-accent-role` | `colour palettes.accent.accent40` | `#7b4926ff` | Accent colour for emphasis | 7.08:1 vs on accent role |
| on accent role | `--colour-on-accent-role` | `colour palettes.accent.accent98` | `#fff8f5ff` | Text and icons on accent | 7.08:1 vs accent role |
| inverse accent role | `--colour-inverse-accent-role` | `colour palettes.accent.accent90` | `#ffdcc4ff` | Accent colour on inverse surfaces | 10.47:1 vs on inverse accent role |
| on inverse accent role | `--colour-on-inverse-accent-role` | `colour palettes.accent.accent20` | `#452717ff` | Text and icons on inverse accent | 10.47:1 vs inverse accent role |
| dark accent role | `--colour-dark-accent-role` | `colour palettes.accent.accent30` | `#603a23ff` | Darker accent for pressed/dark states | — |

### Error

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| error role | `--colour-error-role` | `colour palettes.error.error40` | `#c5070eff` | Error and destructive actions | 5.90:1 vs on error role |
| on error role | `--colour-on-error-role` | `colour palettes.error.error99` | `#fafafaff` | Text and icons on error | 5.90:1 vs error role |
| inverse error role | `--colour-inverse-error-role` | `colour palettes.error.error90` | `#ffdad6ff` | Error colour on inverse surfaces | 10.14:1 vs on inverse error role |
| on inverse error role | `--colour-on-inverse-error-role` | `colour palettes.error.error20` | `#690005ff` | Text and icons on inverse error | 10.14:1 vs inverse error role |
| dark error role | `--colour-dark-error-role` | `colour palettes.error.error30` | `#93000aff` | Darker error for pressed/dark states | — |

### Success

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| success role | `--colour-success-role` | `colour palettes.success.success40` | `#087a08ff` | Success and confirmation states | 5.53:1 vs on success role |
| on success role | `--colour-on-success-role` | `colour palettes.success.success100` | `#ffffffff` | Text and icons on success | 5.53:1 vs success role |
| inverse success role | `--colour-inverse-success-role` | `colour palettes.success.success95` | `#d5f8d0ff` | Success colour on inverse surfaces | 11.32:1 vs on inverse success role |
| on inverse success role | `--colour-on-inverse-success-role` | `colour palettes.success.success20` | `#003a00ff` | Text and icons on inverse success | 11.32:1 vs inverse success role |
| dark success role | `--colour-dark-success-role` | `colour palettes.success.success30` | `#005300ff` | Darker success for pressed/dark states | — |

### Information

| Role | CSS variable | Primitive reference | Resolved value | Usage | Contrast |
| --- | --- | --- | --- | --- | --- |
| information role | `--colour-information-role` | `colour palettes.information.information40` | `#0057b8ff` | Informational messages | 6.87:1 vs on information role |
| on information role | `--colour-on-information-role` | `colour palettes.information.information100` | `#ffffffff` | Text and icons on information | 6.87:1 vs information role |
| inverse information role | `--colour-inverse-information-role` | `colour palettes.information.information90` | `#d6e3ffff` | Information colour on inverse surfaces | 10.19:1 vs on inverse information role |
| on inverse information role | `--colour-on-inverse-information-role` | `colour palettes.information.information20` | `#003062ff` | Text and icons on inverse information | 10.19:1 vs inverse information role |
| dark information role | `--colour-dark-information-role` | `colour palettes.information.information20` | `#003062ff` | Darker information for pressed/dark states | — |

## Text roles

| Role | CSS variable | Primitive reference | Resolved value | Usage |
| --- | --- | --- | --- | --- |
| primary text role | `--colour-text-primary-role` | `colour palettes.neutral.neutral40` | `#191919ff` | Default body text on neutral surfaces and backgrounds |
| inverse primary text role | `--colour-text-inverse-primary-role` | `colour palettes.neutral.neutral99` | `#fafafaff` | Text on dark or inverse surfaces |
| secondary text role | `--colour-text-secondary-role` | `colour palettes.neutral.neutral50` | `#333333ff` | Supporting text on neutral surfaces and backgrounds |
| inverse text role | `--colour-text-inverse-role` | `colour palettes.neutral.neutral95` | `#e0e0e0ff` | Supporting text on dark or inverse surfaces |
| disabled text role | `--colour-text-disabled-role` | `colour palettes.neutral.neutral70` | `#707070ff` | Disabled text |
| variant primary text role | `--colour-text-variant-primary-role` | `colour palettes.neutralvariant.neutralvariant40` | `#030419ff` | Default text on neutral-variant surfaces |
| variant inverse primary text role | `--colour-text-variant-inverse-primary-role` | `colour palettes.neutralvariant.neutralvariant99` | `#faf9ffff` | Inverse text on neutral-variant surfaces |
| variant secondary text role | `--colour-text-variant-secondary-role` | `colour palettes.neutralvariant.neutralvariant60` | `#353649ff` | Supporting text on neutral-variant surfaces |
| variant inverse secondary text role | `--colour-text-variant-inverse-secondary-role` | `colour palettes.neutralvariant.neutralvariant95` | `#e0e0ecff` | Supporting inverse text on neutral-variant surfaces |
| variant disabled text role | `--colour-text-variant-disabled-role` | `colour palettes.neutralvariant.neutralvariant80` | `#6d6e81ff` | Disabled text on neutral-variant surfaces |

## Surface roles

| Role | CSS variable | Primitive reference | Resolved value | Usage |
| --- | --- | --- | --- | --- |
| surface neutral | `--colour-surface-neutral` | `colour palettes.neutral.neutral99` | `#fafafaff` | Neutral containers, cards and panels |
| surface primary | `--colour-surface-primary` | `colour palettes.primary.primary99` | `#fefbffff` | Primary-tinted containers |
| surface secondary | `--colour-surface-secondary` | `colour palettes.secondary.secondary99` | `#fefdfbff` | Secondary-tinted containers |
| surface tertiary | `--colour-surface-tertiary` | `colour palettes.tertiary.tertiary99` | `#fdfcffff` | Tertiary-tinted containers |
| surface accent | `--colour-surface-accent` | `colour palettes.accent.accent99` | `#fffbffff` | Accent-tinted containers |

## Background roles

| Role | CSS variable | Primitive reference | Resolved value | Usage |
| --- | --- | --- | --- | --- |
| background neutral | `--colour-background-neutral` | `colour palettes.neutral.neutral98` | `#f5f5f5ff` | Main neutral app background |
| background primary | `--colour-background-primary` | `colour palettes.primary.primary98` | `#fcf8ffff` | Primary-tinted background |
| background secondary | `--colour-background-secondary` | `colour palettes.secondary.secondary98` | `#fdfbf7ff` | Secondary-tinted background |
| background tertiary | `--colour-background-tertiary` | `colour palettes.tertiary.tertiary98` | `#f9f8ffff` | Tertiary-tinted background |
| background accent | `--colour-background-accent` | `colour palettes.accent.accent98` | `#fff8f5ff` | Accent-tinted background |

## Neutral roles

| Role | CSS variable | Primitive reference | Resolved value | Usage |
| --- | --- | --- | --- | --- |
| white role | `--colour-neutral-white-role` | `colour palettes.neutral.neutral100` | `#ffffffff` | Pure white |
| near white role | `--colour-neutral-near-white-role` | `colour palettes.neutral.neutral99` | `#fafafaff` | Near-white surface |
| mid grey role | `--colour-neutral-mid-grey-role` | `colour palettes.neutral.neutral80` | `#999999ff` | Mid grey |
| near black role | `--colour-neutral-near-black-role` | `colour palettes.neutral.neutral50` | `#333333ff` | Near-black surface |
| black role | `--colour-neutral-black-role` | `colour palettes.neutral.neutral20` | `#141414ff` | Black |

## Contrast ratios

Computed from the resolved exported colours using the WCAG 2.1 relative
luminance formula. The first group is the explicit `on` / `inverse` pair
convention in the reference collection. The second group contains derived
pairings for common text/surface use; the token export does not prescribe
which role is used on which surface.

| Pair | Foreground | Background | Ratio | AA normal (4.5:1) | AAA normal (7:1) |
| --- | --- | --- | --- | --- | --- |
| primary role / on primary role | `#fcf8ffff` | `#4517a7ff` | 10.35:1 | Pass | Pass |
| inverse primary role / on inverse primary role | `#350078ff` | `#e9ddffff` | 11.42:1 | Pass | Pass |
| secondary role / on secondary role | `#423016ff` | `#e3b76eff` | 6.76:1 | Pass | Fail |
| inverse secondary role / on inverse secondary role | `#a46b0dff` | `#f4e8d0ff` | 3.69:1 | Fail | Fail |
| tertiary role / on tertiary role | `#f9f8ffff` | `#053594ff` | 10.24:1 | Pass | Pass |
| inverse tertiary role / on inverse tertiary role | `#001b59ff` | `#d9e2ffff` | 12.51:1 | Pass | Pass |
| accent role / on accent role | `#fff8f5ff` | `#7b4926ff` | 7.08:1 | Pass | Pass |
| inverse accent role / on inverse accent role | `#452717ff` | `#ffdcc4ff` | 10.47:1 | Pass | Pass |
| error role / on error role | `#fafafaff` | `#c5070eff` | 5.90:1 | Pass | Fail |
| inverse error role / on inverse error role | `#690005ff` | `#ffdad6ff` | 10.14:1 | Pass | Pass |
| success role / on success role | `#ffffffff` | `#087a08ff` | 5.53:1 | Pass | Fail |
| inverse success role / on inverse success role | `#003a00ff` | `#d5f8d0ff` | 11.32:1 | Pass | Pass |
| information role / on information role | `#ffffffff` | `#0057b8ff` | 6.87:1 | Pass | Fail |
| inverse information role / on inverse information role | `#003062ff` | `#d6e3ffff` | 10.19:1 | Pass | Pass |
| primary text role / background neutral | `#191919ff` | `#f5f5f5ff` | 16.13:1 | Pass | Pass |
| primary text role / surface neutral | `#191919ff` | `#fafafaff` | 16.84:1 | Pass | Pass |
| secondary text role / background neutral | `#333333ff` | `#f5f5f5ff` | 11.59:1 | Pass | Pass |
| secondary text role / surface neutral | `#333333ff` | `#fafafaff` | 12.10:1 | Pass | Pass |
| disabled text role / background neutral | `#707070ff` | `#f5f5f5ff` | 4.54:1 | Pass | Fail |
| inverse primary text role / primary role | `#fafafaff` | `#4517a7ff` | 10.41:1 | Pass | Pass |
| inverse text role / primary role | `#e0e0e0ff` | `#4517a7ff` | 8.23:1 | Pass | Pass |
| white role / black role | `#ffffffff` | `#141414ff` | 18.42:1 | Pass | Pass |
| near white role / near black role | `#fafafaff` | `#333333ff` | 12.10:1 | Pass | Pass |

For the explicit `on` pairs, the `on` role is the foreground and the base or
inverse role is the background. One exported pair fails WCAG AA normal text:
`inverse secondary role` / `on inverse secondary role` at 3.69:1. This is
reported from the exported tokens; no colour values were changed.

## Not defined in the current export

- **Outline:** `docs/colour-roles.md` previously mentioned an outline role,
  but the reference collection has no outline role. No variable exists.
- **Elevation:** The reference collection has no elevation role. Depth is
  currently expressed by the shadow tokens in `styles/global.css`, not by a
  colour role.

## Notes

- `dark information role` and `on inverse information role` both resolve to
  `information20`; this is preserved exactly as exported.
- The reference collection has no outline, elevation, surface-error,
  surface-success, surface-information, background-error,
  background-success or background-information roles. None were invented.
- `06-tokens-complete.json` remains the source of truth. If primitive
  colours change, these roles continue to resolve through their `var()`
  references in `styles/global.css`.
