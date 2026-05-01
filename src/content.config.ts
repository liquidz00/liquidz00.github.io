import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // How the first image in the post should fill the hero frame.
    //   "cover"   → fixed 320px height, image cropped to fill (default)
    //   "contain" → natural aspect ratio, no fixed height
    heroFit: z.enum(['cover', 'contain']).optional(),
  }),
});

export const collections = { blog };