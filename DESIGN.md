---
version: alpha
name: "CreatorDock"
description: "A crisp casting desk for brands and short-form creators to move from open call to selection."
colors:
  ink: "#17212B"
  muted-ink: "#66717E"
  canvas: "#F4F7FB"
  surface: "#FFFFFF"
  primary: "#5A4FF3"
  primary-dark: "#4338CA"
  accent: "#F06449"
  success: "#168765"
  warning: "#B76218"
  danger: "#C63E4F"
  border: "#DDE3EB"
  focus: "#2D6CDF"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Segoe UI Variable Display, sans-serif"
    lineHeight: "1.04"
  body:
    fontFamily: "Manrope Variable, Segoe UI Variable Text, sans-serif"
    lineHeight: "1.55"
  utility:
    fontFamily: "Manrope Variable, Segoe UI Variable Text, sans-serif"
    lineHeight: "1.35"
rounded:
  DEFAULT: "0.75rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
spacing:
  unit: "0.25rem"
  control: "0.75rem"
  panel: "1.25rem"
  section: "2.5rem"
  page-max: "75rem"
components:
  button: {}
  campaign-card: {}
  field: {}
  status-badge: {}
  toast: {}
  app-shell: {}
---

# CreatorDock Design System

## Overview

### Creative North Star

CreatorDock feels like a well-run creator casting desk: bright contact sheets, clipped briefs, and a clear shortlist—not a finance dashboard and not a neon social feed.

### Product context and register

- **Audience and primary job:** Small brand teams publish short-form briefs and choose applicants; creators discover suitable work, quote a per-post price, and track decisions; admins oversee both sides.
- **Target markets and evidence:** Global English-speaking MVP, based on the user brief and SideShift as a comparable creator-recruiting product.
- **Locale and language policy:** English (`en`) for the MVP. All owned UI copy lives in components and can be moved behind a locale layer later.
- **Usage scene:** Frequent desktop use by brands and admins; mobile-friendly browsing and applying for creators.
- **Register:** Hybrid. Public routes carry more brand expression; authenticated product routes prioritize legibility and repeatable workflows.
- **Memorable signature:** Every campaign appears as a casting ticket with a platform-colored rail and a consistent requirement strip.
- **Restraint:** Forms, applicant decisions, notifications, and admin tables avoid decorative effects.
- **Anti-references:** No generic purple-gradient SaaS hero, no glassmorphism, no social-feed imitation, and no dense enterprise sidebar full of unavailable modules.
- **Token ownership/runtime mapping:** `DESIGN.md` is the accepted design source. Tokens are mapped once into CSS custom properties in `app/globals.css`; shared components consume only those variables.

## Colors

`canvas` and `surface` create a cool, clean base. `primary` is reserved for safe primary actions and current navigation. `accent` marks campaign energy and TikTok rails, while Instagram uses `primary`. Semantic success, warning, and danger colors retain text/icon labels. `focus` is deliberately distinct from brand color.

## Typography

Bricolage Grotesque is used for restrained display moments and page titles. Manrope owns body, controls, and data. Labels use sentence case; all-caps is limited to short utility eyebrows with generous tracking. Numeric quotes use tabular figures.

## Layout

The application uses a 75rem content frame, a 15rem desktop navigation column, and natural document scrolling. Mobile navigation becomes a horizontally scrollable top row rather than an overlay. Spacing follows a 0.25rem base, with 0.75rem controls and 1.25rem panels. Campaign grids collapse from three to one column without hiding requirements.

## Elevation & Depth

Hierarchy comes from tonal surfaces, borders, and overlap. Static product cards use one restrained shadow only on hover. Sticky actions use an opaque surface and border. Blurred glass, floating gradients, and layered shadows are forbidden in authenticated views.

## Shapes

Controls and compact badges use `sm`/`md`; cards use `lg`; feature panels may use `xl`. Campaign rails remain square against the left card edge so the signature reads as structural, not decorative.

## Components

### Foundational visual states

All controls define default, hover, focus-visible, active, disabled, busy, and error states. Focus uses the `focus` token with an offset. Disabled controls remove pointer affordance. Loading uses a stable inline spinner; skeletons are not part of the MVP.

### Buttons and actions

Buttons combine emphasis (solid, outline, ghost) with intent (brand, neutral, success, danger). Each decision area has one solid primary action. Busy buttons preserve dimensions. Approve and reject are textually explicit and never represented by color alone.

### Navigation and data display

The desktop shell uses a quiet left navigation and sticky top utility bar. Campaign cards always expose platform, format, post count, dates, and status. Admin records use semantic tables with horizontal overflow on narrow screens.

### Forms and overlays

Fields use persistent labels, guidance/error slots, 2px authored borders, and app-owned validation. Selects use the shared Radix Select; campaign dates use typed `YYYY-MM-DD` fields so calendar behavior is not browser-dependent. Toasts use one live-region viewport in the top-right.

### Iconography

Lucide icons use 1.8–2px strokes and 16–20px sizes. Icons supplement labels except for universally understood controls with explicit accessible names.

### Motion

The public hero has one staged entrance. Product feedback uses 160–220ms state transitions. Reduced-motion removes transforms and collapses durations to near-instant opacity changes.

### Content and data visualization

Copy is direct and operational: “Publish campaign,” “Apply with quote,” “Approve creator.” Dates are written with month names in display contexts; stored values remain date-only ISO strings. Currency always includes an explicit ISO code.

## Do's and Don'ts

- **Do:** Keep campaign requirements visible before any application action.
- **Do:** Use the casting-ticket rail consistently for campaign identity.
- **Don't:** Decorate admin or decision screens like marketing pages.
- **Don't:** use color as the only signal for platform or application status.
