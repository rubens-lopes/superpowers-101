# Theme Toggle — Design Spec

**Date:** 2026-07-24
**Status:** Approved
**Prior spec:** [2026-07-18-light-theme-redesign-design.md](./2026-07-18-light-theme-redesign-design.md)

## Goal

Add a light/dark theme picker to the deck, reachable from a fixed footer bar on every page, so the presenter can demo it live.

## Decisions

- **Two themes only: Light / Dark.** No "System" option — simplest to build and demo.
- **Persisted, default light.** The choice is written to `localStorage` and restored on future visits. First-time visitors (nothing in storage yet) see light, matching today's default look.
- **Fixed footer bar, visible on every slide.** A slim bar pinned to `bottom: 0` of the viewport, always reachable regardless of scroll position — mirrors how `SlideNav` is pinned to the right edge. It appears on every page of the site (the deck and the `/process/` making-of pages), not just `index.astro`, since it's rendered once from the shared `Base.astro` layout.
- **No flash of wrong theme.** A small render-blocking inline script in `Base.astro`'s `<head>` reads `localStorage` and sets `data-theme` on `<html>` before first paint.
- **Single source of truth for colors.** The dark palette lives in `src/styles/global.css` as a `:root[data-theme="dark"]` override block, reusing the same custom-property names already used everywhere (`--bg`, `--fg`, `--accent`, etc.) — no new stylesheet, no component-level color overrides to touch.
- **Icon, not emoji.** The toggle button uses a small inline SVG sun/moon icon (swapped based on the active theme) rather than an emoji glyph, to match the deck's designed typographic look.

## Dark Palette

Same hue families as the light theme, inverted for contrast on a dark background:

| token | light (today) | dark (new) |
|---|---|---|
| `--bg` | `#faf6f0` | `#1c1917` |
| `--bg-accent` | `#f0e9df` | `#2a2521` |
| `--fg` | `#1c1917` | `#faf6f0` |
| `--muted` | `#6b6259` | `#a8a095` |
| `--accent` | `#9a3412` | `#fb923c` |
| `--accent-2` | `#1d4ed8` | `#60a5fa` |
| `--good` | `#3f6212` | `#84cc16` |
| `--bad` | `#be123c` | `#fb7185` |
| `--kbd-border` (new token; `.kbd` currently hardcodes `#ddd2c4`) | `#ddd2c4` | `#3f3a34` |

## Components

**`src/styles/global.css`** — add the `:root[data-theme="dark"]` block above, and introduce the `--kbd-border` token (light value `#ddd2c4`, replacing the hardcoded value in `.kbd`). Add `.theme-footer` styles: fixed bottom bar, small icon button, sized to avoid colliding with `.slide-nav` (right-middle) or slide content.

**`src/components/ThemeToggle.astro`** (new) — renders:
```html
<footer class="theme-footer">
  <button type="button" class="theme-toggle" aria-label="Switch to dark theme">
    <!-- sun/moon SVG icons, one visible at a time based on data-theme -->
  </button>
</footer>
<script>
  // click handler: read current data-theme off <html>, flip it,
  // write the new value to localStorage, update aria-label
</script>
```

**`src/layouts/Base.astro`** — two additions:
1. In `<head>`, before the stylesheet link, a blocking inline script:
   ```html
   <script is:inline>
     const stored = localStorage.getItem('theme');
     if (stored === 'dark') document.documentElement.dataset.theme = 'dark';
   </script>
   ```
2. Render `<ThemeToggle />` as a sibling of `<slot />` in `<body>`, so it appears on every page that uses this layout.

## Files

- Modify: `src/styles/global.css`
- Modify: `src/layouts/Base.astro`
- Create: `src/components/ThemeToggle.astro`

## Verification

1. Local build, then Playwright against the preview:
   - Load the deck fresh (no localStorage) — confirm light theme, footer button present, no console errors.
   - Click the toggle — confirm `data-theme="dark"` on `<html>`, colors update (spot-check `--bg`/`--fg`/`--accent` via `getComputedStyle`), button's accessible label flips.
   - Reload the page — confirm dark persists (localStorage round-trip).
   - Click again — confirm it flips back to light and persists.
   - Navigate to a `/process/` page — confirm the footer and persisted theme both appear there too.
2. Confirm the footer does not visually collide with `SlideNav` or clip slide content at typical viewport sizes.
3. Deploy via the existing workflow; re-run live smoke checks.

## Out of scope

- A "System" (`prefers-color-scheme`-following) option.
- Per-slide or per-component theme overrides beyond the shared CSS custom properties.
- Styling markdown code blocks in the `/process/` pages beyond what already inherits from `body`'s `color`/`background` — no code-block-specific dark styling is being added or was present before.
