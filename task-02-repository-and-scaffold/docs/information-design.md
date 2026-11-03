# Information Design & Responsive Typography Decisions

This document records the decisions and engineering rationale applied in **Step 10 (Improve Information Design)** on the `feat/information-design` branch across [`src/app/layout.tsx`](../../src/app/layout.tsx), [`src/app/page.tsx`](../../src/app/page.tsx), [`src/app/plans/page.tsx`](../../src/app/plans/page.tsx), [`src/components/SiteHeader.tsx`](../../src/components/SiteHeader.tsx), [`src/components/EnquiryForm.tsx`](../../src/components/EnquiryForm.tsx), and [`src/app/page.module.css`](../../src/app/page.module.css).

---

## 1. Browser `<head>` Metadata (`16-head-route-one.png` & `17-head-route-two.png`)

1. **Page Titles That Change with Navigation:**
   - Configured Next.js App Router's `Metadata` title template in [`src/app/layout.tsx`](../../src/app/layout.tsx):
     ```ts
     title: {
       default: "Swash | Subscription Laundry Service in Lagos",
       template: "%s | Swash Laundry",
     }
     ```
   - Navigating between `/` (`Swash | Subscription Laundry Service in Lagos`, captured in `evidence/16-head-route-one.png`) and `/plans` (`Subscription Plans & Allowance Tiers | Swash Laundry`, captured in `evidence/17-head-route-two.png`) updates the document `<title>` dynamically so users with multiple browser tabs open can distinguish screens immediately.
2. **Concise Tagline Under Ten Words:**
   - Replaced the verbose multi-clause subtitle with a 7-word tagline:
     > **Subscription laundry pickup and delivery across Lagos.**
   - Used consistently in the visible header (`src/components/SiteHeader.tsx`) and in the root `description` and `openGraph.description` metadata.
3. **Appropriate SEO Metadata on the Marketing Page:**
   - Added `description`, `keywords`, `robots: { index: true, follow: true }`, and canonical URLs (`alternates.canonical`) in [`src/app/layout.tsx`](../../src/app/layout.tsx) and [`src/app/plans/page.tsx`](../../src/app/plans/page.tsx).
4. **Custom Swash Favicon:**
   - Created [`src/app/icon.svg`](../../src/app/icon.svg), an SVG emblem featuring a clean garment-care droplet and wave motif rendered in Swash's brand purple (`rgb(53, 0, 120)`) and lavender (`rgb(233, 221, 255)`). Next.js App Router automatically serves and links `<link rel="icon" href="/icon.svg..." type="image/svg+xml" />` in the rendered `<head>`.
5. **Open Graph Metadata for Shared Links:**
   - Configured `openGraph.title`, `openGraph.description`, `openGraph.url`, `openGraph.siteName` (`"Swash"`), `openGraph.locale` (`"en_NG"`), and `openGraph.type` (`"website"`) so links shared on WhatsApp, Slack, or LinkedIn render rich previews.

---

## 2. Interface Content Improvements (`18-heading-wrap-bad.png` & `19-heading-wrap-good.png`)

1. **Removed Redundant and Repetitive Content:**
   - **Before:** [`src/app/page.tsx`](../../src/app/page.tsx) repeated nearly identical phrases ("orders, payments, subscription allowances, and collection or delivery") across three separate blocks: an intro paragraph, a bordered `aside` notice box, and a form lead-in paragraph.
   - **After:** Removed the redundant `aside` callout and duplicate form subtext, leaving a single clear value proposition (*"Manage scheduled collections, monthly item allowances, and verified payments in one connected record."*) above the primary action.
2. **Simplified a Choice Users Should Not Have to Make:**
   - **Before:** [`src/components/EnquiryForm.tsx`](../../src/components/EnquiryForm.tsx) asked prospective customers to distinguish between internal operational categories (`"Individual Subscription"` vs. `"Special Item / Duvet Quotation"`) before knowing whether special items are covered under a plan.
   - **After:** Changed the field to *"Who is this laundry plan for?"* with three self-explanatory household/business profiles (`Individual (1–2 people)`, `Family Household (3+ people)`, `Small Business / Office`), pre-selecting `Individual (1–2 people)` by default and letting users mention special items like duvets in the optional notes field.
3. **Controlled Main Heading Line Wrapping with `max-width`:**
   - **Before (`evidence/18-heading-wrap-bad.png`):** Without a `max-width` constraint, `.heroHeading` either stretched with an awkward single orphan word (`"businesses"`) on the final line or overflowed at narrow widths.
   - **After (`evidence/19-heading-wrap-good.png`):** Applied `max-width: 22ch` and `text-wrap: balance` to `.heroHeading` in [`src/app/page.module.css`](../../src/app/page.module.css), grouping the 9-word heading into three balanced lines (*"Effortless laundry for busy / professionals, families, / and small businesses"*).
4. **Used `rem`-Based Button Padding Instead of Fixed Width and Height:**
   - Every interactive button and pill link (`.submitButton`, `.secondaryButton`, `.navButton`) uses `padding: 0.875rem 1.5rem`, `0.75rem 1.5rem`, or `0.5rem 1rem` with zero fixed `width` or `height` rules, allowing buttons to adapt safely when text wraps or browser font sizes are scaled by the user.
5. **Applied Task 1 Label Typography to Every Button:**
   - Bound `.submitButton`, `.secondaryButton`, and `.navButton` in [`src/app/page.module.css`](../../src/app/page.module.css) to the exported Task 1 `--typography-open-sans-label-large-*` token set (`font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, `text-decoration`).
6. **Verified Pointer Behaviour and Visible Hover Feedback:**
   - Set `cursor: pointer`, semantic `:hover` surface/text colour transitions (`--colour-dark-primary-role`, `--colour-inverse-primary-role`, `--colour-on-inverse-primary-role`), and `0.125rem` `:focus-visible` outlines across `.logoLink`, `.navButton`, `.secondaryButton`, and `.submitButton`.
7. **Ensured the Swash Logo Links Home:**
   - Extracted [`src/components/SiteHeader.tsx`](../../src/components/SiteHeader.tsx) with `<Link href="/" className={styles.logoLink} aria-label="Swash home">Swash</Link>` so clicking the Swash wordmark from any route (`/` or `/plans`) navigates home.

---

## 3. Responsive Typography with `clamp()` (`20-responsive-three-widths.png`)

- **Problem at Narrow Viewports (`evidence/18-heading-wrap-bad.png`):**
  A static display heading (`--typography-playfair-display-large-font-size: 3.5625rem` / `57px` or `display-medium: 2.8125rem` / `45px`) breaks and overflows horizontally when the viewport is reduced to mobile widths (`320px–375px`) because long words like `"professionals,"` exceed the container width.
- **`clamp()` Solution (`evidence/20-responsive-three-widths.png`):**
  Replaced the static font size on `.heroHeading` in [`src/app/page.module.css`](../../src/app/page.module.css) with a fluid `clamp()` expression grounded in Task 1 typography tokens:
  ```css
  font-size: clamp(
    var(--typography-playfair-headline-small-font-size),
    3.5vw + 0.875rem,
    var(--typography-playfair-display-medium-font-size)
  );
  ```
  - **Minimum (`1.5rem` / `24px`):** `--typography-playfair-headline-small-font-size` prevents word overflow on `320px–375px` mobile screens.
  - **Preferred (`3.5vw + 0.875rem`):** Scales smoothly across `768px` tablet viewports (`~2.55rem`).
  - **Maximum (`2.8125rem` / `45px`):** Caps at `--typography-playfair-display-medium-font-size` on `1280px+` desktop viewports.

