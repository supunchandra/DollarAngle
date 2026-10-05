import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['personal-finance', 'investing', 'markets', 'economy', 'crypto', 'real-estate']),
    franchise: z.enum(['Daily', 'Guides', 'Explained', 'Signals']),
    author: z.string().default('DollarAngle Editorial'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    keyTakeaway: z.string().optional()
  })
});

export const collections = { articles };
