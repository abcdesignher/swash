# Type Scale

Derived directly from the `typography` collection in
`evidence/06-tokens-complete.json`. The matching CSS variables are in
`styles/global.css`. The `font` collection exports the same 24 styles as
composite font styles; it was checked against `typography` and matches.

## Font families

- **Open Sans** - body and interface text, with display, headline, title and label styles.
- **Playfair** - expressive display, headline and title styles.

Open Sans is the body/UI family for readability; Playfair is reserved for
expressive headings, following the business brief in
`docs/business-brief.md`.

## Role intent

- **Display** - hero and marketing moments.
- **Headline** - page and section headings.
- **Title** - card, panel and component headings.
- **Body** - reading text.
- **Label** - buttons, form labels and metadata.

## Open Sans

| Style | Family | Size | Weight | Line height | Letter spacing | CSS variable prefix |
| --- | --- | --- | --- | --- | --- | --- |
| display large | Open Sans | 62px | 700 | 80.6px | -1.24px | `--typography-open-sans-display-large` |
| display medium | Open Sans | 48px | 700 | 62.4px | -0.96px | `--typography-open-sans-display-medium` |
| display small | Open Sans | 36px | 700 | 50.4px | -0.72px | `--typography-open-sans-display-small` |
| headline small | Inter | 24px | 700 | 33.6px | -0.24px | `--typography-open-sans-headline-small` |
| headline medium | Open Sans | 28px | 700 | 39.2px | -0.28px | `--typography-open-sans-headline-medium` |
| headline large | Open Sans | 32px | 700 | 44.8px | -0.32px | `--typography-open-sans-headline-large` |
| title small | Open Sans | 14px | 600 | 19.6px | -0.14px | `--typography-open-sans-title-small` |
| title medium | Open Sans | 16px | 600 | 22.4px | -0.16px | `--typography-open-sans-title-medium` |
| title large | Open Sans | 22px | 600 | 30.8px | -0.22px | `--typography-open-sans-title-large` |
| body small | Open Sans | 12px | 400 | 18px | -0.09px | `--typography-open-sans-body-small` |
| body medium | Open Sans | 14px | 400 | 21px | -0.105px | `--typography-open-sans-body-medium` |
| body large | Open Sans | 16px | 400 | 24px | -0.12px | `--typography-open-sans-body-large` |
| label small | Open Sans | 12px | 600 | 16.8px | -0.09px | `--typography-open-sans-label-small` |
| label medium | Open Sans | 12px | 600 | 19.6px | -0.09px | `--typography-open-sans-label-medium` |
| label large | Open Sans | 14px | 600 | 19.6px | -0.105px | `--typography-open-sans-label-large` |

## Playfair

| Style | Family | Size | Weight | Line height | Letter spacing | CSS variable prefix |
| --- | --- | --- | --- | --- | --- | --- |
| display large | Playfair | 62px | 800 | 74.4px | -1.24px | `--typography-playfair-display-large` |
| display medium | Playfair | 48px | 800 | 62.4px | -0.72px | `--typography-playfair-display-medium` |
| display small | Playfair | 36px | 800 | 46.8px | -0.36px | `--typography-playfair-display-small` |
| headline large | Playfair | 32px | 800 | 44.8px | -0.32px | `--typography-playfair-headline-large` |
| headline medium | Playfair | 28px | 800 | 39.2px | -0.28px | `--typography-playfair-headline-medium` |
| headline small | Playfair | 24px | 800 | 33.6px | -0.24px | `--typography-playfair-headline-small` |
| title large | Playfair | 22px | 700 | 30.8px | -0.165px | `--typography-playfair-title-large` |
| title medium | Playfair | 16px | 700 | 22.4px | -0.12px | `--typography-playfair-title-medium` |
| title small | Playfair | 14px | 700 | 19.6px | -0.105px | `--typography-playfair-title-small` |

## CSS variable structure

Each style has one CSS variable per exported property. The table above
shows the prefix; append the property suffix:

| Property | CSS variable suffix | CSS property to use |
| --- | --- | --- |
| `fontFamily` | `-font-family` | `font-family` |
| `fontSize` | `-font-size` | `font-size` |
| `fontWeight` | `-font-weight` | `font-weight` |
| `fontStyle` | `-font-style` | `font-style` |
| `fontStretch` | `-font-stretch` | `font-stretch` |
| `lineHeight` | `-line-height` | `line-height` |
| `letterSpacing` | `-letter-spacing` | `letter-spacing` |
| `textDecoration` | `-text-decoration` | `text-decoration` |
| `textCase` | `-text-case` | `text-transform` |
| `paragraphIndent` | `-paragraph-indent` | `text-indent` |
| `paragraphSpacing` | `-paragraph-spacing` | No direct CSS property |

Example:

```css
.hero-title {
  font-family: var(--typography-playfair-display-large-font-family);
  font-size: var(--typography-playfair-display-large-font-size);
  font-weight: var(--typography-playfair-display-large-font-weight);
  line-height: var(--typography-playfair-display-large-line-height);
  letter-spacing: var(--typography-playfair-display-large-letter-spacing);
}
```

## Usage notes

- All 24 styles export `fontStyle: normal`, `fontStretch: normal`,
  `textDecoration: none`, `textCase: none`, `paragraphIndent: 0` and
  `paragraphSpacing: 0`.
- Numeric Figma dimensions are written as `px`; the export provides bare numbers.
- `textCase` is preserved as a custom property; use it with
  `text-transform`. `paragraphIndent` maps to `text-indent`.
  `paragraphSpacing` has no standard CSS property and is preserved but not
  applied.
- The `font` and `typography` collections duplicate the same styles. All 24
  styles and their 11 properties were compared; they match.
- Font-family exception:
  - open sans / headline / headline small uses Inter
- `06-tokens-complete.json` remains the source of truth.

