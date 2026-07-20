# Slide 3 Content: The Good and the Not So Good — Design Spec

**Date:** 2026-07-20
**Status:** Approved
**Prior spec:** [2026-07-18-light-theme-redesign-design.md](./2026-07-18-light-theme-redesign-design.md)

## Goal

Replace the placeholder text on the deck's "Good / Not So Good" slide with the presenter's real field notes, dictated this session.

## Decisions

- **Split into two slides.** The dictated content (6 headline+description points for "Good", 5 for "Not So Good") is too dense for the current single two-column slide at the projector-legible type sizes set in the light-theme redesign. `#good-and-bad` splits into `#the-good` (slide 3) and `#the-not-so-good` (slide 4); `#hands-on` shifts from slide 4 to slide 5.
- **No quotes or attributions.** All quoted fragments and source attributions (an HN review quote, an inline "huge token guzzler" quote) are reworded into plain descriptive sentences in the deck's existing voice — no quotation marks, no bylines.
- **Format:** each slide is `<h2>` (colored inline via `var(--good)` or `var(--bad)`, replacing the default `var(--accent)` heading color) followed by a single `<ul>` of `<strong>Headline</strong> — description` bullets, matching the bullet style already used on the hands-on slide.
- **No `SlideNav` changes.** It builds its dots dynamically from whatever `.slide` elements exist on the page.

## Copy

**Slide 3 — "3 · The Good"** (`id="the-good"`, `h2` color `var(--good)`):

1. **Kills the "jump straight to code" reflex** — forces a spec and a plan before any implementation begins.
2. **Two-stage subagent review** — every task is checked for spec compliance, then code quality, before moving on.
3. **Battle-tested & official** — 246k stars, MIT licensed, listed on Anthropic's own plugin marketplace.
4. **Real TDD enforcement** — RED-GREEN-REFACTOR is mandatory; code written before its test gets deleted.
5. **Works across 10 harnesses** — Claude Code, Codex, Cursor, Antigravity, Copilot CLI, Kimi, OpenCode, Pi, and more.
6. **Noticeably more correct output** — real-world reports describe clearly more correct results than stock Claude Code.

**Slide 4 — "4 · The Not So Good"** (`id="the-not-so-good"`, `h2` color `var(--bad)`):

1. **Token / budget burn** — some report it consuming a full Max-plan budget on straightforward tasks.
2. **Overkill for capable models** — critics compare it to an elaborate `.vimrc`; newer models plan reasonably well unprompted.
3. **Rigidity** — pre-specified files & plans can fight exploratory work, where the right approach is discovered mid-flight, not scripted upfront.
4. **Uneven skill writing quality** — some reference docs are just repeated examples, with wording duplicated across sections.
5. **Inherits Claude Code's plan-mode friction** — no middle ground between accepting a plan and discarding it to rewrite from scratch.

**Slide 5 — "Hands on"** (`id="hands-on"`, unchanged content): heading text changes from `4 · Hands on` to `5 · Hands on` only.

## Files

- Modify: `src/pages/index.astro` — replace the `good-and-bad` slide with the two new slides above; renumber the hands-on heading.

## Verification

1. Local build, then Playwright against the preview: navigate to `#the-good` and `#the-not-so-good`, screenshot both, confirm nothing is clipped at typical viewport heights and the heading colors render as terracotta-free green/red (`var(--good)` / `var(--bad)`).
2. Confirm `SlideNav` now renders 6 dots and arrow-key navigation still steps through all six slides in order.
3. Deploy via the existing workflow; re-run live smoke checks.

## Out of scope

- Any further content edits beyond this dictated list (future revisions are a new prompt/spec).
- Dark mode / theme toggle (still reserved as live-demo material).
- Layout, type-size, or token changes beyond the two new slide headings' color.
