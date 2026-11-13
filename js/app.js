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



(() => {

 const gallery=document.querySelector('.screen-gallery');

 if(!gallery) return;

 const cards=[...gallery.querySelectorAll('.screen-card')];

 const motion=matchMedia('(prefers-reduced-motion: reduce)');

 const mobile=matchMedia('(max-width:760px)');

 let frame=0,visible=false;

 function paint(){frame=0;const rect=gallery.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(innerHeight/2-rect.top-rect.height/2)/(innerHeight/2+rect.height/2)));cards.forEach((card,i)=>card.style.setProperty('--drift',motion.matches||mobile.matches?'0px':`${progress*(i%2?-18:18)}px`));}

 function update(){if(visible&&!frame) frame=requestAnimationFrame(paint);}

 if('IntersectionObserver' in window){gallery.classList.add('is-observed');new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){gallery.classList.add('is-visible');update();}},{threshold:.08}).observe(gallery);}

 else visible=true;

 addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});motion.addEventListener('change',paint);mobile.addEventListener('change',paint);paint();

})();

