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
    assert.ok(graph.some(entity => entity['@type'] === 'Organization' && entity.name === 'NSEC Tech' && entity.email === 'suporte@nsectech.com.br'));
    assert.ok(fs.readFileSync('dist/sitemap.xml','utf8').includes('<loc>' + canonical + '</loc>'));
  });
}

test('the preview is free to try, with an integrated gallery and no download or checkout', () => {
  assert.doesNotThrow(() => new vm.Script(fs.readFileSync('dist/js/app.js','utf8')));
  assert.match(home, /href="#demo">Experimentar um desafio/);
  assert.match(home, /id="exercise-form"/);
  assert.match(home, /<details id="exercise-key"><summary>Conferir a solução/);
  assert.match(home, /<dialog[^>]+id="viewer"/);
  assert.equal([...home.matchAll(/<figure class="screen-card">/g)].length,6);
  assert.equal([...home.matchAll(/<article\b/g)].length,4);
  assert.match(home, /href="mailto:suporte@nsectech.com.br"/);
  assert.doesNotMatch(home, /target="_blank"|contact-modal|github.com\/normanff|onclick=|777/);
  const button = home.match(/<button class="download-button"[^>]*>[\s\S]*?<\/button>/)[0];
  assert.match(button,/disabled aria-describedby="download-note"/);
  assert.match(button,/<svg aria-hidden="true"/);
  assert.match(button,/Baixar UNIO Code/);
});

test('pages have distinct search and social titles and descriptions', () => {
  const titles = new Set(), descriptions = new Set();
  for (const page of pages) {
    const html = fs.readFileSync('dist/' + page, 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    titles.add(title);
    descriptions.add(description);
    assert.ok(html.includes('property="og:title" content="' + title + '"'));
    assert.ok(html.includes('property="og:description" content="' + description + '"'));
    const image = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
    assert.equal(image.origin, new URL(domain).origin);
    assert.ok(fs.statSync(path.join('dist',image.pathname)).size > 0);
    assert.match(html, /<footer[^>]*><a class="studio-wordmark" href="sobre.html">NSEC/);
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
  assert.match(fs.readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/www\.nsectech\.com\.br\/sitemap\.xml/);
});

test('gallery controls, exercise choices and launch request are available in the HTML', () => {
  const dialog = home.match(/<dialog\b[\s\S]+?<\/dialog>/)[0];
  for (const text of ['Fechar galeria','Anterior','Próxima']) assert.ok(dialog.includes('>' + text + '</button>'));
  assert.match(home, /<section id="contato"/);
  assert.match(home, /<form id="exercise-form">/);
  assert.equal([...home.matchAll(/type="radio"/g)].length,3);
  const mail = new URL(home.match(/href="(mailto:[^"]+)">Pedir aviso por e-mail/)[1].replaceAll('&amp;','&'));
  assert.equal(mail.pathname,'suporte@nsectech.com.br');
  assert.equal(mail.searchParams.get('subject'),'Aviso de lançamento do UNIO Code');
  assert.match(mail.searchParams.get('body'), /download público/);
});

test('the world trail has seven ordered and directly reachable chapters', () => {
  const slugs = ['genesis','nexus','prisma','vortice','orbita','aurora','ascensao'];
  const story = home.match(/<section id="mundos"[\s\S]*?<\/section>/)[0];
  assert.deepEqual([...story.matchAll(/<li id="mundo-([^"]+)"/g)].map(match => match[1]), slugs);
  for (const [i,slug] of slugs.entries()) {
    assert.ok(story.includes('href="#mundo-' + slug + '"'));
    assert.ok(story.includes('assets/world-atlas.svg#world-' + (i + 1)));
  }
});
