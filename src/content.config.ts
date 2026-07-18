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
