// @ts-check
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkCallouts } from './src/lib/remark-callouts.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://liquidzoo.io',
  markdown: {
    // remarkDirective parses `:::name[label] ... :::` syntax;
    // remarkCallouts turns those into <aside class="callout callout-{type}">.
    remarkPlugins: [remarkDirective, remarkCallouts],
  },
  // Redirects from the old date-prefixed blog slugs to the cleaner ones.
  // Astro emits a static HTML stub at each old path that meta-refreshes
  // to the new path — works on GitHub Pages, no server required.
  redirects: {
    '/blog/2024-01-19-creating-packages-with-composer': '/blog/creating-packages-with-composer/',
    '/blog/2024-01-31-my-patch-management-process': '/blog/patch-management-process/',
    '/blog/2024-10-17-automate-patch-reporting': '/blog/automate-patch-reporting/',
    '/blog/2025-05-15-the-edge-methodology': '/blog/edge-methodology/',
  },
});
