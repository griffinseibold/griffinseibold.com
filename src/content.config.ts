import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    repo: z.url().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { projects };
