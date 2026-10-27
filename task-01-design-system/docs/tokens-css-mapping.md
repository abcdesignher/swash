# Token to CSS Variable Mapping

- **Source of truth:** `evidence/06-tokens-complete.json`
- **Generated stylesheet:** `styles/global.css` (all variables in `:root`)
- **Source data:** `06-tokens-complete.json` was not modified.

## Naming patterns

| JSON token collection | CSS variable pattern | Example |
| --- | --- | --- |
| Primitive colour palette | `--primitive-colour-palette-{palette}-{tone}` | `colour palettes.primary.primary40` -> `--primitive-colour-palette-primary-40` |
| Primitive key colour | `--primitive-colour-key-{name}` | `key colours.primary` -> `--primitive-colour-key-primary` |
| Reference colour role | `--colour-{role-name}` | `primary.primary role` -> `--colour-primary-role` |
| Typography | `--typography-{family}-{style}-{property}` | `open sans.display.display large.fontSize` -> `--typography-open-sans-display-large-font-size` |
| Shadow | `--shadow-{name}` | `shadow.soft primary` -> `--shadow-soft-primary` |

Reference roles keep the exported role names. Text roles are prefixed with
`--colour-text-`, surface roles with `--colour-surface-`, background roles with
`--colour-background-`, and neutral roles with `--colour-neutral-`.

## Reference role examples

| JSON role | CSS variable | References |
| --- | --- | --- |
| `primary.primary role` | `--colour-primary-role` | `--primitive-colour-key-primary` |
| `primary.on primary role` | `--colour-on-primary-role` | `--primitive-colour-palette-primary-98` |
| `primary.inverse primary role` | `--colour-inverse-primary-role` | `--primitive-colour-palette-primary-90` |
| `primary.on inverse primary role` | `--colour-on-inverse-primary-role` | `--primitive-colour-palette-primary-20` |
| `primary.dark primary role` | `--colour-dark-primary-role` | `--primitive-colour-palette-primary-10` |
| `text.primary text role` | `--colour-text-primary-role` | `--primitive-colour-palette-neutral-40` |
| `surface.surface neutral` | `--colour-surface-neutral` | `--primitive-colour-palette-neutral-99` |
| `background.background neutral` | `--colour-background-neutral` | `--primitive-colour-palette-neutral-98` |
| `neutral.white role` | `--colour-neutral-white-role` | `--primitive-colour-palette-neutral-100` |

## Typography property mapping

| JSON property | CSS variable suffix | CSS property to use |
| --- | --- | --- |
| `fontFamily` | `-font-family` | `font-family` |
| `fontSize` | `-font-size` | `font-size` |
| `fontWeight` | `-font-weight` | `font-weight` |
| `fontStyle` | `-font-style` | `font-style` |
| `fontStretch` | `-font-stretch` | `font-stretch` |
| `lineHeight` | `-line-height` | `line-height` |
| `letterSpacing` | `-letter-spacing` | `letter-spacing` |
| `textDecoration` | `-text-decoration` | `text-decoration` |
| `textCase` | `-text-case` | `text-transform` (values align for `none`) |
| `paragraphIndent` | `-paragraph-indent` | `text-indent` |
| `paragraphSpacing` | `-paragraph-spacing` | No direct CSS property; variable is preserved but not applied |

## Shadow mapping

| JSON shadow | CSS variable | Value |
| --- | --- | --- |
| `soft primary` | `--shadow-soft-primary` | `2px 8px 28px 0px #e9ddff40` |
| `medium primary` | `--shadow-medium-primary` | `3px 9px 25px 0px #c6b0ff40` |
| `hard primary` | `--shadow-hard-primary` | `4px 9px 28px 0px #a482f338` |

## Counts

- 126 primitive palette variables
- 9 primitive key-colour variables
- 60 reference-role variables
- 264 typography variables (24 styles x 11 properties)
- 3 shadow variables

## Unsupported, missing, or ambiguous tokens

1. **Figma dimensions have no units.** `fontSize`, `letterSpacing`,
   `lineHeight`, `paragraphIndent` and `paragraphSpacing` are exported as bare
   numbers. They were converted to `px`, matching Figma's pixel export. Shadow
   `offsetX`, `offsetY`, `radius` and `spread` were converted the same way; the
   exported spread of `0` is written as `0px` (equivalent). This is the only
   unit assumption.
2. **`paragraphSpacing` has no standard CSS property.** It is preserved as
   `--typography-...-paragraph-spacing` but cannot be applied directly.
3. **`textCase` is not a CSS property name.** It is preserved as
   `--typography-...-text-case`; use it with `text-transform`. The exported
   value is `none`.
4. **`font` and `typography` duplicate the same styles.** All 24 styles and
   their 11 properties were compared programmatically; they match. CSS
   variables were generated from `typography` because it is already split into
   individual properties.
5. **Font-family anomaly:** `font.open sans.headline.headline small` and
   `typography.open sans.headline.headline small` both use `Inter`, not
   `Open Sans`, despite sitting inside the `open sans` group. The exported value
   was preserved and is not silently changed.
6. **Shadow documentation conflict:** `docs/shadows.md` says the medium shadow
   blur is 28, while `06-tokens-complete.json` exports `radius: 25`. The JSON
   value (`25px`) was used because the JSON is the source of truth.
7. **Documented roles missing from the reference collection:**
   `docs/colour-roles.md` mentions Outline and Elevation roles, but the
   reference collection contains no outline or elevation roles. No variables
   were invented for them.
8. **Duplicate target:** `dark information role` and
   `on inverse information role` both reference `information20`. This is
   preserved as exported.
9. **Shadow colours are literal hex values, not references.** The JSON does not
   express a primitive-token relationship for shadow colours, so they remain
   literal values inside the shadow composite variables. No relationship was
   invented.
10. **No interface exists yet.** `task-02-repository-and-scaffold`,
    `task-03-client-validation`, `task-04-server-security` and
    `task-05-sessions-compliance-defence` are empty. No interface styling was
    generated, and role usage in an interface could not be verified.

## Verification performed

- All reference roles resolve to defined primitive variables: 0 unresolved
  `var()` references.
- All 24 `font` styles match the corresponding `typography` styles: 0
  mismatches.
- The interface raw-value search found no interface source files and no
  hardcoded colours or direct `var(--primitive-colour-...)` usage. See
  `evidence/07-raw-value-search.txt`.
