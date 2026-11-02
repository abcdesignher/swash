# Task 1: Interview Defence

Answers to the 12 design engineering, frontend architecture, and accessibility assessment questions. Each response is capped at 200 words.

---

### 1. How would you structure design tokens?

I structure design tokens in a three-tier hierarchy that separates raw values from design intent:

1. **Primitive / Global Tokens:** Literal values extracted from design tools (e.g., `--primitive-colour-palette-primary-40: #4517a7`, `--space-4: 16px`, `--font-size-62: 62px`). These define the complete palette and scale but carry no context.
2. **Semantic / System Tokens:** Purpose-driven roles mapping primitives to intent (e.g., `--colour-primary-role: var(--primitive-colour-key-primary)`, `--colour-surface-neutral`, `--colour-on-primary-role`).
3. **Component Tokens:** Scoped bindings within specific component stylesheets (e.g., `.btn-primary { background: var(--colour-primary-role); color: var(--colour-on-primary-role); }`).

Interface code must consume semantic tokens exclusively, never primitives directly. This ensures the design system remains a true single source of truth. When brand colours or theme modes change, only the primitive-to-semantic mapping is updated. All consuming components cascade automatically without altering individual component rules.

---

### 2. When is a token change breaking?

A token change is breaking whenever it alters semantic intent, removes or renames an established key, or violates functional safety thresholds:

1. **Renaming or Deletion:** Changing `--colour-accent-role` to `--colour-highlight` breaks all consuming components across the codebase, resulting in unstyled elements or browser fallbacks.
2. **Contrast and Luminance Inversion:** Mutating a primitive value mapped to a semantic role in a way that drops contrast below WCAG AA thresholds (e.g., darkening a surface role without updating its paired text role) breaks accessibility compliance for users with visual impairments.

Pure value adjustments that preserve semantic meaning and maintain verified contrast pairs (e.g., fine-tuning the primary hue while retaining its luminance tier) are non-breaking.

---

### 3. How would you support multiple brands and themes?

I support multiple brands and themes by holding semantic role tokens constant and dynamically swapping the underlying primitive token bindings using CSS custom properties and data attributes (`data-theme` or `data-brand`).

In the core stylesheet, components consume invariant roles:
```css
.card {
  background: var(--colour-surface-neutral);
  color: var(--colour-text-primary-role);
}
```

Themes are applied at the root:
```css
[data-theme="light"] {
  --colour-surface-neutral: var(--primitive-colour-palette-neutral-99);
  --colour-text-primary-role: var(--primitive-colour-palette-neutral-40);
}
[data-theme="dark"] {
  --colour-surface-neutral: var(--primitive-colour-palette-neutral-10);
  --colour-text-primary-role: var(--primitive-colour-palette-neutral-98);
}
```

For multi-brand deployment (e.g., Swash Consumer vs. Swash Commercial), brand-specific stylesheets override the primitive key colours (`--primitive-colour-key-primary`), which cleanly propagate through the existing semantic roles without rewriting any component HTML or CSS templates.

---

### 4. Can tokens guarantee accessible contrast?

No. Tokens cannot guarantee accessible contrast on their own because tokens are static value definitions, whereas contrast is a relational metric between two dynamically juxtaposed visual layers.

A design system can provide mathematically validated token pairs (such as `--colour-tertiary-role` and `--colour-on-tertiary-role` achieving a 10.24:1 ratio in Swash). However, a token system cannot prevent an engineer or AI agent from pairing a primary token with a dark grey text token, or placing tokenized text over an un-tokenized photographic hero banner or transparent overlay.

Tokens provide the necessary building blocks for accessibility, but guaranteeing compliance requires strict pairing governance, component encapsulation that sets foreground and background colours simultaneously, and automated accessibility auditing (e.g., Axe-core and Lighthouse) in CI pipelines.

---

### 5. How do you ensure that colour contrast guidelines are met within a website or application's design?

We ensure contrast guidelines through a four-stage engineering pipeline:

1. **Algorithmic Palette Generation:** Primary and secondary palettes are built on defined luminance steps (e.g., Material tonal steps 10 to 98) where mathematically defined step deltas guarantee contrast ratios before tokens are exported.
2. **Explicit Semantic Pairing:** Every foreground role is formally paired with a designated background role (e.g., Primary with On Primary, Error with On Error) and documented with exact numeric contrast ratios (`docs/colour-roles.md`).
3. **Component Encapsulation:** Component styles are written so that foreground and background properties are declared together using their assigned token pairs.
4. **Automated Testing & Audits:** Headless Axe and Lighthouse scans run during CI/CD to catch regressions, supplemented by manual browser DevTools inspections under color-blindness and high-contrast emulations.

---

### 6. Can you discuss the differences between WCAG levels A, AA and AAA?

The Web Content Accessibility Guidelines (WCAG) define three progressive conformance levels:

* **Level A (Essential):** The absolute minimum baseline. Addresses catastrophic barriers that completely prevent disabled users from using an application (e.g., full keyboard navigability, non-text content alternatives, avoiding reliance on colour alone, avoiding flashing animations that trigger seizures).
* **Level AA (Industry Standard):** The standard legal benchmark for commercial and public digital products. Requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold) and active UI controls; visible keyboard focus indicators; text resizing up to 200% without breaking layouts; and clear error identification.
* **Level AAA (Specialized / Highest):** Demands enhanced accessibility (7:1 contrast for normal text, 4.5:1 for large text, sign language interpretation for multimedia, contextual error prevention for legal/financial transactions). Most commercial products aim for AA because AAA severely constrains design palettes.

---

### 7. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML (`<header>`, `<main>`, `<nav>`, `<form>`, `<button>`, `<label>`) provides intrinsic accessibility by directly communicating structural landmarks, component roles, and element states to browser accessibility APIs and Assistive Technologies (AT).

When a native `<button>` is used, browsers automatically supply:
1. Keyboard accessibility (focusable via `Tab`, activatable via `Enter` and `Space`).
2. Correct accessibility tree roles without ARIA patching.
3. Native disabled states that announce properly to screen readers.

Conversely, a `<div onclick>` lacks keyboard event handlers, tab ordering, and role metadata unless manually re-engineered with extensive scripts and ARIA. Furthermore, semantic form controls paired with `<label for="...">` ensure screen readers announce input names, descriptions, and invalid states immediately upon focus.

---

### 8. How do you handle design handoff to developers using Figma?

I treat design handoff as a shared code-and-design contract rather than static visual redlines:

1. **Figma Variables as Source of Truth:** Colors, typography, spacing, and elevation are organized into Figma variable collections (Primitives and Semantic References) matching the target code architecture.
2. **Automated Token Pipelines:** Using tools like Figma Design Tokens, variables are exported as structured JSON (`06-tokens-complete.json`).
3. **Automated Transformation:** A transformation pipeline maps JSON tokens to platform CSS variables (`styles/global.css`), preserving references so primitive palette changes flow directly into semantic variables.
4. **Interactive Component Contracts:** Specifications describe interactive component states (hover, focus-visible, active, disabled, error), component props, accessibility constraints (`aria-describedby`), and responsive behaviors, backed by automated lint rules preventing hardcoded styling.

---

### 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?

LLMs generate output by predicting the statistically most probable next tokens based on their training corpus. When prompted vaguely ("build a modern dashboard"), the model outputs the mathematical average of millions of generic web templates: ubiquitous neutral-50 grays, default blue-600 buttons, standard Inter typography, and 4px border radii.

To prevent generic outputs, you must eliminate aesthetic ambiguity by handing the agent deterministic constraints:
1. **Authoritative Design Tokens:** An exported CSS stylesheet (`global.css`) containing semantic role variables.
2. **Distinctive Typography Rules:** Explicitly defined font pairings (e.g., Playfair Display paired with Open Sans) and strict line-height formulas.
3. **Cultural & Business Brief:** A concrete brief (`business-brief.md`) establishing specific voice and cultural references (e.g., Nigerian Ankara-inspired gold and deep purple).
4. **Negative Constraints:** Explicit rules (`RULES.md`) prohibiting raw hex literals, unauthorized utility classes, and arbitrary styling choices.

---

### 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?

Swash's Display Large uses a 62px font size with an 80.6px line height (a tight 1.3× multiplier):

* **Why 80.6px:** At 62px on desktop hero sections, 80.6px provides sufficient vertical breathing room while keeping multi-line headlines tightly unified as a single Gestalt reading block.
* **One Step Tighter (1.2× / 74.4px):** Capital letters with accents and ascending glyphs (`b`, `d`, `h`) collide directly with descending glyphs (`g`, `y`, `p`) from the line above. Headings become visually crowded, illegible, and clipped on certain browser rendering engines.
* **One Step Looser (1.4× / 86.8px or 1.5× / 93px):** Multi-line headlines decouple visually. Readers perceive two separate sentences rather than one cohesive title, and excessive vertical leading pushes key promotional copy and call-to-action buttons below the viewport fold.

---

### 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.

If starting again, I would restructure the shadow tokens so their colour components reference semantic colour tokens directly rather than exporting as hardcoded composite strings (`2px 8px 28px 0px #e9ddff40` in `06-tokens-complete.json`).

**What I would do instead:** Break shadows into modular tokens combining elevation coordinates (`--shadow-offset-y`, `--shadow-blur`) with CSS relative colour syntax or `color-mix()` linked to `--colour-primary-role`:
```css
box-shadow: 0 8px 28px rgb(from var(--colour-primary-role) r g b / 0.25);
```

**What it would cost:** In Figma, binding variables inside shadow effect styles is less mature and can complicate automated token export plugins. In browser CSS, relative colour syntax (`rgb(from ...)`) requires modern browser baselines, sacrificing compatibility on older Android mobile browsers prevalent in emerging markets.

---

### 12. Wrong-answer analysis: A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.

**What is missing:** The candidate exported primitive palette values, not design tokens. They omitted the semantic reference layer (roles like `--colour-surface-neutral`, `--colour-primary-role`, `--colour-on-primary-role`) that gives colours functional meaning.

**What will go wrong in month four:**
1. **Tightly Coupled Components:** Components will directly reference primitive names (e.g., `background: var(--purple-500)`). When brand designers adjust the primary colour or introduce secondary brand hues, developers must manually search and update every component class across the codebase.
2. **Theme Incapability:** Implementing dark mode in month four becomes impossible without a full CSS rewrite, because primitives have baked-in luminance (e.g., using `--white` or `--gray-100` for card backgrounds breaks when inverted).
3. **No Contrast Governance:** Without paired semantic roles (base and on-role), developers will freely pair arbitrary hex tokens, causing widespread WCAG contrast failures across newly shipped screens.
