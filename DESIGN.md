---
name: Aetheric Realty
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#46464a'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#77767b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e60'
  primary: '#030304'
  on-primary: '#ffffff'
  primary-container: '#1d1d1f'
  on-primary-container: '#868587'
  inverse-primary: '#c8c6c8'
  secondary: '#5e5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfe4'
  on-secondary-container: '#626267'
  tertiary: '#00030c'
  on-tertiary: '#ffffff'
  tertiary-container: '#001c42'
  on-tertiary-container: '#2d83f6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e2e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1b1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c7c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#d7e2ff'
  tertiary-fixed-dim: '#abc7ff'
  on-tertiary-fixed: '#001b3f'
  on-tertiary-fixed-variant: '#00458f'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  system-bg: '#ffffff'
  surface-offwhite: '#f5f5f7'
  accent-blue: '#0071e3'
  text-primary: '#1d1d1f'
  text-secondary: '#86868b'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.47'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is engineered to evoke a sense of "premium precision" for the high-end real estate market. It adopts a **Hyper-Minimalist** style, drawing heavily from contemporary editorial design and high-tech product showcases. The brand personality is authoritative yet approachable, focusing on clarity, photographic excellence, and an uncompromising reduction of visual noise.

By utilizing expansive whitespace (negative space) as a structural element rather than a void, the design system ensures that high-resolution property imagery remains the focal point. The emotional response should be one of calm confidence, reliability, and effortless luxury.

## Colors

The palette is strictly monochromatic with a singular functional accent. 

- **Primary & Neutral:** Pure white (#FFFFFF) is the foundation for all backgrounds to maximize brightness. Charcoal (#1D1D1F) provides high-contrast legibility for primary headings and body copy.
- **Secondary:** Silver-Grey (#86868B) is reserved for metadata, captions, and secondary labels to establish visual hierarchy without clutter.
- **Accent:** Apple Blue (#0071E3) is used sparingly for interactive elements, links, and primary calls-to-action, ensuring they remain discoverable within the minimalist environment.
- **Surface:** A subtle off-white (#F5F5F7) is utilized for large container backgrounds or section alternates to provide gentle separation without the need for borders.

## Typography

This design system uses **Inter** exclusively to achieve a clean, systematic look that mirrors the clarity of modern interfaces. 

- **Scale:** High contrast between display sizes and body text is essential. Display styles should use tight letter spacing and semi-bold weights to feel "architectural."
- **Readability:** Body text is set at 17px or 19px to ensure a premium, accessible reading experience with generous line heights.
- **Hierarchy:** Use the `label-sm` (uppercase) for category tags or "New" badges to provide a distinct stylistic break from the standard sentence-case body text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain editorial control over content density, transitioning to a fluid model for mobile.

- **Rhythm:** An 8px baseline grid governs all spacing.
- **Sectioning:** Large vertical gaps (120px+) should be used between major content blocks to emphasize the minimalist aesthetic and prevent visual fatigue.
- **Desktop:** A 12-column grid with 24px gutters. Use wide margins (64px) to frame content within the center of the viewport.
- **Mobile:** A 4-column grid with 20px margins. Stack content vertically, prioritizing full-bleed imagery for property listings.

## Elevation & Depth

Depth is achieved through **Tonal Layers** rather than traditional shadows.

- **Surfaces:** Use the `#f5f5f7` background to define card areas or secondary content sections.
- **Shadows:** Avoid all heavy shadows. A single "micro-shadow" is permitted for interactive cards: `0 2px 8px rgba(0,0,0,0.04)`. This should feel almost imperceptible, serving only to lift the element slightly from the pure white background.
- **Borders:** Do not use borders for containers. Use spacing and subtle background color shifts to define boundaries.

## Shapes

The design system employs a "Mixed Radius" strategy to balance organic friendliness with structural precision.

- **Interactive Elements:** Buttons, search bars, and input chips use a **Pill-shaped (980px)** radius. This makes touch targets feel approachable and distinct from the content they sit upon.
- **Media Containers:** Images, property cards, and video players must use a **16px (rounded-lg)** radius. This softens the high-tech aesthetic and mimics the physical hardware of premium devices.

## Components

- **Buttons:** Primary buttons are pill-shaped, using `#0071e3` background with white text. Secondary buttons use a simple blue text link with a chevron icon (`>`).
- **Search Bars:** Large, pill-shaped inputs with a subtle `#f5f5f7` fill. The "Search" icon should be minimalist (2px stroke).
- **Cards:** Property cards should feature 16px rounded images. Text metadata should sit below the image with generous padding, rather than overlaid, to maintain legibility.
- **Chips:** Small, pill-shaped tags used for "Available" or "Sold" status. Use light-grey backgrounds with `#1d1d1f` text.
- **Inputs:** Standard form fields should be clean, with no borders—only a bottom stroke of 1px in `#d2d2d7` which transitions to `#0071e3` on focus.
- **Property Hero:** A full-bleed or large-scale 16px rounded image component that uses the `display-lg` typography overlaying the white background above or below the media.
