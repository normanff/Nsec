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
await copyFile(path.join(root, 'index.html'), path.join(output, 'index.html'));
await copyFile(path.join(root, 'assets/favicon.svg'), path.join(output, 'assets/favicon.svg'));
await build({ entryPoints: [path.join(root, 'css/site.css')], outfile: path.join(output, 'css/site.css'), minify: true });
for (const name of ['dialogs', 'modal', 'app']) {
  await build({ entryPoints: [path.join(root, `js/${name}.js`)], outfile: path.join(output, `js/${name}.js`), minify: true, target: 'es2020' });
}
console.log('Site compilado em dist/');
