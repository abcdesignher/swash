# Shadows

In physical optics, natural ambient illumination bounces light from surrounding colored surfaces into shadow penumbras, making pure black shadows appear unnaturally muddy, dirty, and heavy on digital screens. By deriving elevation shadows from the brand's primary purple hue, floating components feel harmoniously integrated into an atmospheric lighting environment, imparting warmth and premium polish without dirty grey borders.

* **Source of truth:** `evidence/06-tokens-complete.json` (`effect.shadow`)
* **CSS variables:** `styles/global.css`

---

## Soft shadow

- **CSS variable:** `--shadow-soft-primary`
- **Box-shadow:** `2px 8px 28px 0px #e9ddff40`
- **Position:** X: 2px, Y: 8px
- **Blur:** 28px
- **Spread:** 0px
- **Colour:** `#E9DDFF` (tinted light primary)
- **Opacity:** 25% (`40` alpha in the exported hex)
- **Usage:** Resting cards, interactive chips, and subtle container elevation.

---

## Medium shadow

- **CSS variable:** `--shadow-medium-primary`
- **Box-shadow:** `3px 9px 25px 0px #c6b0ff40`
- **Position:** X: 3px, Y: 9px
- **Blur:** 25px (derived directly from `radius: 25` in the exported JSON tokens)
- **Spread:** 0px
- **Colour:** `#C6B0FF` (tinted mid primary)
- **Opacity:** 25% (`40` alpha in the exported hex)
- **Usage:** Signup cards, elevated panels, dropdown menus, and active action states.

---

## Hard shadow

- **CSS variable:** `--shadow-hard-primary`
- **Box-shadow:** `4px 9px 28px 0px #a482f338`
- **Position:** X: 4px, Y: 9px
- **Blur:** 28px
- **Spread:** 0px
- **Colour:** `#A482F3` (deeper primary tone)
- **Opacity:** 22% (`38` alpha in the exported hex)
- **Usage:** Modal dialogs, floating action sheets, and prominent overlays.

---

## Engineering Note on Token Authority

The JSON export (`evidence/06-tokens-complete.json`) remains the ultimate source of truth. The CSS variables in `styles/global.css` reflect the exact exported values, including the 25px blur radius for the medium shadow.
