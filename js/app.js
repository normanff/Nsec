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
  function paint() {
    const link = links.find(a => a === document.activeElement) || hovered || active;
    nav.classList.toggle('has-marker', Boolean(link && nav.offsetWidth));
    if (link) {
      marker.style.width = `${link.offsetWidth}px`;
      marker.style.transform = `translateX(${link.offsetLeft}px)`;
    }
  }
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
  mobileLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));
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
