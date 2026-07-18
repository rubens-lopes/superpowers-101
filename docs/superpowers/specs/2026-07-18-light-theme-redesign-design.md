# Light Theme Redesign — "Warm Editorial" — Design Spec

**Date:** 2026-07-18
**Status:** Approved
**Prior spec:** [2026-07-17-superpowers-presentation-design.md](./2026-07-17-superpowers-presentation-design.md)

## Goal

Restyle the deck (and the shared process pages) from the current dark theme to a light, projector-friendly theme with distinctive typography. Light backgrounds read better on washed-out projectors; the dark theme goes away entirely — reintroducing it as a toggle is reserved as the live hands-on demo during the talk.

## Decisions

- **Light only, no toggle.** The dark/light toggle remains the candidate feature for the live demo (slide 4). Nothing on slide 4 names the feature, so no copy changes.
- **Fonts via Google Fonts CDN.** User's explicit choice over self-hosting. Fallback stacks (`Georgia, serif` / `system-ui`) keep the deck presentable if offline.
- **Direction picked via claude.ai/design.** Three candidate directions (Crisp Tech, Warm Editorial, Plex Developer) were pushed as preview cards to the design project "superpowers-101 deck theme"; the user picked **B — Warm Editorial**.

## Theme tokens

`src/styles/global.css` `:root` becomes:

| Token | Value | Role |
|---|---|---|
| `--bg` | `#faf6f0` | warm paper background |
| `--bg-accent` | `#f0e9df` | panels / kbd chips |
| `--fg` | `#1c1917` | body text |
| `--muted` | `#6b6259` | secondary text |
| `--accent` | `#9a3412` | headings accent (terracotta, replaces amber) |
| `--accent-2` | `#1d4ed8` | links |
| `--good` | `#3f6212` | slide 3 "Good" column |
| `--bad` | `#be123c` | slide 3 "Not So Good" column |

The `.kbd` border becomes `#ddd2c4`. `--max-width` is unchanged. Slide-nav dots and the slide-3 column headings already read from these vars — no markup changes.

All fg-on-bg pairs above meet WCAG AA at their rendered sizes on `#faf6f0`.

## Typography

- **Headings (`h1/h2/h3`):** Fraunces 600/700, fallback `Georgia, serif`.
- **Body:** Inter 400/600, fallback `system-ui` stack.
- **Loading:** one `<link rel="stylesheet">` to `fonts.googleapis.com` in `Base.astro` `<head>`, preceded by `preconnect` links to `fonts.googleapis.com` and `fonts.gstatic.com`, with `display=swap`.
- **Size bump (projector legibility):**
  - `h1`: `clamp(2.75rem, 7vw, 5.5rem)`
  - `h2`: `clamp(2rem, 4vw, 3.2rem)`
  - `.slide ul`: `clamp(1.2rem, 2.2vw, 1.6rem)`
  - Title-slide subtitle (inline style in `index.astro`): `clamp(1.25rem, 2.5vw, 1.8rem)`

## Files

- Modify: `src/styles/global.css` — tokens, font families, sizes, kbd border.
- Modify: `src/layouts/Base.astro` — font `<link>`s in head.
- Modify: `src/pages/index.astro` — title-slide subtitle inline size only.
- Create: `docs/superpowers/prompts/03-theme-redesign.md` — this session's verbatim prompts + outcome (standing artifact-capture rule).

## Verification

1. Local build, then Playwright against the preview: `document.fonts.check` confirms Fraunces and Inter loaded; zero console errors; screenshot each of the 5 slides and one process page.
2. Deploy via the existing workflow; re-run live smoke checks (deck, process index, spec, plan, prompt pages all 200).

## Out of scope

- Dark mode / theme toggle (live demo material).
- Slide 3 content (still awaiting the presenter's notes).
- Any layout or copy changes beyond the subtitle size.
