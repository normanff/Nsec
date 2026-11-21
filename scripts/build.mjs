import { mkdir, copyFile, rm } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

import path from 'node:path';

import { build } from 'esbuild';



const root = fileURLToPath(new URL('../', import.meta.url));

const output = path.resolve(root, 'dist');

if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== 'dist') throw new Error('Invalid build output path');

// Only the generated dist directory under this project is replaced.

await rm(output, { recursive: true, force: true });

for (const folder of ['css', 'js', 'assets']) await mkdir(path.join(output, folder), { recursive: true });

for (const file of ['index.html', 'manual-instalacao.html', 'sobre.html', 'privacidade.html', 'termos.html', 'robots.txt', 'sitemap.xml']) {
  await copyFile(path.join(root, file), path.join(output, file));
}

for (const asset of ['favicon.svg', 'preview-unio.jpg', 'bancada-unio.webp', 'academy.webp', 'map.webp', 'battle.webp', 'InterVariable.woff2', 'Inter-LICENSE.txt']) await copyFile(path.join(root, 'assets', asset), path.join(output, 'assets', asset));

await build({ entryPoints: [path.join(root, 'css/site.css')], outfile: path.join(output, 'css/site.css'), minify: true });

await build({ entryPoints: [path.join(root, 'js/app.js')], outfile: path.join(output, 'js/app.js'), minify: true, target: 'es2020' });

console.log('Site compilado em dist/');

