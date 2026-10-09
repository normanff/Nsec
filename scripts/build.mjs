import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';

await mkdir('dist/css', { recursive: true });
await mkdir('dist/js', { recursive: true });
await mkdir('dist/assets', { recursive: true });
execFileSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'css/tailwind.css', '-o', 'dist/css/utilities.css', '--minify'], { stdio: 'inherit' });
await copyFile('index.html', 'dist/index.html');
for (const file of await readdir('assets')) await copyFile(`assets/${file}`, `dist/assets/${file}`);
for (const name of ['styles', 'refinements', 'art-direction']) {
  await build({ entryPoints: [`css/${name}.css`], outfile: `dist/css/${name}.css`, minify: true });
}
const files = (await readdir('js')).filter(file => file.endsWith('.js') && file !== 'icons.js');
for (const file of files) {
  await build({ entryPoints: [`js/${file}`], outfile: `dist/js/${file}`, minify: true, target: 'es2020' });
}
await build({ entryPoints: ['js/icons.js'], outfile: 'dist/js/icons.js', bundle: true, minify: true, target: 'es2020' });
console.log('Site compilado em dist/');
