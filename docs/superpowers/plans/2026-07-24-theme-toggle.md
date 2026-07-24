# Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light/dark theme toggle, reachable from a fixed footer bar rendered on every page, persisted across visits.

**Architecture:** All colors already flow through CSS custom properties in `src/styles/global.css`. A new `:root[data-theme="dark"]` override block supplies the dark values. A new `ThemeToggle.astro` component renders the fixed footer button and the click/localStorage script; it's rendered once from `Base.astro`, so every page that uses that layout (the deck and the `/process/` pages) gets it automatically. A blocking inline script in `Base.astro`'s `<head>` applies the stored theme before first paint, avoiding a flash of the wrong theme.

**Tech Stack:** Astro 7.1.1, existing `global.css` custom-property tokens, `localStorage`, Playwright MCP for browser verification.

## Global Constraints

- Two themes only: Light / Dark. No "System" option.
- Persisted via `localStorage` under the key `theme`; first-time visitors (no stored value) see light.
- The footer is a fixed bar, visible on every slide/page — rendered once from `Base.astro`, not per-page.
- No flash of wrong theme: the stored theme is applied via a blocking inline script (`<script is:inline>`) in `Base.astro`'s `<head>`, before first paint.
- Dark palette lives in `src/styles/global.css` as a single `:root[data-theme="dark"]` override block, reusing the existing custom-property names. Exact values (below) are verbatim from the spec.
- `.kbd`'s hardcoded border color (`#ddd2c4`) becomes a new `--kbd-border` token so it can flip with the theme.
- Toggle button uses inline SVG sun/moon icons, not emoji. The icon shown reflects the *current* active theme (sun visible in light, moon visible in dark).
- No changes to `src/pages/index.astro`, `src/pages/process/index.astro`, `src/pages/process/[...slug].astro`, `src/components/SlideNav.astro`, or `astro.config.mjs`.
- Work happens on branch `theme-toggle` off `main`.

**Dark palette (exact values):**

| token | light (unchanged) | dark (new) |
|---|---|---|
| `--bg` | `#faf6f0` | `#1c1917` |
| `--bg-accent` | `#f0e9df` | `#2a2521` |
| `--fg` | `#1c1917` | `#faf6f0` |
| `--muted` | `#6b6259` | `#a8a095` |
| `--accent` | `#9a3412` | `#fb923c` |
| `--accent-2` | `#1d4ed8` | `#60a5fa` |
| `--good` | `#3f6212` | `#84cc16` |
| `--bad` | `#be123c` | `#fb7185` |
| `--kbd-border` | `#ddd2c4` | `#3f3a34` |

---

### Task 1: Implement the theme toggle

**Files:**
- Modify: `src/styles/global.css:1-11` (root tokens block)
- Modify: `src/styles/global.css:78-85` (`.kbd` rule)
- Modify: `src/styles/global.css` (append footer/toggle styles at end of file)
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: existing custom-property tokens already used throughout `global.css` (`--bg`, `--fg`, `--muted`, `--accent`, etc.) — no dependency on other tasks.
- Produces: a `.theme-toggle` button (queried directly by Task 2's Playwright verification), the `data-theme` attribute on `<html>`, and the `theme` key in `localStorage` (`'dark'` or absent/`'light'`).

- [ ] **Step 1: Replace `src/styles/global.css` lines 1-11 (the `:root` block) with:**

```css
:root {
  --bg: #faf6f0;
  --bg-accent: #f0e9df;
  --fg: #1c1917;
  --muted: #6b6259;
  --accent: #9a3412;
  --accent-2: #1d4ed8;
  --good: #3f6212;
  --bad: #be123c;
  --kbd-border: #ddd2c4;
  --max-width: 60rem;
}

:root[data-theme="dark"] {
  --bg: #1c1917;
  --bg-accent: #2a2521;
  --fg: #faf6f0;
  --muted: #a8a095;
  --accent: #fb923c;
  --accent-2: #60a5fa;
  --good: #84cc16;
  --bad: #fb7185;
  --kbd-border: #3f3a34;
}
```

- [ ] **Step 2: Replace the `.kbd` rule (now at line ~89-96 after Step 1's insertion) with:**

```css
.kbd {
  font-family: ui-monospace, monospace;
  background: var(--bg-accent);
  border: 1px solid var(--kbd-border);
  border-radius: 6px;
  padding: 0.1em 0.45em;
  font-size: 0.85em;
}
```

(Only the `border` line's color changes from the hardcoded `#ddd2c4` to `var(--kbd-border)` — everything else in the rule is unchanged.)

- [ ] **Step 3: Append this block to the end of `src/styles/global.css`:**

```css

.theme-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.6rem 0;
  z-index: 10;
  pointer-events: none;
}

.theme-toggle {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 1px solid var(--muted);
  background: var(--bg);
  color: var(--fg);
  cursor: pointer;
  padding: 0;
}

.theme-toggle svg {
  width: 1.1rem;
  height: 1.1rem;
}

.theme-toggle .icon-moon {
  display: none;
}

:root[data-theme="dark"] .theme-toggle .icon-sun {
  display: none;
}

:root[data-theme="dark"] .theme-toggle .icon-moon {
  display: block;
}
```

- [ ] **Step 4: Create `src/components/ThemeToggle.astro`:**

```astro
<footer class="theme-footer">
  <button type="button" class="theme-toggle" aria-label="Switch to dark theme">
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</footer>

<script>
  const button = document.querySelector<HTMLButtonElement>('.theme-toggle')!;

  function isDark(): boolean {
    return document.documentElement.dataset.theme === 'dark';
  }

  function updateLabel(): void {
    button.setAttribute(
      'aria-label',
      isDark() ? 'Switch to light theme' : 'Switch to dark theme',
    );
  }

  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.dataset.theme = 'dark';
    } else {
      delete document.documentElement.dataset.theme;
    }
    localStorage.setItem('theme', next);
    updateLabel();
  });

  updateLabel();
</script>
```

- [ ] **Step 5: Replace all of `src/layouts/Base.astro` with:**

```astro
---
import '../styles/global.css';
import ThemeToggle from '../components/ThemeToggle.astro';

interface Props {
  title: string;
}

const { title } = Astro.props;
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
    <script is:inline>
      if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.dataset.theme = 'dark';
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <slot />
    <ThemeToggle />
  </body>
</html>
```

- [ ] **Step 6: Build and verify output**

Run: `npm run build`
Expected: exits 0, no errors.

Run: `grep -o 'class="theme-toggle"' dist/index.html`
Expected: prints the matched fragment (one line).

Run: `grep -o '#fb923c' dist/index.html`
Expected: prints the matched fragment (confirms the dark palette was bundled into the inlined CSS).

Run: `grep -o "localStorage.getItem('theme')" dist/index.html`
Expected: prints the matched fragment (confirms the blocking script was inlined).

Run: `grep -c 'class="slide"' dist/index.html`
Expected: `6` (unchanged from before this task — regression check).

Run: `grep -o 'class="theme-toggle"' dist/process/index.html`
Expected: prints the matched fragment (confirms `Base.astro` wiring reaches the `/process/` pages too).

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/components/ThemeToggle.astro src/layouts/Base.astro
git commit -m "feat: add light/dark theme toggle in footer"
```

---

### Task 2: Browser verification (controller-run, Playwright MCP)

This task is run by the session controller directly (Playwright MCP tools), not dispatched to a subagent.

**Files:**
- None modified. Screenshots go to the git-ignored `screenshots/` directory.

**Interfaces:**
- Consumes: the built site from Task 1.

- [ ] **Step 1: Serve the built site**

Run: `npm run build && npx astro preview` (background)
Expected: preview server on `http://localhost:4321/superpowers-101/`

- [ ] **Step 2: Fresh load — confirm light default**

Navigate to `http://localhost:4321/superpowers-101/`. Evaluate:

```js
({
  theme: document.documentElement.dataset.theme,               // expect undefined
  bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(), // expect "#faf6f0"
  buttonLabel: document.querySelector('.theme-toggle').getAttribute('aria-label'), // expect "Switch to dark theme"
})
```

- [ ] **Step 3: Click the toggle — confirm dark applied**

Click `.theme-toggle`. Evaluate:

```js
({
  theme: document.documentElement.dataset.theme,               // expect "dark"
  bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),      // expect "#1c1917"
  accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), // expect "#fb923c"
  buttonLabel: document.querySelector('.theme-toggle').getAttribute('aria-label'), // expect "Switch to light theme"
  stored: localStorage.getItem('theme'),                        // expect "dark"
})
```

- [ ] **Step 4: Reload — confirm persistence**

Reload the page. Evaluate: `document.documentElement.dataset.theme` — expect `"dark"` (no flash of light beforehand, per the blocking script).

- [ ] **Step 5: Click again — confirm it flips back**

Click `.theme-toggle`. Evaluate:

```js
({
  theme: document.documentElement.dataset.theme,  // expect undefined
  stored: localStorage.getItem('theme'),           // expect "light"
})
```

- [ ] **Step 6: Confirm the `/process/` pages share the same footer and theme**

Navigate to `http://localhost:4321/superpowers-101/process/`. Evaluate:

```js
({
  hasToggle: document.querySelector('.theme-toggle') !== null, // expect true
  theme: document.documentElement.dataset.theme,                 // expect undefined (we flipped back to light in Step 5)
})
```

Click `.theme-toggle` on this page, then navigate back to `http://localhost:4321/superpowers-101/`. Evaluate: `document.documentElement.dataset.theme` — expect `"dark"` (persistence is site-wide, not per-page).

- [ ] **Step 7: Console check**

Read console messages. Expected: no errors.

- [ ] **Step 8: Screenshots**

Screenshot the title slide in light mode and in dark mode. Eyeball: footer button doesn't collide with `SlideNav` dots or clip slide content; dark mode text is legible against the dark background.

- [ ] **Step 9: Record**

No commit (screenshots are git-ignored). Note results in the progress ledger; stop the preview server.

---

### Task 3: Post-merge deploy verification (controller-run)

Runs after `theme-toggle` merges to `main` and is pushed (via superpowers:finishing-a-development-branch).

- [ ] **Step 1: Wait for the Pages workflow**

Run: `gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
Expected: exits 0 (success).

- [ ] **Step 2: Smoke check**

```bash
curl -s -o /dev/null -w '%{http_code}\n' "https://rubens-lopes.github.io/superpowers-101/"
```
Expected: `200`

Run: `curl -s https://rubens-lopes.github.io/superpowers-101/ | grep -c 'class="theme-toggle"'`
Expected: `1` or more.
