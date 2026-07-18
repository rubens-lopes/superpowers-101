# Light Theme Redesign ("Warm Editorial") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the deck and process pages from dark to a light "Warm Editorial" theme (Fraunces + Inter via Google Fonts) with projector-sized type, and capture this session's prompts.

**Architecture:** Pure styling change: swap the CSS custom properties in `global.css`, add Google Fonts links to the shared `Base.astro` layout, bump one inline size in `index.astro`. The process pages inherit everything through the same layout and stylesheet. One new curated prompt doc joins the existing content collection.

**Tech Stack:** Astro 7.1.1, plain CSS custom properties, Google Fonts CDN (Fraunces, Inter), Playwright MCP for browser verification.

## Global Constraints

- Theme tokens exactly as specced: `--bg: #faf6f0`, `--bg-accent: #f0e9df`, `--fg: #1c1917`, `--muted: #6b6259`, `--accent: #9a3412`, `--accent-2: #1d4ed8`, `--good: #3f6212`, `--bad: #be123c`; `.kbd` border `#ddd2c4`; `--max-width` unchanged at `60rem`.
- Headings (`h1, h2, h3`) use `'Fraunces', Georgia, serif`; body uses `'Inter'` ahead of the existing system stack.
- Fonts load via Google Fonts CDN only (no self-hosting, no npm font packages), one stylesheet link with `display=swap`, preceded by preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`.
- Type sizes: `h1` `clamp(2.75rem, 7vw, 5.5rem)`; `h2` `clamp(2rem, 4vw, 3.2rem)`; `.slide ul` `clamp(1.2rem, 2.2vw, 1.6rem)`; title-slide subtitle `clamp(1.25rem, 2.5vw, 1.8rem)`.
- No dark mode, no theme toggle, no layout or copy changes beyond the subtitle size.
- `astro.config.mjs` (site/base) must not be touched.
- Work happens on branch `light-theme` off `main`.

---

### Task 1: Theme tokens, fonts, and type sizes

**Files:**
- Modify: `src/styles/global.css` (entire file replaced)
- Modify: `src/layouts/Base.astro` (entire file replaced)
- Modify: `src/pages/index.astro:11` (one inline style value)

**Interfaces:**
- Consumes: existing class names (`.slide`, `.kbd`, `.cols-2`, `.slide-nav`, `.muted`) — all markup stays untouched except the one inline style.
- Produces: the CSS custom properties listed in Global Constraints, which Task 3 verifies in the browser.

- [ ] **Step 1: Replace `src/styles/global.css` with:**

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
  --max-width: 60rem;
}

* {
  box-sizing: border-box;
}

html {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.5;
}

h1, h2, h3 {
  font-family: 'Fraunces', Georgia, serif;
}

.slide {
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem clamp(1.5rem, 6vw, 6rem);
}

.slide > .slide-inner {
  max-width: var(--max-width);
  width: 100%;
  margin: 0 auto;
}

.slide h1 {
  font-size: clamp(2.75rem, 7vw, 5.5rem);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.slide h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 0 0 2rem;
  color: var(--accent);
}

.slide ul {
  font-size: clamp(1.2rem, 2.2vw, 1.6rem);
  padding-left: 1.4em;
}

.slide li {
  margin-bottom: 0.6em;
}

.slide a {
  color: var(--accent-2);
}

.muted {
  color: var(--muted);
}

.kbd {
  font-family: ui-monospace, monospace;
  background: var(--bg-accent);
  border: 1px solid #ddd2c4;
  border-radius: 6px;
  padding: 0.1em 0.45em;
  font-size: 0.85em;
}

.cols-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

@media (max-width: 40rem) {
  .cols-2 {
    grid-template-columns: 1fr;
  }
}

.slide-nav {
  position: fixed;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  z-index: 10;
}

.slide-nav button {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  border: 1px solid var(--muted);
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.slide-nav button.active {
  background: var(--accent);
  border-color: var(--accent);
}
```

- [ ] **Step 2: Replace `src/layouts/Base.astro` with:**

```astro
---
import '../styles/global.css';

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: In `src/pages/index.astro`, change the title-slide subtitle size (line 11).**

Old:

```astro
    <p class="muted" style="font-size: clamp(1.1rem, 2.5vw, 1.6rem);">
```

New:

```astro
    <p class="muted" style="font-size: clamp(1.25rem, 2.5vw, 1.8rem);">
```

No other change to this file.

- [ ] **Step 4: Build and verify output**

Run: `npm run build`
Expected: exits 0, "5 page(s) built" (plus process pages) with no errors.

Run: `grep -o "fonts.googleapis.com/css2[^\"]*" dist/index.html | head -1`
Expected: the css2 URL containing `family=Fraunces` and `family=Inter`.

Run: `grep -l "#faf6f0" dist/_astro/*.css`
Expected: one CSS file path printed. Also confirm the old dark background is gone: `grep -l "#12121a" dist/_astro/*.css` prints nothing (exit 1).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: light Warm Editorial theme — Fraunces/Inter, projector type sizes"
```

---

### Task 2: Capture session prompts (03-theme-redesign.md)

**Files:**
- Create: `docs/superpowers/prompts/03-theme-redesign.md`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: a new entry in the existing `prompts` content collection; it renders at `/process/prompts/03-theme-redesign/` with no code changes (the glob loader picks it up).

- [ ] **Step 1: Create `docs/superpowers/prompts/03-theme-redesign.md` with exactly:**

```markdown
# Prompt 03 — Light Theme Redesign

**Date:** 2026-07-18
**Session:** 2 (theme & typography review)
**Skills invoked:** `superpowers:using-superpowers` → `superpowers:brainstorming` → `superpowers:writing-plans` → `superpowers:subagent-driven-development`

## Prompt (verbatim)

> to review font size, face type and theme, I heard that light ones work better for presentations. Make use of /design to a better result

Approvals along the way: "ok" (design), "good to go" (spec).

## Outcome

Brainstorming settled three decisions:

- **Light only, no toggle** — the dark/light toggle stays reserved as the live hands-on demo for slide 4.
- **Google Fonts CDN** — user's pick over self-hosted fonts.
- **Direction chosen visually** — three candidate themes (Crisp Tech, Warm Editorial, Plex Developer) were pushed as preview cards to a claude.ai/design project via the DesignSync tool; the user picked **B — Warm Editorial**: Fraunces headings + Inter body on warm paper `#faf6f0`.

The spec ([2026-07-18 light theme redesign](https://rubens-lopes.github.io/superpowers-101/process/specs/2026-07-18-light-theme-redesign-design/)) and [its plan](https://rubens-lopes.github.io/superpowers-101/process/plans/2026-07-18-light-theme-redesign/) drove the implementation: theme tokens + fonts + type sizes, this prompt log, Playwright verification, deploy.
```

- [ ] **Step 2: Build and verify the page renders**

Run: `npm run build`
Expected: exits 0.

Run: `test -f dist/process/prompts/03-theme-redesign/index.html && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/prompts/03-theme-redesign.md
git commit -m "docs: theme-redesign session prompt log"
```

---

### Task 3: Browser verification (controller-run, Playwright MCP)

This task is run by the session controller directly (Playwright MCP tools), not dispatched to a subagent.

**Files:**
- None modified. Screenshots go to the git-ignored `screenshots/` directory.

**Interfaces:**
- Consumes: the built site from Tasks 1–2.

- [ ] **Step 1: Serve the built site**

Run: `npm run build && npx astro preview` (background)
Expected: preview server on `http://localhost:4321/superpowers-101/`

- [ ] **Step 2: Navigate and check theme + fonts**

Navigate to `http://localhost:4321/superpowers-101/`. Evaluate:

```js
({
  bg: getComputedStyle(document.body).backgroundColor,        // expect "rgb(250, 246, 240)"
  fraunces: document.fonts.check('700 1rem Fraunces'),        // expect true
  inter: document.fonts.check('400 1rem Inter'),              // expect true
})
```

- [ ] **Step 3: Console check**

Read console messages. Expected: no errors (warnings acceptable, none expected).

- [ ] **Step 4: Screenshots**

Screenshot each of the 5 slides (`#title`, `#what-is-it`, `#whats-inside`, `#good-and-bad`, `#hands-on`) and the process index at `/superpowers-101/process/`. Eyeball: readable contrast, terracotta headings, serif headings / sans body, nothing clipped.

- [ ] **Step 5: Record**

No commit (screenshots are git-ignored). Note results in the progress ledger; stop the preview server.

---

### Task 4: Post-merge deploy verification (controller-run)

Runs after `light-theme` merges to `main` and is pushed (via superpowers:finishing-a-development-branch).

- [ ] **Step 1: Wait for the Pages workflow**

Run: `gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
Expected: exits 0 (success).

- [ ] **Step 2: Smoke checks**

```bash
for u in \
  "https://rubens-lopes.github.io/superpowers-101/" \
  "https://rubens-lopes.github.io/superpowers-101/process/" \
  "https://rubens-lopes.github.io/superpowers-101/process/prompts/03-theme-redesign/"; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"
done
```

Expected: `200` for all three.

Run: `curl -s https://rubens-lopes.github.io/superpowers-101/ | grep -c "fonts.googleapis.com"`
Expected: `1` or more.
