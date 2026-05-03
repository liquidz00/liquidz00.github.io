// Renders public/favicon.svg into the legacy formats browsers still expect:
//   - public/favicon.ico        (multi-size: 16, 32, 48 — for old browsers / bookmarks)
//   - public/apple-touch-icon.png  (180x180 — for iOS home screen / Safari pinned tabs)
//
// Run with:  node scripts/generate-icons.mjs
// Re-run any time public/favicon.svg changes.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = join(root, 'public', 'favicon.svg');
const icoPath = join(root, 'public', 'favicon.ico');
const appleTouchPath = join(root, 'public', 'apple-touch-icon.png');

const svg = await readFile(svgPath);

const renderPng = (size) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

// Multi-size ICO: 16, 32, 48 covers every browser still using ICO.
const icoSizes = [16, 32, 48];
const icoPngs = icoSizes.map((s) => renderPng(s));
const ico = await pngToIco(icoPngs);
await writeFile(icoPath, ico);
console.log(`✓ favicon.ico  (${icoSizes.join(', ')})`);

// Apple touch icon: 180x180 is the canonical size.
await writeFile(appleTouchPath, renderPng(180));
console.log(`✓ apple-touch-icon.png  (180x180)`);
