(() => {

  document.documentElement.classList.add('js-enabled');

  const header = document.querySelector('.site-header');

  const nav = document.querySelector('.desktop-nav');

  const marker = nav?.querySelector('.nav-marker');

  const button = document.getElementById('mobile-menu-btn');

  const menu = document.getElementById('mobile-nav-menu');

  if (!marker || !button || !menu) return;

  const links = [...nav.querySelectorAll('a')];

  const mobileLinks = [...menu.querySelectorAll('a')];

  const sections = [...document.querySelectorAll('main section[id]')];

  let active = null, hovered = null, frame = 0;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let markerAnimation = null;

  let destination = '';

  function paint() {

    const link = links.find(a => a === document.activeElement) || hovered || active;

    nav.classList.toggle('has-marker', Boolean(link && nav.offsetWidth));

    if (link) {

      const x = link.offsetLeft, width = link.offsetWidth;

      const next = `${x}:${width}`;

      if (next === destination) return;

      const previous = getComputedStyle(marker);

      const startX = previous.transform === 'none' ? x : new DOMMatrixReadOnly(previous.transform).m41;

      const startWidth = parseFloat(previous.width) || width;

      const wasVisible = Boolean(destination);

      markerAnimation?.cancel();

      marker.style.width = `${width}px`;

      marker.style.transform = `translateX(${x}px)`;

      destination = next;

      if (!reducedMotion.matches && wasVisible && nav.offsetWidth && marker.animate) {

        const distance = x - startX;

        const stretch = Math.min(24, Math.abs(distance) * .12);

        markerAnimation = marker.animate([

          {transform:`translateX(${startX}px)`,width:`${startWidth}px`,offset:0},

          {transform:`translateX(${x - (distance < 0 ? stretch : 0)}px)`,width:`${width + stretch}px`,offset:.65},

          {transform:`translateX(${x}px)`,width:`${width}px`,offset:1}

        ], {duration:480,easing:'cubic-bezier(.22,1,.36,1)'});

      }

    }

  }

  reducedMotion.addEventListener('change', () => { markerAnimation?.cancel(); });

  function update() {

    frame = 0;

    let current = sections[0];

    const threshold = header.getBoundingClientRect().height + 100;

    for (const section of sections) if (section.getBoundingClientRect().top <= threshold) current = section;

    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);

    active = links.find(a => a.hash === `#${current?.id}`) || null;

    [...links, ...mobileLinks].forEach(a => {

      if (a.hash === `#${current?.id}`) a.setAttribute('aria-current', 'location');

      else a.removeAttribute('aria-current');

    });

    paint();

  }

  function schedule() { if (!frame) frame = requestAnimationFrame(update); }

  links.forEach(a => {

    a.addEventListener('pointerenter', () => { hovered = a; paint(); });

    a.addEventListener('focus', paint);

  });

  nav.addEventListener('pointerleave', () => { hovered = null; paint(); });

  nav.addEventListener('focusout', () => requestAnimationFrame(paint));

  function setMenu(open, restore = false) {

    menu.classList.toggle('hidden', !open);

    header.classList.toggle('menu-open', open);

    button.setAttribute('aria-expanded', String(open));

    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

    button.querySelector('.menu-label').textContent = open ? 'Fechar' : 'Menu';

    if (restore) button.focus();

  }

  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));

  mobileLinks.forEach(link => link.addEventListener('click', () => {
    setMenu(false);
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.tabIndex = -1;
      target.focus({preventScroll:true});
    }
  }));

  document.addEventListener('keydown', e => {

    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') setMenu(false, true);

  });

  for (const type of ['click', 'focusin']) document.addEventListener(type, e => {

    if (!header.contains(e.target) && button.getAttribute('aria-expanded') === 'true') setMenu(false);

  });

  matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) setMenu(false); schedule(); });

  addEventListener('scroll', schedule, {passive:true});

  addEventListener('resize', schedule);

  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(nav);

  document.fonts?.ready.then(schedule);

  schedule();

})();



(() => {
  const track = document.getElementById('capturas');
  if (!track) return;
  const gallery = track.closest('.screen-gallery');
  const picker = gallery.querySelector('.gallery-picker');
  const cards = Array.from(track.querySelectorAll('figure'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length) return;

  function centerOf(card) {
    const rect = card.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  function goTo(index) {
    const left = track.scrollLeft + centerOf(cards[index]) - centerOf(track);
    track.scrollTo({left, behavior: motion.matches ? 'auto' : 'smooth'});
  }

  const buttons = cards.map((card, index) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.textContent = card.querySelector('figcaption strong').textContent;
    control.setAttribute('aria-controls', track.id);
    control.addEventListener('click', () => goTo(index));
    picker.append(control);
    return control;
  });
  picker.hidden = false;

  let selected = -1;
  let frame = 0;
  function syncSelection() {
    frame = 0;
    const middle = centerOf(track);
    const distances = cards.map(card => Math.abs(centerOf(card) - middle));
    const next = distances.indexOf(Math.min(...distances));
    if (selected === next) return;
    selected = next;
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === next)));
    cards.forEach((card, index) => card.classList.toggle('is-current', index === next));
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(syncSelection);
  }
  track.addEventListener('scroll', schedule, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
  else window.addEventListener('resize', schedule);
  track.addEventListener('keydown', event => {
    if (event.target !== track || event.altKey || event.metaKey || event.ctrlKey) return;
    const targets = {ArrowLeft:selected-1, ArrowRight:selected+1, Home:0, End:cards.length-1};
    if (!(event.key in targets)) return;
    event.preventDefault();
    goTo(Math.max(0, Math.min(cards.length-1, targets[event.key])));
  });
  syncSelection();


})();

(() => {
  const viewer = document.querySelector('#viewer');
  const links = [...document.querySelectorAll('.screen-card a')];
  if (!links.length || !viewer || typeof viewer.showModal !== 'function') return;
  const photo = viewer.querySelector('img');
  const title = viewer.querySelector('#viewer-title');
  const canvas = viewer.querySelector('.viewer-canvas');
  const zoom = viewer.querySelector('[data-zoom]');
  function setZoom(enabled) {
    canvas.classList.toggle('full-size', enabled);
    zoom.setAttribute('aria-pressed', String(enabled));
    canvas.scrollTo(0, 0);
  }
  zoom.addEventListener('click', () => {
    const enabled = zoom.getAttribute('aria-pressed') !== 'true';
    setZoom(enabled);
    if (enabled) canvas.focus({preventScroll: true});
  });
  let index = 0;
  let trigger;
  function display(next) {
    index = (next + links.length) % links.length;
    const link = links[index];
    setZoom(false);
    photo.src = link.href;
    photo.alt = link.querySelector('img').alt;
    title.textContent = link.closest('figure').querySelector('strong').textContent + ' · ' + (index + 1) + ' de ' + links.length;
  }
  links.forEach((link, position) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      trigger = link;
      display(position);
      viewer.showModal();
    });
  });
  viewer.querySelector('[data-close]').addEventListener('click', () => viewer.close());
  viewer.querySelector('[data-prev]').addEventListener('click', () => display(index - 1));
  viewer.querySelector('[data-next]').addEventListener('click', () => display(index + 1));
  viewer.addEventListener('keydown', event => {
    if (event.target === canvas && canvas.classList.contains('full-size')) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    display(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const box = viewer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => trigger?.focus({preventScroll:true}));
})();

(() => {
  const form = document.querySelector('#exercise-form');
  if (!form) return;
  const result = document.querySelector('#exercise-result');
  const feedback = {
    name: ['Nova', 'Falta juntar o texto “Piloto: ” ao nome. Tente outra linha.'],
    join: ['Piloto: Nova', 'Acertou! O sinal + junta o prefixo ao nome e preserva o espaço.'],
    space: ['Piloto:Nova', 'Quase. Compare o espaço entre os dois-pontos e o nome.']
  };
  const nextStep = document.querySelector('#exercise-next');
  form.addEventListener('change', () => {
    result.textContent = '';
    nextStep.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const choice = new FormData(form).get('line');
    const [output, message] = feedback[choice];
    const label = document.createElement('strong');
    label.textContent = 'Saída da linha escolhida';
    const sample = document.createElement('samp');
    sample.textContent = output;
    const explanation = document.createElement('p');
    explanation.textContent = message;
    result.dataset.correct = String(choice === 'join');
    result.replaceChildren(label, sample, explanation);
    nextStep.hidden = choice !== 'join';
  });
  document.querySelector('#exercise-key').hidden = true;
  nextStep.hidden = true;
  form.querySelector('[type="submit"]').hidden = false;
})();

(() => {
  const status = document.getElementById('copy-status');
  if (!status) return;
  for (const button of document.querySelectorAll('[data-copy]')) {
    const field = document.getElementById(button.dataset.copy);
    button.addEventListener('click', async () => {
      const label = field.labels[0].textContent;
      try {
        await navigator.clipboard.writeText(field.value);
        status.textContent = label + ' copiado. Cole no seu webmail.';
      } catch {
        field.focus();
        field.select();
        status.textContent = label + ' selecionado. Use o comando Copiar do seu dispositivo.';
      }
    });
    button.hidden = false;
  }
})();

// The original links and panels remain useful when scripting is unavailable.
(() => {
  const atlas = document.querySelector('.worlds-story');
  if (!atlas) return;
  const desktop = matchMedia('(min-width:850px)');
  const nav = atlas.querySelector('.world-index');
  const tabs = [...nav.querySelectorAll('a')];
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  let selected = 0;

  function select(index) {
    selected = index;
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
  }
  function syncLocation() {
    const index = tabs.findIndex(tab => tab.hash === location.hash);
    if (index < 0) return;
    if (desktop.matches) select(index);
    else location.replace('mundos.html' + tabs[index].hash);
  }
  function activate(index) {
    select(index);
    if (location.hash !== tabs[index].hash) history.pushState(null, '', tabs[index].hash);
    tabs[index].focus({preventScroll:true});
  }
  tabs.forEach((tab, index) => {
    tab.id = 'tab-' + panels[index].id;
    tab.addEventListener('click', event => {
      if (!desktop.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activate(index);
    });
    tab.addEventListener('keydown', event => {
      if (!desktop.matches) return;
      const keys = {ArrowLeft:(index + tabs.length - 1) % tabs.length, ArrowRight:(index + 1) % tabs.length, Home:0, End:tabs.length - 1};
      if (!(event.key in keys)) return;
      event.preventDefault();
      activate(keys[event.key]);
    });
  });
  function configure() {
    atlas.classList.toggle('tabbed', desktop.matches);
    if (desktop.matches) {
      nav.setAttribute('role','tablist');
      tabs.forEach((tab, i) => {
        tab.setAttribute('role','tab');
        tab.setAttribute('aria-controls',panels[i].id);
        panels[i].setAttribute('role','tabpanel');
        panels[i].setAttribute('aria-labelledby',tab.id);
        panels[i].tabIndex = 0;
      });
      select(selected);
    } else {
      nav.removeAttribute('role');
      tabs.forEach((tab, i) => {
        for (const attr of ['role','aria-controls','aria-selected','tabindex']) tab.removeAttribute(attr);
        for (const attr of ['role','aria-labelledby','tabindex','hidden']) panels[i].removeAttribute(attr);
      });
    }
    syncLocation();
  }
  desktop.addEventListener('change',configure);
  addEventListener('hashchange',syncLocation);
  configure();
})();

(() => {
  const button = document.getElementById('expand-all');
  if (!button) return;
  const chapters = [...document.querySelectorAll('.world-chapter')];
  function refresh() {
    const allOpen = chapters.every(chapter => chapter.open);
    button.textContent = allOpen ? 'Recolher todos' : 'Expandir todos';
  }
  function openLinkedWorld() {
    const linked = chapters.find(chapter => '#' + chapter.id === location.hash);
    if (linked) linked.open = true;
  }
  button.addEventListener('click', () => {
    const open = !chapters.every(chapter => chapter.open);
    chapters.forEach(chapter => { chapter.open = open; });
    refresh();
  });
  chapters.forEach(chapter => chapter.addEventListener('toggle', refresh));
  addEventListener('hashchange', openLinkedWorld);
  openLinkedWorld();
  refresh();
  button.hidden = false;
})();
