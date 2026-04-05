---
name: applying-color-theory
description: Applies semantic coloring, 60-30-10 dominant/secondary/accent ratios, and WCAG AA accessible contrast guidelines across user interfaces. Use when coloring UI elements, defining CSS variables, or validating accessibility.
---

# Applying UI Color Rules

## When to use this skill
- When defining global CSS variables for a color palette.
- When styling UI components where contrast and balance are poor.
- When testing a UI design for accessibility and dark mode compliance.

## Workflow
1. **Analyze existing palette**: Identify primary, secondary, and accent colors to ensure there are no more than 3 primary ones.
2. **Assign 60-30-10 distribution**:
   - 60%: Dominant background or surface colors.
   - 30%: Secondary layer colors (cards, secondary sections).
   - 10%: Accent colors for CTAs, outlines, and highlights.
3. **Verify Contrast (WCAG AA)**: Ensure all text over backgrounds has a minimum contrast ratio of 4.5:1. Avoid harsh `#000` text on `#FFF` backgrounds.
4. **Define Semantic Tokens**: Create clear custom properties for success, error, warning, etc. (e.g., `--color-success`, `--color-error`).
5. **Test Modularity**: Switch variables to a dark mode palette simulation and verify contrasts still pass.

## Instructions
* **Avoid harsh contrast**: Never use pure black (`#000000`) on pure white (`#FFFFFF`). Prefer Off-black (`#111827`) or darkest cool grays.
* **Avoid low contrast**: Never use `#CCCCCC` (or similar light grays) for text on a white background. Always maintain the 4.5:1 ratio threshold.
* **Do not use color alone**: Information (errors, success states) must use distinct icons, borders, or text labels along with the color.
* **Semantic Naming**: Name variables by intent, not literal color value (e.g., `--btn-primary` rather than `--btn-blue`).

## Resources
- [See W3C Accessibility Guidelines for WCAG AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0)
