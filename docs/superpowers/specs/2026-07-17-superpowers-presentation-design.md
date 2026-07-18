# Superpowers 101 — Presentation Design

**Date:** 2026-07-17
**Status:** Approved pending user review

## Purpose

A brief (5–10 minute) presentation about the [superpowers plugin](https://github.com/obra/superpowers) for Claude Code — built *using* superpowers, so the repository itself is a living example of the workflow it presents. Deployed as a GitHub Pages site people can revisit and dig into after the talk.

## Audience

Developers already using Claude Code (basics can be assumed), with possible PMs/POs in the room — keep jargon explained in one clause, not a slide.

## Requirements

- 5–10 minute deck, ~4 content slides.
- Built with Astro, deployed to GitHub Pages via GitHub Actions.
- The repo **must** contain all user prompts (including the kickoff prompt), specs, plans, and other process docs produced along the way.
- The site surfaces those artifacts (summaries or most relevant ones) so the audience can browse the making-of.
- Hands-on segment: live demo, with a repo-history walkthrough as backup.

## Architecture

Static Astro site, no UI framework. One page for the deck, content collections for process docs.

```
superpowers-101/
├── src/
│   ├── pages/
│   │   ├── index.astro          # the deck: full-viewport <section> per slide
│   │   └── process/             # rendered process docs (prompts/specs/plans)
│   ├── components/              # Slide.astro, SlideNav.astro, etc.
│   └── content/                 # content collections config
├── docs/superpowers/
│   ├── prompts/NN-<topic>.md    # verbatim user prompts + outcome notes
│   ├── specs/                   # design docs (incl. this one)
│   └── plans/                   # implementation plans
├── .github/workflows/deploy.yml
└── README.md
```

- **Deck:** each slide is a full-viewport `<section>`; navigation by arrow keys and click, with a small progress indicator. Slide content lives directly in Astro components — four slides doesn't justify a data layer.
- **Process pages:** `/process` renders the markdown in `docs/superpowers/` via an Astro content collection, with an index page explaining the workflow stages (brainstorm → spec → plan → implement). The site serves its own making-of.

## Slide content

| # | Slide | Content |
|---|-------|---------|
| 0 | Title | "Superpowers 101" + hook: *this deck was built by the thing it presents.* Repo link/QR. |
| 1 | What is it | Plugin by Jesse Vincent (obra): ~20 process skills + an enforcement layer making Claude follow a disciplined workflow. Learn more: repo, Jesse's blog posts, install one-liner. |
| 2 | What's inside | Core workflow (brainstorm → spec → plan → TDD implement → review → finish branch); skill catalog grouped by theme; philosophy: skills as mandatory process ("if a skill applies, you must use it"). |
| 3 | Good / Not so good | Two-column layout. **Placeholder at build time** — points come from the user's own experience, dictated during draft review. |
| 4 | Hands-on | Live demo prompt: add a small feature to this repo via the full superpowers loop. Backup: guided tour of `/process` tracing prompts → spec → plan → commits. |

Slides 1–2 are drafted from the superpowers repo and Jesse Vincent's published writing.

## Process-artifact capture

- Each working session appends a numbered file to `docs/superpowers/prompts/` containing the user's prompts **verbatim** plus a short outcome note.
- Specs and plans are byproducts of the superpowers workflow and are committed where they're written.
- Curated capture only — no raw session transcripts (decided: readable and small beats maximally faithful).

## Deployment

- GitHub repo: `<owner>/superpowers-101` (owner confirmed at first push). Site at `https://<owner>.github.io/superpowers-101/`.
- GitHub Actions with `withastro/action`, deploying to Pages on push to `main`.
- `astro.config.mjs` sets `site` and `base` for the project-pages path.

## Verification

- `astro build` passes in CI.
- Before completion: drive the built site locally — keyboard nav across all slides, process pages render, no broken links.
- No JS unit tests: the only script is slide navigation, verified by driving the browser.

## Decisions log

| Decision | Choice |
|----------|--------|
| Slide mechanism | Custom full-screen Astro sections (no reveal.js, no docs-only site) |
| Hands-on | Live demo + repo-history walkthrough as backup |
| Slide 3 sourcing | User's experience, structured by Claude; placeholder until draft review |
| Artifact capture | Curated markdown, verbatim prompts, no raw transcripts |
| Repo | New repo `<owner>/superpowers-101`, matching local folder |
