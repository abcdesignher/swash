# Typography Divergences & Trade-Off Analysis

These are intentional, reasoned divergences from standard design system baselines (such as the Material Design 3 type scale and single-family baselines). Each divergence represents an engineering and design trade-off, balancing aesthetics against specific failure modes.

---

### Divergence 1: Display Large Line-Height Multiplier (1.3× instead of 1.4×–1.6×)

* **Documented Default:** The standard typographic formula dictates a line-height multiplier between 1.4× and 1.6× font size. For a 62px font size, the default line height would sit between 86.8px (1.4×) and 99.2px (1.6×).
* **Chosen Value:** 80.6px line height (a tight 1.3× ratio).
* **Why We Chose It:** At 62px display scale on desktop viewports, standard 1.5× line height generates nearly 31px of empty vertical space between lines. When a short marketing punchline wraps (e.g., "Effortless laundry / for busy professionals"), excessive leading causes the lines to visually detach from one another, breaking the heading's Gestalt grouping and reading as separate phrases rather than a single punchy visual statement.
* **In What Situation This Choice Is Wrong:** 
  1. **Tonal Diacritics in Local Languages:** In multilingual Nigerian contexts supporting Yoruba, Igbo, or Hausa text, vowel diacritics and tone marks (e.g., `Ẹ`, `Ọ`, `Á`, `Ń`) require extra vertical clearance. At a 1.3× ratio, diacritic marks on capitalized letters collide directly with descenders (`g`, `y`, `p`, `j`) from the line above, causing clipping or unreadable overlapping glyphs.
  2. **Narrow Viewport Multi-Line Wraps:** If an un-clamped 62px heading wraps across 4 or more lines on a mobile screen, the tight vertical leading creates an oppressive, dark block of text that degrades scannability for scanning readers.

---

### Divergence 2: Introducing Playfair Display as an Expressive Heading Family

* **Documented Default:** Standard design system baselines recommend a single utilitarian sans-serif typeface (e.g., Open Sans or Roboto) applied uniformly across all 15 typography styles to minimize HTTP requests and guarantee mechanical uniformity.
* **Chosen Value:** A dual-font architecture pairing `Playfair Display` (for Display, Headline, and Title styles) with `Open Sans` (strictly for Body, Labels, and UI controls).
* **Why We Chose It:** The Swash business brief calls for an interface that feels *"Simple. Familiar. Reassuring. Slightly expressive"*, drawing inspiration from the rich cultural textures of Nigerian Ankara fabrics. A purely sans-serif interface feels indistinguishable from generic SaaS utilities or fitness tracking portals. Playfair's distinctive high-contrast serifs provide the warmth and tailored elegance needed for an upscale subscription service.
* **In What Situation This Choice Is Wrong:**
  1. **Low-DPI Screens & Budget Devices:** Playfair features extreme stroke contrast between thick stems and razor-thin hairline serifs. On low-resolution desktop monitors or budget mobile screens with low pixel density (common among everyday users on secondary devices), the thin serifs shimmer or break into aliased pixel artifacts, creating eye strain.
  2. **High-Density Operational & Admin Dashboards:** For laundry facility staff tracking order tallies, wash cycles, and garment counts, Playfair's decorative flourishes waste horizontal space and reduce rapid scanning efficiency compared to a clean, tabular sans-serif.
  3. **High Latency Network Conditions:** Loading two distinct web font families requires additional font weight files over the network. On unstable 3G connections, users experience longer periods of Flash of Invisible Text (FOIT) or Flash of Unstyled Text (FOUT) before the hero section renders properly.
