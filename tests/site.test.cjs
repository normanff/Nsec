const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pages = ['index.html', 'sobre.html', 'manual-instalacao.html', 'privacidade.html', 'termos.html'];
const home = fs.readFileSync('dist/index.html', 'utf8');
const domain = 'https://www.nsectech.com.br/';

for (const page of pages) {
  test(page + ' has a unique identity and resolvable internal links', () => {
    const html = fs.readFileSync('dist/' + page, 'utf8');
    const canonical = domain + (page === 'index.html' ? '' : page);
    assert.ok(html.includes('rel="canonical" href="' + canonical + '"'));
    assert.ok(html.includes('property="og:url" content="' + canonical + '"'));
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, id] of html.matchAll(/(?:aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/g)) assert.ok(ids.includes(id), id);
    for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const url = new URL(ref, canonical);
      if (url.origin !== new URL(domain).origin) continue;
      const target = path.join('dist', url.pathname === '/' ? 'index.html' : url.pathname);
      assert.ok(fs.existsSync(target), ref);
      if (url.hash) assert.ok(fs.readFileSync(target,'utf8').includes('id="' + url.hash.slice(1) + '"'), ref);
    }
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.ok(graph.some(entity => entity['@type'] === 'Organization' && entity.name === 'NSEC Tech' && entity.email === 'suporte.nsectech@gmail.com'));
    assert.ok(fs.readFileSync('dist/sitemap.xml','utf8').includes('<loc>' + canonical + '</loc>'));
  });
}

test('the preview is free to try, with an integrated gallery and no download or checkout', () => {
  assert.doesNotThrow(() => new vm.Script(fs.readFileSync('dist/js/app.js','utf8')));
  assert.match(home, /href="#demo">Experimentar um desafio/);
  assert.match(home, /id="exercise-form"/);
  assert.match(home, /<noscript>/);
  assert.match(home, /<dialog[^>]+id="viewer"/);
  assert.equal([...home.matchAll(/<figure class="screen-card">/g)].length,3);
  assert.equal([...home.matchAll(/<article\b/g)].length,4);
  assert.match(home, /href="mailto:suporte.nsectech@gmail.com"/);
  assert.doesNotMatch(home, /target="_blank"|contact-modal|github.com\/normanff|onclick=|777/);
  const button = home.match(/<button class="download-button"[^>]*>[\s\S]*?<\/button>/)[0];
  assert.match(button,/disabled aria-describedby="download-note"/);
  assert.match(button,/<svg aria-hidden="true"/);
  assert.match(button,/Baixar UNIO Code/);
});
