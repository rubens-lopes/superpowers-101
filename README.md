# Superpowers 101

A 5–10 minute presentation about the [superpowers](https://github.com/obra/superpowers)
plugin for Claude Code — **built with superpowers itself**. The repo is the demo:
every prompt, spec, and plan used to produce the deck is committed here.

## See it

- **The deck:** https://rubens-lopes.github.io/superpowers-101/
- **The making-of:** https://rubens-lopes.github.io/superpowers-101/process/

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
