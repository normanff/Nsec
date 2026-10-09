(function () {
  document.documentElement.classList.add('js-enabled');
  const menuButton = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-nav-menu');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  menuButton.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  const motionButton = document.getElementById('motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  function updateMotion() {
    const paused = manuallyPaused || reducedMotion.matches;
    document.body.classList.toggle('motion-paused', paused);
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = reducedMotion.matches ? 'Movimento reduzido' : paused ? 'Retomar movimento' : 'Pausar movimento';
  }
  motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateMotion(); });
  reducedMotion.addEventListener('change', updateMotion);
  updateMotion();
})();
