# Good and Not So Good — Slide Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder "Good / Not So Good" slide with the presenter's real field notes, split across two full slides, and renumber the trailing hands-on slide.

**Architecture:** Pure content/markup change in one file: the single `#good-and-bad` `<Slide>` is replaced by two sibling `<Slide>` elements (`#the-good`, `#the-not-so-good`), each a heading plus one `<ul>` of bullets in the same `<strong>headline</strong> — description` style already used on the hands-on slide. The following `#hands-on` slide's heading number bumps from 4 to 5. `SlideNav` requires no change — it builds its dots by querying `.slide` elements at runtime.

**Tech Stack:** Astro 7.1.1, existing `global.css` tokens (`--good`, `--bad`), Playwright MCP for browser verification.

## Global Constraints

- Exact copy for both new slides is specified below — verbatim, no paraphrasing beyond what's already written into the plan.
- No quotation marks or source attributions anywhere in the new copy.
- `id="the-good"` and `id="the-not-so-good"` are the exact slide ids (no others).
- Heading color: `#the-good` heading uses inline `style={\`color: var(--good)\`}`; `#the-not-so-good` heading uses inline `style={\`color: var(--bad)\`}` — overriding the default `.slide h2 { color: var(--accent); }` from `global.css`, which stays untouched.
- No changes to `src/styles/global.css`, `src/layouts/Base.astro`, `astro.config.mjs`, or `src/components/SlideNav.astro`.
- Work happens on branch `good-and-bad-content` off `main`.

---

### Task 1: Split the slide and renumber hands-on

**Files:**
- Modify: `src/pages/index.astro:61-87`

**Interfaces:**
- Consumes: existing `<Slide>` component (from `../components/Slide.astro`, already imported at the top of the file) and existing CSS classes (`.muted` not used here — no dependency); nothing from other tasks.
- Produces: two new slide ids (`the-good`, `the-not-so-good`) that Task 2's browser verification navigates to directly via anchor.

- [ ] **Step 1: Replace lines 61-87 of `src/pages/index.astro` with:**

```astro
  <Slide id="the-good">
    <h2 style={`color: var(--good)`}>3 · The Good</h2>
    <ul>
      <li><strong>Kills the "jump straight to code" reflex</strong> — forces a spec and a plan before any implementation begins.</li>
      <li><strong>Two-stage subagent review</strong> — every task is checked for spec compliance, then code quality, before moving on.</li>
      <li><strong>Battle-tested &amp; official</strong> — 246k stars, MIT licensed, listed on Anthropic's own plugin marketplace.</li>
      <li><strong>Real TDD enforcement</strong> — RED-GREEN-REFACTOR is mandatory; code written before its test gets deleted.</li>
      <li><strong>Works across 10 harnesses</strong> — Claude Code, Codex, Cursor, Antigravity, Copilot CLI, Kimi, OpenCode, Pi, and more.</li>
      <li><strong>Noticeably more correct output</strong> — real-world reports describe clearly more correct results than stock Claude Code.</li>
    </ul>
  </Slide>

  <Slide id="the-not-so-good">
    <h2 style={`color: var(--bad)`}>4 · The Not So Good</h2>
    <ul>
      <li><strong>Token / budget burn</strong> — some report it consuming a full Max-plan budget on straightforward tasks.</li>
      <li><strong>Overkill for capable models</strong> — critics compare it to an elaborate <code class="kbd">.vimrc</code>; newer models plan reasonably well unprompted.</li>
      <li><strong>Rigidity</strong> — pre-specified files &amp; plans can fight exploratory work, where the right approach is discovered mid-flight, not scripted upfront.</li>
      <li><strong>Uneven skill writing quality</strong> — some reference docs are just repeated examples, with wording duplicated across sections.</li>
      <li><strong>Inherits Claude Code's plan-mode friction</strong> — no middle ground between accepting a plan and discarding it to rewrite from scratch.</li>
    </ul>
  </Slide>

  <Slide id="hands-on">
    <h2>5 · Hands on</h2>
    <ul>
      <li><strong>Live:</strong> let's add a small feature to <em>this deck</em> — full loop: brainstorm → spec → plan → implement.</li>
      <li><strong>Already happened:</strong> everything you're looking at was built that way.</li>
      <li>Browse <a href={`${base}process/`}>the making-of</a> — every prompt, spec, and plan behind this deck, verbatim.</li>
    </ul>
    <p class="muted">Repo: <a href="https://github.com/rubens-lopes/superpowers-101">github.com/rubens-lopes/superpowers-101</a></p>
  </Slide>
```

Only the heading text and content inside `<Slide id="hands-on">` differ from the current file (heading `4 ·` → `5 ·`); everything else in that block is unchanged from today's file.

- [ ] **Step 2: Build and verify output**

Run: `npm run build`
Expected: exits 0, no errors.

Run: `grep -o '<h2[^>]*>3 · The Good' dist/index.html`
Expected: prints the matched fragment (one line).

Run: `grep -o '<h2[^>]*>5 · Hands on' dist/index.html`
Expected: prints the matched fragment (one line).

Run: `grep -c 'class="slide"' dist/index.html`
Expected: `6` (title, what-is-it, whats-inside, the-good, the-not-so-good, hands-on).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: split good/not-so-good slide, add field notes"
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

- [ ] **Step 2: Navigate and check both new slides**

Navigate to `http://localhost:4321/superpowers-101/#the-good`. Evaluate:

```js
({
  heading: document.querySelector('#the-good h2').textContent,       // expect "3 · The Good"
  headingColor: getComputedStyle(document.querySelector('#the-good h2')).color, // expect the --good color, not the --accent terracotta
  bulletCount: document.querySelectorAll('#the-good li').length,     // expect 6
})
```

Navigate to `http://localhost:4321/superpowers-101/#the-not-so-good`. Evaluate:

```js
({
  heading: document.querySelector('#the-not-so-good h2').textContent, // expect "4 · The Not So Good"
  headingColor: getComputedStyle(document.querySelector('#the-not-so-good h2')).color, // expect the --bad color
  bulletCount: document.querySelectorAll('#the-not-so-good li').length, // expect 5
})
```

- [ ] **Step 3: Confirm SlideNav and hands-on renumber**

Evaluate: `document.querySelectorAll('.slide-nav button').length` — expect `6`.
Navigate to `http://localhost:4321/superpowers-101/#hands-on`. Evaluate: `document.querySelector('#hands-on h2').textContent` — expect `"5 · Hands on"`.

- [ ] **Step 4: Console check**

Read console messages. Expected: no errors.

- [ ] **Step 5: Screenshots**

Screenshot `#the-good` and `#the-not-so-good`. Eyeball: all bullets fully visible with no clipping at the bottom of the viewport, green heading on slide 3, red/crimson heading on slide 4.

- [ ] **Step 6: Record**

No commit (screenshots are git-ignored). Note results in the progress ledger; stop the preview server.

---

### Task 3: Post-merge deploy verification (controller-run)

Runs after `good-and-bad-content` merges to `main` and is pushed (via superpowers:finishing-a-development-branch).

- [ ] **Step 1: Wait for the Pages workflow**

Run: `gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')`
Expected: exits 0 (success).

- [ ] **Step 2: Smoke check**

```bash
curl -s -o /dev/null -w '%{http_code}\n' "https://rubens-lopes.github.io/superpowers-101/"
```
Expected: `200`

Run: `curl -s https://rubens-lopes.github.io/superpowers-101/ | grep -c '5 · Hands on'`
Expected: `1` or more.
