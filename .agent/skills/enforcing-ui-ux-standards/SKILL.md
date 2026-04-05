---
name: enforcing-ui-ux-standards
description: Enforces frontend engineering best practices including skeleton loaders, hardware-accelerated animations, accessibility, form validation, and layout heuristics. Use when generating, reviewing, or refactoring UI components.
---

# Enforcing UI/UX Standards

## When to use this skill
- When building new UI elements (especially animated ones like skeleton loaders or border beams).
- When writing CSS or framer-motion animations (to ensure GPU acceleration).
- When doing an accessibility, performance, or mobile-responsiveness pass over existing UI.
- When generating form components or navigation elements.

## Workflow

When auditing or building a component, verify against this checklist:

- [ ] **Animation & Performance**: 
  - Are animations restricted to `transform` and `opacity`? 
  - Is `will-change` used appropriately for animated elements?
  - Are interactions faster than 300ms?
  - Do animations block user action? *(They shouldn't!)*
  - Does the component respect `@media (prefers-reduced-motion: reduce)`?
- [ ] **Accessibility & Contrast**:
  - Is contrast at least 4.5:1? (No light grey `#CCC` on white backgrounds)
  - Are icons labeled with text or `aria-label`/tooltips?
  - Is information conveyed through means *other* than just color?
- [ ] **Layout & Navigation**:
  - Are fonts limited to a max of 2 families and 5 sizes?
  - Are primary colors limited to 3?
  - Is spacing consistent (using an 8px grid)?
  - Are tap targets at least 44x44px for mobile?
- [ ] **Forms**:
  - Are labels placed *outside* inputs (to prevent screen reader failures)?
  - Is validation handled inline rather than only on submit?
  - Is the submit button active (so user can click and see errors) rather than disabled?

## Instructions

### 1. Skeleton Loaders
* Use a shimmer effect via a linear gradient animation.
* Shape the skeleton to exactly match the final content layout to avoid Layout Shifts (CLS > 0.1).
* Use light grey (`#E5E7EB`) on a white background.
* Animation must be `1.5s infinite ease-in-out`.

### 2. Animated Elements (Border Beams, CTAs)
* Use conic gradient rotations and subtle glow effects exclusively for CTAs, featured cards, and premium elements.
* Example CSS Implementation:
  ```css
  background: linear-gradient(90deg, transparent, #3B82F6, transparent);
  animation: beam 2s infinite;
  ```

### 3. GPU Acceleration & Motion
Prefer CSS animations over JS. When building animations:
* exclusively animate `transform` and `opacity`.
* Use `requestAnimationFrame` for JS animations and debounce scroll events.
* Implement a mandatory reduced-motion override:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

### 4. Absolute Anti-Patterns (NEVER DO THESE)
* **No pure white on pure black:** It is too harsh for astigmatism.
* **No hamburger menus on desktop:** Display links clearly.
* **No fixed elements covering content:** Respect the viewport.
* **No horizontal scroll** unless it is explicitly an intentional carousel.
* **No auto-playing videos with sound** or auto-playing carousels without pausing.
* **No Lorem Ipsum** in production code. Use descriptive mock text.

## Resources
- Ensure `will-change` guidelines are followed to avoid memory leaks.
- Test contrast with automated tools simulating color blindness.
