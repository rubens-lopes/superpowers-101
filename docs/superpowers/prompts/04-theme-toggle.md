# Prompt 04 — Theme Toggle

**Date:** 2026-07-24
**Session:** 4 (theme toggle)
**Skills invoked:** `superpowers:using-superpowers` → `superpowers:brainstorming` → `superpowers:writing-plans`

## Prompt (verbatim)

> let have a theme picker for this presentation, I want to have it on the footer

## Outcome

Brainstorming settled four decisions, one question at a time:

- **Light/Dark toggle only** — no "System" option, simplest to build and demo.
- **Persisted, default light** — the choice is written to `localStorage`; first-time visitors see light.
- **Fixed footer bar, visible on every slide** — since the deck had no footer yet, a bar pinned to the bottom of the viewport (mirroring how `SlideNav` is pinned to the right edge) beat a traditional end-of-page `<footer>`.
- **Icon, not emoji** — an inline SVG sun/moon swap, to match the deck's designed typographic look.

The dark palette mirrors the light theme's hue families, inverted for contrast on a dark background, added as a single `:root[data-theme="dark"]` override in `global.css` — no new stylesheet, no per-component overrides.

The spec ([2026-07-24 theme toggle design](https://rubens-lopes.github.io/superpowers-101/process/specs/2026-07-24-theme-toggle-design/)) and [its plan](https://rubens-lopes.github.io/superpowers-101/process/plans/2026-07-24-theme-toggle/) lay out the implementation: one task adds the CSS tokens, the new `ThemeToggle.astro` component, and the `Base.astro` wiring; a controller-run Playwright pass verifies the toggle, persistence, and the `/process/` pages; a final pass verifies the live deploy.
