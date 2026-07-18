# Superpowers 101 Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An Astro slide deck about the superpowers plugin, plus a browsable "making-of" section rendering this repo's own prompts/specs/plans, deployed to GitHub Pages.

**Architecture:** Static Astro 7 site. One page (`/`) is the deck — full-viewport `<section>` slides with keyboard/click navigation. A `/process` section renders `docs/superpowers/**` markdown via three content collections (prompts, specs, plans). GitHub Actions builds and deploys to Pages.

**Tech Stack:** Astro 7.1.x, Node 22, no UI framework, no test framework (verification = `astro build` + driving the built site).

## Global Constraints

- Astro `^7.1.1`, Node 22 (matches local `v22.22.0`).
- No runtime dependencies beyond `astro`. No reveal.js, no React.
- Repo name `superpowers-101`; `base: '/superpowers-101'` in Astro config. All internal links/assets MUST be prefixed with `import.meta.env.BASE_URL`.
- `site` uses owner placeholder `https://OWNER.github.io` until the GitHub owner is confirmed at push time (Task 6 asks the user; this is the only permitted placeholder).
- Astro 7's compiler is strict: all HTML tags must be explicitly closed; no invalid nesting.
- Slide 3 ships with a clearly-labeled placeholder — its content arrives from the user during draft review (spec decision).
- Every commit message ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Process docs in `docs/superpowers/` are plain markdown, no frontmatter required.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 2)

**Interfaces:**
- Produces: working `npm run build` / `npm run dev`; `import.meta.env.BASE_URL` = `/superpowers-101/` for all later tasks.

- [ ] **Step 1: Write project files**

`package.json`:

```json
{
  "name": "superpowers-101",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^7.1.1"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://OWNER.github.io',
  base: '/superpowers-101',
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`.gitignore`:

```
node_modules/
dist/
.astro/
```

`src/pages/index.astro`:

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Superpowers 101</title>
  </head>
  <body>
    <h1>Superpowers 101</h1>
  </body>
</html>
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: completes without errors; `package-lock.json` created.

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `Complete!` (or similar success line); `dist/index.html` exists.

Run: `grep -c "Superpowers 101" dist/index.html`
Expected: `1` or more.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
git commit -m "chore: scaffold Astro project

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Deck framework (layout, Slide component, navigation)

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Create: `src/components/Slide.astro`
- Create: `src/components/SlideNav.astro`
- Modify: `src/pages/index.astro` (two placeholder slides to prove the mechanics; real content in Task 3)

**Interfaces:**
- Consumes: build setup from Task 1.
- Produces: `Base.astro` with props `{ title: string }` and a `<slot />`; `Slide.astro` with props `{ id: string }` rendering `<section class="slide" id={id}>` around a slot; `SlideNav.astro` (no props — its client script discovers `.slide` sections at runtime). Task 3 composes these; Task 4 reuses `Base.astro`.

- [ ] **Step 1: Write the stylesheet**

`src/styles/global.css`:

```css
:root {
  --bg: #12121a;
  --bg-accent: #1c1c2e;
  --fg: #e8e8f0;
  --muted: #9a9ab0;
  --accent: #ffb454;
  --accent-2: #7aa2f7;
  --good: #9ece6a;
  --bad: #f7768e;
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
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.5;
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
  font-size: clamp(2.5rem, 7vw, 5rem);
  margin: 0 0 1rem;
  line-height: 1.1;
}

.slide h2 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin: 0 0 2rem;
  color: var(--accent);
}

.slide ul {
  font-size: clamp(1.05rem, 2vw, 1.4rem);
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
  border: 1px solid #33334d;
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

- [ ] **Step 2: Write layout and components**

`src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/components/Slide.astro`:

```astro
---
interface Props {
  id: string;
}

const { id } = Astro.props;
---
<section class="slide" id={id}>
  <div class="slide-inner">
    <slot />
  </div>
</section>
```

`src/components/SlideNav.astro`:

```astro
<nav class="slide-nav" aria-label="Slides"></nav>

<script>
  const nav = document.querySelector('.slide-nav')!;
  const slides = Array.from(document.querySelectorAll<HTMLElement>('.slide'));

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => slide.scrollIntoView());
    nav.appendChild(dot);
  });

  const dots = Array.from(nav.querySelectorAll('button'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = slides.indexOf(entry.target as HTMLElement);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      }
    },
    { threshold: 0.6 },
  );
  slides.forEach((s) => observer.observe(s));

  function currentIndex(): number {
    const active = dots.findIndex((d) => d.classList.contains('active'));
    return active === -1 ? 0 : active;
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      slides[Math.min(currentIndex() + 1, slides.length - 1)].scrollIntoView();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      slides[Math.max(currentIndex() - 1, 0)].scrollIntoView();
    } else if (e.key === 'Home') {
      e.preventDefault();
      slides[0].scrollIntoView();
    } else if (e.key === 'End') {
      e.preventDefault();
      slides[slides.length - 1].scrollIntoView();
    }
  });
</script>
```

- [ ] **Step 3: Wire placeholder slides into the deck page**

Replace `src/pages/index.astro` entirely:

```astro
---
import Base from '../layouts/Base.astro';
import Slide from '../components/Slide.astro';
import SlideNav from '../components/SlideNav.astro';
---
<Base title="Superpowers 101">
  <Slide id="one">
    <h1>Placeholder one</h1>
  </Slide>
  <Slide id="two">
    <h1>Placeholder two</h1>
  </Slide>
  <SlideNav />
</Base>
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: success.

Run: `grep -c 'class="slide"' dist/index.html`
Expected: `2` (may report `1` if both are on one line — then run `grep -o 'class="slide"' dist/index.html | wc -l` and expect `2`).

Run: `grep -c 'slide-nav' dist/index.html`
Expected: at least `1`.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/components/Slide.astro src/components/SlideNav.astro src/pages/index.astro
git commit -m "feat: slide framework with keyboard navigation

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Slide content

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder slides with the five real slides)

**Interfaces:**
- Consumes: `Base.astro`, `Slide.astro`, `SlideNav.astro` from Task 2.
- Produces: final deck markup; the `#hands-on` slide links to `${base}process/`, which Task 4 creates.

- [ ] **Step 1: Write the deck**

Replace `src/pages/index.astro` entirely:

```astro
---
import Base from '../layouts/Base.astro';
import Slide from '../components/Slide.astro';
import SlideNav from '../components/SlideNav.astro';

const base = import.meta.env.BASE_URL;
---
<Base title="Superpowers 101">
  <Slide id="title">
    <h1>Superpowers <span class="muted">101</span></h1>
    <p class="muted" style="font-size: clamp(1.1rem, 2.5vw, 1.6rem);">
      A crash course in the <strong>superpowers</strong> plugin for Claude Code —
      presented by a deck that superpowers built.
    </p>
    <p class="muted">
      Navigate with <span class="kbd">←</span> <span class="kbd">→</span> ·
      Sources, prompts &amp; plans: <a href={`${base}process/`}>the making-of</a>
    </p>
  </Slide>

  <Slide id="what-is-it">
    <h2>1 · What is it?</h2>
    <ul>
      <li>A <strong>software-development methodology for coding agents</strong>, packaged as a plugin — for Claude Code, Codex, Cursor, OpenCode, and friends.</li>
      <li>Built by <strong>Jesse Vincent</strong> (obra) — of Request Tracker and Keyboardio fame.</li>
      <li>14 composable <strong>process skills</strong> plus bootstrap instructions that make the agent actually use them.</li>
      <li>The point: the agent stops jumping straight into code — it brainstorms, writes a spec, plans, <em>then</em> implements.</li>
    </ul>
    <p class="muted">
      Learn more: <a href="https://github.com/obra/superpowers">github.com/obra/superpowers</a> ·
      Jesse's writeups at <a href="https://blog.fsck.com">blog.fsck.com</a> ·
      install from the <a href="https://claude.com/plugins/superpowers">official plugin marketplace</a>
    </p>
  </Slide>

  <Slide id="whats-inside">
    <h2>2 · What's inside?</h2>
    <div class="cols-2">
      <div>
        <h3>The workflow</h3>
        <ul>
          <li><strong>brainstorming</strong> → design Q&amp;A, one question at a time, ends in a committed spec</li>
          <li><strong>writing-plans</strong> → bite-sized tasks, "for an enthusiastic junior with no context"</li>
          <li><strong>subagent-driven-development</strong> → fresh subagent per task, review between tasks</li>
          <li><strong>verification-before-completion</strong> → evidence before claims</li>
          <li><strong>finishing-a-development-branch</strong> → merge/PR/cleanup, deliberately</li>
        </ul>
      </div>
      <div>
        <h3>The philosophy</h3>
        <ul>
          <li>Skills are <strong>mandatory process</strong>, not suggestions: "if a skill applies, you MUST use it"</li>
          <li>Red/green <strong>TDD</strong>, YAGNI, DRY, frequent commits</li>
          <li>Documents as artifacts: specs and plans live in the repo</li>
          <li>Plus: systematic-debugging, code-review skills, git worktrees, parallel agents, and a skill for writing skills</li>
        </ul>
      </div>
    </div>
  </Slide>

  <Slide id="good-and-bad">
    <h2>3 · The Good and the Not&nbsp;So&nbsp;Good</h2>
    <div class="cols-2">
      <div>
        <h3 style={`color: var(--good)`}>The Good</h3>
        <ul>
          <li class="muted"><em>Placeholder — the presenter's field notes land here.</em></li>
        </ul>
      </div>
      <div>
        <h3 style={`color: var(--bad)`}>The Not So Good</h3>
        <ul>
          <li class="muted"><em>Placeholder — honest gripes coming soon.</em></li>
        </ul>
      </div>
    </div>
  </Slide>

  <Slide id="hands-on">
    <h2>4 · Hands on</h2>
    <ul>
      <li><strong>Live:</strong> let's add a small feature to <em>this deck</em> — full loop: brainstorm → spec → plan → implement.</li>
      <li><strong>Already happened:</strong> everything you're looking at was built that way.</li>
      <li>Browse <a href={`${base}process/`}>the making-of</a> — every prompt, spec, and plan behind this deck, verbatim.</li>
    </ul>
    <p class="muted">Repo: <code>github.com/OWNER/superpowers-101</code></p>
  </Slide>

  <SlideNav />
</Base>
```

Note: `<h3>` inside slides needs no extra CSS — inherited body styles are fine.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: success.

Run: `grep -o 'class="slide"' dist/index.html | wc -l`
Expected: `5`

Run: `grep -c 'Jesse Vincent' dist/index.html`
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: slide content for all five slides

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Process pages (content collections)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/pages/process/index.astro`
- Create: `src/pages/process/[...slug].astro`

**Interfaces:**
- Consumes: `Base.astro` from Task 2; markdown files under `docs/superpowers/{prompts,specs,plans}/`.
- Produces: routes `/process/` and `/process/{prompts|specs|plans}/{id}/`. `titleFromId(id: string): string` is defined locally in each page that needs it (duplicated by design — two tiny files).

- [ ] **Step 1: Define the collections**

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/superpowers/prompts' }),
});

const specs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/superpowers/specs' }),
});

const plans = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs/superpowers/plans' }),
});

export const collections = { prompts, specs, plans };
```

- [ ] **Step 2: Write the process index page**

`src/pages/process/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL;

function titleFromId(id: string): string {
  return id.replace(/\.md$/, '').replace(/[-_]/g, ' ');
}

const sections = [
  {
    name: 'Prompts',
    slug: 'prompts',
    blurb: 'Every prompt the human typed, verbatim, with what came of it.',
    entries: await getCollection('prompts'),
  },
  {
    name: 'Specs',
    slug: 'specs',
    blurb: 'Design documents produced by the brainstorming skill.',
    entries: await getCollection('specs'),
  },
  {
    name: 'Plans',
    slug: 'plans',
    blurb: 'Implementation plans produced by the writing-plans skill.',
    entries: await getCollection('plans'),
  },
];
---
<Base title="The making-of · Superpowers 101">
  <main style="max-width: 60rem; margin: 0 auto; padding: 3rem 1.5rem;">
    <p><a href={base}>← back to the deck</a></p>
    <h1>The making-of</h1>
    <p class="muted">
      This site was built with the superpowers workflow:
      <strong>brainstorm → spec → plan → implement</strong>.
      These are the actual artifacts, committed as they were produced.
    </p>
    {sections.map((section) => (
      <section>
        <h2>{section.name}</h2>
        <p class="muted">{section.blurb}</p>
        <ul>
          {section.entries.map((entry) => (
            <li>
              <a href={`${base}process/${section.slug}/${entry.id}/`}>{titleFromId(entry.id)}</a>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </main>
</Base>
```

- [ ] **Step 3: Write the entry page**

`src/pages/process/[...slug].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const types = ['prompts', 'specs', 'plans'] as const;
  const paths = [];
  for (const type of types) {
    const entries = await getCollection(type);
    for (const entry of entries) {
      paths.push({ params: { slug: `${type}/${entry.id}` }, props: { entry } });
    }
  }
  return paths;
}

const base = import.meta.env.BASE_URL;
const { entry } = Astro.props;
const { Content } = await render(entry);

function titleFromId(id: string): string {
  return id.replace(/\.md$/, '').replace(/[-_]/g, ' ');
}
---
<Base title={`${titleFromId(entry.id)} · Superpowers 101`}>
  <main style="max-width: 48rem; margin: 0 auto; padding: 3rem 1.5rem;">
    <p><a href={`${base}process/`}>← all artifacts</a></p>
    <article>
      <Content />
    </article>
  </main>
</Base>
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: success, and the route list includes `/process/index.html`, `/process/prompts/01-kickoff/index.html`, `/process/specs/2026-07-17-superpowers-presentation-design/index.html`, and this plan under `/process/plans/`.

Run: `ls dist/process/prompts/01-kickoff/index.html`
Expected: file exists.

Run: `grep -c 'kickoff' dist/process/index.html`
Expected: at least `1`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/pages/process/
git commit -m "feat: render process docs as the making-of section

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Deploy workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: buildable site from Tasks 1–4.
- Produces: CI deploy on push to `main`; README pointing readers at the deck and `docs/superpowers/`.

- [ ] **Step 1: Write the workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Write the README**

`README.md`:

```markdown
# Superpowers 101

A 5–10 minute presentation about the [superpowers](https://github.com/obra/superpowers)
plugin for Claude Code — **built with superpowers itself**. The repo is the demo:
every prompt, spec, and plan used to produce the deck is committed here.

## See it

- **The deck:** https://OWNER.github.io/superpowers-101/
- **The making-of:** https://OWNER.github.io/superpowers-101/process/

## How this was built

1. A kickoff prompt started the `brainstorming` skill → design Q&A → [the spec](docs/superpowers/specs/).
2. The `writing-plans` skill turned the spec into [a task-by-task plan](docs/superpowers/plans/).
3. The plan was executed task by task, with verification before completion.
4. Every user prompt along the way is captured verbatim in [docs/superpowers/prompts/](docs/superpowers/prompts/).

## Run it locally

```sh
npm install
npm run dev
```

Built with [Astro](https://astro.build). Deployed to GitHub Pages by
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).
```

- [ ] **Step 3: Verify workflow syntax**

Run: `npx --yes yaml-lint .github/workflows/deploy.yml 2>/dev/null || node -e "const fs=require('fs');const y=fs.readFileSync('.github/workflows/deploy.yml','utf8');console.log(y.includes('withastro/action@v6')?'ok':'missing action')"`
Expected: valid YAML / `ok`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "chore: GitHub Pages deploy workflow and README

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: End-to-end verification, prompt capture, and push

**Files:**
- Create: `docs/superpowers/prompts/02-implementation.md` (verbatim user prompts from the implementation session + outcome note)
- Modify: `astro.config.mjs`, `src/pages/index.astro`, `README.md` (replace `OWNER` once the user confirms the GitHub owner)

**Interfaces:**
- Consumes: everything above.
- Produces: verified site, complete prompt log, repo pushed to GitHub with Pages enabled.

- [ ] **Step 1: Full build and browser verification**

Run: `npm run build && npm run preview` (preview serves at `http://localhost:4321/superpowers-101/`)

Then drive the site in a browser (Playwright tools):
- Deck loads; 5 slides; ArrowRight/ArrowLeft moves between slides; dots update and are clickable.
- "the making-of" link on slides 0 and 4 opens `/process/`, which lists ≥1 prompt, ≥1 spec, ≥1 plan.
- Each listed artifact opens and renders as formatted HTML (not raw markdown).
- No console errors.

Expected: all pass. Fix anything that fails before continuing (systematic-debugging skill if non-obvious).

- [ ] **Step 2: Write the session prompt log**

Create `docs/superpowers/prompts/02-implementation.md` following the format of `01-kickoff.md`: every user prompt from the implementation session verbatim (including the spec approval message), plus a short outcome note listing the commits produced.

- [ ] **Step 3: Ask the user for the GitHub owner, replace OWNER**

Ask which GitHub account/org hosts `superpowers-101`. Then replace `OWNER` in `astro.config.mjs`, `src/pages/index.astro`, and `README.md` with the real owner. Rebuild (`npm run build`) to confirm.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "docs: implementation session prompt log; set GitHub owner

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
gh repo create OWNER/superpowers-101 --public --source . --push
```

Then enable Pages: repo Settings → Pages → Source: GitHub Actions (or `gh api -X POST repos/OWNER/superpowers-101/pages -f build_type=workflow`). Confirm the Actions run goes green and the site is live at `https://OWNER.github.io/superpowers-101/`.

- [ ] **Step 5: Report**

Tell the user: live URL, what was verified, and the reminder that slide 3 still awaits their good/not-so-good points.

---

## Out of scope (YAGNI)

- Speaker notes, transitions, PDF export.
- Dark/light theme toggle (deck is dark; also a candidate live-demo feature for the talk).
- Syntax highlighting themes, search, RSS.
- Slide 3 content (arrives from the user during draft review).
