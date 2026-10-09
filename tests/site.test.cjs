const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('all runtime scripts parse; article code does not break the dataset', () => {
  for (const file of fs.readdirSync('js').filter(name => name.endsWith('.js') && name !== 'icons.js')) {
    assert.doesNotThrow(() => new vm.Script(fs.readFileSync('js/' + file, 'utf8')), file);
  }
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync('js/data.js', 'utf8'), context);
  const data = context.window.NSEC_DATA;
  assert.equal(data.services.length, 8);
  assert.equal(data.articles.length, 4);
  assert.equal(data.saasMock.vulnerabilities.length, 7);
  assert.match(data.articles[2].fullContent, /<code>ntdll.dll<\/code>/);
  assert.match(data.articles[3].fullContent, /<code>iam:PassRole<\/code>/);
});

test('built page has valid local assets and no runtime CDN dependency', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  for (const match of html.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"#]+)"/g)) {
    assert.ok(fs.existsSync(path.join('dist', match[1])), match[1]);
  }
  assert.doesNotMatch(html, /cdn.tailwindcss.com|unpkg.com|href="#"|onclick=/);
  assert.doesNotMatch(html, /Solicitação Recebida com Sucesso/);
  const structured = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => JSON.parse(structured));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});
