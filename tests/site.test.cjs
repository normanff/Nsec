const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('runtime scripts parse and compiled files exist', () => {
  for (const name of ['dialogs', 'modal', 'app']) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync(`js/${name}.js`, 'utf8')));
  }
  const html = fs.readFileSync('dist/index.html', 'utf8');
  for (const match of html.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"#]+)"/g)) {
    assert.ok(fs.existsSync(path.join('dist', match[1])), match[1]);
  }
  assert.doesNotMatch(html, /cdn.tailwindcss.com|unpkg.com|href="#"|onclick=/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  for (const match of html.matchAll(/(?:for|aria-labelledby|aria-controls)="([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(structured.email, 'normanff57@gmail.com');
  assert.equal(structured.url, 'https://www.nsectech.com.br/');
});

test('core services are available in HTML without JavaScript or fabricated metrics', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  assert.equal([...html.matchAll(/<details class="service"/g)].length, 8);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /href="mailto:normanff57@gmail.com"/);
  assert.doesNotMatch(html, /\+100|\+500|OPERATIONAL 24\/7|simulator|saasMock|nsec-labs|hero-jellyfish|Solicitação Recebida com Sucesso/);
  assert.deepEqual(fs.readdirSync('dist/js').sort(), ['app.js', 'dialogs.js', 'modal.js']);
  assert.deepEqual(fs.readdirSync('dist/assets'), ['favicon.svg']);
});
