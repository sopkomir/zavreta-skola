import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const namety = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/namety' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Zavretá škola'),
    categories: z.array(z.string()).default([]),
    types: z.array(z.string()).default([]),
    image: z.string().optional(),
    youtubeId: z.string().optional(),
    wordwallEmbed: z.string().optional(),
    views: z.number().optional(),
  }),
});

const clanky = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clanky' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Zavretá škola'),
    rubrika: z.array(z.string()).default([]),
    image: z.string().optional(),
    youtubeId: z.string().optional(),
  }),
});

export const collections = { namety, clanky };
